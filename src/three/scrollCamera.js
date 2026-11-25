import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-scrubbed camera/object state. GSAP + ScrollTrigger write into `state`;
 * scene.js reads (and smooths) it every frame.
 *   spin    extra Y rotation of the object (radians)
 *   dolly   camera distance multiplier
 *   pitch   object pitch (radians)
 *   glow    0..1 light intensity driver
 *   leave   0..1 how far the hero has scrolled out (hero slot -> side companion)
 */
export function createScrollCamera({ hero, reduced }) {
  const state = { spin: 0, dolly: 1, pitch: 0, glow: 0, leave: 0 };
  if (reduced) return { state, dispose() {} };

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1.2 },
  });
  tl.to(state, { spin: Math.PI * 1.2, dolly: 1.08, pitch: 0.18, glow: 0.2, duration: 1 })
    .to(state, { spin: Math.PI * 2.6, dolly: 0.94, pitch: -0.12, glow: 0.8, duration: 1 })
    .to(state, { spin: Math.PI * 4.2, dolly: 1.04, pitch: 0.1, glow: 0.3, duration: 1 })
    .to(state, { spin: Math.PI * 5.4, dolly: 1, pitch: 0, glow: 0.6, duration: 1 });

  const leave = ScrollTrigger.create({
    trigger: hero,
    start: 'top top',
    end: 'bottom 30%',
    scrub: 0.6,
    onUpdate: (self) => { state.leave = self.progress; },
  });

  return {
    state,
    dispose() {
      tl.scrollTrigger?.kill();
      tl.kill();
      leave.kill();
    },
  };
}
