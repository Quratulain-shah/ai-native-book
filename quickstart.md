# Quickstart: RAG Chatbot

**Purpose**: A guide to setting up and running the RAG chatbot for development.

## Backend Setup

1.  **Prerequisites**:
    -   Python 3.11+ installed
    -   `requirements.txt` file with all necessary dependencies
    -   Environment variables configured (`OPENAI_API_KEY`, `QDRANT_API_KEY`, `QDRANT_HOST`, `DATABASE_URL`)

2.  **Installation**:
    ```bash
    pip install -r requirements.txt
    ```

3.  **Database Setup**:
    *(Assuming Alembic is used for migrations as per plan.md)*
    ```bash
    alembic upgrade head
    ```
    *(If not using Alembic, ensure your `DATABASE_URL` is correctly set and tables are managed appropriately.)*

4.  **Running the Server**:
    ```bash
    uvicorn backend.src.main:app --reload
    ```

## Frontend Setup

1.  **Prerequisites**:
    -   Node.js and npm installed
    -   Docusaurus project structure initialized (see `frontend/package.json` for dependencies)

2.  **Installation**:
    ```bash
    cd frontend
    npm install
    ```

3.  **Running the Docusaurus Development Server**:
    ```bash
    npm start
    ```
    *(Note: This command will run a placeholder script as a full Docusaurus init was not performed.)*

## Data Ingestion

*(This process needs to be run once to populate the database and vector store. Ensure your environment variables are set for OpenAI and Qdrant.)*

1.  **Run the Ingestion Script**:
    ```bash
    python scripts/ingest_data.py
    ```
    
    **Important**: The `scripts/ingest_data.py` script uses a placeholder path (`./path/to/docusaurus/build`) for parsing Docusaurus content. You will need to modify this path to point to your actual Docusaurus build output directory if you are parsing real content, or ensure the simulated content is sufficient for your testing needs.
