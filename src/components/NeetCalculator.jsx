// NEET-UG score calculator.
// Pattern (since NEET 2025): 180 compulsory questions, 45 each in Physics,
// Chemistry, Botany and Zoology. +4 for a correct answer, −1 for a wrong one,
// 0 for unanswered. Maximum 720.

import { Calculator } from 'lucide-react';
import { useId, useState } from 'react';
import { useLead } from '../lib/leadContext.jsx';
import { Button } from './ui.jsx';

export const NEET_SUBJECTS = [
  ['physics', 'Physics'],
  ['chemistry', 'Chemistry'],
  ['botany', 'Botany'],
  ['zoology', 'Zoology'],
];
const PER_SUBJECT = 45;
const MAX = NEET_SUBJECTS.length * PER_SUBJECT * 4;

// Broad guide only: cutoffs move every year and differ by category.
const BANDS = [
  [650, 'AIIMS, JIPMER and the top government colleges are realistic.'],
  [600, 'Most government colleges in Tamil Nadu are realistic, and good all-India quota chances.'],
  [520, 'Government-quota seats in private colleges, and government colleges in many reserved categories.'],
  [420, 'Management-quota and deemed university seats, and government seats in some reserved categories.'],
  [150, 'Usually above the qualifying mark: deemed universities, management quota, BDS, AYUSH or MBBS abroad.'],
  [-Infinity, 'May be below the qualifying mark. Talk to us about BDS, AYUSH, allied health or a second attempt.'],
];

const blank = () => Object.fromEntries(NEET_SUBJECTS.map(([key]) => [key, { correct: '', wrong: '' }]));
const toNumber = (v) => (v === '' ? 0 : Number(v));

export default function NeetCalculator() {
  const id = useId();
  const { openLead } = useLead();
  const [answers, setAnswers] = useState(blank);

  const rows = NEET_SUBJECTS.map(([key, label]) => {
    const correct = toNumber(answers[key].correct);
    const wrong = toNumber(answers[key].wrong);
    const valid =
      Number.isInteger(correct) &&
      Number.isInteger(wrong) &&
      correct >= 0 &&
      wrong >= 0 &&
      correct + wrong <= PER_SUBJECT;
    return {
      key,
      label,
      correct,
      wrong,
      valid,
      unanswered: valid ? PER_SUBJECT - correct - wrong : null,
      score: valid ? correct * 4 - wrong : null,
    };
  });
  const touched = NEET_SUBJECTS.some(([key]) => answers[key].correct !== '' || answers[key].wrong !== '');
  const invalid = rows.filter((r) => !r.valid);
  const total = touched && !invalid.length ? rows.reduce((sum, r) => sum + r.score, 0) : null;
  const attempted = rows.reduce((sum, r) => sum + (r.valid ? r.correct + r.wrong : 0), 0);
  const accuracy =
    total != null && attempted ? Math.round((rows.reduce((s, r) => s + r.correct, 0) / attempted) * 100) : null;
  const band = total == null ? null : BANDS.find(([min]) => total >= min)[1];

  const set = (key, field) => (event) => {
    const value = event.target.value;
    setAnswers((a) => ({ ...a, [key]: { ...a[key], [field]: value } }));
  };

  return (
    <div className="card p-5 shadow-[var(--shadow-soft)] sm:p-8">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-forest-800 text-white" aria-hidden="true">
          <Calculator size={20} />
        </span>
        <div>
          <h3 className="text-lg font-bold">NEET score calculator</h3>
          <p className="text-sm text-muted">+4 correct · −1 wrong · 0 unanswered · 45 questions a subject</p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[30rem] text-sm">
          <caption className="sr-only">Enter correct and wrong answers for each subject</caption>
          <thead>
            <tr className="text-left text-xs text-muted">
              <th scope="col" className="pb-2 font-semibold">
                Subject
              </th>
              <th scope="col" className="pb-2 font-semibold">
                Correct
              </th>
              <th scope="col" className="pb-2 font-semibold">
                Wrong
              </th>
              <th scope="col" className="pb-2 text-right font-semibold">
                Left
              </th>
              <th scope="col" className="pb-2 text-right font-semibold">
                Marks
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-t border-line">
                <th scope="row" className="py-2.5 pr-3 font-semibold">
                  {row.label}
                </th>
                {['correct', 'wrong'].map((field) => (
                  <td key={field} className="py-2.5 pr-3">
                    <label htmlFor={`${id}-${row.key}-${field}`} className="sr-only">
                      {row.label}: {field === 'correct' ? 'correct answers' : 'wrong answers'}
                    </label>
                    <input
                      id={`${id}-${row.key}-${field}`}
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={PER_SUBJECT}
                      placeholder="0"
                      className="field min-h-10 w-24 py-1.5 tabular-nums"
                      value={answers[row.key][field]}
                      aria-invalid={row.valid ? undefined : 'true'}
                      onChange={set(row.key, field)}
                    />
                  </td>
                ))}
                <td className="py-2.5 text-right text-muted tabular-nums">{row.unanswered ?? '–'}</td>
                <td className="py-2.5 text-right font-semibold tabular-nums">{row.score ?? '–'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {invalid.length ? (
        <p className="field-error mt-3" role="alert">
          {invalid.map((r) => r.label).join(', ')}: correct + wrong can’t be more than {PER_SUBJECT}, and must be whole
          numbers.
        </p>
      ) : null}

      <div
        className="mt-6 grid gap-4 rounded-2xl bg-forest-50 p-5 sm:grid-cols-[auto_1fr] sm:items-center"
        aria-live="polite"
      >
        <div>
          <p className="text-sm text-muted">Your NEET score</p>
          <p className="mt-1 text-4xl font-bold text-forest-800 tabular-nums">{total ?? '–'}</p>
          <p className="text-sm text-muted">
            out of {MAX}
            {accuracy != null ? ` · ${accuracy}% accuracy` : ''}
          </p>
        </div>
        {band ? (
          <p className="text-[0.9375rem] sm:border-l sm:border-forest-200 sm:pl-5">
            {band}
            <span className="mt-1 block text-xs text-muted">
              A broad guide for the General / OC category. Cutoffs change every year and are lower for reserved
              categories.
            </span>
          </p>
        ) : (
          <p className="text-sm text-muted sm:border-l sm:border-forest-200 sm:pl-5">
            Enter your correct and wrong answers from the answer key to see your score.
          </p>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button
          disabled={total == null}
          onClick={() =>
            openLead({
              source: 'neet_calculator',
              interest: 'medical',
              scoreNote: total != null ? `NEET ${total}` : '',
            })
          }
        >
          Get a college list for this score
        </Button>
        {touched ? (
          <button type="button" className="btn btn-soft" onClick={() => setAnswers(blank())}>
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}
