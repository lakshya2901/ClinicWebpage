/** Accessible accordion: buttons with aria-expanded/aria-controls, one open at a time. */
export function initFaq() {
  const items = [...document.querySelectorAll('.faq-item')];
  const buttons = items.map((i) => i.querySelector('.faq-item__btn'));
  const set = (item, open) => {
    item.classList.toggle('is-open', open);
    item.querySelector('.faq-item__btn').setAttribute('aria-expanded', String(open));
  };
  items.forEach((item) => {
    const btn = item.querySelector('.faq-item__btn');
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      items.forEach((o) => set(o, false));
      set(item, open);
    });
    btn.addEventListener('keydown', (e) => {
      const i = buttons.indexOf(btn);
      const move = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: buttons.length - 1 }[e.key];
      if (move === undefined) return;
      e.preventDefault();
      buttons[(move + buttons.length) % buttons.length].focus();
    });
  });
}
