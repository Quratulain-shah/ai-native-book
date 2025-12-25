# Quickstart: RAG Chatbot

**Purpose**: A guide to setting up and running the RAG chatbot for development.

## Backend Setup

1.  **Install Dependencies**:
    ```bash
    pip install -r backend/requirements.txt
    ```

2.  **Set Environment Variables**:
    Create a `.env` file in the `backend` directory with the following variables:
    ```
    OPENAI_API_KEY=...
    QDRANT_API_KEY=...
    QDRANT_HOST=...
    DATABASE_URL=...
    ```

3.  **Run Migrations**:
    *(Assuming Alembic or a similar tool is set up)*
    ```bash
    alembic upgrade head
    ```

4.  **Run the Backend Server**:
    ```bash
    uvicorn src.main:app --reload
    ```

## Frontend Setup

1.  **Install Dependencies**:
    ```bash
    cd frontend
    npm install
    ```

2.  **Run the Docusaurus Development Server**:
    ```bash
    npm start
    ```

## Data Ingestion

*(This process needs to be run once to populate the database and vector store)*

1.  **Run the Ingestion Script**:
    A script will need to be created to parse the Docusaurus content, chunk it, generate embeddings, and store everything in Qdrant and Postgres.
    ```bash
    python scripts/ingest_data.py
    ```
