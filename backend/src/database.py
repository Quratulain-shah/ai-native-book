from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from pathlib import Path
from dotenv import load_dotenv
from .models import Base

# Load environment variables
load_dotenv()

# Calculate absolute path to backend/test.db
# __file__ is backend/src/database.py
# parent is backend/src
# parent.parent is backend
BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "test.db"

# Make DATABASE_URL optional - use SQLite in-memory if not provided
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    # Use absolute path to ensure we hit the correct file regardless of CWD
    DATABASE_URL = f"sqlite:///{DB_PATH}"

print(f"--- Database Configuration ---")
print(f"Using Database URL: {DATABASE_URL}")
print(f"Absolute DB Path: {DB_PATH}")
print(f"DB File Exists: {DB_PATH.exists()}")
print(f"------------------------------")

try:
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    database_available = True
except Exception as e:
    print(f"Database connection failed: {e}")
    print("Running without database support")
    engine = None
    SessionLocal = None
    database_available = False

def get_db():
    if not database_available:
        return None
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
