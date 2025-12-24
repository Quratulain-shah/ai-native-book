---
ID: "001"
TITLE: "Fix Backend Import and Auth"
STAGE: "fix"
DATE_ISO: "2025-12-04"
SURFACE: "agent"
MODEL: "gemini-2.0-flash-exp"
FEATURE: "backend"
BRANCH: "main"
USER: "user"
COMMAND: "go ahead"
LABELS: ["backend", "fix", "auth", "import-error"]
LINKS:
  SPEC: null
  TICKET: null
  ADR: null
  PR: null
FILES_YAML:
  - backend/src/schemas.py
  - backend/src/services/auth_service.py
TESTS_YAML:
  - Manual verification of backend startup
  - Manual verification of Google Auth flow
---

# Fix Backend Import and Auth

## Prompt
go ahead

## Response
Fixed `ImportError` by adding missing `ContentChunk` and `ChatHistory` schemas.
Updated `auth_service.py` to support direct Google OAuth using `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
