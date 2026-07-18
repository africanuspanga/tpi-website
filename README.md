# TPi Tanzania Website

A premium institutional website and lightweight content management platform for TPi Tanzania, built with Next.js App Router, TypeScript, Tailwind CSS and Supabase.

## Features

- Server-rendered public website with cinematic hero, thematic areas, projects, impact stories, news, resources and partner sections.
- Authenticated admin panel with role-based access (super_admin, admin, editor, viewer).
- Content management for pages, projects, posts, resources, team, partners and media.
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

3. Run the database migration in Supabase SQL Editor:
   - Open `supabase/migrations/0001_tpi_website_cms.sql`
   - Run it against your Supabase project

4. Create the first super administrator:
   - Create a user in Supabase Authentication
   - Copy the user UUID
   - Run the SQL snippet from the brief (section 11) to insert into `public.admin_users`

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

## Notes

- The service role key must never be exposed to the browser. It is only used in server actions.
- All tables have Row Level Security enabled.
- Real impact figures should be added via the admin panel; no fictional statistics are displayed.
