# BetonBiber

Modern React/Vite website for BetonBiber Bautenschutz: public pages, service estimator, gallery, contact request workflow, legal center, cookie consent, SEO files, and a private admin panel for editing site content.

## Features

- Public pages: Startseite, Leistungen, Galerie, Über uns, Kontakt
- Admin panel at `/amit`
- Editable admin content:
  - pricing and estimator parameters
  - homepage hero, stats, features, and footer text
  - services page content
  - service cards, calculator service options, and custom manual services
  - gallery images per service with URL or local image upload
  - about page content and testimonials
  - company/contact/legal imprint data
  - team profiles with image URL or local image upload
- Visibility controls:
  - hide individual homepage/about/contact content blocks
  - hide empty public sections automatically
  - hide whole public pages from the admin panel
- Contact request pipeline:
  - customer forms are stored centrally through Supabase when configured
  - requests are visible in the admin panel under `Kundenanfragen`
  - public visitors do not see submitted customer requests
- Legal center:
  - Datenschutzerklärung / Privacy Policy
  - Nutzungsbedingungen / Terms of Use
  - AGB / Impressum
- Cookie consent banner with necessary, analytics, and marketing categories
- Custom square mascot beaver favicon
- SEO support:
  - route-aware document titles and meta descriptions
  - canonical URLs
  - Open Graph metadata
  - LocalBusiness JSON-LD
  - `sitemap.xml`
  - `robots.txt`
  - static `404.html` fallback for SPA hosting

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Lucide React icons
- Browser storage for local admin/content state
- Supabase REST API for central contact request storage

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Startseite |
| `/leistungen` | Services |
| `/galerie` | Gallery |
| `/ueber-uns` | About page |
| `/kontakt` | Contact and request form |
| `/amit` | Admin panel, noindex |

Unknown routes render the custom 404 view.

## Local Development

Prerequisites: Node.js and npm.

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and configure your environment variables:
   ```bash
   cp .env.example .env
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

The dev server is configured for port `3000`. If that port is busy, Vite will offer another local port.

## Environment Variables

Configure the following variables in your `.env` file for local development or as Secrets in your deployment environment:

- `VITE_ADMIN_PASS_HASH`: The SHA-256 hash of your admin panel password.
- `VITE_EMAILJS_SERVICE_ID`: EmailJS Service ID for contact form delivery.
- `VITE_EMAILJS_TEMPLATE_ID`: EmailJS Template ID.
- `VITE_EMAILJS_PUBLIC_KEY`: EmailJS Public Key.
- `VITE_SUPABASE_URL`: Supabase project URL for central contact request storage.
- `VITE_SUPABASE_ANON_KEY`: Supabase anon key used by the static frontend.
- `VITE_SUPABASE_REQUESTS_TABLE`: Supabase table name for requests, defaults to `quote_requests`.

To generate a SHA-256 hash for your password on macOS/Linux:
```bash
echo -n "yourpassword" | shasum -a 256
```

## Verification

```bash
npm run lint
npm run build
```

`npm run lint` runs TypeScript with `tsc --noEmit`.

## Admin Notes & Security

The admin panel is available at `/amit`.

Password verification uses SHA-256 hashing for the client-side gate. Configure `VITE_ADMIN_PASS_HASH` with the SHA-256 hash of your chosen password in local `.env` files and deployment secrets.

The password hint is intentionally not shown in the login UI. Store the real password outside the repository.

## Admin Editing Scope

The admin panel currently supports editing:

- calculator pricing, units, multipliers, and service options
- manually added estimator services
- homepage sections, stats, feature blocks, team CTA, and footer text
- service page cards and service detail content
- gallery items grouped by service
- about page content, team members, testimonials, and company values
- contact details, contact intro, map/contact blocks, and legal/company data
- page visibility for public pages

Most content sections also include a `Block ausblenden` style control. Empty public sections are hidden automatically so blank admin content does not leave empty blocks on the website.

## Content Storage

Admin-edited website content is stored in browser `localStorage` via `betonbiber_pricing_config_v1`.

This means:

- content changes are browser-local unless a backend/storage service is added
- uploaded team images are stored as data URLs in browser storage
- uploaded gallery images are stored as data URLs in browser storage
- large image uploads should be avoided

For production content management, connect the admin panel to persistent storage such as Firebase, Supabase, a custom API, or a CMS.

## Central Contact Request Storage

The Kontakt form writes customer requests to Supabase when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are configured. The admin panel reads the same central table in the `Kundenanfragen` tab. If Supabase is not configured, requests fall back to browser `localStorage` for local development only.

Create the table in Supabase:

```sql
create table if not exists public.quote_requests (
  id text primary key,
  name text not null,
  email text not null,
  phone text not null,
  service_type text not null,
  message text,
  area_size numeric,
  estimated_cost numeric,
  date text not null,
  status text not null default 'Received',
  created_at timestamptz not null default now()
);
```

Minimum policies for the current static GitHub Pages setup:

```sql
alter table public.quote_requests enable row level security;

create policy "Allow public request inserts"
on public.quote_requests
for insert
with check (true);

create policy "Allow admin dashboard reads"
on public.quote_requests
for select
using (true);

create policy "Allow admin dashboard updates"
on public.quote_requests
for update
using (true)
with check (true);

create policy "Allow admin dashboard deletes"
on public.quote_requests
for delete
using (true);
```

Because GitHub Pages is a static host, the Supabase anon key is visible in the browser. For stricter production security, move admin reads/updates/deletes behind Supabase Auth, a Supabase Edge Function, or a small custom backend.

## GitHub Pages Secrets

The deploy workflow reads Vite variables from GitHub repository secrets during `npm run build`.

Set these secrets before expecting production contact requests to reach Supabase:

- `VITE_ADMIN_PASS_HASH`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SUPABASE_REQUESTS_TABLE`

EmailJS secrets are optional unless email delivery is wired back in:

- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`

## SEO And Deployment

The current GitHub Pages deployment uses:

```text
https://omidbayenderi.github.io/BetonBiber
```

If a custom domain such as `https://betonbiber.de` is connected later, update:

- `SITE_URL` in `src/App.tsx`
- `base` in `vite.config.ts`
- canonical and Open Graph URL in `index.html`
- URLs in `public/sitemap.xml`
- sitemap URL in `public/robots.txt`

For SPA hosting, configure all unknown public routes to serve `index.html`. The included `public/404.html` helps static hosts such as GitHub Pages redirect unknown paths back into the app.

## Legal Checklist Before Launch

Update the admin panel company/legal fields with real business data:

- company name
- legal representative
- full postal address
- phone and email
- VAT ID or tax information
- register court/register number if applicable
- chamber or supervisory authority if applicable

The included legal texts are professional templates for this project context, but they should be checked against the real company setup, hosting provider, analytics tools, CRM/email integrations, and any external services used in production.

## Publish Checklist

Before publishing:

1. Run `npm run lint`.
2. Run `npm run build`.
3. Confirm the real domain in SEO files.
4. Fill real legal/imprint data in the admin panel.
5. Create the Supabase `quote_requests` table and configure GitHub Secrets for central contact requests.
6. Decide whether admin-edited website content should remain localStorage-based or move to backend storage.
7. Replace the prototype admin password gate if stronger admin security is required.
8. Deploy the `dist/` folder to the hosting provider.
