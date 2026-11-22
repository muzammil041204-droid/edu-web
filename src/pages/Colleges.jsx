import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import AnimatedContent from '../components/bits/AnimatedContent.jsx';
import CollegeCard from '../components/CollegeCard.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { ErrorBlock, LoadingBlock } from '../components/ui.jsx';
import { listColleges } from '../lib/api.js';
import { FEE_BANDS, fromFee, OWNERSHIP } from '../lib/colleges.js';
import { useAsync, useTitle } from '../lib/useAsync.js';

const PAGE = 9;
const STREAM_TABS = [
  ['', 'All colleges'],
  ['medical', 'Medical'],
  ['engineering', 'Engineering'],
];
const SORTS = {
  popular: 'Partner colleges first',
  'fee-asc': 'Fees: low to high',
  'fee-desc': 'Fees: high to low',
  seats: 'Most seats',
  name: 'Name (A–Z)',
};

export default function Colleges() {
  useTitle('Medical and engineering colleges, fees 2026-27');
  const { data, error, loading, reload } = useAsync(listColleges, []);
  const [params, setParams] = useSearchParams();
  const [shown, setShown] = useState(PAGE);

  const filters = {
    q: params.get('q') ?? '',
    stream: params.get('stream') ?? '',
    state: params.get('state') ?? '',
    city: params.get('city') ?? '',
    type: params.get('type') ?? '',
    fee: params.get('fee') ?? '',
    partner: params.get('partner') === '1',
    sort: params.get('sort') ?? 'popular',
  };

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (value === '' || value === false || value == null) next.delete(key);
    else next.set(key, value === true ? '1' : value);
    if (key === 'state') next.delete('city');
    setParams(next, { replace: true, preventScrollReset: true });
    setShown(PAGE);
  };

  const states = useMemo(() => [...new Set((data ?? []).map((c) => c.state))].sort(), [data]);
  const cities = useMemo(
    () =>
      [...new Set((data ?? []).filter((c) => !filters.state || c.state === filters.state).map((c) => c.city))].sort(),
    [data, filters.state]
  );

  const results = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    const band = FEE_BANDS.find((b) => b.id === filters.fee);
    const list = (data ?? []).filter((c) => {
      if (q && !`${c.name} ${c.city} ${c.university}`.toLowerCase().includes(q)) return false;
      if (filters.stream && c.stream !== filters.stream) return false;
      if (filters.state && c.state !== filters.state) return false;
      if (filters.city && c.city !== filters.city) return false;
      if (filters.type && c.ownership !== filters.type) return false;
      if (filters.partner && !c.is_partner) return false;
      if (band) {
        const from = fromFee(c);
        if (from == null || !band.test(from)) return false;
      }
      return true;
    });
    const fee = (c) => fromFee(c) ?? Infinity;
    const sorters = {
      popular: (a, b) => Number(b.is_partner) - Number(a.is_partner) || a.name.localeCompare(b.name),
      'fee-asc': (a, b) => fee(a) - fee(b),
      'fee-desc': (a, b) => fee(b) - fee(a),
      seats: (a, b) => (b.seats ?? 0) - (a.seats ?? 0),
      name: (a, b) => a.name.localeCompare(b.name),
    };
    return list.sort(sorters[filters.sort] ?? sorters.popular);
  }, [
    data,
    filters.q,
    filters.stream,
    filters.state,
    filters.city,
    filters.type,
    filters.fee,
    filters.partner,
    filters.sort,
  ]);

  const activeCount =
    ['state', 'city', 'type', 'fee'].filter((k) => filters[k]).length + (filters.partner ? 1 : 0) + (filters.q ? 1 : 0);

  return (
    <>
      <PageHeader
        crumbs={[['Colleges']]}
        eyebrow="2026-27 fees"
        title="Colleges, fees"
        accent="and cutoffs"
        text="Medical and engineering colleges in Tamil Nadu and across India: government, aided, private, deemed and central. Each college page shows fees for every quota and last year’s cutoffs by category."
      >
        <div
          className="mt-8 flex w-max max-w-full flex-wrap gap-1 rounded-full border border-line bg-white p-1"
          role="group"
          aria-label="Course"
        >
          {STREAM_TABS.map(([value, label]) => (
            <button
              key={label}
              type="button"
              aria-pressed={filters.stream === value}
              onClick={() => update('stream', value)}
              className={`rounded-full px-4 py-2 text-sm font-semibold sm:px-5 ${filters.stream === value ? 'bg-forest-800 text-white' : 'text-muted hover:text-forest-900'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </PageHeader>

      <section className="pb-8">
        <div className="container-page">
          <div className="card p-4 sm:p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-forest-900">
              <SlidersHorizontal size={16} aria-hidden="true" /> Filter colleges
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
              <div className="relative">
                <label htmlFor="college-search" className="sr-only">
                  Search by college, city or university
                </label>
                <Search
                  size={18}
                  className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted"
                  aria-hidden="true"
                />
                <input
                  id="college-search"
                  type="search"
                  className="field pl-10"
                  placeholder="College, city or university"
                  value={filters.q}
                  onChange={(e) => update('q', e.target.value)}
                />
              </div>
              <FilterSelect
                id="f-state"
                label="State"
                value={filters.state}
                onChange={(v) => update('state', v)}
                options={states.map((s) => [s, s])}
              />
              <FilterSelect
                id="f-city"
                label="City"
                value={filters.city}
                onChange={(v) => update('city', v)}
                options={cities.map((s) => [s, s])}
              />
              <FilterSelect
                id="f-type"
                label="Type"
                value={filters.type}
                onChange={(v) => update('type', v)}
                options={Object.entries(OWNERSHIP)}
              />
              <FilterSelect
                id="f-fee"
                label="Tuition a year"
                value={filters.fee}
                onChange={(v) => update('fee', v)}
                options={FEE_BANDS.map((b) => [b.id, b.label])}
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
              <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={filters.partner}
                  onChange={(e) => update('partner', e.target.checked)}
                  className="h-5 w-5 accent-forest-700"
                />
                Partner colleges only
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <label htmlFor="f-sort" className="text-sm text-muted">
                  Sort by
                </label>
                <select
                  id="f-sort"
                  className="field min-h-10 w-auto py-1.5 text-sm"
                  value={filters.sort}
                  onChange={(e) => update('sort', e.target.value === 'popular' ? '' : e.target.value)}
                >
                  {Object.entries(SORTS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                {activeCount ? (
                  <button
                    type="button"
                    onClick={() => {
                      setParams({}, { replace: true, preventScrollReset: true });
                      setShown(PAGE);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-forest-800 hover:bg-forest-50"
                  >
                    <X size={15} aria-hidden="true" /> Clear filters ({activeCount})
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-8">
            {loading ? (
              <LoadingBlock label="Loading colleges…" />
            ) : error ? (
              <ErrorBlock message="We couldn’t load the colleges." onRetry={reload} />
            ) : (
              <>
                <p className="mb-5 text-sm text-muted" role="status" aria-live="polite">
                  {results.length === 0
                    ? 'No colleges match these filters.'
                    : `Showing ${Math.min(shown, results.length)} of ${results.length} colleges`}
                </p>
                {results.length === 0 ? (
                  <div className="card mx-auto max-w-lg p-8 text-center">
                    <p className="font-semibold">No colleges match these filters</p>
                    <p className="mt-2 text-sm text-muted">
                      Try a wider fee range or another state, or ask a counsellor for options.
                    </p>
                    <button
                      type="button"
                      className="btn btn-soft mt-5"
                      onClick={() => setParams({}, { replace: true })}
                    >
                      Clear all filters
                    </button>
                  </div>
                ) : (
                  <AnimatedContent
                    key={params.toString()}
                    stagger={0.05}
                    distance={24}
                    className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    {results.slice(0, shown).map((college) => (
                      <CollegeCard key={college.id} college={college} headingLevel="h2" />
                    ))}
                  </AnimatedContent>
                )}
                {results.length > shown ? (
                  <div className="mt-10 text-center">
                    <button type="button" className="btn btn-soft" onClick={() => setShown((n) => n + PAGE)}>
                      Show more colleges ({results.length - shown} more)
                    </button>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function FilterSelect({ id, label, value, onChange, options }) {
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select id={id} className="field" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{`Any ${label.toLowerCase()}`}</option>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </div>
  );
}
