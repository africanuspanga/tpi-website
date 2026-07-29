-- 0002_backend_fixes.sql
-- Hardening + performance indexes for the TPi Website CMS.
-- Safe to run multiple times (idempotent).

-- ---------------------------------------------------------------------------
-- Indexes for the most common public-site and admin queries
-- ---------------------------------------------------------------------------

create index if not exists posts_status_published_at_idx
  on public.posts (status, published_at desc);

create index if not exists posts_post_type_status_idx
  on public.posts (post_type, status);

create index if not exists posts_slug_idx
  on public.posts (slug);

create index if not exists projects_status_published_at_idx
  on public.projects (status, published_at desc nulls last);

create index if not exists projects_slug_idx
  on public.projects (slug);

create index if not exists resources_status_idx
  on public.resources (status, resource_type);

create index if not exists impact_stories_status_idx
  on public.impact_stories (status, published_at desc nulls last);

create index if not exists contact_messages_status_idx
  on public.contact_messages (status, created_at desc);

create index if not exists audit_logs_created_at_idx
  on public.audit_logs (created_at desc);

create index if not exists media_assets_created_at_idx
  on public.media_assets (created_at desc);

-- ---------------------------------------------------------------------------
-- Newsletter: allow a previously unsubscribed address to resubscribe.
-- The public subscribe flow uses the service role (see
-- src/actions/newsletter.ts), so this policy is only a fallback for
-- environments without a service key: it permits re-activating a
-- subscription but nothing else.
-- ---------------------------------------------------------------------------

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'newsletter_subscribers'
      and policyname = 'Anyone can resubscribe'
  ) then
    create policy "Anyone can resubscribe"
    on public.newsletter_subscribers
    for update
    using (true)
    with check (
      is_active = true
      and unsubscribed_at is null
    );
  end if;
end $$;
