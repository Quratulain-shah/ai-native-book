---
id: "003-optimize-3d-loading"
title: "Optimize 3D Robot Model Loading"
stage: "refactor"
date: "2025-12-07"
surface: "agent"
model: "gemini-2.0-flash-thinking-exp"
feature: "docusaurus-docs-site"
branch: "main"
user: "User"
command: "optimize-3d-loading"
labels:
  - "performance"
  - "ux"
  - "docusaurus"
  - "3d"
  - "spline"
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "src/css/custom.css"
  - "src/components/ui/splite.tsx"
tests: []
prompt: |
  in the hero section of docussaurus frontend all the things are exceptionally good but the bsmall problem is that when i am oprning the wesbite the robot is coming after 10 or 20 seconds not too much late ?? please mkake this fix for optimize it for me
  [Follow up: "yeah you can go ahead this the best plan brilliant"]
response: |
  Implemented a "Placeholder Trick" optimization:
  1. Updated `src/css/custom.css` to add a CSS loader spinner.
  2. Refactored `src/components/ui/splite.tsx` to:
     - Show a static image (`/img/robo.png`) and spinner immediately.
     - Lazy load the heavy Spline 3D scene in the background.
     - Smoothly transition (fade-in) to the interactive 3D model once the `onLoad` event fires.
  This removes the perceived 10-20s blank screen delay.
---
