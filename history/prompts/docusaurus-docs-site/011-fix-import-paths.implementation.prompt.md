---
id: "011"
title: "Fix Component Import Paths"
stage: "implementation"
date: "2025-12-06"
surface: "agent"
model: "gemini-2.0-flash-exp"
feature: "docusaurus-docs-site"
branch: "main"
user: "user"
command: "replace"
labels: ["react", "docusaurus", "webpack", "fix"]
links:
  spec: "null"
  ticket: "null"
  adr: "null"
  pr: "null"
files:
  - "src/components/SplineSceneBasic.tsx"
  - "src/components/ui/spotlight.tsx"
  - "src/components/ui/card.tsx"
tests:
  - "manual verification"
prompt: |
  Compiled with problems: ERROR in ./src/components/SplineSceneBasic.tsx... Can't resolve '@/components/ui/splite'...
  [Error log from user]
response: |
  Fixed "Module not found" errors by switching from absolute `@/` paths to relative import paths. Docusaurus Webpack config often requires explicit setup for custom path aliases, so relative paths are safer and more immediate.
  1.  **SplineSceneBasic.tsx:** Updated imports to `./ui/splite`, `./ui/card`, `./ui/spotlight`.
  2.  **spotlight.tsx:** Updated utility import to `../../lib/utils`.
  3.  **card.tsx:** Updated utility import to `../../lib/utils`.
---
