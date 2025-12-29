from sqlalchemy.orm import Session
from .. import models, schemas
import datetime # Import datetime
from qdrant_client.models import PointStruct
from typing import List

def create_book(db: Session, book: schemas.BookCreate, user_id: int, qdrant_service=None, gemini_service=None):
    """
    Create a book and optionally generate embeddings for Qdrant.

    Args:
        db: Database session
        book: Book data
        user_id: Author ID
        qdrant_service: Optional QdrantService instance for storing embeddings
        gemini_service: Optional GeminiService for generating embeddings
    """
    db_book = models.Book(
        title=book.title,
        author_id=user_id,
    )
    db.add(db_book)
    db.flush() # To get db_book.id

    db_book_content = models.BookContent(book_id=db_book.id, content=book.content)
    db.add(db_book_content)
    db.commit()
    db.refresh(db_book)
    db.refresh(db_book_content)

    # Generate embeddings and store in Qdrant if services are available
    if qdrant_service and gemini_service and book.content:
        try:
            # Split content into chunks for better search
            chunk_size = 1000
            content = book.content
            chunks = [content[i:i+chunk_size] for i in range(0, len(content), chunk_size)]

            # Generate embeddings for all chunks
            embeddings = gemini_service.get_embeddings(chunks)

            if embeddings:
                # Create points for Qdrant
                points = []
                for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
                    point = PointStruct(
                        id=hash(f"{db_book.id}_{i}") % 10000000,
                        vector=embedding,
                        payload={
                            "content": chunk,
                            "book_id": db_book.id,
                            "source_location": f"Chapter {i + 1}",
                            "chunk_index": i
                        }
                    )
                    points.append(point)

                qdrant_service.upsert(points)
                print(f"Stored {len(points)} embeddings for book {db_book.id}")
        except Exception as e:
            print(f"Error generating embeddings for book: {e}")

    return db_book, db_book_content

def get_book(db: Session, book_id: int):
    return db.query(models.Book).filter(models.Book.id == book_id).first()

def get_book_with_content(db: Session, book_id: int):
    return db.query(models.Book).filter(models.Book.id == book_id).first() # Relationship will load content

def update_book_content(db: Session, book_id: int, new_content: str):
    db_book_content = db.query(models.BookContent).filter(models.BookContent.book_id == book_id).first()
    if db_book_content:
        db_book_content.content = new_content
        db_book_content.updated_at = datetime.datetime.utcnow()
        db.commit()
        db.refresh(db_book_content)
        return db_book_content
    return None