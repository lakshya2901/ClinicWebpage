import { icon } from './icons.js';

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const tel = (c) => `tel:${c.clinic.phoneHref}`;
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/** Text that differs between desktop and mobile designs. */
const swap = (desktop, mobile) =>
  mobile && mobile !== desktop
    ? `<span class="md-up">${esc(desktop)}</span><span class="md-down">${esc(mobile)}</span>`
    : esc(desktop);

const brandMark = `<img class="brand__mark" src="/images/logo.svg" alt="" width="32" height="32" />`;

export function renderHeader(c) {
  const links = c.nav
    .map((n) => `<a class="nav__link" href="${n.href}" data-spy="${n.href.slice(1)}">${esc(n.label)}</a>`)
    .join('');
  const drawer = c.nav.map((n) => `<a class="drawer__link" href="${n.href}">${esc(n.label)}</a>`).join('');
  return `
<a class="skip-link" href="#main">Skip to content</a>
<header class="header" id="header">
  <div class="header__inner container">
    <div class="header__left">
      <button class="header__menu" id="menu-btn" type="button" aria-label="Open navigation menu" aria-expanded="false" aria-controls="drawer">${icon('menu', { size: 24 })}</button>
      <a class="brand" href="#top" aria-label="${esc(c.clinic.name)} home">
        ${brandMark}
        <span class="brand__text brand__text--lg"><span class="brand__name">${esc(c.clinic.shortName)}</span><span class="brand__sub">${esc(c.clinic.tagline)}</span></span>
        <span class="brand__text brand__text--sm">${esc(c.clinic.shortName)} Dental</span>
      </a>
    </div>
    <nav class="nav" aria-label="Primary">${links}</nav>
    <div class="header__right">
      <a class="header__phone" href="${tel(c)}">${icon('phone', { size: 18 })}<span>${esc(c.clinic.phone)}</span></a>
      <a class="btn btn--sm btn--primary header__book" href="#book">Book Appointment</a>
      <a class="header__sos" href="${tel(c)}" aria-label="Emergency dental care: call us"><span class="ping ping--error"><span class="ping__ring"></span><span class="ping__dot"></span></span><span>SOS</span></a>
      <img class="header__avatar" src="${c.doctor.photo}" alt="" width="32" height="32" />
    </div>
  </div>
  <div class="drawer" id="drawer" hidden>
    <nav class="drawer__nav" aria-label="Mobile">${drawer}
      <a class="btn btn--primary drawer__cta" href="#book">${esc(c.hero.primaryCta)}</a>
    </nav>
  </div>
</header>`;
}

function trustDesktop(c) {
  return c.hero.trust
    .map((t) => `<div class="chip chip--trust">${icon(t.icon, { size: 18, fill: t.icon === 'star', cls: t.icon === 'star' ? 'icon--star' : 'icon--primary' })}<span>${esc(t.text)}</span></div>`)
    .join('');
}

const toothSvg = `
<svg class="tooth-svg" viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="toothGradient" gradientUnits="userSpaceOnUse" x1="20" x2="180" y1="20" y2="220">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/><stop offset="35%" stop-color="#7bf6f0" stop-opacity="0.85"/>
      <stop offset="70%" stop-color="#2bb5b0" stop-opacity="0.9"/><stop offset="100%" stop-color="#006a67" stop-opacity="0.95"/>
    </linearGradient>
    <linearGradient id="facetHighlight" gradientUnits="userSpaceOnUse" x1="60" x2="140" y1="30" y2="120">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <path d="M100 24C65 24 35 48 35 88C35 124 50 148 65 178C75 198 75 224 88 224C95 224 96 200 100 190C104 200 105 224 112 224C125 224 125 198 135 178C150 148 165 124 165 88C165 48 135 24 100 24Z" fill="url(#toothGradient)"/>
  <path d="M70 42C80 34 120 34 130 42C148 56 152 86 142 120C132 154 116 172 100 178C84 172 68 154 58 120C48 86 52 56 70 42Z" fill="url(#facetHighlight)"/>
  <circle cx="132" cy="74" r="5" fill="#ffffff"/><circle cx="68" cy="112" r="3.5" fill="#7bf6f0"/>
</svg>`;

export function renderHero(c) {
  const h = c.hero;
  const badges = h.floatingBadges
    .map(
      (b) => `<div class="float-badge float-badge--${b.pos}">${icon(b.icon, { size: 20, cls: 'icon--primary' })}<div><p class="float-badge__title">${esc(b.title)}</p><p class="float-badge__sub">${esc(b.sub)}</p></div></div>`
    )
    .join('');
  return `
<section class="hero" id="top" aria-labelledby="hero-title">
  <div class="hero__glow hero__glow--a" aria-hidden="true"></div>
  <div class="hero__glow hero__glow--b" aria-hidden="true"></div>
  <div class="container hero__container">
    <div class="hero__grid">
      <div class="hero__copy">
        <div class="eyebrow-pill" data-hero-item>
          <span class="ping"><span class="ping__ring"></span><span class="ping__dot"></span></span>
          <span>${esc(h.eyebrow)}</span>
        </div>
        <h1 class="hero__title" id="hero-title" data-hero-item>${esc(h.titleBefore)} <em>${esc(h.titleEmphasis)}</em> ${esc(h.titleAfter)}</h1>
        <p class="hero__lead" data-hero-item>${swap(h.lead, h.leadMobile)}</p>
        <div class="hero__ctas" data-hero-item>
          <a class="btn btn--primary btn--lg" href="#book">${icon('calendar', { size: 20, cls: 'md-down' })}<span>${esc(h.primaryCta)}</span>${icon('arrow-right', { size: 20, cls: 'md-up' })}</a>
          <a class="btn btn--secondary btn--lg" href="${tel(c)}">${icon('phone-call', { size: 20 })}<span>Call ${esc(c.clinic.phone)}</span></a>
        </div>
        <div class="trust trust--desktop" data-hero-item>${trustDesktop(c)}</div>
        <div class="trust-mobile" data-hero-item>${icon('star', { size: 14, fill: true, cls: 'icon--primary-container' })}<span>${esc(h.trustMobile)}</span></div>
      </div>
      <div class="hero__visual" data-hero-item>
       <div class="hero__stage" id="hero-3d">
        <div class="orbit orbit--dash" aria-hidden="true"></div>
        <div class="orbit orbit--ring" aria-hidden="true"></div>
        <div class="orbit orbit--fill" aria-hidden="true"></div>
        <div class="hero__tooth" aria-hidden="true">${toothSvg}</div>
        <div class="tooth-mobile" aria-hidden="true">${icon('tooth', { size: 48, fill: true })}</div>
        ${badges}
       </div>
      </div>
    </div>
  </div>
</section>`;
}

export function renderServices(c) {
  const s = c.services;
  const cards = s.items
    .map(
      (it) => `
    <article class="card service-card" data-tilt data-stagger-item>
      <div>
        <div class="service-card__top">
          <div class="icon-badge">${icon(it.icon, { size: 26 })}</div>
          <span class="tag tag--sm service-card__cat">${esc(it.category)}</span>
        </div>
        <h3 class="service-card__title">${esc(it.title)}</h3>
        <p class="service-card__text">${esc(it.text)}</p>
      </div>
      <a class="link-arrow" href="#book" aria-label="${esc(s.cta)}: ${esc(it.title)}"><span>${esc(s.cta)}</span>${icon('arrow-right', { size: 16 })}</a>
    </article>`
    )
    .join('');
  return `
<section class="section section--low" id="services" aria-labelledby="services-title">
  <div class="container">
    <div class="section-head" data-reveal>
      <span class="eyebrow">${swap(s.eyebrow, s.eyebrowMobile)}</span>
      <h2 class="h-lg" id="services-title">${swap(s.title, s.titleMobile)}</h2>
      <p class="section-head__lead">${swap(s.lead, s.leadMobile)}</p>
    </div>
    <div class="grid-services" data-stagger>${cards}</div>
  </div>
</section>`;
}

export function renderStats(c) {
  const s = c.stats;
  const items = s.items
    .map(
      (it) => `
    <div class="stat" data-stagger-item>
      <p class="stat__value" data-count="${it.value}" data-decimals="${it.decimals}" data-suffix="${esc(it.suffix)}">${it.value.toFixed(it.decimals)}${esc(it.suffix)}</p>
      <p class="stat__label"><span class="md-up">${esc(it.label)}</span><span class="md-down">${esc(it.short)}</span></p>
      <p class="stat__sub"><span class="md-up">${esc(it.sub)}</span><span class="md-down">${esc(it.subShort)}</span></p>
    </div>`
    )
    .join('');
  return `
<section class="section section--stats" id="why-us" aria-label="Clinic highlights">
  <div class="container">
    <div class="section-head section-head--mobile-only md-down-block" data-reveal>
      <span class="eyebrow">${esc(s.eyebrowMobile)}</span>
      <h2 class="h-sm">${esc(s.titleMobile)}</h2>
    </div>
    <div class="stats-grid" data-stagger>${items}</div>
  </div>
</section>`;
}

export function renderDoctor(c) {
  const d = c.doctor;
  return `
<section class="section section--doctor" id="meet-doctor" aria-labelledby="doctor-title">
  <div class="container">
    <div class="doctor">
      <div class="doctor__media" data-reveal>
        <div class="doctor__halo" aria-hidden="true"></div>
        <div class="doctor__photo"><img src="${d.photo}" alt="${esc(d.photoAlt)}" width="560" height="560" loading="lazy" decoding="async" /></div>
        <div class="doctor__verified" aria-hidden="true">${icon('badge-check', { size: 20, fill: false })}</div>
        <div class="md-up-block"><div class="float-badge float-badge--doctor">${icon('award', { size: 24, cls: 'icon--amber' })}<div><p class="float-badge__title">${esc(d.badge.title)}</p><p class="float-badge__sub">${esc(d.badge.sub)}</p></div></div></div>
      </div>
      <div class="doctor__body" data-reveal>
        <div class="tag tag--primary">${esc(d.role).toUpperCase()}</div>
        <h2 class="doctor__name" id="doctor-title">${esc(d.nameWithCredentials)}</h2>
        <p class="doctor__cred">${esc(d.credentialLine)}</p>
        <div class="doctor__bio">${d.bio.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
        <div class="doctor__tags">${d.tags.map((t) => `<span class="tag tag--high">${esc(t)}</span>`).join('')}</div>
      </div>
    </div>
  </div>
</section>`;
}

export function renderProcess(c) {
  const p = c.process;
  const steps = p.steps
    .map(
      (s, i) => `
    <li class="step" data-stagger-item>
      <div class="step__num" aria-hidden="true"><span class="step__zero">0</span>${i + 1}</div>
      <h3 class="step__title">${esc(s.title)}</h3>
      <p class="step__text">${esc(s.text)}</p>
    </li>`
    )
    .join('');
  return `
<section class="section section--low" id="process" aria-labelledby="process-title">
  <div class="container">
    <div class="section-head section-head--center" data-reveal>
      <span class="eyebrow">${esc(p.eyebrow)}</span>
      <h2 class="h-lg" id="process-title">${esc(p.title)}</h2>
    </div>
    <div class="timeline" id="timeline">
      <div class="timeline__line" aria-hidden="true"><span class="timeline__fill"></span></div>
      <ol class="steps" data-stagger>${steps}</ol>
    </div>
  </div>
</section>`;
}

export function renderTech(c) {
  const t = c.tech;
  const k = t.caseCard;
  const points = t.points
    .map(
      (p) => `<li class="point">${icon('circle-check', { size: 22, cls: 'icon--primary' })}<div><p class="point__title">${esc(p.title)}</p><p class="point__text">${esc(p.text)}</p></div></li>`
    )
    .join('');
  const compare = t.mobileCompare
    .map(
      (m) => `<div class="compare__cell">${icon(m.good ? 'circle-check' : 'circle-x', { size: 18, cls: m.good ? 'icon--primary' : 'icon--error' })}<span class="compare__title">${esc(m.title)}</span><span class="compare__text">${esc(m.text)}</span></div>`
    )
    .join('');
  return `
<section class="section section--doctor" id="tech-results" aria-labelledby="tech-title">
  <div class="container">
    <div class="tech">
      <div class="tech__copy" data-reveal>
        <span class="eyebrow">${esc(t.eyebrow)}</span>
        <h2 class="h-lg tech__title" id="tech-title">${esc(t.title)}</h2>
        <p class="tech__lead">${esc(t.lead)}</p>
        <ul class="points" data-stagger>${points.replace(/class="point"/g, 'class="point" data-stagger-item')}</ul>
      </div>
      <div class="tech__visual" data-reveal>
        <div class="case-card">
          <div class="case-card__head"><span class="case-card__title">${esc(k.title)}</span><span class="tag tag--fixed">${esc(k.chip)}</span></div>
          <div class="case-card__grid">
            <figure class="case-card__fig">
              <div class="case-card__img"><img src="${k.beforeImg}" alt="${esc(k.beforeAlt)}" width="400" height="300" loading="lazy" decoding="async" /><span class="label label--dark">${esc(k.beforeLabel)}</span></div>
              <figcaption>${esc(k.beforeCaption)}</figcaption>
            </figure>
            <figure class="case-card__fig">
              <div class="case-card__img"><img src="${k.afterImg}" alt="${esc(k.afterAlt)}" width="400" height="300" loading="lazy" decoding="async" /><span class="label label--primary">${esc(k.afterLabel)}</span></div>
              <figcaption>${esc(k.afterCaption)}</figcaption>
            </figure>
          </div>
          <div class="case-card__foot">
            <div class="case-card__foot-l">${icon('gauge', { size: 28, cls: 'icon--primary' })}<div><p class="case-card__foot-title">${esc(k.footTitle)}</p><p class="case-card__foot-text">${esc(k.footText)}</p></div></div>
            <a class="case-card__cta" href="#book">${esc(k.footCta)}</a>
          </div>
        </div>
        <div class="scan-card">
          <div class="scan-card__img"><img src="${t.mobileImg}" alt="${esc(t.mobileImgAlt)}" width="640" height="300" loading="lazy" decoding="async" /><div class="scan-card__badge">${icon('box', { size: 18, cls: 'icon--primary' })}<span>${esc(t.mobileBadge)}</span></div></div>
          <div class="compare">${compare}</div>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

export function renderReviews(c) {
  const r = c.reviews;
  const cards = r.items
    .map(
      (it, i) => `
    <figure class="review" role="group" aria-roledescription="slide" aria-label="Review ${i + 1} of ${r.items.length}" data-slide>
      <div>
        <div class="review__stars" role="img" aria-label="5 out of 5 stars">${icon('star', { size: 20, fill: true }).repeat(5)}</div>
        <blockquote class="review__quote">“${esc(it.quote)}”</blockquote>
      </div>
      <figcaption class="review__who">
        <span class="avatar" aria-hidden="true">${esc(it.initials)}</span>
        <span><span class="review__name">${esc(it.name)}</span><span class="review__meta">${esc(it.meta)}</span></span>
      </figcaption>
    </figure>`
    )
    .join('');
  return `
<section class="section section--low" id="reviews" aria-labelledby="reviews-title">
  <div class="container">
    <div class="reviews__head" data-reveal>
      <div class="section-head section-head--flush">
        <span class="eyebrow">${swap(r.eyebrow, r.eyebrowMobile)}</span>
        <h2 class="h-lg" id="reviews-title">${swap(r.title, r.titleMobile)}</h2>
      </div>
      <div class="carousel-nav">
        <button class="round-btn" id="reviews-prev" type="button" aria-label="Previous review">${icon('chevron-left', { size: 20 })}</button>
        <button class="round-btn" id="reviews-next" type="button" aria-label="Next review">${icon('chevron-right', { size: 20 })}</button>
      </div>
    </div>
    <div class="carousel" id="reviews-carousel" role="region" aria-roledescription="carousel" aria-label="Patient reviews" tabindex="0">
      <div class="carousel__track" id="reviews-track">${cards}</div>
    </div>
  </div>
</section>`;
}

export function renderFaq(c) {
  const f = c.faq;
  const items = f.items
    .map((it, i) => {
      const id = `faq-${i + 1}`;
      return `
    <div class="faq-item${i === 0 ? ' is-open' : ''}" data-stagger-item>
      <h3 class="faq-item__heading"><button class="faq-item__btn" id="${id}-btn" type="button" aria-expanded="${i === 0}" aria-controls="${id}-panel"><span>${esc(it.q)}</span>${icon('chevron-down', { size: 24, cls: 'faq-item__chev' })}</button></h3>
      <div class="faq-item__panel" id="${id}-panel" role="region" aria-labelledby="${id}-btn"><div class="faq-item__inner"><p>${esc(it.a)}</p></div></div>
    </div>`;
    })
    .join('');
  return `
<section class="section section--doctor" id="faq" aria-labelledby="faq-title">
  <div class="container container--narrow">
    <div class="section-head section-head--center" data-reveal>
      <span class="eyebrow">${esc(f.eyebrow)}</span>
      <h2 class="h-lg" id="faq-title">${esc(f.title)}</h2>
    </div>
    <div class="faq" data-stagger>${items}</div>
  </div>
</section>`;
}

export function renderBooking(c) {
  const b = c.booking;
  const sb = b.sidebar;
  const field = (label, control, id, extra = '') =>
    `<div class="field ${extra}"><label class="field__label" for="${id}">${label}</label>${control}<p class="field__error" id="${id}-error" role="alert"></p></div>`;
  const times = b.times
    .map(
      (t, i) => `<label class="pill"><input type="radio" name="time" value="${t.value}"${i === 0 ? ' checked' : ''} /><span>${esc(t.label)}</span></label>`
    )
    .join('');
  return `
<section class="section section--low" id="book" aria-labelledby="book-title">
  <div class="container">
    <div class="booking" data-reveal>
      <div class="booking__grid">
        <div class="booking__main">
          <div>
            <span class="eyebrow">${swap(b.eyebrow, b.eyebrowMobile)}</span>
            <h2 class="h-lg booking__title" id="book-title">${swap(b.title, b.titleMobile)}</h2>
            <p class="booking__lead">${swap(b.lead, b.leadMobile)}</p>
          </div>
          <form class="form" id="booking-form" novalidate>
            <div class="form__row">
              ${field('Full Name', '<input id="bk-name" name="name" type="text" autocomplete="name" placeholder="Your full name" required />', 'bk-name')}
              ${field('Phone Number', '<input id="bk-phone" name="phone" type="tel" autocomplete="tel" placeholder="(000) 000-0000" required />', 'bk-phone')}
            </div>
            <div class="form__row">
              ${field('Email Address', '<input id="bk-email" name="email" type="email" autocomplete="email" placeholder="you@example.com" />', 'bk-email', 'desktop-only')}
              ${field('Service Needed', `<select id="bk-service" name="service">${b.services.map((s) => `<option>${esc(s)}</option>`).join('')}</select>`, 'bk-service')}
            </div>
            <div class="form__row desktop-only">
              ${field('Preferred Date', '<input id="bk-date" name="date" type="date" />', 'bk-date')}
              <div class="field"><span class="field__label" id="bk-time-label">Preferred Time</span><div class="pills pills--desktop" role="radiogroup" aria-labelledby="bk-time-label">${times}</div></div>
            </div>
            <div class="field mobile-only"><span class="field__label" id="bk-time-label-m">Preferred Time of Day</span><div class="pills" role="radiogroup" aria-labelledby="bk-time-label-m">${times.replace(/name="time"/g, 'name="time-m"')}</div></div>
            ${field('Special Comfort Requests (Optional)', '<textarea id="bk-notes" name="notes" rows="2" placeholder="e.g. Mild dental anxiety, sensitivity to cold water, need parking assistance..."></textarea>', 'bk-notes', 'desktop-only')}
            <p class="form__status" id="form-status" role="status" aria-live="polite"></p>
            <button class="btn btn--primary btn--block" type="submit" id="booking-submit">${icon('check', { size: 20, cls: 'md-down' })}<span>${swap(b.submit, b.submitMobile)}</span></button>
          </form>
          <div class="success" id="booking-success" hidden tabindex="-1">
            <div class="success__icon">${icon('circle-check', { size: 40 })}</div>
            <h3 class="success__title">${esc(b.successTitle)}</h3>
            <p>${esc(b.successText)}</p>
            <button class="btn btn--secondary" type="button" id="booking-reset">Send another request</button>
          </div>
        </div>
        <aside class="booking__side">
          <div class="booking__info">
            <h3 class="h-sm">${esc(sb.title)}</h3>
            <div class="info-list">
              <div class="info-row">${icon('clock', { size: 20, cls: 'icon--primary' })}<div><p class="info-row__title">${esc(sb.hoursTitle)}</p>${sb.hours.map((h) => `<p>${esc(h)}</p>`).join('')}</div></div>
              <div class="info-row">${icon('car', { size: 20, cls: 'icon--primary' })}<div><p class="info-row__title">${esc(sb.parkingTitle)}</p><p>${esc(sb.parking)}</p></div></div>
              <div class="info-row">${icon('phone-call', { size: 20, cls: 'icon--primary' })}<div><p class="info-row__title">${esc(sb.phoneTitle)}</p><a class="text-link" href="${tel(c)}">${esc(c.clinic.phone)}</a></div></div>
            </div>
          </div>
          <div class="promise"><p class="promise__title">${esc(sb.guaranteeTitle)}</p><p>${esc(sb.guarantee)}</p></div>
        </aside>
      </div>
    </div>
  </div>
</section>`;
}

export function renderContact(c) {
  const k = c.contact;
  return `
<section class="section section--doctor" id="contact" aria-labelledby="contact-title">
  <div class="container">
    <div class="contact">
      <div class="contact__info" data-reveal>
        <span class="eyebrow">${swap(k.eyebrow, k.eyebrowMobile)}</span>
        <h2 class="h-lg" id="contact-title">${swap(k.title, k.titleMobile)}</h2>
        <p class="contact__lead">${esc(k.lead)}</p>
        <ul class="contact__list">
          <li>${icon('map-pin', { size: 22, cls: 'icon--primary' })}<div><p class="contact__strong">${esc(c.clinic.name)}</p><p>${c.clinic.addressLines.map(esc).join('<br/>')}</p></div></li>
          <li>${icon('phone', { size: 22, cls: 'icon--primary' })}<a class="text-hover" href="${tel(c)}">${esc(c.clinic.phone)}</a></li>
          <li>${icon('mail', { size: 22, cls: 'icon--primary' })}<a class="text-hover" href="mailto:${esc(c.clinic.email)}">${esc(c.clinic.email)}</a></li>
          <li class="md-down-flex">${icon('clock', { size: 22, cls: 'icon--primary' })}<div><p class="contact__strong">${esc(k.hoursMobileTitle)}</p>${c.booking.sidebar.hours.map((h) => `<p>${esc(h)}</p>`).join('')}</div></li>
        </ul>
      </div>
      <div class="contact__map" data-reveal>
        <a class="map" href="${c.clinic.mapsUrl}" target="_blank" rel="noopener noreferrer" aria-label="Open ${esc(c.clinic.name)} in Google Maps (opens in a new tab)">
          <img src="${k.mapImg}" alt="${esc(k.mapAlt)}" width="760" height="380" loading="lazy" decoding="async" />
          <span class="map__label">${icon('navigation', { size: 18, cls: 'icon--primary' })}<span>${esc(k.mapLabel)}</span></span>
        </a>
      </div>
    </div>
  </div>
</section>`;
}

export function renderFooter(c) {
  const f = c.footer;
  const dir = c.services.items.map((s) => `<li><a href="#services">${esc(s.title)}</a></li>`).join('');
  const hours = f.hours
    .map((h) => `<li><span>${esc(h[0])}</span><span class="footer__hours-val">${esc(h[1])}</span></li>`)
    .join('');
  const mobileLinks = f.mobileLinks
    .map((l) => `<a href="${l.href === 'tel' ? tel(c) : l.href}">${esc(l.label)}</a>`)
    .join('<span aria-hidden="true">•</span>');
  return `
<section class="strip" aria-label="Services directory and clinical information">
  <div class="container">
    <div class="strip__grid">
      <div class="strip__col"><img class="strip__logo" src="/images/logo.svg" alt="" width="40" height="40" /><p>${esc(f.about)}</p></div>
      <div class="strip__col"><p class="strip__title">${esc(f.directoryTitle)}</p><ul>${dir.split('</li>').slice(0, 5).join('</li>')}</ul></div>
      <div class="strip__col"><p class="strip__title">${esc(f.emergencyTitle)}</p><p>${esc(f.emergencyText)}</p><a class="text-link strip__phone" href="${tel(c)}">${icon('siren', { size: 18 })}<span>${esc(c.clinic.phone)}</span></a></div>
      <div class="strip__col"><p class="strip__title">${esc(f.disclaimerTitle)}</p><p class="strip__small">${esc(f.disclaimer)} ${esc(c.doctor.name)}, Lic. ${esc(c.clinic.license)}.</p></div>
    </div>
  </div>
</section>
<footer class="footer">
  <div class="container">
    <div class="footer__grid">
      <div class="footer__col">
        <div class="footer__brand"><img src="/images/logo.svg" alt="" width="32" height="32" /><span>${esc(c.clinic.shortName)} Dental</span></div>
        <p>${esc(f.aboutLong)}</p>
        <div class="footer__badges">${f.badges.map((b) => `<span class="tag tag--sm tag--primary">${esc(b)}</span>`).join('')}</div>
      </div>
      <div class="footer__col"><h3 class="footer__h">Clinic Directory</h3>
        <ul class="footer__list">
          <li>${icon('map-pin', { size: 18, cls: 'icon--primary' })}<span>${c.clinic.addressLines.map(esc).join('<br/>')}</span></li>
          <li>${icon('phone', { size: 18, cls: 'icon--primary' })}<a href="${tel(c)}">${esc(c.clinic.phone)}</a></li>
          <li>${icon('mail', { size: 18, cls: 'icon--primary' })}<a href="mailto:${esc(c.clinic.email)}">${esc(c.clinic.email)}</a></li>
        </ul>
      </div>
      <div class="footer__col"><h3 class="footer__h">${esc(f.hoursTitle)}</h3><ul class="footer__hours">${hours}</ul></div>
      <div class="footer__col"><h3 class="footer__h">${esc(f.accreditationsTitle)}</h3><p>${esc(f.accreditationsText)}</p>
        <div class="footer__oncall"><p class="footer__oncall-title">${esc(f.oncallTitle)}</p><p>${esc(f.oncallText)}</p></div>
      </div>
    </div>
    <div class="footer__bottom">
      <p>© ${new Date().getFullYear()} ${esc(c.clinic.name)} ${esc(c.clinic.city)}. All rights reserved. CA Lic. ${esc(c.clinic.license)}.</p>
      <nav class="footer__legal" aria-label="Legal">${f.legal.map((l) => `<a href="${l.href}">${esc(l.label)}</a>`).join('')}</nav>
    </div>
    <div class="footer__mobile">
      <div class="footer__mobile-brand"><span class="footer__mobile-mark">${icon('tooth', { size: 14, fill: true })}</span><span>${esc(c.clinic.name)}</span></div>
      <div class="footer__mobile-links">${mobileLinks}</div>
      <p>${esc(c.doctor.nameWithCredentials)} • ${esc(c.clinic.name)} SF<br/>© ${new Date().getFullYear()} ${esc(c.clinic.name)}. All rights reserved.</p>
    </div>
  </div>
</footer>`;
}

export function renderFloating(c) {
  const wa = `https://wa.me/${c.clinic.whatsapp}?text=${encodeURIComponent(c.clinic.whatsappMessage)}`;
  const tabs = c.mobileTabs
    .map(
      (t, i) => `<a class="tab${i === 0 ? ' is-active' : ''}" href="${t.href}" data-spy="${t.href.slice(1)}"${i === 0 ? ' aria-current="true"' : ''}>${icon(t.icon, { size: 20 })}<span>${esc(t.label)}</span></a>`
    )
    .join('');
  return `
<a class="whatsapp" href="${wa}" target="_blank" rel="noopener noreferrer" aria-label="Chat with ${esc(c.clinic.name)} on WhatsApp (opens in a new tab)">
  <span class="ping"><span class="ping__ring"></span><span class="ping__dot ping__dot--light"></span></span>
  <span class="whatsapp__label">${esc(c.whatsapp.label)}</span>${icon('message-circle', { size: 20, cls: 'whatsapp__icon' })}
</a>
<nav class="mobile-bar" aria-label="Quick actions">
  <div class="mobile-bar__actions">
    <a class="btn btn--bar btn--bar-call" href="${tel(c)}">${icon('phone', { size: 18 })}<span>Call Clinic</span></a>
    <a class="btn btn--bar btn--primary btn--bar-book" href="#book">${icon('calendar', { size: 18 })}<span>Book Appointment</span></a>
  </div>
  <div class="mobile-bar__tabs">${tabs}</div>
</nav>`;
}

export function renderApp(c) {
  return [
    renderHeader(c),
    '<main id="main">',
    renderHero(c), renderServices(c), renderStats(c), renderDoctor(c), renderProcess(c),
    renderTech(c), renderReviews(c), renderFaq(c), renderBooking(c), renderContact(c),
    '</main>',
    renderFooter(c),
    renderFloating(c),
  ].join('\n');
}

export function renderJsonLd(c) {
  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'Dentist',
      name: c.clinic.name,
      description: c.site.description,
      url: c.site.url,
      image: `${c.site.url}${c.site.ogImage}`,
      telephone: c.clinic.phone,
      email: c.clinic.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: '[STREET ADDRESS]',
        addressLocality: c.clinic.city,
        addressRegion: 'CA',
        postalCode: '[ZIP]',
        addressCountry: 'US',
      },
      openingHours: '[OPENING HOURS e.g. Mo-Fr 08:00-17:00]',
      founder: { '@type': 'Person', name: c.doctor.name, jobTitle: 'Dentist' },
      sameAs: Object.values(c.clinic.social).filter(Boolean),
    },
    null,
    2
  );
}

export { slug };
