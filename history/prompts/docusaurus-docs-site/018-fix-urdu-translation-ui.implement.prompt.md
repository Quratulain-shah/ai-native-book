---
id: "018"
title: "fix-urdu-translation-ui"
stage: "implement"
date: "2025-12-04"
surface: "agent"
model: "gemini-2.0-flash"
feature: "book-translation"
branch: "main"
user: "user"
command: "fix ui when translating to urdu"
labels: ["ui", "css", "react", "translation", "urdu", "rtl"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "src/css/custom.css"
  - "src/theme/components/PageTranslator.tsx"
tests: []
---

# Prompt
ok all good but when i am translating the page in urdu the ui is distrubing please fix it like ui will also look good woth urdu

# Response
Enhanced the Urdu translation experience by applying dedicated styling and RTL (Right-to-Left) direction support to correct the "disturbed" UI.

-   **CSS Updates (`src/css/custom.css`)**:
    -   Added the `.urdu-mode` class to apply the **Noto Nastaliq Urdu** font (imported from Google Fonts).
    -   Set `direction: rtl` and `text-align: right` for this class.
    -   Increased `line-height` to 2.2 to accommodate the taller vertical strokes of Urdu script.
-   **Component Logic (`PageTranslator.tsx`)**:
    -   Updated the translation handler to toggle the `.urdu-mode` class on the main content container when translation is active.
    -   Set the `dir="rtl"` attribute on the translated content container to ensure proper browser layout mirroring.
    -   Added cleanup logic to remove these classes/attributes when reverting to English.
