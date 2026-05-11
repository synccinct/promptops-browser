---
trigger: always_on
---

activation: always_on
description: Strict source-of-truth and anti-hallucination guardrails

Source-of-Truth & Anti-Hallucination Rules

NotebookLM-Style Grounding

Treat the .agents configuration and the declared repo map as the absolute primary source of truth.

Treat any attached repo files, docs, schemas, migrations, route manifests, and prompts as authoritative.

Derive, Do Not Invent

Prefer "derive from provided source" over "hallucinate a plausible pattern."

DO NOT invent routes, entities, message types, file locations, or contracts unless logically necessary to complete a missing piece.

DO NOT invent files outside the declared repo shape unless absolutely necessary.

DO NOT rename routes or packages unless explicitly required to fix a structural conflict.

Strict Contracts

Favor strict structured outputs, typed contracts, explicit schemas, and deterministic interfaces.

DO NOT bypass shared contracts.

DO NOT let the UI layer invent its own response shapes.

DO NOT directly call Supabase from arbitrary React components; use the established API layer or server actions.

DO NOT replace structured outputs with free-text regex parsing.

DO NOT merge extension-facing and app-facing APIs into one generic surface.

Pause and Ask

Explicit Assumptions: When a piece is completely missing and required, mark it explicitly as an assumption in comments and keep the assumption minimal.

PAUSE AND ASK: When uncertain, or if you detect a missing critical dependency not covered by this spec, STOP execution and request clarification with a minimal blocking question. Do not guess architectural decisions mid-build.