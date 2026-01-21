from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.models.user import User, UserRole
from passlib.context import CryptContext

# Setup Password Hasher (agar password aman/terenkripsi)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def seed_data():
    db: Session = SessionLocal()
    
    # Cek apakah user sudah ada? Kalau sudah, skip.
    user = db.query(User).first()
    if user:
        print("Database sudah berisi data. Skipping seeding.")
        return

    print("Sedang mengisi data dummy...")

    # Data Dummy
    users = [
        # Role Mahasiswa
        {
            "full_name": "Ahmad Faza",
            "email": "mahasiswa@uin.ac.id",
            "password": "123", # Password simpel untuk dev
            "role": UserRole.MAHASISWA,
            "identity_number": "111222333"
        },
        # Role Dosen
        {
            "full_name": "Dr. Pembimbing",
            "email": "dosen@uin.ac.id",
            "password": "123",
            "role": UserRole.DOSEN,
            "identity_number": "999888777"
        },
        # Role Kaprodi
        {
            "full_name": "Ibu Kaprodi",
            "email": "kaprodi@uin.ac.id",
            "password": "123",
            "role": UserRole.KAPRODI,
            "identity_number": "555666777"
        }
    ]

    for data in users:
        hashed_password = pwd_context.hash(data["password"])
        new_user = User(
            full_name=data["full_name"],
            email=data["email"],
            hashed_password=hashed_password,
            role=data["role"],
            identity_number=data["identity_number"]
        )
        db.add(new_user)
    
    db.commit()
    print("Berhasil! Data User (Mahasiswa, Dosen, Kaprodi) telah ditambahkan.")
    db.close()

if __name__ == "__main__":
    seed_data()