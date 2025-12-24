---
id: "006"
title: "Fix Netlify Auth Server ESM Deployment Error"
stage: "green"
date: "2025-12-18"
surface: "agent"
model: "gemini-2.0-flash-exp"
feature: "auth-server"
branch: "main"
user: "user"
command: "fix-netlify-deployment"
labels: ["netlify", "esm", "typescript", "better-auth", "deployment"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml: |
  - auth-server/package.json
  - auth-server/tsconfig.json
  - auth-server/app.ts
  - auth-server/server.ts
  - auth-server/netlify/functions/api.ts
  - auth-server/api/[...route].ts
tests_yaml: |
  - npx tsc --noEmit (auth-server)
prompt_text: |
  you recently deploy my auth server on netlify but the problem is that when i opned the public url it is giving me this error This function has crashed
  An unhandled error in the function code triggered the following message:

  Error - require() of ES Module /var/task/node_modules/better-auth/dist/index.mjs from /var/task/netlify/functions/api.cjs not supported. Instead change the require of /var/task/node_modules/better-auth/dist/index.mjs to a dynamic import() which is available in all CommonJS modules.

  Stack trace
  Error [ERR_REQUIRE_ESM]: require() of ES Module /var/task/node_modules/better-auth/dist/index.mjs from /var/task/netlify/functions/api.cjs not supported.
  Instead change the require of /var/task/node_modules/better-auth/dist/index.mjs to a dynamic import() which is available in all CommonJS modules.
      at TracingChannel.traceSync (node:diagnostics_channel:322:14)
      at Object.<anonymous> (/var/task/netlify/functions/api.cjs:42:26) can you please see this and redploy using the mcp server of netlify
response_text: |
  Investigated the `ERR_REQUIRE_ESM` error and identified that the project was configured as CommonJS (`api.cjs`) but tried to `require` the ESM-only `better-auth` package.
  
  Applied the following fixes to enable full ESM support:
  1.  Updated `auth-server/package.json` to `"type": "module"`.
  2.  Updated `auth-server/tsconfig.json` to use `"module": "NodeNext"` and `"moduleResolution": "NodeNext"`.
  3.  Refactored all imports in `app.ts`, `server.ts`, `netlify/functions/api.ts`, and `api/[...route].ts` to include explicit `.js` extensions as required by `NodeNext`.
  4.  Fixed a TypeScript type mismatch in `netlify/functions/api.ts` by casting `context` to `any`.
  5.  Verified the build locally with `npx tsc --noEmit`.
  
  Triggered a new deployment to Netlify (Site ID: `7fac3a05-8da7-40ca-8146-0e1055ba4885`) via MCP. The deployment is currently building.
outcome:
  success: true
  notes: "Switched auth-server to native ESM to support better-auth on Netlify Functions."
---
