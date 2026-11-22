// GSAP for the whole site, with its plugins registered once.
//
// Rules for animation code:
// - Animate only inside useGSAP / effects, never during render.
// - Wrap motion in gsap.matchMedia() with MOTION_OK, so people who prefer
//   reduced motion get the finished, still state.
// - GSAP and Lenis share one clock (see lib/smoothScroll.jsx).

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export const MOTION_OK = '(prefers-reduced-motion: no-preference)';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);

export { gsap, ScrollTrigger, SplitText, useGSAP };
