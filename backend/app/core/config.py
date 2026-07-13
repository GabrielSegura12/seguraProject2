import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://segura_user:segura_pass@db:5432/segura_db")
    SECRET_KEY = "dev_secret_key_123456"  # Solo para desarrollo

settings = Settings()