// Lead capture shared by every page:
// - openLead({ source, college }) opens the form dialog from anywhere
// - `unlocked` is true once this device has sent the form (remembered in
//   localStorage, a convenience only: the fee details aren't secret, the
//   form is how the agency gets the lead)

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const STORAGE_KEY = 'arivu-lead-sent';
const LeadContext = createContext(null);

const readUnlocked = () => {
  try {
    return Boolean(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return false;
  }
};

export function LeadProvider({ children }) {
  const [unlocked, setUnlocked] = useState(readUnlocked);
  const [request, setRequest] = useState(null); // { source, college, title } while the dialog is open

  const openLead = useCallback((options = {}) => setRequest({ source: 'hero', ...options }), []);
  const closeLead = useCallback(() => setRequest(null), []);
  const markSent = useCallback((name) => {
    setUnlocked(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ name, at: new Date().toISOString() }));
    } catch {
      /* private window: unlocked for this visit only */
    }
  }, []);

  const value = useMemo(
    () => ({ unlocked, request, openLead, closeLead, markSent }),
    [unlocked, request, openLead, closeLead, markSent]
  );
  return <LeadContext.Provider value={value}>{children}</LeadContext.Provider>;
}

export function useLead() {
  const context = useContext(LeadContext);
  if (!context) throw new Error('useLead must be used inside <LeadProvider>');
  return context;
}
