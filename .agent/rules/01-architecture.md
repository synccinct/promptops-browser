---
trigger: always_on
---

activation: always_on
glob: "/*.{ts,tsx,json,sql}"
description: Enforces OptiPrompt architectural boundaries and stack rules

Architectural Invariants

Core Stack

TypeScript everywhere practical

Next.js App Router for the web app

Supabase for auth, Postgres, and RLS

Zod for runtime validation

Chrome Extension Manifest V3

Extension Boundary

Content scripts detect and capture normalized data.

Background worker orchestrates extension state and messaging.

Side panel renders live feedback.

Server Boundary

Next.js backend validates requests, stores durable state, and calls models.

No direct DB logic in route handlers; use repositories and services.

Strict imports: UI code must not import server code; graph engine must not import Next.js specific objects.

Prompt-Graph Engine

Must remain pure, framework-agnostic, and executable both locally and server-side.

Do NOT import Chrome APIs or React UI code here.

File-by-File Responsibilities

Extension Manifest: Requires sidePanel, storage, activeTab, scripting, tabs.

Background Script: Manage chrome.runtime.sendMessage and chrome.tabs.sendMessage routing.

Adapters: Define the common interface (matches, findPromptInput, etc.) and normalize capture output.

Web Server (apps/web/server/): Multi-tenant workspace-aware services. Strict repository pattern for DB access.

Schemas (packages/schemas/): Use Zod for runtime request validation and parsing model responses. Maintain shape parity across payloads, handlers, DB, and UI.