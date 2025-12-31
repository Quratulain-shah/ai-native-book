---
name: fastapi-expert
description: "A definitive guide to high-performance, async-first FastAPI development using Pydantic v2 and Python 3.12+ standards."
---

# FastAPI Expert Skill Guide

## Overview
This skill defines the authoritative standards for developing production-hardened FastAPI applications using Python 3.12+, Pydantic v2, and async-first patterns. All backend implementations must adhere to these specifications for consistency, performance, and maintainability.

## Core Architecture Principles

### Async-First Design
- **Mandatory:** All route handlers must use `async def` unless interfacing with synchronous libraries
- **Pattern:** Leverage `asyncio.gather()` for concurrent operations
- **Constraint:** Never use `asyncio.run()` inside route handlers
- **Performance:** Use connection pooling for database operations

### Type Safety Mandates
- **Pydantic v2:** All request/response models must inherit from `BaseModel`
- **Strict Types:** Use `Annotated` with validators for enhanced type checking
- **Generic Models:** Implement `TypeVar` and `Generic` for reusable components
- **Union Types:** Use `Union[X, Y]` or `X | Y` syntax consistently

### Dependency Injection Framework
- **FastAPI DI:** Use `Depends()` for all service dependencies
- **Security Layer:** Implement `HTTPBearer` or `OAuth2PasswordBearer` for auth
- **State Management:** Use `Request.state` for request-scoped data
- **Lifecycle:** Leverage `lifespan` events for startup/shutdown

## Code Standards & Patterns

### Route Organization
```
# Standard route pattern
@app.post("/api/v1/resources/", response_model=ResourceResponse)
async def create_resource(
    request: Request,
    resource_input: ResourceCreate,
    current_user: User = Depends(get_current_user),
    db_session: AsyncSession = Depends(get_db_session)
) -> ResourceResponse:
    # Implementation
```

### Error Handling Protocol
- **HTTP Exceptions:** Use `HTTPException` with proper status codes
- **Custom Errors:** Define `BaseCustomException` hierarchy
- **Logging:** Integrate structured logging with correlation IDs
- **Validation:** Leverage Pydantic's validation errors automatically

### Database Integration
- **ORM:** SQLAlchemy 2.0+ with async support
- **Session Management:** Use `AsyncSession` with proper cleanup
- **Transaction Boundaries:** Implement transaction managers as dependencies
- **Connection Pooling:** Configure pool size based on expected load

## Performance Specifications

### Response Optimization
- **Streaming:** Use `StreamingResponse` for large data sets
- **Compression:** Enable gzip compression for responses >1KB
- **Caching:** Implement Redis-backed caching for read-heavy endpoints
- **Pagination:** Use cursor-based pagination for large collections

### Resource Management
- **Memory:** Implement streaming for file uploads/downloads
- **Timeouts:** Set appropriate timeout values for external calls
- **Rate Limiting:** Apply per-endpoint rate limiting using Redis
- **Connection Limits:** Configure max connections in ASGI server

## Security Framework

### Authentication & Authorization
- **Token Format:** JWT with proper signing algorithms (RS256 preferred)
- **Token Storage:** Secure cookies with HttpOnly and SameSite flags
- **Permission Checks:** Implement RBAC with role-based middleware
- **Session Management:** Use secure session storage with rotation

### Input Sanitization
- **Validation:** All inputs must pass Pydantic validation
- **SQL Injection:** Use SQLAlchemy's parameterized queries exclusively
- **XSS Prevention:** Automatically escape HTML in responses
- **Content Filtering:** Validate MIME types for file uploads

## Testing Standards

### Unit Testing Protocol
- **Framework:** pytest with asyncio support
- **Coverage:** Maintain 90%+ line coverage
- **Async Tests:** Use `pytest-asyncio` decorators properly
- **Fixtures:** Leverage pytest fixtures for test data setup

### Integration Testing
- **Database:** Use transaction rollback for clean state
- **External Services:** Mock external dependencies with `aioresponses`
- **Performance:** Include load testing scenarios
- **Security:** Test authz/authn flows comprehensively

## Monitoring & Observability

### Metrics Collection
- **Prometheus:** Expose `/metrics` endpoint with key indicators
- **Request Tracking:** Monitor response times and error rates
- **Database:** Track query performance and connection pool usage
- **Business Logic:** Instrument key business operations

### Logging Standards
- **Format:** Structured JSON logging with consistent schema
- **Levels:** Use appropriate log levels (DEBUG, INFO, WARN, ERROR)
- **Correlation:** Include request IDs for distributed tracing
- **PII Protection:** Never log sensitive user data

## Deployment Configuration

### Environment Management
- **Variables:** Use `pydantic-settings` for environment configuration
- **Secrets:** Secure secret management via vault or environment
- **Feature Flags:** Implement toggle system for gradual rollouts
- **Health Checks:** Include readiness/liveness endpoints

### Scalability Patterns
- **Horizontal Scaling:** Design stateless services where possible
- **Load Balancing:** Support multiple worker processes
- **Database Sharding:** Plan for horizontal partitioning
- **CDN Integration:** Optimize static asset delivery

## Quality Assurance Checklist

### Pre-Deployment Validation
- [ ] All endpoints have proper type hints and Pydantic models
- [ ] Error handling covers all expected failure scenarios
- [ ] Security headers are properly configured
- [ ] Performance benchmarks meet requirements
- [ ] Documentation is generated and accurate
- [ ] Tests pass with 90%+ coverage
- [ ] Security scanning shows no critical vulnerabilities

### Production Readiness
- [ ] Monitoring and alerting are configured
- [ ] Backup and recovery procedures are documented
- [ ] Capacity planning aligns with expected load
- [ ] Disaster recovery plan is in place
- [ ] Compliance requirements are met

## Anti-Patterns to Avoid

- **Sync Operations:** Blocking I/O in async handlers
- **Global State:** Mutable global variables in application scope
- **Memory Leaks:** Unclosed database connections or file handles
- **Over-fetching:** Selecting unnecessary columns from database
- **Hardcoded Values:** Magic numbers or strings in business logic
- **Nested Transactions:** Complex transaction nesting patterns

## Best Practices Summary

- **Minimalism:** Implement only required functionality initially
- **Extensibility:** Design for easy feature addition in Phase 2
- **Consistency:** Follow established patterns throughout codebase
- **Documentation:** Auto-generate API docs using FastAPI's capabilities
- **Testing:** Practice TDD for critical business logic
- **Monitoring:** Instrument everything that can fail

This skill ensures all FastAPI development adheres to production-grade standards while maintaining the flexibility for future enhancements.