-- Arivu Career & Admissions: "Voices of our students" (reviews and video
-- stories, managed in the admin panel) and two new lead sources.
-- Run once in the Supabase SQL Editor AFTER 0001. Safe to re-run.

-- ---------------------------------------------------------------------------
-- Reviews and video stories
-- ---------------------------------------------------------------------------
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'review' check (kind in ('review', 'video')),
  name text not null check (char_length(btrim(name)) between 2 and 80),
  detail text not null default '' check (char_length(detail) <= 120),
  title text not null default '' check (char_length(title) <= 120),
  quote text not null default '' check (char_length(quote) <= 1200),
  rating smallint check (rating between 1 and 5),
  -- YouTube link (watch, youtu.be or Shorts). Videos without one stay off the site.
  video_url text not null default '' check (char_length(video_url) <= 300),
  stream text not null default 'general' check (stream in ('general', 'career', 'medical', 'engineering', 'abroad')),
  is_featured boolean not null default false,
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- a review needs words; a video needs at least a title
  check (kind <> 'review' or char_length(btrim(quote)) >= 10),
  check (kind <> 'video' or char_length(btrim(title)) >= 3)
);

create index if not exists testimonials_order_idx on public.testimonials (sort_order, created_at desc);

drop trigger if exists testimonials_touch on public.testimonials;
create trigger testimonials_touch before update on public.testimonials
  for each row execute function public.touch_updated_at();

alter table public.testimonials enable row level security;

-- Everyone sees published items; admins see and change everything.
drop policy if exists "read published testimonials" on public.testimonials;
create policy "read published testimonials" on public.testimonials
  for select to anon, authenticated using (is_published or (select public.is_admin()));
drop policy if exists "admins write testimonials" on public.testimonials;
create policy "admins write testimonials" on public.testimonials
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

grant select on public.testimonials to anon, authenticated;
grant insert, update, delete on public.testimonials to authenticated;

-- Sample content for the demo, added only while the table is empty.
insert into public.testimonials (kind, name, detail, title, quote, rating, video_url, stream, is_featured, is_published, sort_order)
select * from (values
  ('review', 'Revathi Sundaram', 'Parent · Chennai · NEET 2026', 'Got Stanley in round 2', 'We were sure our son had missed out after round 1. The team told us not to take the private seat and to wait. He got Stanley Medical College in round 2.', 5, '', 'medical', true, true, 1),
  ('review', 'Ganesh Iyer', 'Parent · Chennai · TNEA 2026', 'CEG through TNEA', 'Her cutoff was 198.5. They showed us exactly which branches at Guindy were realistic and she got ECE in round 1.', 5, '', 'engineering', true, true, 2),
  ('review', 'Nandhini Ravi', 'B.Arch student · Coimbatore', 'The career test changed our plan', 'Everyone said engineering. The aptitude report and two sessions pointed to architecture. I’m now in B.Arch and I love it.', 5, '', 'career', true, true, 3),
  ('review', 'Karthik Murugan', 'MBBS student · Tirunelveli', 'The 7.5% quota explained', 'Nobody in our village knew how the government-school quota worked. They checked every certificate.', 5, '', 'medical', true, true, 4),
  ('review', 'Arjun Prakash', 'B.Tech student · Tiruchirappalli', 'JoSAA rounds made simple', 'Six rounds, float, slide, freeze… they explained it in Tamil to my parents. I’m at NIT Trichy.', 5, '', 'engineering', true, true, 5),
  ('review', 'Selvi Rajendran', 'Parent · Salem', 'Georgia, done properly', 'They only suggested NMC-compliant universities and helped with the visa. My daughter is in her third year.', 5, '', 'abroad', true, true, 6),
  ('review', 'Lakshmi Narayanan', 'Parent · Madurai · Class 11', 'Group choice in Class 10', 'My son wanted Computer Science only because his friends did. After the assessment he chose Bio-Maths, and now he is preparing for NEET with real interest.', 5, '', 'career', false, true, 7),
  ('review', 'Fathima Nasreen', 'Parent · Coimbatore', 'Honest about fees', 'They showed us the full four-year cost, hostel included, before we decided. No surprises in the first year.', 4, '', 'engineering', false, true, 8),
  ('review', 'Mohammed Irfan', 'Parent · Tiruchirappalli', 'Answered every call', 'During counselling we called almost every day. Someone always picked up, even on Sundays.', 5, '', 'medical', false, true, 9),
  ('video', 'Divya Lakshmi', 'B.Tech student · NIT Tiruchirappalli', 'How we chose between NIT and VIT', '', null, '', 'engineering', true, true, 10),
  ('video', 'Karthik Murugan', 'MBBS student · Tirunelveli', 'From a government school to MBBS', '', null, '', 'medical', true, true, 11),
  ('video', 'Anitha Selvi', 'MBBS student · Georgia', 'Third year in Tbilisi: what it is really like', '', null, '', 'abroad', true, true, 12)
) as sample (kind, name, detail, title, quote, rating, video_url, stream, is_featured, is_published, sort_order)
where not exists (select 1 from public.testimonials);

-- ---------------------------------------------------------------------------
-- New lead sources: the NEET score calculator and the student stories page
-- ---------------------------------------------------------------------------
alter table public.leads drop constraint if exists leads_source_check;
alter table public.leads add constraint leads_source_check
  check (source in ('hero', 'career', 'fee_breakup', 'cutoffs', 'contact', 'abroad', 'seminar', 'cta', 'neet_calculator', 'stories'));
