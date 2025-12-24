---
id: "012"
title: "Disable Tailwind Preflight"
stage: "fix"
date: "2025-12-06"
surface: "agent"
model: "gemini-2.0-flash-exp"
feature: "docusaurus-docs-site"
branch: "main"
user: "user"
command: "replace"
labels: ["css", "tailwind", "docusaurus", "fix"]
links:
  spec: "null"
  ticket: "null"
  adr: "null"
  pr: "null"
files:
  - "src/css/custom.css"
tests:
  - "manual verification"
prompt: |
  i was makimg the hero section more good through using antiravity it maked the hero section but it changed the ui of book also it chnage the ui of 2 sections bealow the hero section please make it in the last form
response: |
  Fixed UI regressions in non-Tailwind components (Book, FeatureHighlights) caused by Tailwind's preflight reset.
  1.  **Identified Issue:** Tailwind v4's default `@import "tailwindcss";` includes a comprehensive reset (preflight) that conflicts with Docusaurus's Infima styles, breaking headings, lists, and buttons in existing components.
  2.  **Applied Fix:** Modified `src/css/custom.css` to import only `@import "tailwindcss/theme";` and `@import "tailwindcss/utilities";`. This excludes the `base` layer (preflight), preserving the original Docusaurus styling while still allowing Tailwind utility classes for the new hero section.
---
