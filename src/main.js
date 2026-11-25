import './styles/main.css';
import { config } from './config.js';
import { initNav } from './sections/nav.js';
import { initServices } from './sections/services.js';
import { initFaq } from './sections/faq.js';
import { initReviews } from './sections/reviews.js';
import { initBooking } from './sections/booking.js';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('js');

initNav();
initFaq();
initReviews();
initBooking();
initServices(reduced);

// GSAP + animations are loaded as a separate chunk so they never block first paint.
import('./sections/animations.js').then((m) => m.initAnimations({ reduced }));

// Three.js is the heaviest dependency: load it only when the browser is idle,
// and only if WebGL is available. Otherwise the static SVG tooth (already in the markup) stays.
function boot3D() {
  const canvas = document.getElementById('scene');
  const slot = document.getElementById('hero-3d');
  const hero = document.getElementById('top');
  if (!canvas || !slot || !hero) return;

  import('./three/scene.js')
    .then(async ({ createScene, hasWebGL }) => {
      if (!hasWebGL()) return;
      const scene = await createScene({ canvas, slot, hero, settings: config.three, reduced });
      document.documentElement.classList.add('webgl');
      scene.onFail = () => document.documentElement.classList.remove('webgl');
      window.addEventListener('pagehide', () => scene.dispose(), { once: true });
    })
    .catch((err) => {
      console.warn('[3D] disabled, showing static fallback.', err);
      document.documentElement.classList.remove('webgl');
    });
}
const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 300));
if (document.readyState === 'complete') idle(boot3D);
else window.addEventListener('load', () => idle(boot3D), { once: true });
