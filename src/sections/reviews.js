/** Testimonials carousel: scroll-snap track + prev/next buttons (swipe works natively). */
export function initReviews() {
  const carousel = document.getElementById('reviews-carousel');
  const track = document.getElementById('reviews-track');
  const prev = document.getElementById('reviews-prev');
  const next = document.getElementById('reviews-next');
  if (!carousel || !track) return;
  const slides = [...track.querySelectorAll('[data-slide]')];

  const step = () => {
    const a = slides[0], b = slides[1];
    return b ? b.offsetLeft - a.offsetLeft : a.offsetWidth;
  };
  const update = () => {
    const max = carousel.scrollWidth - carousel.clientWidth - 2;
    if (prev) prev.disabled = carousel.scrollLeft <= 2;
    if (next) next.disabled = carousel.scrollLeft >= max;
  };
  const go = (dir) => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    carousel.scrollBy({ left: dir * step(), behavior: reduced ? 'auto' : 'smooth' });
  };
  prev?.addEventListener('click', () => go(-1));
  next?.addEventListener('click', () => go(1));
  carousel.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
  });
  window.addEventListener('resize', update, { passive: true });
  update();
}
