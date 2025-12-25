---
id: "009"
title: "Fix Tailwind v4 Configuration"
stage: "implementation"
date: "2025-12-06"
surface: "agent"
model: "gemini-2.0-flash-exp"
feature: "docusaurus-docs-site"
branch: "main"
user: "user"
command: "fix_error"
labels: ["tailwind", "css", "configuration", "v4"]
links:
  spec: "null"
  ticket: "null"
  adr: "null"
  pr: "null"
files:
  - "package.json"
  - "postcss.config.js"
  - "src/css/custom.css"
tests:
  - "npm install"
prompt: |
  Error: It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin...
response: |
  Fixed Tailwind CSS v4 configuration errors.
  1.  **Dependencies:** Installed `@tailwindcss/postcss` (required for v4).
  2.  **PostCSS Config:** Updated `postcss.config.js` to use `"@tailwindcss/postcss"` instead of `"tailwindcss"`.
  3.  **CSS Import:** Updated `src/css/custom.css` to use the v4 standard `@import "tailwindcss";` instead of the deprecated `@tailwind` directives.
---
