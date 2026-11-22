// Home page and guide content for the demo. Testimonials, events and updates
// are placeholders for the client presentation.

// "What we help with" on the home page.
export const services = [
  {
    id: 'career',
    title: 'Career guidance',
    text: 'Aptitude assessment and one-to-one sessions for Class 8 to 12: which stream, which course, which entrance exams.',
    meta: 'First session free',
    to: '/career-guidance',
    icon: 'compass',
    featured: true,
  },
  {
    id: 'medical',
    title: 'Medical admissions',
    text: 'NEET counselling for MBBS, BDS and AYUSH through MCC, the Tamil Nadu Selection Committee and deemed universities.',
    meta: 'Fees from ₹18,000 a year',
    to: '/medical',
    icon: 'stethoscope',
  },
  {
    id: 'engineering',
    title: 'Engineering admissions',
    text: 'JEE, JoSAA and TNEA counselling for IITs, NITs, Anna University and the best private colleges.',
    meta: 'Fees from ₹15,000 a year',
    to: '/engineering',
    icon: 'cog',
  },
  {
    id: 'abroad',
    title: 'Study abroad',
    text: 'MBBS in NMC-compliant universities, and degrees in Germany, Canada and the UK, with visa support.',
    meta: 'Country-by-country costs',
    to: '/study-abroad',
    icon: 'globe',
  },
];

// Other courses the agency helps with (shown on the career page and home).
export const otherCourses = [
  'Law (CLAT, TNDALU)',
  'Architecture (NATA, JEE Paper 2)',
  'Design (NIFT, NID, UCEED)',
  'Commerce & CA foundation',
  'Arts & science (CUET, state colleges)',
  'Nursing & allied health',
  'Agriculture & veterinary',
  'Hotel management (NCHM JEE)',
];

export const steps = [
  {
    title: 'Results and scores',
    when: 'May – June',
    text: 'We read the Class 12 marks and entrance scores (NEET, JEE, CUET…) and draw up a realistic list of courses and colleges.',
  },
  {
    title: 'Counselling registration',
    when: 'June – July',
    text: 'We register you for the right counsellings (MCC, TNEA, JoSAA, university exams) and check every certificate.',
  },
  {
    title: 'Choice filling',
    when: 'July – Aug',
    text: 'We order your choices by cutoff trends, fees and distance, so a good seat is never lost to a bad order.',
  },
  {
    title: 'Seat allotment',
    when: 'Aug – Oct',
    text: 'After each round we tell you whether to join, upgrade or exit, and we track the extra vacancy rounds.',
  },
  {
    title: 'Reporting to college',
    when: 'Within days',
    text: 'Document checklist, fee payment, hostel booking and the first visit. We stay with you until classes start.',
  },
];

export const testimonials = [
  {
    title: 'Got Stanley in round 2',
    quote:
      'We were sure our son had missed out after round 1. The team told us not to take the private seat and to wait. He got Stanley Medical College in round 2.',
    name: 'Revathi Sundaram',
    detail: 'Parent · Chennai · NEET 2026',
    featured: true,
  },
  {
    title: 'CEG through TNEA',
    quote:
      'Her cutoff was 198.5. They showed us exactly which branches at Guindy were realistic and she got ECE in round 1.',
    name: 'Ganesh Iyer',
    detail: 'Parent · Chennai · TNEA 2026',
  },
  {
    title: 'The career test changed our plan',
    quote:
      'Everyone said engineering. The aptitude report and two sessions pointed to architecture. I’m now in B.Arch and I love it.',
    name: 'Nandhini Ravi',
    detail: 'B.Arch student · Coimbatore',
  },
  {
    title: 'The 7.5% quota explained',
    quote: 'Nobody in our village knew how the government-school quota worked. They checked every certificate.',
    name: 'Karthik Murugan',
    detail: 'MBBS student · Tirunelveli',
  },
  {
    title: 'JoSAA rounds made simple',
    quote: 'Six rounds, float, slide, freeze… they explained it in Tamil to my parents. I’m at NIT Trichy.',
    name: 'Arjun Prakash',
    detail: 'B.Tech student · Tiruchirappalli',
  },
  {
    title: 'Georgia, done properly',
    quote: 'They only suggested NMC-compliant universities and helped with the visa. My daughter is in her third year.',
    name: 'Selvi Rajendran',
    detail: 'Parent · Salem',
  },
];

export const updates = [
  { date: '2026-11-20', title: 'MCC special stray round: results out, 411 MBBS seats still vacant', tag: 'Medical' },
  { date: '2026-11-14', title: 'JEE Main 2027 session 1: registration window and exam dates', tag: 'Engineering' },
  { date: '2026-11-12', title: 'TN Selection Committee: special stray round for MBBS and BDS', tag: 'Medical' },
  { date: '2026-11-04', title: 'NMC draft keeps FMGE as the licensing exam until NExT starts', tag: 'Abroad' },
  { date: '2026-10-28', title: 'Choosing a group in Class 11: what each one keeps open', tag: 'Career' },
];

export const faqs = [
  {
    q: 'Do you only help with medical admissions?',
    a: 'No. We guide students for medicine, engineering, law, architecture, design, commerce, arts and science, and study abroad. Many families start with us in Class 9 or 10 for career guidance, well before admissions.',
  },
  {
    q: 'When should we start career guidance?',
    a: 'Class 9 or 10 is ideal, before choosing a group in Class 11. Class 11 and 12 is still a good time to plan entrance exams. After Class 12, we focus on courses and colleges you can realistically get.',
  },
  {
    q: 'Is your counselling really free?',
    a: 'The first session, the college list and the fee breakup are free. The detailed aptitude assessment and full admission support are paid; we explain our fee in writing before you decide.',
  },
  {
    q: 'Can you guarantee a seat or get a "direct admission"?',
    a: 'No one honestly can. Seats in government and aided colleges, and most private ones, are allotted through official counselling (MCC, TNEA, JoSAA, state committees). We help you make the best choices in that process. Be careful of anyone offering "donation" seats.',
  },
  {
    q: 'What is the difference between government quota and management quota?',
    a: 'In a Tamil Nadu private college, government-quota seats are allotted on merit through state counselling at fees fixed by the government. Management seats in the same college cost far more: about ₹2–3 lakh a year more for engineering, and ₹10 lakh more for MBBS.',
  },
];

export const medicalDocuments = [
  'NEET-UG admit card and score card',
  'Class 10 and Class 12 mark sheets',
  'Transfer certificate',
  'Nativity certificate (for Tamil Nadu state quota)',
  'Community certificate (for reserved categories)',
  'Bonafide certificate from Class 6–12 school (for the 7.5% preference)',
  'Aadhaar card and passport-size photos',
  'Income certificate (for EWS or scholarships)',
];

export const medicalDates = [
  { label: 'NEET-UG 2027 application', when: 'Feb – Mar 2027 (expected)' },
  { label: 'NEET-UG 2027 exam', when: 'First Sunday of May 2027 (expected)' },
  { label: 'Result', when: 'June 2027' },
  { label: 'MCC round 1', when: 'July 2027' },
  { label: 'Tamil Nadu round 1', when: 'July – Aug 2027' },
];

export const engineeringDocuments = [
  'Class 10 and Class 12 mark sheets',
  'JEE Main / JEE Advanced score card (for JoSAA)',
  'Transfer certificate',
  'Nativity certificate (for TNEA)',
  'Community certificate (for reserved categories)',
  'First-graduate certificate (for the TN fee waiver)',
  'Bonafide certificate from Class 6–12 school (for the 7.5% preference)',
  'Income certificate (for fee waivers and scholarships)',
];

export const engineeringDates = [
  { label: 'JEE Main 2027 session 1', when: 'Jan 2027' },
  { label: 'JEE Main 2027 session 2', when: 'April 2027' },
  { label: 'TNEA 2027 registration', when: 'May – June 2027 (expected)' },
  { label: 'JoSAA counselling', when: 'June – July 2027' },
  { label: 'TNEA rounds', when: 'July – Aug 2027' },
];

export const team = [
  { name: 'Dr. S. Anand Kumar', role: 'Founder & lead counsellor', years: 14 },
  { name: 'Priya Venkatesh', role: 'Career guidance & assessments', years: 9 },
  { name: 'Mohammed Rafi', role: 'Medical & engineering counselling', years: 8 },
  { name: 'Kavya Ramesh', role: 'Study abroad & visas', years: 6 },
];

export const event = {
  title: 'Free 2027 admissions & career seminar',
  text: 'Medical, engineering and other courses: how counselling works, what each route costs, and how to choose.',
  date: 'Sunday, 14 December 2026',
  time: '10:00 am – 1:00 pm',
  venue: 'Anna Nagar, Chennai · also live on YouTube',
};
