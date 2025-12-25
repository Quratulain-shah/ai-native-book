# Quickstart: User Authentication

## Prerequisites
- Node.js v20+
- Python 3.10+
- `pnpm` (recommended) or `npm`

## Setup

1. **Install Auth Server Dependencies**:
   ```bash
   cd auth-server
   npm install
   ```

2. **Database Setup**:
   The auth server shares the `backend/test.db`. Ensure the backend has been initialized or run the auth migration:
   ```bash
   cd auth-server
   npm run migrate
   ```

3. **Environment Variables**:
   Create `auth-server/.env`:
   ```env
   BETTER_AUTH_SECRET=your_secret_here
   BETTER_AUTH_URL=http://localhost:4000
   ALLOWED_ORIGINS=http://localhost:3000
   ```

## Running the Services

1. **Start Auth Server**:
   ```bash
   cd auth-server
   npm run dev
   # Runs on http://localhost:4000
   ```

2. **Start Python Backend**:
   ```bash
   cd backend
   venv/Scripts/activate
   uvicorn src.main:app --reload
   # Runs on http://localhost:8000
   ```

3. **Start Frontend**:
   ```bash
   npm start
   # Runs on http://localhost:3000
   ```

## Verification

- Visit `http://localhost:3000/register`.
- Create an account.
- You should be redirected to the dashboard.
- Check `backend/test.db` to see the new user in the `user` table.
