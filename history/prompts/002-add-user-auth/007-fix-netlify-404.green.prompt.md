---
id: "007"
title: "Fix Netlify 404 Error"
stage: "green"
date: "2025-12-18"
surface: "agent"
model: "gemini-2.0-flash-exp"
feature: "auth-server"
branch: "main"
user: "user"
command: "fix-netlify-404"
labels: ["netlify", "routing", "hono", "redirects"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml: |
  - auth-server/app.ts
  - auth-server/netlify.toml
tests_yaml: |
  - (Pending user verification) GET / should return "Auth Server is running!"
prompt_text: |
  404 Not Found it is giving this after deployemnt https://gemini-auth-server-demo.netlify.app/
response_text: |
  Investigated the 404 error and identified two causes:
  1. Hono had no route for `/` (only `/api/auth/*`), so valid requests to root returned 404.
  2. Netlify routing might not have been forwarding `/*` to the function reliably without a redirect rule.
  
  Applied fixes:
  1. Added a health check route `app.get("/", ...)` to `auth-server/app.ts` to confirm the server is running.
  2. Added an explicit `[[redirects]]` block to `auth-server/netlify.toml` to route all traffic (`/*`) to `/.netlify/functions/api`.
  
  Triggered a new deployment (ID: `69438c50d640818ae927e03f`).
outcome:
  success: true
  notes: "Added root route and explicit redirects to fix 404s."
---
