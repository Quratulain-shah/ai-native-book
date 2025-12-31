# Implementation Plan: AI-Powered Textbook Search with Semantic Understanding

**Feature**: 004-rag-qdrant-gemini
**Created**: 2025-12-19
**Status**: Draft
**Author**: @-backend-agent

## Overview

This plan outlines the minimalistic implementation of a RAG (Retrieval-Augmented Generation) system using Qdrant Cloud and Google's Gemini embeddings. The system will allow users to search textbook content semantically through an AI agent interface.

## Architecture

### Core Components
- **Qdrant Client**: Async client for vector database operations
- **Gemini Client**: For generating embeddings and semantic representations
- **Ingestion Module**: Handles text chunking and database upsertion
- **Search Tool**: Standalone function for semantic search functionality
- **Agent Integration**: Extension of existing AI agent with search capability

### Technology Stack
- **Primary**: Python 3.12+, FastAPI
- **Vector DB**: Qdrant Cloud (qdrant-client)
- **Embeddings**: Google Gemini (google-generativeai)
- **Dependencies to add**: `qdrant-client`, `google-generativeai`
- **Dependencies to avoid**: `langchain`, `llama-index`, `unstructured`

## Implementation Phases

### Phase 1: Infrastructure Setup

#### 1.1 Environment Configuration
- Add QDRANT_URL and QDRANT_API_KEY to environment variables
- Update .env.example with new variables
- Add validation for required environment variables

#### 1.2 Qdrant Client Initialization
- Create async QdrantClient instance with cloud connection
- Initialize collection for textbook content (with vector size matching Gemini embeddings)
- Add connection validation and error handling

#### 1.3 Gemini Client Setup
- Initialize Google Generative AI client for embedding generation
- Create utility function for generating embeddings from text
- Add rate limiting and error handling for API calls

**Deliverables**:
- Environment variable setup
- Qdrant client with collection initialization
- Gemini client with embedding utilities

### Phase 2: Ingestion Logic

#### 2.1 Text Chunking Function
- Create simple chunking function that splits text by paragraphs or fixed character limits
- Ensure chunks are appropriately sized for embedding models
- Add basic validation for chunk size and content

#### 2.2 Embedding Generation
- Create async function to generate embeddings for text chunks using Gemini
- Handle batch processing of multiple chunks with asyncio.gather
- Implement retry logic for API failures

#### 2.3 Database Upsert Operation
- Create function to upsert text chunks with embeddings to Qdrant
- Store original text content as payload with metadata
- Add progress tracking and error handling

#### 2.4 Ingestion Endpoint
- Create POST /ingest endpoint in FastAPI
- Validate incoming content structure
- Process text through chunking → embedding → upsert pipeline
- Return ingestion status and statistics

**Deliverables**:
- Text chunking utility
- Async embedding generation with batch processing
- Database upsert functionality
- Ingestion API endpoint

### Phase 3: Tool Creation

#### 3.1 Search Function Implementation
- Create standalone `search_textbook(query: str)` function
- Generate embedding for query using Gemini
- Perform semantic search in Qdrant to retrieve top 3 results
- Return relevant text chunks as formatted string

#### 3.2 Tool Decoration
- Decorate search function with appropriate tool decorator
- Define function schema for agent consumption
- Add error handling and fallback responses

#### 3.3 Agent Integration
- Update existing OpenAI Agent to include search_textbook in toolset
- Configure agent to autonomously decide when to use the search tool
- Test integration with existing conversation flow

**Deliverables**:
- Standalone search_textbook function with tool decoration
- Agent integration with autonomous decision-making
- End-to-end search functionality

### Phase 4: Testing

#### 4.1 Unit Tests
- Test chunking function with various text inputs
- Test embedding generation utilities
- Test search function with mock Qdrant responses

#### 4.2 Integration Tests
- Test Qdrant connection and collection operations
- Test end-to-end ingestion workflow
- Test search functionality with real data

#### 4.3 Performance Tests
- Test batch processing performance for ingestion
- Test search response times
- Validate concurrent request handling

**Deliverables**:
- Comprehensive unit test suite
- Integration tests for all major components
- Performance benchmarks

## Dependencies to Add

- `qdrant-client`: For vector database operations
- `google-generativeai`: For embedding generation

## Risk Mitigation

- **API Rate Limits**: Implement retry logic and rate limiting for Gemini API calls
- **Database Connection**: Add connection pooling and health checks for Qdrant
- **Data Consistency**: Implement proper error handling during ingestion to prevent partial data
- **Performance**: Use asyncio.gather for batch operations to optimize throughput

## Success Criteria

- Ingestion endpoint successfully processes and stores textbook content
- Search function returns relevant results within 5 seconds
- AI agent autonomously uses search functionality when appropriate
- All tests pass with 90%+ code coverage