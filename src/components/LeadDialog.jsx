// The lead form in a dialog, opened from anywhere with useLead().openLead().
// Uses the native <dialog>: focus stays inside, Escape closes it.

import { CheckCircle2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { whatsappLink } from '../data/site.js';
import { useLead } from '../lib/leadContext.jsx';
import { startScroll, stopScroll } from '../lib/smoothScroll.jsx';
import LeadForm from './LeadForm.jsx';
import { WhatsAppIcon } from './WhatsAppButton.jsx';

const COPY = {
  fee_breakup: (college) => ({
    title: 'See the full fee breakup',
    text: `Tuition, hostel and one-time fees for every quota at ${college?.name ?? 'this college'}, plus a counsellor to explain them.`,
  }),
  cutoffs: (college) => ({
    title: 'See last year’s cutoffs',
    text: `Closing ranks by category for ${college?.name ?? 'this college'}, and what your score could get you.`,
  }),
  abroad: () => ({
    title: 'Get the study abroad guide',
    text: 'Country-by-country costs, NMC-compliant universities for MBBS, and a call with our abroad counsellor.',
  }),
  career: () => ({
    title: 'Book a career guidance session',
    text: 'The first session is free. Tell us where the student is now and a counsellor will WhatsApp you to fix a time.',
  }),
  seminar: () => ({
    title: 'Reserve a seat at the seminar',
    text: 'Free entry for students and parents. We’ll send the venue and YouTube link on WhatsApp.',
  }),
  default: () => ({
    title: 'Book a free session',
    text: 'Tell us a little about the student. A counsellor will WhatsApp you within working hours.',
  }),
};

export default function LeadDialog() {
  const { request, closeLead, markSent } = useLead();
  const dialogRef = useRef(null);
  const [sentName, setSentName] = useState(null);
  const [shownFor, setShownFor] = useState(request);

  // Reset the success view each time the dialog opens for a new request.
  if (shownFor !== request) {
    setShownFor(request);
    setSentName(null);
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    if (request && !dialog.open) {
      dialog.showModal();
      stopScroll();
      return () => startScroll();
    }
    if (!request && dialog.open) dialog.close();
    return undefined;
  }, [request]);

  const copy = (COPY[request?.source] ?? COPY.default)(request?.college);

  return (
    <dialog
      ref={dialogRef}
      onClose={closeLead}
      onClick={(event) => {
        if (event.target === dialogRef.current) closeLead();
      }}
      aria-labelledby="lead-dialog-title"
      className="m-auto w-[calc(100%-2rem)] max-w-xl overflow-visible bg-transparent p-0 backdrop:bg-forest-950/60 backdrop:backdrop-blur-sm"
    >
      {request ? (
        <div className="max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-[1.5rem] bg-white p-5 shadow-[var(--shadow-lift)] sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="lead-dialog-title" className="text-2xl font-bold">
                {sentName ? `Thank you, ${sentName.split(' ')[0]}` : copy.title}
              </h2>
              {!sentName ? <p className="mt-2 text-muted">{copy.text}</p> : null}
            </div>
            <button
              type="button"
              onClick={closeLead}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-forest-50 text-forest-900 hover:bg-forest-100"
              aria-label="Close"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          {sentName ? (
            <div className="mt-6" role="status">
              <div className="flex gap-3 rounded-2xl bg-forest-50 p-4">
                <CheckCircle2 className="mt-0.5 shrink-0 text-forest-700" aria-hidden="true" />
                <p className="text-forest-900">
                  We’ve got your details. A counsellor will message you on WhatsApp within working hours (Mon–Sat, 9:30
                  am – 7 pm).
                  {request.college ? ' The full fee breakup and cutoffs are now open on the college page.' : ''}
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={whatsappLink()} target="_blank" rel="noreferrer" className="btn btn-primary">
                  <WhatsAppIcon size={20} /> Chat now on WhatsApp
                </a>
                <button type="button" onClick={closeLead} className="btn btn-soft">
                  {request.college ? 'See the fees' : 'Close'}
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6">
              <LeadForm
                source={request.source}
                college={request.college}
                defaultInterest={request.interest}
                submitLabel={request.college ? 'Show me the fees' : undefined}
                onSuccess={(values) => {
                  markSent(values.full_name);
                  setSentName(values.full_name.trim());
                }}
              />
            </div>
          )}
        </div>
      ) : null}
    </dialog>
  );
}
