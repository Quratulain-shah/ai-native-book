# Tasks for Rich Content, Authentication, and Book Translation

**Feature Branch**: `001-book-auth-translation`  
**Date**: 2025-12-03  
**Spec**: [specs/001-book-auth-translation/spec.md](specs/001-book-auth-translation/spec.md)
**Plan**: [specs/001-book-auth-translation/plan.md](specs/001-book-auth-translation/plan.md)

## Summary

This document outlines the actionable tasks for implementing the "Rich Content, Authentication, and Book Translation" feature, organized by user story and execution phase. Each task is designed to be specific and independently executable.

## Phase 1: Setup

- [X] T001 Configure environment variables for the backend (DATABASE_URL, BETTER_AUTH_API_KEY) in `backend/.env`
- [X] T002 Configure environment variables for the frontend (REACT_APP_GOOGLE_CLIENT_ID) in `.env`
- [X] T003 Install backend dependencies (`googletrans`) in `backend/requirements.txt`
- [X] T004 Install frontend dependencies (`mdx-editor`, `@react-oauth/google`) in `package.json`

## Phase 2: Foundational

- [X] T005 Create the database schema based on `data-model.md` (`users`, `books`, `book_contents`, `translations` tables) in `backend/src/database.py` and `backend/src/models.py`
- [X] T006 Implement the database connection and session management in `backend/src/database.py`
- [X] T007 Implement Pydantic schemas for User, Book, BookContent, and Translation models in `backend/src/schemas.py`

## Phase 3: User Story 2 - User Authentication (P2)

**Story Goal**: As a user, I want to be able to register and log in to the application, so that I can access features available only to authenticated users.  
**Independent Test**: A new user can register for an account, and then log in successfully.

- [X] T008 [US2] Implement the User model in `backend/src/models.py`
- [X] T009 [US2] Create an authentication service in `backend/src/services/auth_service.py` to interact with the Better Auth API
- [X] T010 [US2] Implement the `POST /auth/google/login` endpoint in `backend/src/main.py` to initiate Google social login
- [X] T011 [US2] Implement the `GET /auth/google/callback` endpoint in `backend/src/main.py` to handle the Google OAuth callback
- [X] T012 [US2] Implement JWT token generation and verification in the backend in `backend/src/utils/auth.py`
- [X] T013 [US2] Implement authentication middleware to protect API endpoints in `backend/src/middleware/auth.py`
- [P] [US2] Create the Google login button and logic in the frontend in `src/components/Auth/GoogleLogin.tsx`
- [X] T015 [P] [US2] Integrate authentication into the frontend application in `src/App.tsx`

## Phase 4: User Story 1 - Content Creation (P1)

**Story Goal**: As a content creator, I want to be able to add and manage rich content within a book so that I can create engaging and informative material for readers.  
**Independent Test**: A user can create a book, add rich content (text, images), and save it. The content is persisted and viewable.

- [X] T016 [US1] Implement the Book model in `backend/src/models.py`
- [X] T017 [US1] Implement the BookContent model in `backend/src/models.py`
- [X] T018 [US1] Create a book service in `backend/src/services/book_service.py` to manage book operations
- [X] T019 [US1] Implement the `POST /books` endpoint in `backend/src/main.py` to create new books
- [X] T020 [US1] Implement the `PUT /books/{book_id}` endpoint in `backend/src/main.py` to update book content
- [X] T021 [US1] Implement the `GET /books/{book_id}` endpoint in `backend/src/main.py` to retrieve book content
- [X] T022 [P] [US1] Integrate `MDXEditor` (currently a textarea placeholder) into a frontend component for rich content editing in `src/components/Book/RichTextEditor.tsx`
- [X] T023 [P] [US1] Create a frontend page for creating and editing books in `src/pages/EditBook.tsx`

## Phase 5: User Story 3 - Book Translation (P3)

**Story Goal**: As an authenticated user, I want to be able to select a book and translate its content into Urdu, so that I can read it in my preferred language.  
**Independent Test**: An authenticated user can select a book, trigger a translation to Urdu, and view the translated content.

- [X] T024 [US3] Implement the Translation model in `backend/src/models.py`
- [X] T025 [US3] Create a translation service in `backend/src/services/translation_service.py` to interact with `googletrans`
- [X] T026 [US3] Implement the `POST /books/{book_id}/translate` endpoint in `backend/src/main.py` to translate books
- [X] T027 [P] [US3] Create a frontend component to display translated content and trigger translation in `src/components/Book/TranslateButton.tsx`
- [X] T028 [P] [US3] Integrate the translation feature into the book viewing page in `src/pages/ViewBook.tsx`

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T029 Implement proper error handling for all API endpoints in `backend/src/main.py` and related services
- [X] T030 Add comprehensive logging to the backend application in `backend/src/main.py` and services
- [X] T031 Implement unit and integration tests for all new backend services and endpoints in `backend/tests/`
- [X] T032 Implement end-to-end tests for the user authentication, content creation, and translation flows in `e2e_tests/`

- [X] T033 Ensure authentication system is compatible/extensible with RAG Chatbot in `backend/src/services/auth_service.py`

- [X] T034 Implement performance tests for translation speed (SC-003) in `backend/tests/performance/`

- [X] T035 Implement load tests for 100 concurrent users (SC-004) in `backend/tests/load/`

- [ ] T036 Integrate a compatible rich text editor (e.g., BlockNote, Tiptap) into `src/components/Book/RichTextEditor.tsx`




## Dependencies

- Phase 1 must be completed before Phase 2.
- Phase 2 must be completed before Phase 3, 4, and 5.
- Phase 3 (User Authentication) should ideally be completed before Phase 5 (Book Translation) as authentication is a prerequisite.
- Phase 4 (Content Creation) can be developed in parallel with Phase 3 or 5, but depends on foundational tasks.
- Phase 6 (Polish & Cross-Cutting Concerns) depends on the completion of Phases 3, 4, and 5.

## Parallel Execution Opportunities

- Tasks marked with `[P]` within a user story can often be worked on in parallel.
- User Story 1 (Content Creation) and User Story 3 (Book Translation) can be developed in parallel once foundational and authentication tasks are complete, as long as their respective backend and frontend tasks are managed independently.

## Implementation Strategy

We will adopt an MVP-first approach, prioritizing the foundational elements and then building out each user story in a modular fashion.
1.  **Foundational Setup**: Establish the basic project structure, database, and core utilities.
2.  **User Authentication (P2)**: Implement user registration and Google login as a critical prerequisite for other features.
3.  **Content Creation (P1)**: Develop the rich text editing and book management functionalities.
4.  **Book Translation (P3)**: Integrate the translation service and UI for translating books.
5.  **Polish**: Focus on error handling, logging, and comprehensive testing.
