// Lead form rules. The database checks the same things again (see the
// migration), so these are for friendly messages, not for security.

export const INTERESTS = {
  career_guidance: 'Career guidance (which course to choose)',
  medical: 'Medical: MBBS, BDS, AYUSH, nursing',
  engineering: 'Engineering: B.E. / B.Tech',
  study_abroad: 'Study abroad',
  other_courses: 'Other courses: law, design, commerce, arts, science',
  not_sure: 'Not sure yet',
};

// Short labels for tables and charts.
export const INTEREST_SHORT = {
  career_guidance: 'Career guidance',
  medical: 'Medical',
  engineering: 'Engineering',
  study_abroad: 'Study abroad',
  other_courses: 'Other courses',
  not_sure: 'Not sure yet',
};

export const STAGES = {
  class_8_10: 'Class 8 – 10',
  class_11_12: 'Class 11 – 12',
  after_12: 'Finished Class 12',
  graduate: 'Graduate / working',
};

export const CATEGORY_OPTIONS = [
  { group: 'Tamil Nadu', options: ['OC', 'BC', 'BCM', 'MBC & DNC', 'SC', 'SCA', 'ST'] },
  { group: 'All-India', options: ['General', 'EWS', 'OBC-NCL'] },
];

export const LEAD_STATUSES = {
  new: 'New',
  contacted: 'Contacted',
  counselling_booked: 'Session booked',
  applied: 'Applied',
  admitted: 'Admitted',
  not_interested: 'Not interested',
};

export const SOURCES = {
  hero: 'Home: book a session',
  career: 'Career guidance page',
  fee_breakup: 'College: fee breakup',
  cutoffs: 'College: cutoffs',
  contact: 'Contact page',
  abroad: 'Study abroad guide',
  seminar: 'Seminar sign-up',
  cta: 'Bottom banner',
  neet_calculator: 'NEET score calculator',
  stories: 'Student stories page',
};

export const normaliseWhatsapp = (value = '') => value.replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, '');

export function validateLead(values) {
  const errors = {};
  const name = values.full_name?.trim() ?? '';
  if (name.length < 2) errors.full_name = 'Please enter the student’s name.';
  else if (name.length > 80) errors.full_name = 'Please keep the name under 80 characters.';

  const phone = normaliseWhatsapp(values.whatsapp);
  if (!/^[6-9]\d{9}$/.test(phone))
    errors.whatsapp = 'Enter a 10-digit Indian mobile number (starts with 6, 7, 8 or 9).';

  const email = values.email?.trim() ?? '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = 'Enter an email like name@example.com.';

  if (!values.stage) errors.stage = 'Choose where the student is now.';
  if (!values.interest) errors.interest = 'Choose what you are looking for.';
  if ((values.score_note ?? '').length > 60) errors.score_note = 'Please keep this under 60 characters.';
  if (!values.consent) errors.consent = 'Please agree so our counsellor can contact you.';
  return errors;
}
