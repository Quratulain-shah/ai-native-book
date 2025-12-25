---
id: "009"
title: "force-two-line-hero-heading"
stage: "implement"
date: "2025-12-04"
surface: "agent"
model: "gemini-2.0-flash"
feature: "docusaurus-docs-site"
branch: "main"
user: "user"
command: "force heading to 2 lines"
labels: ["ui", "jsx", "hero-section"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "src/pages/index.tsx"
tests: []
---

# Prompt
Physical
AI
&
Humanoid
Robotics this hero section text is coming in 3 lines i want it in 2 lines

# Response
Updated the `HomepageHeader` component in `src/pages/index.tsx` to explicitly force the hero title onto two lines.

-   **Change**: Removed the dynamic word-splitting logic (which was creating a new line for every word).
-   **Implementation**: Hardcoded the break to render as:
    1.  `Physical AI &`
    2.  `Humanoid Robotics`
-   **Result**: The heading will now consistently appear as two balanced lines, respecting the user's design preference.
