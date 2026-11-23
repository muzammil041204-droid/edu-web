// Leads: search, filter, change status, add notes, contact (WhatsApp / call /
// email), export CSV, delete. New leads appear live and are highlighted.

import { Download, Mail, Phone, Search, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ErrorBlock, LoadingBlock } from '../../components/ui.jsx';
import { WhatsAppIcon } from '../../components/WhatsAppButton.jsx';
import { deleteLead, updateLead } from '../../lib/api.js';
import { dateTimeLabel, relativeDay } from '../../lib/format.js';
import { useNow } from '../../lib/useAsync.js';
import { INTEREST_SHORT, LEAD_STATUSES, SOURCES, STAGES } from '../../lib/validation.js';
import { AdminTitle, StatusBadge } from './adminUi.jsx';
import { leadWhatsapp, useLeads } from './leadsStore.jsx';

const DAY = 86_400_000;
const RANGES = { all: 'Any time', today: 'Today', 7: 'Last 7 days', 30: 'Last 30 days' };

export default function Leads() {
  const { leads, loading, error, reload, fresh, patchLocal, removeLocal } = useLeads();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [interest, setInterest] = useState('');
  const [range, setRange] = useState('all');
  const [openId, setOpenId] = useState(null);
  const [actionError, setActionError] = useState('');
  const now = useNow();

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    const startOfToday = new Date(now).setHours(0, 0, 0, 0);
    return leads.filter((lead) => {
      if (
        term &&
        !`${lead.full_name} ${lead.whatsapp} ${lead.email} ${lead.college_name ?? ''}`.toLowerCase().includes(term)
      )
        return false;
      if (status && lead.status !== status) return false;
      if (interest && lead.interest !== interest) return false;
      const at = new Date(lead.created_at).getTime();
      if (range === 'today' && at < startOfToday) return false;
      if ((range === '7' || range === '30') && now - at > Number(range) * DAY) return false;
      return true;
    });
  }, [leads, q, status, interest, range, now]);

  async function change(lead, patch) {
    setActionError('');
    const before = { ...lead };
    patchLocal(lead.id, patch);
    try {
      await updateLead(lead.id, patch);
    } catch (err) {
      patchLocal(lead.id, before);
      setActionError(err.message);
    }
  }

  async function remove(lead) {
    if (!window.confirm(`Delete ${lead.full_name}'s details permanently? This can't be undone.`)) return;
    setActionError('');
    try {
      await deleteLead(lead.id);
      removeLocal(lead.id);
      setOpenId(null);
    } catch (err) {
      setActionError(err.message);
    }
  }

  if (loading) return <LoadingBlock label="Loading leads…" />;
  if (error) return <ErrorBlock message="Couldn’t load leads." onRetry={reload} />;

  const open = leads.find((l) => l.id === openId) ?? null;

  return (
    <>
      <AdminTitle title="Leads" text={`${leads.length} students and parents who sent a form. Newest first.`}>
        <button type="button" className="btn btn-soft" onClick={() => exportCsv(results)} disabled={!results.length}>
          <Download size={16} aria-hidden="true" /> Export CSV
        </button>
      </AdminTitle>

      <div className="card grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div className="relative">
          <label htmlFor="lead-search" className="sr-only">
            Search leads
          </label>
          <Search
            size={18}
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            id="lead-search"
            type="search"
            className="field pl-10"
            placeholder="Name, number, email or college"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <Select
          id="lead-status"
          label="Status"
          value={status}
          onChange={setStatus}
          options={LEAD_STATUSES}
          any="Any status"
        />
        <Select
          id="lead-interest"
          label="Looking for"
          value={interest}
          onChange={setInterest}
          options={INTEREST_SHORT}
          any="Anything"
        />
        <Select id="lead-range" label="Received" value={range} onChange={setRange} options={RANGES} />
      </div>

      {actionError ? (
        <p role="alert" className="mt-4 rounded-xl bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
          {actionError}
        </p>
      ) : null}

      <p className="mt-5 mb-3 text-sm text-muted" role="status" aria-live="polite">
        {results.length === leads.length ? `${leads.length} leads` : `${results.length} of ${leads.length} leads match`}
      </p>

      {results.length === 0 ? (
        <div className="card p-8 text-center text-muted">
          {leads.length ? 'No leads match these filters.' : 'No leads yet.'}
        </div>
      ) : (
        <>
          {/* Phones: cards */}
          <ul className="space-y-3 md:hidden">
            {results.map((lead) => (
              <li key={lead.id} className={`card p-4 ${fresh.has(lead.id) ? 'ring-2 ring-gold' : ''}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{lead.full_name}</p>
                    <p className="text-sm text-muted">
                      {relativeDay(lead.created_at)} · {SOURCES[lead.source] ?? lead.source}
                    </p>
                  </div>
                  <StatusBadge status={lead.status} />
                </div>
                <p className="mt-2 text-sm">
                  {INTEREST_SHORT[lead.interest] ?? lead.interest}
                  {lead.college_name ? ` · ${lead.college_name}` : ''}
                  {lead.score_note ? ` · ${lead.score_note}` : ''}
                  {lead.category ? ` · ${lead.category}` : ''}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <ContactButtons lead={lead} />
                  <button
                    type="button"
                    className="btn btn-soft min-h-10 px-4 py-2 text-sm"
                    onClick={() => setOpenId(lead.id)}
                  >
                    Details
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Larger screens: table */}
          <div className="table-wrap hidden md:block">
            <table className="data-table text-sm">
              <caption className="sr-only">Leads</caption>
              <thead>
                <tr>
                  <th scope="col">Received</th>
                  <th scope="col">Student</th>
                  <th scope="col">WhatsApp</th>
                  <th scope="col">Looking for</th>
                  <th scope="col">Stage · score</th>
                  <th scope="col">Status</th>
                  <th scope="col">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.map((lead) => (
                  <tr key={lead.id} className={fresh.has(lead.id) ? 'bg-gold-soft' : ''}>
                    <td className="text-muted">
                      <span className="block font-medium text-ink">{relativeDay(lead.created_at)}</span>
                      <span className="block text-xs">{SOURCES[lead.source] ?? lead.source}</span>
                    </td>
                    <th scope="row" className="font-normal">
                      <span className="block font-semibold">{lead.full_name}</span>
                      <a
                        href={`mailto:${lead.email}`}
                        className="block text-xs text-muted hover:text-forest-700 hover:underline"
                      >
                        {lead.email}
                      </a>
                    </th>
                    <td>
                      <a
                        href={leadWhatsapp(lead)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 font-medium text-[#1a7a43] hover:underline"
                      >
                        <WhatsAppIcon size={16} /> {formatPhone(lead.whatsapp)}
                      </a>
                    </td>
                    <td className="min-w-[14rem] whitespace-normal">
                      <span className="block">{INTEREST_SHORT[lead.interest] ?? lead.interest}</span>
                      {lead.college_name ? <span className="block text-xs text-muted">{lead.college_name}</span> : null}
                    </td>
                    <td>
                      <span className="block">{STAGES[lead.stage] ?? '–'}</span>
                      <span className="block text-xs text-muted">
                        {[lead.score_note, lead.category].filter(Boolean).join(' · ') || '–'}
                      </span>
                    </td>
                    <td>
                      <label className="sr-only" htmlFor={`status-${lead.id}`}>
                        Status for {lead.full_name}
                      </label>
                      <select
                        id={`status-${lead.id}`}
                        className="field min-h-9 w-auto py-1 pr-8 text-sm"
                        value={lead.status}
                        onChange={(e) => change(lead, { status: e.target.value })}
                      >
                        {Object.entries(LEAD_STATUSES).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="rounded-full px-3 py-1.5 font-semibold text-forest-700 hover:bg-forest-50"
                        onClick={() => setOpenId(lead.id)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {open ? <LeadDrawer lead={open} onClose={() => setOpenId(null)} onChange={change} onDelete={remove} /> : null}
    </>
  );
}

function ContactButtons({ lead }) {
  return (
    <>
      <a
        href={leadWhatsapp(lead)}
        target="_blank"
        rel="noreferrer"
        className="btn min-h-10 bg-[#1f8f4e] px-4 py-2 text-sm text-white hover:bg-[#1a7a43]"
      >
        <WhatsAppIcon size={18} /> WhatsApp
      </a>
      <a href={`tel:+91${lead.whatsapp}`} className="btn btn-soft min-h-10 px-4 py-2 text-sm">
        <Phone size={16} aria-hidden="true" /> Call
      </a>
      <a href={`mailto:${lead.email}`} className="btn btn-soft min-h-10 px-4 py-2 text-sm">
        <Mail size={16} aria-hidden="true" /> Email
      </a>
    </>
  );
}

function LeadDrawer({ lead, onClose, onChange, onDelete }) {
  const ref = useRef(null);
  const [notes, setNotes] = useState(lead.notes ?? '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const dialog = ref.current;
    // Open once. Don't close() in a cleanup: that fires onClose and would shut
    // the panel straight away in React's development double-run. Unmounting
    // removes the dialog anyway.
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const details = [
    ['Received', dateTimeLabel(lead.created_at)],
    ['WhatsApp', `+91 ${formatPhone(lead.whatsapp)}`],
    ['Email', lead.email],
    ['Student is in', STAGES[lead.stage] ?? 'Not given'],
    ['Marks / score', lead.score_note || 'Not given'],
    ['Category', lead.category ?? 'Not given'],
    ['Looking for', INTEREST_SHORT[lead.interest] ?? lead.interest],
    ['College viewed', lead.college_name ?? '–'],
    ['Came from', `${SOURCES[lead.source] ?? lead.source} (${lead.page ?? '/'})`],
    ['Consent to contact', lead.consent ? 'Yes' : 'No'],
  ];

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="lead-title"
      className="ml-auto h-dvh max-h-none w-full max-w-lg bg-transparent p-0 backdrop:bg-forest-950/50"
    >
      <div className="flex h-full flex-col overflow-y-auto bg-white p-6 shadow-[var(--shadow-lift)] sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="lead-title" className="text-2xl font-bold">
              {lead.full_name}
            </h2>
            <div className="mt-2">
              <StatusBadge status={lead.status} />
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full bg-forest-50 hover:bg-forest-100"
            aria-label="Close"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <ContactButtons lead={lead} />
        </div>

        <dl className="mt-6 divide-y divide-line rounded-2xl border border-line text-sm">
          {details.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 px-4 py-2.5">
              <dt className="text-muted">{label}</dt>
              <dd className="text-right font-medium break-all">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6">
          <label htmlFor="drawer-status" className="field-label">
            Status
          </label>
          <select
            id="drawer-status"
            className="field"
            value={lead.status}
            onChange={(e) => onChange(lead, { status: e.target.value })}
          >
            {Object.entries(LEAD_STATUSES).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <form
          className="mt-5"
          onSubmit={async (e) => {
            e.preventDefault();
            await onChange(lead, { notes });
            setSaved(true);
          }}
        >
          <label htmlFor="drawer-notes" className="field-label">
            Counsellor notes
          </label>
          <textarea
            id="drawer-notes"
            rows={4}
            className="field min-h-28"
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              setSaved(false);
            }}
            placeholder="Budget, preferred cities, call times…"
          />
          <div className="mt-3 flex items-center gap-3">
            <button type="submit" className="btn btn-primary min-h-10 px-5 py-2 text-sm">
              Save notes
            </button>
            {saved ? (
              <span className="text-sm text-forest-700" role="status">
                Saved
              </span>
            ) : null}
          </div>
        </form>

        <div className="mt-auto border-t border-line pt-6">
          <button
            type="button"
            onClick={() => onDelete(lead)}
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-danger hover:bg-danger-soft"
          >
            <Trash2 size={16} aria-hidden="true" /> Delete this lead
          </button>
          <p className="mt-1 px-3 text-xs text-muted">For deletion requests under the privacy policy.</p>
        </div>
      </div>
    </dialog>
  );
}

function Select({ id, label, value, onChange, options, any }) {
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select id={id} className="field" value={value} onChange={(e) => onChange(e.target.value)}>
        {any ? <option value="">{any}</option> : null}
        {Object.entries(options).map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </div>
  );
}

const formatPhone = (n = '') => (n.length === 10 ? `${n.slice(0, 5)} ${n.slice(5)}` : n);

function exportCsv(rows) {
  const columns = [
    ['Received', (l) => l.created_at],
    ['Name', (l) => l.full_name],
    ['WhatsApp', (l) => `+91${l.whatsapp}`],
    ['Email', (l) => l.email],
    ['Stage', (l) => STAGES[l.stage] ?? ''],
    ['Marks / score', (l) => l.score_note ?? ''],
    ['Category', (l) => l.category ?? ''],
    ['Looking for', (l) => INTEREST_SHORT[l.interest] ?? l.interest],
    ['College', (l) => l.college_name ?? ''],
    ['Source', (l) => SOURCES[l.source] ?? l.source],
    ['Status', (l) => LEAD_STATUSES[l.status] ?? l.status],
    ['Notes', (l) => l.notes ?? ''],
  ];
  // Quote every cell; prefix formula-like values so spreadsheets don't run them.
  const cell = (value) => {
    let text = String(value ?? '');
    if (/^[=+\-@]/.test(text) && !/^\+91\d{10}$/.test(text)) text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  };
  const csv = [
    columns.map(([h]) => cell(h)).join(','),
    ...rows.map((r) => columns.map(([, get]) => cell(get(r))).join(',')),
  ].join('\r\n');
  const url = URL.createObjectURL(new Blob([String.fromCharCode(0xfeff) + csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `arivu-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
