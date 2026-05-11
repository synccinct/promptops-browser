alter table workspaces enable row level security;
alter table memberships enable row level security;
alter table prompt_assets enable row level security;
alter table prompt_versions enable row level security;
alter table prompt_sessions enable row level security;
alter table prompt_drafts enable row level security;
alter table suggestion_envelopes enable row level security;

create policy "members can read workspaces"
on workspaces for select
using (
  exists (
    select 1 from memberships
    where memberships.workspace_id = workspaces.id
      and memberships.user_id = auth.uid()
  )
);

create policy "members can read memberships"
on memberships for select
using (
  user_id = auth.uid()
  or exists (
    select 1 from memberships m
    where m.workspace_id = memberships.workspace_id
      and m.user_id = auth.uid()
  )
);

create policy "members can read prompt assets"
on prompt_assets for select
using (
  exists (
    select 1 from memberships
    where memberships.workspace_id = prompt_assets.workspace_id
      and memberships.user_id = auth.uid()
  )
);

create policy "editors can insert prompt assets"
on prompt_assets for insert
with check (
  exists (
    select 1 from memberships
    where memberships.workspace_id = prompt_assets.workspace_id
      and memberships.user_id = auth.uid()
      and memberships.role in ('owner','admin','editor')
  )
);

create policy "editors can update prompt assets"
on prompt_assets for update
using (
  exists (
    select 1 from memberships
    where memberships.workspace_id = prompt_assets.workspace_id
      and memberships.user_id = auth.uid()
      and memberships.role in ('owner','admin','editor')
  )
)
with check (
  exists (
    select 1 from memberships
    where memberships.workspace_id = prompt_assets.workspace_id
      and memberships.user_id = auth.uid()
      and memberships.role in ('owner','admin','editor')
  )
);

create policy "workspace members can read prompt versions"
on prompt_versions for select
using (
  exists (
    select 1 from prompt_assets
    join memberships on memberships.workspace_id = prompt_assets.workspace_id
    where prompt_assets.id = prompt_versions.prompt_asset_id
      and memberships.user_id = auth.uid()
  )
);

create policy "workspace members can read prompt sessions"
on prompt_sessions for select
using (
  exists (
    select 1 from memberships
    where memberships.workspace_id = prompt_sessions.workspace_id
      and memberships.user_id = auth.uid()
  )
);

create policy "workspace members can read prompt drafts"
on prompt_drafts for select
using (
  exists (
    select 1 from prompt_sessions
    join memberships on memberships.workspace_id = prompt_sessions.workspace_id
    where prompt_sessions.id = prompt_drafts.session_id
      and memberships.user_id = auth.uid()
  )
);

create policy "workspace members can read suggestion envelopes"
on suggestion_envelopes for select
using (
  exists (
    select 1 from prompt_sessions
    join memberships on memberships.workspace_id = prompt_sessions.workspace_id
    where prompt_sessions.id = suggestion_envelopes.session_id
      and memberships.user_id = auth.uid()
  )
);
