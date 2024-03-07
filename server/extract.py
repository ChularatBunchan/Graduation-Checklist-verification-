import re
from pdfminer.high_level import extract_text
from pymongo import MongoClient
import os

# เปลื่ยนชื่อไฟล์ เช็คชื่อไฟล์กับ st_id  ตรงกันค่อย check 

def get_data_from_mongodb(database_name, collection_name):
    try:
        # Connect to MongoDB using IP address directly
        client = MongoClient('mongodb+srv://admin:1234@cluster0.o78uko5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
        
        db = client[database_name]
        collection = db[collection_name]

        # Query MongoDB for relevant data
        data = collection.find_one()
        
        return data
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        return None

def check(file, student_id):
    # Get data from MongoDB
    mongodb_data = get_data_from_mongodb('test', 'english_subjects')

    if mongodb_data:
        try:
            # Get the value from MongoDB data to use in regular expression
            data_to_search = mongodb_data.get('en_code')  

            if data_to_search:
                # Construct regular expression pattern
                extract = re.compile(data_to_search)

                # Extract text from PDF file
                text = extract_text(file)

                # Find matches in the text
                matches = extract.findall(text)

                # Check if there are any matches
                if matches:
                    # Check student ID prefix to determine credit criteria
                    if student_id[:2].startswith(('57', '58', '59', '60', '61', '62', '63')):
                        if len(matches) >= 135/2:
                            print(f"ผ่านแล้ว: {file}")
                        else:
                            print(f"ไม่ผ่าน: {file}")
                    elif student_id.startswith(('64', '65', '66', '67', '68')):
                        if len(matches) >= 128/2:
                            print(f"ผ่านแล้ว: {file}")
                        else:
                            print(f"ไม่ผ่าน: {file}")
                    else:
                        print("รหัสนักศึกษาไม่ถูกต้อง")
                else:
                    print(f"ไม่ผ่าน: {file}")
            else:
                print("Field 'eng_code' not found in MongoDB data")
        except Exception as e:
            print(f"Error processing PDF or regular expression: {e}")
    else:
        print("ไม่สามารถเชื่อมต่อ MongoDB ได้")

# Function to check all files in the directory
def check_all_files(directory, student_id):
    

    # List all files in the directory
    files = os.listdir(directory)
    
    # Iterate through each file
    for file in files:
        # Check if the file is a PDF
        if file.endswith('.pdf'):
            # Call the check function for the current file
            check(os.path.join(directory, file), student_id)

mongodb_data_stu = get_data_from_mongodb('test', 'files')
data_to_search_stu = mongodb_data_stu.get('st_id')  
# Call the function to check all files in the directory
check_all_files("./file", data_to_search_stu)
