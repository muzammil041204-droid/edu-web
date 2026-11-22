// SAMPLE cutoffs for the demo, generated from one "base" closing rank per
// college. Real cutoffs come from the official allotment lists (MCC, TN
// Selection Committee, TNEA, JoSAA) and would be imported each year.

export const TN_CATEGORIES = ['OC', 'BC', 'BCM', 'MBC & DNC', 'SC', 'SCA', 'ST'];
export const AIQ_CATEGORIES = ['General', 'EWS', 'OBC-NCL', 'SC', 'ST'];

export const CATEGORY_HELP = {
  OC: 'Open competition (any community)',
  BC: 'Backward Class',
  BCM: 'Backward Class (Muslim)',
  'MBC & DNC': 'Most Backward Class & Denotified Communities',
  SC: 'Scheduled Caste',
  SCA: 'Scheduled Caste (Arunthathiyar)',
  ST: 'Scheduled Tribe',
  General: 'General (unreserved)',
  EWS: 'Economically Weaker Section',
  'OBC-NCL': 'Other Backward Classes (non-creamy layer)',
};

// What the "marks" column means for each counselling.
export const MARKS_LABEL = {
  'TN Selection Committee': 'Approx. NEET marks',
  MCC: 'Approx. NEET marks',
  TNEA: 'Cutoff mark (out of 200)',
};

const TN_FACTORS = { OC: 1, BC: 1.55, BCM: 2.3, 'MBC & DNC': 1.95, SC: 5.4, SCA: 8.8, ST: 13.5 };
const AIQ_FACTORS = { General: 1, EWS: 1.5, 'OBC-NCL': 1.35, SC: 6.5, ST: 12 };

// Rough curves, only to make the sample readable.
export const approxNeetMarks = (rank) => Math.max(140, Math.min(715, Math.round(868 - 44 * Math.log(rank))));
export const approxTneaCutoff = (rank) => Math.max(80, Math.round((200 - 0.012 * rank ** 0.75) * 2) / 2);

const round = (n) => (n < 100 ? Math.round(n) : Math.round(n / 10) * 10);

export function buildCutoffs(college, year = 2026) {
  const base = college.cutoff_base ?? 5000;
  const rows = [];
  const add = (counselling, quota, category, rank, marks = null) =>
    rows.push({
      college_slug: college.slug,
      year,
      counselling,
      quota,
      category,
      round: 'Round 2',
      closing_rank: round(rank),
      closing_marks: marks,
    });

  if (college.stream === 'engineering') {
    if (['government', 'aided', 'private'].includes(college.ownership)) {
      TN_CATEGORIES.forEach((cat) => {
        const rank = base * TN_FACTORS[cat];
        add('TNEA', 'govt', cat, rank, approxTneaCutoff(rank));
      });
    }
    if (college.ownership === 'central') {
      AIQ_CATEGORIES.forEach((cat) => add('JoSAA', 'aiq', cat, base * AIQ_FACTORS[cat]));
    }
    if (college.ownership === 'deemed') {
      add(college.counselling?.[0] ?? 'University exam', 'deemed', 'General', base);
    }
    return rows;
  }

  const inTN = college.state === 'Tamil Nadu';
  const neet = (counselling, quota, cat, rank) => add(counselling, quota, cat, rank, approxNeetMarks(rank));
  if (college.ownership === 'government' && inTN) {
    TN_CATEGORIES.forEach((cat) => neet('TN Selection Committee', 'govt', cat, base * TN_FACTORS[cat]));
  }
  if (college.ownership === 'private') {
    if (college.slug === 'christian-medical-college-vellore') {
      AIQ_CATEGORIES.forEach((cat) => neet('MCC', 'aiq', cat, base * AIQ_FACTORS[cat]));
    } else {
      TN_CATEGORIES.forEach((cat) => neet('TN Selection Committee', 'govt', cat, base * TN_FACTORS[cat] * 0.55));
      neet('TN Selection Committee', 'management', 'OC', base * 4.2);
    }
  }
  if (college.ownership === 'government' || college.ownership === 'central') {
    AIQ_CATEGORIES.forEach((cat) =>
      neet('MCC', 'aiq', cat, (inTN || college.ownership === 'central' ? base * 9 : base * 6) * AIQ_FACTORS[cat])
    );
  }
  if (college.ownership === 'deemed') neet('MCC', 'deemed', 'General', base * 6);
  return rows;
}
