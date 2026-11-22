// Sample colleges and 2026-27 fees for the demo.
//
// Names and places are real colleges; fees, seats and partner tie-ups are
// SAMPLE figures based on public 2026 reports (Shiksha, Careers360, TN
// Selection Committee notices). They are for showing how the site works, not
// for advising students. The admin panel is where the agency keeps them right.
//
// Used in two places: the browser (demo mode) and scripts/build-seed.mjs,
// which turns this file into supabase/seed.sql.

export const ACADEMIC_YEAR = '2026-27';

// Each college record is one stream (a university with medical and engineering
// campuses appears once per stream).
export const STREAMS = {
  medical: { label: 'Medical', course: 'MBBS', years: 4.5, yearsNote: '4.5 years + 1-year internship' },
  engineering: { label: 'Engineering', course: 'B.E. / B.Tech', years: 4, yearsNote: '4 years (8 semesters)' },
};

export const OWNERSHIP = {
  government: 'Government',
  aided: 'Government-aided',
  private: 'Private (self-financing)',
  deemed: 'Deemed university',
  central: 'Central institute',
};

export const QUOTAS = {
  govt: { label: 'Government quota (state)', short: 'Govt quota' },
  aiq: { label: 'All-India / central', short: 'All-India' },
  management: { label: 'Management quota', short: 'Management' },
  nri: { label: 'NRI quota', short: 'NRI' },
  deemed: { label: 'Deemed university seat', short: 'Deemed' },
};

// Which counselling fills each quota, by stream.
export const COUNSELLING = {
  medical: {
    govt: 'TN Selection Committee',
    aiq: 'MCC (15% all-India)',
    management: 'TN Selection Committee',
    nri: 'Selection Committee / MCC',
    deemed: 'MCC deemed rounds',
  },
  engineering: {
    govt: 'TNEA single window',
    aiq: 'JoSAA (JEE)',
    management: 'College (management seats)',
    nri: 'College (NRI seats)',
    deemed: 'University’s own exam',
  },
};

const c = (slug, name, city, state, ownership, extra) => ({
  slug,
  name,
  city,
  state,
  ownership,
  stream: 'medical',
  courses: ['MBBS'],
  is_partner: false,
  is_published: true,
  ...extra,
});

const e = (slug, name, city, state, ownership, extra) =>
  c(slug, name, city, state, ownership, { stream: 'engineering', courses: ['B.E. / B.Tech'], ...extra });

const medicalColleges = [
  // Tamil Nadu: government
  c('madras-medical-college', 'Madras Medical College', 'Chennai', 'Tamil Nadu', 'government', {
    university: 'The Tamil Nadu Dr. M.G.R. Medical University',
    established: 1835,
    seats: 250,
    beds: 2722,
    counselling: ['TN Selection Committee', 'MCC (15% AIQ)'],
    summary:
      'One of the oldest medical colleges in Asia, attached to Rajiv Gandhi Government General Hospital. Among the highest NEET cutoffs in Tamil Nadu.',
    cutoff_base: 120,
  }),
  c('stanley-medical-college', 'Stanley Medical College', 'Chennai', 'Tamil Nadu', 'government', {
    university: 'The Tamil Nadu Dr. M.G.R. Medical University',
    established: 1938,
    seats: 250,
    beds: 1600,
    counselling: ['TN Selection Committee', 'MCC (15% AIQ)'],
    summary:
      'Government college in north Chennai with a busy teaching hospital, known for surgery and hand and reconstructive surgery.',
    cutoff_base: 260,
  }),
  c('madurai-medical-college', 'Madurai Medical College', 'Madurai', 'Tamil Nadu', 'government', {
    university: 'The Tamil Nadu Dr. M.G.R. Medical University',
    established: 1954,
    seats: 250,
    beds: 2958,
    counselling: ['TN Selection Committee', 'MCC (15% AIQ)'],
    summary: 'The largest government teaching hospital in south Tamil Nadu. Strong clinical exposure from day one.',
    cutoff_base: 420,
  }),
  c('coimbatore-medical-college', 'Coimbatore Medical College', 'Coimbatore', 'Tamil Nadu', 'government', {
    university: 'The Tamil Nadu Dr. M.G.R. Medical University',
    established: 1966,
    seats: 200,
    beds: 1520,
    counselling: ['TN Selection Committee', 'MCC (15% AIQ)'],
    summary: 'A popular western-Tamil Nadu choice with a large government hospital and good hostel facilities.',
    cutoff_base: 520,
  }),
  c('tirunelveli-medical-college', 'Tirunelveli Medical College', 'Tirunelveli', 'Tamil Nadu', 'government', {
    university: 'The Tamil Nadu Dr. M.G.R. Medical University',
    established: 1965,
    seats: 250,
    beds: 1900,
    counselling: ['TN Selection Committee', 'MCC (15% AIQ)'],
    summary: 'Established government college in the far south with a large catchment of patients.',
    cutoff_base: 900,
  }),
  c(
    'government-medical-college-the-nilgiris',
    'Government Medical College, The Nilgiris',
    'Ooty',
    'Tamil Nadu',
    'government',
    {
      university: 'The Tamil Nadu Dr. M.G.R. Medical University',
      established: 2021,
      seats: 150,
      beds: 700,
      counselling: ['TN Selection Committee', 'MCC (15% AIQ)'],
      summary: 'A newer hill-station campus in Ooty. Lower cutoffs than the city colleges and a quiet place to study.',
      cutoff_base: 2400,
    }
  ),
  // Central
  c('aiims-madurai', 'AIIMS Madurai', 'Madurai', 'Tamil Nadu', 'central', {
    university: 'All India Institute of Medical Sciences',
    established: 2019,
    seats: 100,
    beds: 750,
    counselling: ['MCC'],
    summary: 'Central government institute filled only through MCC counselling. Very low fees, very high cutoffs.',
    cutoff_base: 60,
  }),
  // Tamil Nadu: private self-financing
  c(
    'psg-institute-of-medical-sciences',
    'PSG Institute of Medical Sciences and Research',
    'Coimbatore',
    'Tamil Nadu',
    'private',
    {
      university: 'The Tamil Nadu Dr. M.G.R. Medical University',
      established: 1985,
      seats: 250,
      beds: 1360,
      counselling: ['TN Selection Committee'],
      summary:
        'A reputed private college with government-quota seats at state-fixed fees, plus management and NRI seats.',
      cutoff_base: 1500,
    }
  ),
  c(
    'karpagam-faculty-of-medical-sciences',
    'Karpagam Faculty of Medical Sciences and Research',
    'Coimbatore',
    'Tamil Nadu',
    'private',
    {
      university: 'The Tamil Nadu Dr. M.G.R. Medical University',
      established: 2011,
      seats: 150,
      beds: 750,
      counselling: ['TN Selection Committee'],
      summary: 'Self-financing college on a large green campus outside Coimbatore. A partner college of Arivu.',
      is_partner: true,
      cutoff_base: 5200,
    }
  ),
  c('sri-muthukumaran-medical-college', 'Sri Muthukumaran Medical College', 'Chennai', 'Tamil Nadu', 'private', {
    university: 'The Tamil Nadu Dr. M.G.R. Medical University',
    established: 2008,
    seats: 150,
    beds: 800,
    counselling: ['TN Selection Committee'],
    summary: 'Private college near Mangadu in west Chennai, with newer hostels and attached-bath rooms.',
    is_partner: true,
    cutoff_base: 6100,
  }),
  c(
    'kmch-institute-of-health-sciences',
    'KMCH Institute of Health Sciences and Research',
    'Coimbatore',
    'Tamil Nadu',
    'private',
    {
      university: 'The Tamil Nadu Dr. M.G.R. Medical University',
      established: 2019,
      seats: 150,
      beds: 650,
      counselling: ['TN Selection Committee'],
      summary: 'Young college backed by a large private hospital group in Coimbatore.',
      cutoff_base: 4300,
    }
  ),
  c('christian-medical-college-vellore', 'Christian Medical College, Vellore', 'Vellore', 'Tamil Nadu', 'private', {
    university: 'The Tamil Nadu Dr. M.G.R. Medical University',
    established: 1900,
    seats: 100,
    beds: 3000,
    counselling: ['MCC', 'CMC minority quota'],
    summary:
      'A minority institution with famously low fees and a service commitment. Seats are filled through MCC and its own minority process.',
    cutoff_base: 40,
  }),
  // Tamil Nadu: deemed universities
  c(
    'sri-ramachandra-institute',
    'Sri Ramachandra Institute of Higher Education and Research',
    'Chennai',
    'Tamil Nadu',
    'deemed',
    {
      university: 'Sri Ramachandra Institute (Deemed University)',
      established: 1985,
      seats: 250,
      beds: 2000,
      counselling: ['MCC (deemed)'],
      summary:
        'Large deemed university in Porur with a big multi-speciality hospital. Admission through MCC deemed rounds.',
      cutoff_base: 9000,
    }
  ),
  c(
    'srm-medical-college',
    'SRM Medical College Hospital and Research Centre',
    'Kattankulathur',
    'Tamil Nadu',
    'deemed',
    {
      university: 'SRM Institute of Science and Technology',
      established: 2005,
      seats: 250,
      beds: 1650,
      counselling: ['MCC (deemed)'],
      summary: 'Part of the SRM campus on the GST road, south of Chennai.',
      cutoff_base: 14000,
    }
  ),
  c('saveetha-medical-college', 'Saveetha Medical College', 'Chennai', 'Tamil Nadu', 'deemed', {
    university: 'Saveetha Institute of Medical and Technical Sciences',
    established: 2008,
    seats: 250,
    beds: 1450,
    counselling: ['MCC (deemed)'],
    summary: 'Deemed university at Thandalam, Chennai, known for its research output.',
    cutoff_base: 16000,
  }),
  c(
    'chettinad-hospital-and-research-institute',
    'Chettinad Hospital and Research Institute',
    'Kelambakkam',
    'Tamil Nadu',
    'deemed',
    {
      university: 'Chettinad Academy of Research and Education',
      established: 2005,
      seats: 250,
      beds: 1350,
      counselling: ['MCC (deemed)'],
      summary: 'Deemed university on the OMR with a modern hospital. A partner college of Arivu.',
      is_partner: true,
      cutoff_base: 19000,
    }
  ),
  c(
    'meenakshi-medical-college',
    'Meenakshi Medical College Hospital and Research Institute',
    'Kanchipuram',
    'Tamil Nadu',
    'deemed',
    {
      university: 'Meenakshi Academy of Higher Education and Research',
      established: 2003,
      seats: 250,
      beds: 1200,
      counselling: ['MCC (deemed)'],
      summary: 'Deemed university in Enathur, Kanchipuram, about 75 km from Chennai.',
      cutoff_base: 23000,
    }
  ),
  c(
    'vinayaka-missions-kirupananda-variyar',
    "Vinayaka Mission's Kirupananda Variyar Medical College",
    'Salem',
    'Tamil Nadu',
    'deemed',
    {
      university: "Vinayaka Mission's Research Foundation",
      established: 1995,
      seats: 150,
      beds: 900,
      counselling: ['MCC (deemed)'],
      summary: 'Deemed university college in Salem with comparatively lower deemed fees. A partner college of Arivu.',
      is_partner: true,
      cutoff_base: 31000,
    }
  ),
  // Other states
  c('aiims-new-delhi', 'AIIMS New Delhi', 'New Delhi', 'Delhi', 'central', {
    university: 'All India Institute of Medical Sciences',
    established: 1956,
    seats: 132,
    beds: 2478,
    counselling: ['MCC'],
    summary: "India's top-ranked medical college. Seats go to the very top of the NEET merit list.",
    cutoff_base: 5,
  }),
  c('jipmer-puducherry', 'JIPMER Puducherry', 'Puducherry', 'Puducherry', 'central', {
    university: 'Jawaharlal Institute of Postgraduate Medical Education and Research',
    established: 1964,
    seats: 249,
    beds: 2135,
    counselling: ['MCC'],
    summary: 'Central institute next door to Tamil Nadu, with very low fees and a strong clinical reputation.',
    cutoff_base: 90,
  }),
  c('kasturba-medical-college-manipal', 'Kasturba Medical College, Manipal', 'Manipal', 'Karnataka', 'deemed', {
    university: 'Manipal Academy of Higher Education',
    established: 1953,
    seats: 250,
    beds: 2032,
    counselling: ['MCC (deemed)'],
    summary: 'The best-known private medical college in India, in a university town on the Karnataka coast.',
    cutoff_base: 7000,
  }),
  c(
    'bangalore-medical-college',
    'Bangalore Medical College and Research Institute',
    'Bengaluru',
    'Karnataka',
    'government',
    {
      university: 'Rajiv Gandhi University of Health Sciences',
      established: 1955,
      seats: 250,
      beds: 2700,
      counselling: ['KEA (Karnataka)', 'MCC (15% AIQ)'],
      summary: 'Top government college in Karnataka. Tamil Nadu students can apply through the 15% all-India quota.',
      cutoff_base: 600,
    }
  ),
  c('amrita-school-of-medicine-kochi', 'Amrita School of Medicine, Kochi', 'Kochi', 'Kerala', 'deemed', {
    university: 'Amrita Vishwa Vidyapeetham',
    established: 1998,
    seats: 150,
    beds: 1350,
    counselling: ['MCC (deemed)'],
    summary: 'Deemed university with a large hospital in Kochi; popular with south Indian families.',
    cutoff_base: 8500,
  }),
];

const engineeringColleges = [
  // Tamil Nadu: government and aided (TNEA)
  e('college-of-engineering-guindy', 'College of Engineering, Guindy', 'Chennai', 'Tamil Nadu', 'government', {
    university: 'Anna University',
    established: 1794,
    seats: 1400,
    avg_package_lpa: 9.5,
    counselling: ['TNEA'],
    summary:
      'The oldest engineering college in India and the first choice for most TNEA toppers. Anna University’s main campus, with very low fees.',
    cutoff_base: 150,
  }),
  e(
    'government-college-of-technology-coimbatore',
    'Government College of Technology',
    'Coimbatore',
    'Tamil Nadu',
    'government',
    {
      university: 'Anna University (autonomous)',
      established: 1945,
      seats: 750,
      avg_package_lpa: 6.5,
      counselling: ['TNEA'],
      summary: 'A respected government college in Coimbatore with strong civil, mechanical and electrical departments.',
      cutoff_base: 900,
    }
  ),
  e('psg-college-of-technology', 'PSG College of Technology', 'Coimbatore', 'Tamil Nadu', 'aided', {
    university: 'Anna University (autonomous)',
    established: 1951,
    seats: 1300,
    avg_package_lpa: 8,
    counselling: ['TNEA', 'Management'],
    summary:
      'Government-aided college with close industry links. Aided seats cost far less than its self-financing courses.',
    cutoff_base: 600,
  }),
  e('thiagarajar-college-of-engineering', 'Thiagarajar College of Engineering', 'Madurai', 'Tamil Nadu', 'aided', {
    university: 'Anna University (autonomous)',
    established: 1957,
    seats: 900,
    avg_package_lpa: 6,
    counselling: ['TNEA', 'Management'],
    summary: 'The leading engineering college in south Tamil Nadu, on a large campus by the Thiruparankundram hills.',
    cutoff_base: 1800,
  }),
  // Tamil Nadu: private self-financing
  e('ssn-college-of-engineering', 'SSN College of Engineering', 'Kalavakkam', 'Tamil Nadu', 'private', {
    university: 'Anna University (autonomous)',
    established: 1996,
    seats: 1000,
    avg_package_lpa: 7.5,
    counselling: ['TNEA', 'Management'],
    summary: 'Top private college on the OMR near Chennai, known for computer science and strong placements.',
    cutoff_base: 1200,
  }),
  e('kumaraguru-college-of-technology', 'Kumaraguru College of Technology', 'Coimbatore', 'Tamil Nadu', 'private', {
    university: 'Anna University (autonomous)',
    established: 1984,
    seats: 1200,
    avg_package_lpa: 5.5,
    counselling: ['TNEA', 'Management'],
    summary: 'Large autonomous college in Coimbatore with a busy start-up and innovation centre.',
    cutoff_base: 5000,
  }),
  e(
    'sri-krishna-college-of-engineering-and-technology',
    'Sri Krishna College of Engineering and Technology',
    'Coimbatore',
    'Tamil Nadu',
    'private',
    {
      university: 'Anna University (autonomous)',
      established: 1998,
      seats: 1100,
      avg_package_lpa: 4.8,
      counselling: ['TNEA', 'Management'],
      summary: 'Autonomous college in Kuniamuthur, Coimbatore. A partner college of Arivu.',
      is_partner: true,
      cutoff_base: 12000,
    }
  ),
  e('rajalakshmi-engineering-college', 'Rajalakshmi Engineering College', 'Chennai', 'Tamil Nadu', 'private', {
    university: 'Anna University (autonomous)',
    established: 1997,
    seats: 1500,
    avg_package_lpa: 5,
    counselling: ['TNEA', 'Management'],
    summary:
      'Large private college in Thandalam, west Chennai, with a wide choice of branches. A partner college of Arivu.',
    is_partner: true,
    cutoff_base: 9000,
  }),
  // Deemed universities (own entrance exams)
  e('vit-vellore', 'Vellore Institute of Technology (VIT)', 'Vellore', 'Tamil Nadu', 'deemed', {
    university: 'VIT (Deemed University)',
    established: 1984,
    seats: 6000,
    avg_package_lpa: 9,
    counselling: ['VITEEE'],
    summary:
      'One of India’s largest private engineering universities. Fees depend on your VITEEE rank (categories 1 to 5).',
    cutoff_base: 20000,
  }),
  e('srm-ist-kattankulathur', 'SRM Institute of Science and Technology', 'Kattankulathur', 'Tamil Nadu', 'deemed', {
    university: 'SRM Institute of Science and Technology',
    established: 1985,
    seats: 7000,
    avg_package_lpa: 7,
    counselling: ['SRMJEEE'],
    summary: 'Large deemed university south of Chennai with its own entrance exam. A partner college of Arivu.',
    is_partner: true,
    cutoff_base: 15000,
  }),
  e('sastra-deemed-university', 'SASTRA Deemed University', 'Thanjavur', 'Tamil Nadu', 'deemed', {
    university: 'SASTRA Deemed University',
    established: 1984,
    seats: 2000,
    avg_package_lpa: 6.5,
    counselling: ['SASTRA (12th marks + JEE Main)'],
    summary: 'Admits on Class 12 marks and JEE Main scores, with moderate fees for a deemed university.',
    cutoff_base: 8000,
  }),
  e('bits-pilani', 'BITS Pilani', 'Pilani', 'Rajasthan', 'deemed', {
    university: 'Birla Institute of Technology and Science',
    established: 1964,
    seats: 1500,
    avg_package_lpa: 20,
    counselling: ['BITSAT'],
    summary: 'Top private institute, admission only through BITSAT. Campuses in Pilani, Goa and Hyderabad.',
    cutoff_base: 3000,
  }),
  // Central institutes (JoSAA)
  e('iit-madras', 'IIT Madras', 'Chennai', 'Tamil Nadu', 'central', {
    university: 'Indian Institute of Technology Madras',
    established: 1959,
    seats: 1200,
    avg_package_lpa: 22,
    counselling: ['JoSAA (JEE Advanced)'],
    summary: 'Ranked India’s top engineering institute for years running. Admission through JEE Advanced and JoSAA.',
    cutoff_base: 150,
  }),
  e('nit-tiruchirappalli', 'NIT Tiruchirappalli', 'Tiruchirappalli', 'Tamil Nadu', 'central', {
    university: 'National Institute of Technology',
    established: 1964,
    seats: 1000,
    avg_package_lpa: 12,
    counselling: ['JoSAA (JEE Main)'],
    summary: 'The top NIT in India. Half the seats go to Tamil Nadu students through the home-state quota.',
    cutoff_base: 4000,
  }),
  e('iiitdm-kancheepuram', 'IIITDM Kancheepuram', 'Chennai', 'Tamil Nadu', 'central', {
    university: 'Indian Institute of Information Technology, Design and Manufacturing',
    established: 2007,
    seats: 400,
    avg_package_lpa: 10,
    counselling: ['JoSAA (JEE Main)'],
    summary: 'Central institute in Chennai focused on design and smart manufacturing.',
    cutoff_base: 25000,
  }),
  e('nitk-surathkal', 'NIT Karnataka, Surathkal', 'Surathkal', 'Karnataka', 'central', {
    university: 'National Institute of Technology Karnataka',
    established: 1960,
    seats: 1000,
    avg_package_lpa: 13,
    counselling: ['JoSAA (JEE Main)'],
    summary: 'Seaside NIT near Mangaluru with excellent placements in computing and electronics.',
    cutoff_base: 5000,
  }),
];

export const colleges = [...medicalColleges, ...engineeringColleges];

// Illustrative campus photos (Unsplash, free licence). They are not photos of
// these exact colleges: the client would add each college's own photo in the admin.
const CAMPUS_PHOTOS = [
  '1634807186335-7731bbed1e79',
  '1565018054866-968e244671af',
  '1687709644312-8c67bd4821c6',
  '1585770339455-34176a2c4318',
  '1758292109543-a5c7f0c4cb9b',
  '1719948501000-3f50addd29d2',
  '1777654770487-b49bb24f61ec',
  '1683792337566-e305745c15ee',
];
colleges.forEach((college, i) => {
  college.image = CAMPUS_PHOTOS[i % CAMPUS_PHOTOS.length];
});

// Fees per college, quota and year (rupees per year; one-time fees once).
// Pattern by stream and college type, with some college-specific figures.
const feeRow = (quota, tuition, hostel, oneTime, note = '') => ({
  quota,
  tuition_per_year: tuition,
  hostel_per_year: hostel,
  one_time_fees: oneTime,
  note,
});

const MEDICAL_FEES = {
  government: () => [
    feeRow('govt', 18_073, 12_000, 4_000, 'Fixed by the Government of Tamil Nadu.'),
    feeRow('aiq', 18_073, 12_000, 4_000, 'Same fee as state quota; seat through MCC.'),
  ],
  central: () => [feeRow('aiq', 1_350, 3_000, 1_500, 'Central institute fee.')],
  private: (slug) => {
    const premium = { 'psg-institute-of-medical-sciences': 1.05 }[slug] ?? 1;
    return [
      feeRow(
        'govt',
        4_35_000,
        1_80_000,
        50_000,
        'Govt-quota seat in a private college; fee fixed by the TN Fee Committee.'
      ),
      feeRow(
        'management',
        Math.round(15_00_000 * premium),
        2_10_000,
        1_00_000,
        'Management seat; allotted by the Selection Committee.'
      ),
      feeRow('nri', Math.round(27_00_000 * premium), 2_40_000, 1_00_000, 'NRI / NRI-sponsored seat.'),
    ];
  },
  deemed: (slug) => {
    const tuition =
      {
        'sri-ramachandra-institute': 29_50_000,
        'srm-medical-college': 25_00_000,
        'saveetha-medical-college': 27_50_000,
        'chettinad-hospital-and-research-institute': 27_00_000,
        'meenakshi-medical-college': 25_50_000,
        'vinayaka-missions-kirupananda-variyar': 22_50_000,
        'kasturba-medical-college-manipal': 17_60_000,
        'amrita-school-of-medicine-kochi': 18_50_000,
      }[slug] ?? 25_00_000;
    return [
      feeRow('deemed', tuition, 2_75_000, 1_50_000, 'Deemed university fee; seat through MCC deemed rounds.'),
      feeRow('nri', Math.round(tuition * 1.6), 3_00_000, 1_50_000, 'NRI seat, often quoted in US dollars.'),
    ];
  },
};

const ENGINEERING_FEES = {
  government: () => [feeRow('govt', 25_000, 45_000, 10_000, 'Anna University / government fee.')],
  aided: () => [
    feeRow('govt', 55_000, 60_000, 15_000, 'Aided seat through TNEA.'),
    feeRow('management', 1_50_000, 60_000, 25_000, 'Self-financing course in an aided college.'),
  ],
  private: (slug) => {
    const premium = { 'ssn-college-of-engineering': 1.35 }[slug] ?? 1;
    return [
      feeRow('govt', 85_000, 90_000, 20_000, 'TNEA seat; fee fixed by the TN Fee Committee.'),
      feeRow('management', Math.round(2_25_000 * premium), 90_000, 25_000, 'Management seat, admitted by the college.'),
      feeRow('nri', Math.round(4_00_000 * premium), 1_00_000, 25_000, 'NRI seat.'),
    ];
  },
  deemed: (slug) => {
    const [tuition, note] = {
      'vit-vellore': [1_98_000, 'Category 1 fee; categories 2–5 go up to about ₹4.05 L a year.'],
      'srm-ist-kattankulathur': [2_75_000, 'Computer science fee; other branches cost less.'],
      'sastra-deemed-university': [1_65_000, 'Same fee for all branches.'],
      'bits-pilani': [5_40_000, 'Fee for 2026-27 entry; rises about 10% a year.'],
    }[slug] ?? [2_50_000, ''];
    return [feeRow('deemed', tuition, 1_20_000, 50_000, note)];
  },
  central: (slug) => {
    const tuition = slug === 'iit-madras' ? 2_00_000 : slug === 'iiitdm-kancheepuram' ? 1_40_000 : 1_25_000;
    return [
      feeRow(
        'aiq',
        tuition,
        50_000,
        25_000,
        'Full tuition waiver for SC/ST and families earning under ₹1 L; two-thirds waived under ₹5 L.'
      ),
    ];
  },
};

const SPECIAL_FEES = {
  'christian-medical-college-vellore': [
    feeRow('aiq', 3_000, 24_000, 5_000, 'Minority institution with very low fees.'),
  ],
  'bangalore-medical-college': [
    feeRow('govt', 60_000, 25_000, 10_000, 'Karnataka government quota.'),
    feeRow('aiq', 60_000, 25_000, 10_000, 'Seat through MCC.'),
  ],
  'government-college-of-technology-coimbatore': [feeRow('govt', 15_000, 40_000, 8_000, 'Government college fee.')],
};

const FEE_SOURCES = { medical: 'https://tnmedicalselection.net', engineering: 'https://www.tneaonline.org' };

export const fees = colleges.flatMap((college) => {
  const patterns = college.stream === 'engineering' ? ENGINEERING_FEES : MEDICAL_FEES;
  const rows = SPECIAL_FEES[college.slug] ?? patterns[college.ownership](college.slug);
  return rows.map((row) => ({
    college_slug: college.slug,
    course: STREAMS[college.stream].course,
    academic_year: ACADEMIC_YEAR,
    source_url: FEE_SOURCES[college.stream],
    updated_at: '2026-11-15T10:00:00+05:30',
    ...row,
  }));
});
