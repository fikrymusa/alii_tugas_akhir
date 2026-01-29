from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.core.security import verify_password, create_access_token
from app.schemas.auth_schema import LoginRequest, TokenResponse

router = APIRouter()

# Hapus parameter LoginRequest, ganti dengan OAuth2PasswordRequestForm
@router.post("/login", response_model=TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    
    # 1. Cari user berdasarkan email (di form data, field email masuk ke 'username')
    user = db.query(User).filter(User.email == form_data.username).first()
    
    # 2. Jika user tidak ada ATAU password salah
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau password salah",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
# 3. Jika benar, buatkan Token JWT
    # access_token = create_access_token(data={"sub": user.email, "role": user.role}) # Code lama mungkin error di role enum
    access_token = create_access_token(data={"sub": user.email, "role": user.role.value}) # Ambil .value dari Enum
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role.value,
        "full_name": user.full_name
    }