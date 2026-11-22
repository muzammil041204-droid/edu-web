// SplitText, adapted from React Bits (https://reactbits.dev) by David Haz.
// MIT + Commons Clause: see LICENSE-react-bits.md in this folder.
//
// Changes for this site:
// - Uses the site's shared GSAP setup (lib/gsap.js).
// - Reveal only: the hover, click and loop effects are removed.
// - Waits for the web fonts so lines are split at their final width.
// - Shown straight away (no animation) for reduced motion.
//
// Splits text into words, characters or lines with GSAP's SplitText plugin and
// reveals them one after another, on load or when scrolled into view.

import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion, SplitText as GSAPSplitText, useGSAP } from '../../lib/gsap.js';

const fontsAreLoaded = () => typeof document !== 'undefined' && (!document.fonts || document.fonts.status === 'loaded');

const EFFECTS = {
  rise: { from: { opacity: 0, yPercent: 105 }, to: { opacity: 1, yPercent: 0 }, ease: 'power4.out' },
  fade: { from: { opacity: 0 }, to: { opacity: 1 }, ease: 'power2.inOut' },
  blur: {
    from: { opacity: 0, filter: 'blur(8px)', y: 12 },
    to: { opacity: 1, filter: 'blur(0px)', y: 0 },
    ease: 'power2.out',
  },
};

export default function SplitText({
  text,
  as: Tag = 'span',
  className = '',
  splitType = 'words',
  delay = 60,
  startAt = 0,
  duration = 1.1,
  effect = 'rise',
  trigger = 'load',
  mask = true,
}) {
  const ref = useRef(null);
  const [fontsLoaded, setFontsLoaded] = useState(fontsAreLoaded);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (fontsLoaded) return undefined;
    let active = true;
    document.fonts.ready.then(() => active && setFontsLoaded(true));
    return () => {
      active = false;
    };
  }, [fontsLoaded]);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !text || !fontsLoaded) return undefined;

      if (prefersReducedMotion()) {
        setReady(true);
        return undefined;
      }

      const look = EFFECTS[effect] ?? EFFECTS.rise;
      const unit = splitType.includes('chars') ? 'chars' : splitType.includes('lines') ? 'lines' : 'words';
      const split = new GSAPSplitText(el, {
        type: splitType,
        smartWrap: true,
        mask: mask ? unit : undefined,
        aria: 'auto',
        onSplit: (self) => {
          const pieces = self[unit];
          return gsap.fromTo(
            pieces,
            { ...look.from, willChange: 'transform, opacity' },
            {
              ...look.to,
              duration,
              ease: look.ease,
              delay: startAt,
              stagger: delay / 1000,
              scrollTrigger: trigger === 'view' ? { trigger: el, start: 'top 88%', once: true } : undefined,
              onComplete: () => gsap.set(pieces, { clearProps: 'willChange,filter' }),
            }
          );
        },
      });
      setReady(true);
      return () => split.revert();
    },
    { dependencies: [text, splitType, delay, startAt, duration, effect, trigger, mask, fontsLoaded], scope: ref }
  );

  return (
    <Tag ref={ref} className={className} style={{ visibility: ready ? undefined : 'hidden' }}>
      {text}
    </Tag>
  );
}
