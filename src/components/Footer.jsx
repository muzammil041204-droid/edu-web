import { Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router';
import { photos, site, whatsappLink } from '../data/site.js';
import { useLead } from '../lib/leadContext.jsx';
import { Button, Logo, Photo } from './ui.jsx';
import { WhatsAppIcon } from './WhatsAppButton.jsx';

const COLUMNS = [
  {
    title: 'Explore',
    links: [
      ['Home', '/'],
      ['Colleges & fees', '/colleges'],
      ['About us', '/about'],
      ['Contact', '/contact'],
    ],
  },
  {
    title: 'Guides',
    links: [
      ['Career guidance', '/career-guidance'],
      ['Medical admissions', '/medical'],
      ['Engineering admissions', '/engineering'],
      ['Study abroad', '/study-abroad'],
      ['Partner colleges', '/colleges?partner=1'],
    ],
  },
];

const OFFICIAL = [
  ['NTA (NEET, JEE, CUET)', 'https://nta.ac.in'],
  ['JoSAA', 'https://josaa.nic.in'],
  ['TNEA', 'https://www.tneaonline.org'],
  ['MCC counselling', 'https://mcc.nic.in'],
  ['TN Selection Committee', 'https://tnmedicalselection.net'],
  ['National Medical Commission', 'https://www.nmc.org.in'],
];

export default function Footer() {
  const { openLead } = useLead();
  return (
    <footer className="mt-24 sm:mt-32">
      {/* Closing call to action, overlapping the green footer (as in the reference). */}
      <div className="container-page relative z-10 -mb-24 sm:-mb-28">
        <div className="relative overflow-hidden rounded-[var(--radius-photo)] border border-line bg-white px-6 py-12 text-center shadow-[var(--shadow-soft)] sm:px-12 sm:py-16">
          <Photo
            id={photos.whiteCoats}
            alt=""
            w={1600}
            h={700}
            className="absolute inset-0 h-full w-full opacity-30 blur-[2px]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#fff_35%,rgb(255_255_255/0.75)_70%,rgb(255_255_255/0.35))]" />
          <div className="relative">
            <h2 className="mx-auto max-w-xl text-[clamp(1.75rem,3.6vw,2.6rem)] leading-tight font-bold">
              Start with the right <span className="accent">first step</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted">
              One free session with a counsellor: where the student stands, the options that fit, and the next three
              things to do.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button onClick={() => openLead({ source: 'cta' })}>Book a free session</Button>
              <a href={whatsappLink()} target="_blank" rel="noreferrer" className="btn btn-soft">
                <WhatsAppIcon size={20} /> WhatsApp us
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="on-dark bg-forest-900 pt-36 text-white sm:pt-40">
        <div className="container-page grid gap-10 pb-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          <div>
            <Link to="/" className="inline-block rounded-lg" aria-label={`${site.name}, home`}>
              <Logo light />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/70">
              Career guidance and admission help for medicine, engineering and every other course, in Tamil Nadu, across
              India and abroad. Guiding families since {site.since}.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {Object.entries(site.social).map(([name, href]) => (
                <li key={name}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 items-center rounded-full border border-white/20 px-4 text-sm font-semibold capitalize hover:bg-white/10"
                  >
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="text-sm font-bold tracking-wide text-forest-200 uppercase">{col.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {col.links.map(([label, to]) => (
                  <li key={to}>
                    <Link to={to} className="text-white/80 hover:text-white hover:underline hover:underline-offset-4">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className="text-sm font-bold tracking-wide text-forest-200 uppercase">Talk to us</h2>
            <ul className="mt-4 space-y-3 text-white/80">
              <li className="flex gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-forest-200" aria-hidden="true" />
                <a href={site.phoneHref} className="hover:text-white">
                  {site.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-forest-200" aria-hidden="true" />
                <a href={`mailto:${site.email}`} className="hover:text-white">
                  {site.email}
                </a>
              </li>
              <li className="flex gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-forest-200" aria-hidden="true" />
                <address className="not-italic">
                  {site.address.join(', ')}
                  <span className="mt-1 block text-sm text-white/60">{site.hours}</span>
                </address>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="container-page py-6">
            <p className="text-xs text-white/55">
              Official sites:{' '}
              {OFFICIAL.map(([label, href], i) => (
                <span key={href}>
                  {i ? ' · ' : ''}
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="underline-offset-2 hover:text-white hover:underline"
                  >
                    {label}
                  </a>
                </span>
              ))}
            </p>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="container-page flex flex-col gap-3 py-6 pb-24 text-sm text-white/60 lg:flex-row lg:items-center lg:justify-between lg:pr-48 lg:pb-6">
            <p>
              © {new Date().getFullYear()} {site.name}. Demo build: names, numbers and fees are sample content.
            </p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              <li>
                <Link to="/privacy" className="hover:text-white">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white">
                  Staff login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
