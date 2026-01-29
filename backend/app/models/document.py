from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from ..core.database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)      # Nama file asli (misal: Skripsi_Bab1.pdf)
    file_path = Column(String)     # Lokasi di server (uploads/Skripsi_Bab1.pdf)
    upload_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="pending") # pending, analyzed
    
    # Relasi ke User (Mahasiswa yang upload)
    user_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="documents")

# Tambahkan baris ini di User Model nanti (opsional, biar relasi dua arah)
# User.documents = relationship("Document", back_populates="owner")