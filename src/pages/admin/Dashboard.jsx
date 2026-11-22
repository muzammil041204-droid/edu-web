// Dashboard: a KPI row of stat tiles, then ranked bar lists (one hue,
// largest first) for interest, source and colleges, and the latest leads.
// Bar colour: --color-chart, checked with the dataviz palette validator.

import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { ErrorBlock, LoadingBlock } from '../../components/ui.jsx';
import { relativeDay } from '../../lib/format.js';
import { useNow } from '../../lib/useAsync.js';
import { INTEREST_SHORT, LEAD_STATUSES, SOURCES } from '../../lib/validation.js';
import { AdminTitle, StatusBadge } from './adminUi.jsx';
import { useLeads } from './leadsStore.jsx';

const DAY = 86_400_000;

export default function Dashboard() {
  const { leads, loading, error, reload } = useLeads();
  const now = useNow();
  if (loading) return <LoadingBlock label="Loading leads…" />;
  if (error) return <ErrorBlock message="Couldn’t load leads." onRetry={reload} />;

  const startOfToday = new Date(now).setHours(0, 0, 0, 0);
  const today = leads.filter((l) => new Date(l.created_at).getTime() >= startOfToday).length;
  const week = leads.filter((l) => now - new Date(l.created_at).getTime() < 7 * DAY).length;
  const waiting = leads.filter((l) => l.status === 'new').length;
  const admitted = leads.filter((l) => l.status === 'admitted').length;

  const countBy = (key, labels) => {
    const counts = leads.reduce((acc, l) => {
      const k = l[key] ?? 'none';
      acc[k] = (acc[k] ?? 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts)
      .filter(([k]) => k !== 'none')
      .map(([k, n]) => ({ label: labels ? (labels[k] ?? k) : k, n }))
      .sort((a, b) => b.n - a.n);
  };

  return (
    <>
      <AdminTitle title="Dashboard" text="How many families are asking, and what they want." />

      <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="New today" value={today} />
        <StatTile label="Last 7 days" value={week} />
        <StatTile label="Waiting for a first call" value={waiting} highlight={waiting > 0} />
        <StatTile label="Admitted" value={admitted} note={`of ${leads.length} leads`} />
      </dl>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <BarList title="What they’re looking for" rows={countBy('interest', INTEREST_SHORT)} total={leads.length} />
        <BarList title="Where leads come from" rows={countBy('source', SOURCES)} total={leads.length} />
        <BarList
          title="Colleges asked about"
          rows={countBy('college_name')}
          total={leads.length}
          empty="No college-specific leads yet."
        />
      </div>

      <section className="card mt-6 p-5 sm:p-6" aria-labelledby="latest">
        <div className="flex items-center justify-between gap-4">
          <h2 id="latest" className="text-lg font-bold">
            Latest leads
          </h2>
          <Link
            to="/admin/leads"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest-700 hover:underline"
          >
            All leads <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
        {leads.length === 0 ? (
          <p className="mt-4 text-muted">No leads yet. They’ll appear here the moment someone sends a form.</p>
        ) : (
          <ul className="mt-4 divide-y divide-line">
            {leads.slice(0, 6).map((lead) => (
              <li key={lead.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3">
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{lead.full_name}</span>
                  <span className="block text-sm text-muted">
                    {INTEREST_SHORT[lead.interest] ?? lead.interest}
                    {lead.college_name ? ` · ${lead.college_name}` : ''}
                  </span>
                </span>
                <span className="text-sm text-muted">{relativeDay(lead.created_at)}</span>
                <StatusBadge status={lead.status} />
              </li>
            ))}
          </ul>
        )}
      </section>
      <p className="sr-only">Statuses: {Object.values(LEAD_STATUSES).join(', ')}</p>
    </>
  );
}

function StatTile({ label, value, note, highlight = false }) {
  return (
    <div className={`card p-5 ${highlight ? 'border-[#ead7b0] bg-gold-soft' : ''}`}>
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-2 text-[2.25rem] leading-none font-semibold">{value.toLocaleString('en-IN')}</dd>
      {note ? <dd className="mt-2 text-sm text-muted">{note}</dd> : null}
    </div>
  );
}

// Ranked horizontal bars: name, bar and figure per row; bars share one baseline.
function BarList({ title, rows, total, empty = 'No data yet.' }) {
  const max = Math.max(1, ...rows.map((r) => r.n));
  return (
    <section className="card p-5 sm:p-6">
      <h2 className="text-base font-bold">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-muted">{empty}</p>
      ) : (
        <ul className="mt-4 space-y-3.5">
          {rows.slice(0, 6).map((row) => (
            <li key={row.label} title={`${row.label}: ${row.n} of ${total} leads`}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="truncate">{row.label}</span>
                <span className="font-semibold tabular-nums">{row.n}</span>
              </div>
              <div className="mt-1.5 h-2" aria-hidden="true">
                <div className="h-full rounded-r-[4px] bg-chart" style={{ width: `${(row.n / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
