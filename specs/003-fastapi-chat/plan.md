# Implementation Plan: FastAPI Chat Backend with Groq Integration

**Branch**: `003-fastapi-chat` | **Date**: 2025-12-17 | **Spec**: [specs/003-fastapi-chat/spec.md](specs/003-fastapi-chat/spec.md)
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a FastAPI application with a single `/chat` endpoint that accepts user messages and returns AI-generated responses using the OpenAI Agents SDK configured to work with the Llama3-8b-8192 model. The solution will use `uv` for dependency management and include comprehensive testing.

## Technical Context

**Language/Version**: Python 3.12
**Primary Dependencies**: FastAPI, uv, openai-agents SDK, httpx
**Storage**: N/A (no database required per spec)
**Testing**: pytest with TestClient for FastAPI integration testing
**Target Platform**: Linux server (cloud deployment)
**Project Type**: Backend web API
**Performance Goals**: 95% of requests respond within 10 seconds
**Constraints**: <10 second response time for 95% of requests, secure API authentication
**Scale/Scope**: Support multiple concurrent API requests, prepare for 1000+ daily users

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Architecture follows project constitution with:
- Async-first FastAPI implementation for performance
- Proper separation of concerns (API layer, service layer, agent logic)
- Security-first approach with API key validation
- Test-driven approach with unit and integration tests

## Project Structure

### Documentation (this feature)

```text
specs/003-fastapi-chat/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # Configuration and settings
│   ├── models/
│   │   ├── request.py       # Request models (MessageRequest)
│   │   └── response.py      # Response models (MessageResponse)
│   ├── services/
│   │   ├── agent.py         # Agent logic with Groq integration
│   │   └── chat_service.py  # Chat service orchestrator
│   └── api/
│       └── routes/
│           └── chat.py      # Chat endpoint definitions
├── tests/
│   ├── unit/
│   │   ├── test_agent.py    # Unit tests for agent logic
│   │   └── test_models.py   # Unit tests for data models
│   ├── integration/
│   │   └── test_chat_api.py # Integration tests for /chat endpoint
│   └── conftest.py          # Test configuration
├── pyproject.toml           # Project dependencies and metadata
└── .env.example             # Example environment variables
```

**Structure Decision**: Selected single backend project structure with clear separation of concerns. The backend directory contains all API-related code with logical grouping by functionality (models, services, API routes).

## Phase-by-Phase Implementation

### Phase 1: Environment & Project Skeleton
- Set up pyproject.toml with FastAPI, uv, openai-agents, and testing dependencies
- Create basic directory structure
- Implement configuration management with environment variables
- Set up basic FastAPI application structure

### Phase 2: The Agent Logic
- Configure OpenAIChatCompletionsModel to work with Groq API
- Implement agent service that uses llama3-8b-8192 model
- Create proper authentication using GROQ_API_KEY
- Implement error handling for API failures

### Phase 3: The API Layer
- Create Pydantic models for request/response validation
- Implement the POST /chat endpoint with proper validation
- Connect the API endpoint to the agent service
- Add authentication middleware for API access control

## Testing Strategy

### Unit Tests
- Test agent logic in isolation with mocked Groq API responses
- Validate data models and their validation rules
- Test service layer business logic

### Integration Tests
- Test the full /chat endpoint flow using TestClient
- Verify proper request/response handling
- Test error scenarios and response codes
- Validate authentication requirements

## Architectural Decisions Required

### ADR-001: OpenAI Agents SDK with Groq Integration
- **Context**: Need to use OpenAI Agents SDK but connect to Groq's API instead of OpenAI endpoints
- **Options**:
  1. Configure OpenAIChatCompletionsModel with custom base URL
  2. Use native Groq SDK directly
  3. Create custom wrapper around httpx
- **Decision**: Use OpenAIChatCompletionsModel with custom configuration to maintain SDK consistency while connecting to Groq
- **Rationale**: Maintains familiar SDK interface while meeting requirement to use OpenAI-agents SDK

### ADR-002: Dependency Management
- **Context**: Choose between pip, poetry, or uv for dependency management
- **Decision**: Use uv as specified in requirements for fast package management
- **Rationale**: Meets requirement specifically mentioned in spec and provides faster dependency resolution

### ADR-003: Authentication Method
- **Context**: Secure API access to prevent unauthorized usage
- **Options**:
  1. API Key in header
  2. OAuth 2.0
  3. Basic authentication
- **Decision**: API Key in header (X-API-Key or Authorization: Bearer)
- **Rationale**: Simple to implement and appropriate for service-to-service communication

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Custom API configuration | Requirement to use OpenAI SDK with Groq API | Direct Groq SDK would be simpler but violates spec requirement |