---
id: "007"
title: "refine-hero-typography"
stage: "implement"
date: "2025-12-04"
surface: "agent"
model: "gemini-2.0-flash"
feature: "docusaurus-docs-site"
branch: "main"
user: "user"
command: "pixel perfect professional fonts"
labels: ["ui", "css", "typography", "hero-section"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "src/pages/index.tsx"
  - "src/pages/index.module.css"
  - "src/css/custom.css"
tests: []
---

# Prompt
it is not pixel perfect see the image again but the content will be according to my websiteit is not pixel perfect see the image again but the content will be according to my website also use diffrent fonts and professional fonts

# Response
Refined the hero section to balance the "pixel perfect" visual design of the reference with the *actual content* of the user's website.

-   **Content**: Reverted to using `siteConfig.title` and `siteConfig.tagline` to preserve the project's identity ("Physical AI & Humanoid Robotics").
-   **Typography**:
    -   Imported `Space Grotesk` (Google Fonts) for a professional, futuristic heading style.
    -   Imported `Inter` for clean body text.
    -   Applied massive, uppercase styling to the dynamic title to mimic the reference image's "FUTURE AI" look.
-   **Design Tweaks**:
    -   Updated the "Brands" section to "Powered By" with relevant tech stack items (ROS 2, Python, etc.) to match the educational context while keeping the visual layout.
    -   Refined button styles to include a secondary "Read Blog" outline button alongside the primary orange CTA.
    -   Ensured the Google Login button is preserved in the layout.
