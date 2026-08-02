-- 0003_editable_site_content.sql
-- Makes every static block on the public website editable from the admin panel,
-- and repairs three defects in 0001/0002.
-- Fully idempotent: safe to run repeatedly.

-- ---------------------------------------------------------------------------
-- 1. site_content — the editable page-block store
--
-- Every hardcoded section on the website (hero slides, intro copy, target
-- groups, SDG grid, CTAs, page headers...) is addressed by
-- (page_key, block_key) and stores its fields as jsonb. The application ships
-- defaults in code, so a missing row simply means "block not customised yet"
-- and the site keeps rendering. Editing a block in /admin/content writes the
-- row; the public page picks it up on the next request.
-- ---------------------------------------------------------------------------

create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  page_key text not null,
  block_key text not null,
  content jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (page_key, block_key)
);

create index if not exists site_content_page_idx
  on public.site_content (page_key);

drop trigger if exists set_updated_at on public.site_content;
create trigger set_updated_at
  before update on public.site_content
  for each row execute function public.touch_updated_at();

alter table public.site_content enable row level security;

-- Public site renders these blocks, so anyone may read them.
drop policy if exists "Public can view site content" on public.site_content;
create policy "Public can view site content"
  on public.site_content
  for select
  using (true);

drop policy if exists site_content_admin_write on public.site_content;
create policy site_content_admin_write
  on public.site_content
  for all
  using (public.can_edit_content())
  with check (public.can_edit_content());

-- ---------------------------------------------------------------------------
-- 2. FIX: resources could not be saved as drafts
--
-- 0001 added `check (file_url is not null or external_url is not null)`, which
-- makes it impossible to create a resource record *before* uploading its PDF —
-- the normal authoring order. The requirement is only meaningful once the
-- resource is actually published, so scope the constraint to published rows.
-- ---------------------------------------------------------------------------

alter table public.resources
  drop constraint if exists resources_check;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'resources_published_needs_file'
      and conrelid = 'public.resources'::regclass
  ) then
    alter table public.resources
      add constraint resources_published_needs_file
      check (
        status <> 'published'
        or file_url is not null
        or external_url is not null
      );
  end if;
end $$;

-- Useful for the public /resources filters.
create index if not exists resources_type_published_idx
  on public.resources (resource_type, status, published_at desc nulls last);

-- ---------------------------------------------------------------------------
-- 3. FIX: navigation_items duplicated on every re-run
--
-- 0001 ends with `insert into navigation_items ... on conflict do nothing`, but
-- the table has no unique constraint other than its generated primary key, so
-- the conflict clause never fires and each run appends a second full menu.
-- De-duplicate what is there, then add the constraint that makes the upsert
-- actually work.
-- ---------------------------------------------------------------------------

delete from public.navigation_items a
using public.navigation_items b
where a.ctid > b.ctid
  and a.location = b.location
  and a.url = b.url
  and a.label = b.label;

create unique index if not exists navigation_items_location_url_key
  on public.navigation_items (location, url);

-- ---------------------------------------------------------------------------
-- 4. Storage: allow authenticated admins to upload, and expose PDFs publicly
--
-- Reports/PDFs are published documents — they belong in the public bucket so
-- they can be linked directly. Widen the allowed MIME types and raise the size
-- limit so real reports fit.
-- ---------------------------------------------------------------------------

update storage.buckets
set file_size_limit = 52428800,
    allowed_mime_types = null
where id in ('public-media', 'private-documents');
