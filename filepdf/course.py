from PIL import Image
import pytesseract

def extract_text_from_pdf(pdf_path):
    images = convert_pdf_to_images(pdf_path)
    text = ''

    for img in images:
        text += pytesseract.image_to_string(img)

    return text

def convert_pdf_to_images(pdf_path):
    images = []
    with Image.open(pdf_path) as pdf:
        for i in range(pdf.n_pages):
            pdf.seek(i)
            images.append(pdf.convert('RGB'))

    return images
