from typing import List, Optional
import datetime
from pydantic import BaseModel

# Existing RAG Chatbot related Pydantic models
class QueryResponseSource(BaseModel):
    source_location: str

class GeneralQueryResponse(BaseModel):
    answer: str
    sources: List[QueryResponseSource]

class SelectedTextQueryResponse(BaseModel):
    answer: str
    sources: List[QueryResponseSource]

class GeneralQueryRequest(BaseModel):
    question: str

class SelectedTextQueryRequest(BaseModel):
    question: str
    selected_text: str

# Better Auth Models
class AuthUser(BaseModel):
    id: str
    email: str
    name: str
    emailVerified: bool
    image: Optional[str] = None
    createdAt: datetime.datetime
    updatedAt: datetime.datetime

    class Config:
        from_attributes = True

class AuthSession(BaseModel):
    id: str
    userId: str
    token: str
    expiresAt: datetime.datetime
    ipAddress: Optional[str] = None
    userAgent: Optional[str] = None
    createdAt: datetime.datetime
    updatedAt: datetime.datetime

    class Config:
        from_attributes = True

# Legacy/App Models
class BookBase(BaseModel):
    title: str
    content: str

class BookCreate(BookBase):
    pass

class Book(BookBase):
    id: int
    author_id: int
    created_at: datetime.datetime
    updated_at: datetime.datetime

    class Config:
        from_attributes = True

class BookContentBase(BaseModel):
    content: str

class BookContentCreate(BookContentBase):
    pass

class BookContent(BookContentBase):
    id: int
    book_id: int
    created_at: datetime.datetime
    updated_at: datetime.datetime

    class Config:
        from_attributes = True

class TranslationBase(BaseModel):
    language: str
    translated_content: str

class TranslationCreate(TranslationBase):
    pass

class Translation(TranslationBase):
    id: int
    book_id: int
    translated_content_id: int
    created_at: datetime.datetime
    updated_at: datetime.datetime

    class Config:
        from_attributes = True

class ContentChunk(BaseModel):
    content: str
    source_location: str

class ChatHistory(BaseModel):
    id: int
    user_id: int
    question: str
    answer: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True
