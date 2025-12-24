# Implementation Plan - Add User Authentication (Better Auth)

**Feature**: Add User Authentication (Better Auth)  
**Branch**: `002-add-user-auth`  
**Spec**: [specs/002-add-user-auth/spec.md](spec.md)

## Technical Context

**Constraints & Patterns**:
- Project uses **Docusaurus** (React) for frontend and **FastAPI** (Python) for backend.
- **Better Auth** is a TypeScript-first library requiring a JS runtime (Node/Bun).
- **Database**: Project currently uses SQLite (`test.db`) but Constitution mentions "Neon Serverless Postgres". We should aim for a shared database approach or JWT verification.
- **Architecture**: We need to introduce a "Auth Server" (Node.js) to host Better Auth, acting as a gateway or sidecar.

**Unknowns & Clarifications**:
- [ ] **Auth Server Hosting**: Where does the Better Auth server run? We will assume a local Node.js process for development (`auth-server` directory).
- [ ] **Database Sharing**: Can Python and Node.js share the SQLite file reliably? For a hackathon/dev, yes, but Postgres is better. We will stick to the existing `test.db` (SQLite) for simplicity unless it blocks us, using Prisma (Node) and SQLAlchemy (Python).
- [ ] **Token Verification**: Python backend needs to verify requests. We will use **Bearer Tokens** (JWTs) or direct DB session lookups. Better Auth supports plugins for JWTs or we can read the `session` table directly in Python.

## Constitution Check

- [x] **I. Content Fidelity**: Auth adds access control, doesn't change content fidelity.
- [x] **II. Structure Follows Content**: UI changes are minimal (Login/Signup pages).
- [x] **III. Simplicity**: Better Auth is chosen for its features, but adding a Node server to a Python project adds complexity. We must keep the integration simple (minimal `auth-server`).
- [x] **VI. RAG Chatbot**: Auth will gate the chatbot (future/current requirement).
- [x] **VIII. Authenticated User Experience**: Directly supports this principle.

## Phase 0: Research & Key Decisions

### Research Tasks

1.  **Architecture**: How to integrate Better Auth (TS) with Python Backend?
    *   *Decision*: **Sidecar Auth Server**. Create `auth-server/` (Node.js + Hono + Better Auth).
    *   *Rationale*: Docusaurus is static. We need a runtime for Auth. Python can't run Better Auth directly.
2.  **Database**: Shared SQLite vs. Postgres?
    *   *Decision*: **Shared SQLite**. Both SQLAlchemy (Python) and Prisma (Node) can read `backend/test.db`.
    *   *Rationale*: Zero-config for existing setup.
3.  **Verification**: How does Python know the user is logged in?
    *   *Decision*: **Header Token / Shared DB**. Frontend sends session token. Python Middleware looks up session in `session` table (managed by Better Auth).
    *   *Alternative*: JWT plugin in Better Auth + JWT decode in Python. Shared DB is more robust for session revocation.

### Proposed Stack
- **Frontend**: Docusaurus + `@better-auth/react` client.
- **Auth Server**: Node.js + Hono + `better-auth` + `better-sqlite3` (serving `backend/test.db`).
- **Backend**: FastAPI + Custom Middleware (reading `session` table from `test.db`).

## Phase 1: Design & Contracts

### Data Model (`data-model.md`)
- **User**: Standard Better Auth schema (id, email, name, image, password_hash, created_at, updated_at).
- **Session**: Standard Better Auth schema (id, userId, token, expiresAt, ipAddress, userAgent).
- **Account**: (Optional) For OAuth linking.

### Contracts (`contracts/`)
- **API**: `POST /api/auth/*` (handled by Better Auth Server).
- **Middleware**: Python function `get_current_user` that queries the SQLite DB for a valid session token from headers/cookies.

### Agent Context
- Update `docusaurus` context with Better Auth client usage.
- Update `backend` context with Session verification logic.

## Phase 2: Implementation Breakdown

### Step 1: Auth Server Setup
- Initialize `auth-server` directory.
- Install `better-auth`, `hono`, `dotenv`, `better-sqlite3`.
- Configure Better Auth with Email/Password and SQLite adapter (pointing to `../backend/test.db`).
- Create `server.ts` to expose Better Auth routes.

### Step 2: Frontend Integration
- Install `better-auth` client in root `package.json`.
- Create `src/lib/auth-client.ts`.
- Create `src/pages/login.tsx` and `src/pages/register.tsx`.
- Update `src/theme/Root.tsx` (or similar) to handle protected routes protection.

### Step 3: Backend Verification
- Update Python models to include (or strictly read-only map) the Better Auth tables (`user`, `session`).
- Implement `get_current_user` dependency in FastAPI.
- Protect `/query/*` endpoints.

### Step 4: End-to-End Test
- Verify flow: Register (Frontend) -> Auth Server (DB Write) -> Login (Frontend) -> Chatbot Query (Frontend) -> Python API (DB Read/Verify) -> Success.