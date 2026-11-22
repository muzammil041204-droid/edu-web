import { CheckCircle2, ExternalLink } from 'lucide-react';
import AnimatedContent from '../components/bits/AnimatedContent.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { Button, ButtonLink } from '../components/ui.jsx';
import { medicalDates, medicalDocuments, updates } from '../data/content.js';
import { CATEGORY_HELP, TN_CATEGORIES } from '../data/cutoffs.js';
import { dateLabel } from '../lib/format.js';
import { useLead } from '../lib/leadContext.jsx';
import { useTitle } from '../lib/useAsync.js';

const SEAT_SPLIT = [
  {
    title: 'MCC counselling',
    share: '15% + central',
    points: [
      '15% all-India quota seats in every government college',
      'AIIMS, JIPMER, ESIC and central universities',
      'All deemed universities (no state domicile needed)',
      'Rounds 1, 2, 3, then stray-vacancy rounds',
    ],
    link: ['mcc.nic.in', 'https://mcc.nic.in'],
  },
  {
    title: 'State counselling',
    share: '85% of state seats',
    points: [
      'Government colleges in your home state',
      'Government-quota seats in private colleges',
      'Management and NRI seats in private colleges',
      'Needs nativity / domicile of that state',
    ],
    link: ['tnmedicalselection.net', 'https://tnmedicalselection.net'],
  },
];

const TN_QUOTAS = [
  [
    'Government quota',
    'Government colleges and about 65% of seats in self-financing colleges. Merit list by community, at state-fixed fees.',
  ],
  [
    '7.5% government-school preference',
    'Reserved within government-quota seats for students who studied Class 6 to 12 in Tamil Nadu government schools.',
  ],
  [
    'Management quota',
    'Seats in self-financing colleges allotted by the Selection Committee on a separate merit list, at higher fees.',
  ],
  ['NRI quota', 'For NRI or NRI-sponsored students, with the highest fees, also through the Selection Committee.'],
];

export default function Medical() {
  useTitle('Medical admissions (NEET): MBBS in Tamil Nadu and India');
  const { openLead } = useLead();
  return (
    <>
      <PageHeader
        crumbs={[['Medical admissions']]}
        eyebrow="Medical · NEET 2027"
        title="How medical admission works"
        accent="in India"
        text="NEET decides who qualifies. Counselling decides which college you get. Here is the whole system in plain words, with the Tamil Nadu rules that most families miss."
      />

      <section className="pb-16">
        <div className="container-page">
          <h2 className="text-2xl font-bold sm:text-3xl">Two counselling systems</h2>
          <p className="mt-3 max-w-2xl text-muted">
            You can, and usually should, register for both. A seat in one can be upgraded in the other.
          </p>
          <AnimatedContent stagger={0.1} className="mt-8 grid gap-5 md:grid-cols-2">
            {SEAT_SPLIT.map((item) => (
              <article key={item.title} className="card flex flex-col p-7">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <span className="badge bg-forest-100 text-forest-900">{item.share}</span>
                </div>
                <ul className="mt-5 flex-1 space-y-3">
                  {item.points.map((point) => (
                    <li key={point} className="flex gap-3 text-muted">
                      <CheckCircle2 size={19} className="mt-0.5 shrink-0 text-forest-600" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
                <a
                  href={item.link[1]}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-1.5 font-semibold text-forest-700 hover:underline"
                >
                  {item.link[0]} <ExternalLink size={15} aria-hidden="true" />
                </a>
              </article>
            ))}
          </AnimatedContent>
        </div>
      </section>

      <section id="tamil-nadu" className="scroll-mt-28 bg-cream py-16 sm:py-20">
        <div className="container-page">
          <span className="eyebrow">Tamil Nadu</span>
          <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
            Tamil Nadu: quotas and <span className="accent">categories</span>
          </h2>
          <p className="mt-3 max-w-3xl text-muted">
            The Selection Committee, Directorate of Medical Education, fills the state’s seats in one merit-based
            process. Your community certificate decides which merit list you are counted in.
          </p>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="text-lg font-bold">Seat types</h3>
              <dl className="mt-4 space-y-3">
                {TN_QUOTAS.map(([term, text]) => (
                  <div key={term} className="card p-5">
                    <dt className="font-semibold">{term}</dt>
                    <dd className="mt-1.5 text-sm leading-relaxed text-muted">{text}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <h3 className="text-lg font-bold">Community categories</h3>
              <div className="table-wrap mt-4">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th scope="col">Category</th>
                      <th scope="col">Stands for</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TN_CATEGORIES.map((cat) => (
                      <tr key={cat}>
                        <th scope="row" className="font-semibold">
                          {cat}
                        </th>
                        <td className="whitespace-normal text-muted">{CATEGORY_HELP[cat]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-sm text-muted">
                Check the exact reservation percentages in the current year’s prospectus.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold">Documents to keep ready</h2>
            <p className="mt-2 text-muted">Most rejections happen here. We check each one before upload.</p>
            <ul className="mt-6 space-y-3">
              {medicalDocuments.map((doc) => (
                <li key={doc} className="flex gap-3">
                  <CheckCircle2 size={19} className="mt-0.5 shrink-0 text-forest-600" aria-hidden="true" />
                  {doc}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Key dates for 2027</h2>
            <p className="mt-2 text-muted">
              Expected, based on past years. We WhatsApp you the official dates as they are announced.
            </p>
            <ol className="mt-6 divide-y divide-line rounded-2xl border border-line">
              {medicalDates.map((item) => (
                <li key={item.label} className="flex flex-wrap justify-between gap-2 px-5 py-4">
                  <span className="font-semibold">{item.label}</span>
                  <span className="text-muted">{item.when}</span>
                </li>
              ))}
            </ol>
            <Button className="mt-6" onClick={() => openLead({ source: 'hero' })}>
              Get date alerts on WhatsApp
            </Button>
          </div>
        </div>
      </section>

      <section id="updates" className="bg-forest-50 py-16 sm:py-20">
        <div className="container-page">
          <h2 className="text-2xl font-bold sm:text-3xl">Latest counselling updates</h2>
          <ul className="mt-8 space-y-3">
            {updates
              .filter((u) => u.tag === 'Medical' || u.tag === 'Abroad')
              .map((item) => (
                <li
                  key={item.title}
                  className="card flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:gap-6"
                >
                  <span className="badge shrink-0 bg-forest-100 text-forest-900">{dateLabel(item.date)}</span>
                  <span className="flex-1 font-semibold">{item.title}</span>
                  <span className="text-xs font-semibold tracking-wide text-forest-700 uppercase">{item.tag}</span>
                </li>
              ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink to="/colleges?stream=medical">Compare medical colleges</ButtonLink>
            <ButtonLink to="/study-abroad" variant="soft">
              Study abroad guide
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
