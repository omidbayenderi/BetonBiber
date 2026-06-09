# BetonBiber

Modern React/Vite website for BetonBiber Bautenschutz: services, estimator, contact workflow, legal center, cookie consent, SEO files, and a private admin panel for editing site content.

## Features

- Public pages: Startseite, Leistungen, Über uns, Kontakt
- Admin panel at `/amit`
- Editable admin content:
  - pricing and estimator parameters
  - homepage hero, stats, features, and footer text
  - services page content
  - about page content and testimonials
  - company/contact/legal imprint data
  - team profiles with image URL or local image upload
- Legal center:
  - Datenschutzerklärung / Privacy Policy
  - Nutzungsbedingungen / Terms of Use
  - AGB / Impressum
- Cookie consent banner with necessary, analytics, and marketing categories
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

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Startseite |
| `/leistungen` | Services |
| `/ueber-uns` | About page |
| `/kontakt` | Contact and request form |
| `/amit` | Admin panel, noindex |

Unknown routes render the custom 404 view.

## Local Development

Prerequisites: Node.js and npm.

```bash
npm install
npm run dev
```

The dev server is configured for port `3000`. If that port is busy, Vite will offer another local port.

## Verification

```bash
npm run lint
npm run build
```

`npm run lint` runs TypeScript with `tsc --noEmit`.

## Admin Notes

The admin panel is available at `/amit`.

Default local/dev passwords currently accepted by the app:

- `admin123`
- `biber2026`

Before production, replace this client-side password gate with real authentication if the admin panel will be publicly reachable. The current implementation is suitable for a prototype/static local admin workflow, not as strong production security.

## Content Storage

Admin-edited content is stored in browser `localStorage` via `betonbiber_pricing_config_v1`.

This means:

- content changes are browser-local unless a backend/storage service is added
- uploaded team images are stored as data URLs in browser storage
- large image uploads should be avoided

For production content management, connect the admin panel to persistent storage such as Firebase, Supabase, a custom API, or a CMS.

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
5. Decide whether admin content should remain localStorage-based or move to backend storage.
6. Replace the prototype admin password gate if public admin access is required.
7. Deploy the `dist/` folder to the hosting provider.
