import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

# Better Auth Tables (Managed by Node.js, Read by Python)
class AuthUser(Base):
    __tablename__ = "user" # Better Auth uses singular 'user'

    id = Column(String, primary_key=True) # UUID
    email = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    emailVerified = Column(Boolean, default=False)
    image = Column(String)
    createdAt = Column(DateTime, default=datetime.datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.datetime.utcnow)

class AuthSession(Base):
    __tablename__ = "session" # Better Auth uses singular 'session'

    id = Column(String, primary_key=True)
    userId = Column(String, ForeignKey("user.id"), nullable=False)
    token = Column(String, unique=True, nullable=False)
    expiresAt = Column(DateTime, nullable=False)
    ipAddress = Column(String)
    userAgent = Column(String)
    createdAt = Column(DateTime, default=datetime.datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("AuthUser")

class AuthAccount(Base):
    __tablename__ = "account"

    id = Column(String, primary_key=True)
    userId = Column(String, ForeignKey("user.id"), nullable=False)
    accountId = Column(String, nullable=False)
    providerId = Column(String, nullable=False)
    accessToken = Column(String)
    refreshToken = Column(String)
    accessTokenExpiresAt = Column(DateTime)
    refreshTokenExpiresAt = Column(DateTime)
    scope = Column(String)
    password = Column(String) # Used if password is stored in account, but usually in user for simple email/pass depending on config. 
    # Better Auth default for email/pass: password is in 'user' table? No, actually Better Auth often enables 'account' for everything.
    # Let's add standard fields.
    createdAt = Column(DateTime, default=datetime.datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("AuthUser")

class AuthVerification(Base):
    __tablename__ = "verification"

    id = Column(String, primary_key=True)
    identifier = Column(String, nullable=False)
    value = Column(String, nullable=False)
    expiresAt = Column(DateTime, nullable=False)
    createdAt = Column(DateTime, default=datetime.datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.datetime.utcnow)


# Legacy/App Tables
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String)
    provider = Column(String, nullable=False)
    provider_id = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    books = relationship("Book", back_populates="author")

class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    author = relationship("User", back_populates="books")
    contents = relationship("BookContent", back_populates="book")
    translations = relationship("Translation", back_populates="book")

class BookContent(Base):
    __tablename__ = "book_contents"

    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("books.id"))
    content = Column(Text)  # Store MDX content as Text
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    book = relationship("Book", back_populates="contents")
    translated_by = relationship("Translation", back_populates="translated_content")


class Translation(Base):
    __tablename__ = "translations"

    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("books.id"))
    language = Column(String, nullable=False)
    translated_content_id = Column(Integer, ForeignKey("book_contents.id"))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    book = relationship("Book", back_populates="translations")
    translated_content = relationship("BookContent", back_populates="translated_by")
