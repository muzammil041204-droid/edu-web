// Reviews & videos ("Voices of our students"): add, edit, show/hide, feature on
// the home page, re-order and delete. Videos are YouTube links (normal or Shorts).

import { MessageSquareQuote, Pencil, Plus, Trash2, TriangleAlert, Video, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Stars } from '../../components/Stories.jsx';
import { ErrorBlock, LoadingBlock } from '../../components/ui.jsx';
import { STORY_STREAMS } from '../../data/content.js';
import { adminListTestimonials, deleteTestimonial, saveTestimonial } from '../../lib/api.js';
import { useAsync } from '../../lib/useAsync.js';
import { isShort, youtubeId, youtubeThumb } from '../../lib/youtube.js';
import { AdminTitle } from './adminUi.jsx';
import { Toggle } from './CollegesAdmin.jsx';

const KINDS = { review: 'Review', video: 'Video' };
const BLANK = {
  kind: 'review',
  name: '',
  detail: '',
  title: '',
  quote: '',
  rating: 5,
  video_url: '',
  stream: 'general',
  is_featured: false,
  is_published: true,
  sort_order: 0,
};

export default function StoriesAdmin() {
  const { data, error, loading, reload } = useAsync(adminListTestimonials, []);
  const [filter, setFilter] = useState('');
  const [editing, setEditing] = useState(null); // item, or BLANK for a new one
  const [busy, setBusy] = useState(null);
  const [actionError, setActionError] = useState('');

  const items = useMemo(() => (data ?? []).filter((t) => !filter || t.kind === filter), [data, filter]);
  const counts = useMemo(
    () => ({
      review: (data ?? []).filter((t) => t.kind === 'review').length,
      video: (data ?? []).filter((t) => t.kind === 'video').length,
      live: (data ?? []).filter((t) => t.is_published && (t.kind === 'review' || youtubeId(t.video_url))).length,
    }),
    [data]
  );

  async function toggle(item, field) {
    setBusy(`${item.id}-${field}`);
    setActionError('');
    try {
      await saveTestimonial({ id: item.id, [field]: !item[field] });
      reload();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusy(null);
    }
  }

  async function remove(item) {
    if (!window.confirm(`Delete “${item.title || item.name}” permanently? This can’t be undone.`)) return;
    setActionError('');
    try {
      await deleteTestimonial(item.id);
      reload();
    } catch (err) {
      setActionError(err.message);
    }
  }

  return (
    <>
      <AdminTitle
        title="Reviews & videos"
        text={`“Voices of our students” on the home page and the Student stories page. ${counts.live} items are on the website now.`}
      >
        <button type="button" className="btn btn-soft" onClick={() => setEditing({ ...BLANK, kind: 'video' })}>
          <Video size={16} aria-hidden="true" /> Add video
        </button>
        <button type="button" className="btn btn-primary" onClick={() => setEditing({ ...BLANK })}>
          <Plus size={16} aria-hidden="true" /> Add review
        </button>
      </AdminTitle>

      <div className="card mb-5 flex flex-wrap items-center gap-2 p-3" role="group" aria-label="Show">
        {[
          ['', `All (${(data ?? []).length})`],
          ['review', `Reviews (${counts.review})`],
          ['video', `Videos (${counts.video})`],
        ].map(([value, label]) => (
          <button
            key={label}
            type="button"
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${filter === value ? 'bg-forest-800 text-white' : 'text-muted hover:bg-forest-50'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {actionError ? (
        <p role="alert" className="mb-4 rounded-xl bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
          {actionError}
        </p>
      ) : null}

      {loading ? (
        <LoadingBlock label="Loading reviews and videos…" />
      ) : error ? (
        <ErrorBlock message={error.message} onRetry={reload} />
      ) : items.length === 0 ? (
        <div className="card p-8 text-center text-muted">Nothing here yet. Add your first review or video.</div>
      ) : (
        <ul className="grid gap-3">
          {items.map((item) => {
            const id = item.kind === 'video' ? youtubeId(item.video_url) : null;
            const missingVideo = item.kind === 'video' && !id;
            return (
              <li key={item.id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 gap-4">
                  {item.kind === 'video' ? (
                    <span className="relative grid h-16 w-28 shrink-0 place-items-center overflow-hidden rounded-lg bg-forest-100 text-forest-700">
                      {id ? (
                        <img src={youtubeThumb(id)} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <Video size={22} aria-hidden="true" />
                      )}
                    </span>
                  ) : (
                    <span className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-forest-50 text-forest-700">
                      <MessageSquareQuote size={24} aria-hidden="true" />
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{item.title || item.name}</span>
                      <span className="badge bg-forest-50 text-forest-800">{KINDS[item.kind]}</span>
                      {item.stream !== 'general' ? (
                        <span className="badge bg-cream text-[#5b4a2c]">{STORY_STREAMS[item.stream]}</span>
                      ) : null}
                    </p>
                    <p className="mt-0.5 text-sm text-muted">
                      {item.name}
                      {item.detail ? ` · ${item.detail}` : ''}
                    </p>
                    {item.kind === 'review' ? (
                      <div className="mt-1 flex items-center gap-2">
                        {item.rating ? <Stars value={item.rating} size={12} /> : null}
                        <p className="line-clamp-1 text-sm text-muted">{item.quote}</p>
                      </div>
                    ) : null}
                    {missingVideo ? (
                      <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-[#8a5a00]">
                        <TriangleAlert size={15} aria-hidden="true" /> Add a YouTube link to show this on the website
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-3 sm:justify-end">
                  <label className="flex items-center gap-2 text-sm">
                    <Toggle
                      checked={item.is_featured}
                      label={`Feature “${item.title || item.name}” on the home page`}
                      busy={busy === `${item.id}-is_featured`}
                      onChange={() => toggle(item, 'is_featured')}
                    />
                    Home page
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <Toggle
                      checked={item.is_published}
                      label={`Show “${item.title || item.name}” on the website`}
                      busy={busy === `${item.id}-is_published`}
                      onChange={() => toggle(item, 'is_published')}
                    />
                    Visible
                  </label>
                  <button
                    type="button"
                    onClick={() => setEditing(item)}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-forest-700 hover:bg-forest-50"
                  >
                    <Pencil size={15} aria-hidden="true" /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(item)}
                    className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-danger-soft hover:text-danger"
                    aria-label={`Delete “${item.title || item.name}”`}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {editing ? (
        <StoryEditor
          key={editing.id ?? `new-${editing.kind}`}
          item={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            reload();
          }}
        />
      ) : null}
    </>
  );
}

function StoryEditor({ item, onClose, onSaved }) {
  const ref = useRef(null);
  const [values, setValues] = useState(() => ({ ...BLANK, ...item, rating: item.rating ?? '' }));
  const [state, setState] = useState({ busy: false, error: '' });
  const isVideo = values.kind === 'video';
  const videoId = youtubeId(values.video_url);

  useEffect(() => {
    const dialog = ref.current;
    // Open once. Don't close() in a cleanup: that fires onClose and would shut
    // the panel straight away in React's development double-run. Unmounting
    // removes the dialog anyway.
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const set = (name) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setValues((v) => ({ ...v, [name]: value }));
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const name = values.name.trim();
    let problem = '';
    if (name.length < 2) problem = 'Enter the student’s or parent’s name.';
    else if (isVideo && values.title.trim().length < 3) problem = 'Give the video a short title.';
    else if (isVideo && values.video_url.trim() && !videoId) problem = 'That doesn’t look like a YouTube link.';
    else if (!isVideo && values.quote.trim().length < 10) problem = 'Write the review (at least a sentence).';
    if (problem) {
      setState({ busy: false, error: problem });
      return;
    }
    setState({ busy: true, error: '' });
    try {
      await saveTestimonial({
        ...(item.id ? { id: item.id } : {}),
        kind: values.kind,
        name,
        detail: values.detail.trim(),
        title: values.title.trim(),
        quote: values.quote.trim(),
        rating: isVideo || values.rating === '' ? null : Number(values.rating),
        video_url: isVideo ? values.video_url.trim() : '',
        stream: values.stream,
        is_featured: Boolean(values.is_featured),
        is_published: Boolean(values.is_published),
        sort_order: Number(values.sort_order) || 0,
      });
      onSaved();
    } catch (err) {
      setState({ busy: false, error: err.message });
    }
  }

  const text = (name, label, props = {}) => (
    <div>
      <label htmlFor={`story-${name}`} className="field-label">
        {label}
      </label>
      <input id={`story-${name}`} className="field" value={values[name]} onChange={set(name)} {...props} />
    </div>
  );

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="story-editor-title"
      className="ml-auto h-dvh max-h-none w-full max-w-lg bg-transparent p-0 backdrop:bg-forest-950/50"
    >
      <form onSubmit={handleSubmit} noValidate className="flex h-full flex-col overflow-y-auto bg-white p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <h2 id="story-editor-title" className="text-2xl font-bold">
            {item.id ? 'Edit' : 'Add'} {isVideo ? 'video' : 'review'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full bg-forest-50 hover:bg-forest-100"
            aria-label="Close"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-6 grid gap-4">
          <div className="flex rounded-full bg-forest-50 p-1" role="group" aria-label="Type">
            {Object.entries(KINDS).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={values.kind === value}
                onClick={() => setValues((v) => ({ ...v, kind: value }))}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold ${values.kind === value ? 'bg-white text-forest-900 shadow-sm' : 'text-muted'}`}
              >
                {label}
              </button>
            ))}
          </div>

          {isVideo ? (
            <div>
              {text('video_url', 'YouTube link', {
                placeholder: 'https://youtu.be/… or a YouTube Shorts link',
                inputMode: 'url',
              })}
              {values.video_url.trim() ? (
                videoId ? (
                  <div className="mt-3 flex items-center gap-3">
                    <img src={youtubeThumb(videoId)} alt="" className="h-16 w-28 rounded-lg object-cover" />
                    <p className="text-sm text-forest-700">
                      Found the video{isShort(values.video_url) ? ' (a Short: it plays upright)' : ''}.
                    </p>
                  </div>
                ) : (
                  <p className="field-error">That doesn’t look like a YouTube link.</p>
                )
              ) : (
                <p className="mt-1.5 text-xs text-muted">
                  Upload the video to your YouTube channel (it can be “Unlisted”), then paste its link here.
                </p>
              )}
            </div>
          ) : null}

          {text('name', 'Name', { placeholder: 'e.g. Revathi Sundaram', autoComplete: 'off' })}
          {text('detail', 'About them', { placeholder: 'e.g. Parent · Chennai · NEET 2026' })}
          {text('title', isVideo ? 'Video title' : 'Headline (optional)', {
            placeholder: isVideo ? 'e.g. How we chose between NIT and VIT' : 'e.g. Got Stanley in round 2',
          })}

          {!isVideo ? (
            <>
              <div>
                <label htmlFor="story-quote" className="field-label">
                  Review
                </label>
                <textarea
                  id="story-quote"
                  rows={5}
                  maxLength={1200}
                  className="field min-h-32"
                  value={values.quote}
                  onChange={set('quote')}
                />
              </div>
              <div>
                <label htmlFor="story-rating" className="field-label">
                  Rating
                </label>
                <select id="story-rating" className="field" value={values.rating} onChange={set('rating')}>
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {'★'.repeat(n)} {n} / 5
                    </option>
                  ))}
                  <option value="">No rating</option>
                </select>
              </div>
            </>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="story-stream" className="field-label">
                Topic
              </label>
              <select id="story-stream" className="field" value={values.stream} onChange={set('stream')}>
                {Object.entries(STORY_STREAMS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            {text('sort_order', 'Order (lower shows first)', { type: 'number', inputMode: 'numeric' })}
          </div>

          <label className="flex items-center justify-between gap-3 rounded-xl bg-forest-50 px-4 py-3 text-sm font-semibold">
            Feature on the home page
            <input
              type="checkbox"
              className="h-5 w-5 accent-forest-700"
              checked={values.is_featured}
              onChange={set('is_featured')}
            />
          </label>
          <label className="flex items-center justify-between gap-3 rounded-xl bg-forest-50 px-4 py-3 text-sm font-semibold">
            Show on the website
            <input
              type="checkbox"
              className="h-5 w-5 accent-forest-700"
              checked={values.is_published}
              onChange={set('is_published')}
            />
          </label>
          <p className="text-xs text-muted">Only publish reviews and videos you have the person’s permission to use.</p>
        </div>

        {state.error ? (
          <p role="alert" className="mt-4 rounded-xl bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
            {state.error}
          </p>
        ) : null}

        <div className="mt-auto flex gap-3 border-t border-line pt-5">
          <button type="submit" className="btn btn-primary" disabled={state.busy}>
            {state.busy ? 'Saving…' : 'Save'}
          </button>
          <button type="button" className="btn btn-soft" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </dialog>
  );
}
