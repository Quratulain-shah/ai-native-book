---
id: "008"
title: "Integrate SplineSceneBasic with Shadcn UI"
stage: "implementation"
date: "2025-12-06"
surface: "agent"
model: "gemini-2.0-flash-exp"
feature: "docusaurus-docs-site"
branch: "main"
user: "user"
command: "create_files"
labels: ["shadcn", "tailwind", "react", "docusaurus", "spline"]
links:
  spec: "null"
  ticket: "null"
  adr: "null"
  pr: "null"
files:
  - "package.json"
  - "tailwind.config.js"
  - "postcss.config.js"
  - "tsconfig.json"
  - "src/css/custom.css"
  - "src/lib/utils.ts"
  - "src/components/ui/splite.tsx"
  - "src/components/ui/spotlight.tsx"
  - "src/components/ui/card.tsx"
  - "src/components/SplineSceneBasic.tsx"
tests:
  - "npm install"
  - "manual verification"
prompt: |
  You are given a task to integrate an existing React component in the codebase...
  [Full prompt with component code]
response: |
  Integrated the requested `SplineScene`, `Spotlight`, and `Card` components following Shadcn UI structure.
  1.  **Setup Shadcn/Tailwind:**
      *   Installed `tailwindcss`, `postcss`, `autoprefixer`, `tailwind-merge`, `clsx`.
      *   Created `tailwind.config.js` (with spotlight animation) and `postcss.config.js`.
      *   Added Tailwind directives to `src/css/custom.css`.
      *   Created `src/lib/utils.ts` for `cn` utility.
      *   Updated `tsconfig.json` to support `@/` alias mapping to `src/`.
  2.  **Created Components:**
      *   `src/components/ui/splite.tsx` (SplineScene)
      *   `src/components/ui/spotlight.tsx` (Aceternity Spotlight)
      *   `src/components/ui/card.tsx` (Shadcn Card)
      *   `src/components/SplineSceneBasic.tsx` (Demo component)
  3.  **Dependencies:** Installed `@splinetool/react-spline`, `@splinetool/runtime`, `framer-motion`.
  
  The `SplineSceneBasic` component is now ready to be used in your pages.
---
