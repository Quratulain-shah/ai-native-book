# FastAPI Groq Chat Backend

A FastAPI-based chat backend that integrates with Groq's model through the OpenAI SDK.

## Features

- FastAPI-based REST API with async support
- Integration with Groq model (llama3-8b-8192) via OpenAI SDK
- API key authentication with Bearer token or query parameter support
- Comprehensive request/response validation using Pydantic
- Async-first implementation for high performance
- Proper error handling and logging
- CORS support for cross-origin requests
- Comprehensive test coverage (unit and integration tests)

## Requirements

- Python 3.12+
- uv package manager (recommended)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Install dependencies using uv (recommended):
```bash
uv sync
```

Or if you prefer pip:
```bash
pip install -e .
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your Gemini API key and other configurations.

## Usage

Start the development server:
```bash
uv run python -m backend.src.main
```

Or using uvicorn directly:
```bash
uvicorn backend.src.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### API Documentation

Auto-generated API documentation is available at:
- `/docs` - Interactive API documentation (Swagger UI)
- `/redoc` - Alternative API documentation (ReDoc)

## API Endpoints

- `POST /api/v1/chat` - Send a chat message and receive AI response
- `GET /health` - Overall health check endpoint
- `GET /api/v1/chat/health` - Chat service specific health check

## Example Requests

### Basic Chat Request
```bash
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "message": "Hello, how are you?",
    "conversation_id": "conv_123",
    "user_id": "user_456"
  }'
```

### Chat Request with Metadata
```bash
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "message": "What can you help me with?",
    "conversation_id": "conv_123",
    "metadata": {
      "source": "web_app",
      "user_preferences": {
        "tone": "professional"
      }
    }
  }'
```

### Using Query Parameter for API Key
```bash
curl -X POST "http://localhost:8000/api/v1/chat?api_key=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, how are you?"
  }'
```

## Request Format

The `/chat` endpoint accepts a JSON object with the following structure:

```json
{
  "message": "string (required, 1-10000 characters)",
  "conversation_id": "string (optional)",
  "user_id": "string (optional)",
  "metadata": "object (optional)"
}
```

## Response Format

Successful responses return a JSON object with:

```json
{
  "response": "string (AI-generated response)",
  "conversation_id": "string (conversation identifier)",
  "timestamp": "string (ISO 8601 datetime)",
  "model_used": "string (model name)",
  "tokens_used": "number (optional, token count)"
}
```

## Environment Variables

- `GROQ_API_KEY` (required): Your Groq API key
- `GROQ_MODEL`: The Groq model to use (default:llama-3.1-8b-instant )
- `GROQ_BASE_URL`: Base URL for Groq API (default: https://api.groq.com/openai/v1)
- `API_HOST`: Host to bind to (default: 0.0.0.0)
- `API_PORT`: Port to bind to (default: 8000)
- `API_DEBUG`: Enable debug mode (default: false)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS (default: *)

## Testing

Run all tests:
```bash
uv run pytest
```

Run tests with coverage:
```bash
uv run pytest --cov=backend.src
```

Run specific test file:
```bash
uv run pytest tests/unit/test_agent.py
```

Run integration tests only:
```bash
uv run pytest tests/integration/
```

## Development

The project follows a modular architecture:

```
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
│       ├── middleware/
│       │   └── auth.py      # Authentication middleware
│       └── routes/
│           └── chat.py      # Chat endpoint definitions
├── tests/
│   ├── unit/                # Unit tests
│   ├── integration/         # Integration tests
│   └── conftest.py          # Test configuration
├── pyproject.toml           # Project dependencies and metadata
└── .env.example             # Example environment variables
```

## Security

- API key authentication required for all chat endpoints
- Request validation using Pydantic models
- Rate limiting can be added via middleware (not implemented yet)
- Input sanitization through Pydantic validation

## Performance

- Async implementation for handling concurrent requests
- Connection pooling for API calls
- Timeout configuration for external API calls
- Efficient request/response validation