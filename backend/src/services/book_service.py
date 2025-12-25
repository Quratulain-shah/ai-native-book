from sqlalchemy.orm import Session
from .. import models, schemas
import datetime # Import datetime

def create_book(db: Session, book: schemas.BookCreate, user_id: int):
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