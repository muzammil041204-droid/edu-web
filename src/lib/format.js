// Indian money formatting: ₹4,35,000 / ₹4.35 L / ₹1.2 Cr.

const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

export const rupees = (n) => (n == null || Number.isNaN(n) ? '–' : `₹${inr.format(Math.round(n))}`);

export function compactRupees(n) {
  if (n == null || Number.isNaN(n)) return '–';
  if (n >= 1_00_00_000) return `₹${trim(n / 1_00_00_000)} Cr`;
  if (n >= 1_00_000) return `₹${trim(n / 1_00_000)} L`;
  if (n >= 1_000) return `₹${trim(n / 1_000)}K`;
  return rupees(n);
}

const trim = (v) => (v >= 100 ? Math.round(v).toString() : v.toFixed(2).replace(/\.?0+$/, ''));

export const dateLabel = (iso, opts = { day: 'numeric', month: 'short', year: 'numeric' }) =>
  iso ? new Date(iso).toLocaleDateString('en-IN', opts) : '–';

export const dateTimeLabel = (iso) =>
  iso
    ? new Date(iso).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: '2-digit',
      })
    : '–';

export function relativeDay(iso) {
  if (!iso) return '';
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days} days ago`;
  return dateLabel(iso);
}

export const initials = (name = '') =>
  name
    .replace(/^Dr\.?\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
