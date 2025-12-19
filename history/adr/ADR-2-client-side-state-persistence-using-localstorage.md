# ADR-2: Client-Side State Persistence Using LocalStorage

**Status**: Accepted
**Date**: 2025-12-18
**Authors**: [Author Name]

## Context

We need to implement user-specific features for the Robotics UI including text highlighting with color categories, floating dock position and configuration, and user preferences without implementing a backend authentication system. The features require persistence across page navigation and browser sessions but do not require synchronization across devices or users.

## Decision

We will use Browser LocalStorage to persist user-specific data keyed by URL. The stored data will include:

- Text highlights with position, content, color category, and associated page URL
- Floating dock state including visibility, position, collapsed state, and active tool
- User preferences such as theme selection, font size, and UI animation settings
- All data will be stored using URL-based keys to maintain per-page highlight persistence

## Consequences

### Positive
- Zero infrastructure requirements - no backend authentication or database needed
- Fast, synchronous access to user data without network requests
- Automatic persistence across browser sessions without user login
- Simple implementation with native browser APIs
- No server-side complexity or ongoing operational costs

### Negative
- Data does not sync across devices or browsers
- Data is lost when users clear browser cache or LocalStorage
- Limited storage capacity (typically 5-10MB per origin)
- No centralized backup or recovery mechanism
- Data tied to specific browser/OS combinations

## Alternatives

### Alternative 1: URL-based state persistence
- Encode user preferences and highlights in URL parameters
- **Rejected**: Would create unwieldy URLs and not work well for text highlights

### Alternative 2: IndexedDB for more complex storage
- Use IndexedDB for larger storage capacity and more complex queries
- **Rejected**: More complex implementation than needed for current requirements

### Alternative 3: Backend storage with authentication
- Implement user accounts and server-side storage
- **Rejected**: Significantly increases complexity and infrastructure requirements for minimal benefit

## References

- specs/001-ui-robotics-theme/plan.md
- specs/001-ui-robotics-theme/data-model.md
- specs/001-ui-robotics-theme/spec.md