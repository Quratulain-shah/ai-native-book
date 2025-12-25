from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from ..src.main import app
from ..src.database import Base, get_db
from ..src import models

# Use a SQLite in-memory database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db" # In-memory DB or file for tests

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override the get_db dependency for tests
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

# Setup test database
def setup_test_db():
    Base.metadata.drop_all(bind=engine) # Start with a clean slate
    Base.metadata.create_all(bind=engine)
    
# Run setup before each test
def setup():
    setup_test_db()

# Test cases
def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {
        "message": "RAG Chatbot API is running!",
        "openai_available": False, # Assuming no OpenAI key in test env
        "qdrant_available": False, # Assuming no Qdrant setup in test env
        "database_available": True
    }

def test_google_login_initiate():
    # This test will be more complex as it involves external redirect
    # For now, a basic check that it returns a redirect URL or similar
    response = client.post("/auth/google/login")
    assert response.status_code == 200
    # Add more assertions based on the expected response from auth_service.google_login_initiate
    # For example: assert "url" in response.json() or "redirect" in response.json()

# def test_google_login_callback(): # Needs a mock for Google and Better Auth API calls
#     pass

# def test_create_book(): # Needs authentication
#     pass

# def test_get_book(): # Needs a book to be created
#     pass

# def test_update_book_content(): # Needs authentication and a book
#     pass

# def test_translate_book(): # Needs authentication and a book, and mock for translation service
#     pass
