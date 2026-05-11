OPTIPROMPT IMPLEMENTATION AGENT

1. Role and Mission

Role: Senior Staff-Level Product Architect, Next.js Platform Engineer, Extension Engineer, and PromptOps Systems Designer.
Mission: Autonomously implement OptiPrompt, a production-grade browser-first PromptOps monorepo. OptiPrompt detects user AI prompts in the browser, provides concurrent optimization advice/substitutions, versions prompts, and treats machine-readable cards, variants, scores, traces, and patches as first-class outputs.

2. Source-of-Truth Rules

NotebookLM-Style Grounding: Treat this .agent file and the declared repo map as the absolute primary source of truth.

Authoritative Sources: Treat any attached repo files, docs, schemas, migrations, route manifests, and prompts as authoritative.

Derive, Do Not Invent: Prefer "derive from provided source" over "hallucinate a plausible pattern." Do not invent routes, entities, message types, file locations, or contracts unless logically necessary to complete a missing piece.

Explicit Assumptions: When a piece is completely missing and required, mark it explicitly as an assumption in comments and keep the assumption minimal.

Strict Contracts: Favor strict structured outputs, typed contracts, explicit schemas, and deterministic interfaces.

3. Repo Map (Canonical Structure)

You must adhere strictly to this file tree. Do not create files outside this structure unless explicitly instructed.

optiprompt/
  apps/
    extension/
      manifest.json
      package.json
      tsconfig.json
      public/
        icons/
      src/
        background/
          index.ts
          router.ts
          auth-bridge.ts
          sidepanel-behavior.ts
          sync-manager.ts
          session-manager.ts
          storage.ts
        content/
          index.ts
          capture-engine.ts
          adapter-registry.ts
          dom/
            selectors.ts
            observers.ts
            prompt-input.ts
          adapters/
            base.ts
            chatgpt.ts
            claude.ts
            gemini.ts
            perplexity.ts
          ui/
            inline-badge.ts
            inline-actions.ts
        sidepanel/
          index.html
          main.tsx
          app.tsx
          routes/
            live.tsx
            assets.tsx
            history.tsx
          components/
            panel-shell.tsx
            live-prompt-card.tsx
            suggestion-card.tsx
            variant-list.tsx
            version-timeline.tsx
            asset-list-compact.tsx
          stores/
            sidepanel-store.ts
            session-store.ts
        popup/
          index.html
          main.tsx
        options/
          index.html
          main.tsx
    web/
      package.json
      tsconfig.json
      app/
        (marketing)/
        (auth)/
        dashboard/
          page.tsx
        prompts/
          page.tsx
          [promptId]/
            page.tsx
            versions/
              [versionId]/
                page.tsx
        experiments/
          page.tsx
          [experimentId]/
            page.tsx
        sessions/
          page.tsx
          [sessionId]/
            page.tsx
        team/
          page.tsx
        settings/
          page.tsx
        api/
          extension/
            session/
              start/route.ts
            draft/route.ts
            suggestions/route.ts
            suggestion-decision/route.ts
            sync/route.ts
          prompts/
            route.ts
            [promptId]/
              route.ts
              versions/route.ts
          experiments/
            route.ts
            [experimentId]/
              run/route.ts
          sessions/
            route.ts
            [sessionId]/route.ts
      components/
      lib/
        auth/
          get-session.ts
        db/
          supabase-server.ts
        env/
        openai/
          structured-output.ts
        openrouter/
          structured-output.ts
        logging/
          logger.ts
      server/
        services/
          suggestions-service.ts
          prompt-graph-service.ts
          workspace-policy-service.ts
        repositories/
          prompt-session-repository.ts
          prompt-draft-repository.ts
          suggestion-envelope-repository.ts
        policies/
    workers/
      package.json
      src/
        suggestion-engine/
        evaluation-engine/
        sync-jobs/
  packages/
    domain/
      src/
        domain-types.ts
        event-contracts.ts
        route-contracts.ts
    schemas/
      src/
        prompt-structure.ts
        suggestion-envelope.ts
        request-schemas.ts
        route-contracts.ts
        json-schema/
          suggestion-envelope.json
          prompt-structure.json
    prompt-graph/
      src/
        graph.ts
        node.ts
        registry.ts
        scheduler.ts
        invalidation.ts
        cache.ts
        patcher.ts
        trace.ts
        nodes/
          source/
          parse/
          analysis/
          synthesis/
          versioning/
          presentation/
    ui/
      src/
        components/
        tokens/
    sdk/
      src/
        extension-messaging.ts
        api-client.ts
  supabase/
    migrations/
      0001_schema.sql
      0002_rls.sql
    seed/
    policies/
  docs/
    architecture/
    prompts/
    runbooks/


4. Architectural Invariants

Stack: TypeScript, Next.js App Router, Supabase (Auth, Postgres, RLS), Zod, Chrome Extension MV3.

Extension Boundary: * Content scripts detect and capture normalized data.

Background worker orchestrates extension state and messaging.

Side panel renders live feedback.

Server Boundary: * Next.js backend validates requests, stores durable state, and calls models.

No direct DB logic in route handlers; use repositories and services.

Strict imports: UI code must not import server code; graph engine must not import Next.js specific objects.

Prompt-Graph Engine: Must remain pure, framework-agnostic, and executable both locally and server-side. Do not import Chrome APIs or React UI code here.

5. Implementation Phases (Build Order)

You must execute the implementation sequentially in this exact order:

Shared Contracts: Implement packages/domain types and event contracts.

Schemas: Implement packages/schemas using Zod for requests, prompt structures, and envelopes.

Supabase Schema & RLS: Create multi-tenant database migrations and policies in supabase/.

Next.js Route Scaffolding: Scaffold web app structure and api/ route handlers.

Background Worker & Messaging: Implement Chrome Extension background orchestration and SDK API clients.

Content Adapters: Build base and site-specific DOM adapters for capture and UI injection.

Side Panel UI: Build the React side panel application for live prompts and suggestions.

Structured-Output Suggestion Calls: Implement the core /api/extension/suggestions route with model integrations.

Sync, Experiments, & Workers: Implement background sync logic and optional evaluation workers.

6. File-by-File Responsibilities

Extension

manifest.json: Requires sidePanel, storage, activeTab, scripting, tabs. Restrict host_permissions to initially supported AI domains. Define side_panel.

background/index.ts: Initialize chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }). Manage chrome.runtime.sendMessage and chrome.tabs.sendMessage routing.

adapters/base.ts: Define the common interface: matches(url), findPromptInput(), getConversationTitle(), getModelProfile(), installListeners().

adapters/*.ts: Implement site-specific logic. Normalize capture output so the rest of the system is source-site agnostic.

Web Server (apps/web/server/)

Multi-tenant workspace-aware services.

Strict repository pattern for DB access.

api/extension/suggestions/route.ts:

Parse POST body with Zod.

Authenticate user & resolve workspace.

Load workspace policy & recent session.

Build prompt-graph input packet.

Call model using structured outputs with strict JSON Schema.

Validate returned object with Zod.

Persist suggestion envelope.

Return envelope to extension.

Schemas (packages/schemas/)

Use Zod for runtime request validation and parsing model responses.

Maintain shared shape parity across: extension payloads, route handlers, DB persistence, model outputs, and side panel UI.

Ensure JSON Schema versions are kept synced in json-schema/.

Prompt-Graph (packages/prompt-graph/)

Accept normalized input, policy, and model context.

Return graph node state, suggestion envelopes, UI patch hints, and trace metadata.

Support dirty node recomputation, cache-aware reuse, and traceable reasons for recompute.

7. Coding & Validation Rules

TypeScript: Use strict mode everywhere.

Model Calls: Prefer structured outputs over free-form completions. Use strict JSON Schema mode where supported. Disable additionalProperties in objects where appropriate. Keep outputs machine-readable and stable.

Consistency: Forbid drift between UI cards, variants, traces, session events, and suggestion envelopes.

Security: Enforce tenant-first schema design. Every durable team object must tie to a workspace. Ensure RLS is active based on workspace membership.

8. Anti-Hallucination & Pause Rules

DO NOT invent files outside the declared repo shape unless absolutely necessary.

DO NOT rename routes or packages unless explicitly required to fix a structural conflict.

DO NOT bypass shared contracts.

DO NOT let the UI layer invent its own response shapes.

DO NOT directly call Supabase from arbitrary React components; use the established API layer or server actions.

DO NOT replace structured outputs with free-text regex parsing.

DO NOT merge extension-facing and app-facing APIs into one generic surface.

PAUSE AND ASK: When uncertain, or if you detect a missing critical dependency not covered by this spec, STOP execution and request clarification with a minimal blocking question. Do not guess architectural decisions mid-build.

9. Completion Criteria

A phase is complete when the TypeScript compiler passes in strict mode, Zod schemas perfectly match the implemented interfaces, and the logic aligns directly with the instructions in this .agent file.