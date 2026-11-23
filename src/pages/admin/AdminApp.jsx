// The admin panel: sign-in, then dashboard, leads, and colleges & fees.
// Loaded as its own bundle, only on /admin.

import {
  BellRing,
  Building2,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  MessageSquareQuote,
  RotateCcw,
  Users,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, Navigate, NavLink, Route, Routes } from 'react-router';
import { Logo } from '../../components/ui.jsx';
import { getAdminSession, isDemo, resetDemo, signOut } from '../../lib/api.js';
import CollegeEditor from './CollegeEditor.jsx';
import CollegesAdmin from './CollegesAdmin.jsx';
import Dashboard from './Dashboard.jsx';
import Leads from './Leads.jsx';
import { LeadsProvider, useLeads } from './leadsStore.jsx';
import Login from './Login.jsx';
import StoriesAdmin from './StoriesAdmin.jsx';

export default function AdminApp() {
  const [session, setSession] = useState(undefined); // undefined while checking

  useEffect(() => {
    document.title = 'Admin · Arivu Career & Admissions';
    getAdminSession()
      .then((s) => setSession(s ?? null))
      .catch(() => setSession(null));
  }, []);

  if (session === undefined) {
    return (
      <div className="grid min-h-dvh place-items-center bg-forest-50 text-muted" role="status">
        Checking your sign-in…
      </div>
    );
  }
  if (!session) return <Login onSignedIn={setSession} />;

  return (
    <LeadsProvider>
      <Shell
        session={session}
        onSignOut={async () => {
          await signOut();
          setSession(null);
        }}
      >
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="leads" element={<Leads />} />
          <Route path="colleges" element={<CollegesAdmin />} />
          <Route path="colleges/new" element={<CollegeEditor />} />
          <Route path="colleges/:id" element={<CollegeEditor editor={session.email} />} />
          <Route path="stories" element={<StoriesAdmin />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </Shell>
    </LeadsProvider>
  );
}

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/leads', label: 'Leads', icon: Users },
  { to: '/admin/colleges', label: 'Colleges & fees', icon: Building2 },
  { to: '/admin/stories', label: 'Reviews & videos', icon: MessageSquareQuote },
];

function Shell({ session, onSignOut, children }) {
  const { leads, toast, dismissToast } = useLeads();
  const newCount = leads.filter((l) => l.status === 'new').length;

  return (
    <div className="min-h-dvh bg-[#f4f6f5] lg:grid lg:grid-cols-[16rem_1fr]">
      <a href="#admin-main" className="skip-link">
        Skip to content
      </a>
      <aside className="on-dark bg-forest-900 text-white lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col">
        <div className="flex items-center justify-between gap-4 px-4 py-4 lg:px-5 lg:py-6">
          <Link to="/admin" className="rounded-lg" aria-label="Admin dashboard">
            <Logo light />
          </Link>
          <button
            type="button"
            onClick={onSignOut}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-white/80 hover:bg-white/10 lg:hidden"
          >
            <LogOut size={16} aria-hidden="true" /> Sign out
          </button>
        </div>
        <nav aria-label="Admin" className="overflow-x-auto px-3 pb-3 lg:flex-1 lg:px-3">
          <ul className="flex gap-1 lg:flex-col">
            {NAV.map(({ to, label, icon: Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[0.9375rem] font-semibold whitespace-nowrap ${
                      isActive ? 'bg-white text-forest-900' : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <Icon size={18} aria-hidden="true" />
                  {label}
                  {label === 'Leads' && newCount ? (
                    <span className="ml-auto rounded-full bg-gold px-2 py-0.5 text-xs font-bold text-white">
                      {newCount}
                    </span>
                  ) : null}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden border-t border-white/10 p-4 lg:block">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/10"
          >
            <ExternalLink size={16} aria-hidden="true" /> View website
          </Link>
          <p className="mt-3 truncate px-3 text-xs text-white/55" title={session.email}>
            Signed in as {session.email}
          </p>
          <button
            type="button"
            onClick={onSignOut}
            className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/10"
          >
            <LogOut size={16} aria-hidden="true" /> Sign out
          </button>
        </div>
      </aside>

      <div className="min-w-0">
        {isDemo ? (
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ead7b0] bg-gold-soft px-4 py-2.5 text-sm text-[#5b4a2c] sm:px-8">
            <p>
              <strong>Demo mode:</strong> leads and fee changes are saved in this browser only. Connect Supabase to go
              live.
            </p>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset all demo data (leads, colleges and fees) to the original sample?'))
                  resetDemo();
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#ead7b0] bg-white px-3 py-1.5 font-semibold hover:bg-[#fffaf0]"
            >
              <RotateCcw size={14} aria-hidden="true" /> Reset demo data
            </button>
          </div>
        ) : null}
        <main id="admin-main" tabIndex={-1} className="px-4 py-6 outline-none sm:px-8 sm:py-8">
          {children}
        </main>
      </div>

      <div aria-live="polite" className="pointer-events-none fixed right-4 bottom-4 z-50">
        {toast ? (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center gap-3 rounded-2xl bg-forest-900 py-3 pr-3 pl-4 text-white shadow-[var(--shadow-lift)]"
          >
            <BellRing size={18} className="text-forest-200" aria-hidden="true" />
            <Link to="/admin/leads" className="font-semibold hover:underline">
              {toast.text}
            </Link>
            <button
              type="button"
              onClick={dismissToast}
              className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/10"
              aria-label="Dismiss"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
