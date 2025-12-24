---
id: "007"
title: "Add Spline 3D Hero Component"
stage: "implementation"
date: "2025-12-06"
surface: "agent"
model: "gemini-2.0-flash-exp"
feature: "docusaurus-docs-site"
branch: "main"
user: "user"
command: "replace"
labels: ["21st.dev", "spline", "react", "docusaurus"]
links:
  spec: "null"
  ticket: "null"
  adr: "null"
  pr: "null"
files:
  - "package.json"
  - "src/components/SplineScene.tsx"
  - "src/pages/index.module.css"
  - "src/pages/index.tsx"
tests:
  - "npm install"
  - "manual verification"
prompt: |
  can you find any componenet name with spline scene ??
  https://21st.dev/community/components/serafim/splite/default this is the componenet i want to use this in my docussaurus frontent hero section but contetnt will according to my wesbite
response: |
  Integrated the `SplineScene` component from 21st.dev (serafim/splite) into the Docusaurus homepage.
  1.  **Fetched Component:** Retrieved the source code for `SplineScene`.
  2.  **Installed Dependencies:** Added `@splinetool/react-spline` and `@splinetool/runtime`.
  3.  **Created Component:** Created `src/components/SplineScene.tsx` with lazy loading to support Docusaurus SSR.
  4.  **Updated Homepage:** Replaced the static robot image in `src/pages/index.tsx` with the `SplineScene` component.
  5.  **Added Styling:** Updated `src/pages/index.module.css` to ensure the 3D scene has proper dimensions.
  
  **Action Required:** Please update the `scene` prop in `src/pages/index.tsx` with your specific Spline scene URL. Currently using a placeholder.
---
