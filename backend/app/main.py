from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.database import engine, Base
from .models import user, document  # Import model agar dikenali SQLAlchemy
from .api.v1 import auth, documents, chat  # Import router API

# Buat tabel di database (create_all)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="ThesisGuard AI API")

# Setup CORS (Agar Frontend di port 5173 bisa bicara dengan Backend di 8000)
origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DAFTARKAN ROUTER DI SINI ---
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(documents.router, prefix="/api/documents", tags=["Documents"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat AI"])

@app.get("/")
def read_root():
    return {"message": "Sistem ThesisGuard AI Siap - Database Terkoneksi!"}

# Endpoint users (opsional, bisa dihapus/disimpan untuk cek data)
from fastapi import Depends
from sqlalchemy.orm import Session
from .core.database import get_db
from .models.user import User

@app.get("/users")
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users