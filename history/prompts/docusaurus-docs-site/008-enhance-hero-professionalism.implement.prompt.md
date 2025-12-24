---
id: "008"
title: "enhance-hero-professionalism"
stage: "implement"
date: "2025-12-04"
surface: "agent"
model: "gemini-2.0-flash"
feature: "docusaurus-docs-site"
branch: "main"
user: "user"
command: "increase width heading professional image"
labels: ["ui", "css", "hero-section"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "src/pages/index.module.css"
  - "src/pages/index.tsx"
tests: []
---

# Prompt
increase teh width of heading of hero section use a professional image make it more professional appealing

# Response
Enhanced the hero section's professional appeal and layout.

-   **Layout**:
    -   Increased the max-width of the container to `1440px`.
    -   Adjusted the grid ratio to `1.4fr 0.8fr`, giving the text column significantly more width to prevent awkward wrapping.
-   **Typography & Visuals**:
    -   Refined the gradient background to a subtle radial glow for a cleaner look.
    -   Increased heading font size and tightened line height for impact.
    -   Polished button styles with sharper corners and smoother hover states.
    -   Added a drop shadow and subtle float animation to the image container.
-   **Assets**:
    -   Updated the hero image to a cleaner, high-quality 3D-style AI visualization from Unsplash (`photo-1535378437323-959a6746a10e`) that looks more "finished" and professional than the previous placeholder.
