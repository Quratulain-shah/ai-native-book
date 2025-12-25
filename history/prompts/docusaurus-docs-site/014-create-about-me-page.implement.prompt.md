---
id: "014"
title: "create-about-me-page"
stage: "implement"
date: "2025-12-04"
surface: "agent"
model: "gemini-2.0-flash"
feature: "docusaurus-docs-site"
branch: "main"
user: "DevAbdullah90"
command: "replace blog with about page from github"
labels: ["ui", "react", "github-api", "about-page"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "src/pages/about.tsx"
  - "src/pages/about.module.css"
  - "docusaurus.config.ts"
  - "src/pages/index.tsx"
tests: []
---

# Prompt
ok instead of blog page make a page whihc is about me take my data from my github and then make it

# Response
Replaced the standard Blog page with a custom "About Me" page populated with the user's GitHub data.

-   **Data Source**: Fetched public profile data for `DevAbdullah90` (Abdullah Khan).
-   **New Page**: Created `src/pages/about.tsx` featuring:
    -   **Hero Profile**: Avatar, Name, and Bio styled with a dark theme and Space Grotesk typography.
    -   **Stats Grid**: Displays Public Repos (67), Followers (17), and Following (16).
    -   **Top Repositories**: A clean list of their top CLI projects (ATM, Currency Converter, etc.) with star counts and language tags.
-   **Navigation Updates**:
    -   Updated `docusaurus.config.ts`: Replaced "Blog" link in Navbar with "About".
    -   Updated `src/pages/index.tsx`: Replaced "Read Blog" button in Hero with "About Me".
