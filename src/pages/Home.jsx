import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Cog,
  Compass,
  Globe2,
  MapPin,
  Star,
  Stethoscope,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { Link } from 'react-router';
import Accordion from '../components/Accordion.jsx';
import AnimatedContent from '../components/bits/AnimatedContent.jsx';
import Magnet from '../components/bits/Magnet.jsx';
import ScrollReveal from '../components/bits/ScrollReveal.jsx';
import SplitText from '../components/bits/SplitText.jsx';
import SpotlightCard from '../components/bits/SpotlightCard.jsx';
import CollegeCard from '../components/CollegeCard.jsx';
import CountUp from '../components/CountUp.jsx';
import { Button, ButtonLink, ErrorBlock, LoadingBlock, Photo, SectionHeading } from '../components/ui.jsx';
import { stages } from '../data/careers.js';
import { event, faqs, otherCourses, services, steps, testimonials, updates } from '../data/content.js';
import { photos, stats } from '../data/site.js';
import { listColleges } from '../lib/api.js';
import { dateLabel, initials } from '../lib/format.js';
import { gsap, MOTION_OK, useGSAP } from '../lib/gsap.js';
import { useLead } from '../lib/leadContext.jsx';
import { useAsync, useTitle } from '../lib/useAsync.js';

const SERVICE_ICONS = { compass: Compass, stethoscope: Stethoscope, cog: Cog, globe: Globe2 };

const MARQUEE = [
  'Career & aptitude assessment',
  'NEET · MCC · TN Selection Committee',
  'JEE · JoSAA · TNEA',
  'CUET · CLAT · NATA · NIFT',
  'Deemed universities',
  'Management & NRI quota',
  '7.5% government-school preference',
  'Study abroad',
];

export default function Home() {
  useTitle('Career guidance and college admissions in Tamil Nadu, India and abroad');
  return (
    <>
      <Hero />
      <Marquee />
      <Story />
      <Services />
      <CareerGuidance />
      <FeaturedColleges />
      <Process />
      <FeeReality />
      <EventBanner />
      <Testimonials />
      <Updates />
      <Faq />
    </>
  );
}

function Hero() {
  const { openLead } = useLead();
  const scope = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from('[data-hero-photo]', {
          clipPath: 'inset(8% 8% 8% 8% round 28px)',
          scale: 1.08,
          duration: 1.4,
          ease: 'expo.out',
        });
        gsap.from('[data-hero-chip]', {
          y: 24,
          opacity: 0,
          duration: 0.9,
          delay: 0.6,
          ease: 'power3.out',
          stagger: 0.12,
        });
        gsap.from('[data-hero-fade]', {
          y: 18,
          opacity: 0,
          duration: 0.9,
          delay: 0.35,
          ease: 'power3.out',
          stagger: 0.1,
        });
        gsap.to('[data-hero-photo] img', {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: { trigger: scope.current, start: 'top top', end: 'bottom top', scrub: true },
        });
      });
      return () => mm.revert();
    },
    { scope }
  );

  return (
    <section ref={scope} className="overflow-hidden bg-white pt-4 pb-14 sm:pt-8 lg:pb-20">
      <div className="container-page grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div>
          <span className="eyebrow" data-hero-fade>
            Career guidance · 2027 admissions open
          </span>
          <h1 className="mt-5 text-[clamp(2.4rem,6vw,4.4rem)] leading-[1.02] font-bold">
            <SplitText text="Turn your marks into the" />{' '}
            <SplitText text="right career" className="accent" startAt={0.3} />
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted" data-hero-fade>
            Career guidance from Class 8 onwards, and admission help for medicine, engineering and every other course,
            in Tamil Nadu, across India and abroad. Honest advice, fees for every quota, and a counsellor beside you
            until the first day of college.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4" data-hero-fade>
            <Magnet padding={50} magnetStrength={6}>
              <Button onClick={() => openLead({ source: 'hero' })}>Book a free session</Button>
            </Magnet>
            <Link to="/career-guidance" className="group inline-flex items-center gap-2 font-semibold text-forest-800">
              <span className="grid h-9 w-9 place-items-center rounded-full border border-line transition-colors group-hover:bg-forest-50">
                <ArrowRight size={16} aria-hidden="true" />
              </span>
              How career guidance works
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-end gap-x-10 gap-y-6 border-t border-line pt-8" data-hero-fade>
            <div>
              <p className="text-[2.75rem] leading-none font-bold tracking-tight">
                <CountUp to={stats.successRate} suffix="%" />
              </p>
              <p className="mt-2 text-sm text-muted">of our 2026 students joined a course they chose</p>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-line bg-white py-1.5 pr-4 pl-1.5">
              <div className="flex -space-x-2" aria-hidden="true">
                {['RS', 'GI', 'NR', 'AP'].map((who, i) => (
                  <span
                    key={who}
                    className="grid h-9 w-9 place-items-center rounded-full border-2 border-white text-xs font-bold text-white"
                    style={{ background: ['#2e5a4c', '#b88a3e', '#3a6c5c', '#24473c'][i] }}
                  >
                    {who}
                  </span>
                ))}
              </div>
              <p className="text-sm">
                <strong className="font-bold">{stats.studentsGuided.toLocaleString('en-IN')}+</strong>{' '}
                <span className="text-muted">students guided</span>
              </p>
            </div>
          </div>
        </div>

        <div className="relative pb-10 lg:pb-0">
          <div
            data-hero-photo
            className="relative ml-auto aspect-[4/5] w-full max-w-[34rem] overflow-hidden rounded-[var(--radius-photo)]"
          >
            <Photo
              id={photos.heroStudent}
              alt="A smiling student with a backpack on a green college campus"
              w={1000}
              h={1250}
              eager
              sizes="(min-width: 1024px) 34rem, 100vw"
              className="h-[110%] w-full"
            />
          </div>
          <div
            data-hero-chip
            className="absolute bottom-0 left-0 w-[46%] max-w-[15rem] overflow-hidden rounded-3xl border-[6px] border-white shadow-[var(--shadow-lift)] lg:-left-10"
          >
            <Photo
              id={photos.studentsBooks}
              alt="Two students studying together with books"
              w={480}
              h={360}
              className="aspect-[4/3] w-full"
            />
          </div>
          <div
            data-hero-chip
            className="absolute top-6 right-3 max-w-[15rem] rounded-2xl bg-white/95 p-3.5 shadow-[var(--shadow-soft)] backdrop-blur sm:right-6"
          >
            <p className="flex items-center gap-2 text-xs font-semibold text-forest-700">
              <span className="h-2 w-2 rounded-full bg-[#1f8f4e]" aria-hidden="true" /> Allotted in round 1
            </p>
            <p className="mt-1 text-sm font-bold">College of Engineering, Guindy</p>
            <p className="text-xs text-muted">TNEA · ECE · cutoff 198.5</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  // Two copies side by side so the loop is seamless; the copy is hidden from screen readers.
  const items = [...MARQUEE, ...MARQUEE];
  return (
    <section aria-label="What we help with" className="border-y border-line bg-cream py-4">
      <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <ul className="flex w-max animate-marquee text-[0.9375rem] font-semibold text-forest-800 hover:[animation-play-state:paused]">
          {items.map((item, index) => (
            <li
              key={`${item}-${index}`}
              aria-hidden={index >= MARQUEE.length ? 'true' : undefined}
              className="flex items-center gap-8 px-4 whitespace-nowrap"
            >
              <span>{item}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-forest-200" aria-hidden="true" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Story() {
  return (
    <section className="on-dark bg-forest-800 py-20 text-white sm:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-2 lg:gap-16">
        <AnimatedContent distance={50} className="order-2 lg:order-1">
          <div className="overflow-hidden rounded-[var(--radius-photo)]">
            <Photo
              id={photos.friendsCampus}
              alt="Three smiling students standing together outdoors"
              w={1000}
              h={1100}
              className="aspect-[10/11] w-full"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </div>
        </AnimatedContent>

        <div className="order-1 flex flex-col lg:order-2">
          <span className="eyebrow self-start">Since 2012</span>
          <ScrollReveal
            className="mt-5 text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.15] font-bold"
            highlightColor="#c9ded4"
          >
            The right choice at sixteen shapes a whole career. We help families make it with facts, not fear.
          </ScrollReveal>
          <p className="mt-6 max-w-lg leading-relaxed text-white/75">
            Arivu started in Anna Nagar as two counsellors and a whiteboard of cutoffs. Today our team of{' '}
            {stats.counsellors} guides students from Class 8 to college: which group to take, which course suits them,
            and how to get into the right college for medicine, engineering, law, design and more.
          </p>

          <AnimatedContent
            distance={40}
            delay={0.1}
            className="mt-10 grid gap-8 xl:grid-cols-[1fr_1.15fr] xl:items-end"
          >
            <div className="overflow-hidden rounded-3xl">
              <Photo
                id={photos.heritageCampus}
                alt="A heritage college building with red roofs"
                w={640}
                h={440}
                className="aspect-[16/11] w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                [stats.seatsSecured, '+', 'college seats secured for our students'],
                [stats.careerReports, '+', 'career reports for Class 8–12 students'],
              ].map(([value, suffix, label]) => (
                <div key={label} className="border-t border-white/20 pt-4">
                  <p className="text-[clamp(2rem,3.4vw,2.6rem)] leading-none font-bold">
                    <CountUp to={value} suffix={suffix} />
                  </p>
                  <p className="mt-2 text-sm text-white/70">{label}</p>
                </div>
              ))}
            </div>
          </AnimatedContent>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="bg-cream py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="What we help with"
          title="One team, from choosing a course"
          accent="to joining a college"
          text="Start with career guidance, or come to us with marks in hand. Either way you get one counsellor who knows every route."
        />
        <AnimatedContent stagger={0.1} className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((item) => {
            const Icon = SERVICE_ICONS[item.icon];
            return (
              <SpotlightCard
                key={item.id}
                spotlightColor="#3a6c5c"
                intensity={0.1}
                className={`flex flex-col rounded-[var(--radius-card)] bg-white p-6 text-center ${item.featured ? 'ring-2 ring-forest-700' : ''}`}
              >
                <span
                  className="mx-auto grid h-18 w-18 place-items-center rounded-full bg-forest-50 text-forest-700"
                  aria-hidden="true"
                >
                  <Icon size={34} strokeWidth={1.4} />
                </span>
                <h3 className="mt-5 text-lg font-bold">{item.title}</h3>
                <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-muted">{item.text}</p>
                <p className="mt-4 text-sm font-semibold text-forest-800">{item.meta}</p>
                <Link to={item.to} className={`btn mt-5 w-full ${item.featured ? 'btn-primary' : 'btn-soft'}`}>
                  Read more <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </SpotlightCard>
            );
          })}
        </AnimatedContent>
        <p className="mx-auto mt-10 max-w-3xl text-center text-sm leading-relaxed text-muted">
          Also: {otherCourses.join(' · ')}
        </p>
      </div>
    </section>
  );
}

function CareerGuidance() {
  const { openLead } = useLead();
  return (
    <section className="py-20 sm:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16">
        <AnimatedContent distance={40} className="relative">
          <div className="overflow-hidden rounded-[var(--radius-photo)]">
            <Photo
              id={photos.studyGroup}
              alt="Students working through options together at a table"
              w={1000}
              h={1100}
              className="aspect-[10/11] w-full"
            />
          </div>
          <div className="absolute right-4 bottom-4 left-4 rounded-2xl bg-white/95 p-4 shadow-[var(--shadow-soft)] backdrop-blur sm:right-auto sm:max-w-xs">
            <p className="text-xs font-semibold tracking-wide text-forest-700 uppercase">Career report · sample</p>
            <ol className="mt-2 space-y-1.5 text-sm">
              {['Architecture (B.Arch)', 'Product design (B.Des)', 'Civil engineering'].map((career, i) => (
                <li key={career} className="flex items-center gap-2">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-forest-800 text-[0.65rem] font-bold text-white">
                    {i + 1}
                  </span>
                  {career}
                </li>
              ))}
            </ol>
          </div>
        </AnimatedContent>

        <div>
          <SectionHeading
            align="left"
            eyebrow="Career guidance"
            title="Not sure what to study?"
            accent="Start here."
            text="An aptitude and interest assessment, a one-to-one session with the student and parents, and a written plan: three best-fit careers, the courses behind them and the exams to take."
          />
          <AnimatedContent stagger={0.08} as="ul" className="mt-8 space-y-3">
            {stages.map((stage) => (
              <li key={stage.id} className="card flex gap-4 p-4">
                <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-forest-600" aria-hidden="true" />
                <span>
                  <span className="block font-bold">{stage.title}</span>
                  <span className="block text-muted">{stage.question}</span>
                </span>
              </li>
            ))}
          </AnimatedContent>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={() => openLead({ source: 'career', interest: 'career_guidance' })}>
              Book a career session
            </Button>
            <ButtonLink to="/career-guidance" variant="soft">
              See how it works
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedColleges() {
  const { data, error, loading, reload } = useAsync(listColleges, []);
  // Partner colleges first, alternating medical and engineering.
  const partners = (data ?? []).filter((c) => c.is_partner);
  const byStream = (stream) => partners.filter((c) => c.stream === stream);
  const medical = byStream('medical');
  const engineering = byStream('engineering');
  const featured = [medical[0], engineering[0], medical[1], engineering[1]].filter(Boolean);

  return (
    <section className="bg-forest-50 py-20 sm:py-28">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            align="left"
            eyebrow="Colleges & fees"
            title="Medical and engineering colleges,"
            accent="fees for every quota"
            text="2026-27 fees, seats and cutoffs for every quota. Partner colleges are marked, so you always know when we have a tie-up."
          />
          <ButtonLink to="/colleges" variant="soft">
            Browse all colleges
          </ButtonLink>
        </div>
        <div className="mt-12">
          {loading ? (
            <LoadingBlock label="Loading colleges…" />
          ) : error ? (
            <ErrorBlock message="We couldn’t load the colleges." onRetry={reload} />
          ) : (
            <AnimatedContent stagger={0.08} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((college) => (
                <CollegeCard key={college.id} college={college} />
              ))}
            </AnimatedContent>
          )}
        </div>
      </div>
    </section>
  );
}

function Process() {
  const scope = useRef(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          '[data-line-fill]',
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: { trigger: '[data-steps]', start: 'top 70%', end: 'bottom 60%', scrub: true },
          }
        );
        gsap.utils.toArray('[data-step]').forEach((step) => {
          gsap.from(step, {
            opacity: 0.25,
            x: 16,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: { trigger: step, start: 'top 75%', toggleActions: 'play none none reverse' },
          });
        });
      });
      return () => mm.revert();
    },
    { scope }
  );

  return (
    <section ref={scope} className="py-20 sm:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            align="left"
            eyebrow="How admission works"
            title="From results to"
            accent="your first class"
            text="Every course, from MBBS to B.Tech to law, follows the same five steps over about four months. Most seats are lost to small mistakes in steps 2 and 3. That’s where we spend the most time with you."
          />
          <div className="mt-8 hidden flex-wrap gap-3 lg:flex">
            <ButtonLink to="/medical">Medical guide</ButtonLink>
            <ButtonLink to="/engineering" variant="soft">
              Engineering guide
            </ButtonLink>
          </div>
        </div>
        <ol data-steps className="relative">
          <span className="absolute top-3 bottom-3 left-[1.375rem] w-0.5 bg-forest-200" aria-hidden="true" />
          <span
            data-line-fill
            className="absolute top-3 bottom-3 left-[1.375rem] w-0.5 origin-top bg-forest-700"
            aria-hidden="true"
          />
          {steps.map((step, index) => (
            <li key={step.title} data-step className="relative flex gap-6 pb-10 last:pb-0">
              <span className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full border-4 border-white bg-forest-800 text-sm font-bold text-white">
                {index + 1}
              </span>
              <div className="card flex-1 p-6">
                <span className="badge bg-forest-100 text-forest-900">{step.when}</span>
                <h3 className="mt-3 text-lg font-bold">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const FEE_TABLES = {
  medical: {
    label: 'Medical (MBBS)',
    note: '*Tuition and hostel for 4.5 years, plus one-time fees.',
    rows: [
      {
        route: 'Government college (Tamil Nadu)',
        who: 'High NEET scores, state merit list',
        year: '₹18,000',
        total: '≈ ₹1.5 L',
      },
      { route: 'AIIMS / JIPMER', who: 'Top all-India ranks, MCC', year: '₹1,350', total: '≈ ₹20,000' },
      {
        route: 'Govt quota in a TN private college',
        who: 'State merit, just below govt cutoff',
        year: '₹4.35 L',
        total: '≈ ₹29 L',
      },
      {
        route: 'Management quota (TN private)',
        who: 'Lower scores, separate merit list',
        year: '₹15 L',
        total: '≈ ₹78 L',
      },
      { route: 'Deemed university', who: 'MCC deemed rounds, all-India', year: '₹22 – 30 L', total: '≈ ₹1.1 – 1.5 Cr' },
    ],
  },
  engineering: {
    label: 'Engineering (B.E. / B.Tech)',
    note: '*Tuition and hostel for 4 years, plus one-time fees.',
    rows: [
      {
        route: 'Government college (TNEA)',
        who: 'High Class 12 cutoff (out of 200)',
        year: '₹15,000 – 25,000',
        total: '≈ ₹2.8 L',
      },
      { route: 'Aided college (TNEA)', who: 'Good cutoff, aided seats', year: '₹55,000', total: '≈ ₹4.7 L' },
      {
        route: 'Govt quota in a TN private college',
        who: 'TNEA merit, fee fixed by the state',
        year: '₹85,000',
        total: '≈ ₹7 L',
      },
      { route: 'IIT / NIT (JoSAA)', who: 'JEE Advanced / JEE Main ranks', year: '₹1.25 – 2 L', total: '≈ ₹7 – 10 L' },
      {
        route: 'Deemed university (VIT, SRM, SASTRA)',
        who: 'University’s own exam',
        year: '₹1.65 – 4 L',
        total: '≈ ₹11 – 21 L',
      },
      {
        route: 'Management quota (TN private)',
        who: 'Any pass mark, direct with college',
        year: '₹2.25 – 3 L',
        total: '≈ ₹13 – 16 L',
      },
    ],
  },
};

function FeeReality() {
  const [tab, setTab] = useState('medical');
  const table = FEE_TABLES[tab];
  return (
    <section className="bg-cream py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="2026-27 fees"
          title="What a degree"
          accent="really costs"
          text="The same college can cost very different amounts depending on the quota. Here is the full picture, before anyone asks you for money."
        />
        <div
          className="mx-auto mt-10 flex w-max max-w-full rounded-full border border-line bg-white p-1"
          role="tablist"
          aria-label="Course"
        >
          {Object.entries(FEE_TABLES).map(([key, value]) => (
            <button
              key={key}
              type="button"
              role="tab"
              id={`fee-tab-${key}`}
              aria-selected={tab === key}
              aria-controls="fee-panel"
              onClick={() => setTab(key)}
              className={`rounded-full px-4 py-2 text-sm font-semibold sm:px-5 ${tab === key ? 'bg-forest-800 text-white' : 'text-muted hover:text-forest-900'}`}
            >
              {value.label}
            </button>
          ))}
        </div>
        <div id="fee-panel" role="tabpanel" aria-labelledby={`fee-tab-${tab}`} className="mx-auto mt-8 max-w-5xl">
          <div className="table-wrap">
            <table className="data-table">
              <caption className="sr-only">Typical {table.label} fees by route, 2026-27</caption>
              <thead>
                <tr>
                  <th scope="col">Route</th>
                  <th scope="col">Who it suits</th>
                  <th scope="col" className="num">
                    Tuition a year
                  </th>
                  <th scope="col" className="num">
                    Whole course*
                  </th>
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row) => (
                  <tr key={row.route}>
                    <th scope="row" className="font-semibold">
                      {row.route}
                    </th>
                    <td className="text-muted">{row.who}</td>
                    <td className="num font-semibold">{row.year}</td>
                    <td className="num text-muted">{row.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted">
            {table.note} Sample figures from 2026 notices: each college page shows its own fees and when they were last
            checked.
          </p>
        </div>
      </div>
    </section>
  );
}

function EventBanner() {
  const { openLead } = useLead();
  return (
    <section className="container-page pt-20 sm:pt-28">
      <div className="relative overflow-hidden rounded-[var(--radius-photo)]">
        <Photo id={photos.seminar} alt="" w={1600} h={760} className="absolute inset-0 h-full w-full" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/70 to-transparent" aria-hidden="true" />
        <div className="relative p-4 sm:p-8 lg:p-12">
          <AnimatedContent
            direction="horizontal"
            distance={40}
            className="on-dark max-w-md rounded-3xl bg-forest-800/95 p-7 text-white backdrop-blur sm:p-9"
          >
            <span className="eyebrow">Free event</span>
            <h2 className="mt-4 text-[clamp(1.6rem,3vw,2.3rem)] leading-tight font-bold">{event.title}</h2>
            <p className="mt-3 text-white/75">{event.text}</p>
            <ul className="mt-6 space-y-3 text-white/85">
              <li className="flex gap-3">
                <CalendarDays size={18} className="mt-0.5 shrink-0 text-forest-200" aria-hidden="true" />
                {event.date}
              </li>
              <li className="flex gap-3">
                <Clock size={18} className="mt-0.5 shrink-0 text-forest-200" aria-hidden="true" />
                {event.time}
              </li>
              <li className="flex gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-forest-200" aria-hidden="true" />
                {event.venue}
              </li>
            </ul>
            <Button variant="light" className="mt-8" onClick={() => openLead({ source: 'seminar' })}>
              Reserve a free seat
            </Button>
          </AnimatedContent>
        </div>
      </div>
    </section>
  );
}

function Stars() {
  return (
    <span className="flex gap-0.5 text-gold" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={14} fill="currentColor" strokeWidth={0} aria-hidden="true" />
      ))}
    </span>
  );
}

function TestimonialCard({ item, large = false }) {
  return (
    <figure
      className={`card flex h-full flex-col p-6 ${large ? 'sm:p-8' : ''} ${item.featured ? 'border-t-4 border-t-forest-700' : ''}`}
    >
      <Stars />
      <p className="mt-3 font-bold">{item.title}</p>
      <blockquote
        className={`mt-2 flex-1 leading-relaxed text-muted ${large ? 'text-[1.0625rem]' : 'text-[0.9375rem]'}`}
      >
        “{item.quote}”
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-4">
        <span
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-forest-100 text-sm font-bold text-forest-800"
          aria-hidden="true"
        >
          {initials(item.name)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block leading-tight font-semibold">{item.name}</span>
          <span className="mt-0.5 block text-xs leading-snug text-muted">{item.detail}</span>
        </span>
      </figcaption>
    </figure>
  );
}

function Testimonials() {
  const [first, second, ...rest] = testimonials;
  return (
    <section className="py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading eyebrow="Families we’ve guided" title="Voices from" accent="our students" after="and parents" />
        <AnimatedContent stagger={0.08} className="mt-12 grid gap-5 md:grid-cols-2">
          <TestimonialCard item={first} large />
          <TestimonialCard item={second} large />
        </AnimatedContent>
        <AnimatedContent stagger={0.08} className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {rest.map((item) => (
            <TestimonialCard key={item.name} item={item} />
          ))}
        </AnimatedContent>
      </div>
    </section>
  );
}

const UPDATE_LINKS = {
  Medical: '/medical',
  Engineering: '/engineering',
  Abroad: '/study-abroad',
  Career: '/career-guidance',
};

function Updates() {
  return (
    <section className="on-dark bg-forest-800 py-20 text-white sm:py-24">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="eyebrow">Updates</span>
            <h2 className="mt-4 text-[clamp(1.75rem,3.6vw,2.6rem)] leading-tight font-bold">
              What’s happening in <span className="accent">admissions</span>
            </h2>
          </div>
          <ButtonLink to="/career-guidance" variant="outline-light">
            Career guidance
          </ButtonLink>
        </div>
        <AnimatedContent stagger={0.07} as="ul" className="mt-10 space-y-3">
          {updates.map((item, index) => (
            <li key={item.title}>
              <Link
                to={UPDATE_LINKS[item.tag] ?? '/'}
                className={`group flex flex-col gap-3 rounded-2xl border px-5 py-4 transition-colors sm:flex-row sm:items-center sm:gap-6 ${
                  index === 0
                    ? 'border-white bg-white text-forest-900'
                    : 'border-white/15 bg-white/[0.04] hover:border-white/30 hover:bg-white/[0.08]'
                }`}
              >
                <span
                  className={`badge shrink-0 ${index === 0 ? 'bg-forest-100 text-forest-900' : 'bg-white/10 text-white'}`}
                >
                  {dateLabel(item.date)}
                </span>
                <span className="flex-1 font-semibold">{item.title}</span>
                <span
                  className={`text-xs font-semibold tracking-wide uppercase ${index === 0 ? 'text-forest-700' : 'text-forest-200'}`}
                >
                  {item.tag}
                </span>
                <span
                  className={`hidden h-9 w-9 shrink-0 place-items-center rounded-full transition-transform group-hover:rotate-45 sm:grid ${
                    index === 0 ? 'bg-forest-800 text-white' : 'bg-white/10'
                  }`}
                  aria-hidden="true"
                >
                  <ArrowUpRight size={16} />
                </span>
              </Link>
            </li>
          ))}
        </AnimatedContent>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading eyebrow="FAQ" title="Questions parents ask us" accent="first" />
        <div className="mt-12 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          <AnimatedContent className="hidden overflow-hidden rounded-[var(--radius-photo)] lg:block">
            <Photo
              id={photos.domeCampus}
              alt="A domed college building framed by trees"
              w={900}
              h={1000}
              className="h-full min-h-[26rem] w-full"
            />
          </AnimatedContent>
          <Accordion items={faqs} />
        </div>
      </div>
    </section>
  );
}
