# Quickstart Guide: FastAPI Chat Backend with Groq Integration

**Feature**: FastAPI Chat Backend with Groq Integration
**Date**: 2025-12-17
**Version**: 1.0

## Overview
This guide provides quick setup instructions for the FastAPI-based chat backend that integrates with the Llama3-8b-8192 model using the OpenAI Agents SDK.

## Prerequisites
- Python 3.12 or higher
- `uv` package manager installed
- Valid GROQ_API_KEY from Groq Cloud

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Setup Environment
```bash
# Create virtual environment and install dependencies
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install project dependencies
uv pip install -e .
```

### 3. Configure Environment Variables
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your Groq API key
nano .env  # or use your preferred editor
```

Example `.env` file:
```
GROQ_API_KEY=your_actual_groq_api_key_here
GROQ_BASE_URL=https://api.groq.com/openai/v1
MODEL_NAME=llama3-8b-8192
API_TIMEOUT=30
MAX_MESSAGE_LENGTH=10000
```

## Running the Application

### Development Mode
```bash
# Activate virtual environment
source .venv/bin/activate

# Run the application
uv run uvicorn backend.src.main:app --reload --host 0.0.0.0 --port 8000
```

### Production Mode
```bash
# Activate virtual environment
source .venv/bin/activate

# Run with production server
uv run uvicorn backend.src.main:app --host 0.0.0.0 --port 8000
```

## API Usage

### Send a Chat Message
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $GROQ_API_KEY" \
  -d '{
    "message": "Hello, how are you?",
    "conversation_id": "123e4567-e89b-12d3-a456-426614174000"
  }'
```

### Expected Response
```json
{
  "response": "Hello! I'm doing well, thank you for asking. How can I assist you today?",
  "conversation_id": "123e4567-e89b-12d3-a456-426614174000",
  "timestamp": "2025-12-17T10:00:05Z",
  "model_used": "llama3-8b-8192",
  "tokens_used": {
    "input_tokens": 15,
    "output_tokens": 32
  }
}
```

## Testing

### Run Unit Tests
```bash
# Activate virtual environment
source .venv/bin/activate

# Run all tests
uv run pytest

# Run specific test file
uv run pytest tests/unit/test_agent.py

# Run with coverage
uv run pytest --cov=backend.src
```

### Run Integration Tests
```bash
uv run pytest tests/integration/
```

## Project Structure
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
│       └── routes/
│           └── chat.py      # Chat endpoint definitions
├── tests/
│   ├── unit/
│   ├── integration/
│   └── conftest.py
├── pyproject.toml
└── .env.example
```

## Configuration Options

| Environment Variable | Default | Description |
|---------------------|---------|-------------|
| GROQ_API_KEY | - | Required API key for Groq service |
| GROQ_BASE_URL | https://api.groq.com/openai/v1 | Groq API base URL |
| MODEL_NAME | llama3-8b-8192 | Model to use for responses |
| API_TIMEOUT | 30 | Request timeout in seconds |
| MAX_MESSAGE_LENGTH | 10000 | Maximum message length allowed |

## Troubleshooting

### Common Issues

1. **API Key Error**
   - Ensure GROQ_API_KEY is properly set in environment
   - Verify the API key is valid and has proper permissions

2. **Connection Timeout**
   - Check internet connectivity
   - Verify Groq API endpoints are accessible
   - Adjust API_TIMEOUT if needed

3. **Validation Errors**
   - Check that request JSON matches expected schema
   - Ensure message field is provided and not empty

### Enable Debug Logging
```bash
export LOG_LEVEL=DEBUG
uv run uvicorn backend.src.main:app --reload
```

## Next Steps

1. Review the API documentation at `http://localhost:8000/docs`
2. Explore the code structure in the `backend/src/` directory
3. Run the full test suite to verify functionality
4. Customize configuration for your specific use case