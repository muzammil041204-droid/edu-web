import { useCallback, useEffect, useState } from 'react';

// Runs an async loader and tracks { data, error, loading }. `reload` re-runs it.
export function useAsync(loader, deps) {
  const [state, setState] = useState({ data: undefined, error: null, loading: true });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;
    loader()
      .then((data) => active && setState({ data, error: null, loading: false }))
      .catch((error) => active && setState({ data: undefined, error, loading: false }));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  return { ...state, reload };
}

// The current time, refreshed every minute (keeps "today" / "7 days" filters
// right without calling Date.now() during render).
export function useNow(intervalMs = 60_000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs]);
  return now;
}

// Sets the browser tab title for a page.
export function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Arivu Career & Admissions` : 'Arivu Career & Admissions';
  }, [title]);
}
