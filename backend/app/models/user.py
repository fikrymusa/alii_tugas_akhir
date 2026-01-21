from sqlalchemy import Column, Integer, String, Enum
from ..core.database import Base
import enum

# Definisi Role sesuai request Anda
class UserRole(str, enum.Enum):
    MAHASISWA = "mahasiswa"
    DOSEN = "dosen"
    KAPRODI = "kaprodi"
    FAKULTAS = "fakultas"
    LPM = "lpm"
    ALII = "alii"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    fakid = Column(Integer, nullable=True)  # Fakultas ID, bisa null untuk beberapa role
    prodid = Column(Integer, nullable=True)  # Prodi ID, bisa null untuk beberapa role
    name = Column(String)
    hashed_password = Column(String)
    role = Column(Enum(UserRole), default=UserRole.MAHASISWA)
    
    # NIP atau NIM
    identity_number = Column(String, unique=True, index=True)