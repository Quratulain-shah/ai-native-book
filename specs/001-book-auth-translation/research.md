# Research for Rich Content, Authentication, and Book Translation

This document summarizes the research and decisions made for the technical implementation of the feature.

## 1. Google Social Login with FastAPI

**Decision**: We will use the **Better Auth API** (`/websites/dev_api_fdsfi_v1_auth`) for implementing Google social login.

**Rationale**: The user specifically requested to use "Better Auth" and the `context7` tools. The Better Auth API provides a straightforward `POST /sign-in/social` endpoint that handles the complexities of the OAuth2 flow. This approach is aligned with the user's request and simplifies the backend implementation. Our FastAPI backend will act as a client to this API.

**Alternatives considered**:
- **Authlib**: A comprehensive OAuth library. While powerful, it would require more implementation effort on the backend to handle the OAuth2 flow manually.
- **fastapi-sso**: A simpler library for social logins. While a good option, the user's preference for "Better Auth" makes it the primary choice.

## 2. Rich Text Editor for Docusaurus (React)

**Decision**: We will use **MDXEditor** as the rich text editor.

**Rationale**: Docusaurus is built around Markdown and MDX. MDXEditor is a React component specifically designed for a WYSIWYG editing experience that natively outputs Markdown. This is the most seamless and maintainable approach for a Docusaurus project. It will allow content creators to easily create rich content without needing to know Markdown syntax.

**Alternatives considered**:
- **Slate.js, Quill, CKEditor**: These are powerful general-purpose rich text editors. However, they primarily output HTML, which would require a conversion step to Markdown, adding complexity and potential for formatting issues.

## 3. Translation API for FastAPI Backend

**Decision**: We will use the `googletrans` Python library for the initial prototype.

**Rationale**: For a hackathon or prototype context, a free and easy-to-use library is ideal. `googletrans` is a free and unlimited library that is simple to integrate. However, it is an unofficial library and not recommended for production due to potential instability. This decision aligns with the "Simplicity and Maintainability (Hackathon Scope)" principle in the constitution. For a production system, we would use a paid, official API like the Google Cloud Translation API or DeepL.

**Alternatives considered**:
- **DeepL API**: High-quality translation, but it is a paid service.
- **Google Cloud Translation API**: Official and reliable, but also a paid service.

## 4. Storage of Translated Documents

**Decision**: We will use the **Separate Translation Tables** approach.

**Rationale**: This is a clean, relational, and scalable approach. We will create a `translations` table that has a foreign key relationship with the `books` table. This allows us to store multiple translations for each book without cluttering the `books` table. It's a normalized and flexible design that can easily accommodate new languages in the future.

**Alternatives considered**:
- **JSONB Fields**: Storing translations in a JSONB field in the `books` table would be another good option, especially with PostgreSQL. However, the separate table approach is more traditional and might be easier to reason about for developers new to the project.
- **Column per Language**: This approach is not scalable and would require schema changes every time a new language is added.
