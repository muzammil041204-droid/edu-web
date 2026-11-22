// AnimatedContent, adapted from React Bits (https://reactbits.dev) by David Haz.
// MIT + Commons Clause: see LICENSE-react-bits.md in this folder.
//
// Changes for this site:
// - Uses the site's shared GSAP setup (lib/gsap.js) instead of registering again.
// - Callback refs are updated in an effect, not during render (React rules).
// - Trimmed to the options the site uses (slide, fade, scale, blur, stagger).
// - Content is visible straight away for reduced motion.
//
// Slides and fades its content in when it scrolls into view. With `stagger`,
// each direct child animates in turn.

import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap, prefersReducedMotion, ScrollTrigger } from '../../lib/gsap.js';

export default function AnimatedContent({
  children,
  as: Tag = 'div',
  distance = 40,
  direction = 'vertical',
  reverse = false,
  duration = 0.9,
  ease = 'power3.out',
  initialOpacity = 0,
  scale = 1,
  blur = 0,
  threshold = 0.12,
  delay = 0,
  stagger = 0,
  onComplete,
  className = '',
  ...props
}) {
  const ref = useRef(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (prefersReducedMotion()) {
      gsap.set(el, { visibility: 'visible' });
      onCompleteRef.current?.();
      return undefined;
    }

    const ctx = gsap.context(() => {
      const targets = stagger > 0 && el.children.length ? Array.from(el.children) : [el];
      const axis = direction === 'horizontal' ? 'x' : 'y';
      const sign = reverse ? -1 : 1;

      gsap.set(el, { visibility: 'visible' });

      const from = { [axis]: distance * sign, scale, opacity: initialOpacity };
      const to = { [axis]: 0, scale: 1, opacity: 1, duration, ease, delay };
      if (blur > 0) {
        from.filter = `blur(${blur}px)`;
        to.filter = 'blur(0px)';
      }
      if (stagger > 0) to.stagger = stagger;

      const tl = gsap.timeline({
        paused: true,
        onComplete: () => {
          gsap.set(targets, { clearProps: 'filter,transform' });
          onCompleteRef.current?.();
        },
      });
      tl.fromTo(targets, from, to);

      ScrollTrigger.create({
        trigger: el,
        start: `top ${(1 - threshold) * 100}%`,
        once: true,
        onEnter: () => tl.play(),
      });
    }, el);

    return () => ctx.revert();
  }, [distance, direction, reverse, duration, ease, initialOpacity, scale, blur, threshold, delay, stagger]);

  return (
    <Tag ref={ref} className={['invisible', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </Tag>
  );
}
