/** Sticky header: mobile drawer, anchor focus handling, scroll-spy. */
export function initNav() {
  const header = document.getElementById('header');
  const btn = document.getElementById('menu-btn');
  const drawer = document.getElementById('drawer');
  if (!btn || !drawer) return;

  const setOpen = (open) => {
    drawer.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    btn.innerHTML = open ? btn.dataset.close : btn.dataset.open;
  };
  btn.dataset.open = btn.innerHTML;
  btn.dataset.close =
    '<svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';

  btn.addEventListener('click', () => setOpen(drawer.hidden));
  drawer.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !drawer.hidden) { setOpen(false); btn.focus(); }
  });
  document.addEventListener('click', (e) => {
    if (!drawer.hidden && !e.composedPath().includes(header)) setOpen(false);
  });
  window.matchMedia('(min-width: 1280px)').addEventListener('change', (e) => { if (e.matches) setOpen(false); });

  // Move focus to the target section after an anchor jump (keyboard / screen reader users)
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href') === '#') return;
    const target = document.getElementById(a.getAttribute('href').slice(1));
    if (!target) return;
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    setTimeout(() => target.focus({ preventScroll: true }), 400);
  });

  // Scroll-spy for desktop nav links and mobile tabs
  const links = [...document.querySelectorAll('[data-spy]')];
  const ids = [...new Set(links.map((l) => l.dataset.spy))];
  const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
  if (!('IntersectionObserver' in window)) return;
  const visible = new Map();
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => visible.set(en.target.id, en.isIntersecting ? en.intersectionRatio : 0));
      let best = ids[0], bestRatio = -1;
      for (const [id, ratio] of visible) if (ratio > bestRatio) { best = id; bestRatio = ratio; }
      if (bestRatio <= 0) best = 'top';
      links.forEach((l) => {
        const on = l.dataset.spy === best;
        l.classList.toggle('is-active', on);
        if (on) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
      });
    },
    { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.01, 0.5, 1] }
  );
  sections.forEach((s) => io.observe(s));
}
