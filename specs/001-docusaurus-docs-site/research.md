# Research: Docusaurus Documentation Site

## Decision: Docusaurus Content Structure

**Decision**: The documentation will be structured using Docusaurus's **Docs-Only Mode** to maximize content focus. The sidebar will be defined in `sidebars.js` and managed with auto-generated categories using `_category_.json` files within subdirectories.

**Rationale**: This structure is the most idiomatic for Docusaurus when dealing with non-API documentation, and it directly supports **Principle II (Structure Follows Content)** by making the navigation highly configurable to match the book's outline. Docs-Only Mode is the simplest setup, adhering to **Principle III (Simplicity and Maintainability)**.

**Alternatives considered**:
1.  **Blog Mode/Pages**: Rejected because the content is a sequential course/book, not a collection of blog posts or static pages.
2.  **Highly Custom React Components**: Rejected to avoid breaking **Principle III** and increasing hackathon complexity. We will rely on MDX and standard Docusaurus/Remark features.

## Decision: Project Tooling

**Decision**: Use `npm` for package management and standard Docusaurus CLI commands (`docusaurus start`, `docusaurus build`).

**Rationale**: `npm` is the standard for Docusaurus/React projects. No complex build tools or custom pipelines are required, ensuring compliance with **Principle III**.
