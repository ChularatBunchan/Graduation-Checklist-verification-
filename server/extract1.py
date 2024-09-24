import re
from pdfminer.high_level import extract_text
from pymongo import MongoClient
import sys
import logging

# ตั้งค่า logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

client = MongoClient('mongodb+srv://admin:1234@cluster0.o78uko5.mongodb.net/')

def get_data_from_mongodb(database_name, collection_name):
    try:
        db = client[database_name]
        collection = db[collection_name]
        data = collection.find_one()
        return data
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

# ฟังก์ชันบันทึกผลลัพธ์ไปที่ MongoDB
def update_results_in_mongodb(student_id, result):
    try:
        db = client['test']
        collection = db['files']

        # Check if the document exists before updating
        document = collection.find_one({'fi_id': student_id})
        if document:
            logging.info(f"Document found for student_id: {student_id} -> {document}")
        else:
            logging.info(f"No document found for student_id: {student_id}")

        # Perform the update
        update_result = collection.update_one(
            {'fi_id': student_id},
            {'$set': {'fi_result': result}}
        )
        logging.info(f"Updated fi_result for student_id: {student_id}, matched_count: {update_result.matched_count}, modified_count: {update_result.modified_count}")

        # Check if the document was updated
        if update_result.modified_count == 0:
            logging.info(f"No documents were updated for student_id: {student_id}")
        else:
            logging.info(f"Document updated successfully for student_id: {student_id}")

    except Exception as e:
        logging.error(f"Error updating MongoDB: {e}")

# ฟังก์ชันตรวจสอบไฟล์ PDF
def check(file_path, student_id):
    student_id = student_id.strip().replace("s", "")
    mongodb_data = get_data_from_mongodb('test', 'english_subjects')
    
    if mongodb_data:
        try:
            data_to_search = mongodb_data.get('en_name')  # ตรวจสอบว่ามีค่านี้ใน MongoDB
            if data_to_search:
                extract = re.compile(f"({data_to_search[:9]})\\d*")  
                text = extract_text(file_path)
                matches = extract.findall(text)

                Eng = 3
                Com = 3 
                
                for match in matches:
                    match = match[:6]
                    if match == '040613':
                        if matches.count(match) > 1:
                            again = 3
                        else:
                            again = 0
                        Com += again
                
                for match in text.split():
                    match = match[:4]
                    if match == '0801':
                        Eng += 1
                
                if matches:
                    if student_id.startswith(('57', '58', '59', '60', '61', '62', '63')):
                        if len(matches) >= 67.5 and Eng >= 12 and Com >= 46:
                            update_results_in_mongodb(student_id, "Pass: หน่วยกิตรายวิชาภาษาอังกฤษครบ")
                        else:
                            update_results_in_mongodb(student_id, "Fail: หน่วยกิตรายวิชาภาษาอังกฤษไม่ครบ")
                    elif student_id.startswith(('64', '65', '66', '67', '68')):
                        if len(matches) >= 64 and Eng >= 12 and Com >= 46:
                            update_results_in_mongodb(student_id, "Pass: หน่วยกิตรายวิชาภาษาอังกฤษครบ")
                        else:
                            update_results_in_mongodb(student_id, "Fail: หน่วยกิตรายวิชาภาษาอังกฤษไม่ครบ")
                    else:
                        update_results_in_mongodb(student_id,"Invalid student ID")
                else:
                    update_results_in_mongodb(student_id,"No matches found")
                    
                # matches2 = extract.findall(text)
                # if matches2 == 'ผ่านการฝึกงาน':
                #     update_results_in_mongodb(student_id, "Pass: ผ่านการฝึกงาน")
                # if matches2 == 'ผ่านการฝึกงาน':
                    
            else:
                update_results_in_mongodb(student_id,"Field 'en_name' not found in MongoDB data")
        except Exception as e:
            update_results_in_mongodb(student_id,f"Error processing PDF or regular expression: {e}")
    else:
        update_results_in_mongodb(student_id,"Failed to retrieve data from MongoDB")

# ฟังก์ชันหลัก
def main():
    if len(sys.argv) != 2:
        # print("Usage: python script.py <student_id>")
        sys.exit(1)

    student_id = sys.argv[1]
    files = get_files_from_mongodb(student_id)
    # print(student_id)

    if not files:
        print(f"No files found for student ID: {student_id}")
        sys.exit(1)

    for file_path in files:
        if file_path and isinstance(file_path, str) and file_path.endswith('.pdf'):
            check(file_path, student_id)
        else:
            print(f"Invalid file path or not a PDF: {file_path}")

if __name__ == "__main__":
    main()
