// MBBS abroad: sample country guide for the demo.
// Cost ranges are total programme estimates (tuition + hostel) from 2026
// public reports; they vary a lot by university. Always check NMC notices.

export const nmcRules = [
  {
    title: 'Qualify NEET first',
    text: 'You need a NEET-UG qualifying score to study medicine abroad and come back to practise in India. The score is valid for three years.',
  },
  {
    title: '54 months of study',
    text: 'The course must be at least 54 months long, taught in English, and cover the subjects NMC lists.',
  },
  {
    title: '12-month internship, same university',
    text: 'A 12-month internship has to be done at the same foreign university, on top of the 54 months.',
  },
  {
    title: 'Licence in that country',
    text: 'You must be eligible to practise medicine in the country where you studied, as a citizen of that country would be.',
  },
  {
    title: 'Pass FMGE in India',
    text: 'As of November 2026, FMGE is still the licensing exam for foreign graduates. NExT has not replaced it yet.',
  },
  {
    title: 'Finish within 10 years',
    text: 'The whole course, including the internship, must be completed within 10 years of joining.',
  },
];

export const countries = [
  {
    slug: 'russia',
    name: 'Russia',
    image: '1504615458222-979e04d69a27',
    costLakh: [18, 40],
    duration: '6 years (incl. internship)',
    medium: 'English (Russian taught alongside)',
    climate: 'Long, cold winters',
    universities: ['Kazan Federal University', 'Bashkir State Medical University', 'Kursk State Medical University'],
    note: 'The most established option, with large Indian student groups and Indian food in most hostels.',
  },
  {
    slug: 'georgia',
    name: 'Georgia',
    image: '1603350576276-24747f7bbf40',
    costLakh: [30, 50],
    duration: '6 years (incl. internship)',
    medium: 'English',
    climate: 'Mild, European',
    universities: [
      'Tbilisi State Medical University',
      'David Tvildiani Medical University',
      'Batumi Shota Rustaveli State University',
    ],
    note: 'European-style teaching and among the better FMGE results, at a higher cost.',
  },
  {
    slug: 'kazakhstan',
    name: 'Kazakhstan',
    image: '1659651117607-d2b397cf100f',
    costLakh: [20, 32],
    duration: '6 years (incl. internship)',
    medium: 'English',
    climate: 'Cold winters, warm summers',
    universities: [
      'Al-Farabi Kazakh National University',
      'Astana Medical University',
      'Kazakh National Medical University',
    ],
    note: 'Affordable, with modern city campuses in Almaty and Astana.',
  },
  {
    slug: 'kyrgyzstan',
    name: 'Kyrgyzstan',
    image: '1629340038197-191832a53546',
    costLakh: [16, 28],
    duration: '6 years (incl. internship)',
    medium: 'English',
    climate: 'Cold winters, mountain air',
    universities: ['Osh State University', 'International School of Medicine, Bishkek', 'Kyrgyz State Medical Academy'],
    note: 'The lowest-cost option. Check each university against NMC notices before applying.',
  },
];

export const abroadChecklist = [
  'The university is listed in the World Directory of Medical Schools.',
  'The course is 54 months plus a 12-month internship at the same university.',
  'All teaching is in English, and you get the full syllabus in writing.',
  'The university is not named in any NMC advisory or caution notice.',
  'Hostel, food and travel costs are written into the agreement, not just tuition.',
  'You know the university’s recent FMGE pass rate from official NBEMS data.',
];
