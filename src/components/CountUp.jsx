// Counts a number up when it scrolls into view (GSAP). Screen readers and
// reduced-motion users get the final number straight away.

import { useRef } from 'react';
import { gsap, MOTION_OK, useGSAP } from '../lib/gsap.js';

const fmt = new Intl.NumberFormat('en-IN');

export default function CountUp({ to, suffix = '', prefix = '', duration = 1.8, className = '' }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const el = ref.current;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const state = { n: 0 };
        el.textContent = `${prefix}0${suffix}`;
        gsap.to(state, {
          n: to,
          duration,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top bottom', once: true },
          onUpdate: () => {
            el.textContent = `${prefix}${fmt.format(Math.round(state.n))}${suffix}`;
          },
        });
        return () => {
          el.textContent = `${prefix}${fmt.format(to)}${suffix}`;
        };
      });
      return () => mm.revert();
    },
    { dependencies: [to, suffix, prefix, duration], scope: ref }
  );

  return (
    <span className={className}>
      <span ref={ref} aria-hidden="true">
        {prefix}
        {fmt.format(to)}
        {suffix}
      </span>
      <span className="sr-only">
        {prefix}
        {fmt.format(to)}
        {suffix}
      </span>
    </span>
  );
}
