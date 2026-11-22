# Medical admissions consultancy: sample website plan

Written 22 Nov 2026. **First build done the same day: see "Progress" below.**
Work through the stages in order. Each stage leaves something you can open and look at, so we can stop between stages.

**What the sample must show the client, end to end:**
a parent finds a college and its fees → leaves their WhatsApp number and email → the agency sees that lead in the admin panel, and can change a college's fees so the site updates straight away.

**Who does what**
- **You**: decisions, the client's content, creating the GitHub, Supabase and Vercel projects, and testing on real phones (how it looks and feels).
- **Me**: code changes and the technical tests.

Tick items off as they're done: `- [x]`.

---

## Change of scope (22 Nov 2026, second pass)

**Your correction:** the agency is for **all students**, not only medical. Done:

| What | Status |
|---|---|
| Rebranded to **Arivu Career & Admissions**: new logo mark (a guiding star), titles, footer, WhatsApp messages | ✅ |
| Header: **Career Guidance** link, plus an **Admissions** menu (Medical · Engineering · Study abroad); phone menu groups them | ✅ |
| Home: new headline (“Turn your marks into the right career”), general student photos, “What we help with” (4 services + other courses), a **career guidance** section, medical + engineering colleges, fee table with Medical / Engineering tabs, broader steps, testimonials, updates and FAQ | ✅ |
| New **Career Guidance** page: Class 8–10 / 11–12 / after 12, 4-step process, 8 career paths with their exams, 3 sample packages | ✅ |
| New **Engineering** page: JoSAA, TNEA, university exams; **TNEA cutoff calculator**; categories, documents, dates | ✅ |
| “MBBS in India” → **Medical**; “MBBS Abroad” → **Study abroad** (plus degrees in Germany, Canada, UK). Old links redirect | ✅ |
| **16 engineering colleges** (IIT Madras, NIT Trichy, CEG, PSG Tech, SSN, VIT, SRM, BITS…), with fees by quota, average package and TNEA / JoSAA cutoffs; colleges list has Medical / Engineering tabs | ✅ |
| Lead form: “NEET score” replaced by **stage** (Class 8–10 … graduate), **looking for** (career guidance, medical, engineering, study abroad, other courses) and a free-text **marks / score** | ✅ |
| Admin: stream filter and course on colleges, fee editor per course (B.E./B.Tech fees use 4 years), leads show stage and score | ✅ |
| Database: stream, aided colleges, average package, decimal cutoff marks, new lead fields. Tests: **32/32** (the tests caught two real limits: CEG founded 1794, VIT/SRM intake over 2,000) | ✅ |
| Phone check: no sideways scrolling on any page at 320 px and 375 px (fixed three spots) | ✅ |

**Git:** https://github.com/muzammil041204-droid/edu-web (first commit and push 22 Nov 2026, branch `main`).

---

## Progress (22 Nov 2026)

**Your answers:** made-up details are fine for now (the client is a prospect; real details later), use React Bits where it helps, and follow the reference image. Every other Stage 0 default was used.

**Built and checked:** stages 1 to 5, most of 6 and 7. The site runs today in **demo mode** (no Supabase needed); see `README.md`.

| What | Status |
|---|---|
| Public pages: Home, Colleges (filters, sort), College page (fees by quota, cutoffs by category), MBBS in India (+ Tamil Nadu), MBBS Abroad, About, Contact, Privacy, Terms, 404 | ✅ |
| Lead form in 7 places (hero, fee breakup, cutoffs, contact, abroad, seminar, closing banner); fee and cutoff tables blurred until the form is sent; remembered on the device | ✅ |
| Admin: sign-in, dashboard (live), leads (search, filters, status, notes, WhatsApp/call/email, CSV export, delete), colleges (partner and show-on-site switches), fee editor per quota and year with "copy last year" | ✅ |
| Supabase: `supabase/migrations/0001_schema.sql` + `supabase/seed.sql` (23 colleges, 46 fee rows, sample cutoffs) | ✅ written, **not yet run on a real project** |
| Database rules tested: `npm run test:db`, 29 checks in PGlite (visitor, signed-in non-admin, admin) | ✅ 29/29 |
| React Bits (adapted, licence kept): SplitText (headlines), AnimatedContent (section reveals), ScrollReveal (word-by-word statements), SpotlightCard (route and NMC cards), Magnet (hero button) | ✅ |
| GSAP + Lenis: smooth scroll on public pages only, hero photo reveal and parallax, number count-up, scroll-drawn admission timeline; all off for reduced motion | ✅ |
| Browser checks: every page loads with no console errors and no sideways scroll at 375 / 1024 / 1280 px; phone menu (Escape closes, focus returns); form validation and success; fee change in admin shows on the college page | ✅ |

**Changed from the plan:**
- Leads are saved through a database function (`submit_lead`) with the publishable key, not a Vercel server function. Same protection (checks, spam trap, per-number limit), but nothing to run on a server, so the demo deploys as a plain static site.
- Email alert for new leads: **not built** (it needs a server or a Supabase Edge Function + an email service). The admin panel already shows new leads live with a pop-up.
- Lead "sources" grew from 5 to 7 (added seminar sign-up and the closing banner).

**Placeholder content to swap for the client's real details:** agency name "Arivu Medical Admissions", logo, phone `+91 98765 43210`, email, Anna Nagar address, branches, the 4 team members, all numbers (4,200+ students, 96%, 1,850+ seats, 12 partners), the 6 testimonials, the seminar, counselling updates, partner colleges. All are in `src/data/site.js` and `src/data/content.js`.

**Your next steps:**
1. Open the demo (`npm run dev`, then http://localhost:5180) and look at it on a real phone.
2. When ready for the shared link: create the Supabase project and Vercel project (steps in `README.md`), and I'll check the live setup with you.

---

## What the research showed

### Shiksha (checked in a browser, 22 Nov 2026)
- **College list:** filters for state → city, fee band (<1L, 1–3L … >15L), rating and course. Each card shows name, city, Govt/Pvt, rating, exams accepted, **one "Total tuition fees" number**, Compare and Brochure.
- **College course page:** tabs for Info, Courses, Fees, Reviews, Admissions, Placements, Cut-offs, Rankings, Infrastructure, Faculty, Q&A. The overview table shows total fee, duration, seats, type of college and website.
- **Lead gate:** "Brochure", "Get fee details" and "Show phone & email" all open a sign-up form. It asks for **mobile (+91), full name and email**, plus a consent tick to be contacted by WhatsApp, SMS and mail. This is the same kind of lead capture the client wants.
- **Where we can do better:** Shiksha shows one total fee. Parents need the fee **by quota**. At one Tamil Nadu private college it can run from about ₹4.5 lakh a year (government quota) to about ₹27 lakh a year (NRI).

### How admission works (this decides the pages)
- **Two counselling systems after NEET:**
  - **MCC:** the 15% all-India quota, deemed universities, AIIMS, JIPMER and other central institutes. In 2026 it ran rounds 1–3, a stray round and a special stray round in November.
  - **State counselling:** the other 85%.
- **Tamil Nadu (Selection Committee, tnmedicalselection.net):**
  - Seats are government quota, management quota and NRI quota (the last two in private self-financing colleges).
  - Government-school students get a 7.5% preference.
  - There are seven categories: OC, BC, BCM, MBC & DNC, SC, SCA, ST. Confirm the exact percentages against the current prospectus.
- **Fee bands (sources disagree, so the sample uses them as sample figures):**
  - Government colleges: about ₹15K to ₹1L in total.
  - TN private colleges, government quota: about ₹4.35–4.5L a year.
  - Management quota: about ₹15L a year (some sources still say ₹13.5L).
  - NRI quota: about ₹27L a year.
  - Many deemed universities: now over ₹1 crore in total.
- **MBBS abroad:**
  - NMC rules (Foreign Medical Graduate Licentiate Regulations, 2021) require a 54-month course plus a 12-month internship at the same university, taught in English, a NEET qualification, and a licence to practise in that country.
  - As of November 2026, **FMGE is still the licensing exam and NExT hasn't started**. An August 2026 draft keeps FMGE until NExT begins.
  - NMC warns about specific universities, so the site should link NMC's notices rather than make its own claims.
- **Competitor sites all have:** a free counselling call, WhatsApp, a college predictor, cutoffs by category, fee lists, a document checklist and key dates.

### Things an education agency's site needs for trust and legal safety
- **No "guaranteed seat", "direct admission" or "donation seat".** Capitation fees are illegal, and all seats, including management quota, go through official counselling. The wording should be "we guide you through official counselling".
- **A clear "Partner college" label** on tie-up colleges. Recommending a partner is a conflict of interest, so being open about it builds trust.
- **Consent for leads:** leads are personal data under India's DPDP Act. That means an unticked consent box, a privacy policy and a way to delete someone's details. This is the same approach as ISOFORM.
- **Fee details:** every fee shows its academic year, the date it was last updated and its source.

---

## Stage 0: Decisions (you, with the client)

Nothing here is code. I'll use the **bold default** unless you say otherwise.

- [x] **Client name, logo and contact details** (office address, phone, WhatsApp, opening hours). Default: **placeholder name and logo until you send them.**
- [x] **What "all categories" means.** Reservation categories (OC/BC/MBC/SC/ST for Tamil Nadu; General/EWS/OBC/SC/ST for all-India) or courses (MBBS, BDS, AYUSH, nursing)? Default: **reservation categories, MBBS only, with BDS easy to add.**
- [x] **Student "login".** Default: **a Shiksha-style form (name, WhatsApp, email) with no password, remembered on that phone.** A real login with an OTP needs a paid SMS/WhatsApp provider, so that comes later.
- [x] **What sits behind the form.** Default: **public: the college list, overview and "from ₹X a year". Behind the form: the fee breakup by quota, past cutoffs and a counsellor callback.**
- [x] **Sample data.** Default: **real college names with 2026-27 figures marked "sample – verify", a "Demo site" banner, and hidden from Google.** The alternative is made-up colleges.
- [x] **Partner colleges.** Which ones? Default: **3 marked as examples.**
- [x] **Abroad countries.** The ones the client actually sends students to. Default: **5 sample countries; fixed text, not editable in the admin.**
- [ ] **Email alert to the agency for each new lead**, reusing the ISOFORM Gmail setup. Default: **yes.**
- [x] **Language.** Default: **English for the sample; Tamil later.**

---

## Stack (versions checked on npm, 22 Nov 2026)

These are the same tools as ISOFORM, so we reuse its lint/format configs, the `admins` table with `is_admin()`, the server function that saves enquiries, and the shared spam limit.

| Part | Choice | Version |
|---|---|---|
| UI | React, React DOM | 19.3.1 |
| Build | Vite + @vitejs/plugin-react | 8.3.8 / 6.3.0 |
| Routing | React Router | 8.5.2 |
| Styling | Tailwind CSS (@tailwindcss/vite), plus one small CSS file for colour and spacing tokens | 4.3.5 |
| Animation | GSAP (ScrollTrigger and SplitText are now free) + @gsap/react | 3.15.1 / 2.1.2 |
| Smooth scroll | Lenis (`lenis/react`) | 1.3.27 |
| Backend | Supabase: Postgres, Auth, row-level security, Realtime (live updates) | supabase-js 2.119.2 |
| Hosting | Vercel, with one serverless function for saving leads | n/a |
| Icons | lucide-react | 1.77.0 |
| Fonts | Plus Jakarta Sans + Instrument Serif (Fontsource, self-hosted) | 5.3.0 |
| Tests | Playwright + axe; PGlite for testing the database rules | 1.65.1 / 0.5.17 |

No form library or data-fetching library: the sample doesn't need them. The code is JavaScript (JSX), like ISOFORM.

---

## Pages

### Public
| Page | Content |
|---|---|
| `/` Home | See the section order below |
| `/colleges` | Shiksha-style list. Filters: state, city, type (Govt / Private / Deemed / Central), fee band, partner only. Sort by fees, NIRF rank or name. "Load more" button. |
| `/colleges/:slug` | Overview table (type, university, founding year, seats, NIRF rank, counselling body), **fees by quota** (detail behind the form), cutoffs by category and round (behind the form), admission steps, enquiry box |
| `/mbbs-in-india` | NEET → MCC vs state counselling; quotas and fee bands; a Tamil Nadu section (Selection Committee, 7.5% preference, categories); document checklist; key dates; links to official sites |
| `/mbbs-abroad` | NMC rules checklist, a country table (total cost range, duration, teaching language), a checklist for choosing a university, links to NMC notices |
| `/about`, `/contact` | The agency, real counsellors with real photos, the process, office address and map, contact form |
| `/privacy`, `/terms`, 404 | |

### Admin (`/admin`, hidden from Google)
Sign-in, dashboard, leads, colleges, fees.

### Home page order, following how a parent decides
1. **Hero:** "Turn your NEET score into a *medical seat*" (serif-italic accent word, like the reference). One line on Tamil Nadu / India / abroad. Two buttons: **Book free counselling** and **WhatsApp us**. Photo.
2. **Three paths:** Tamil Nadu · Other states · Abroad, each with an honest fee band and who it suits.
3. **Featured colleges:** partner colleges first (gold badge) → "Browse all colleges".
4. **How admission works:** NEET result → registration → choice filling → allotment → reporting, with what the agency does at each step. The timeline draws as you scroll.
5. **What MBBS really costs:** Govt / Govt quota in private / Management / NRI / Deemed, per-year bands.
6. **Why families choose the agency:** real numbers only (placeholders until the client sends them).
7. **Student stories:** real ones only. Until the client sends some, the demo shows clearly labelled placeholders.
8. **Key dates and FAQ** (accordion with a photo, as in the reference).
9. **"Talk to a counsellor" band**, then the footer (address, phone, WhatsApp, hours, official links, legal pages).

---

## Lead capture

- **One form, used in 5 places:** the hero, "See full fee breakup" on a college page, cutoffs, Contact and the abroad guide. Each lead records which button it came from and which college the student was looking at.
- **Six fields:**
  - Name.
  - WhatsApp number (+91 fixed; 10 digits starting 6–9).
  - Email.
  - NEET score (or "not written yet").
  - Category.
  - Interested in: Tamil Nadu / other states / abroad / not sure.

  Plus an **unticked** consent box: "I agree to be contacted on WhatsApp, phone and email about admissions", linking to the privacy policy.
- **How it saves:** through a Vercel function that holds the secret key (the ISOFORM pattern). It checks the data on the server, has a hidden spam trap and a shared rate limit. The browser can never read leads.
- **After sending:** a success message, the hidden details open, and the phone remembers the student so they aren't asked again. If saving fails, they get a clear error and can try again.
- **WhatsApp button:** a floating button that opens WhatsApp with a message already typed.

---

## Admin panel

- **Sign-in:** email and password. We create the accounts in Supabase; there's no public sign-up. Non-admin accounts see nothing.
- **Dashboard:** new leads today and this week, broken down by interest and by source; the colleges students ask about most; the latest 10 leads.
- **Leads:**
  - Search (name, phone, email) and filters (status, interest, category, date, college).
  - Status: New → Contacted → Counselling booked → Applied → Admitted / Not interested.
  - Notes, and one tap to **WhatsApp, call or email**.
  - CSV export, and delete (for deletion requests).
  - **New leads appear without refreshing.**
  - Shows as cards on a phone, so counsellors can use it on the go.
- **Colleges:** add, edit or hide a college; turn the partner label on or off; add a photo.
- **Fees:** pick a college and academic year, then edit a table.
  - Rows are the quotas (government, management, NRI, all-India); columns are tuition per year, hostel per year and one-time fees.
  - The total is worked out for you. Saving shows on the site immediately as "updated today".
  - A "copy 2026-27 to 2027-28" button saves retyping each year.
  - Optional: a log of every price change (who, when, old → new).

---

## Database (Supabase, Mumbai region)

| Table | What it holds | Who can see or change it |
|---|---|---|
| `colleges` | Name, slug, city, state, type, university, founding year, MBBS seats, NIRF rank, partner label, published or hidden, photo, summary, counselling body (MCC / Tamil Nadu) | Everyone reads published colleges; admins edit |
| `college_fees` | One row per college × course × quota × academic year: tuition per year, hostel per year, one-time fees, note, source link, last updated (when and by whom) | Everyone reads; admins edit |
| `cutoffs` | College × year × counselling × quota × category × round → closing rank / marks (sample data) | Everyone reads; admins edit |
| `leads` | Form fields, the college viewed, source button, page, consent and its time, status, notes, ad-campaign tags (UTM) | The server function adds them; only admins read, update or delete |
| `admins`, rate-limit table | Reused from ISOFORM | |

**Seed data:** about 25 colleges (around 15 in Tamil Nadu: government, private self-financing and deemed; around 10 elsewhere), 2026-27 fees and sample cutoffs.

---

## Design direction

Adapted from the reference image and the Starbucks green-and-cream system in the design catalog, not copied.

- **Colours:**
  - Deep green bands and footer (about `#1F3D34`); green buttons (about `#2E5E4E`); a pale green tint.
  - Warm cream page background (about `#F5F3EE`), white cards, near-black text.
  - **Gold only for the "Partner college" badge.**
  - All contrast checked to WCAG AA.
- **Type:** Plus Jakarta Sans for headings and text; Instrument Serif italic for one accent word per headline.
- **Shapes:** 16px rounded cards, 24px rounded large photos, pill shapes only for buttons and small labels, thin borders, shadow only on hover.
- **Page rhythm:** cream hero → white → green band → cream → white → green → green footer, as in the reference.
- **Photos:** the client's real photos where possible. Licensed stock for the demo, never passed off as the agency's own team.

## Motion (GSAP + Lenis)

- Lenis smooth scrolling runs on public pages only. The admin keeps normal scrolling so tables and forms behave. Lenis pauses while the form popup is open.
- GSAP's timer drives Lenis and ScrollTrigger listens to it, so scroll animations never lag behind the scroll.
- **Five animations only:**
  - The hero text reveal.
  - The hero photo moving slightly slower than the page as you scroll.
  - Numbers counting up.
  - The admission timeline drawing as you scroll.
  - Cards appearing as they come into view.

  Everything else is plain CSS hover and focus states.
- **Reduced motion:** if the visitor's phone or computer is set to reduce motion, there's no smooth scroll and nothing moves; content shows straight away.
- **On page change:** jump to the top, refresh the scroll triggers, clean up old animations.

---

## Stage 1: Setup

- [x] Git repo in this folder (separate from ISOFORM); nothing committed yet.
- [ ] **You:** create the GitHub repo.
- [x] Vite + React + Tailwind; colour and spacing tokens; fonts.
- [x] Header with mobile menu, footer, floating WhatsApp button, "Demo site" banner.
- [x] Lenis + GSAP set up once for the whole site.
- [x] All pages as placeholders; 404.
- [x] Lint and format configs (from ISOFORM); `.env.example`.

**Done when:** every page opens; turning on reduced motion stops all movement; no errors in the browser console; no sideways scrolling at 320px.

## Stage 2: Database

- [x] Database setup file: tables, access rules, admin check, rate limit.
- [x] Seed data: colleges, 2026-27 fees, sample cutoffs.
- [ ] `/api/lead` server function (from ISOFORM).
- [ ] **You:** create the Supabase project (Mumbai), run the SQL, add the keys, create the admin account.

**Done when:** tests prove the public can read colleges but can't read leads or change fees.

## Stage 3: Public pages

- [x] Home, Colleges list, College page, MBBS in India, MBBS Abroad, About, Contact, Privacy, Terms, 404.
- [x] Loading, empty ("no colleges match") and error states.

**Done when:** real data from Supabase shows on every page, on phones and desktops.

## Stage 4: Lead capture

- [x] The form in all 5 places, with source and college recorded.
- [x] Hidden details open after sending; phone remembers the student.
- [x] Success and failure messages; consent box; spam trap.
- [ ] Email alert to the agency: not built (needs a server or an Edge Function; see Progress).

**Done when:** a test lead arrives in the database with the right source and college.

## Stage 5: Admin

- [x] Sign-in and sign-out; non-admins see nothing.
- [x] Dashboard, leads, colleges, fees editor.
- [x] Live updates for new leads.

**Done when:** a fee change in the admin shows on the college page, and a new lead appears in the admin without refreshing.

## Stage 6: Motion and polish

- [x] The five animations.
- [x] Image sizes and formats (responsive Unsplash sizes, lazy loading).
- [ ] Swap stock photos for the client’s own.
- [ ] A final pass over the wording.

**Done when:** it runs smoothly on a mid-range Android phone; reduced motion checked.

## Stage 7: Checks and demo

- [ ] Playwright smoke tests and axe accessibility scan (checked by hand in the browser so far: 375 / 1024 / 1280 px, no console errors, no sideways scroll).
- [x] Database rule tests: `npm run test:db`, 29/29.
- [ ] Lighthouse.
- [ ] Deploy to Vercel, hidden from Google.

**Done when:** `npm run check` passes and the demo link works on a phone.

---

## Not in the sample (offer to the client later)

- OTP login (SMS or WhatsApp).
- WhatsApp Business auto-replies and broadcasts (paid per message).
- A Tamil version.
- A news/blog editor.
- College comparison.
- Brochure PDFs.
- A college predictor using full official cutoff data.
- Paid counselling packages with online payment.
- Staff roles and lead assignment.
- Pages pre-built for Google (as on ISOFORM).
- Analytics and ads tracking.

## Demo for the client meeting (5 minutes)

1. On a phone: Home → Tamil Nadu → filter Chennai + Private → open a college → "See full fee breakup" → fill in the form.
2. On a laptop: the lead appears in the admin with the college they looked at → tap WhatsApp → the chat opens.
3. Change the management-quota fee in the admin → refresh the phone → the new price shows, "updated today".
4. Scroll through the abroad page and the admission guide.

## Things to watch

- Supabase's free plan pauses a project after about a week with no activity. Open it the day before the meeting.
- Fee sources disagree (TN management quota is listed as both ₹13.5L and ₹15L). That's exactly why the fee editor, the "last updated" dates and source links matter.

---

## Sources

- [Shiksha: TN MBBS colleges list](https://www.shiksha.com/medicine-health-sciences/colleges/mbbs-colleges-tamil-nadu)
- [Shiksha: MBBS course page example](https://www.shiksha.com/college/sri-muthukumaran-medical-college-chennai-69919/course-mbbs-bachelor-of-medicine-and-bachelor-of-surgery-432281)
- [Shiksha: TN NEET counselling](https://www.shiksha.com/medicine-health-sciences/tamil-nadu-neet-counselling)
- [Careers360: TN self-financing college fees](https://news.careers360.com/mbbs-fees-in-tamil-nadu-rs-18-crore-self-financing-private-medical-colleges-hostel-mess-expensive-management-nri-govt-quota)
- [Careers360: deemed university fees over ₹1 crore](https://news.careers360.com/mcc-neet-counselling-2026-mbbs-fees-rs-1-crore-46-pvt-medical-colleges-deemed-university-tag-tamil-nadu-karnataka-maharashtra)
- [Careers360: MCC special stray vacancy round 2026](https://news.careers360.com/neet-ug-counselling-2026-mcc-announces-special-stary-vacancy-round-schedule-mbbs-bds-bsc-nursing-admission)
- [Medical Dialogues: TN government quota admission details](https://medicaldialogues.in/amp/news/education/medical-admissions/seeking-mbbs-bds-govt-quota-seats-at-tn-medical-colleges-check-complete-admission-details-here-174417)
- [Medical Dialogues: NMC draft keeps FMGE until NExT](https://medicaldialogues.in/health-news/nmc/nmc-draft-keeps-fmge-for-provisional-nmr-registration-of-foreign-medical-graduates-until-next-exam-rollout-177477)
- [Careers360: MBBS abroad fees 2026](https://studyabroad.careers360.com/articles/mbbs-abroad-fees-for-indian-students-in-2026)
