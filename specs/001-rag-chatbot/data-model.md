# Data Model: RAG Chatbot

**Purpose**: To define the data structures for the RAG chatbot.

## Entities

### 1. ContentChunk

Represents a segment of the book's text, indexed for efficient retrieval.

-   **`id`** (UUID, Primary Key): A unique identifier for the content chunk.
-   **`content`** (Text): The raw text of the chunk.
-   **`source_location`** (String): The location of the content within the book (e.g., "Module 1, Week 2").
-   **`qdrant_vector_id`** (UUID): The ID of the corresponding vector in the Qdrant vector database.
-   **`created_at`** (Timestamp): The timestamp when the chunk was created.

### 2. ChatHistory

Represents a single turn in a chat conversation, for potential future use in context-aware conversations.

-   **`id`** (UUID, Primary Key): A unique identifier for the chat message.
-   **`session_id`** (String): A unique identifier for a user's chat session.
-   **`query`** (Text): The user's question.
-   **`response`** (Text): The chatbot's answer.
-   **`created_at`** (Timestamp): The timestamp of the chat message.

## Relationships

-   A `ContentChunk` has a one-to-one relationship with a vector in the Qdrant database, linked by `qdrant_vector_id`.
-   There is no direct relationship between `ContentChunk` and `ChatHistory`, but the `response` in `ChatHistory` is generated using retrieved `ContentChunk`s.
