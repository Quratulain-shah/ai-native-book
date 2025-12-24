import requests
import json
import sqlite3
import os

def seed_db(path):
    print(f"Seeding {path}...")
    try:
        conn = sqlite3.connect(path)
        cursor = conn.cursor()
        
        # Check if user 1 exists
        cursor.execute("SELECT id FROM users WHERE id = 1")
        user = cursor.fetchone()
        
        if not user:
            print(f"Seeding user 1 in {path}...")
            cursor.execute("""
                INSERT INTO users (id, email, name, provider, provider_id, created_at, updated_at)
                VALUES (1, 'test@example.com', 'Test User', 'google', '123456789', datetime('now'), datetime('now'))
            """)
            conn.commit()
            print(f"User 1 seeded in {path}.")
        else:
            print(f"User 1 already exists in {path}.")
        
        conn.close()
    except Exception as e:
        print(f"Failed to seed {path}: {e}")

def seed_user():
    # Seed both potential locations
    seed_db("test.db")
    seed_db(os.path.join("backend", "test.db"))

def test_translation():
    seed_user()
    
    # First create a book to translate
    book_data = {
        "title": "Test Book for Translation",
        "content": "Hello world. This is a test book."
    }
    
    # Create book
    print("Creating book...")
    try:
        response = requests.post("http://localhost:8000/books", json=book_data)
        if response.status_code != 200:
            print(f"Failed to create book: {repr(response.text)}")
            return
        
        book = response.json()
        book_id = book['id']
        print(f"Book created with ID: {book_id}")
        
        # Translate book
        print(f"Translating book {book_id}...")
        translate_response = requests.post(f"http://localhost:8000/books/{book_id}/translate")
        
        if translate_response.status_code == 200:
            translated_book = translate_response.json()
            print("Translation successful!")
            print(f"Original: {book_data['content']}")
            print(f"Translated: {translated_book['content']}")
        else:
            print(f"Translation failed: {translate_response.text}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_translation()
