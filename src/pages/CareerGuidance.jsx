import { Check, CheckCircle2 } from 'lucide-react';
import AnimatedContent from '../components/bits/AnimatedContent.jsx';
import ScrollReveal from '../components/bits/ScrollReveal.jsx';
import SpotlightCard from '../components/bits/SpotlightCard.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { Button, ButtonLink, Photo, SectionHeading } from '../components/ui.jsx';
import { careerPaths, packages, process, stages } from '../data/careers.js';
import { photos } from '../data/site.js';
import { useLead } from '../lib/leadContext.jsx';
import { useTitle } from '../lib/useAsync.js';

export default function CareerGuidance() {
  useTitle('Career guidance for Class 8 to 12 and after');
  const { openLead } = useLead();
  const book = () => openLead({ source: 'career', interest: 'career_guidance' });

  return (
    <>
      <PageHeader
        crumbs={[['Career Guidance']]}
        eyebrow="Class 8 to 12 and after"
        title="Career guidance that starts with"
        accent="the student"
        text="Before the college list comes the real question: what suits this student? We find out with an aptitude assessment and honest conversations, then plan the courses, exams and colleges around it."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={book}>Book a free first session</Button>
          <ButtonLink href="#packages" variant="soft" icon={false}>
            See packages
          </ButtonLink>
        </div>
      </PageHeader>

      <section className="pb-16 sm:pb-20">
        <div className="container-page">
          <AnimatedContent stagger={0.1} className="grid gap-5 md:grid-cols-3">
            {stages.map((stage) => (
              <SpotlightCard
                key={stage.id}
                spotlightColor="#3a6c5c"
                intensity={0.1}
                className="flex flex-col rounded-[var(--radius-card)] bg-white p-7"
              >
                <span className="badge self-start bg-forest-100 text-forest-900">{stage.title}</span>
                <h2 className="mt-4 text-xl font-bold">{stage.question}</h2>
                <ul className="mt-5 space-y-3">
                  {stage.points.map((point) => (
                    <li key={point} className="flex gap-3 text-muted">
                      <CheckCircle2 size={19} className="mt-0.5 shrink-0 text-forest-600" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            ))}
          </AnimatedContent>
        </div>
      </section>

      <section className="on-dark bg-forest-800 py-20 text-white sm:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <span className="eyebrow">How it works</span>
            <ScrollReveal
              className="mt-5 text-[clamp(1.6rem,3.2vw,2.4rem)] leading-tight font-bold"
              highlightColor="#c9ded4"
            >
              Four steps from “I don’t know” to a plan the whole family agrees on.
            </ScrollReveal>
            <ol className="mt-10 space-y-6">
              {process.map((step, i) => (
                <li key={step.title} className="flex gap-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-sm font-bold text-forest-900">
                    {i + 1}
                  </span>
                  <span>
                    <span className="block text-lg font-bold">{step.title}</span>
                    <span className="mt-1 block leading-relaxed text-white/75">{step.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <AnimatedContent distance={40} className="overflow-hidden rounded-[var(--radius-photo)]">
            <Photo
              id={photos.library}
              alt="A student reading in a quiet library"
              w={1000}
              h={1150}
              className="aspect-[20/23] w-full"
            />
          </AnimatedContent>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Career paths"
            title="Every path, with the exams"
            accent="that open it"
            text="The assessment narrows these down to the three that fit best. Then we plan the exams and the colleges."
          />
          <AnimatedContent stagger={0.05} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {careerPaths.map((path) => (
              <article key={path.title} className="card flex flex-col p-5">
                <h3 className="font-bold">{path.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{path.courses}</p>
                <p className="mt-4 border-t border-line pt-3 text-xs">
                  <span className="font-semibold text-forest-800">Exams:</span>{' '}
                  <span className="text-muted">{path.exams}</span>
                </p>
              </article>
            ))}
          </AnimatedContent>
        </div>
      </section>

      <section id="packages" className="scroll-mt-28 bg-cream py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Packages"
            title="Start free,"
            accent="go further if it helps"
            text="Sample prices for the demo."
          />
          <AnimatedContent stagger={0.1} className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`flex flex-col rounded-[var(--radius-card)] p-7 ${
                  pkg.featured ? 'on-dark bg-forest-800 text-white' : 'card'
                }`}
              >
                <h3 className="text-lg font-bold">{pkg.name}</h3>
                <p className="mt-3 text-3xl font-bold">{pkg.price}</p>
                <p className={`mt-3 ${pkg.featured ? 'text-white/75' : 'text-muted'}`}>{pkg.text}</p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {pkg.points.map((point) => (
                    <li key={point} className="flex gap-2.5 text-sm">
                      <Check
                        size={18}
                        className={pkg.featured ? 'text-forest-200' : 'text-forest-600'}
                        aria-hidden="true"
                      />
                      {point}
                    </li>
                  ))}
                </ul>
                <Button variant={pkg.featured ? 'light' : 'soft'} className="mt-7 w-full" onClick={book}>
                  {pkg.price === 'Free' ? 'Book free session' : 'Ask about this'}
                </Button>
              </div>
            ))}
          </AnimatedContent>
        </div>
      </section>
    </>
  );
}
