import fitz
import pymongo
from pymongo import MongoClient

def extract(pdf_path):
    client = MongoClient('mongodb://localhost:27017/')
    db = client['db_name']
    collection = db['collection_name']

    doc = fitz.open(pdf_path)
    courses_to_find = ["EMBEDDED SYSTEM DESIGN", "OBJECT-ORIENTED PROGRAMMING", "DIGITAL CIRCUIT DESIGN"]

    for course_to_find in courses_to_find:
        extracted_text = ""

        for page_num in range(doc.page_count):
            page = doc[page_num]
            text = page.get_text()

            if "ขอรับรอง" in text:
                start_index = text.find(course_to_find)

                if start_index != -1:
                    end_index_col1 = text.find("\n", start_index)
                    extracted_text += text[end_index_col1 + 1:].strip()

        print(f"{course_to_find}: {extracted_text[:4]}")

        # บันทึกข้อมูลลงใน MongoDB
        data = {"course": course_to_find, "extracted_text": extracted_text[:4]}
        collection.insert_one(data)

    doc.close()
    client.close()

pdf_path = 'ใบตรวจปริญญานิพนธ์CSB.pdf'
extract(pdf_path)
