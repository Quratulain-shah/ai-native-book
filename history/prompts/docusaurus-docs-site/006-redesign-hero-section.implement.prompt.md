---
id: "006"
title: "redesign-hero-section"
stage: "implement"
date: "2025-12-04"
surface: "agent"
model: "gemini-2.0-flash"
feature: "docusaurus-docs-site"
branch: "main"
user: "user"
command: "implement pixel perfect hero"
labels: ["ui", "css", "react", "docusaurus", "hero-section"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "src/pages/index.tsx"
  - "src/pages/index.module.css"
tests: []
---

# Prompt
@static/img/hero.png see this image i want a same pixel perfect hero section same to same like this

# Response
Refactored the homepage hero section to match the provided visual reference ("Future AI Powered Solutions").

-   **Layout**: Implemented a responsive split layout (Text Left, Image Right) using CSS Grid/Flexbox.
-   **Styling**:
    -   Added a custom font stack (`Inter`) and uppercase styling for the headline.
    -   Applied a subtle light-to-orange gradient background.
    -   Styled the primary CTA button with the specific orange color (`#FF9E68`) and shadow.
    -   Added the "Brands we work with" section with styled text placeholders.
-   **Assets**:
    -   Used a high-quality placeholder image from Unsplash for the robot head (as the transparency-free asset was not available).
    -   Styled the image with a floating animation.
