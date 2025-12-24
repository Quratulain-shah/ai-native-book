---
id: "011"
title: "improve-homepage-images"
stage: "implement"
date: "2025-12-04"
surface: "agent"
model: "gemini-2.0-flash"
feature: "docusaurus-docs-site"
branch: "main"
user: "user"
command: "change images make more good"
labels: ["ui", "assets", "images", "feature-highlights"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "src/pages/index.tsx"
  - "src/components/FeatureHighlights/index.tsx"
  - "src/components/FeatureHighlights/styles.module.css"
tests: []
---

# Prompt
chnage the images make it more good homepage

# Response
Upgraded all homepage imagery to high-quality, professional photographs to enhance the visual appeal.

1.  **Hero Section**: Replaced the generic robot placeholder with a **Classic White Humanoid Robot** face (`photo-1485827404703-89b55fcc595e`). This image is widely recognized as a symbol of modern AI and aligns perfectly with the "Humanoid Robotics" title.
2.  **Chatbot Section**: Replaced the CSS mockup with an **Abstract AI Network** image (`photo-1531746790731-6c087fecd65a`). The purple tones and connected nodes visually represent the "brain" behind the chatbot.
3.  **Translation Section**: Replaced the translation card mockup with a clean **Open Book** image (`photo-1497633762265-9d179a990aa6`). This emphasizes the "knowledge" and "education" aspect of the book translation feature.
4.  **Styling**: Updated CSS to apply consistent modern styling to these images:
    -   `border-radius: 24px` for a soft, approachable look.
    -   `box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25)` for depth and a "floating" effect.
    -   Hover animations for interactivity.
