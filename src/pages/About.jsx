import { HeartHandshake, Scale, ShieldCheck } from 'lucide-react';
import AnimatedContent from '../components/bits/AnimatedContent.jsx';
import ScrollReveal from '../components/bits/ScrollReveal.jsx';
import CountUp from '../components/CountUp.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { ButtonLink, Photo } from '../components/ui.jsx';
import { team } from '../data/content.js';
import { photos, site, stats } from '../data/site.js';
import { initials } from '../lib/format.js';
import { useTitle } from '../lib/useAsync.js';

const PROMISES = [
  {
    icon: ShieldCheck,
    title: 'No seat-selling',
    text: 'We never offer "direct admission" or donation seats. Every seat comes through official counselling.',
  },
  {
    icon: Scale,
    title: 'Partners marked clearly',
    text: 'When we have a tie-up with a college, the site says so. We compare it fairly against every other option.',
  },
  {
    icon: HeartHandshake,
    title: 'Fees in writing',
    text: 'Our own service fee, and every college fee, is shown to you in writing before you decide anything.',
  },
];

export default function About() {
  useTitle('About us');
  return (
    <>
      <PageHeader
        crumbs={[['About']]}
        eyebrow={`Since ${site.since}`}
        title="Counsellors who have sat through"
        accent="every round"
        text={`${site.name} is a Chennai-based career guidance and admissions team with branches in ${site.branches.join(', ')}. We help families choose well, not just choose fast.`}
      />

      <section className="pb-16">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="overflow-hidden rounded-[var(--radius-photo)]">
            <Photo
              id={photos.studyGroup}
              alt="Students working through counselling forms at a table"
              w={1100}
              h={800}
              className="aspect-[11/8] w-full"
            />
          </div>
          <div>
            <ScrollReveal className="text-[clamp(1.5rem,3vw,2.2rem)] leading-snug font-bold" highlightColor="#3a6c5c">
              Some families come to us in Class 9 wondering which group to pick; others come with results in hand,
              worried they have missed something. Our job is to replace that worry with a plan.
            </ScrollReveal>
            <dl className="mt-10 grid grid-cols-3 gap-6">
              {[
                [stats.studentsGuided, '+', 'students guided'],
                [stats.seatsSecured, '+', 'college seats secured'],
                [stats.counsellors, '', 'counsellors'],
              ].map(([n, suffix, label]) => (
                <div key={label}>
                  <dd className="text-3xl font-bold text-forest-800">
                    <CountUp to={n} suffix={suffix} />
                  </dd>
                  <dt className="mt-1 text-sm text-muted">{label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="on-dark bg-forest-800 py-16 text-white sm:py-20">
        <div className="container-page">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Three promises we <span className="accent">put in writing</span>
          </h2>
          <AnimatedContent stagger={0.1} className="mt-10 grid gap-5 md:grid-cols-3">
            {PROMISES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-[var(--radius-card)] border border-white/15 bg-white/[0.05] p-7">
                <Icon size={30} strokeWidth={1.5} className="text-forest-200" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-bold">{title}</h3>
                <p className="mt-2 leading-relaxed text-white/75">{text}</p>
              </div>
            ))}
          </AnimatedContent>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-page">
          <h2 className="text-2xl font-bold sm:text-3xl">
            The <span className="accent">team</span>
          </h2>
          <AnimatedContent stagger={0.08} className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((person) => (
              <div key={person.name} className="card p-6">
                <span
                  className="grid h-16 w-16 place-items-center rounded-2xl bg-forest-100 text-lg font-bold text-forest-800"
                  aria-hidden="true"
                >
                  {initials(person.name)}
                </span>
                <h3 className="mt-4 font-bold">{person.name}</h3>
                <p className="text-sm text-muted">{person.role}</p>
                <p className="mt-3 text-sm font-semibold text-forest-700">{person.years} years in counselling</p>
              </div>
            ))}
          </AnimatedContent>
          <div className="mt-10">
            <ButtonLink to="/contact">Meet us in Anna Nagar</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
