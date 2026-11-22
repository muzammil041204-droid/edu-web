import { Calculator, CheckCircle2, ExternalLink } from 'lucide-react';
import { useId, useState } from 'react';
import AnimatedContent from '../components/bits/AnimatedContent.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { Button, ButtonLink } from '../components/ui.jsx';
import { engineeringDates, engineeringDocuments, updates } from '../data/content.js';
import { CATEGORY_HELP, TN_CATEGORIES } from '../data/cutoffs.js';
import { dateLabel } from '../lib/format.js';
import { useLead } from '../lib/leadContext.jsx';
import { useTitle } from '../lib/useAsync.js';

const ROUTES = [
  {
    title: 'JoSAA (JEE)',
    tag: 'IITs · NITs · IIITs',
    points: [
      'JEE Main for NITs, IIITs and other central institutes',
      'JEE Advanced (top 2.5 lakh of JEE Main) for IITs',
      'Up to 6 rounds, with float, slide and freeze options',
      'NITs keep 50% of seats for home-state students',
    ],
    link: ['josaa.nic.in', 'https://josaa.nic.in'],
  },
  {
    title: 'TNEA (Tamil Nadu)',
    tag: '400+ colleges in the state',
    points: [
      'No entrance exam: ranked on Class 12 marks',
      'Cutoff = Maths + (Physics + Chemistry) ÷ 2, out of 200',
      'Online single-window counselling in rounds, by community',
      '7.5% of seats for government-school students',
    ],
    link: ['tneaonline.org', 'https://www.tneaonline.org'],
  },
  {
    title: 'University exams',
    tag: 'Deemed universities',
    points: [
      'VITEEE (VIT), SRMJEEE (SRM), BITSAT (BITS)',
      'SASTRA admits on Class 12 marks and JEE Main',
      'Fees often depend on your rank in their exam',
      'Applications open from November, well before TNEA',
    ],
    link: null,
  },
];

export default function Engineering() {
  useTitle('Engineering admissions: JEE, JoSAA and TNEA');
  const { openLead } = useLead();
  const ask = () => openLead({ source: 'hero', interest: 'engineering' });
  return (
    <>
      <PageHeader
        crumbs={[['Engineering admissions']]}
        eyebrow="Engineering · JEE & TNEA 2027"
        title="Engineering admission,"
        accent="without the guesswork"
        text="JEE for IITs and NITs, TNEA for Tamil Nadu’s colleges, and each deemed university’s own exam. Here is how they fit together, and how to use all three."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={ask}>Talk to an engineering counsellor</Button>
          <ButtonLink href="#cutoff" variant="soft" icon={false}>
            Work out your TNEA cutoff
          </ButtonLink>
        </div>
      </PageHeader>

      <section className="pb-16">
        <div className="container-page">
          <h2 className="text-2xl font-bold sm:text-3xl">Three ways in</h2>
          <p className="mt-3 max-w-2xl text-muted">
            Most students should apply to more than one. A TNEA seat is a safety net while JoSAA rounds run.
          </p>
          <AnimatedContent stagger={0.1} className="mt-8 grid gap-5 md:grid-cols-3">
            {ROUTES.map((route) => (
              <article key={route.title} className="card flex flex-col p-7">
                <span className="badge self-start bg-forest-100 text-forest-900">{route.tag}</span>
                <h3 className="mt-4 text-xl font-bold">{route.title}</h3>
                <ul className="mt-5 flex-1 space-y-3">
                  {route.points.map((point) => (
                    <li key={point} className="flex gap-3 text-muted">
                      <CheckCircle2 size={19} className="mt-0.5 shrink-0 text-forest-600" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
                {route.link ? (
                  <a
                    href={route.link[1]}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center gap-1.5 font-semibold text-forest-700 hover:underline"
                  >
                    {route.link[0]} <ExternalLink size={15} aria-hidden="true" />
                  </a>
                ) : null}
              </article>
            ))}
          </AnimatedContent>
        </div>
      </section>

      <section id="cutoff" className="scroll-mt-28 bg-cream py-16 sm:py-20">
        <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div>
            <span className="eyebrow">TNEA</span>
            <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
              Work out your <span className="accent">cutoff</span>
            </h2>
            <p className="mt-3 text-muted">
              TNEA ranks students on a cutoff out of 200: the Maths mark plus half of Physics and Chemistry together.
              Ties are broken by Maths, then Physics, then date of birth.
            </p>
            <h3 className="mt-8 text-lg font-bold">Community categories</h3>
            <div className="table-wrap mt-3">
              <table className="data-table">
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
          </div>
          <CutoffCalculator />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold">Documents to keep ready</h2>
            <p className="mt-2 text-muted">Certificates decide fee waivers too, so get them early.</p>
            <ul className="mt-6 space-y-3">
              {engineeringDocuments.map((doc) => (
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
              Expected, based on past years. We WhatsApp you the official dates as they’re announced.
            </p>
            <ol className="mt-6 divide-y divide-line rounded-2xl border border-line">
              {engineeringDates.map((item) => (
                <li key={item.label} className="flex flex-wrap justify-between gap-2 px-5 py-4">
                  <span className="font-semibold">{item.label}</span>
                  <span className="text-muted">{item.when}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-forest-50 py-16 sm:py-20">
        <div className="container-page">
          <h2 className="text-2xl font-bold sm:text-3xl">Latest updates</h2>
          <ul className="mt-8 space-y-3">
            {updates
              .filter((u) => u.tag === 'Engineering' || u.tag === 'Career')
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
            <ButtonLink to="/colleges?stream=engineering">Compare engineering colleges</ButtonLink>
            <ButtonLink to="/career-guidance" variant="soft">
              Not sure engineering fits?
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}

// TNEA cutoff = Maths + (Physics + Chemistry) / 2. Marks are out of 100.
const SUBJECTS = [
  ['maths', 'Maths'],
  ['physics', 'Physics'],
  ['chemistry', 'Chemistry'],
];
function CutoffCalculator() {
  const id = useId();
  const [marks, setMarks] = useState({ maths: '', physics: '', chemistry: '' });
  const values = Object.fromEntries(Object.entries(marks).map(([k, v]) => [k, v === '' ? null : Number(v)]));
  const invalid = Object.entries(values).filter(([, v]) => v != null && (Number.isNaN(v) || v < 0 || v > 100));
  const complete = Object.values(values).every((v) => v != null) && invalid.length === 0;
  const cutoff = complete ? values.maths + (values.physics + values.chemistry) / 2 : null;
  const band =
    cutoff == null
      ? null
      : cutoff >= 195
        ? 'Top government and aided colleges are realistic (CEG, GCT, PSG Tech) for most branches.'
        : cutoff >= 180
          ? 'Good aided and top private colleges are realistic; government colleges for some branches.'
          : cutoff >= 160
            ? 'Many well-known private colleges through TNEA; check branch-wise cutoffs.'
            : 'TNEA seats are still available; we’ll help you pick colleges with good placements.';

  return (
    <div className="card p-6 shadow-[var(--shadow-soft)] sm:p-8">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-forest-800 text-white" aria-hidden="true">
          <Calculator size={20} />
        </span>
        <h3 className="text-lg font-bold">TNEA cutoff calculator</h3>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {SUBJECTS.map(([subject, label]) => (
          <div key={subject}>
            <label htmlFor={`${id}-${subject}`} className="field-label">
              {label} <span className="font-normal text-muted">/100</span>
            </label>
            <input
              id={`${id}-${subject}`}
              type="number"
              inputMode="decimal"
              min={0}
              max={100}
              step="0.5"
              className="field"
              value={marks[subject]}
              aria-invalid={invalid.some(([k]) => k === subject) ? 'true' : undefined}
              onChange={(e) => setMarks((m) => ({ ...m, [subject]: e.target.value }))}
            />
          </div>
        ))}
      </div>
      {invalid.length ? (
        <p className="field-error mt-3" role="alert">
          Marks must be between 0 and 100.
        </p>
      ) : null}
      <div className="mt-6 rounded-2xl bg-forest-50 p-5" aria-live="polite">
        <p className="text-sm text-muted">Your TNEA cutoff</p>
        <p className="mt-1 text-4xl font-bold text-forest-800">{cutoff == null ? '–' : cutoff.toFixed(1)}</p>
        <p className="text-sm text-muted">out of 200</p>
        {band ? <p className="mt-3 text-[0.9375rem]">{band}</p> : null}
      </div>
      <ButtonLink to="/colleges?stream=engineering" variant="soft" className="mt-5">
        See engineering colleges
      </ButtonLink>
    </div>
  );
}
