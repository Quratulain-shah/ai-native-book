---
id: 1
title: "RAG Implementation Spec"
stage: "spec"
date_iso: "2025-12-19"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "rag-qdrant-gemini"
branch: "004-rag-qdrant-gemini"
user: "user"
command: "/sp.specify"
labels:
  - "spec"
  - "rag"
  - "qdrant"
  - "gemini"
  - "ai"
links:
  spec: "specs/004-rag-qdrant-gemini/spec.md"
  ticket: null
  adr: null
  pr: null
files_yaml:
  - "specs/004-rag-qdrant-gemini/spec.md"
  - "specs/004-rag-qdrant-gemini/checklists/requirements.md"
tests_yaml:
  - "spec quality checklist validation"
prompt_text: |
  Phase 5: RAG Implementation with Qdrant and Gemini Embeddings

  **Context & Role:**
  Act as the @-backend-agent agent.
  Activate skills: `context7-expert`, `fastapi-expert`.

  **Goal:**
  Scale the existing Phase 2 FastAPI backend to support RAG (Retrieval-Augmented Generation) using Qdrant Cloud and Gemini Embeddings. Keep the implementation strictly minimalistic—do NOT use heavy orchestration frameworks like LangChain or LlamaIndex. Use pure Python/FastAPI logic.

  **Core Requirements:**

  1.  **Vector Database Connection (Qdrant):**
      * Initialize the `QdrantClient` (Async) connecting to Qdrant Cloud.
      * Use environment variables for `QDRANT_URL` and `QDRANT_API_KEY`.


  2.  **Embeddings (Gemini):**
      * Use Google's Gemini model for embeddings (e.g., `text-embedding-004` via `google-generativeai` SDK or compatible interface).
      * Do **NOT** use OpenAI embeddings.

  3.  **Ingestion Endpoint (`POST /ingest`):**
      * Create a new endpoint that accepts a payload of book content (sections/chapters).
      * Logic: Receive text -> Generate Embedding (Gemini) -> Upsert Point to Qdrant.
      * Keep chunking logic simple (e.g., split by paragraphs or fixed character limit if necessary, but keep it lightweight).

  4.  **RAG Tool for Agent:**
      * Create a standard Python function tool: `search_textbook(query: str)`.
      * Logic: Embed query (Gemini) -> `client.search` in Qdrant -> Return top 3 relevant chunks as text.

  5.  **Agent Integration:**
      * Update the existing OpenAI Agent (from Phase 2) to include `search_textbook` in its toolset.
      * The agent should autonomously decide when to search the textbook based on user questions.

  **Constraints:**
  * Maintain the existing `uv` package structure.
  * Keep dependencies minimal (add only `qdrant-client` and `google-generativeai`).
  * No complex PDF parsers or heavy ETL pipelines; assume the frontend sends clean text to `/ingest`.

response_text: |
  Created specification for RAG Implementation with Qdrant and Gemini Embeddings.
  - Generated feature branch name: 004-rag-qdrant-gemini
  - Created spec file at specs/004-rag-qdrant-gemini/spec.md
  - Created quality checklist at specs/004-rag-qdrant-gemini/checklists/requirements.md
  - Specification includes user scenarios, functional requirements, and success criteria
  - Made specification technology-agnostic while preserving core intent

outcome: |
  Specification successfully created for RAG implementation with Qdrant and Gemini.
  The spec defines user scenarios for AI-powered textbook search, functional requirements
  for vector database integration, and measurable success criteria. The specification
  is ready for planning phase.

evaluation: |
  The specification meets all quality criteria:
  - Contains clear user scenarios with priorities
  - Defines testable functional requirements
  - Specifies measurable success criteria
  - Identifies key entities and edge cases
  - Maintains technology-agnostic approach while preserving feature intent
---
