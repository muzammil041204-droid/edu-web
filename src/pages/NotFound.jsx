import { ButtonLink } from '../components/ui.jsx';
import { useTitle } from '../lib/useAsync.js';

export default function NotFound() {
  useTitle('Page not found');
  return (
    <section className="py-24 sm:py-32">
      <div className="container-page max-w-2xl text-center">
        <p className="text-7xl font-bold text-forest-200">404</p>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
          This page has <span className="accent">moved or never existed</span>
        </h1>
        <p className="mt-4 text-lg text-muted">
          The link may be old, or the college may no longer be listed. Try the college list, or talk to a counsellor.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink to="/colleges">Browse colleges</ButtonLink>
          <ButtonLink to="/" variant="soft" icon={false}>
            Back to home
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
