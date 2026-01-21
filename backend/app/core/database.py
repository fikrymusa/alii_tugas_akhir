from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Kita gunakan SQLite untuk MVP agar development cepat (file database akan otomatis dibuat)
SQLALCHEMY_DATABASE_URL = "sqlite:///./thesis_guard.db"
# Jika nanti pakai PostgreSQL, ganti jadi: "postgresql://user:password@localhost/dbname"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False} # Khusus untuk SQLite
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency untuk mendapatkan koneksi DB di setiap request API
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()