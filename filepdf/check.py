import fitz
import pytesseract
from flask import Flask, request, jsonify
from pymongo import MongoClient
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

app = Flask(__name__)

uri = "mongodb+srv://admin:1234@cluster0.o78uko5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

# Connect to MongoDB
db = client['test']
collection = db['english_subjects']

@app.route('/extract', methods=['POST'])
def handle_extraction():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Open PDF file with fitz
    doc = fitz.open(file.stream)
    text = collection.en_name

    # Extract text from each page in the PDF file
    for page in doc:
        text += page.get_text()

    doc.close()

    # Use pytesseract to do OCR on the extracted text
    ocr_text = pytesseract.image_to_string(text)

    # Store the extracted text in MongoDB
    collection.insert_one({'ocr_text': ocr_text})

    # Send the OCR text back to ReactJS
    return jsonify({'ocr_text': ocr_text}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
