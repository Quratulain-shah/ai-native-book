# Data Model for Rich Content, Authentication, and Book Translation

This document defines the data models for the new entities required for this feature. The models are designed based on the "Separate Translation Tables" approach identified in the research phase.

## 1. User Model

Represents a user of the application. The user can be a content creator or a reader.

**Table**: `users`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `INTEGER` | `PRIMARY KEY` | Unique identifier for the user. |
| `email` | `VARCHAR(255)` | `UNIQUE`, `NOT NULL` | User's email address. |
| `name` | `VARCHAR(255)` | | User's full name. |
| `provider` | `VARCHAR(50)` | `NOT NULL` | The social login provider (e.g., "google"). |
| `provider_id` | `VARCHAR(255)` | `UNIQUE`, `NOT NULL` | The user's unique ID from the social provider. |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Timestamp of user creation. |
| `updated_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Timestamp of last user update. |

## 2. Book Model

Represents a book.

**Table**: `books`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `INTEGER` | `PRIMARY KEY` | Unique identifier for the book. |
| `title` | `VARCHAR(255)` | `NOT NULL` | The title of the book. |
| `author_id` | `INTEGER` | `FOREIGN KEY (users.id)` | The user who created the book. |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Timestamp of book creation. |
| `updated_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Timestamp of last book update. |

## 3. Book Content Model

Represents the content of a book.

**Table**: `book_contents`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `INTEGER` | `PRIMARY KEY` | Unique identifier for the content. |
| `book_id` | `INTEGER` | `FOREIGN KEY (books.id)` | The book this content belongs to. |
| `content` | `TEXT` | | The content of the book in MDX format. |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Timestamp of content creation. |
| `updated_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Timestamp of last content update. |

## 4. Translation Model

Represents a translation of a book.

**Table**: `translations`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `INTEGER` | `PRIMARY KEY` | Unique identifier for the translation. |
| `book_id` | `INTEGER` | `FOREIGN KEY (books.id)` | The original book that was translated. |
| `language` | `VARCHAR(10)` | `NOT NULL` | The language of the translation (e.g., "urdu"). |
| `translated_content_id` | `INTEGER` | `FOREIGN KEY (book_contents.id)` | The content of the translation. |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Timestamp of translation creation. |
| `updated_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Timestamp of last translation update. |

## Relationships

- A `User` can have many `Books`.
- A `Book` has one `Author` (`User`).
- A `Book` has one `BookContent` (for the original content).
- A `Book` can have many `Translations`.
- A `Translation` belongs to one `Book`.
- A `Translation` has one `BookContent` (for the translated content).
