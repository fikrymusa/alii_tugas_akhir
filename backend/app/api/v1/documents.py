from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
import shutil
import os
from datetime import datetime

from app.core.database import get_db
from app.models.document import Document
from app.models.user import User
from app.api.deps import get_current_user
from app.services.rag_service import process_document

router = APIRouter()

# Folder tempat menyimpan file
UPLOAD_DIR = "uploaded_files"
os.makedirs(UPLOAD_DIR, exist_ok=True) # Buat folder jika belum ada

@router.post("/upload")
def upload_file(
    file: UploadFile = File(...), 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user), # <--- PERBAIKAN 1: Tambah Koma di sini
    background_tasks: BackgroundTasks = BackgroundTasks() 
):
    # 1. Validasi Tipe File (Hanya PDF)
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Hanya file PDF yang diperbolehkan.")

    # 2. Buat Nama File Unik (biar tidak tertimpa)
    # Format: NIM_Timestamp_NamaFileAsli.pdf
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    safe_filename = f"{current_user.identity_number}_{timestamp}_{file.filename}"
    file_location = os.path.join(UPLOAD_DIR, safe_filename)

    # 3. Simpan File ke Server
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 4. Simpan Metadata ke Database
    new_doc = Document(
        filename=file.filename,
        file_path=file_location,
        user_id=current_user.id
    )
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)

    # --- PERBAIKAN 2: Indentasi (Tab) dirapikan ---
    # Jalankan proses RAG di background
    background_tasks.add_task(process_document, new_doc.file_path, new_doc.id)
    
    new_doc.status = "processing"
    db.commit() # Simpan update status

    return {"info": "File uploaded successfully", "filename": new_doc.filename, "id": new_doc.id}

@router.get("/my-documents")
def get_my_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Ambil semua dokumen milik user yang sedang login
    return db.query(Document).filter(Document.user_id == current_user.id).all()