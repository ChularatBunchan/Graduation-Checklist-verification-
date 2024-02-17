from flask import Flask, request, jsonify
import fitz

app = Flask(__name__)

@app.route('/extract', methods=['POST'])
def extract_text():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    pdf_file = request.files['file']

    if pdf_file.filename == '':
        return jsonify({'error': 'No selected file'})

    # ดำเนินการด้วยไฟล์ PDF ที่ได้รับมา
    extracted_data = extract(pdf_file)

    # ส่งข้อมูลที่ถูกแยกออกไป
    return jsonify(extracted_data)

def extract(pdf_file):
    doc = fitz.open(pdf_file)

    courses_to_find = ["CEFR Level Achievement:"]

    extracted_data = {}

    for course_to_find in courses_to_find:
        extracted_text = ""

        for page_num in range(doc.page_count):
            page = doc[page_num]
            text = page.get_text()

            if "CEFR Level Achievement" in text:
                start_index = text.find(course_to_find)

                if start_index != -1:
                    end_index_col1 = text.find("\n", start_index)
                    extracted_text += text[end_index_col1 + 1:].strip()

        extracted_data[course_to_find] = extracted_text[:4]

    doc.close()

    return extracted_data

if __name__ == '__main__':
    app.run(port=5000)
