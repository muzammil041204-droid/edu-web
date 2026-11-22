import { ChevronDown, Cog, Globe2, Menu, Phone, Stethoscope, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { site, whatsappLink } from '../data/site.js';
import { startScroll, stopScroll } from '../lib/smoothScroll.jsx';
import { Logo } from './ui.jsx';

export const ADMISSIONS = [
  { to: '/medical', label: 'Medical', note: 'NEET · MBBS, BDS, AYUSH', icon: Stethoscope },
  { to: '/engineering', label: 'Engineering', note: 'JEE · JoSAA · TNEA', icon: Cog },
  { to: '/study-abroad', label: 'Study abroad', note: 'MBBS abroad · degrees abroad', icon: Globe2 },
];

export const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/career-guidance', label: 'Career Guidance' },
  { label: 'Admissions', children: ADMISSIONS },
  { to: '/colleges', label: 'Colleges' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const pill = (isActive) =>
  `on-dark flex items-center gap-1.5 rounded-full px-4 py-2 text-[0.875rem] font-semibold whitespace-nowrap transition-colors ${
    isActive ? 'bg-white text-forest-900' : 'text-white/85 hover:bg-white/10 hover:text-white'
  }`;

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Close the phone menu whenever the page changes.
  const [lastPath, setLastPath] = useState(location.pathname);
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    stopScroll();
    menuRef.current?.querySelector('a')?.focus();
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      startScroll();
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,box-shadow] duration-300 ${
        scrolled ? 'bg-white/90 shadow-[0_1px_0_var(--color-line)] backdrop-blur-md' : 'bg-white'
      }`}
    >
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-4 lg:h-20">
        <Link to="/" className="shrink-0 rounded-lg" aria-label={`${site.name}, home`}>
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-0.5 rounded-full bg-forest-800 p-1.5">
            {NAV.map((item) =>
              item.children ? (
                <li key={item.label}>
                  <Dropdown item={item} pathname={location.pathname} />
                </li>
              ) : (
                <li key={item.to}>
                  <NavLink to={item.to} end={item.end} className={({ isActive }) => pill(isActive)}>
                    {item.label}
                  </NavLink>
                </li>
              )
            )}
            <li className="hidden 2xl:block">
              <a
                href={site.phoneHref}
                className="on-dark ml-1 flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-[0.875rem] font-semibold whitespace-nowrap text-white hover:bg-white/10"
              >
                <Phone size={15} aria-hidden="true" />
                {site.phone}
              </a>
            </li>
          </ul>
        </nav>

        <button
          ref={buttonRef}
          type="button"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-forest-800 px-4 text-sm font-semibold text-white lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {open ? (
        <div
          id="mobile-menu"
          ref={menuRef}
          className="on-dark fixed inset-x-0 top-[4.5rem] bottom-0 z-40 overflow-y-auto bg-forest-900 px-4 pt-6 pb-10 text-white lg:hidden"
        >
          <nav aria-label="Main">
            <ul className="space-y-1">
              {NAV.map((item) =>
                item.children ? (
                  <li key={item.label} className="pt-3">
                    <p className="px-4 pb-1 text-xs font-bold tracking-wide text-forest-200 uppercase">{item.label}</p>
                    <ul>
                      {item.children.map((child) => (
                        <li key={child.to}>
                          <NavLink
                            to={child.to}
                            className={({ isActive }) =>
                              `flex items-center gap-3 rounded-2xl px-4 py-3 text-lg font-semibold ${isActive ? 'bg-white text-forest-900' : 'hover:bg-white/10'}`
                            }
                          >
                            <child.icon size={20} aria-hidden="true" />
                            {child.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </li>
                ) : (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        `block rounded-2xl px-4 py-3.5 text-xl font-semibold ${isActive ? 'bg-white text-forest-900' : 'hover:bg-white/10'}`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                )
              )}
            </ul>
          </nav>
          <div className="mt-8 grid gap-3 border-t border-white/15 pt-8">
            <a href={site.phoneHref} className="btn btn-outline-light justify-start">
              <Phone size={18} aria-hidden="true" /> Call {site.phone}
            </a>
            <a href={whatsappLink()} className="btn btn-light justify-start" target="_blank" rel="noreferrer">
              Chat on WhatsApp
            </a>
            <p className="mt-2 text-sm text-white/70">{site.hours}</p>
          </div>
        </div>
      ) : null}
    </header>
  );
}

// "Admissions" menu: opens on click (or Enter/Space), closes on Escape, on a
// click outside, when focus leaves it, or when a link is chosen.
function Dropdown({ item, pathname }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const active = item.children.some((child) => pathname.startsWith(child.to));

  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative"
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-menu`}
        onClick={() => setOpen((v) => !v)}
        className={pill(active || open)}
      >
        {item.label}
        <ChevronDown size={15} className={`transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {open ? (
        <ul
          id={`${id}-menu`}
          className="absolute top-[calc(100%+0.6rem)] left-1/2 w-72 -translate-x-1/2 rounded-2xl border border-line bg-white p-2 shadow-[var(--shadow-lift)]"
        >
          {item.children.map((child) => (
            <li key={child.to}>
              <NavLink
                to={child.to}
                className={({ isActive }) =>
                  `flex items-start gap-3 rounded-xl px-3 py-2.5 ${isActive ? 'bg-forest-50' : 'hover:bg-forest-50'}`
                }
              >
                <span
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-forest-100 text-forest-800"
                  aria-hidden="true"
                >
                  <child.icon size={18} />
                </span>
                <span>
                  <span className="block text-[0.9375rem] font-semibold text-ink">{child.label}</span>
                  <span className="block text-xs text-muted">{child.note}</span>
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
