// "Voices of our students": review cards, video cards with a player dialog,
// and the average-rating summary. Content comes from the admin panel.

import { Play, Star, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { STORY_STREAMS } from '../data/content.js';
import { initials } from '../lib/format.js';
import { startScroll, stopScroll } from '../lib/smoothScroll.jsx';
import { isShort, youtubeEmbed, youtubeId, youtubeThumb } from '../lib/youtube.js';

export function Stars({ value = 5, size = 14 }) {
  const rounded = Math.round(value);
  return (
    <span className="flex gap-0.5" role="img" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={0}
          fill="currentColor"
          className={i < rounded ? 'text-gold' : 'text-line'}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

export function ReviewCard({ item, large = false }) {
  return (
    <figure
      className={`card flex h-full flex-col p-6 ${large ? 'sm:p-8' : ''} ${item.is_featured && large ? 'border-t-4 border-t-forest-700' : ''}`}
    >
      <div className="flex items-center justify-between gap-3">
        {item.rating ? <Stars value={item.rating} /> : <span />}
        {item.stream && item.stream !== 'general' ? (
          <span className="badge bg-forest-50 text-forest-800">{STORY_STREAMS[item.stream]}</span>
        ) : null}
      </div>
      {item.title ? <p className="mt-3 font-bold">{item.title}</p> : null}
      <blockquote
        className={`mt-2 flex-1 leading-relaxed text-muted ${large ? 'text-[1.0625rem]' : 'text-[0.9375rem]'}`}
      >
        “{item.quote}”
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-4">
        <span
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-forest-100 text-sm font-bold text-forest-800"
          aria-hidden="true"
        >
          {initials(item.name)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block leading-tight font-semibold">{item.name}</span>
          {item.detail ? <span className="mt-0.5 block text-xs leading-snug text-muted">{item.detail}</span> : null}
        </span>
      </figcaption>
    </figure>
  );
}

export function VideoCard({ item, onPlay }) {
  const id = youtubeId(item.video_url);
  if (!id) return null;
  return (
    <figure className="group card flex h-full flex-col overflow-hidden">
      <button
        type="button"
        onClick={() => onPlay(item)}
        className="relative block aspect-video w-full overflow-hidden bg-forest-950"
        aria-label={`Play video: ${item.title} (${item.name})`}
      >
        <img
          src={youtubeThumb(id)}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span
          className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-transparent to-transparent"
          aria-hidden="true"
        />
        <span
          className="absolute top-1/2 left-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-forest-900 shadow-[var(--shadow-lift)] transition-transform group-hover:scale-110"
          aria-hidden="true"
        >
          <Play size={26} fill="currentColor" className="ml-1" />
        </span>
        {isShort(item.video_url) ? (
          <span className="badge absolute top-3 left-3 bg-white/90 text-forest-900">Short</span>
        ) : null}
      </button>
      <figcaption className="flex flex-1 flex-col p-5">
        <p className="font-bold">{item.title}</p>
        <p className="mt-1 text-sm text-muted">
          {item.name}
          {item.detail ? ` · ${item.detail}` : ''}
        </p>
      </figcaption>
    </figure>
  );
}

// Plays one video in a dialog. The YouTube player only loads when opened, and
// is removed (so it stops) when the dialog closes.
export function VideoDialog({ item, onClose }) {
  const ref = useRef(null);
  const id = item ? youtubeId(item.video_url) : null;
  const vertical = item ? isShort(item.video_url) : false;

  useEffect(() => {
    const dialog = ref.current;
    if (!item || !dialog) return undefined;
    if (!dialog.open) dialog.showModal();
    stopScroll();
    // No close() here (it would fire onClose); the dialog is removed when the video ends.
    return () => {
      startScroll();
    };
  }, [item]);

  if (!item || !id) return null;
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(event) => event.target === ref.current && onClose()}
      aria-label={`Video: ${item.title}`}
      className={`m-auto w-[calc(100%-2rem)] overflow-visible bg-transparent p-0 backdrop:bg-forest-950/80 backdrop:backdrop-blur-sm ${
        vertical ? 'max-w-sm' : 'max-w-4xl'
      }`}
    >
      <div className="relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-12 right-0 grid h-10 w-10 place-items-center rounded-full bg-white text-forest-900"
          aria-label="Close video"
        >
          <X size={20} aria-hidden="true" />
        </button>
        <div className={`overflow-hidden rounded-2xl bg-black ${vertical ? 'aspect-[9/16]' : 'aspect-video'}`}>
          <iframe
            src={youtubeEmbed(id)}
            title={item.title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
        <p className="mt-3 text-center text-sm text-white/85">
          {item.name}
          {item.detail ? ` · ${item.detail}` : ''}
        </p>
      </div>
    </dialog>
  );
}

// A grid of video cards plus its player. One or two videos sit centred.
export function VideoGrid({ items, className = '' }) {
  const [playing, setPlaying] = useState(null);
  if (!items.length) return null;
  const columns =
    items.length === 1
      ? 'mx-auto max-w-md'
      : items.length === 2
        ? 'mx-auto max-w-4xl sm:grid-cols-2'
        : 'sm:grid-cols-2 lg:grid-cols-3';
  return (
    <>
      <div className={`grid gap-5 ${columns} ${className}`}>
        {items.map((item) => (
          <VideoCard key={item.id} item={item} onPlay={setPlaying} />
        ))}
      </div>
      <VideoDialog item={playing} onClose={() => setPlaying(null)} />
    </>
  );
}

export function RatingSummary({ items, light = false }) {
  const rated = items.filter((t) => t.kind === 'review' && t.rating);
  const videos = items.filter((t) => t.kind === 'video').length;
  if (!rated.length) return null;
  const average = rated.reduce((sum, t) => sum + t.rating, 0) / rated.length;
  return (
    <div
      className={`inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-full border px-4 py-2 text-sm ${
        light ? 'border-white/20 text-white' : 'border-line bg-white'
      }`}
    >
      <Stars value={average} size={16} />
      <span>
        <strong className="font-bold">{average.toFixed(1)}</strong> average from {rated.length} reviews
        {videos ? ` · ${videos} video ${videos === 1 ? 'story' : 'stories'}` : ''}
      </span>
    </div>
  );
}
