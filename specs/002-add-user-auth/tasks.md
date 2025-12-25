# Tasks: Add User Authentication (Better Auth)

**Feature**: Add User Authentication (Better Auth)  
**Branch**: `002-add-user-auth`  
**Spec**: [specs/002-add-user-auth/spec.md](spec.md)  
**Plan**: [specs/002-add-user-auth/plan.md](plan.md)

## Implementation Steps

### Phase 1: Setup (Infrastructure)
**Goal**: Initialize the Node.js Auth Server and ensure database readiness.

- [x] T001 Initialize `auth-server` directory with `package.json` and install dependencies (`better-auth`, `hono`, `dotenv`, `better-sqlite3`, `tsx`).
- [x] T002 Configure Better Auth in `auth-server/auth.ts` with Email/Password provider and SQLite adapter pointing to `../backend/test.db`.
- [x] T003 Create `auth-server/server.ts` to expose Better Auth routes using Hono.
- [x] T004 Run Better Auth migrations to create `user`, `session`, `account`, and `verification` tables in `backend/test.db`.
- [x] T005 Install `@better-auth/react` client in the root Docusaurus project (`package.json`).

### Phase 2: Foundational (Blocking)
**Goal**: Enable Python backend to verify Better Auth sessions from the shared database.

- [x] T006 Define read-only Pydantic models for `User` and `Session` in `backend/src/schemas.py` matching the Better Auth schema.
- [x] T007 Implement `get_current_user` dependency in `backend/src/middleware/auth.py` that queries `backend/test.db` for valid sessions.

### Phase 3: User Story 1 - User Registration
**Goal**: Allow new users to create accounts (Priority: P1).
**Independent Test**: Register a user via the new page and verify the row exists in the `user` table of `test.db`.

- [x] T008 [US1] Create auth client configuration in `src/lib/auth-client.ts`.
- [x] T009 [US1] Implement Registration Page component in `src/pages/register.tsx` with form validation.
- [x] T010 [US1] Add "Register" link to the Navbar in `docusaurus.config.ts`.

### Phase 4: User Story 2 - User Login
**Goal**: Allow existing users to sign in (Priority: P1).
**Independent Test**: Log in with created credentials and verify `session` token is set in cookies/storage.

- [x] T011 [US2] Implement Login Page component in `src/pages/login.tsx`.
- [x] T012 [US2] Add "Login" link to the Navbar in `docusaurus.config.ts` (conditionally shown if not logged in).

### Phase 5: User Story 3 - User Logout & Profile
**Goal**: Allow users to sign out and see their status (Priority: P2).
**Independent Test**: Click logout, verify session token is cleared and user is redirected.

- [x] T013 [US3] Create `UserProfile` component in `src/components/Auth/UserProfile.tsx` showing avatar/name and Logout button.
- [x] T014 [US3] Integrate `UserProfile` into the Navbar items in `docusaurus.config.ts` (or custom Navbar item).

### Phase 6: Integration & Polish
**Goal**: Secure endpoints and verify end-to-end flow.

- [x] T015 Update `backend/src/main.py` to protect `/query/*` endpoints using `Depends(get_current_user)`.
- [x] T016 Create a `ProtectedRoute` wrapper component in `src/components/Auth/ProtectedRoute.tsx` to redirect unauthenticated users.
- [x] T017 Apply `ProtectedRoute` to sensitive pages (e.g., if any new pages are added that require auth).
- [x] T018 Verify end-to-end flow: Register -> Login -> Query Chatbot (Success) -> Logout -> Query Chatbot (Fail/Redirect).

## Dependencies

1. **Phase 1 (Setup)** must be completed before **Phase 3 (US1)** and **Phase 2 (Foundational)**.
2. **Phase 2 (Foundational)** must be completed before **Phase 6 (Integration)**.
3. **Phase 3 (US1)** and **Phase 4 (US2)** can be developed in parallel after Phase 1.
4. **Phase 5 (US3)** depends on Phase 3 or 4 (need a user to logout).

## Parallel Execution Examples

- **Backend Dev**: Work on T006, T007, T015 (Python Middleware) while Frontend Dev works on T009, T011.
- **Frontend Dev**: Build `register.tsx` (T009) and `login.tsx` (T011) concurrently.

## Implementation Strategy
We will implement the **Auth Server** first to establish the database schema. Then we will build the **Frontend** registration/login flows to generate real data. Finally, we will implement the **Backend** verification to secure the API.
