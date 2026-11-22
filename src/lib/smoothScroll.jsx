// Lenis smooth scrolling, driven by GSAP's clock so ScrollTrigger animations
// stay in step with the scroll.
//
// - Public pages only: the admin keeps normal scrolling for tables and forms.
// - Off for people who prefer reduced motion.
// - Paused while a dialog is open (see stopScroll / startScroll).

import Lenis from 'lenis';
import { useEffect } from 'react';
import { gsap, prefersReducedMotion, ScrollTrigger } from './gsap.js';

let lenis = null;
let locks = 0;

export function SmoothScroll({ enabled }) {
  useEffect(() => {
    if (!enabled || prefersReducedMotion()) return undefined;

    const instance = new Lenis({ autoRaf: false, anchors: { offset: -96 }, lerp: 0.1 });
    const tick = (time) => instance.raf(time * 1000);
    instance.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenis = instance;
    if (locks > 0) instance.stop();

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      instance.destroy();
      if (lenis === instance) lenis = null;
    };
  }, [enabled]);

  return null;
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
}

// `immediate` jumps straight there (used for links that open a page at a section).
export function scrollToElement(target, { immediate = false } = {}) {
  if (!target) return;
  if (lenis) lenis.scrollTo(target, { offset: -96, immediate, force: immediate });
  else target.scrollIntoView({ behavior: immediate || prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
}

// Dialogs call these so the page behind them doesn't move.
export function stopScroll() {
  locks += 1;
  lenis?.stop();
  document.documentElement.style.overflow = 'hidden';
}

export function startScroll() {
  locks = Math.max(0, locks - 1);
  if (locks > 0) return;
  lenis?.start();
  document.documentElement.style.overflow = '';
}
