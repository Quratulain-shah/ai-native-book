---
id: "014"
title: "Fix Chatbot Authentication Error"
stage: "green"
date: "2025-12-19"
surface: "agent"
model: "gemini-2.0-flash-exp"
feature: "rag-chatbot"
branch: "main"
user: "User"
command: "Fix chatbot authentication error"
labels: ["bugfix", "authentication", "backend", "chatbot"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "backend/src/main.py"
tests: []
---

## Prompt
you recely push my chnages on hugging face before those the chatbot was working very good but now it is giving this Unable to connect to the AI Brain. Please ensure the backend is running. (Not authenticated (No token)) the chatbot has no any connection with authentication it will run without authentication any user can use this

## Response
The user reported that the chatbot was failing with "Not authenticated (No token)" error. This was caused by the backend endpoints `/query/general`, `/query/selected-text`, and `/translate-text` requiring authentication via `Depends(get_current_user)`, while the frontend chatbot component does not send any authentication token.

I modified `backend/src/main.py` to:
1.  Remove the `Depends(get_current_user)` dependency from `query_general`, `query_selected_text`, and `translate_text_endpoint`.
2.  Update the logging statements in these functions to remove references to `current_user.email` since `current_user` is no longer available.
3.  Commented out the unused import of `get_current_user`.

This change allows the chatbot and translation features to be accessed publicly without authentication, as requested by the user.
