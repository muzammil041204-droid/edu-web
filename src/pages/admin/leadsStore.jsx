// Leads for the admin panel, shared by the dashboard and the leads page.
// Keeps itself up to date: Supabase Realtime (live) or storage events (demo).
// New leads that arrive while the panel is open are highlighted and announced.

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { listLeads, subscribeLeads } from '../../lib/api.js';

const LeadsContext = createContext(null);

export function LeadsProvider({ children }) {
  const [state, setState] = useState({ leads: [], loading: true, error: null });
  const [fresh, setFresh] = useState(() => new Set());
  const [toast, setToast] = useState(null);
  const known = useRef(null);

  const load = useCallback(async () => {
    try {
      const leads = await listLeads();
      if (known.current) {
        const arrived = leads.filter((lead) => !known.current.has(lead.id));
        if (arrived.length) {
          setFresh((prev) => new Set([...prev, ...arrived.map((l) => l.id)]));
          setToast({
            id: Date.now(),
            text: arrived.length === 1 ? `New lead: ${arrived[0].full_name}` : `${arrived.length} new leads`,
          });
        }
      }
      known.current = new Set(leads.map((l) => l.id));
      setState({ leads, loading: false, error: null });
    } catch (error) {
      setState((s) => ({ ...s, loading: false, error }));
    }
  }, []);

  useEffect(() => {
    load();
    return subscribeLeads(load);
  }, [load]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 6000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  // Local edits show straight away; the live update then confirms them.
  const patchLocal = useCallback((id, patch) => {
    setState((s) => ({ ...s, leads: s.leads.map((l) => (l.id === id ? { ...l, ...patch } : l)) }));
  }, []);
  const removeLocal = useCallback((id) => {
    setState((s) => ({ ...s, leads: s.leads.filter((l) => l.id !== id) }));
  }, []);

  const value = useMemo(
    () => ({ ...state, fresh, toast, reload: load, patchLocal, removeLocal, dismissToast: () => setToast(null) }),
    [state, fresh, toast, load, patchLocal, removeLocal]
  );
  return <LeadsContext.Provider value={value}>{children}</LeadsContext.Provider>;
}

export function useLeads() {
  const context = useContext(LeadsContext);
  if (!context) throw new Error('useLeads must be used inside <LeadsProvider>');
  return context;
}

export const leadWhatsapp = (lead) =>
  `https://wa.me/91${lead.whatsapp}?text=${encodeURIComponent(
    `Hi ${lead.full_name.split(' ')[0]}, this is Arivu Career & Admissions. Thank you for your enquiry. When is a good time to talk?`
  )}`;
