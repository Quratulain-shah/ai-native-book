---
id: "004-remove-placeholder-image"
title: "Remove Placeholder Image from Spline Loader"
stage: "refactor"
date: "2025-12-07"
surface: "agent"
model: "gemini-2.0-flash-thinking-exp"
feature: "docusaurus-docs-site"
branch: "main"
user: "User"
command: "remove-placeholder-image"
labels:
  - "performance"
  - "ux"
  - "docusaurus"
  - "3d"
  - "spline"
files:
  - "src/components/ui/splite.tsx"
tests: []
prompt: |
  i think image is not required we can just show the loader
response: |
  Removed the placeholder image (`robo.png`) from the Spline scene loading overlay in `src/components/ui/splite.tsx`. Now only the CSS spinner will be displayed while the 3D model loads.
---
