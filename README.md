# Arivu Career & Admissions (sample website)

A demo website and admin panel for an education consultancy: career guidance from Class 8 onwards,
and admission help for medicine, engineering and other courses, in Tamil Nadu, across India and abroad. Built to show a prospective client how their site would look
and work. **All names, numbers, reviews and fees are sample content.**

React 19 · React Router 8 · Tailwind CSS 4 · GSAP 3.15 + Lenis · React Bits · Supabase

## Run it

```powershell
npm install
npm run dev
```

Open http://localhost:5180. With no `.env`, the site runs in **demo mode**:

- Colleges, fees and cutoffs come from `src/data/`.
- Leads and fee changes are saved in your browser only (localStorage).
- Admin: http://localhost:5180/admin, any email, password `demo1234`.
- "Reset demo data" in the admin puts everything back.

Demo mode is enough to show the whole flow on one laptop: send a form in one tab, and it appears
in `/admin` in another tab without refreshing.

## Connect Supabase (live mode)

1. Create a Supabase project (region: Mumbai).
2. SQL Editor: run `supabase/migrations/0001_schema.sql`, then `supabase/seed.sql`.
   If the `pg_cron` line fails: Database → Extensions → turn on **pg_cron**, run the file again.
3. Authentication → Users → **Add user** (email + password) for each counsellor, then in the SQL Editor:
   ```sql
   insert into public.admins (user_id) select id from auth.users where email = 'counsellor@example.com';
   ```
4. Copy `.env.example` to `.env` and fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
   (Project Settings → API Keys). Restart `npm run dev`.

Only the publishable key is used. The database rules decide who can do what:
visitors can read published colleges and send a lead through `submit_lead()` (checked, spam-trapped,
5 per number per hour); only admins can read leads or change fees.

## Deploy (Vercel)

Import the repo, add the two `VITE_SUPABASE_*` variables, deploy. `vercel.json` sends every page to
the app and keeps the demo out of search engines (`noindex`).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Local site on port 5180 |
| `npm run build` | Production build in `dist/` |
| `npm run lint` / `npm run format` | ESLint / Prettier |
| `npm run seed:sql` | Rebuild `supabase/seed.sql` from `src/data/` |
| `npm run test:db` | 32 checks of the database rules in PGlite (real Postgres, in memory) |
| `npm run check` | All of the above |

## Where things are

| Path | What |
|---|---|
| `src/pages/` | Public pages: Home, Career Guidance, Medical, Engineering (with TNEA cutoff calculator), Study Abroad, Colleges, College, About, Contact, legal, 404 |
| `src/pages/admin/` | Admin: sign-in, dashboard, leads, colleges & fees |
| `src/components/bits/` | React Bits components (SplitText, AnimatedContent, ScrollReveal, SpotlightCard, Magnet), adapted; licence in that folder |
| `src/lib/api.js` | One data API; picks demo or Supabase |
| `src/data/` | Agency details, colleges (23 medical, 16 engineering), fees, cutoffs, career guidance, abroad guide, page content |
| `supabase/` | Database setup and sample data |

Photos are from Unsplash (free licence) and are illustrative: they are not the colleges shown.
