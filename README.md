# OptiPrompt Starter Pack

Repo-ready starter pack for a browser-first PromptOps product.

## What is included

- `apps/extension/manifest.json` — Chrome Extension Manifest V3 starter
- `packages/domain/src/domain-types.ts` — shared domain entities
- `packages/domain/src/event-contracts.ts` — extension and backend event contracts
- `packages/prompt-graph/src/prompt-graph.ts` — incremental prompt graph engine skeleton
- `apps/web/app/api/extension/suggestions/route.ts` — Next.js route stub for structured suggestion responses
- `supabase/schema.sql` — first-pass multi-tenant schema
- `supabase/rls-policies.sql` — first-pass row-level security policies

## Suggested next steps

1. Add your preferred package manager workspace config.
2. Wire the extension background worker and sidepanel to the shared domain and graph packages.
3. Replace route stubs with your model provider and auth middleware.
4. Run the Supabase SQL locally and refine RLS around your workspace claims model.
5. Add JSON Schema / Zod validators for all model outputs.
