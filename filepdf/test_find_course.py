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

    courses_to_find = ["COMPUTER NETWORKS", "FUNDAMENTAL OF COMPUTER SCIENCE AND PROFESSIONAL ISSUES", "DATA STRUCTURE AND ALGORITHM" , "DATABASE SYSTEMS"]
    extracted_texts = {}

    with fitz.open(pdf_file) as doc:
        for course_to_find in courses_to_find:
            extracted_text = ""

            for page_num in range(doc.page_count):
                page = doc[page_num]
                text = page.get_text()

                if "COURSE NO." in text:
                    start_index = text.find(course_to_find)

                    if start_index != -1:
                        end_index_col1 = text.find("\n", start_index)
                        extracted_text += text[end_index_col1 + 1:].strip()

            extracted_texts[course_to_find] = extracted_text[:4]

    return jsonify(extracted_texts)

if __name__ == '__main__':
    app.run(port=5000)
