---
id: 2
title: Add RAG Chatbot Principle to Constitution
stage: constitution
date: 2025-12-01
surface: agent
model: gemini
feature: none
branch: master
user: unknown
command: /sp.constitution what you have to do now add the consistitiution that we have to implement the chatbot in this project according to these requirements 2. Integrated RAG Chatbot Development...
labels: ["constitution", "chatbot", "rag"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
 - .specify/templates/plan-template.md
tests:
 - none
---

## Prompt

/sp.constitution what you have to do now add the consistitiution that we have to implement the chatbot in this project according to these requirements 2. Integrated RAG Chatbot Development: Build and embed a Retrieval-Augmented Generation (RAG) chatbot within the published book. This chatbot, utilizing the OpenAI Agents/ChatKit SDKs, FastAPI, Neon Serverless Postgres database, and Qdrant Cloud Free Tier, must be able to answer user questions about the book's content, including answering questions based only on text selected by the user.

## Response snapshot

I have updated the plan template to reflect the new chatbot requirement. The constitution and relevant templates are now fully in sync.

Here is a summary of the changes:

*   **Constitution Amended**: The constitution is now at version **1.1.0**. It includes a new principle (VI) requiring the implementation of an integrated RAG chatbot.
*   **Plan Template Updated**: The project's planning template now includes a checklist item to ensure all future development plans account for this new chatbot requirement.

Here is a suggested commit message:

```
docs: amend constitution to v1.1.0 for RAG chatbot

- Adds principle VI requiring an integrated RAG chatbot.
- Updates plan template to include a check for the new principle.
```

## Outcome

- ✅ Impact: The project constitution was successfully amended to include the new RAG chatbot requirement.
- 🧪 Tests: n/a
- 📁 Files: 2 files modified.
- 🔁 Next prompts: n/a
- 🧠 Reflection: The process of amending the constitution and updating dependent templates was smooth.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): n/a
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a
