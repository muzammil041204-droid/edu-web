import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Languages,
  ThermometerSnowflake,
  Wallet,
} from 'lucide-react';
import AnimatedContent from '../components/bits/AnimatedContent.jsx';
import SpotlightCard from '../components/bits/SpotlightCard.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { Button, Photo } from '../components/ui.jsx';
import { abroadChecklist, countries, nmcRules } from '../data/abroad.js';
import { useLead } from '../lib/leadContext.jsx';
import { useTitle } from '../lib/useAsync.js';

const DEGREES_ABROAD = [
  {
    country: 'Germany',
    text: 'Public universities charge little or no tuition. Most bachelor’s courses are in German, so a year of language study usually comes first; many master’s courses are in English.',
    good: 'Engineering, sciences',
  },
  {
    country: 'Canada',
    text: 'Colleges and universities with paid co-op work terms built into the course, and a clear route to work after graduating.',
    good: 'Computing, business, health sciences',
  },
  {
    country: 'UK & Ireland',
    text: 'Three-year bachelor’s and one-year master’s degrees, with two years of post-study work in the UK.',
    good: 'Business, law, data science',
  },
];

export default function StudyAbroad() {
  useTitle('Study abroad: MBBS abroad and degrees abroad');
  const { openLead } = useLead();
  const ask = () => openLead({ source: 'abroad', interest: 'study_abroad' });
  return (
    <>
      <PageHeader
        crumbs={[['Study abroad']]}
        eyebrow="NMC-compliant MBBS · degrees abroad"
        title="Study abroad,"
        accent="done properly"
        text="Most of our abroad students go for MBBS, which only helps if you can practise in India afterwards, so we only suggest universities that meet the National Medical Commission’s rules. We also guide students to engineering, business and science degrees in Germany, Canada and the UK."
      >
        <Button className="mt-8" onClick={ask}>
          Get the country guide
        </Button>
      </PageHeader>

      <section className="pb-16">
        <div className="container-page">
          <h2 className="text-2xl font-bold sm:text-3xl">
            MBBS abroad: the NMC rules, <span className="accent">in plain words</span>
          </h2>
          <AnimatedContent stagger={0.07} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {nmcRules.map((rule, i) => (
              <SpotlightCard
                key={rule.title}
                spotlightColor="#3a6c5c"
                intensity={0.1}
                className="rounded-[var(--radius-card)] bg-white p-6"
              >
                <span className="text-sm font-bold text-forest-600">0{i + 1}</span>
                <h3 className="mt-2 text-lg font-bold">{rule.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{rule.text}</p>
              </SpotlightCard>
            ))}
          </AnimatedContent>
          <p className="mt-5 flex gap-2 text-sm text-muted">
            <ExternalLink size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
            Always check the latest notices on{' '}
            <a
              href="https://www.nmc.org.in"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-forest-700 underline"
            >
              nmc.org.in
            </a>
            .
          </p>
        </div>
      </section>

      <section className="bg-cream py-16 sm:py-20">
        <div className="container-page">
          <h2 className="text-2xl font-bold sm:text-3xl">MBBS abroad: countries we work with</h2>
          <p className="mt-3 max-w-2xl text-muted">
            Total cost for the full course (tuition and hostel), from 2026 figures. Each university differs; we give you
            a written breakup.
          </p>
          <AnimatedContent stagger={0.1} className="mt-10 grid gap-6 md:grid-cols-2">
            {countries.map((country) => (
              <article key={country.slug} className="card overflow-hidden">
                <div className="relative aspect-[16/8]">
                  <Photo
                    id={country.image}
                    alt={`City view in ${country.name}`}
                    w={900}
                    h={450}
                    className="h-full w-full"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-forest-950/70 to-transparent"
                    aria-hidden="true"
                  />
                  <h3 className="absolute bottom-4 left-5 text-2xl font-bold text-white">{country.name}</h3>
                </div>
                <div className="p-6">
                  <p className="text-muted">{country.note}</p>
                  <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <Fact
                      icon={Wallet}
                      label="Full course"
                      value={`₹${country.costLakh[0]}–${country.costLakh[1]} L`}
                    />
                    <Fact icon={GraduationCap} label="Duration" value={country.duration} />
                    <Fact icon={Languages} label="Teaching" value={country.medium} />
                    <Fact icon={ThermometerSnowflake} label="Climate" value={country.climate} />
                  </dl>
                  <h4 className="mt-5 text-sm font-bold">Universities our students attend</h4>
                  <ul className="mt-2 space-y-1 text-sm text-muted">
                    {country.universities.map((u) => (
                      <li key={u}>· {u}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </AnimatedContent>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Before you pay any university</h2>
            <ul className="mt-6 space-y-3">
              {abroadChecklist.map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckCircle2 size={19} className="mt-0.5 shrink-0 text-forest-600" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[var(--radius-card)] border border-[#ead7b0] bg-gold-soft p-7">
            <AlertTriangle className="text-gold" aria-hidden="true" />
            <h2 className="mt-3 text-xl font-bold">An honest word on FMGE</h2>
            <p className="mt-3 leading-relaxed text-[#5b4a2c]">
              Every foreign graduate must pass FMGE (or NExT, once it starts) to practise in India, and pass rates have
              historically been low. Choosing a university with good results, and preparing from the first year, matters
              more than saving a few lakhs.
            </p>
            <Button variant="primary" className="mt-6" onClick={ask}>
              Talk to our abroad counsellor
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-forest-50 py-16 sm:py-20">
        <div className="container-page">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Beyond MBBS: <span className="accent">degrees abroad</span>
          </h2>
          <p className="mt-3 max-w-2xl text-muted">
            For engineering, business and science, most students go abroad for a master’s after an Indian degree. Some
            go straight after Class 12. We help with the choice, applications and visa.
          </p>
          <AnimatedContent stagger={0.1} className="mt-8 grid gap-5 md:grid-cols-3">
            {DEGREES_ABROAD.map((item) => (
              <article key={item.country} className="card flex flex-col p-6">
                <h3 className="text-xl font-bold">{item.country}</h3>
                <p className="mt-3 flex-1 leading-relaxed text-muted">{item.text}</p>
                <p className="mt-4 border-t border-line pt-3 text-sm">
                  <span className="font-semibold text-forest-800">Popular for:</span> {item.good}
                </p>
              </article>
            ))}
          </AnimatedContent>
        </div>
      </section>
    </>
  );
}

function Fact({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl bg-forest-50 px-3 py-2.5">
      <dt className="flex items-center gap-1.5 text-xs text-muted">
        <Icon size={14} aria-hidden="true" /> {label}
      </dt>
      <dd className="mt-0.5 font-semibold">{value}</dd>
    </div>
  );
}
