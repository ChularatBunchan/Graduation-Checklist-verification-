import fitz
import pytesseract
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/extract', methods=['POST'])
def handle_extraction():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # ใช้ fitz เพื่อเปิดไฟล์ PDF
    doc = fitz.open(file.stream)
    text = ''

    # ดึงข้อความจากทุกหน้าในไฟล์ PDF
    for page in doc:
        text += page.get_text()

    doc.close()

    # ใช้ pytesseract ในการทำ OCR บนข้อความที่ได้
    ocr_text = pytesseract.image_to_string(text)

    # ส่งข้อมูลที่ได้จาก OCR กลับไปยัง ReactJS
    return jsonify({'ocr_text': ocr_text}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
