// Agency details for the demo. Everything here is placeholder content for the
// client presentation: swap in the client's real name, numbers and address.

export const site = {
  name: 'Arivu Career & Admissions',
  shortName: 'Arivu',
  tagline: 'Career guidance · College admissions',
  since: 2012,
  phone: '+91 98765 43210',
  phoneHref: 'tel:+919876543210',
  whatsapp: '919876543210',
  email: 'hello@arivuadmissions.in',
  address: ['No. 21, 3rd Avenue', 'Anna Nagar East', 'Chennai 600102, Tamil Nadu'],
  branches: ['Coimbatore', 'Madurai', 'Tiruchirappalli'],
  hours: 'Mon–Sat, 9:30 am – 7:00 pm',
  mapQuery: 'Anna Nagar East, Chennai',
  social: {
    instagram: 'https://www.instagram.com/',
    youtube: 'https://www.youtube.com/',
    facebook: 'https://www.facebook.com/',
  },
};

export const whatsappLink = (text = 'Hi Arivu team, I would like a free counselling session.') =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

// Headline numbers (placeholders for the demo).
export const stats = {
  studentsGuided: 6800,
  seatsSecured: 3900,
  careerReports: 2100,
  successRate: 96,
  partnerColleges: 12,
  counsellors: 18,
};

// Unsplash photos (free licence), hot-linked at the size each slot needs.
// `id` is an Unsplash photo id, or a full image URL added in the admin.
export const photo = (id, w = 1200, h) =>
  /^https?:\/\//.test(id ?? '')
    ? id
    : `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=70&w=${w}${h ? `&h=${h}` : ''}`;

export const photos = {
  heroStudent: '1598096969068-7f52cac10c83',
  medicalStudent: '1623854767648-e7bb8009f0db',
  friendsCampus: '1765572144519-1dc1e6e07bc9',
  studentsBooks: '1637589316488-6d4c41b335cd',
  whiteCoats: '1764421796899-bd105fd6dd62',
  heritageCampus: '1634807186335-7731bbed1e79',
  seminar: '1540575467063-178a50c2df87',
  studyGroup: '1686624386665-4cd01b96d0f6',
  domeCampus: '1777654770487-b49bb24f61ec',
  stethoscopeBooks: '1676313496812-f8fc7c4304cf',
  openBook: '1652787545245-5e39748cdf97',
  doctorPortrait: '1659353886973-ced1dfeab3ac',
  library: '1544456203-0af5a69f5789',
};
