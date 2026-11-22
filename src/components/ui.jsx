// Small shared pieces: logo, buttons, section headings, photos, states.

import { ArrowUpRight, LoaderCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router';
import { photo } from '../data/site.js';

export function Logo({ light = false, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" aria-hidden="true">
        <rect width="40" height="40" rx="11" fill={light ? '#fff' : '#24473c'} />
        {/* A guiding star: four points, the north one longer. */}
        <path
          d="M20 6.5 22.6 17.4 33.5 20 22.6 22.6 20 33.5 17.4 22.6 6.5 20 17.4 17.4Z"
          fill={light ? '#24473c' : '#f6f4ef'}
        />
        <circle cx="20" cy="20" r="3.2" fill="#c9a45c" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className={`text-[1.05rem] font-extrabold tracking-tight ${light ? 'text-white' : 'text-forest-900'}`}>
          Arivu
        </span>
        <span
          className={`mt-1 text-[0.62rem] font-semibold tracking-[0.16em] uppercase ${light ? 'text-forest-200' : 'text-muted'}`}
        >
          Career & Admissions
        </span>
      </span>
    </span>
  );
}

// Pill button: <ButtonLink to="/x"> for navigation, <Button onClick> for actions.
export function ButtonLink({ to, href, variant = 'primary', icon = true, children, className = '', ...rest }) {
  const classes = `btn btn-${variant} ${className}`;
  const inner = (
    <>
      {children}
      {icon ? (
        <span className="btn-icon" aria-hidden="true">
          <ArrowUpRight size={15} strokeWidth={2.4} />
        </span>
      ) : null}
    </>
  );
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {inner}
      </a>
    );
  }
  return (
    <Link to={to} className={classes} {...rest}>
      {inner}
    </Link>
  );
}

export function Button({ variant = 'primary', icon = true, loading = false, children, className = '', ...rest }) {
  return (
    <button type="button" className={`btn btn-${variant} ${className}`} disabled={loading || rest.disabled} {...rest}>
      {children}
      {loading ? (
        <LoaderCircle size={18} className="animate-spin" aria-hidden="true" />
      ) : icon ? (
        <span className="btn-icon" aria-hidden="true">
          <ArrowUpRight size={15} strokeWidth={2.4} />
        </span>
      ) : null}
    </button>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  accent,
  after,
  text,
  align = 'center',
  className = '',
  as: H = 'h2',
}) {
  const centered = align === 'center';
  return (
    <div className={`${centered ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'} ${className}`}>
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <H className="mt-4 text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.1] font-bold">
        {title}
        {accent ? (
          <>
            {' '}
            <span className="accent">{accent}</span>
          </>
        ) : null}
        {after ? <> {after}</> : null}
      </H>
      {text ? (
        <p className={`mt-4 text-[1.0625rem] leading-relaxed text-muted ${centered ? 'mx-auto' : ''}`}>{text}</p>
      ) : null}
    </div>
  );
}

export function Photo({ id, alt, w = 1200, h, className = '', sizes, eager = false, ...rest }) {
  const external = /^https?:\/\//.test(id ?? '');
  const widths = [480, 800, 1200, 1600].filter((x) => x <= Math.max(w, 480) * 1.4);
  const ratio = h ? h / w : null;
  return (
    <img
      src={photo(id, w, h)}
      srcSet={
        external
          ? undefined
          : widths.map((x) => `${photo(id, x, ratio ? Math.round(x * ratio) : undefined)} ${x}w`).join(', ')
      }
      sizes={sizes ?? `(min-width: 1024px) ${Math.round(w / 1.5)}px, 100vw`}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : undefined}
      className={`bg-forest-100 object-cover ${className}`}
      {...rest}
    />
  );
}

export function LoadingBlock({ label = 'Loading…', className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-3 py-16 text-muted ${className}`} role="status">
      <LoaderCircle className="animate-spin" size={22} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function ErrorBlock({ message = 'Something went wrong while loading.', onRetry, className = '' }) {
  return (
    <div className={`card mx-auto max-w-lg p-8 text-center ${className}`} role="alert">
      <p className="font-semibold">{message}</p>
      <p className="mt-2 text-sm text-muted">Check your connection and try again.</p>
      {onRetry ? (
        <button type="button" onClick={onRetry} className="btn btn-soft mt-5">
          <RefreshCw size={16} aria-hidden="true" /> Try again
        </button>
      ) : null}
    </div>
  );
}
