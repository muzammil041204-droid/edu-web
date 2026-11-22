import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import SplitText from './bits/SplitText.jsx';

// Top of inner pages: breadcrumb, eyebrow, title with accent word, intro.
export default function PageHeader({ crumbs = [], eyebrow, title, accent, text, children }) {
  return (
    <section className="bg-white pt-6 pb-12 sm:pt-10 sm:pb-16">
      <div className="container-page">
        {crumbs.length ? (
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link to="/" className="hover:text-forest-800 hover:underline">
                  Home
                </Link>
              </li>
              {crumbs.map(([label, to]) => (
                <li key={label} className="flex items-center gap-1.5">
                  <ChevronRight size={14} aria-hidden="true" />
                  {to ? (
                    <Link to={to} className="hover:text-forest-800 hover:underline">
                      {label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="font-semibold text-ink">
                      {label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h1 className="mt-4 max-w-4xl text-[clamp(2.1rem,5vw,3.6rem)] leading-[1.05] font-bold">
          <SplitText text={title} />
          {accent ? (
            <>
              {' '}
              <SplitText text={accent} className="accent" startAt={0.25} />
            </>
          ) : null}
        </h1>
        {text ? <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{text}</p> : null}
        {children}
      </div>
    </section>
  );
}
