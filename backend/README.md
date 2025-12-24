---
title: Physical Ai Backend
emoji: 🤖
colorFrom: blue
colorTo: indigo
sdk: docker
pinned: false
app_port: 7860
---

# Backend README

This is the README for the RAG Chatbot backend service.

## Setup

1.  **Prerequisites**:
    -   Python 3.11+ installed
    -   `requirements.txt` file with all necessary dependencies
    -   Environment variables configured (`OPENAI_API_KEY`, `QDRANT_API_KEY`, `QDRANT_HOST`, `DATABASE_URL`)

2.  **Installation**:
    ```bash
    pip install -r requirements.txt
    ```

3.  **Database Setup**:
    *(Assuming Alembic is used for migrations)*
    ```bash
    alembic upgrade head
    ```
    *(If not using Alembic, refer to `backend/src/database.py` for connection details and manual setup if needed)*

4.  **Running the Server**:
    ```bash
    uvicorn backend.src.main:app --reload
    ```

## Usage

-   The API provides two main endpoints:
    -   `POST /query/general`: For general questions about the book.
    -   `POST /query/selected-text`: For questions about specific text selections.

## Data Ingestion

To populate the database and vector store, run the ingestion script:

```bash
python scripts/ingest_data.py
```

*Note: Ensure your Docusaurus build output is accessible at the path specified in `scripts/ingest_data.py` or modify the script to point to the correct location.*