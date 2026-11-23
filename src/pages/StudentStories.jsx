import { useMemo, useState } from 'react';
import AnimatedContent from '../components/bits/AnimatedContent.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { RatingSummary, ReviewCard, VideoGrid } from '../components/Stories.jsx';
import { Button, ErrorBlock, LoadingBlock } from '../components/ui.jsx';
import { STORY_STREAMS } from '../data/content.js';
import { listTestimonials } from '../lib/api.js';
import { useLead } from '../lib/leadContext.jsx';
import { useAsync, useTitle } from '../lib/useAsync.js';

const FILTERS = [['', 'All stories'], ...Object.entries(STORY_STREAMS).filter(([key]) => key !== 'general')];

export default function StudentStories() {
  useTitle('Voices of our students: reviews and video stories');
  const { data, error, loading, reload } = useAsync(listTestimonials, []);
  const { openLead } = useLead();
  const [stream, setStream] = useState('');

  const items = useMemo(() => (data ?? []).filter((t) => !stream || t.stream === stream), [data, stream]);
  const videos = items.filter((t) => t.kind === 'video');
  const reviews = items.filter((t) => t.kind === 'review');

  return (
    <>
      <PageHeader
        crumbs={[['Student stories']]}
        eyebrow="Voices of our students"
        title="In their"
        accent="own words"
        text="Students and parents on choosing a course, getting through counselling and settling into college. Every story here comes from a family we have guided."
      >
        {data?.length ? (
          <div className="mt-6">
            <RatingSummary items={data} />
          </div>
        ) : null}
      </PageHeader>

      <section className="pb-8">
        <div className="container-page">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Show stories about">
            {FILTERS.map(([value, label]) => (
              <button
                key={label}
                type="button"
                aria-pressed={stream === value}
                onClick={() => setStream(value)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  stream === value
                    ? 'border-forest-800 bg-forest-800 text-white'
                    : 'border-line bg-white text-muted hover:text-forest-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-10">
            {loading ? (
              <LoadingBlock label="Loading stories…" />
            ) : error ? (
              <ErrorBlock message="We couldn’t load the stories." onRetry={reload} />
            ) : items.length === 0 ? (
              <div className="card mx-auto max-w-lg p-8 text-center">
                <p className="font-semibold">No stories here yet</p>
                <p className="mt-2 text-sm text-muted">
                  Try another topic, or ask us to connect you with a family we’ve helped.
                </p>
              </div>
            ) : (
              <>
                {videos.length ? (
                  <>
                    <h2 className="text-2xl font-bold">Video stories</h2>
                    <AnimatedContent stagger={0.06}>
                      <VideoGrid items={videos} className="mt-6" />
                    </AnimatedContent>
                  </>
                ) : null}
                {reviews.length ? (
                  <>
                    <h2 className={`text-2xl font-bold ${videos.length ? 'mt-14' : ''}`}>Reviews</h2>
                    <AnimatedContent
                      key={stream}
                      stagger={0.05}
                      distance={24}
                      className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                    >
                      {reviews.map((item) => (
                        <ReviewCard key={item.id} item={item} />
                      ))}
                    </AnimatedContent>
                  </>
                ) : null}
              </>
            )}
          </div>

          <div className="on-dark mt-16 flex flex-col items-start justify-between gap-6 rounded-[var(--radius-card)] bg-forest-800 p-8 text-white sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold">Want to talk to a family we’ve guided?</h2>
              <p className="mt-1 text-white/75">
                We can connect you with a parent or student from your district, with their permission.
              </p>
            </div>
            <Button variant="light" onClick={() => openLead({ source: 'stories' })}>
              Ask us
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
