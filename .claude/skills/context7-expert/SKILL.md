---
name: context7-expert
description: "A strict protocol for using Context7 tools to fetch accurate, up-to-date documentation without hallucinating library IDs."
---

# Context7 MCP Server Operational Protocol

## Core Purpose
This skill provides strict operational protocols for using the **Context7 MCP Server** to retrieve accurate, up-to-date documentation for RAG and coding tasks. The primary objective is to prevent hallucination of library IDs and ensure accurate retrieval of documentation through proper use of the available tools.

## Available Tools
- `mcp__context7__resolve-library-id`: Resolves library names to canonical IDs (e.g., "fastapi" → "/tiangolo/fastapi")
- `mcp__context7__get-library-docs`: Retrieves documentation for a library using its canonical ID

## Critical Constraint Protocol
**THE AGENT MUST NOT call `get-library-docs` with a guessed name (e.g., "fastapi").** The agent MUST follow this strict protocol:

1. **ALWAYS** use `resolve-library-id` first when the user provides a library name (not a canonical ID)
2. **ONLY** use `get-library-docs` with canonical IDs obtained from `resolve-library-id` or explicitly provided by the user
3. **NEVER** guess or hallucinate canonical IDs

## Mode Usage Guidelines

### `mode='code'`
- Use when you need code examples, API references, or implementation details
- Suitable for: code generation, API usage examples, implementation patterns
- Returns: Code snippets, function signatures, class definitions, method implementations

### `mode='info'`
- Use when you need conceptual information, documentation, or general knowledge
- Suitable for: Understanding library purpose, configuration options, architectural concepts
- Returns: Documentation text, explanations, best practices, conceptual overviews

## Step-by-Step Usage Protocol

### When User Provides a Library Name (Not Canonical ID)
1. **Call `resolve-library-id`** with the provided name
2. **Wait for the canonical ID response**
3. **Call `get-library-docs`** with the canonical ID from step 2
4. **Process the documentation** as needed

### When User Provides a Canonical ID
1. **Call `get-library-docs`** directly with the provided canonical ID
2. **Process the documentation** as needed

## Error Handling and Validation
- If `resolve-library-id` returns no results, inform the user that the library name could not be resolved
- If `get-library-docs` fails, check if the canonical ID is correct and try again
- Always validate that you're using canonical IDs (starting with "/") when calling `get-library-docs`

## Examples of Proper Usage

### Correct Usage:
```
User: "Show me FastAPI documentation"
Agent: Calls resolve-library-id("fastapi") → receives "/tiangolo/fastapi"
Agent: Calls get-library-docs("/tiangolo/fastapi", mode='info')
```

### Incorrect Usage (DO NOT DO THIS):
```
User: "Show me FastAPI documentation"
Agent: Calls get-library-docs("fastapi", mode='info') # WRONG - using guessed name
```

### Correct Direct Usage (when canonical ID provided):
```
User: "Show me documentation for /tiangolo/fastapi"
Agent: Calls get-library-docs("/tiangolo/fastapi", mode='info') # CORRECT - canonical ID provided
```

## Validation Checklist
Before using `get-library-docs`, verify:
- [ ] The identifier starts with "/"
- [ ] The identifier was obtained from `resolve-library-id` or explicitly provided by the user
- [ ] The identifier corresponds to a real library in the Context7 system

## Failure Prevention
- If uncertain about a library ID, always resolve it first
- If resolution fails, inform the user and ask for clarification
- Never attempt to "correct" a library name by guessing its canonical form
- When in doubt, use the resolution tool to confirm the correct ID

## Integration with RAG and Coding Tasks
- Use `mode='code'` when you need specific implementation details
- Use `mode='info'` when you need conceptual understanding
- Always ensure proper ID resolution before documentation retrieval
- Maintain the integrity of the tool chain to prevent hallucination of library information