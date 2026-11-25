import { config } from '../config.js';

/**
 * ── SUBMIT HANDLER STUB ─────────────────────────────────────────────────────────
 * Replace the body of this function to connect your API / email service.
 * It receives a plain object { name, phone, email, service, date, time, notes }
 * and must resolve on success or throw on failure (the message is shown to the user).
 *
 * Quick option: set `booking.endpoint` in config.js to a URL (Formspree, Netlify
 * Forms function, your backend...) and it will receive a JSON POST.
 */
export async function submitBooking(data) {
  const endpoint = config.booking.endpoint;
  if (!endpoint) {
    // Demo mode: nothing is sent anywhere.
    console.info('[booking] demo mode. Payload that would be sent:', data);
    await new Promise((r) => setTimeout(r, 600));
    return { ok: true, demo: true };
  }
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('We could not send your request. Please call us instead.');
  return { ok: true };
}

const rules = {
  name: (v) => (v.trim().length < 2 ? 'Please enter your full name.' : ''),
  phone: (v) => (v.replace(/\D/g, '').length < 7 ? 'Please enter a valid phone number.' : ''),
  email: (v) => (v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Please enter a valid email address.' : ''),
  date: (v) => {
    if (!v) return '';
    const d = new Date(v + 'T00:00:00');
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return d < today ? 'Please choose a date in the future.' : '';
  },
};

export function initBooking() {
  const form = document.getElementById('booking-form');
  if (!form) return;
  const success = document.getElementById('booking-success');
  const status = document.getElementById('form-status');
  const submit = document.getElementById('booking-submit');
  const reset = document.getElementById('booking-reset');
  const dateInput = form.elements.date;
  if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

  const visible = (el) => el.offsetParent !== null || el.getClientRects().length > 0;

  function setError(input, msg) {
    const field = input.closest('.field');
    const err = document.getElementById(`${input.id}-error`);
    field.classList.toggle('is-invalid', !!msg);
    if (msg) { input.setAttribute('aria-invalid', 'true'); input.setAttribute('aria-describedby', err.id); }
    else { input.removeAttribute('aria-invalid'); input.removeAttribute('aria-describedby'); }
    err.textContent = msg;
  }
  function validateField(input) {
    if (!visible(input) || !rules[input.name]) return '';
    const msg = rules[input.name](input.value);
    setError(input, msg);
    return msg;
  }

  ['name', 'phone', 'email', 'date'].forEach((n) => {
    const el = form.elements[n];
    if (!el) return;
    el.addEventListener('blur', () => validateField(el));
    el.addEventListener('input', () => { if (el.getAttribute('aria-invalid')) validateField(el); });
  });

  // Keep desktop radio group and mobile radio group in sync.
  form.addEventListener('change', (e) => {
    if (e.target.name === 'time' || e.target.name === 'time-m') {
      form.querySelectorAll(`input[name="time"][value="${e.target.value}"], input[name="time-m"][value="${e.target.value}"]`).forEach((r) => (r.checked = true));
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = '';
    const invalid = ['name', 'phone', 'email', 'date'].map((n) => form.elements[n]).filter(Boolean).filter((el) => validateField(el));
    if (invalid.length) { invalid[0].focus(); return; }

    const fd = new FormData(form);
    const data = {
      name: fd.get('name').trim(),
      phone: fd.get('phone').trim(),
      email: (fd.get('email') || '').trim(),
      service: fd.get('service'),
      date: fd.get('date') || '',
      time: fd.get('time') || fd.get('time-m') || '',
      notes: (fd.get('notes') || '').trim(),
    };
    const label = submit.querySelector('span:last-child');
    const original = label.innerHTML;
    submit.disabled = true;
    label.textContent = 'Sending…';
    try {
      await submitBooking(data);
      form.hidden = true;
      form.parentElement.querySelectorAll(':scope > div:first-child').forEach((d) => (d.hidden = true));
      success.hidden = false;
      success.focus();
    } catch (err) {
      status.textContent = err.message || 'Something went wrong. Please try again.';
    } finally {
      submit.disabled = false;
      label.innerHTML = original;
    }
  });

  reset?.addEventListener('click', () => {
    form.reset();
    form.hidden = false;
    form.parentElement.querySelectorAll(':scope > div:first-child').forEach((d) => (d.hidden = false));
    success.hidden = true;
    form.elements.name.focus();
  });
}
