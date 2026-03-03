import logging
from sqlalchemy.orm import Session
from .. import models, schemas

logger = logging.getLogger(__name__)


def create_book(db: Session, book: schemas.BookCreate, user_id: int, qdrant_service=None, gemini_service=None):
    db_book = models.Book(title=book.title, author_id=user_id)
    db.add(db_book)
    db.flush()

    db_book_content = models.BookContent(book_id=db_book.id, content=book.content)
    db.add(db_book_content)
    db.commit()
    db.refresh(db_book)
    db.refresh(db_book_content)

    # Optionally index content in Qdrant
    if qdrant_service and gemini_service:
        try:
            embedding = gemini_service.get_embedding(book.content)
            if embedding:
                from qdrant_client.models import PointStruct
                import uuid
                point = PointStruct(
                    id=str(uuid.uuid4()),
                    vector=embedding,
                    payload={
                        "content": book.content,
                        "source_location": f"Book: {book.title}",
                        "book_id": db_book.id,
                    },
                )
                qdrant_service.upsert([point])
        except Exception as e:
            logger.warning(f"Failed to index book in Qdrant: {e}")

    db_book.content = book.content
    return db_book, db_book_content


def get_book_with_content(db: Session, book_id: int):
    return db.query(models.Book).filter(models.Book.id == book_id).first()


def update_book_content(db: Session, book_id: int, new_content: str):
    book_content = db.query(models.BookContent).filter(models.BookContent.book_id == book_id).first()
    if not book_content:
        return None
    book_content.content = new_content
    db.commit()
    db.refresh(book_content)
    return book_content
