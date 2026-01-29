from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.database import get_db
from app.models.document import Document
from app.api.deps import get_current_user
from app.services.rag_service import search_document

router = APIRouter()

# Schema untuk request pertanyaan
class ChatRequest(BaseModel):
    document_id: int
    question: str

@router.post("/ask")
def ask_document(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # 1. Pastikan dokumen itu milik user yang sedang login (Keamanan)
    doc = db.query(Document).filter(Document.id == request.document_id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Dokumen tidak ditemukan atau bukan milik Anda.")
    
    # 2. Cari Jawaban
    result = search_document(doc.id, request.question)
    
    return result