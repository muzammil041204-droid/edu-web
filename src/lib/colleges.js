// Helpers for showing colleges and their fees.

import { ACADEMIC_YEAR, COUNSELLING, OWNERSHIP, QUOTAS, STREAMS } from '../data/colleges.js';

export { ACADEMIC_YEAR, OWNERSHIP, QUOTAS, STREAMS };

export const QUOTA_ORDER = ['govt', 'aiq', 'deemed', 'management', 'nri'];

export const streamOf = (college) => STREAMS[college?.stream] ?? STREAMS.medical;

// Which counselling fills this quota at this college.
export const counsellingFor = (college, quota) => COUNSELLING[college?.stream]?.[quota] ?? '';

export const currentFees = (college, year = ACADEMIC_YEAR) =>
  (college?.fees ?? [])
    .filter((fee) => fee.academic_year === year)
    .sort((a, b) => QUOTA_ORDER.indexOf(a.quota) - QUOTA_ORDER.indexOf(b.quota));

// Lowest yearly tuition across quotas: the "from ₹X a year" on cards.
export function fromFee(college) {
  const rows = currentFees(college);
  if (!rows.length) return null;
  return Math.min(...rows.map((fee) => fee.tuition_per_year));
}

export const yearlyTotal = (fee) => (fee.tuition_per_year ?? 0) + (fee.hostel_per_year ?? 0);

// Whole-course estimate: (tuition + hostel) × course years + one-time fees.
export const courseTotal = (fee, years = STREAMS.medical.years) => yearlyTotal(fee) * years + (fee.one_time_fees ?? 0);

export const lastUpdated = (college) =>
  currentFees(college).reduce((latest, fee) => (fee.updated_at > latest ? fee.updated_at : latest), '');

export const FEE_BANDS = [
  { id: 'lt1', label: 'Under ₹1 L a year', test: (n) => n < 1_00_000 },
  { id: '1to5', label: '₹1 – 5 L a year', test: (n) => n >= 1_00_000 && n < 5_00_000 },
  { id: '5to20', label: '₹5 – 20 L a year', test: (n) => n >= 5_00_000 && n < 20_00_000 },
  { id: 'gt20', label: 'Over ₹20 L a year', test: (n) => n >= 20_00_000 },
];

export const slugify = (text) =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .slice(0, 80);
