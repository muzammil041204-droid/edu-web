import { CheckCircle2, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import LeadForm from '../components/LeadForm.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { WhatsAppIcon } from '../components/WhatsAppButton.jsx';
import { site, whatsappLink } from '../data/site.js';
import { useLead } from '../lib/leadContext.jsx';
import { useTitle } from '../lib/useAsync.js';

export default function Contact() {
  useTitle('Contact');
  const { markSent } = useLead();
  const [sent, setSent] = useState(null);

  return (
    <>
      <PageHeader
        crumbs={[['Contact']]}
        eyebrow="Free first session"
        title="Talk to a"
        accent="counsellor"
        text="Send the form and we’ll WhatsApp you within working hours. Prefer to talk now? Call or WhatsApp us directly."
      />
      <section className="pb-8">
        <div className="container-page grid gap-8 lg:grid-cols-[1.25fr_1fr]">
          <div className="card p-6 sm:p-8">
            {sent ? (
              <div role="status">
                <CheckCircle2 size={36} className="text-forest-700" aria-hidden="true" />
                <h2 className="mt-4 text-2xl font-bold">Thank you, {sent.split(' ')[0]}</h2>
                <p className="mt-2 text-muted">
                  We’ve got your details. A counsellor will message you on WhatsApp within working hours ({site.hours}).
                </p>
                <a href={whatsappLink()} target="_blank" rel="noreferrer" className="btn btn-primary mt-6">
                  <WhatsAppIcon size={20} /> Chat now on WhatsApp
                </a>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold">Book a free counselling call</h2>
                <div className="mt-6">
                  <LeadForm
                    source="contact"
                    onSuccess={(values) => {
                      markSent(values.full_name);
                      setSent(values.full_name.trim());
                    }}
                  />
                </div>
              </>
            )}
          </div>

          <div className="space-y-5">
            <div className="on-dark rounded-[var(--radius-card)] bg-forest-800 p-6 text-white sm:p-8">
              <h2 className="text-xl font-bold">Head office</h2>
              <ul className="mt-5 space-y-4 text-white/85">
                <li className="flex gap-3">
                  <MapPin size={19} className="mt-0.5 shrink-0 text-forest-200" aria-hidden="true" />
                  <address className="not-italic">{site.address.join(', ')}</address>
                </li>
                <li className="flex gap-3">
                  <Phone size={19} className="mt-0.5 shrink-0 text-forest-200" aria-hidden="true" />
                  <a href={site.phoneHref} className="hover:underline">
                    {site.phone}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Mail size={19} className="mt-0.5 shrink-0 text-forest-200" aria-hidden="true" />
                  <a href={`mailto:${site.email}`} className="hover:underline">
                    {site.email}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Clock size={19} className="mt-0.5 shrink-0 text-forest-200" aria-hidden="true" />
                  {site.hours}
                </li>
              </ul>
              <a href={whatsappLink()} target="_blank" rel="noreferrer" className="btn btn-light mt-7 w-full">
                <WhatsAppIcon size={20} /> WhatsApp us
              </a>
            </div>
            <div className="card p-6">
              <h2 className="font-bold">Branches</h2>
              <p className="mt-2 text-muted">{site.branches.join(' · ')}</p>
              <p className="mt-2 text-sm text-muted">Visits by appointment. Book through the form or WhatsApp.</p>
            </div>
            <div className="overflow-hidden rounded-[var(--radius-card)] border border-line">
              <iframe
                title="Map: Arivu office, Anna Nagar East, Chennai"
                src={`https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&output=embed`}
                className="block h-64 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
