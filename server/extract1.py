import re
from pdfminer.high_level import extract_text
from pymongo import MongoClient
import os

def get_data_from_mongodb(database_name, collection_name):
    try:
        client = MongoClient('mongodb+srv://admin:1234@cluster0.o78uko5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
        db = client[database_name]
        collection = db[collection_name]
        data = collection.find_one()
        return data
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        return None

def check(file, student_id):
    mongodb_data = get_data_from_mongodb('test', 'english_subjects')

    if mongodb_data:
        try:
            data_to_search = mongodb_data.get('en_code')
            if data_to_search:
                extract = re.compile(f"({data_to_search[:4]})\\d*")  
                text = extract_text(file)
                matches = extract.findall(text)

                Eng = 0
                Com = 0 
                for match in matches:
                    match = match[:4]  # Extract first 4 characters
                    if match == '0406':
                        Com += 1
                for match in text.split():
                    match = match[:4]  # Extract first 4 characters
                    if match == '0801':
                        Eng += 1

                Eng *= 3 
                Com *= 3
                
                print(Eng)
                print(Com)

                if matches:
                    if student_id.startswith(('57', '58', '59', '60', '61', '62', '63')):
                        if len(matches) * 3 >= 67.5 and Eng >= 12 and Com >= 46:
                            print(f"ผ่านแล้ว: {file}") 
                        else:
                            print(f"ไม่ผ่าน: {file}")
                    elif student_id.startswith(('64', '65', '66', '67', '68')):
                        if len(matches) >= 64 and Eng >= 12 and Com >= 46:
                            print(f"ผ่านแล้ว: {file}")
                        else:
                            print(f"ไม่ผ่าน: {file}")
                    else:
                        print("รหัสนักศึกษาไม่ถูกต้อง")
                else:
                    print(f"ไม่ผ่าน: {file}")
            else:
                print("Field 'en_code' not found in MongoDB data")
        except Exception as e:
            print(f"Error processing PDF or regular expression: {e}")
    else:
        print("ไม่สามารถเชื่อมต่อ MongoDB ได้")

def check_all_files(directory, student_id):
    files = os.listdir(directory)
    
    for file in files:
        if file.endswith('.pdf'):
            check(os.path.join(directory, file), student_id)

mongodb_data_stu = get_data_from_mongodb('test', 'files')
data_to_search_stu = mongodb_data_stu.get('st_id')

check_all_files("./file", data_to_search_stu)
