-- Arivu Career & Admissions (demo): colleges, fees, cutoffs, leads and admin access.
-- Run once in the Supabase dashboard (SQL Editor), or with `supabase db push`.
-- Every step is safe to re-run. Then run supabase/seed.sql for the sample data.
--
-- Who can do what (enforced by row-level security):
-- - Anyone (the website, publishable key): read published colleges, their fees and
--   cutoffs; send a lead ONLY through public.submit_lead(), which checks the data
--   and limits repeats. Nobody outside the team can read leads.
-- - Admins (signed-in users listed in public.admins): read and change everything.

-- ---------------------------------------------------------------------------
-- Admins
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  added_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Colleges
-- ---------------------------------------------------------------------------
create table if not exists public.colleges (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 80),
  name text not null check (char_length(name) between 3 and 160),
  city text not null check (char_length(city) between 2 and 80),
  state text not null check (char_length(state) between 2 and 80),
  ownership text not null check (ownership in ('government', 'aided', 'private', 'deemed', 'central')),
  stream text not null default 'medical' check (stream in ('medical', 'engineering')),
  university text not null default '' check (char_length(university) <= 160),
  established int check (established between 1700 and 2100),
  seats int check (seats between 0 and 20000),
  beds int check (beds between 0 and 20000),
  avg_package_lpa numeric(5, 1) check (avg_package_lpa between 0 and 200),
  counselling text[] not null default '{}',
  courses text[] not null default '{MBBS}',
  image text not null default '' check (char_length(image) <= 500),
  summary text not null default '' check (char_length(summary) <= 1000),
  is_partner boolean not null default false,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists colleges_touch on public.colleges;
create trigger colleges_touch before update on public.colleges
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Fees: one row per college × course × quota × academic year (rupees)
-- ---------------------------------------------------------------------------
create table if not exists public.college_fees (
  id uuid primary key default gen_random_uuid(),
  college_id uuid not null references public.colleges (id) on delete cascade,
  course text not null default 'MBBS' check (course in ('MBBS', 'BDS', 'B.E. / B.Tech')),
  academic_year text not null check (academic_year ~ '^[0-9]{4}-[0-9]{2}$'),
  quota text not null check (quota in ('govt', 'aiq', 'management', 'nri', 'deemed')),
  tuition_per_year integer not null check (tuition_per_year >= 0),
  hostel_per_year integer check (hostel_per_year >= 0),
  one_time_fees integer check (one_time_fees >= 0),
  note text not null default '' check (char_length(note) <= 300),
  source_url text not null default '' check (char_length(source_url) <= 500),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null,
  unique (college_id, course, quota, academic_year)
);

create index if not exists college_fees_college_idx on public.college_fees (college_id, academic_year);

-- Every save records when and by whom (shown as "last updated" on the site).
create or replace function public.touch_fee()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  new.updated_by := coalesce((select auth.uid()), new.updated_by);
  return new;
end;
$$;

drop trigger if exists college_fees_touch on public.college_fees;
create trigger college_fees_touch before insert or update on public.college_fees
  for each row execute function public.touch_fee();

-- ---------------------------------------------------------------------------
-- Cutoffs (closing ranks by category and round)
-- ---------------------------------------------------------------------------
create table if not exists public.cutoffs (
  id bigint generated always as identity primary key,
  college_id uuid not null references public.colleges (id) on delete cascade,
  year int not null check (year between 2015 and 2100),
  counselling text not null check (char_length(counselling) <= 60),
  quota text not null check (quota in ('govt', 'aiq', 'management', 'nri', 'deemed')),
  category text not null check (char_length(category) <= 20),
  round text not null default 'Round 1' check (char_length(round) <= 30),
  closing_rank int check (closing_rank > 0),
  closing_marks numeric(6, 2) check (closing_marks between -180 and 720), -- NEET marks, or TNEA cutoff out of 200
  unique (college_id, year, counselling, quota, category, round)
);

create index if not exists cutoffs_college_idx on public.cutoffs (college_id, year);

-- ---------------------------------------------------------------------------
-- Leads (students and parents who sent a form)
-- ---------------------------------------------------------------------------
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  full_name text not null check (char_length(btrim(full_name)) between 2 and 80),
  whatsapp text not null check (whatsapp ~ '^[6-9][0-9]{9}$'),
  email text not null check (char_length(email) <= 254 and email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]{2,}$'),
  stage text not null check (stage in ('class_8_10', 'class_11_12', 'after_12', 'graduate')),
  score_note text not null default '' check (char_length(score_note) <= 60),
  category text check (category in ('OC', 'BC', 'BCM', 'MBC & DNC', 'SC', 'SCA', 'ST', 'General', 'EWS', 'OBC-NCL')),
  interest text not null
    check (interest in ('career_guidance', 'medical', 'engineering', 'study_abroad', 'other_courses', 'not_sure')),
  college_id uuid references public.colleges (id) on delete set null,
  source text not null default 'hero'
    check (source in ('hero', 'career', 'fee_breakup', 'cutoffs', 'contact', 'abroad', 'seminar', 'cta')),
  page text not null default '/' check (char_length(page) <= 200),
  consent boolean not null check (consent),
  consent_at timestamptz not null default now(),
  status text not null default 'new'
    check (status in ('new', 'contacted', 'counselling_booked', 'applied', 'admitted', 'not_interested')),
  notes text not null default '' check (char_length(notes) <= 4000)
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_whatsapp_idx on public.leads (whatsapp, created_at);

drop trigger if exists leads_touch on public.leads;
create trigger leads_touch before update on public.leads
  for each row execute function public.touch_updated_at();

-- The only way in for visitors. Checks the data (the table checks it again),
-- ignores the hidden spam-trap field, and limits repeats: 5 per number per hour,
-- 300 per 10 minutes overall.
create or replace function public.submit_lead(
  p_full_name text,
  p_whatsapp text,
  p_email text,
  p_stage text,
  p_score_note text,
  p_category text,
  p_interest text,
  p_college_id uuid,
  p_source text,
  p_page text,
  p_consent boolean,
  p_website text default ''
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if coalesce(p_website, '') <> '' then
    return; -- spam trap filled: pretend it worked
  end if;
  if p_consent is not true then
    raise exception 'consent required';
  end if;
  if (select count(*) from public.leads where whatsapp = p_whatsapp and created_at > now() - interval '1 hour') >= 5 then
    raise exception 'too many requests from this number';
  end if;
  if (select count(*) from public.leads where created_at > now() - interval '10 minutes') >= 300 then
    raise exception 'too many requests, try later';
  end if;
  insert into public.leads (full_name, whatsapp, email, stage, score_note, category, interest, college_id, source, page, consent)
  values (
    btrim(p_full_name),
    p_whatsapp,
    lower(btrim(p_email)),
    p_stage,
    left(btrim(coalesce(p_score_note, '')), 60),
    nullif(p_category, ''),
    p_interest,
    (select id from public.colleges where id = p_college_id and is_published),
    coalesce(nullif(p_source, ''), 'hero'),
    left(coalesce(nullif(p_page, ''), '/'), 200),
    true
  );
end;
$$;

revoke all on function public.submit_lead(text, text, text, text, text, text, text, uuid, text, text, boolean, text) from public;
grant execute on function public.submit_lead(text, text, text, text, text, text, text, uuid, text, text, boolean, text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------------------
alter table public.admins enable row level security;
alter table public.colleges enable row level security;
alter table public.college_fees enable row level security;
alter table public.cutoffs enable row level security;
alter table public.leads enable row level security;

drop policy if exists "admins see themselves" on public.admins;
create policy "admins see themselves" on public.admins
  for select to authenticated using (user_id = (select auth.uid()));

-- Colleges: the public sees published ones; admins see and change all.
drop policy if exists "read published colleges" on public.colleges;
create policy "read published colleges" on public.colleges
  for select to anon, authenticated using (is_published or (select public.is_admin()));
drop policy if exists "admins write colleges" on public.colleges;
create policy "admins write colleges" on public.colleges
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- Fees and cutoffs follow their college.
drop policy if exists "read fees of published colleges" on public.college_fees;
create policy "read fees of published colleges" on public.college_fees
  for select to anon, authenticated using (
    exists (select 1 from public.colleges c where c.id = college_id and c.is_published) or (select public.is_admin())
  );
drop policy if exists "admins write fees" on public.college_fees;
create policy "admins write fees" on public.college_fees
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "read cutoffs of published colleges" on public.cutoffs;
create policy "read cutoffs of published colleges" on public.cutoffs
  for select to anon, authenticated using (
    exists (select 1 from public.colleges c where c.id = college_id and c.is_published) or (select public.is_admin())
  );
drop policy if exists "admins write cutoffs" on public.cutoffs;
create policy "admins write cutoffs" on public.cutoffs
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- Leads: admins only. No insert policy: visitors go through submit_lead().
drop policy if exists "admins read leads" on public.leads;
create policy "admins read leads" on public.leads
  for select to authenticated using ((select public.is_admin()));
drop policy if exists "admins update leads" on public.leads;
create policy "admins update leads" on public.leads
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
drop policy if exists "admins delete leads" on public.leads;
create policy "admins delete leads" on public.leads
  for delete to authenticated using ((select public.is_admin()));

-- Table privileges (row-level security above decides which rows).
grant select on public.colleges, public.college_fees, public.cutoffs to anon, authenticated;
grant insert, update, delete on public.colleges, public.college_fees, public.cutoffs to authenticated;
grant select, update, delete on public.leads to authenticated;
revoke all on public.leads from anon;
revoke all on public.admins from anon;

-- ---------------------------------------------------------------------------
-- Live updates: the admin panel hears about new leads straight away.
-- (Realtime respects the policies above: only admins receive lead rows.)
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'leads'
  ) then
    alter publication supabase_realtime add table public.leads;
  end if;
end;
$$;

-- ---------------------------------------------------------------------------
-- 12-month clean-up (privacy policy): leads that never went past "contacted"
-- are deleted after 12 months. Runs nightly at 03:00 UTC.
-- If this fails, turn on "pg_cron" (Database > Extensions) and run the file again.
-- ---------------------------------------------------------------------------
create extension if not exists pg_cron;

select cron.unschedule(jobid) from cron.job where jobname = 'arivu-delete-old-leads';
select cron.schedule(
  'arivu-delete-old-leads',
  '0 3 * * *',
  $$ delete from public.leads
     where status in ('new', 'contacted', 'not_interested') and created_at < now() - interval '12 months' $$
);

-- ---------------------------------------------------------------------------
-- Make someone an admin (after creating their user in Authentication > Users):
--   insert into public.admins (user_id)
--   select id from auth.users where email = 'counsellor@example.com';
-- ---------------------------------------------------------------------------
