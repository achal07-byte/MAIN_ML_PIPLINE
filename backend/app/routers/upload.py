from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import shutil
import uuid
from PIL import Image
from app.services.database import create_or_update_session
from app.services.pipeline_state import update_pipeline_state

router = APIRouter()
UPLOAD_DIR = "uploads"

@router.post("/")
async def upload_file(file: UploadFile = File(...)):
    file_ext = file.filename.split('.')[-1].lower()
    if file_ext not in ['csv', 'png', 'jpg', 'jpeg']:
        raise HTTPException(400, "Only CSV and image files are allowed")
    
    session_id = str(uuid.uuid4())
    safe_name = f"{session_id}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, safe_name)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # For images, generate a thumbnail preview path (optional)
    preview_path = None
    if file_ext in ['png', 'jpg', 'jpeg']:
        img = Image.open(file_path)
        preview_path = file_path.replace('.', '_thumb.')
        img.thumbnail((200, 200))
        img.save(preview_path)
    
    # Initialize session in DB immediately (don't set data_info yet to trigger EDA on first chat)
    create_or_update_session(session_id, file.filename, file_path, "eda")

    return {
        "session_id": session_id,
        "file_path": file_path,
        "filename": file.filename,
        "file_type": "image" if file_ext != 'csv' else "csv",
        "preview_path": preview_path
    }