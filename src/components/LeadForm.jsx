// The lead form: name, WhatsApp, email, stage, interest, score, category and
// consent. Used in the dialog and on the Contact page.
//
// Spam protection: a hidden "website" field that people never fill, plus the
// database's own checks and a per-number limit (see submit_lead in the migration).

import { useId, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { submitLead } from '../lib/api.js';
import { CATEGORY_OPTIONS, INTERESTS, STAGES, validateLead } from '../lib/validation.js';
import { Button } from './ui.jsx';

const EMPTY = {
  full_name: '',
  whatsapp: '',
  email: '',
  stage: '',
  interest: '',
  score_note: '',
  category: '',
  consent: false,
  website: '',
};

export default function LeadForm({
  source = 'hero',
  college = null,
  defaultInterest = '',
  submitLabel,
  onSuccess,
  compact = false,
}) {
  const id = useId();
  const location = useLocation();
  const [values, setValues] = useState(() => ({
    ...EMPTY,
    interest: defaultInterest || college?.stream || '',
    stage: college ? 'after_12' : '',
  }));
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | error
  const [serverError, setServerError] = useState('');

  const set = (name) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const found = validateLead(values);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0];
      event.currentTarget.querySelector(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus('sending');
    setServerError('');
    try {
      await submitLead({ ...values, source, college_id: college?.id ?? null, page: location.pathname });
      setStatus('idle');
      onSuccess?.(values);
    } catch (error) {
      setStatus('error');
      setServerError(error.message || 'Sorry, we could not send your details. Please try again.');
    }
  }

  const fieldProps = (name) => ({
    id: `${id}-${name}`,
    name,
    value: values[name],
    onChange: set(name),
    'aria-invalid': errors[name] ? 'true' : undefined,
    'aria-describedby': errors[name] ? `${id}-${name}-error` : undefined,
  });
  const errorText = (name) =>
    errors[name] ? (
      <p id={`${id}-${name}-error`} className="field-error">
        {errors[name]}
      </p>
    ) : null;

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4">
      <div className={`grid gap-4 ${compact ? '' : 'sm:grid-cols-2'}`}>
        <div className={compact ? '' : 'sm:col-span-2'}>
          <label className="field-label" htmlFor={`${id}-full_name`}>
            Student’s name
          </label>
          <input className="field" autoComplete="name" {...fieldProps('full_name')} />
          {errorText('full_name')}
        </div>
        <div>
          <label className="field-label" htmlFor={`${id}-whatsapp`}>
            WhatsApp number
          </label>
          <div className="flex">
            <span className="inline-flex items-center rounded-l-xl border border-r-0 border-[#cfd6d2] bg-forest-50 px-3 text-sm font-semibold text-muted">
              +91
            </span>
            <input
              className="field rounded-l-none"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              maxLength={14}
              placeholder="98765 43210"
              {...fieldProps('whatsapp')}
            />
          </div>
          {errorText('whatsapp')}
        </div>
        <div>
          <label className="field-label" htmlFor={`${id}-email`}>
            Email
          </label>
          <input
            className="field"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            {...fieldProps('email')}
          />
          {errorText('email')}
        </div>
        <div>
          <label className="field-label" htmlFor={`${id}-stage`}>
            The student is in
          </label>
          <select className="field" {...fieldProps('stage')}>
            <option value="">Choose…</option>
            {Object.entries(STAGES).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errorText('stage')}
        </div>
        <div>
          <label className="field-label" htmlFor={`${id}-interest`}>
            Looking for
          </label>
          <select className="field" {...fieldProps('interest')}>
            <option value="">Choose…</option>
            {Object.entries(INTERESTS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errorText('interest')}
        </div>
        <div>
          <label className="field-label" htmlFor={`${id}-score_note`}>
            Marks or exam score <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            className="field"
            maxLength={60}
            placeholder="e.g. NEET 545, JEE 92 %ile, 12th 88%"
            {...fieldProps('score_note')}
          />
          {errorText('score_note')}
        </div>
        <div>
          <label className="field-label" htmlFor={`${id}-category`}>
            Category <span className="font-normal text-muted">(optional)</span>
          </label>
          <select className="field" {...fieldProps('category')}>
            <option value="">Choose…</option>
            {CATEGORY_OPTIONS.map((group) => (
              <optgroup key={group.group} label={group.group}>
                {group.options.map((option) => (
                  <option key={`${group.group}-${option}`} value={option}>
                    {option}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      {/* Spam trap: hidden from people, often filled in by bots. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor={`${id}-website`}>Website</label>
        <input
          id={`${id}-website`}
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={set('website')}
        />
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm leading-relaxed text-muted" htmlFor={`${id}-consent`}>
          <input
            id={`${id}-consent`}
            name="consent"
            type="checkbox"
            checked={values.consent}
            onChange={set('consent')}
            aria-invalid={errors.consent ? 'true' : undefined}
            aria-describedby={errors.consent ? `${id}-consent-error` : undefined}
            className="mt-0.5 h-5 w-5 shrink-0 accent-forest-700"
          />
          <span>
            I agree that Arivu may contact me on WhatsApp, phone and email about admissions. See our{' '}
            <Link to="/privacy" className="font-semibold text-forest-700 underline underline-offset-2">
              privacy policy
            </Link>
            .
          </span>
        </label>
        {errorText('consent')}
      </div>

      {status === 'error' ? (
        <p className="rounded-xl bg-danger-soft px-4 py-3 text-sm font-medium text-danger" role="alert">
          {serverError}
        </p>
      ) : null}

      <Button type="submit" loading={status === 'sending'} className="w-full sm:w-auto sm:justify-self-start">
        {status === 'sending' ? 'Sending…' : (submitLabel ?? 'Book my free session')}
      </Button>
    </form>
  );
}
