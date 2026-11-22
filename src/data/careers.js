// Career guidance page content (demo). Prices are sample figures.

export const stages = [
  {
    id: 'class-8-10',
    title: 'Class 8 – 10',
    question: 'Which group should I take in Class 11?',
    points: [
      'Interest and aptitude assessment',
      'What each group keeps open: Bio-Maths, Computer Science, Commerce, Arts',
      'A plan for the next two years, not just the next exam',
    ],
  },
  {
    id: 'class-11-12',
    title: 'Class 11 – 12',
    question: 'Which course, and which entrance exams?',
    points: [
      'Shortlist of 3 best-fit careers with the courses behind them',
      'Entrance exam calendar: NEET, JEE, CUET, CLAT, NATA, NIFT…',
      'Back-up options if the first choice doesn’t work out',
    ],
  },
  {
    id: 'after-12',
    title: 'After Class 12',
    question: 'Which college can I actually get?',
    points: [
      'College list matched to your marks, category and budget',
      'Fees for every quota, side by side',
      'Help through every counselling round until you join',
    ],
  },
];

export const process = [
  {
    title: 'Aptitude & interest assessment',
    text: 'A 45-minute online assessment of interests, aptitude and working style, taken at home.',
  },
  {
    title: 'One-to-one session',
    text: 'The student and parents meet a counsellor (in person or on video) to go through the results together.',
  },
  {
    title: 'Personal career report',
    text: 'Three best-fit careers, the courses and colleges behind each, the exams to take and a month-by-month plan.',
  },
  {
    title: 'Follow-up to admission',
    text: 'Check-ins before each exam and full help with applications and counselling when results come out.',
  },
];

export const careerPaths = [
  { title: 'Medicine & health', exams: 'NEET-UG', courses: 'MBBS, BDS, AYUSH, nursing, physiotherapy, pharmacy' },
  {
    title: 'Engineering & technology',
    exams: 'JEE, TNEA, VITEEE, BITSAT',
    courses: 'B.E./B.Tech in CSE, ECE, mechanical, civil, AI & data science',
  },
  { title: 'Law', exams: 'CLAT, AILET, TNDALU', courses: 'BA LLB, BBA LLB (5-year integrated)' },
  {
    title: 'Architecture & design',
    exams: 'NATA, JEE Paper 2, NIFT, NID, UCEED',
    courses: 'B.Arch, B.Des, fashion and product design',
  },
  {
    title: 'Commerce & management',
    exams: 'CUET, IPMAT, CA Foundation',
    courses: 'B.Com, BBA, integrated MBA, CA, CS, CMA',
  },
  { title: 'Science & research', exams: 'CUET, IISER Aptitude Test, NEST', courses: 'B.Sc, BS-MS, integrated M.Sc' },
  {
    title: 'Arts & humanities',
    exams: 'CUET, university admissions',
    courses: 'BA in economics, psychology, English, journalism',
  },
  {
    title: 'Agriculture & veterinary',
    exams: 'TNAU, TANUVAS, ICAR AIEEA',
    courses: 'B.Sc Agriculture, B.V.Sc, fisheries, horticulture',
  },
];

export const packages = [
  {
    name: 'First session',
    price: 'Free',
    text: 'A 30-minute call with a counsellor to understand where the student stands.',
    points: ['Questions answered', 'Next steps for this year'],
  },
  {
    name: 'Career assessment',
    price: '₹2,499',
    text: 'Assessment, a one-to-one session and the personal career report.',
    points: ['45-minute online assessment', '60-minute session with parents', 'Written career report'],
    featured: true,
  },
  {
    name: 'Admission support',
    price: 'On request',
    text: 'Everything from the shortlist to the day you join, for one or more counsellings.',
    points: ['College list and fee comparison', 'Registration and choice filling', 'Round-by-round advice'],
  },
];
