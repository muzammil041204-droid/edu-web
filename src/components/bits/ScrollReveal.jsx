// ScrollReveal, adapted from React Bits (https://reactbits.dev) by David Haz.
// MIT + Commons Clause: see LICENSE-react-bits.md in this folder.
//
// Changes for this site:
// - Uses the site's shared GSAP setup (lib/gsap.js).
// - Fade effect only (word by word, scrubbed to the scroll), with an optional
//   highlight colour as each word lights up.
// - Renders any heading tag; the full sentence stays readable to screen
//   readers through aria-label.
// - No "mounted" state: the layout effect runs after the words are in the DOM.
//
// Words start dim and light up one by one as the text scrolls through the
// screen. With reduced motion the text is simply shown.

import { Children, useLayoutEffect, useMemo, useRef } from 'react';
import { gsap, MOTION_OK } from '../../lib/gsap.js';

const SCRUB_SPAN = 0.5;
const clamp01 = (value) => Math.min(Math.max(value, 0), 1);
const smooth = (value) => value * value * (3 - 2 * value);
const glowAt = (t) => (t <= 0 || t >= 1 ? 0 : t < 0.35 ? smooth(t / 0.35) : 1 - smooth((t - 0.35) / 0.65));

export default function ScrollReveal({
  children,
  as: Tag = 'h2',
  baseOpacity = 0.18,
  enableBlur = true,
  blurStrength = 3,
  baseRotation = 0,
  stagger = 0.05,
  highlightColor = '',
  className = '',
  wordAnimationEnd = 'bottom 55%',
}) {
  const containerRef = useRef(null);

  const text = useMemo(() => {
    const parts = Children.toArray(children);
    return parts.every((part) => typeof part === 'string' || typeof part === 'number') ? parts.join('') : null;
  }, [children]);

  const words = useMemo(
    () =>
      text === null
        ? null
        : text.split(/(\s+)/).map((word, index) =>
            word.trim() === '' ? (
              word
            ) : (
              <span className="inline-block" data-piece key={index}>
                {word}
              </span>
            )
          ),
    [text]
  );

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    const pieces = Array.from(el.querySelectorAll('[data-piece]'));
    if (!pieces.length) return undefined;

    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const state = { p: 0 };
      const last = pieces.map(() => -1);
      const total = SCRUB_SPAN + Math.max(0, pieces.length - 1) * stagger;

      const paint = (piece, t) => {
        const fadeIn = highlightColor ? Math.max(t, clamp01(t / 0.35)) : t;
        piece.style.opacity = t >= 1 ? '' : (baseOpacity + (1 - baseOpacity) * fadeIn).toFixed(3);
        piece.style.filter = enableBlur && t < 1 ? `blur(${(blurStrength * (1 - t)).toFixed(2)}px)` : '';
        if (highlightColor) {
          const glow = glowAt(t);
          piece.style.color =
            glow > 0.002 ? `color-mix(in srgb, ${highlightColor} ${(glow * 100).toFixed(1)}%, currentColor)` : '';
        }
      };

      const render = () => {
        const at = state.p * total;
        pieces.forEach((piece, index) => {
          const t = clamp01((at - index * stagger) / SCRUB_SPAN);
          if (t === last[index]) return;
          last[index] = t;
          paint(piece, t);
        });
      };

      pieces.forEach((piece) => {
        piece.style.willChange = 'opacity, filter';
      });
      render();

      if (baseRotation) {
        gsap.fromTo(
          el,
          { transformOrigin: '0% 50%', rotate: baseRotation },
          {
            rotate: 0,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: wordAnimationEnd, scrub: true },
          }
        );
      }
      gsap.to(state, {
        p: 1,
        ease: 'none',
        onUpdate: render,
        scrollTrigger: { trigger: el, start: 'top 90%', end: wordAnimationEnd, scrub: true },
      });

      return () => {
        pieces.forEach((piece) => {
          piece.style.opacity = '';
          piece.style.filter = '';
          piece.style.color = '';
          piece.style.willChange = '';
        });
      };
    });

    return () => mm.revert();
  }, [text, baseOpacity, enableBlur, blurStrength, baseRotation, stagger, highlightColor, wordAnimationEnd]);

  return (
    <Tag ref={containerRef} className={className} aria-label={text ?? undefined}>
      <span aria-hidden={text === null ? undefined : true}>{words ?? children}</span>
    </Tag>
  );
}
