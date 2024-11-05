import re
import sys
import json
import pandas as pd
from pdfminer.high_level import extract_text
from pymongo import MongoClient
import logging

# ตั้งค่า logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

client = MongoClient('mongodb+srv://admin:1234@cluster0.o78uko5.mongodb.net/')

def get_data_from_mongodb(database_name, collection_name):
    try:
        db = client[database_name]
        collection = db[collection_name]
        data = list(collection.find())
        
        # สร้าง DataFrame จากข้อมูล MongoDB
        df = pd.DataFrame(data)
        
        logging.info(f"Original data count: {len(df)}")
        
        # ลบ whitespace และแปลงเป็นตัวพิมพ์เล็ก
        df['clean_en_code'] = df['en_code'].str.strip()
        
        # แสดงข้อมูลที่ซ้ำกัน
        duplicates = df.duplicated(subset=['clean_en_code'], keep=False)
        if duplicates.any():
            logging.info("Duplicate entries in MongoDB data:")
            # logging.info(df[duplicates][['en_code','en_name','en_section', 'en_semester']])
        
        # ลบข้อมูลที่ซ้ำกันออก
        df_unique = df.drop_duplicates(subset=['clean_en_code'], keep='first')
        
        logging.info(f"Original data count: {len(df)}")
        # logging.info(df_unique[duplicates][['en_code','en_name','en_section', 'en_semester']])
        
        logging.info(f"After removing duplicates: {len(df_unique)}")
        
        return df_unique.to_dict('records')
    except Exception as e:
        logging.error(f"Error connecting to MongoDB: {e}")
        return None

def get_files_from_mongodb(student_id):
    try:
        db = client['test']
        collection = db['files']
        file_docs = collection.find_one({'fi_id': student_id})
        if file_docs:
            return file_docs.get('fi_file', [])
        return []
    except Exception as e:
        logging.error(f"Error connecting to MongoDB: {e}")
        return []
    
def update_results_in_mongodb(student_id, result, credit):
    try:
        db = client['test']
        collection = db['files']
        
        # Update or create document with the new result and credit
        update_result = collection.update_one(
            {'fi_id': student_id},
            {'$set': {'fi_result': result, 'fi_credit': credit}},
            upsert=True
        )
        
        logging.info(f"Matched count: {update_result.matched_count}")
        logging.info(f"Modified count: {update_result.modified_count}")
        
        response = {'result': result, 'credit': credit}
        if update_result.modified_count > 0 or update_result.upserted_id:
            logging.info(f"Successfully updated fi_result and fi_credit for student_id: {student_id}")
        else:
            logging.warning(f"No modification made for student_id: {student_id}")
        
        return json.dumps(response)
    except Exception as e:
        logging.error(f"Error updating MongoDB: {e}")
        return json.dumps({'error': str(e)})

def clean_subject_code(code):
    if isinstance(code, str):
        return code.strip("[]' ")
    return 'N/A'

def clean_grade(grade):
    if isinstance(grade, str):
        return grade.strip("[]' ")
    return 'N/A'

# ฟังก์ชันตรวจสอบไฟล์ PDF
def check(file_path, student_id):
    logging.info(f"Starting check function for student ID: {student_id} with file: {file_path}")
    
    # ดึงข้อมูลวิชาจาก MongoDB
    mongodb_data = get_data_from_mongodb('test', 'english_subjects')
    
    if not mongodb_data:
        logging.error("No data found in MongoDB")
        return
    
    try:
        # อ่านข้อมูลจากไฟล์ PDF ทั้งหมด
        text = extract_text(file_path)
        subject_code = []
        subject_name = []
        grade = []
        terms= []
        years = []
        # logging.info(f"all text {text}")

        # หากข้อมูลไม่อยู่ในบรรทัดเดียว ต้องจับข้อมูลแบบแยกบรรทัด
        # ดึงข้อมูลจากไฟล์ PDF
        subject_codes = re.findall(r'\d{9}', text) 
        subject_names = re.findall(r'\d{9}\s+([A-Z\s&]+)', text, re.DOTALL)
        grades = re.findall(r'\b[ABCDF][+-]?\b|\bIp\b', text)
        cs_value = re.findall(r'CS\s*(\d+)', text)
        matches_term = re.findall(r'[ปป].*ก[าา]รศ[ึื]กษ[าา]\s*(\d+)/(\d+)', text)

        if not cs_value:
            logging.error("No CS value found in the PDF")
            return
        
        last_cs_value = cs_value[-1]
        total_credits = int(last_cs_value)
        
        terms = [term for term, _ in matches_term]
        
        # สร้าง DataFrame สำหรับ MongoDB data
        mongo_df = pd.DataFrame(mongodb_data)
        mongo_df['clean_en_code'] = mongo_df['en_code'].str.strip()
        
        # สร้าง DataFrame จากข้อมูลในไฟล์ PDF
        pdf_data = []
        for i, code in enumerate(subject_codes):
            if i < len(grades):
                grade = clean_grade(grades[i])
                name = subject_names[i] if i < len(subject_names) else 'N/A'
                pdf_data.append({
                    'code': clean_subject_code(code),
                    'name': name,
                    'grade': grade
                })
        
        pdf_df = pd.DataFrame(pdf_data)
        pdf_df['clean_code'] = pdf_df['code'].str.strip()
        
        duplicate_codes = pdf_df[pdf_df.duplicated(subset='code', keep=False)]
        if not duplicate_codes.empty:
            logging.info("Duplicate subject codes found in PDF data:")
            logging.info(duplicate_codes)
                
        # ลบข้อมูลที่ซ้ำกันและมีเกรด F, W หรือ N/A
        pdf_df = pdf_df.drop_duplicates(subset=['code'], keep='first')
        pdf_df = pdf_df[~pdf_df['grade'].isin(['F', 'W', 'Ip', 'N/A'])]
        
        # เก็บตัวแปรสำหรับตรวจสอบเงื่อนไข
        major_credits = len(pdf_df[pdf_df['clean_code'].str.startswith('0406')]) * 3
        english_credits = len(pdf_df[pdf_df['clean_code'].str.startswith('0801')]) * 3
        
        passed_project_1 = False
        passed_project_2 = False
        # ตรวจสอบรหัสวิชาเฉพาะเพื่อลดหรือเพิ่ม major_credits
        for _, row in pdf_df.iterrows():
            clean_code = row['clean_code'] # Extract first 9 characters of the subject code
            
            # ตรวจสอบเงื่อนไขในการเพิ่ม/ลด major_credits
            
            if clean_code in ['040613404', '040613141']: # Special Project I
                major_credits -= 2
                passed_project_1 = True
                logging.info(f"Found Special Project I {major_credits}")
            if clean_code in ['040613405', '040613142']:  # Special Project II
                passed_project_2 = True
            if clean_code in ['040613402', '040613132']: # COOP
                major_credits += 3
                logging.info(f"Found CO-OP 1 {major_credits}")
                
        # ตรวจสอบกับข้อมูล MongoDB
        mongodb_credits = 0
        matched_subjects = []
         
        for _, row in pdf_df.iterrows():
            clean_code = row['clean_code']
            for _, mongo_row in mongo_df.iterrows():
                if clean_code == mongo_row['clean_en_code']:
                    for term in terms:
                        if term == str(mongo_row['en_semester']).strip():
                            mongodb_credits += 3
                            matched_subjects.append({
                                'code': clean_code,
                                'name': mongo_row['en_name'],
                                'term': term
                            })
                            break
        # แสดงวิชาที่ตรงกัน
        if matched_subjects:
            logging.info("Matched subjects:")
            for subject in matched_subjects:
                logging.info(f"Code: {subject['code']}, Name: {subject['name']}, Term: {subject['term']}")
        
        major_credits -= 3
        Total_English_credits = english_credits + mongodb_credits
            
        if student_id.startswith(('57', '58', '59', '60', '61', '62', '63')):
            if total_credits >= 135 and major_credits >= 46 and english_credits >= 12 and Total_English_credits >= 67.5 and passed_project_2:
                result = []
                result.append(f"ผ่านเงื่อนไขทุกข้อ")
                result.append(f"หน่วยกิตรวม: {total_credits}, หน่วยกิตภาค (0406): {major_credits}, หน่วยกิตวิชาภาษาอังกฤษ (0801): {english_credits}, หน่วยกิตวิิชาที่สอนเป็นภาษาอังกฤษ: {Total_English_credits}")
                return print(update_results_in_mongodb(student_id,result,Total_English_credits))

            else:
                results = []
                results.append(f"หน่วยกิตรวม: {total_credits}, หน่วยกิตภาค (0406): {major_credits}, หน่วยกิตวิชาภาษาอังกฤษ (0801): {english_credits}, หน่วยกิตวิิชาที่สอนเป็นภาษาอังกฤษ: {Total_English_credits}")
                if total_credits < 135:
                    # logging.info(f"Fail: Student {student_id} has insufficient total credits (has {total_credits}, needs 135).")
                    results.append(f"ไม่ผ่าน: หน่วยกิตรวม {total_credits}/135")
                    
                if major_credits < 46:
                    # logging.info(f"Fail: Student {student_id} has insufficient major credits (has {major_credits}, needs 46).")
                    results.append(f"ไม่ผ่าน: หน่วตภาค {major_credits}/46).")
                    
                if english_credits < 12:
                    # logging.info(f"Fail: Student {student_id} has insufficient English credits (has {english_credits}, needs 12).")
                    results.append(f"ไม่ผ่าน: หน่วยกิตวิิชาภาษาอังกฤษ {english_credits}/12")
                    
                if Total_English_credits < 67.5:
                    # logging.info(f"Fail: Student {student_id} has insufficient MongoDB matched credits (has {mongodb_credits}, needs 67.5).")
                    results.append(f"ไม่ผ่าน: หน่วยกิตวิิชาที่สอนเป็นภาษาอังกฤษ {Total_English_credits}/67.5")
                if not passed_project_1:
                    results.append(f"ยังไม่ผ่าน โครงงานพิเศษ 1")
                if not passed_project_2:
                    results.append(f"ยังไม่ผ่าน โครงงานพิเศษ 2")
                result = ";\n".join(results)
                return print(update_results_in_mongodb(student_id,result,Total_English_credits))


            
        else:
            if total_credits >= 128 and major_credits >= 46 and english_credits >= 12 and Total_English_credits >= 64 and passed_project_2:
                result = []
                result.append(f"ผ่านเงื่อนไขทุกข้อ")
                result.append(f"หน่วยกิตรวม: {total_credits}, หน่วยกิตภาค (0406): {major_credits}, หน่วยกิตวิชาภาษาอังกฤษ (0801): {english_credits}, หน่วยกิตวิิชาที่สอนเป็นภาษาอังกฤษ: {Total_English_credits}")
                return print(update_results_in_mongodb(student_id,result,Total_English_credits))

            else:
                results = []
                results.append(f"หน่วยกิตรวม: {total_credits}, หน่วยกิตภาค (0406): {major_credits}, หน่วยกิตวิชาภาษาอังกฤษ (0801): {english_credits}, หน่วยกิตวิิชาที่สอนเป็นภาษาอังกฤษ: {Total_English_credits}")
                if total_credits < 128:
                    # logging.info(f"Fail: Student {student_id} has insufficient total credits (has {total_credits}, needs 128).")
                    results.append(f"ไม่ผ่าน: หน่วยกิตรวม {total_credits}/128")

                if major_credits < 46:
                    # logging.info(f"Fail: Student {student_id} has insufficient major credits (has {major_credits}, needs 46).")
                    results.append(f"ไม่ผ่าน: หน่วตภาค {major_credits}/46).")
                    
                if english_credits < 12:
                    # logging.info(f"Fail: Student {student_id} has insufficient English credits (has {english_credits}, needs 12).")
                    results.append(f"ไม่ผ่าน: หน่วยกิตวิิชาภาษาอังกฤษ {english_credits}/12")
                    
                if Total_English_credits < 64:
                    # logging.info(f"Fail: Student {student_id} has insufficient MongoDB matched credits (has {mongodb_credits}, needs 64).")
                    results.append(f"ไม่ผ่าน: หน่วยกิตวิิชาที่สอนเป็นภาษาอังกฤษ {Total_English_credits}/64")
                if not passed_project_1:
                    results.append(f"ยังไม่ผ่าน โครงงานพิเศษ 1")
                if not passed_project_2:
                    results.append(f"ยังไม่ผ่าน โครงงานพิเศษ 2")
                result = ";\n".join(results)
                
                return print(update_results_in_mongodb(student_id,result,Total_English_credits))
            
                
    except Exception as e:
        error_msg = f"Error processing PDF: {str(e)}"
        logging.error(error_msg)
      
def check_mongodb_connection():
    try:
        db = client['test']
        collection = db['files']
        
        # ลองดึงเอกสารทั้งหมด
        all_docs = list(collection.find())
        logging.info(f"Found {len(all_docs)} documents in collection")
        
        # แสดงตัวอย่างเอกสาร
        if all_docs:
            logging.info(f"Sample document: {all_docs[0]}")
        
        return True
    except Exception as e:
        logging.error(f"Error connecting to MongoDB: {e}")
        return False
        
def main():
    if len(sys.argv) != 2:
        sys.exit(1)

    student_id = sys.argv[1]
    files = get_files_from_mongodb(student_id)

    if not files:
        print(f"No files found for student ID: {student_id}")
        sys.exit(1)

    # Check only the first file
    first_file_path = files[0] if files else None

    if first_file_path and isinstance(first_file_path, str) and first_file_path.endswith('.pdf'):
        check(first_file_path, student_id)
    else:
        print(f"No valid PDF file found for student ID: {student_id}")

if __name__ == "__main__":
    main()