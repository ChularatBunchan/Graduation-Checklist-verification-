import re
import sys
import json
import pandas as pd
from pdfminer.high_level import extract_text
from pymongo import MongoClient
import logging
import fitz
from tika import parser
import PyPDF2

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
                
        return df.to_dict('records')
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
        
        # logging.info(f"Matched count: {update_result.matched_count}")
        # logging.info(f"Modified count: {update_result.modified_count}")
        
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

def extract_text_with_pymupdf(file_path):
    try:
        # เปิดไฟล์ PDF
        document = fitz.open(file_path)
        text = ""
        
        # อ่านข้อความจากทุกหน้าของ PDF
        for page_num in range(len(document)):
            page = document[page_num]
            text += page.get_text()
        
        document.close()
        return text
    except Exception as e:
        logging.error(f"Error reading PDF file with PyMuPDF: {str(e)}")
        return ""

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
        text2 = extract_text(file_path)
        text = extract_text_with_pymupdf(file_path)

        # logging.info(f"all text {text}")
        
        # หารหัสวิชา
        subject_codes = re.findall(r'(\d{9})', text)
        
        # หาชื่อวิชา
        subject_names = re.findall(r'\d{9}\s+([A-Z\s&]+)', text, re.DOTALL)
        
        # หาตอนเรียน
        sections = re.findall(r'\d{9}\s+[A-Z-\s&]+(\d+)', text)
        
        # หาหน่วยกิต
        credits = re.findall(r'\d{9}\s+[A-Z-\s&]+\s+\d+\s+(\d+)', text)
        
        # หาเกรด
        grades = re.findall(r'\b[ABCDF][+-]?\b|\bIp\b', text)
        cs_value = re.findall(r'CS\s*(\d+)', text2)
        matches_year_term = re.findall(r'ปีการศึกษา\s*(\d)/(\d+)', text)   
        
        print(f"รหัสวิชา (subject_codes): {len(subject_codes)}")
        print(f"ชื่อวิชา (subject_names): {len(subject_names)}")
        print(f"ตอนเรียน (sections): {len(sections)}")
        print(f"หน่วยกิต (credits): {len(credits)}")
        print(f"เกรด (grades): {len(grades)}")     
        
        english_credits = 0 
        major_credits = 0 
        passed_project_1 = False
        passed_project_2 = False
        min_length = min(len(subject_codes), len(subject_names), len(sections), len(credits), len(grades))
        subject_data = []
        for i in range(min_length):
            try:
                # Convert credit to integer safely
                credit_value = int(credits[i]) if credits[i].isdigit() else 0
                
                subject_info = {
                    "subject_code": subject_codes[i],
                    "subject_name": subject_names[i].strip(),
                    "section": sections[i],
                    "credit": credit_value,
                    "grade": grades[i]
                }
                
                # ตรวจสอบเกรด หากเป็น F, W, Ip หรือ N/A ให้ข้ามการคำนวณ
                if subject_info["grade"] in ['F', 'W', 'Ip', 'N/A']:
                    continue
                
                subject_data.append(subject_info)
                # Increment credits based on subject code
                if subject_info["subject_code"].startswith("0801"):
                    english_credits += credit_value
                if subject_info["subject_code"].startswith("0406"):
                    major_credits += credit_value
                if subject_info["subject_code"] in ('040613404', '040613141'):  # Special Project
                    passed_project_1 = True
                if subject_info["subject_code"] in ('040613405', '040613142'):  # Special Project II
                    passed_project_2 = True

            except IndexError:
                logging.error(f"IndexError: List index out of range at index {i}")
                continue
            except ValueError:
                logging.error(f"ValueError: Unable to convert credit to integer at index {i}")
                continue

        # แสดงผลข้อมูลที่ดึงออกมา
        for subject in subject_data:
            print(subject)

        pdf_df = pd.DataFrame(subject_data)
        print(pdf_df)
           
        if not cs_value:
            logging.error("No CS value found in the PDF")
            return
        
        last_cs_value = cs_value[-1]
        total_credits = int(last_cs_value)
        print(f"cs value" ,last_cs_value)
        
        terms = [term for term, _ in matches_year_term]
        years = [year for _,year in matches_year_term]
        
        # สร้าง DataFrame สำหรับ MongoDB data
        mongo_df = pd.DataFrame(mongodb_data)
                
       # ตรวจสอบกับข้อมูล MongoDB
        mongodb_credits = 0
        matched_subjects = []

        for _, row in pdf_df.iterrows():
            subject_code = row['subject_code']
            subject_name = row['subject_name']
            section = row['section']
            credit = int(row['credit'])
            grade = row['grade']

            for _, mongo_row in mongo_df.iterrows():
                # ตรวจสอบว่า en_code, en_name, en_section, en_year, en_semester ตรงกับข้อมูล PDF หรือไม่
                if (
                    subject_code == mongo_row['en_code'] and
                    subject_name == mongo_row['en_name'] and
                    section == mongo_row['en_section'] and
                    str(mongo_row['en_year']).strip() in years and
                    str(mongo_row['en_semester']).strip() in terms
                ):
                    # เพิ่มจำนวนหน่วยกิตจาก MongoDB
                    mongodb_credits += credit
                    
                    # เก็บข้อมูลวิชาที่ตรงกัน
                    matched_subjects.append({
                        'code': subject_code,
                        'name': subject_name,
                        'section': section,
                        'credit': credit,
                        'term': mongo_row['en_semester'],
                        'year': mongo_row['en_year']
                    })
                    break

        # แสดงวิชาที่ตรงกัน
        if matched_subjects:
            logging.info("Matched subjects:")
            for subject in matched_subjects:
                logging.info(f"Code: {subject['code']}, Name: {subject['name']}, Section: {subject['section']}, Credit: {subject['credit']}, Term: {subject['term']}, Year: {subject['year']}")

        # คำนวณหน่วยกิตภาษาอังกฤษทั้งหมด
        Total_English_credits = english_credits + mongodb_credits
        print(f"Total_English_credits {Total_English_credits}")
        print(f"english_credits {english_credits}")
        print(f"mongodb_credits {mongodb_credits}")
        logging.info(f"หน่วยกิตรวม: {total_credits}, หน่วยกิตภาค (0406): {major_credits}, หน่วยกิตวิชาภาษาอังกฤษ (0801): {english_credits}, หน่วยกิตวิิชาที่สอนเป็นภาษาอังกฤษ: {Total_English_credits}")
        
        if student_id.startswith(('57', '58', '59', '60', '61', '62', '63')):
            if total_credits >= 135 and major_credits >= 46 and english_credits >= 12 and Total_English_credits >= 67.5 and passed_project_2:
                logging.info(f"หน่วยกิตรวม: {total_credits}, หน่วยกิตภาค (0406): {major_credits}, หน่วยกิตวิชาภาษาอังกฤษ (0801): {english_credits}, หน่วยกิตวิิชาที่สอนเป็นภาษาอังกฤษ: {Total_English_credits}")
                result = []
                # result.append(f"ผ่านเงื่อนไขทุกข้อ")
                # result.append(f"หน่วยกิตรวม: {total_credits}, หน่วยกิตภาค (0406): {major_credits}, หน่วยกิตวิชาภาษาอังกฤษ (0801): {english_credits}, หน่วยกิตวิิชาที่สอนเป็นภาษาอังกฤษ: {Total_English_credits}")
                # return print(update_results_in_mongodb(student_id,result,Total_English_credits))

            else:
                results = []
                results.append(f"หน่วยกิตรวม: {total_credits}, หน่วยกิตภาค (0406): {major_credits}, หน่วยกิตวิชาภาษาอังกฤษ (0801): {english_credits}, หน่วยกิตวิิชาที่สอนเป็นภาษาอังกฤษ: {Total_English_credits}")
                if total_credits < 135:
                    logging.info(f"Fail: Student {student_id} has insufficient total credits (has {total_credits}, needs 135).")
                    # results.append(f"ไม่ผ่าน: หน่วยกิตรวม {total_credits}/135")
                    
                if major_credits < 46:
                    logging.info(f"Fail: Student {student_id} has insufficient major credits (has {major_credits}, needs 46).")
                    # results.append(f"ไม่ผ่าน: หน่วตภาค {major_credits}/46).")
                    
                if english_credits < 12:
                    logging.info(f"Fail: Student {student_id} has insufficient English credits (has {english_credits}, needs 12).")
                    # results.append(f"ไม่ผ่าน: หน่วยกิตวิิชาภาษาอังกฤษ {english_credits}/12")
                    
                if Total_English_credits < 67.5:
                    logging.info(f"Fail: Student {student_id} has insufficient MongoDB matched credits (has {Total_English_credits}, needs 67.5).")
                    # results.append(f"ไม่ผ่าน: หน่วยกิตวิิชาที่สอนเป็นภาษาอังกฤษ {Total_English_credits}/67.5")
                if not passed_project_1:
                    logging.info(f"ยังไม่ผ่าน โครงงานพิเศษ 1")
                    # results.append(f"ยังไม่ผ่าน โครงงานพิเศษ 1")
                if not passed_project_2:
                    logging.info(f"ยังไม่ผ่าน โครงงานพิเศษ 2")
                    # results.append(f"ยังไม่ผ่าน โครงงานพิเศษ 2")
                # result = ";\n".join(results)
                # return print(update_results_in_mongodb(student_id,result,Total_English_credits))


            
        else:
            if total_credits >= 128 and major_credits >= 46 and english_credits >= 12 and Total_English_credits >= 64 and passed_project_2:
                result = []
                # result.append(f"ผ่านเงื่อนไขทุกข้อ")
                logging.info(f"หน่วยกิตรวม: {total_credits}, หน่วยกิตภาค (0406): {major_credits}, หน่วยกิตวิชาภาษาอังกฤษ (0801): {english_credits}, หน่วยกิตวิิชาที่สอนเป็นภาษาอังกฤษ: {Total_English_credits}")
                # result.append(f"หน่วยกิตรวม: {total_credits}, หน่วยกิตภาค (0406): {major_credits}, หน่วยกิตวิชาภาษาอังกฤษ (0801): {english_credits}, หน่วยกิตวิิชาที่สอนเป็นภาษาอังกฤษ: {Total_English_credits}")
                # return print(update_results_in_mongodb(student_id,result,Total_English_credits))

            else:
                results = []
                results.append(f"หน่วยกิตรวม: {total_credits}, หน่วยกิตภาค (0406): {major_credits}, หน่วยกิตวิชาภาษาอังกฤษ (0801): {english_credits}, หน่วยกิตวิิชาที่สอนเป็นภาษาอังกฤษ: {Total_English_credits}")
                if total_credits < 128:
                    logging.info(f"Fail: Student {student_id} has insufficient total credits (has {total_credits}, needs 128).")
                    # results.append(f"ไม่ผ่าน: หน่วยกิตรวม {total_credits}/128")

                if major_credits < 46:
                    logging.info(f"Fail: Student {student_id} has insufficient major credits (has {major_credits}, needs 46).")
                    # results.append(f"ไม่ผ่าน: หน่วตภาค {major_credits}/46).")
                    
                if english_credits < 12:
                    logging.info(f"Fail: Student {student_id} has insufficient English credits (has {english_credits}, needs 12).")
                    # results.append(f"ไม่ผ่าน: หน่วยกิตวิิชาภาษาอังกฤษ {english_credits}/12")
                    
                if Total_English_credits < 64:
                    logging.info(f"Fail: Student {student_id} has insufficient MongoDB matched credits (has {Total_English_credits}, needs 64).")
                    # results.append(f"ไม่ผ่าน: หน่วยกิตวิิชาที่สอนเป็นภาษาอังกฤษ {Total_English_credits}/64")
                if not passed_project_1:
                    logging.info(f"ยังไม่ผ่าน โครงงานพิเศษ 1")
                    # results.append(f"ยังไม่ผ่าน โครงงานพิเศษ 1")
                if not passed_project_2:
                    logging.info(f"ยังไม่ผ่าน โครงงานพิเศษ 2")
                    # results.append(f"ยังไม่ผ่าน โครงงานพิเศษ 2")
                result = ";\n".join(results)
                
                # return print(update_results_in_mongodb(student_id,result,Total_English_credits))
            
                
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
    # student_id = '6304062616072'
    # file_path = 'test2.pdf'    
    # student_id = '6204062660048'
    # file_path = 'csb-nohead.pdf'
    student_id = '6404062663231'
    file_path = 'csb64.pdf'
    
    if file_path and isinstance(file_path, str) and file_path.endswith('.pdf'):
        check(file_path,student_id)
    else:
        logging.error(f"Invalid file path: {file_path}")

if __name__ == "__main__":
    main()