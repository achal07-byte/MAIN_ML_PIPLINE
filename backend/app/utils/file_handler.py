import os
import shutil
import uuid
from pathlib import Path

UPLOAD_DIR = Path("uploads")
EXPORT_DIR = Path("exports")

def ensure_directories():
    UPLOAD_DIR.mkdir(exist_ok=True)
    EXPORT_DIR.mkdir(exist_ok=True)

def save_upload_file(file, filename: str) -> str:
    ensure_directories()
    ext = filename.split('.')[-1].lower()
    unique_name = f"{uuid.uuid4()}_{filename}"
    file_path = UPLOAD_DIR / unique_name
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return str(file_path)

def delete_file(file_path: str):
    if os.path.exists(file_path):
        os.remove(file_path)