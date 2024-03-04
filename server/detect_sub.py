import fitz  # import PyMuPDF
import os

def extract(pdf_path):
    doc = fitz.open(pdf_path)
    courses_to_find = ["COMPUTER NETWORKS", "FUNDAMENTAL OF COMPUTER SCIENCE AND PROFESSIONAL ISSUES", "DATA STRUCTURE AND ALGORITHM", "DATABASE SYSTEMS"]

    for course_to_find in courses_to_find:
        extracted_text = ""
        for page_num in range(doc.page_count):
            page = doc[page_num]
            text = page.get_text()
            if "RECORD NO" in text:
                start_index = text.find(course_to_find)
                if start_index != -1:
                    end_index_col1 = text.find("\n", start_index)
                    extracted_text += text[end_index_col1 + 1:].strip()
        print(f"{course_to_find}: {extracted_text[:4]}")
    doc.close()

pdf_path = '/files/1709547170349A00.pdf'
extract(pdf_path)
