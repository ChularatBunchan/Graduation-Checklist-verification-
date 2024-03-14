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

def save_to_mongodb(data):
    try:
        client = MongoClient('mongodb+srv://admin:1234@cluster0.o78uko5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
        db = client['test']
        collection = db['files']
        result = collection.insert_one(data)
        print(f"Data inserted with id: {result.fi_transcript}")
    except Exception as e:
        print(f"Error inserting data into MongoDB: {e}")

results_to_insert = []

def check(file, student_id):
    mongodb_data = get_data_from_mongodb('test', 'english_subjects')

    if mongodb_data:
        try:
            data_to_search = mongodb_data.get('en_code')
            if data_to_search:
                extract = re.compile(f"({data_to_search[:6]})\\d*")  
                text = extract_text(file)
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
                    match = match[:4]  # Extract first 4 characters
                    if match == '0801':
                        Eng += 1
                
                print(Eng)
                print(Com)

                if matches:
                    if student_id.startswith(('57', '58', '59', '60', '61', '62', '63')):
                        if len(matches)  >= 67.5 and Eng >= 12 and Com >= 46:
                            results_to_insert.append({"student_id": student_id, "fi_transcript": "Pass"})
                        else:
                            results_to_insert.append({"student_id": student_id, "fi_transcript": "Fail"})
                    elif student_id.startswith(('64', '65', '66', '67', '68')):
                        if len(matches) >= 64 and Eng >= 12 and Com >= 46:
                            results_to_insert.append({"student_id": student_id, "fi_transcript": "Pass"})
                        else:
                            results_to_insert.append({"student_id": student_id, "fi_transcript": "Fail"})
                    else:
                        print("รหัสนักศึกษาไม่ถูกต้อง")
                else:
                    print("ไม่ผ่าน")
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

# บันทึกข้อมูลลงใน MongoDB หลังจากการวนลูปทั้งหมด
if results_to_insert:
    save_to_mongodb(results_to_insert)
