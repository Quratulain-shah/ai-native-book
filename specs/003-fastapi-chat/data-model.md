# Data Model: FastAPI Chat Backend with Gemini Integration

**Feature**: FastAPI Chat Backend with Gemini Integration
**Date**: 2025-12-17
**Modeler**: Claude Code

## 1. Data Entities

### 1.1 MessageRequest
**Purpose**: Represents the input from a user to the chat service

| Field | Type | Validation | Description |
|-------|------|------------|-------------|
| message | string | Required, min_length=1, max_length=10000 | The user's input message text |
| conversation_id | string (optional) | UUID format if provided | Identifier for maintaining conversation context |
| metadata | object (optional) | - | Additional context data for the request |

**Example**:
```json
{
  "message": "Hello, how are you today?",
  "conversation_id": "123e4567-e89b-12d3-a456-426614174000",
  "metadata": {
    "user_id": "user123",
    "timestamp": "2025-12-17T10:00:00Z"
  }
}
```

### 1.2 MessageResponse
**Purpose**: Represents the AI-generated response from the chat service

| Field | Type | Validation | Description |
|-------|------|------------|-------------|
| response | string | Required | The AI-generated response text |
| conversation_id | string | UUID format | Identifier for maintaining conversation context |
| timestamp | string | ISO 8601 format | Time when the response was generated |
| model_used | string | Required | Name of the model that generated the response |
| tokens_used | object (optional) | - | Information about token usage |

**Example**:
```json
{
  "response": "Hello! I'm doing well, thank you for asking. How can I assist you today?",
  "conversation_id": "123e4567-e89b-12d3-a456-426614174000",
  "timestamp": "2025-12-17T10:00:05Z",
  "model_used": "gemini-2.5-flash",
  "tokens_used": {
    "input_tokens": 15,
    "output_tokens": 32
  }
}
```

## 2. API Request/Response Schema

### 2.1 POST /chat Request Schema
- **Method**: POST
- **Path**: /chat
- **Content-Type**: application/json
- **Authentication**: Required (API key in header)

### 2.2 POST /chat Response Schema
- **Success Response**: 200 OK
- **Content-Type**: application/json
- **Error Responses**:
  - 400 Bad Request (invalid input)
  - 401 Unauthorized (missing/invalid API key)
  - 422 Unprocessable Entity (validation errors)
  - 500 Internal Server Error (system errors)

## 3. Configuration Data

### 3.1 Environment Variables
| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| GEMINI_API_KEY | string | Yes | API key for accessing Gemini service |
| GEMINI_BASE_URL | string | No | Base URL for Gemini API (default: Google's endpoint) |
| MODEL_NAME | string | No | Model name to use (default: gemini-2.5-flash) |
| API_TIMEOUT | integer | No | Request timeout in seconds (default: 30) |
| MAX_MESSAGE_LENGTH | integer | No | Maximum allowed message length (default: 10000) |

### 3.2 Internal Configuration
| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| agent_temperature | float | 0.7 | Controls randomness in AI responses |
| agent_max_tokens | integer | 1000 | Maximum tokens in AI response |
| agent_top_p | float | 0.9 | Controls diversity of AI responses |

## 4. Data Flow

### 4.1 Request Flow
1. Client sends MessageRequest to POST /chat endpoint
2. Request validated against MessageRequest schema
3. API key validated for authentication
4. MessageRequest processed by agent service
5. Agent generates response using configured model
6. Response formatted as MessageResponse
7. MessageResponse returned to client

### 4.2 Error Flow
1. If validation fails, return 422 with validation errors
2. If authentication fails, return 401
3. If agent processing fails, return 500 with error details
4. If timeout occurs, return 408 Request Timeout

## 5. Validation Rules

### 5.1 Input Validation
- Message length must be between 1 and MAX_MESSAGE_LENGTH characters
- Conversation ID must be a valid UUID if provided
- Request must contain required fields
- JSON must be properly formatted

### 5.2 Business Validation
- API key must be valid and active
- Request rate must be within allowed limits
- Message content must not contain blocked content (if implemented)

## 6. Extensibility Considerations

### 6.1 Future Fields
The data models are designed to accommodate future enhancements:
- MessageRequest can include additional metadata fields
- MessageResponse can include additional analytics fields
- Configuration can support additional model parameters

### 6.2 Versioning
- API versioning through path (e.g., /v1/chat) to support future schema changes
- Backward compatibility maintained for existing fields
- New optional fields added without breaking existing clients