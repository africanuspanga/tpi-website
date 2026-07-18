begin;

create extension if not exists pgcrypto;
create extension if not exists citext;

do $$
begin
  create type public.app_role as enum (
    'super_admin',
    'admin',
    'editor',
    'viewer'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.content_status as enum (
    'draft',
    'published',
    'archived'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.project_status as enum (
    'planned',
    'active',
    'completed',
    'on_hold'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.message_status as enum (
    'new',
    'in_progress',
    'resolved',
    'spam'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.resource_kind as enum (
    'report',
    'policy_brief',
    'research',
    'toolkit',
    'case_study',
    'video',
    'other'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  job_title text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role not null default 'viewer',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  setting_key text not null unique,
  setting_value jsonb not null default '{}'::jsonb,
  is_public boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.navigation_items (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.navigation_items(id) on delete cascade,
  label text not null,
  url text not null,
  location text not null default 'header',
  sort_order integer not null default 0,
  opens_new_tab boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  page_type text not null default 'standard',
  excerpt text,
  content text,
  hero_image_url text,
  status public.content_status not null default 'draft',
  is_featured boolean not null default false,
  seo_title text,
  seo_description text,
  og_image_url text,
  canonical_url text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.page_sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages(id) on delete cascade,
  section_key text not null,
  section_type text not null,
  eyebrow text,
  heading text,
  body text,
  image_url text,
  content jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  is_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(page_id, section_key)
);

create table if not exists public.thematic_areas (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  number_label text,
  short_description text,
  description text,
  icon_name text,
  accent_color text,
  hero_image_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.thematic_focus_items (
  id uuid primary key default gen_random_uuid(),
  thematic_area_id uuid not null
    references public.thematic_areas(id) on delete cascade,
  title text not null,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text,
  description text,
  location text,
  project_status public.project_status not null default 'planned',
  publication_status public.content_status not null default 'draft',
  start_date date,
  end_date date,
  hero_image_url text,
  gallery jsonb not null default '[]'::jsonb,
  partners jsonb not null default '[]'::jsonb,
  sdgs text[] not null default '{}',
  is_featured boolean not null default false,
  published_at timestamptz,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_themes (
  project_id uuid not null
    references public.projects(id) on delete cascade,
  thematic_area_id uuid not null
    references public.thematic_areas(id) on delete cascade,
  primary key(project_id, thematic_area_id)
);

create table if not exists public.impact_metrics (
  id uuid primary key default gen_random_uuid(),
  value text not null,
  label text not null,
  description text,
  reporting_period text,
  source text,
  icon_name text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.impact_stories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  body text,
  location text,
  featured_image_url text,
  project_id uuid references public.projects(id) on delete set null,
  thematic_area_id uuid
    references public.thematic_areas(id) on delete set null,
  status public.content_status not null default 'draft',
  is_featured boolean not null default false,
  published_at timestamptz,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  position text not null,
  biography text,
  photo_url text,
  email citext,
  linkedin_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  website_url text,
  partner_type text,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  post_type text not null default 'news'
    check (post_type in ('news', 'insight', 'event', 'announcement')),
  excerpt text,
  body text,
  featured_image_url text,
  author_name text,
  event_date timestamptz,
  location text,
  status public.content_status not null default 'draft',
  is_featured boolean not null default false,
  published_at timestamptz,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  resource_type public.resource_kind not null default 'other',
  file_url text,
  external_url text,
  cover_image_url text,
  publication_year integer,
  author text,
  language text default 'English',
  status public.content_status not null default 'draft',
  is_featured boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (file_url is not null or external_url is not null)
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  person_name text not null,
  organization text,
  position text,
  photo_url text,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  file_url text not null,
  storage_path text,
  mime_type text,
  file_size bigint,
  alt_text text,
  caption text,
  folder text,
  is_public boolean not null default true,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email citext not null,
  phone text,
  organization text,
  enquiry_type text,
  subject text not null,
  message text not null,
  consent_given boolean not null default false,
  status public.message_status not null default 'new',
  admin_notes text,
  assigned_to uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email citext not null unique,
  full_name text,
  is_active boolean not null default true,
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_pages_status
  on public.pages(status, published_at);

create index if not exists idx_projects_publication
  on public.projects(publication_status, published_at);

create index if not exists idx_posts_status
  on public.posts(status, published_at desc);

create index if not exists idx_resources_status
  on public.resources(status, published_at desc);

create index if not exists idx_contact_messages_status
  on public.contact_messages(status, created_at desc);

create index if not exists idx_page_sections_page
  on public.page_sections(page_id, sort_order);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles',
    'admin_users',
    'site_settings',
    'navigation_items',
    'pages',
    'page_sections',
    'thematic_areas',
    'thematic_focus_items',
    'projects',
    'impact_metrics',
    'impact_stories',
    'team_members',
    'partners',
    'posts',
    'resources',
    'testimonials',
    'contact_messages'
  ]
  loop
    execute format(
      'drop trigger if exists set_updated_at on public.%I',
      table_name
    );

    execute format(
      'create trigger set_updated_at
       before update on public.%I
       for each row execute function public.touch_updated_at()',
      table_name
    );
  end loop;
end $$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles(user_id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.current_app_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.admin_users
  where user_id = auth.uid()
    and is_active = true
  limit 1;
$$;

create or replace function public.can_view_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_app_role() is not null;
$$;

create or replace function public.can_edit_content()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_app_role() in (
    'super_admin',
    'admin',
    'editor'
  );
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_app_role() = 'super_admin';
$$;

alter table public.profiles enable row level security;
alter table public.admin_users enable row level security;
alter table public.site_settings enable row level security;
alter table public.navigation_items enable row level security;
alter table public.pages enable row level security;
alter table public.page_sections enable row level security;
alter table public.thematic_areas enable row level security;
alter table public.thematic_focus_items enable row level security;
alter table public.projects enable row level security;
alter table public.project_themes enable row level security;
alter table public.impact_metrics enable row level security;
alter table public.impact_stories enable row level security;
alter table public.team_members enable row level security;
alter table public.partners enable row level security;
alter table public.posts enable row level security;
alter table public.resources enable row level security;
alter table public.testimonials enable row level security;
alter table public.media_assets enable row level security;
alter table public.contact_messages enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.audit_logs enable row level security;

create policy "Users can view their own profile"
on public.profiles
for select
using (user_id = auth.uid() or public.can_view_admin());

create policy "Users can update their own profile"
on public.profiles
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Admin users can view their own role"
on public.admin_users
for select
using (user_id = auth.uid() or public.is_super_admin());

create policy "Super admins manage admin users"
on public.admin_users
for all
using (public.is_super_admin())
with check (public.is_super_admin());

create policy "Public can view public settings"
on public.site_settings
for select
using (is_public = true);

create policy "Public can view navigation"
on public.navigation_items
for select
using (is_active = true);

create policy "Public can view published pages"
on public.pages
for select
using (
  status = 'published'
  and (published_at is null or published_at <= now())
);

create policy "Public can view enabled page sections"
on public.page_sections
for select
using (
  is_enabled = true
  and exists (
    select 1
    from public.pages
    where pages.id = page_sections.page_id
      and pages.status = 'published'
      and (
        pages.published_at is null
        or pages.published_at <= now()
      )
  )
);

create policy "Public can view thematic areas"
on public.thematic_areas
for select
using (is_active = true);

create policy "Public can view thematic focus items"
on public.thematic_focus_items
for select
using (
  is_active = true
  and exists (
    select 1
    from public.thematic_areas
    where thematic_areas.id =
      thematic_focus_items.thematic_area_id
      and thematic_areas.is_active = true
  )
);

create policy "Public can view published projects"
on public.projects
for select
using (
  publication_status = 'published'
  and (published_at is null or published_at <= now())
);

create policy "Public can view project themes"
on public.project_themes
for select
using (
  exists (
    select 1
    from public.projects
    where projects.id = project_themes.project_id
      and projects.publication_status = 'published'
  )
);

create policy "Public can view active metrics"
on public.impact_metrics
for select
using (is_active = true);

create policy "Public can view published stories"
on public.impact_stories
for select
using (
  status = 'published'
  and (published_at is null or published_at <= now())
);

create policy "Public can view active team members"
on public.team_members
for select
using (is_active = true);

create policy "Public can view active partners"
on public.partners
for select
using (is_active = true);

create policy "Public can view published posts"
on public.posts
for select
using (
  status = 'published'
  and (published_at is null or published_at <= now())
);

create policy "Public can view published resources"
on public.resources
for select
using (
  status = 'published'
  and (published_at is null or published_at <= now())
);

create policy "Public can view published testimonials"
on public.testimonials
for select
using (is_published = true);

create policy "Public can view public media"
on public.media_assets
for select
using (is_public = true);

create policy "Anyone can submit a contact message"
on public.contact_messages
for insert
with check (
  char_length(full_name) between 2 and 160
  and char_length(subject) between 2 and 250
  and char_length(message) between 10 and 5000
);

create policy "Anyone can subscribe"
on public.newsletter_subscribers
for insert
with check (
  char_length(email::text) between 5 and 320
);

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'site_settings',
    'navigation_items',
    'pages',
    'page_sections',
    'thematic_areas',
    'thematic_focus_items',
    'projects',
    'project_themes',
    'impact_metrics',
    'impact_stories',
    'team_members',
    'partners',
    'posts',
    'resources',
    'testimonials',
    'media_assets',
    'contact_messages',
    'newsletter_subscribers'
  ]
  loop
    execute format(
      'create policy %I on public.%I
       for select using (public.can_view_admin())',
      table_name || '_admin_select',
      table_name
    );

    execute format(
      'create policy %I on public.%I
       for all
       using (public.can_edit_content())
       with check (public.can_edit_content())',
      table_name || '_admin_write',
      table_name
    );
  end loop;
end $$;

create policy "Admins can view audit logs"
on public.audit_logs
for select
using (public.can_view_admin());

create policy "Editors can create audit logs"
on public.audit_logs
for insert
with check (public.can_edit_content());

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit
)
values
  (
    'public-media',
    'public-media',
    true,
    20971520
  ),
  (
    'private-documents',
    'private-documents',
    false,
    52428800
  )
on conflict (id)
do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit;

create policy "Public can read public media files"
on storage.objects
for select
using (bucket_id = 'public-media');

create policy "Admins can manage public media files"
on storage.objects
for all
using (
  bucket_id = 'public-media'
  and public.can_edit_content()
)
with check (
  bucket_id = 'public-media'
  and public.can_edit_content()
);

create policy "Admins can manage private documents"
on storage.objects
for all
using (
  bucket_id = 'private-documents'
  and public.can_edit_content()
)
with check (
  bucket_id = 'private-documents'
  and public.can_edit_content()
);

insert into public.site_settings (
  setting_key,
  setting_value,
  is_public
)
values
  (
    'organization_name',
    '"TPi"'::jsonb,
    true
  ),
  (
    'tagline',
    '"Better Cities. Better Lives."'::jsonb,
    true
  ),
  (
    'contact_email',
    '"info@TPi.or.tz"'::jsonb,
    true
  ),
  (
    'contact_phones',
    '["+255 749 778 332", "+255 784 642 290"]'::jsonb,
    true
  ),
  (
    'address',
    '"21 Taasisi, Mikocheni, P.O. Box 4161, Dar es Salaam, Tanzania"'::jsonb,
    true
  ),
  (
    'website',
    '"www.TPi.or.tz"'::jsonb,
    true
  )
on conflict (setting_key)
do update set
  setting_value = excluded.setting_value,
  is_public = excluded.is_public;

insert into public.thematic_areas (
  name,
  slug,
  number_label,
  short_description,
  accent_color,
  sort_order
)
values
  (
    'Inclusive Urban Transformation',
    'inclusive-urban-transformation',
    '01',
    'Building inclusive, accessible, well-planned and accountable cities.',
    '#1686C4',
    1
  ),
  (
    'Poverty Reduction',
    'poverty-reduction',
    '02',
    'Strengthening livelihoods, financial inclusion, skills and social protection.',
    '#58A52C',
    2
  ),
  (
    'Climate Resilience',
    'climate-resilience',
    '03',
    'Helping communities and cities prepare for and adapt to climate risks.',
    '#F4A900',
    3
  )
on conflict (slug)
do update set
  short_description = excluded.short_description,
  accent_color = excluded.accent_color,
  sort_order = excluded.sort_order;

insert into public.pages (
  title,
  slug,
  page_type,
  excerpt,
  status,
  published_at
)
values
  (
    'Home',
    'home',
    'homepage',
    'Better Cities. Better Lives.',
    'published',
    now()
  ),
  (
    'About TPi',
    'about',
    'standard',
    'Learn about TPi, our mission, vision, values and approach.',
    'published',
    now()
  )
on conflict (slug)
do nothing;

insert into public.navigation_items (
  label,
  url,
  location,
  sort_order
)
values
  ('Home', '/', 'header', 1),
  ('About', '/about', 'header', 2),
  ('What We Do', '/what-we-do', 'header', 3),
  ('Projects', '/projects', 'header', 4),
  ('Impact', '/impact', 'header', 5),
  ('Resources', '/resources', 'header', 6),
  ('News', '/news', 'header', 7),
  ('Contact', '/contact', 'header', 8)
on conflict do nothing;

commit;
