import { Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { ErrorBlock, LoadingBlock } from '../../components/ui.jsx';
import { adminListColleges, saveCollege } from '../../lib/api.js';
import { fromFee, lastUpdated, OWNERSHIP, STREAMS, streamOf } from '../../lib/colleges.js';
import { compactRupees, relativeDay } from '../../lib/format.js';
import { useAsync } from '../../lib/useAsync.js';
import { AdminTitle } from './adminUi.jsx';

export default function CollegesAdmin() {
  const { data, error, loading, reload } = useAsync(adminListColleges, []);
  const [q, setQ] = useState('');
  const [stream, setStream] = useState('');
  const [busy, setBusy] = useState(null);
  const [actionError, setActionError] = useState('');

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (data ?? []).filter(
      (c) =>
        (!stream || c.stream === stream) && (!term || `${c.name} ${c.city} ${c.state}`.toLowerCase().includes(term))
    );
  }, [data, q, stream]);

  async function toggle(college, field) {
    setBusy(`${college.id}-${field}`);
    setActionError('');
    try {
      await saveCollege({ id: college.id, [field]: !college[field] });
      reload();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <AdminTitle
        title="Colleges & fees"
        text="Edit a college to change its fees. Changes show on the website straight away."
      >
        <Link to="/admin/colleges/new" className="btn btn-primary">
          <Plus size={16} aria-hidden="true" /> Add college
        </Link>
      </AdminTitle>

      <div className="card mb-5 flex flex-wrap items-center gap-3 p-4">
        <label htmlFor="college-admin-search" className="sr-only">
          Search colleges
        </label>
        <div className="relative w-full max-w-md">
          <Search
            size={18}
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            id="college-admin-search"
            type="search"
            className="field pl-10"
            placeholder="Search by name, city or state"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <label htmlFor="college-admin-stream" className="sr-only">
          Stream
        </label>
        <select
          id="college-admin-stream"
          className="field w-auto"
          value={stream}
          onChange={(e) => setStream(e.target.value)}
        >
          <option value="">All streams</option>
          {Object.entries(STREAMS).map(([value, info]) => (
            <option key={value} value={value}>
              {info.label}
            </option>
          ))}
        </select>
      </div>

      {actionError ? (
        <p role="alert" className="mb-4 rounded-xl bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
          {actionError}
        </p>
      ) : null}

      {loading ? (
        <LoadingBlock label="Loading colleges…" />
      ) : error ? (
        <ErrorBlock message="Couldn’t load colleges." onRetry={reload} />
      ) : (
        <div className="table-wrap">
          <table className="data-table text-sm">
            <caption className="sr-only">Colleges</caption>
            <thead>
              <tr>
                <th scope="col">College</th>
                <th scope="col">Type</th>
                <th scope="col" className="num">
                  Tuition from
                </th>
                <th scope="col">Fees updated</th>
                <th scope="col">Partner</th>
                <th scope="col">On website</th>
                <th scope="col">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((college) => {
                const from = fromFee(college);
                const updated = lastUpdated(college);
                return (
                  <tr key={college.id}>
                    <th scope="row" className="font-normal whitespace-normal">
                      <Link
                        to={`/admin/colleges/${college.id}`}
                        className="block font-semibold hover:text-forest-700 hover:underline"
                      >
                        {college.name}
                      </Link>
                      <span className="text-xs text-muted">
                        {streamOf(college).course} · {college.city}, {college.state}
                      </span>
                    </th>
                    <td>{OWNERSHIP[college.ownership]}</td>
                    <td className="num font-semibold">{from != null ? `${compactRupees(from)} / yr` : '–'}</td>
                    <td className="text-muted">{updated ? relativeDay(updated) : 'No fees yet'}</td>
                    <td>
                      <Toggle
                        checked={college.is_partner}
                        label={`Partner college: ${college.name}`}
                        busy={busy === `${college.id}-is_partner`}
                        onChange={() => toggle(college, 'is_partner')}
                      />
                    </td>
                    <td>
                      <Toggle
                        checked={college.is_published}
                        label={`Show ${college.name} on the website`}
                        busy={busy === `${college.id}-is_published`}
                        onChange={() => toggle(college, 'is_published')}
                      />
                    </td>
                    <td>
                      <Link
                        to={`/admin/colleges/${college.id}`}
                        className="rounded-full px-3 py-1.5 font-semibold text-forest-700 hover:bg-forest-50"
                      >
                        Edit fees
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export function Toggle({ checked, onChange, label, busy = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={busy}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-60 ${checked ? 'bg-forest-700' : 'bg-[#c9d1cd]'}`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5.5' : 'translate-x-0.5'}`}
      />
      <span className="sr-only">{checked ? 'On' : 'Off'}</span>
    </button>
  );
}
