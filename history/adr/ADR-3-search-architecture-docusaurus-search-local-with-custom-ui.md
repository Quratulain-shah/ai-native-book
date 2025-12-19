# ADR-3: Search Architecture - Docusaurus Search Local with Custom UI

**Status**: Accepted
**Date**: 2025-12-18
**Authors**: [Author Name]

## Context

We need to implement "Instant Search" functionality with term highlighting for the Robotics Learning Platform, which is a static Docusaurus site. The search must work offline, provide instant results (under 500ms), highlight search terms in content, and support filtering by Module/Chapter. The platform has extensive documentation content that needs to be searchable with a futuristic UI that matches the "Robot OS" theme.

## Decision

We will use the `docusaurus-search-local` plugin with a custom UI wrapper (`RoboticsSearchModal`) to achieve instant search functionality. The approach includes:

- Using `docusaurus-search-local` for full-text indexing of site content
- Implementing a custom `RoboticsSearchModal` component with Cmd+K trigger
- Adding search result highlighting functionality within content pages
- Creating custom filtering by Module/Chapter in the search UI
- Applying futuristic styling to match the Robotics OS theme

## Consequences

### Positive
- Zero-latency search once the index is loaded in the browser
- No external dependencies or API calls required
- Full offline functionality
- Automatic indexing of all Docusaurus content
- Customizable UI to match the futuristic theme
- No ongoing operational costs for search infrastructure

### Negative
- Search index is downloaded to the client (performance impact on large sites)
- Initial load time increases due to search index download
- Index size grows with content, potentially affecting initial page load
- No advanced search features like fuzzy matching or synonyms
- Search index update requires site rebuild and redeployment

## Alternatives

### Alternative 1: Algolia DocSearch
- Professional search solution with advanced features
- **Rejected**: Requires external dependency, API keys, and potential costs; doesn't match self-contained approach

### Alternative 2: Custom search with Fuse.js
- Build custom search functionality with more control
- **Rejected**: More development time required; loses Docusaurus integration benefits

### Alternative 3: Server-side search API
- Implement search on a backend service
- **Rejected**: Adds infrastructure complexity and network latency; contradicts static site approach

## References

- specs/001-ui-robotics-theme/plan.md
- specs/001-ui-robotics-theme/spec.md
- specs/001-ui-robotics-theme/research.md