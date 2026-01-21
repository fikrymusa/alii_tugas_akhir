from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.database import engine, Base
from .models import user  # Pastikan model diimpor agar tabel dibuat
from .api.v1 import auth

# Buat semua tabel di database (jika belum ada)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="ThesisGuard AI API")

# Setup CORS agar Frontend (Port 5173) bisa akses Backend (Port 8000)
origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])

@app.get("/")
def read_root():
    return {"message": "Sistem RAG Tugas Akhir Siap!"}

# Endpoint users (opsional)
from fastapi import Depends
from sqlalchemy.orm import Session
from .core.database import get_db
from .models.user import User

@app.get("/users")
def get_users(db: Session = Depends(get_db)):
    # Ambil semua user dari database
    users = db.query(User).all()
    return users