// LIVE backend: the real Supabase project (used when VITE_SUPABASE_URL and
// VITE_SUPABASE_PUBLISHABLE_KEY are set).
//
// Only the publishable key is used. What each visitor can do is decided by the
// row-level security rules in supabase/migrations/0001_schema.sql:
// - anyone: read published colleges, fees and cutoffs; send a lead via submit_lead()
// - signed-in admins (listed in public.admins): read and change everything

import { createClient } from '@supabase/supabase-js';
import { ACADEMIC_YEAR } from '../../data/colleges.js';
import { normaliseWhatsapp } from '../validation.js';
import { youtubeId } from '../youtube.js';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true },
});

const COLLEGE_FIELDS =
  'id, slug, name, city, state, ownership, stream, university, established, seats, beds, avg_package_lpa, counselling, courses, image, summary, is_partner, is_published, created_at, updated_at';
const FEE_FIELDS =
  'id, college_id, course, academic_year, quota, tuition_per_year, hostel_per_year, one_time_fees, note, source_url, updated_at, updated_by';

const fail = (error, message) => {
  if (error) {
    console.error(error);
    throw new Error(message);
  }
};

// ---------------------------------------------------------------- public

export async function listColleges() {
  const { data, error } = await supabase
    .from('colleges')
    .select(`${COLLEGE_FIELDS}, fees:college_fees(${FEE_FIELDS})`)
    .eq('is_published', true)
    .order('name');
  fail(error, 'Could not load colleges.');
  return data;
}

export async function getCollege(slug) {
  const { data, error } = await supabase
    .from('colleges')
    .select(
      `${COLLEGE_FIELDS}, fees:college_fees(${FEE_FIELDS}), cutoffs(year, counselling, quota, category, round, closing_rank, closing_marks)`
    )
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();
  fail(error, 'Could not load this college.');
  return data;
}

export async function submitLead(input) {
  const { error } = await supabase.rpc('submit_lead', {
    p_full_name: input.full_name.trim(),
    p_whatsapp: normaliseWhatsapp(input.whatsapp),
    p_email: input.email.trim().toLowerCase(),
    p_stage: input.stage,
    p_score_note: (input.score_note ?? '').trim(),
    p_category: input.category || null,
    p_interest: input.interest,
    p_college_id: input.college_id || null,
    p_source: input.source,
    p_page: input.page,
    p_consent: Boolean(input.consent),
    p_website: input.website ?? '',
  });
  if (error) {
    console.error(error);
    if (error.message?.includes('too many')) {
      throw new Error('We already have several requests from this number. We will call you soon.');
    }
    throw new Error('Sorry, we could not send your details. Please try again or WhatsApp us.');
  }
}

// ---------------------------------------------------------------- admin

async function checkAdmin(session) {
  if (!session) return null;
  const { data, error } = await supabase.rpc('is_admin');
  if (error || !data) return null;
  return { email: session.user.email };
}

export async function getAdminSession() {
  const { data } = await supabase.auth.getSession();
  return checkAdmin(data.session);
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  if (error) throw new Error('Wrong email or password.');
  const admin = await checkAdmin(data.session);
  if (!admin) {
    await supabase.auth.signOut();
    throw new Error('This account is not allowed into the admin panel.');
  }
  return admin;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function listLeads() {
  const { data, error } = await supabase
    .from('leads')
    .select('*, college:colleges(name)')
    .order('created_at', { ascending: false })
    .limit(1000);
  fail(error, 'Could not load leads.');
  return data.map(({ college, ...lead }) => ({ ...lead, college_name: college?.name ?? null }));
}

export async function updateLead(id, patch) {
  const { error } = await supabase.from('leads').update(patch).eq('id', id);
  fail(error, 'Could not save this change.');
}

export async function deleteLead(id) {
  const { error } = await supabase.from('leads').delete().eq('id', id);
  fail(error, 'Could not delete this lead.');
}

export function subscribeLeads(onChange) {
  const channel = supabase
    .channel('admin-leads')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => onChange())
    .subscribe();
  return () => {
    supabase.removeChannel(channel);
  };
}

export async function adminListColleges() {
  const { data, error } = await supabase
    .from('colleges')
    .select(`${COLLEGE_FIELDS}, fees:college_fees(${FEE_FIELDS})`)
    .order('name');
  fail(error, 'Could not load colleges.');
  return data;
}

export async function saveCollege(input) {
  const { fees: _fees, id, created_at: _c, updated_at: _u, ...fields } = input;
  const query = id ? supabase.from('colleges').update(fields).eq('id', id) : supabase.from('colleges').insert(fields);
  const { data, error } = await query.select(COLLEGE_FIELDS).single();
  if (error?.code === '23505') throw new Error('Another college already uses this web address.');
  fail(error, 'Could not save this college.');
  return data;
}

export async function saveFees(collegeId, academicYear, rows, { course = 'MBBS' } = {}) {
  const payload = rows.map((row) => ({
    college_id: collegeId,
    course,
    academic_year: academicYear,
    quota: row.quota,
    tuition_per_year: Number(row.tuition_per_year),
    hostel_per_year: row.hostel_per_year === '' || row.hostel_per_year == null ? null : Number(row.hostel_per_year),
    one_time_fees: row.one_time_fees === '' || row.one_time_fees == null ? null : Number(row.one_time_fees),
    note: row.note ?? '',
    source_url: row.source_url ?? '',
  }));
  const quotas = payload.map((row) => row.quota);
  // Remove quotas the admin deleted, then save the rest.
  let remove = supabase
    .from('college_fees')
    .delete()
    .eq('college_id', collegeId)
    .eq('course', course)
    .eq('academic_year', academicYear);
  if (quotas.length) remove = remove.not('quota', 'in', `(${quotas.join(',')})`);
  const { error: removeError } = await remove;
  fail(removeError, 'Could not save the fees.');
  if (!payload.length) return [];
  const { data, error } = await supabase
    .from('college_fees')
    .upsert(payload, { onConflict: 'college_id,course,quota,academic_year' })
    .select(FEE_FIELDS);
  fail(error, 'Could not save the fees.');
  return data;
}

// ---------------------------------------------------------------- reviews & videos

const STORY_FIELDS =
  'id, kind, name, detail, title, quote, rating, video_url, stream, is_featured, is_published, sort_order, created_at, updated_at';

// Public: published items. Videos without a working YouTube link are left out.
export async function listTestimonials() {
  const { data, error } = await supabase
    .from('testimonials')
    .select(STORY_FIELDS)
    .eq('is_published', true)
    .order('sort_order')
    .order('created_at', { ascending: false });
  if (error) {
    // Table not created yet (migration 0002 not run): show no section rather than an error.
    if (error.code === '42P01' || error.code === 'PGRST205') return [];
    fail(error, 'Could not load reviews.');
  }
  return data.filter((t) => t.kind === 'review' || youtubeId(t.video_url));
}

export async function adminListTestimonials() {
  const { data, error } = await supabase
    .from('testimonials')
    .select(STORY_FIELDS)
    .order('sort_order')
    .order('created_at', { ascending: false });
  fail(error, 'Could not load reviews and videos. Has supabase/migrations/0002 been run?');
  return data;
}

export async function saveTestimonial(input) {
  const { id, created_at: _c, updated_at: _u, ...fields } = input;
  const query = id
    ? supabase.from('testimonials').update(fields).eq('id', id)
    : supabase.from('testimonials').insert(fields);
  const { data, error } = await query.select(STORY_FIELDS).single();
  fail(error, 'Could not save this item.');
  return data;
}

export async function deleteTestimonial(id) {
  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  fail(error, 'Could not delete this item.');
}

export function resetDemo() {}

export const DEFAULT_YEAR = ACADEMIC_YEAR;
