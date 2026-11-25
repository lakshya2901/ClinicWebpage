import * as THREE from 'three';
import { createLights } from './lights.js';
import { createParticles } from './particles.js';
import { createScrollCamera } from './scrollCamera.js';
import { createHeroObject, normalise } from './objects/index.js';

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const ease = (t) => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;

function cssColor(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#2bb5b0';
}

export function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
}

/**
 * Boots the 3D layer: one fixed, full-viewport, pointer-events:none canvas.
 * - Hero: the object sits exactly in the hero slot (#hero-3d) and follows it while scrolling.
 * - After the hero: on wide screens it travels to the right margin as a small companion
 *   (never over text). On narrow screens it fades out.
 * - Particles + scroll-scrubbed spin/dolly/lighting run through the whole page.
 */
export async function createScene({ canvas, slot, hero, settings, reduced }) {
  const colors = {
    primaryContainer: cssColor('--primary-container'),
    primaryFixed: cssColor('--primary-fixed'),
    primaryFixedDim: cssColor('--primary-fixed-dim'),
    secondaryContainer: cssColor('--secondary-container'),
    surfaceLow: cssColor('--surface-container-low'),
  };
  const isMobile = () => window.innerWidth < 768;
  const maxDpr = settings.maxPixelRatio ?? 2;
  const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
  const BASE_DIST = 8;
  camera.position.set(0, 0, BASE_DIST);

  const lights = createLights(renderer, scene, colors);
  const particles = createParticles({
    count: isMobile() ? settings.particles.mobile : settings.particles.desktop,
    colors,
    pixelRatio: dpr,
  });
  scene.add(particles.points);

  const hero3d = await createHeroObject({ modelUrl: settings.modelUrl, colors });
  const heroRoot = normalise(hero3d.object); // 1 unit tall, centred
  const pivot = new THREE.Group(); // receives position/scale; heroRoot rotates inside
  pivot.add(heroRoot);
  scene.add(pivot);

  const scroll = createScrollCamera({ hero, reduced });
  const smooth = { spin: 0, dolly: 1, pitch: 0, glow: 0, leave: 0 };

  let vw = 0, vh = 0;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let dirty = true;
  let raf = 0;
  let running = false;
  let disposed = false;
  let last = performance.now();
  let time = 0;
  let autoSpin = 0;

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    // Ignore small height changes (mobile address bar) to avoid pointless re-allocation.
    if (w === vw && Math.abs(h - vh) < 120) return;
    vw = w; vh = h;
    renderer.setSize(vw, vh, false);
    camera.aspect = vw / vh;
    camera.updateProjectionMatrix();
    dirty = true;
  }

  function onPointer(e) {
    pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
  }

  /** Decide whether anything visible needs rendering. */
  function shouldRun() {
    if (disposed || document.visibilityState !== 'visible') return false;
    if (isMobile() && smooth.leave > 0.98 && scroll.state.leave > 0.98) return false; // nothing on screen
    return true;
  }
  function evaluate() {
    const want = shouldRun();
    if (want && !running) {
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    } else if (!want && running) {
      running = false;
      cancelAnimationFrame(raf);
    }
  }

  function frame(now) {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!reduced) time += dt;

    const s = scroll.state;
    const k = reduced ? 1 : 1 - Math.pow(0.001, dt); // frame-rate independent smoothing
    for (const key of Object.keys(smooth)) smooth[key] += (s[key] - smooth[key]) * (key === 'leave' ? 1 : k);
    pointer.x += (pointer.tx - pointer.x) * k * 0.5;
    pointer.y += (pointer.ty - pointer.y) * k * 0.5;

    if (reduced && !dirty) return;
    dirty = false;

    // World metrics at z = 0
    const dist = BASE_DIST * smooth.dolly;
    camera.position.z = dist;
    const worldH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * dist;
    const pxToWorld = worldH / vh;
    const view = { w: worldH * camera.aspect, h: worldH };

    // Hero slot -> screen px
    const r = slot.getBoundingClientRect();
    const slotCx = r.left + r.width / 2;
    const slotCy = r.top + r.height / 2;
    const heroPx = r.width * (isMobile() ? 0.46 : 0.56); // desktop: 256px of the 460px stage, as in the design

    // The tooth lives in the hero: it sits in the hero slot, scrolls away with it and is gone
    // once the hero is out of view (it never travels over the content sections).
    const cx = slotCx, cy = slotCy, px = heroPx;

    pivot.position.set((cx - vw / 2) * pxToWorld, -(cy - vh / 2) * pxToWorld, 0);
    pivot.scale.setScalar(Math.max(px * pxToWorld, 0.0001));
    pivot.visible = r.width > 0 && r.bottom > 0 && r.top < vh;

    // Rotation: slow idle spin + scroll spin + pointer parallax tilt
    if (!reduced) autoSpin += dt * 0.35;
    heroRoot.rotation.y = autoSpin + smooth.spin + pointer.x * 0.35;
    heroRoot.rotation.x = smooth.pitch + pointer.y * 0.2;
    heroRoot.rotation.z = Math.sin(time * 0.5) * 0.04;
    heroRoot.position.y = reduced ? 0 : Math.sin(time * 0.9) * 0.015;

    hero3d.update(dt, { time, glow: smooth.glow });
    lights.update(smooth.glow, time);

    // Particles: fade on narrow screens after the hero (they live in the hero there)
    const partOpacity = isMobile() ? 1 - smooth.leave : lerp(1, 0.75, smooth.leave);
    particles.update(time, window.scrollY * pxToWorld, view, partOpacity, !reduced);

    renderer.render(scene, camera);
  }

  const onVisibility = () => evaluate();
  const onScroll = () => { dirty = true; evaluate(); };
  const onResize = () => { resize(); evaluate(); };
  const onContextLost = (e) => {
    e.preventDefault();
    api.onFail?.();
    api.dispose();
  };

  resize();
  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  if (!reduced && window.matchMedia('(pointer: fine)').matches) window.addEventListener('pointermove', onPointer, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  canvas.addEventListener('webglcontextlost', onContextLost);
  evaluate();

  const api = {
    onFail: null,
    dispose() {
      if (disposed) return;
      disposed = true;
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      scroll.dispose();
      hero3d.dispose();
      particles.dispose();
      lights.dispose();
      scene.remove(pivot, particles.points);
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
  return api;
}
