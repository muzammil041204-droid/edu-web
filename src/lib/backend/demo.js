// DEMO MODE backend: used when no Supabase keys are set.
//
// Starts from the sample data in src/data and keeps changes (leads, fee edits,
// college edits) in this browser's localStorage, so the whole flow can be shown
// on one machine: submit a lead in one tab, watch it appear in /admin in another.
// Nothing leaves the browser.

import { ACADEMIC_YEAR, colleges as seedColleges, fees as seedFees, STREAMS } from '../../data/colleges.js';
import { buildCutoffs } from '../../data/cutoffs.js';
import { normaliseWhatsapp, validateLead } from '../validation.js';

const KEY = 'arivu-demo-v2';
const SESSION_KEY = 'arivu-demo-admin';
const CHANGE_EVENT = 'arivu-demo-change';
export const DEMO_PASSWORD = 'demo1234';

let memory = null; // fallback when localStorage is blocked

const sampleLeads = () => {
  const now = Date.now();
  const ago = (hours) => new Date(now - hours * 3_600_000).toISOString();
  const lead = (h, fields) => ({
    id: crypto.randomUUID(),
    created_at: ago(h),
    updated_at: ago(h),
    category: null,
    score_note: '',
    college_id: null,
    page: fields.college_id ? `/colleges/${fields.college_id}` : '/',
    consent: true,
    status: 'new',
    notes: '',
    ...fields,
  });
  return [
    lead(2, {
      full_name: 'Harini Selvam',
      whatsapp: '9840012345',
      email: 'harini.selvam@example.com',
      stage: 'after_12',
      score_note: 'NEET 548',
      category: 'BC',
      interest: 'medical',
      college_id: 'karpagam-faculty-of-medical-sciences',
      source: 'fee_breakup',
    }),
    lead(4, {
      full_name: 'Rohit Balaji',
      whatsapp: '9884412345',
      email: 'rohit.b@example.com',
      stage: 'class_8_10',
      interest: 'career_guidance',
      source: 'career',
      notes: 'Class 10. Parents want help choosing a group for Class 11.',
    }),
    lead(5, {
      full_name: 'Mohamed Asif',
      whatsapp: '9790054321',
      email: 'asif.m@example.com',
      stage: 'after_12',
      score_note: 'TNEA cutoff 192',
      category: 'BCM',
      interest: 'engineering',
      college_id: 'ssn-college-of-engineering',
      source: 'fee_breakup',
    }),
    lead(20, {
      full_name: 'Divya Lakshmi',
      whatsapp: '9003312345',
      email: 'divya.l@example.com',
      stage: 'after_12',
      score_note: 'JEE Main 97.2 %ile',
      category: 'OC',
      interest: 'engineering',
      college_id: 'nit-tiruchirappalli',
      source: 'cutoffs',
      status: 'contacted',
      notes: 'Wants CSE or ECE; open to NITs outside Tamil Nadu.',
    }),
    lead(30, {
      full_name: 'Gokul Raj',
      whatsapp: '8754412345',
      email: 'gokulraj@example.com',
      stage: 'after_12',
      score_note: 'NEET 455',
      category: 'MBC & DNC',
      interest: 'study_abroad',
      source: 'abroad',
      status: 'counselling_booked',
      notes: 'Seminar on 14 Dec. Parents prefer Georgia.',
    }),
    lead(52, {
      full_name: 'Sneha Ramesh',
      whatsapp: '9566612345',
      email: 'sneha.r@example.com',
      stage: 'class_11_12',
      interest: 'career_guidance',
      source: 'hero',
      status: 'counselling_booked',
      notes: 'Torn between law and design. Assessment booked for Saturday.',
    }),
    lead(76, {
      full_name: 'Vignesh Kumar',
      whatsapp: '9444412345',
      email: 'vignesh.k@example.com',
      stage: 'after_12',
      score_note: '12th: 81%',
      category: 'SC',
      interest: 'other_courses',
      source: 'contact',
      status: 'contacted',
    }),
    lead(120, {
      full_name: 'Ayesha Banu',
      whatsapp: '7708812345',
      email: 'ayesha.b@example.com',
      stage: 'after_12',
      score_note: 'NEET 577',
      category: 'BCM',
      interest: 'medical',
      college_id: 'chettinad-hospital-and-research-institute',
      source: 'fee_breakup',
      status: 'admitted',
      notes: 'Joined Chettinad, deemed round 2.',
    }),
    lead(170, {
      full_name: 'Prakash Natarajan',
      whatsapp: '9361112345',
      email: 'prakash.n@example.com',
      stage: 'after_12',
      score_note: 'NEET 410',
      category: 'BC',
      interest: 'medical',
      source: 'seminar',
      status: 'not_interested',
      notes: 'Taking a drop year.',
    }),
  ];
};

const fresh = () => ({
  colleges: seedColleges.map(({ cutoff_base: _cutoffBase, ...college }) => ({
    id: college.slug,
    created_at: '2026-11-01T09:00:00+05:30',
    updated_at: '2026-11-01T09:00:00+05:30',
    ...college,
  })),
  fees: seedFees.map(({ college_slug, ...fee }) => ({
    id: `${college_slug}:${fee.quota}:${fee.academic_year}`,
    college_id: college_slug,
    ...fee,
  })),
  leads: sampleLeads(),
});

function load() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // storage blocked or corrupted: fall through to the in-memory copy
  }
  memory ??= fresh();
  return structuredClone(memory);
}

function save(db) {
  memory = structuredClone(db);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(db));
  } catch {
    // private window etc.: changes live for this page only
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

// Make sure a first visit writes the sample data, so other tabs share it.
function db() {
  const data = load();
  try {
    if (!window.localStorage.getItem(KEY)) window.localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
  return data;
}

const wait = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));
const cutoffBaseOf = (slug) => seedColleges.find((c) => c.slug === slug)?.cutoff_base;

const withFees = (data, college) => ({
  ...college,
  fees: data.fees.filter((fee) => fee.college_id === college.id),
});

// ---------------------------------------------------------------- public

export async function listColleges() {
  await wait(150);
  const data = db();
  return data.colleges.filter((c) => c.is_published).map((c) => withFees(data, c));
}

export async function getCollege(slug) {
  await wait(150);
  const data = db();
  const college = data.colleges.find((c) => c.slug === slug && c.is_published);
  if (!college) return null;
  return {
    ...withFees(data, college),
    cutoffs: buildCutoffs({ ...college, cutoff_base: cutoffBaseOf(slug) }),
  };
}

export async function submitLead(input) {
  await wait(500);
  if (input.website) return; // spam trap: pretend it worked
  const errors = validateLead(input);
  if (Object.keys(errors).length) throw new Error(Object.values(errors)[0]);
  const data = db();
  const whatsapp = normaliseWhatsapp(input.whatsapp);
  const recent = data.leads.filter(
    (l) => l.whatsapp === whatsapp && Date.now() - new Date(l.created_at).getTime() < 3_600_000
  );
  if (recent.length >= 5) throw new Error('We already have several requests from this number. We will call you soon.');
  const now = new Date().toISOString();
  data.leads.unshift({
    id: crypto.randomUUID(),
    created_at: now,
    updated_at: now,
    full_name: input.full_name.trim(),
    whatsapp,
    email: input.email.trim().toLowerCase(),
    stage: input.stage,
    score_note: (input.score_note ?? '').trim(),
    category: input.category || null,
    interest: input.interest,
    college_id: input.college_id || null,
    source: input.source,
    page: input.page,
    consent: true,
    status: 'new',
    notes: '',
  });
  save(data);
}

// ---------------------------------------------------------------- admin

export async function getAdminSession() {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function signIn(email, password) {
  await wait(400);
  if (password !== DEMO_PASSWORD) throw new Error('Wrong email or password. (Demo password: demo1234)');
  const session = { email: email.trim().toLowerCase() };
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    /* ignore */
  }
  return session;
}

export async function signOut() {
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

export async function listLeads() {
  await wait(150);
  const data = db();
  return data.leads.map((lead) => ({
    ...lead,
    college_name: data.colleges.find((c) => c.id === lead.college_id)?.name ?? null,
  }));
}

export async function updateLead(id, patch) {
  const data = db();
  const lead = data.leads.find((l) => l.id === id);
  if (!lead) throw new Error('This lead no longer exists.');
  Object.assign(lead, patch, { updated_at: new Date().toISOString() });
  save(data);
}

export async function deleteLead(id) {
  const data = db();
  data.leads = data.leads.filter((l) => l.id !== id);
  save(data);
}

// Live updates: this tab (custom event) and other tabs (storage event).
export function subscribeLeads(onChange) {
  const handler = (event) => {
    if (event.type === 'storage' && event.key !== KEY) return;
    onChange();
  };
  window.addEventListener(CHANGE_EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(CHANGE_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}

export async function adminListColleges() {
  await wait(150);
  const data = db();
  return data.colleges.map((c) => withFees(data, c)).sort((a, b) => a.name.localeCompare(b.name));
}

export async function saveCollege(input) {
  await wait(300);
  const data = db();
  const now = new Date().toISOString();
  if (input.id) {
    const college = data.colleges.find((c) => c.id === input.id);
    if (!college) throw new Error('This college no longer exists.');
    const { fees: _fees, ...fields } = input;
    Object.assign(college, fields, { updated_at: now });
    save(data);
    return college;
  }
  if (data.colleges.some((c) => c.slug === input.slug))
    throw new Error('Another college already uses this web address.');
  const college = { ...input, id: input.slug, created_at: now, updated_at: now };
  data.colleges.push(college);
  save(data);
  return college;
}

export async function saveFees(collegeId, academicYear, rows, { course, editor } = {}) {
  await wait(300);
  const data = db();
  const now = new Date().toISOString();
  const keep = data.fees.filter((f) => !(f.college_id === collegeId && f.academic_year === academicYear));
  const stream = data.colleges.find((c) => c.id === collegeId)?.stream ?? 'medical';
  const next = rows.map((row) => ({
    id: `${collegeId}:${row.quota}:${academicYear}`,
    college_id: collegeId,
    course: course ?? STREAMS[stream].course,
    academic_year: academicYear,
    quota: row.quota,
    tuition_per_year: Number(row.tuition_per_year),
    hostel_per_year: row.hostel_per_year === '' || row.hostel_per_year == null ? null : Number(row.hostel_per_year),
    one_time_fees: row.one_time_fees === '' || row.one_time_fees == null ? null : Number(row.one_time_fees),
    note: row.note ?? '',
    source_url: row.source_url ?? '',
    updated_at: now,
    updated_by: editor ?? null,
  }));
  data.fees = [...keep, ...next];
  save(data);
  return next;
}

export function resetDemo() {
  memory = null;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  save(fresh());
}

export const DEFAULT_YEAR = ACADEMIC_YEAR;
