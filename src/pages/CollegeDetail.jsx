import { Info, Lock, MapPin, Phone } from 'lucide-react';
import { useParams } from 'react-router';
import AnimatedContent from '../components/bits/AnimatedContent.jsx';
import CollegeCard, { OwnershipBadge, PartnerBadge } from '../components/CollegeCard.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { Button, ButtonLink, ErrorBlock, LoadingBlock, Photo } from '../components/ui.jsx';
import { WhatsAppIcon } from '../components/WhatsAppButton.jsx';
import { CATEGORY_HELP, MARKS_LABEL } from '../data/cutoffs.js';
import { site, whatsappLink } from '../data/site.js';
import { getCollege, listColleges } from '../lib/api.js';
import {
  ACADEMIC_YEAR,
  counsellingFor,
  courseTotal,
  currentFees,
  fromFee,
  lastUpdated,
  OWNERSHIP,
  QUOTAS,
  streamOf,
} from '../lib/colleges.js';
import { compactRupees, dateLabel, relativeDay, rupees } from '../lib/format.js';
import { useLead } from '../lib/leadContext.jsx';
import { useAsync, useTitle } from '../lib/useAsync.js';
import NotFound from './NotFound.jsx';

export default function CollegeDetail() {
  const { slug } = useParams();
  const { data: college, error, loading, reload } = useAsync(() => getCollege(slug), [slug]);
  useTitle(college ? `${college.name}: fees and cutoffs ${ACADEMIC_YEAR}` : 'College');

  if (loading) return <LoadingBlock label="Loading college…" className="min-h-[60vh]" />;
  if (error) return <ErrorBlock message="We couldn’t load this college." onRetry={reload} className="my-24" />;
  if (!college) return <NotFound />;
  return <College college={college} />;
}

function College({ college }) {
  const { unlocked, openLead } = useLead();
  const fees = currentFees(college);
  const updated = lastUpdated(college);
  const from = fromFee(college);
  const askFees = () => openLead({ source: 'fee_breakup', college });
  const askCutoffs = () => openLead({ source: 'cutoffs', college });
  const stream = streamOf(college);
  const engineering = college.stream === 'engineering';

  const overview = [
    ['Type', OWNERSHIP[college.ownership]],
    ['University', college.university],
    ['Established', college.established],
    ['Course', stream.course],
    [engineering ? 'Seats (all branches)' : 'MBBS seats', college.seats?.toLocaleString('en-IN')],
    engineering
      ? ['Average package', college.avg_package_lpa ? `₹${college.avg_package_lpa} lakh a year` : null]
      : ['Hospital beds', college.beds?.toLocaleString('en-IN')],
    ['Admission through', college.counselling?.join(', ')],
    ['Course length', stream.yearsNote],
    ['Tuition from', from != null ? `${rupees(from)} a year` : 'On request'],
  ];

  return (
    <>
      <PageHeader crumbs={[['Colleges', '/colleges'], [college.name]]} title={college.name}>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <OwnershipBadge ownership={college.ownership} />
          {college.is_partner ? <PartnerBadge /> : null}
          <span className="ml-1 inline-flex items-center gap-1.5 text-muted">
            <MapPin size={16} aria-hidden="true" /> {college.city}, {college.state}
          </span>
        </div>
      </PageHeader>

      <div className="container-page grid gap-10 pb-8 lg:grid-cols-[1fr_22rem] lg:gap-12">
        <div className="min-w-0 space-y-14">
          <figure>
            <div className="overflow-hidden rounded-[var(--radius-photo)]">
              <Photo
                id={college.image}
                alt=""
                w={1400}
                h={640}
                eager
                className="aspect-[21/10] w-full"
                sizes="(min-width: 1024px) 900px, 100vw"
              />
            </div>
            <figcaption className="mt-2 text-xs text-muted">Illustrative campus photo.</figcaption>
          </figure>

          <section aria-labelledby="overview">
            <h2 id="overview" className="text-2xl font-bold">
              Overview
            </h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-muted">{college.summary}</p>
            <dl className="mt-6 grid overflow-hidden rounded-2xl border border-line sm:grid-cols-2">
              {overview.map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between gap-4 border-b border-line px-5 py-3.5 sm:[&:nth-last-child(-n+2)]:border-b-0"
                >
                  <dt className="text-muted">{label}</dt>
                  <dd className="text-right font-semibold">{value ?? '–'}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="fees">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 id="fees" className="text-2xl font-bold">
                  Fees by quota, {ACADEMIC_YEAR}
                </h2>
                <p className="mt-2 text-sm text-muted">
                  {updated ? `Last updated ${relativeDay(updated)} (${dateLabel(updated)}).` : ''} Fees can change each
                  year; we confirm them with the college before you pay.
                </p>
              </div>
            </div>
            {fees.length === 0 ? (
              <p className="mt-6 rounded-2xl bg-forest-50 p-5">
                Fees for {ACADEMIC_YEAR} are not published yet. Ask a counsellor for the latest figures.
              </p>
            ) : (
              <Gated locked={!unlocked} onUnlock={askFees} label="See the full fee breakup">
                <div className="table-wrap">
                  <table className="data-table">
                    <caption className="sr-only">
                      {stream.course} fees by quota at {college.name}
                    </caption>
                    <thead>
                      <tr>
                        <th scope="col">Quota</th>
                        <th scope="col" className="num">
                          Tuition / year
                        </th>
                        <th scope="col" className="num">
                          Hostel / year
                        </th>
                        <th scope="col" className="num">
                          One-time
                        </th>
                        <th scope="col" className="num">
                          Whole course*
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {fees.map((fee) => (
                        <tr key={fee.id ?? fee.quota}>
                          <th scope="row">
                            <span className="block font-semibold">{QUOTAS[fee.quota]?.label ?? fee.quota}</span>
                            <span className="block text-xs font-normal text-muted">
                              {counsellingFor(college, fee.quota)}
                            </span>
                          </th>
                          <td className="num font-semibold">{rupees(fee.tuition_per_year)}</td>
                          <td className="num" data-gated>
                            {rupees(fee.hostel_per_year)}
                          </td>
                          <td className="num" data-gated>
                            {rupees(fee.one_time_fees)}
                          </td>
                          <td className="num font-semibold text-forest-800" data-gated>
                            {compactRupees(courseTotal(fee, stream.years))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Gated>
            )}
            <p className="mt-3 flex gap-2 text-xs text-muted">
              <Info size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
              *Tuition and hostel for {stream.years} years plus one-time fees. Sample figures for the demo.
            </p>
          </section>

          <section aria-labelledby="cutoffs">
            <h2 id="cutoffs" className="text-2xl font-bold">
              2026 cutoffs by category
            </h2>
            <p className="mt-2 text-sm text-muted">
              {engineering
                ? 'Closing ranks in round 2: TNEA general rank and cutoff mark, JoSAA rank, or the university’s own exam rank.'
                : `Closing ranks in round 2, on the ${college.state === 'Tamil Nadu' ? 'Tamil Nadu merit list (state quota) or the ' : ''}all-India NEET rank list (MCC).`}
            </p>
            {college.cutoffs?.length ? (
              <Gated locked={!unlocked} onUnlock={askCutoffs} label="See last year’s cutoffs">
                <CutoffTables cutoffs={college.cutoffs} />
              </Gated>
            ) : (
              <p className="mt-6 rounded-2xl bg-forest-50 p-5">No cutoffs published yet.</p>
            )}
          </section>

          <section aria-labelledby="how" className="rounded-[var(--radius-card)] bg-cream p-6 sm:p-8">
            <h2 id="how" className="text-2xl font-bold">
              How to get a seat here
            </h2>
            <ol className="mt-5 grid gap-4 sm:grid-cols-3">
              {[
                engineering
                  ? [
                      'Finish Class 12 / write the exam',
                      'Maths, Physics and Chemistry marks, plus JEE or the university exam if needed.',
                    ]
                  : ['Qualify NEET-UG', 'Score above the qualifying percentile for your category.'],
                [
                  `Register for ${college.counselling?.[0] ?? 'counselling'}`,
                  'Upload certificates and pay the registration fee before the deadline.',
                ],
                [
                  'Fill choices in the right order',
                  'We help you place this college where your rank gives it a real chance.',
                ],
              ].map(([title, text], i) => (
                <li key={title} className="card p-5">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-forest-800 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <h3 className="mt-3 font-bold">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{text}</p>
                </li>
              ))}
            </ol>
            <ButtonLink to={engineering ? '/engineering' : '/medical'} variant="soft" className="mt-6">
              Full admission guide
            </ButtonLink>
          </section>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="on-dark rounded-[var(--radius-card)] bg-forest-800 p-6 text-white">
            <p className="text-sm text-forest-200">Tuition from</p>
            <p className="mt-1 text-3xl font-bold">
              {from != null ? compactRupees(from) : 'On request'}
              {from != null ? <span className="text-base font-medium text-white/70"> / year</span> : null}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/75">
              Not sure if your score is enough for {college.name}? A counsellor will check your rank, category and
              budget for free.
            </p>
            <div className="mt-6 grid gap-3">
              <Button variant="light" onClick={() => openLead({ source: 'fee_breakup', college })}>
                {unlocked ? 'Talk to a counsellor' : 'Get the fee breakup'}
              </Button>
              <a
                href={whatsappLink(`Hi Arivu team, I would like to know about admission at ${college.name}.`)}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline-light"
              >
                <WhatsAppIcon size={20} /> Ask on WhatsApp
              </a>
              <a href={site.phoneHref} className="btn btn-outline-light">
                <Phone size={18} aria-hidden="true" /> {site.phone}
              </a>
            </div>
          </div>
        </aside>
      </div>

      <SimilarColleges college={college} />
    </>
  );
}

// Shows the content blurred with a button on top until the form is sent.
// While locked, the blurred copy is hidden from assistive tech (inert) and the
// button explains how to open it.
function Gated({ locked, onUnlock, label, children }) {
  if (!locked) return <div className="mt-6">{children}</div>;
  return (
    <div className="relative mt-6 min-h-[18rem]">
      <div
        aria-hidden="true"
        inert
        className="pointer-events-none select-none [&_[data-gated]]:blur-[6px] [&_tbody_tr:nth-child(n+2)]:blur-[5px]"
      >
        {children}
      </div>
      <div className="absolute inset-0 grid place-items-center rounded-2xl bg-gradient-to-b from-white/10 via-white/70 to-white/95 p-4">
        <div className="max-w-sm text-center">
          <span
            className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-forest-800 text-white"
            aria-hidden="true"
          >
            <Lock size={18} />
          </span>
          <p className="mt-3 font-semibold">Free for students and parents</p>
          <p className="mt-1 text-sm text-muted">
            Share your WhatsApp number and email once to open every college’s details.
          </p>
          <Button className="mt-4" onClick={onUnlock}>
            {label}
          </Button>
        </div>
      </div>
    </div>
  );
}

function CutoffTables({ cutoffs }) {
  const groups = cutoffs.reduce((acc, row) => {
    // e.g. "TNEA · Government quota (state)"
    const key = `${row.counselling} · ${QUOTAS[row.quota]?.label ?? row.quota}`;
    (acc[key] ??= []).push(row);
    return acc;
  }, {});
  return (
    <div className="space-y-6">
      {Object.entries(groups).map(([title, rows]) => {
        const marksLabel = MARKS_LABEL[rows[0].counselling];
        const showMarks = marksLabel && rows.some((row) => row.closing_marks != null);
        return (
          <div key={title}>
            <h3 className="mb-2 text-sm font-bold text-forest-900">{title}</h3>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th scope="col">Category</th>
                    <th scope="col" className="num">
                      Closing rank
                    </th>
                    {showMarks ? (
                      <th scope="col" className="num">
                        {marksLabel}
                      </th>
                    ) : null}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.category}>
                      <th scope="row">
                        <abbr title={CATEGORY_HELP[row.category]} className="font-semibold no-underline">
                          {row.category}
                        </abbr>
                      </th>
                      <td className="num" data-gated>
                        {row.closing_rank.toLocaleString('en-IN')}
                      </td>
                      {showMarks ? (
                        <td className="num" data-gated>
                          {row.closing_marks}
                        </td>
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SimilarColleges({ college }) {
  const { data } = useAsync(listColleges, []);
  const similar = (data ?? [])
    .filter((c) => c.id !== college.id && (c.ownership === college.ownership || c.state === college.state))
    .sort((a, b) => Number(b.ownership === college.ownership) - Number(a.ownership === college.ownership))
    .slice(0, 3);
  if (!similar.length) return null;
  return (
    <section className="bg-forest-50 py-16 sm:py-20">
      <div className="container-page">
        <h2 className="text-2xl font-bold sm:text-3xl">
          Similar <span className="accent">colleges</span>
        </h2>
        <AnimatedContent stagger={0.08} className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {similar.map((c) => (
            <CollegeCard key={c.id} college={c} />
          ))}
        </AnimatedContent>
      </div>
    </section>
  );
}
