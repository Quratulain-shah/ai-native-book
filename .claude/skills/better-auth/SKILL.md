---
name: better-auth
description: "A strict security and implementation guide for Better Auth, focusing on schema extension for personalization and seamless Express.js integration."
---

# Better Auth Architect Implementation Guide

## Problem Statement
Implement robust authentication using Better Auth with Express.js, ensuring secure user signup/signin flows while capturing essential "Personalization Data" (specifically "Software and Hardware Background") during registration. This implementation must follow security best practices and leverage Better Auth's schema extension capabilities.

## Questions & Constraints
- **Critical Requirement**: The signup flow MUST capture and store the user's "Software and Hardware Background"
- **Tech Stack**: Node.js, Express.js, Better Auth with NeonDB adapter
- **Security**: Must implement industry-standard authentication security practices
- **Schema Extension**: Properly extend the user schema to accommodate custom fields
- **Express Integration**: Seamless integration with Express.js middleware patterns
- **Data Persistence**: Ensure custom fields are properly stored and retrieved

## Proposed Solution
Implement Better Auth with a customized user schema that extends the default model to include personalization data fields. This approach ensures that user signup flows collect the required "Software and Hardware Background" information while maintaining security and performance standards.

## Core Architecture Principles

### Schema Extension Protocol
- **Mandatory Extension**: Extend the default user schema to include `software_hardware_background` field
- **Field Validation**: Implement proper validation for the personalization data field
- **Database Mapping**: Ensure NeonDB adapter correctly maps extended schema fields
- **Migration Strategy**: Plan for schema evolution without data loss

### Security Framework
- **Password Hashing**: Use Better Auth's built-in password hashing (bcrypt/scrypt)
- **JWT Management**: Implement secure token generation and validation
- **Session Security**: Configure secure cookie settings with HttpOnly and SameSite flags
- **Rate Limiting**: Implement account creation and authentication attempt limits
- **Input Sanitization**: Validate all user inputs including custom fields

### Express.js Integration
- **Middleware Pattern**: Integrate Better Auth with Express middleware flow
- **Route Protection**: Implement proper authentication guards for protected routes
- **Error Handling**: Centralized error handling for authentication failures
- **Request Context**: Maintain authentication state in request objects

## Schema Extension Implementation

### Custom User Model Definition
```
// Define the extended user schema to capture personalization data
const customSchema = {
  user: {
    fields: {
      software_hardware_background: {
        type: "string",
        required: true,  // Critical for personalization
        validation: {
          minLength: 10,  // Ensure meaningful background information
          maxLength: 500  // Prevent excessively large inputs
        }
      },
      // Additional personalization fields can be added here
      // e.g., interests, skill_level, goals, etc.
    }
  }
};
```

### NeonDB Adapter Configuration
- **Connection Setup**: Secure NeonDB connection with proper SSL configuration
- **Schema Sync**: Ensure custom schema fields are properly reflected in the database
- **Indexing**: Create appropriate indexes for custom fields used in queries
- **Migration Handling**: Plan for schema migrations when extending user model

## Implementation Standards

### Authentication Flow Requirements
1. **Signup Process**:
   - Collect email, password, and required personalization data
   - Validate all inputs before database persistence
   - Send confirmation emails if required

2. **Signin Process**:
   - Verify credentials securely
   - Generate appropriate session tokens
   - Log authentication events for security monitoring

3. **Profile Management**:
   - Allow users to update personalization data
   - Maintain data integrity and validation
   - Implement proper access controls

### Session Management
- **Token Lifecycle**: Define appropriate token expiration times
- **Refresh Mechanism**: Implement secure token refresh flows
- **Concurrent Sessions**: Handle multiple device sessions appropriately
- **Logout Process**: Invalidate all associated tokens and sessions

### Error Handling & Validation
- **Authentication Errors**: Distinguish between credential errors and system errors
- **Validation Messages**: Provide clear feedback for schema validation failures
- **Security Logging**: Log authentication attempts for security analysis
- **Graceful Degradation**: Handle authentication service failures appropriately

## Security Best Practices

### Password Security
- **Strength Requirements**: Enforce strong password policies
- **Hashing Algorithm**: Use industry-standard bcrypt or scrypt
- **Breached Password Check**: Integrate with breach databases to prevent compromised passwords
- **Rotation Policy**: Implement password rotation recommendations

### Session Security
- **CSRF Protection**: Implement CSRF tokens for state-changing operations
- **Session Timeout**: Configure appropriate session duration limits
- **Device Tracking**: Track and validate user devices/locations when possible
- **Anomaly Detection**: Monitor for unusual authentication patterns

### Data Protection
- **Encryption at Rest**: Ensure database encryption for sensitive data
- **Field-Level Security**: Protect personalization data with appropriate access controls
- **Audit Trail**: Maintain logs of data access and modifications
- **GDPR Compliance**: Implement data deletion and portability features

## Quality Assurance Checklist

### Pre-Implementation Validation
- [ ] Schema extension capability confirmed with Better Auth version
- [ ] NeonDB adapter compatibility verified
- [ ] Custom field validation rules defined
- [ ] Security requirements documented and assigned
- [ ] Express.js integration pattern established
- [ ] Testing strategy for authentication flows planned

### Implementation Validation
- [ ] Custom schema fields properly persisted in NeonDB
- [ ] Signup flow captures required personalization data
- [ ] Authentication tokens generated and validated correctly
- [ ] Error handling covers all authentication scenarios
- [ ] Security headers properly configured
- [ ] Session management follows best practices

### Post-Implementation Validation
- [ ] Personalization data accessible in authenticated contexts
- [ ] Database schema reflects extended user model
- [ ] Performance benchmarks meet requirements
- [ ] Security scanning shows no critical vulnerabilities
- [ ] User registration flow properly validates custom fields
- [ ] Integration tests pass for all authentication scenarios

## Testing Requirements

### Unit Testing
- **Schema Validation**: Test custom field validation rules
- **Authentication Logic**: Verify signin/signup business logic
- **Session Management**: Test token generation and validation
- **Error Scenarios**: Cover all authentication failure cases

### Integration Testing
- **Database Integration**: Verify custom fields in NeonDB
- **Express Middleware**: Test authentication middleware integration
- **End-to-End Flows**: Complete signup/signin/user profile workflows
- **Security Testing**: Validate protection against common attacks

## Monitoring & Observability

### Authentication Metrics
- **Success/Failure Rates**: Track authentication success ratios
- **Response Times**: Monitor authentication endpoint performance
- **User Registration**: Track new user creation with personalization data
- **Session Activity**: Monitor active session counts and patterns

### Security Monitoring
- **Brute Force Attempts**: Detect and alert on repeated authentication failures
- **Suspicious Logins**: Flag unusual geographic or device patterns
- **Data Access**: Monitor access to personalization data
- **System Health**: Track authentication service availability

## Anti-Patterns to Avoid

- **Insecure Storage**: Never store sensitive data without proper encryption
- **Weak Validation**: Always validate custom schema fields with appropriate constraints
- **Session Hijacking**: Never expose session tokens in URLs or unsafe storage
- **Missing Rate Limits**: Always implement rate limiting for authentication endpoints
- **Insufficient Logging**: Log all authentication events for security analysis
- **Hardcoded Credentials**: Use proper secret management for database connections

## Deployment Considerations

### Environment Configuration
- **Database Connection**: Secure NeonDB connection strings with environment variables
- **Authentication Secrets**: Properly manage JWT signing keys and other secrets
- **Domain Configuration**: Configure proper domains for cookie security
- **HTTPS Enforcement**: Ensure all authentication flows use HTTPS

### Scalability Patterns
- **Session Storage**: Plan for distributed session storage if scaling horizontally
- **Database Connections**: Configure appropriate connection pooling
- **Caching Strategy**: Implement appropriate caching for authentication data
- **Load Distribution**: Consider authentication service load distribution patterns

## Phase 6 Implementation Steps

1. **Setup Better Auth with Express.js**:
   - Initialize Better Auth in Express application
   - Configure NeonDB adapter
   - Define extended user schema with personalization fields

2. **Implement Signup Flow**:
   - Create signup endpoint that collects personalization data
   - Validate and store custom fields in extended schema
   - Test successful user creation with custom data

3. **Implement Signin Flow**:
   - Create secure signin functionality
   - Verify custom field accessibility post-authentication
   - Test session management with extended user data

4. **Integrate with Application**:
   - Connect authentication with application's user context
   - Ensure personalization data is accessible to application features
   - Test complete authentication lifecycle

This skill ensures all Better Auth implementations follow security-first principles while properly capturing the required personalization data during user registration.