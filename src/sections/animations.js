import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Scroll-driven content animations. Skipped entirely under prefers-reduced-motion. */
export function initAnimations({ reduced }) {
  if (reduced) return;
  const clear = { clearProps: 'transform,opacity,visibility' };

  // Hero intro
  const heroItems = gsap.utils.toArray('[data-hero-item]');
  gsap.from(heroItems, { y: 28, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1, delay: 0.1, ...clear });

  // Section reveals
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      y: 36, opacity: 0, duration: 0.9, ease: 'power3.out', ...clear,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  // Staggered card entrances
  gsap.utils.toArray('[data-stagger]').forEach((group) => {
    const items = group.querySelectorAll('[data-stagger-item]');
    if (!items.length) return;
    gsap.from(items, {
      y: 40, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1, ...clear,
      scrollTrigger: { trigger: group, start: 'top 88%', once: true },
    });
  });

  // Animated counters
  gsap.utils.toArray('[data-count]').forEach((el) => {
    const end = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';
    const obj = { v: 0 };
    el.textContent = (0).toFixed(decimals) + suffix;
    gsap.to(obj, {
      v: end, duration: 1.8, ease: 'power2.out',
      onUpdate: () => { el.textContent = obj.v.toFixed(decimals) + suffix; },
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });

  // Timeline that draws as you scroll (CSS var --draw drives scaleX / scaleY)
  const tl = document.getElementById('timeline');
  if (tl) {
    gsap.fromTo(tl, { '--draw': 0 }, {
      '--draw': 1, ease: 'none',
      scrollTrigger: { trigger: tl, start: 'top 75%', end: 'bottom 65%', scrub: 0.5 },
    });
  }
}
