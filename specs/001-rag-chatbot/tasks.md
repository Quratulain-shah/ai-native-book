# Tasks: RAG Chatbot Integration

**Input**: Design documents from `specs/001-rag-chatbot/`

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 [P] Create the directory structure in `backend/src/` and `frontend/src/` as defined in the plan.
- [ ] T002 [P] Initialize the Python project in the `backend/` directory and add dependencies to a `requirements.txt` file.
- [ ] T003 [P] Initialize the Docusaurus project in the `frontend/` directory.

## Phase 2: Foundational (Blocking Prerequisites)

- [ ] T004 Set up the FastAPI application entry point in `backend/src/main.py`.
- [ ] T005 Configure the database connection to Neon in `backend/src/database.py`.
- [ ] T006 Define the SQLAlchemy models for `ContentChunk` and `ChatHistory` in `backend/src/schemas.py`.
- [ ] T007 Define the Pydantic models for API request and response bodies in `backend/src/models.py`.
- [ ] T008 Create a script in `scripts/ingest_data.py` to parse the book's content.
- [ ] T009 In the ingestion script, add logic to chunk the text into manageable pieces.
- [ ] T010 In the ingestion script, connect to the OpenAI API to generate vector embeddings for each chunk.
- [ ] T011 In the ingestion script, connect to the Qdrant Cloud API and store the vectors.
- [ ] T012 In the ingestion script, connect to the Neon Postgres database and store the text chunks and metadata.

## Phase 3: User Story 1 - General Content Questions (Priority: P1) 🎯 MVP

**Goal**: Answer general questions based on the entire book's content.
**Independent Test**: Can be tested by hitting the `/query/general` endpoint with a question and verifying the response is accurate.

- [ ] T013 [P] [US1] Create the service for interacting with Qdrant in `backend/src/services/qdrant_service.py`.
- [ ] T014 [P] [US1] Create the service for interacting with the OpenAI API in `backend/src/services/openai_service.py`.
- [ ] T015 [US1] Implement the `/query/general` API endpoint in `backend/src/main.py`.
- [ ] T016 [US1] In the general query endpoint, implement the logic to retrieve relevant text chunks from Qdrant and Postgres.
- [ ] T017 [US1] In the general query endpoint, implement the logic to generate a final answer using the OpenAI API.
- [ ] T018 [P] [US1] Create the basic UI for the chatbot in `frontend/src/components/Chatbot.js`.
- [ ] T019 [US1] Integrate the chatbot component into the Docusaurus site using `frontend/src/theme/Root.js`.
- [ ] T020 [US1] Implement the frontend logic to call the `/query/general` API endpoint and display the response.

## Phase 4: User Story 2 - Selected Text Clarification (Priority: P2)

**Goal**: Answer questions based only on user-selected text.
**Independent Test**: Can be tested by hitting the `/query/selected-text` endpoint with a question and a text snippet.

- [ ] T021 [US2] Implement the `/query/selected-text` API endpoint in `backend/src/main.py`.
- [ ] T022 [US2] In the selected-text endpoint, implement the logic to generate an answer using only the provided text and question.
- [ ] T023 [P] [US2] Add functionality to the Docusaurus frontend to detect user text selections.
- [ ] T024 [US2] Create a context menu or button that appears on text selection to trigger the chatbot.
- [ ] T025 [US2] Update the `Chatbot.js` component to handle selected-text queries and call the new endpoint.

## Phase 5: Polish & Cross-Cutting Concerns

- [ ] T026 [P] Implement robust error handling in the backend API.
- [ ] T027 [P] Add loading indicators and user feedback mechanisms to the frontend chatbot UI.
- [ ] T028 [P] Add comprehensive docstrings and comments to the backend code.
- [ ] T029 [P] [US1] Create README.md files for backend and frontend directories, outlining setup, dependencies, and basic usage including chatbot interaction and data ingestion process.
- [ ] T031 [P] [US1] Define the structure and content for the README.md files in the backend and frontend directories.
- [ ] T032 [US1] Implement logic in the general query endpoint to inform the user when no answer is found in the book's content.
- [ ] T033 [US2] Implement logic to decline answering off-topic questions and provide a polite message.
- [ ] T030 Validate and refine the `quickstart.md` guide.

## Dependencies & Execution Order

- **Phase 1 & 2**: Must be completed before any user story work can begin. The data ingestion script (T008-T012) is a critical blocker.
- **User Story 1**: Can begin after Phase 2 is complete.
- **User Story 2**: Depends on the chatbot UI from User Story 1 (T018) but can otherwise be worked on in parallel with US1's backend tasks.
- **Polish**: Can be done at any time after the relevant components are built.

## Parallel Execution Examples

- **Backend Foundation**: T004, T005, T006, and T007 can be worked on in parallel.
- **US1 vs US2**: The backend for US1 (T013-T017) can be developed in parallel with the frontend work for US2 (T023-T025), once the initial chatbot UI is in place.