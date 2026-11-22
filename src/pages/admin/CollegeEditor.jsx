// Edit one college: its details, and its fees per quota and academic year.

import { ArrowLeft, Copy, ExternalLink, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ErrorBlock, LoadingBlock } from '../../components/ui.jsx';
import { adminListColleges, saveCollege, saveFees } from '../../lib/api.js';
import {
  ACADEMIC_YEAR,
  courseTotal,
  OWNERSHIP,
  QUOTA_ORDER,
  QUOTAS,
  slugify,
  STREAMS,
  streamOf,
} from '../../lib/colleges.js';
import { compactRupees, dateTimeLabel, rupees } from '../../lib/format.js';
import { useAsync } from '../../lib/useAsync.js';
import { AdminTitle } from './adminUi.jsx';
import { Toggle } from './CollegesAdmin.jsx';

const YEARS = [ACADEMIC_YEAR, nextYear(ACADEMIC_YEAR)];
function nextYear(year) {
  const start = Number(year.slice(0, 4)) + 1;
  return `${start}-${String(start + 1).slice(2)}`;
}

const BLANK = {
  name: '',
  slug: '',
  city: '',
  state: 'Tamil Nadu',
  ownership: 'private',
  stream: 'medical',
  university: '',
  established: '',
  seats: '',
  beds: '',
  avg_package_lpa: '',
  counselling: 'TN Selection Committee',
  image: '',
  summary: '',
  is_partner: false,
  is_published: true,
};

export default function CollegeEditor({ editor }) {
  const { id } = useParams();
  const isNew = !id;
  const { data, error, loading, reload } = useAsync(adminListColleges, []);
  const college = useMemo(() => (data ?? []).find((c) => c.id === id) ?? null, [data, id]);

  if (loading) return <LoadingBlock label="Loading…" />;
  if (error) return <ErrorBlock message="Couldn’t load this college." onRetry={reload} />;
  if (!isNew && !college) return <ErrorBlock message="This college doesn’t exist any more." />;

  return (
    <>
      <Link
        to="/admin/colleges"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-forest-700 hover:underline"
      >
        <ArrowLeft size={16} aria-hidden="true" /> All colleges
      </Link>
      <AdminTitle
        title={isNew ? 'Add a college' : college.name}
        text={isNew ? 'Fill in the details, save, then add its fees.' : `${college.city}, ${college.state}`}
      >
        {!isNew && college.is_published ? (
          <Link to={`/colleges/${college.slug}`} target="_blank" className="btn btn-soft">
            <ExternalLink size={16} aria-hidden="true" /> View on website
          </Link>
        ) : null}
      </AdminTitle>
      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        {!isNew ? <FeesEditor key={`fees-${college.id}`} college={college} editor={editor} onSaved={reload} /> : null}
        <DetailsForm key={`details-${college?.id ?? 'new'}`} college={college} onSaved={reload} />
      </div>
    </>
  );
}

function DetailsForm({ college, onSaved }) {
  const navigate = useNavigate();
  const [values, setValues] = useState(() =>
    college
      ? {
          ...BLANK,
          ...college,
          established: college.established ?? '',
          seats: college.seats ?? '',
          beds: college.beds ?? '',
          avg_package_lpa: college.avg_package_lpa ?? '',
          counselling: (college.counselling ?? []).join(', '),
        }
      : BLANK
  );
  const [state, setState] = useState({ busy: false, error: '', saved: false });
  const set = (name) => (e) => {
    const value = e.target.value;
    setValues((v) => ({ ...v, [name]: value, ...(name === 'name' && !college ? { slug: slugify(value) } : {}) }));
    setState((s) => ({ ...s, saved: false }));
  };
  const num = (v) => (v === '' || v == null ? null : Number(v));

  async function handleSubmit(e) {
    e.preventDefault();
    if (values.name.trim().length < 3 || !values.city.trim() || !values.slug.trim()) {
      setState({ busy: false, error: 'Name, web address and city are required.', saved: false });
      return;
    }
    setState({ busy: true, error: '', saved: false });
    try {
      const saved = await saveCollege({
        ...(college ? { id: college.id } : {}),
        name: values.name.trim(),
        slug: slugify(values.slug),
        city: values.city.trim(),
        state: values.state.trim(),
        ownership: values.ownership,
        stream: values.stream,
        university: values.university.trim(),
        established: num(values.established),
        seats: num(values.seats),
        beds: values.stream === 'medical' ? num(values.beds) : null,
        avg_package_lpa: values.stream === 'engineering' ? num(values.avg_package_lpa) : null,
        counselling: values.counselling
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        courses: [STREAMS[values.stream].course],
        image: values.image.trim() || '1634807186335-7731bbed1e79',
        summary: values.summary.trim(),
        is_partner: Boolean(values.is_partner),
        is_published: Boolean(values.is_published),
      });
      setState({ busy: false, error: '', saved: true });
      if (!college) navigate(`/admin/colleges/${saved.id}`, { replace: true });
      else onSaved();
    } catch (err) {
      setState({ busy: false, error: err.message, saved: false });
    }
  }

  const field = (name, label, props = {}) => (
    <div className={props.wide ? 'sm:col-span-2' : ''}>
      <label htmlFor={`c-${name}`} className="field-label">
        {label}
      </label>
      <input id={`c-${name}`} className="field" value={values[name]} onChange={set(name)} {...props} wide={undefined} />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} noValidate className="card self-start p-5 sm:p-6">
      <h2 className="text-lg font-bold">College details</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {field('name', 'Name', { wide: true })}
        {field('slug', 'Web address (after /colleges/)', { wide: true })}
        {field('city', 'City')}
        {field('state', 'State')}
        <div>
          <label htmlFor="c-stream" className="field-label">
            Stream
          </label>
          <select
            id="c-stream"
            className="field"
            value={values.stream}
            onChange={set('stream')}
            disabled={Boolean(college)}
          >
            {Object.entries(STREAMS).map(([v, info]) => (
              <option key={v} value={v}>
                {info.label} ({info.course})
              </option>
            ))}
          </select>
          {college ? <p className="mt-1 text-xs text-muted">Fixed once the college has fees.</p> : null}
        </div>
        <div>
          <label htmlFor="c-ownership" className="field-label">
            Type
          </label>
          <select id="c-ownership" className="field" value={values.ownership} onChange={set('ownership')}>
            {Object.entries(OWNERSHIP).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
        {field('established', 'Established (year)', { type: 'number', inputMode: 'numeric' })}
        {field('seats', values.stream === 'engineering' ? 'Seats (all branches)' : 'MBBS seats', {
          type: 'number',
          inputMode: 'numeric',
        })}
        {values.stream === 'engineering'
          ? field('avg_package_lpa', 'Average package (₹ lakh a year)', {
              type: 'number',
              inputMode: 'decimal',
              step: '0.1',
            })
          : field('beds', 'Hospital beds', { type: 'number', inputMode: 'numeric' })}
        {field('university', 'University', { wide: true })}
        {field('counselling', 'Admission through (comma separated)', { wide: true })}
        {field('image', 'Photo (Unsplash id or image URL)', { wide: true })}
        <div className="sm:col-span-2">
          <label htmlFor="c-summary" className="field-label">
            Short description
          </label>
          <textarea
            id="c-summary"
            rows={3}
            className="field min-h-24"
            value={values.summary}
            onChange={set('summary')}
          />
        </div>
        <div className="flex items-center justify-between gap-3 rounded-xl bg-forest-50 px-4 py-3">
          <span className="text-sm font-semibold">Partner college</span>
          <Toggle
            checked={values.is_partner}
            label="Partner college"
            onChange={() => setValues((v) => ({ ...v, is_partner: !v.is_partner }))}
          />
        </div>
        <div className="flex items-center justify-between gap-3 rounded-xl bg-forest-50 px-4 py-3">
          <span className="text-sm font-semibold">Show on website</span>
          <Toggle
            checked={values.is_published}
            label="Show on website"
            onChange={() => setValues((v) => ({ ...v, is_published: !v.is_published }))}
          />
        </div>
      </div>
      {state.error ? (
        <p role="alert" className="mt-4 rounded-xl bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
          {state.error}
        </p>
      ) : null}
      <div className="mt-5 flex items-center gap-3">
        <button type="submit" className="btn btn-primary" disabled={state.busy}>
          {state.busy ? 'Saving…' : college ? 'Save details' : 'Create college'}
        </button>
        {state.saved ? (
          <span className="text-sm text-forest-700" role="status">
            Saved
          </span>
        ) : null}
      </div>
    </form>
  );
}

const toRow = (fee) => ({
  quota: fee.quota,
  tuition_per_year: fee.tuition_per_year ?? '',
  hostel_per_year: fee.hostel_per_year ?? '',
  one_time_fees: fee.one_time_fees ?? '',
  note: fee.note ?? '',
  source_url: fee.source_url ?? '',
});

function FeesEditor({ college, editor, onSaved }) {
  const [year, setYear] = useState(ACADEMIC_YEAR);
  const feesFor = (y) =>
    (college.fees ?? [])
      .filter((f) => f.academic_year === y)
      .sort((a, b) => QUOTA_ORDER.indexOf(a.quota) - QUOTA_ORDER.indexOf(b.quota));
  const [rows, setRows] = useState(() => feesFor(ACADEMIC_YEAR).map(toRow));
  const [state, setState] = useState({ busy: false, error: '', savedAt: null });

  const saved = feesFor(year);
  const lastSaved = saved.reduce((latest, f) => (f.updated_at > latest ? f.updated_at : latest), '');
  const unused = QUOTA_ORDER.filter((q) => !rows.some((r) => r.quota === q));

  const switchYear = (y) => {
    setYear(y);
    setRows(feesFor(y).map(toRow));
    setState({ busy: false, error: '', savedAt: null });
  };
  const setCell = (index, key) => (e) => {
    const value = e.target.value;
    setRows((rs) => rs.map((r, i) => (i === index ? { ...r, [key]: value } : r)));
    setState((s) => ({ ...s, savedAt: null }));
  };

  async function handleSave(e) {
    e.preventDefault();
    const bad = rows.find((r) => r.tuition_per_year === '' || Number(r.tuition_per_year) < 0);
    if (bad) {
      setState({
        busy: false,
        error: `Enter the tuition fee for ${QUOTAS[bad.quota]?.label ?? bad.quota}.`,
        savedAt: null,
      });
      return;
    }
    setState({ busy: true, error: '', savedAt: null });
    try {
      await saveFees(college.id, year, rows, { course: streamOf(college).course, editor });
      setState({ busy: false, error: '', savedAt: new Date().toISOString() });
      onSaved();
    } catch (err) {
      setState({ busy: false, error: err.message, savedAt: null });
    }
  }

  return (
    <form onSubmit={handleSave} noValidate className="card self-start p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold">{streamOf(college).course} fees</h2>
        <div className="flex rounded-full bg-forest-50 p-1" role="group" aria-label="Academic year">
          {YEARS.map((y) => (
            <button
              key={y}
              type="button"
              aria-pressed={year === y}
              onClick={() => switchYear(y)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold ${year === y ? 'bg-white text-forest-900 shadow-sm' : 'text-muted hover:text-forest-900'}`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-1 text-sm text-muted">
        Rupees per year. {lastSaved ? `Last saved ${dateTimeLabel(lastSaved)}.` : 'Not saved for this year yet.'}
      </p>

      {rows.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-line p-6 text-center">
          <p className="font-semibold">No fees for {year} yet</p>
          {year !== ACADEMIC_YEAR && feesFor(ACADEMIC_YEAR).length ? (
            <button
              type="button"
              className="btn btn-soft mt-4"
              onClick={() => setRows(feesFor(ACADEMIC_YEAR).map(toRow))}
            >
              <Copy size={16} aria-hidden="true" /> Copy {ACADEMIC_YEAR} fees to start
            </button>
          ) : null}
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {rows.map((row, index) => (
            <fieldset key={row.quota} className="rounded-2xl border border-line p-4">
              <div className="flex items-center justify-between gap-3">
                <legend className="font-semibold">{QUOTAS[row.quota]?.label ?? row.quota}</legend>
                <button
                  type="button"
                  onClick={() => setRows((rs) => rs.filter((_, i) => i !== index))}
                  className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-danger-soft hover:text-danger"
                  aria-label={`Remove ${QUOTAS[row.quota]?.label ?? row.quota}`}
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {[
                  ['tuition_per_year', 'Tuition / year'],
                  ['hostel_per_year', 'Hostel / year'],
                  ['one_time_fees', 'One-time fees'],
                ].map(([key, label]) => (
                  <div key={key}>
                    <label htmlFor={`fee-${row.quota}-${key}`} className="mb-1 block text-xs font-semibold text-muted">
                      {label}
                    </label>
                    <div className="relative">
                      <span
                        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
                        aria-hidden="true"
                      >
                        ₹
                      </span>
                      <input
                        id={`fee-${row.quota}-${key}`}
                        type="number"
                        inputMode="numeric"
                        min={0}
                        step={1000}
                        className="field pl-7 tabular-nums"
                        value={row[key]}
                        onChange={setCell(index, key)}
                      />
                    </div>
                    {row[key] !== '' ? <p className="mt-1 text-xs text-muted">{rupees(Number(row[key]))}</p> : null}
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <label htmlFor={`fee-${row.quota}-note`} className="mb-1 block text-xs font-semibold text-muted">
                  Note shown to visitors (optional)
                </label>
                <input
                  id={`fee-${row.quota}-note`}
                  className="field"
                  value={row.note}
                  onChange={setCell(index, 'note')}
                />
              </div>
              <p className="mt-3 text-sm">
                Whole course:{' '}
                <strong>
                  {compactRupees(
                    courseTotal(
                      {
                        tuition_per_year: Number(row.tuition_per_year) || 0,
                        hostel_per_year: Number(row.hostel_per_year) || 0,
                        one_time_fees: Number(row.one_time_fees) || 0,
                      },
                      streamOf(college).years
                    )
                  )}
                </strong>
                <span className="text-muted"> ({streamOf(college).years} years + one-time)</span>
              </p>
            </fieldset>
          ))}
        </div>
      )}

      {unused.length ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted">Add a quota:</span>
          {unused.map((quota) => (
            <button
              key={quota}
              type="button"
              onClick={() =>
                setRows((rs) => [
                  ...rs,
                  { quota, tuition_per_year: '', hostel_per_year: '', one_time_fees: '', note: '', source_url: '' },
                ])
              }
              className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-sm font-semibold hover:bg-forest-50"
            >
              <Plus size={14} aria-hidden="true" /> {QUOTAS[quota].short}
            </button>
          ))}
        </div>
      ) : null}

      {state.error ? (
        <p role="alert" className="mt-4 rounded-xl bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
          {state.error}
        </p>
      ) : null}
      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-5">
        <button type="submit" className="btn btn-primary" disabled={state.busy}>
          {state.busy ? 'Saving…' : `Save ${year} fees`}
        </button>
        {state.savedAt ? (
          <span className="text-sm font-medium text-forest-700" role="status">
            Saved. The website shows the new fees now.
          </span>
        ) : null}
      </div>
    </form>
  );
}
