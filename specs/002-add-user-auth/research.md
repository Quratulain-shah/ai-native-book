# Research: Add User Authentication (Better Auth)

**Status**: Completed  
**Date**: 2025-12-14

## Unknowns & Decisions

### 1. Integration Architecture
**Context**: The project has a Python backend and a React (Docusaurus) frontend. Better Auth runs on Node.js.
**Options**:
- A. **Replace Backend**: Rewrite Python backend in Node.js. (Too much work, out of scope).
- B. **Microservice**: Run Better Auth as a separate Node.js service. (Selected).
- C. **Python Port**: Wait for a Python version of Better Auth. (Not available).

**Decision**: **Option B (Microservice)**. We will create a lightweight `auth-server` using Hono and Better Auth. It will handle all authentication routes (`/api/auth/*`).

### 2. Database Strategy
**Context**: Python uses `backend/test.db` (SQLite). Better Auth needs a database.
**Options**:
- A. **Separate DBs**: Auth has its own DB. (Hard to link users to data).
- B. **Shared Postgres**: Migrate everything to Postgres. (Best for production, good for "Neon" requirement).
- C. **Shared SQLite**: Both services access `test.db`. (Simplest for local dev, risky for concurrency but acceptable for hackathon scale).

**Decision**: **Shared SQLite**. We will point Better Auth's Prisma/Drizzle adapter to the existing `backend/test.db`.
**Mitigation**: We must ensure the `user` table created by Better Auth doesn't conflict with existing tables (currently none or minimal).

### 3. Verification in Python
**Context**: Python API needs to know if a request is authenticated.
**Options**:
- A. **Remote Validation**: Python calls Node.js server to verify token. (Slow).
- B. **JWT**: Better Auth issues JWTs, Python verifies signature. (Stateless, fast).
- C. **Database Lookup**: Python reads the `session` table directly. (Stateful, simple with shared DB).

**Decision**: **Database Lookup**. Since we are sharing the SQLite DB, Python can simply check:
`SELECT * FROM session WHERE token = ? AND expires_at > NOW()`.
This ensures instant revocation support and uses the existing DB connection.

## Implementation Details

### Stack
- **Auth Server**: Node.js (v20+), Hono, Better Auth, Better-SQLite3.
- **Frontend**: `@better-auth/react` configured with `baseURL` pointing to Auth Server.
- **Backend**: Python SQLAlchemy model for `Session` and `User` (read-only mapping).
