from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Kita gunakan SQLite untuk MVP agar development cepat (file database akan otomatis dibuat)
SQLALCHEMY_DATABASE_URL = "sqlite:///./thesis_guard.db"
# Jika nanti pakai PostgreSQL, ganti jadi: "postgresql://user:password@localhost/dbname"

# Hapus string manual, ganti jadi variabel settings
engine = create_engine(
    settings.DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()