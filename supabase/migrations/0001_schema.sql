create extension if not exists pgcrypto;

create table if not exists workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists memberships (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','admin','editor','viewer')),
  created_at timestamptz not null default now(),
  unique (workspace_id, user_id)
);

create table if not exists prompt_assets (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  status text not null check (status in ('draft','approved','deprecated')),
  latest_version_id uuid,
  tags text[] not null default '{}',
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, slug)
);

create table if not exists prompt_versions (
  id uuid primary key default gen_random_uuid(),
  prompt_asset_id uuid not null references prompt_assets(id) on delete cascade,
  version_number integer not null,
  source text not null check (source in ('extension','web','api')),
  raw_text text not null,
  normalized_text text not null,
  structure jsonb not null,
  model_id text,
  score numeric,
  summary text,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  unique (prompt_asset_id, version_number)
);

create table if not exists prompt_sessions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete set null,
  user_id uuid not null references auth.users(id) on delete cascade,
  source_site text not null,
  tab_url text not null,
  conversation_title text,
  started_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create table if not exists prompt_drafts (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references prompt_sessions(id) on delete cascade,
  raw_text text not null,
  normalized_text text not null,
  created_at timestamptz not null default now()
);

create table if not exists suggestion_envelopes (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references prompt_sessions(id) on delete cascade,
  prompt_draft_id uuid not null references prompt_drafts(id) on delete cascade,
  prompt_version_id uuid references prompt_versions(id) on delete cascade,
  status text not null check (status in ('pending','ready','failed')),
  scores jsonb not null,
  cards jsonb not null,
  variants jsonb not null,
  trace jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
