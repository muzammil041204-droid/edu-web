import { LEAD_STATUSES } from '../../lib/validation.js';

export function AdminTitle({ title, text, children }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold sm:text-[1.75rem]">{title}</h1>
        {text ? <p className="mt-1 text-muted">{text}</p> : null}
      </div>
      {children ? <div className="flex flex-wrap gap-2">{children}</div> : null}
    </div>
  );
}

// Status shown with a dot + text, so it never relies on colour alone.
const TONES = {
  new: 'bg-gold-soft text-[#7a5717] border-[#ead7b0]',
  contacted: 'bg-[#eef1f8] text-[#2c3e6b] border-[#d9e0ef]',
  counselling_booked: 'bg-forest-100 text-forest-900 border-forest-200',
  applied: 'bg-forest-100 text-forest-900 border-forest-200',
  admitted: 'bg-forest-800 text-white border-forest-800',
  not_interested: 'bg-[#f1f2f1] text-muted border-line',
};

export function StatusBadge({ status }) {
  return (
    <span className={`badge border ${TONES[status] ?? TONES.not_interested}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {LEAD_STATUSES[status] ?? status}
    </span>
  );
}
