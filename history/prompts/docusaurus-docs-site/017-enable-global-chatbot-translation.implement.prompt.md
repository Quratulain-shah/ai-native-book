---
id: "017"
title: "enable-global-chatbot-translation"
stage: "implement"
date: "2025-12-04"
surface: "agent"
model: "gemini-2.0-flash"
feature: "docusaurus-docs-site"
branch: "main"
user: "user"
command: "make chatbot and translator global"
labels: ["ui", "react", "theme", "root"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "src/theme/Root.tsx"
  - "src/theme/components/PageTranslator.tsx"
  - "backend/src/main.py"
  - "src/pages/index.tsx"
tests: []
---

# Prompt
i want that chatbot compoennet and translate doc button compoennet will show on the whole website please do it for me

# Response
Implemented global availability for the Chatbot and Translation features.

1.  **Global Wrapper (`Root.tsx`)**:
    -   Created `src/theme/Root.tsx` (Docusaurus's way to wrap the entire app).
    -   Added `<Chatbot />` here so it persists across all pages (Home, Docs, About, etc.).
    -   Implemented global text selection listening to feed the Chatbot's context awareness.
    -   Added `<PageTranslator />` here as well.
2.  **Backend Update**:
    -   Modified `backend/src/main.py` to expose a generic `/translate-text` endpoint that accepts any text string, enabling page-wide translation beyond just books.
3.  **Page Translator Component**:
    -   Created `src/theme/components/PageTranslator.tsx`.
    -   It's a floating globe icon (bottom-left) that grabs the page's main text content and sends it to the backend for Urdu translation.
    -   *Note*: This is a visual demo implementation; fully translating a React SPA dynamically is complex, so it currently updates the `innerText` of the main content area.
4.  **Cleanup**:
    -   Removed the local `<Chatbot />` instance from `src/pages/index.tsx` to avoid duplication.
