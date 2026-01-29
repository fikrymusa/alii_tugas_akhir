from pydantic_settings import BaseSettings
import os # Tambahkan import os (opsional, tapi bagus untuk debug)

class Settings(BaseSettings):
    PROJECT_NAME: str = "ThesisGuard AI"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = "sqlite:///./thesis_guard.db"
    
    # Keamanan
    # (Di production nanti, SECRET_KEY juga sebaiknya dipindah ke .env)
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    # --- PERBAIKAN DI SINI ---
    # Jangan tulis key di sini! Cukup definisikan tipe datanya saja.
    # Pydantic akan otomatis mencarinya di file .env
    GEMINI_API_KEY: str 

    class Config:
        env_file = ".env"
        # Tambahan agar dia membaca file .env meskipun huruf besar/kecil
        case_sensitive = True 

settings = Settings()