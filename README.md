# TPi Tanzania Website

A premium institutional website and lightweight content management platform for TPi Tanzania, built with Next.js App Router, TypeScript, Tailwind CSS and Supabase.

## Features

- Server-rendered public website with cinematic hero, thematic areas, projects, impact stories, news, resources and partner sections.
- Authenticated admin panel with role-based access (super_admin, admin, editor, viewer).
- **Website Content editor** (Admin → Website Content): every static block on the
  public site — hero slides, headings, body copy, photos, buttons, SDG grid,
  page headers — is editable without touching code. See below.
- Content management for pages, projects, posts, resources, team, partners and media.
- File uploads (reports, PDFs, Office documents, images) direct from any admin
  form into Supabase Storage.
- Contact form with rate limiting and Cloudflare Turnstile support.
- Newsletter subscriptions.
- Automatic sitemap and robots.txt.
- SEO metadata and structured data.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SITE_URL=https://www.tpi.or.tz
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

3. Run the database migrations in the Supabase SQL Editor, in order:
   - `supabase/migrations/0001_tpi_website_cms.sql` (schema, RLS, storage buckets, seed data)
   - `supabase/migrations/0002_backend_fixes.sql` (indexes, newsletter resubscribe policy)
   - `supabase/migrations/0003_editable_site_content.sql` (editable page blocks + fixes)

   All three are idempotent — re-running them is safe.

4. Create the administrator account:

   ```bash
   bash supabase/scripts/create-admin.sh
   ```

   This reads `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env.local`, creates (or
   resets) that account and grants it `super_admin`. Sign in at `/admin/login`.

   > **The password is intentionally not in this repository.** This repo is
   > public, so a password committed here would let anyone sign into the live
   > admin panel. It lives in `.env.local`, which is gitignored.

   To use a different account, or to change the password, either edit
   `ADMIN_PASSWORD` in `.env.local` and re-run the script, or pass values
   directly:

   ```bash
   bash supabase/scripts/create-admin.sh you@example.com 'your-password'
   ```

   The credentials live in Supabase Auth, not in the code, so the whole admin
   panel runs under Row Level Security as a real user.

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Visit `http://localhost:3000` for the public site and `http://localhost:3000/admin` for the admin panel.

## Deployment

The site is configured for deployment on Vercel. Connect your repository and add the environment variables in the Vercel dashboard.

## Project Structure

```text
src/
├── app/
│   ├── (website)/     # Public website routes
│   ├── (admin)/       # Admin panel routes
│   ├── api/           # API routes
│   ├── sitemap.ts
│   ├── robots.ts
│   └── layout.tsx
├── components/
│   ├── admin/         # Admin UI components
│   ├── forms/         # Public forms
│   ├── layout/        # Header, footer, navigation
│   ├── sections/      # Homepage sections
│   └── ui/            # shadcn/ui components
├── lib/
│   ├── supabase/      # Supabase clients and middleware
│   ├── data/          # Public data queries
│   ├── email/         # Email helpers
│   ├── seo/           # SEO helpers
│   ├── validation/    # Zod schemas
│   └── utils/         # Utilities
├── actions/           # Server actions
└── types/             # TypeScript types
```

## Editing website content

Text and images that are not database records (the home page hero, section
headings, intro paragraphs, the SDG grid, every page header) are managed as
**content blocks** under Admin → Website Content.

Each block is declared once in `src/lib/content/schema.ts`: the fields it
exposes and the copy the site ships with. Values are stored in the
`site_content` table keyed by `(page_key, block_key)`, and read back through
`getBlock()` in `src/lib/content/index.ts`, which merges saved values over the
shipped defaults.

Consequences worth knowing:

- A block that has never been edited renders its default, so the site works on
  an empty database.
- Clearing a field in the admin restores the default rather than leaving a gap.
- "Reset to original" deletes the stored row.
- **Adding a new editable section needs no new admin page.** Add an entry to
  `CONTENT_PAGES` in `schema.ts` and read it in the component with
  `getBlock("<page>", "<block>")` — the form, list add/remove/reorder controls
  and save action are generated from the declaration.

## Notes

- The service role key must never be exposed to the browser. It is only used in server actions.
- All tables have Row Level Security enabled. The admin panel authenticates as a
  real Supabase user, so RLS applies to admin writes too — it is not bypassed.
- Real impact figures should be added via the admin panel; no fictional statistics are displayed.
- `.env.local` is gitignored and must never be committed; it holds the service role key.
