# Quickstart for Rich Content, Authentication, and Book Translation

This document provides a brief guide to setting up and running this feature.

## Prerequisites

- Python 3.11+
- Node.js and npm
- Access to a PostgreSQL database
- A Google Cloud project with OAuth 2.0 credentials

## Backend Setup

1.  **Install dependencies**:
    ```bash
    pip install -r backend/requirements.txt
    pip install googletrans==4.0.0-rc1
    ```

2.  **Configure environment variables**:
    Create a `.env` file in the `backend` directory with the following content:
    ```
    DATABASE_URL="postgresql://user:password@host:port/database"
    BETTER_AUTH_API_KEY="your_better_auth_api_key"
    ```

3.  **Run database migrations**:
    (Assuming Alembic is set up)
    ```bash
    alembic upgrade head
    ```

4.  **Run the backend server**:
    ```bash
    uvicorn main:app --reload
    ```

## Frontend Setup

1.  **Install dependencies**:
    ```bash
    npm install
    npm install mdx-editor @react-oauth/google
    ```

2.  **Configure environment variables**:
    Create a `.env` file in the `frontend` directory with the following content:
    ```
    REACT_APP_GOOGLE_CLIENT_ID="your_google_client_id"
    ```

3.  **Run the frontend development server**:
    ```bash
    npm start
    ```

## How to Use

1.  Open the application in your browser.
2.  Click the "Login with Google" button to authenticate.
3.  As a content creator, you can create new books and edit their content using the rich text editor.
4.  As an authenticated user, you can view a book and click the "Translate to Urdu" button to see the translation.
