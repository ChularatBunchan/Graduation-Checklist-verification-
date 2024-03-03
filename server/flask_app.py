from flask import Flask, request, jsonify
from extract import extract

app = Flask(__name__)

@app.route('/extract', methods=['POST'])
def handle_extraction():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    extracted_data = extract(file)

    return jsonify(extracted_data), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)