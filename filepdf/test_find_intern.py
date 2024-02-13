import fitz 

def extract(pdf_path):
    doc = fitz.open(pdf_path)

    courses_to_find = ["นักศึกษาได้ผ่านการฝึกงานภาคสนามตามหลักสูตรที่กำหนด"]

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

        # print(f"{course_to_find}: {extracted_text[:4]}")
        print("ผ่านการฝึกงานฉแล้ว")

    doc.close()

pdf_path = '243จุฬารัตน์_6304062616072.pdf'

extract(pdf_path)


