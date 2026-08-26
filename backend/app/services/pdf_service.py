import os
import re
from pypdf import PdfReader # type: ignore

def parse_pdf_resume(file_path: str) -> dict:
    extracted_text = ""
    try:
        if os.path.exists(file_path):
            reader = PdfReader(file_path)
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    extracted_text += text + "\n"
    except Exception as e:
        print(f"Error parsing PDF: {e}")
        
    # Regex to find Email
    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', extracted_text)
    
    # Regex to find Phone number
    phone_match = re.search(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', extracted_text)
    
    return {
        "summary": extracted_text.strip() if extracted_text else "Imported from uploaded PDF file.",
        "email": email_match.group(0) if email_match else "",
        "phone": phone_match.group(0) if phone_match else "",
    }