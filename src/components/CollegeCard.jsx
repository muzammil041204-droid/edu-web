import { ArrowUpRight, BedDouble, Briefcase, CalendarDays, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router';
import { compactRupees } from '../lib/format.js';
import { currentFees, fromFee, OWNERSHIP, QUOTAS, streamOf } from '../lib/colleges.js';
import { Photo } from './ui.jsx';

export function PartnerBadge() {
  return (
    <span className="badge badge-partner" title="Arivu has a tie-up with this college">
      <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" fill="currentColor">
        <path d="M8 1.5l1.9 3.85 4.25.62-3.08 3 .73 4.23L8 11.2l-3.8 2 .73-4.23-3.08-3 4.25-.62L8 1.5Z" />
      </svg>
      Partner college
    </span>
  );
}

export function OwnershipBadge({ ownership }) {
  const tone =
    ownership === 'government' || ownership === 'central'
      ? 'bg-forest-100 text-forest-900'
      : ownership === 'deemed'
        ? 'bg-[#eef1f8] text-[#2c3e6b]'
        : 'bg-cream text-[#5b4a2c]';
  return <span className={`badge ${tone}`}>{OWNERSHIP[ownership] ?? ownership}</span>;
}

// List card: data first, like a college portal, with the starting fee prominent.
export default function CollegeCard({ college, headingLevel = 'h3' }) {
  const H = headingLevel;
  const from = fromFee(college);
  const quotas = currentFees(college).map((fee) => QUOTAS[fee.quota]?.short ?? fee.quota);
  const engineering = college.stream === 'engineering';
  return (
    <article className="group card relative flex flex-col overflow-hidden transition-shadow hover:shadow-[var(--shadow-soft)]">
      <div className="relative aspect-[16/9] overflow-hidden">
        <Photo
          id={college.image}
          alt=""
          w={640}
          h={360}
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span className="badge bg-forest-900 text-white">{streamOf(college).course}</span>
          <OwnershipBadge ownership={college.ownership} />
          {college.is_partner ? <PartnerBadge /> : null}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <H className="text-[1.0625rem] leading-snug font-bold">
          <Link to={`/colleges/${college.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {college.name}
          </Link>
        </H>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted">
          <MapPin size={15} aria-hidden="true" /> {college.city}, {college.state}
        </p>
        <dl className="mt-4 mb-5 grid grid-cols-3 gap-2 text-sm">
          <div className="rounded-xl bg-forest-50 px-3 py-2">
            <dt className="flex items-center gap-1 text-xs text-muted">
              <Users size={13} aria-hidden="true" /> Seats
            </dt>
            <dd className="mt-0.5 font-bold">{college.seats ?? '–'}</dd>
          </div>
          <div className="rounded-xl bg-forest-50 px-3 py-2">
            <dt className="flex items-center gap-1 text-xs text-muted">
              <CalendarDays size={13} aria-hidden="true" /> Since
            </dt>
            <dd className="mt-0.5 font-bold">{college.established ?? '–'}</dd>
          </div>
          <div className="rounded-xl bg-forest-50 px-3 py-2">
            {engineering ? (
              <>
                <dt className="flex items-center gap-1 text-xs text-muted">
                  <Briefcase size={13} aria-hidden="true" /> Avg. pay
                </dt>
                <dd className="mt-0.5 font-bold">{college.avg_package_lpa ? `₹${college.avg_package_lpa} L` : '–'}</dd>
              </>
            ) : (
              <>
                <dt className="flex items-center gap-1 text-xs text-muted">
                  <BedDouble size={13} aria-hidden="true" /> Beds
                </dt>
                <dd className="mt-0.5 font-bold">{college.beds ? college.beds.toLocaleString('en-IN') : '–'}</dd>
              </>
            )}
          </div>
        </dl>
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-line pt-4">
          <div>
            <p className="text-xs text-muted">Tuition from</p>
            <p className="text-lg font-bold text-forest-800">
              {from != null ? (
                <>
                  {compactRupees(from)}
                  <span className="text-sm font-medium text-muted"> / year</span>
                </>
              ) : (
                'On request'
              )}
            </p>
            {quotas.length ? <p className="mt-0.5 text-xs text-muted">{quotas.join(' · ')}</p> : null}
          </div>
          <span
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-forest-800 text-white transition-transform group-hover:rotate-45"
            aria-hidden="true"
          >
            <ArrowUpRight size={18} />
          </span>
        </div>
      </div>
    </article>
  );
}
