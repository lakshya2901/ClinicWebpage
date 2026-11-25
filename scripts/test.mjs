// Functional smoke tests against the dev server. Usage: node scripts/test.mjs <url>
import { chromium } from 'playwright-core';
const url = process.argv[2];
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'] });
const results = [];
const ok = (name, cond, extra = '') => { results.push(cond); console.log(cond ? 'PASS' : 'FAIL', name, extra); };

// --- Desktop ---
let ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
let page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
ok('webgl class applied', await page.evaluate(() => document.documentElement.classList.contains('webgl')));
ok('canvas aria-hidden', await page.evaluate(() => document.getElementById('scene').getAttribute('aria-hidden') === 'true'));
// scroll scene
await page.evaluate(() => window.scrollTo(0, 1800)); await page.waitForTimeout(2500);
await page.screenshot({ path: 'shots/scroll-1800.png' });
// counters
await page.evaluate(() => document.getElementById('why-us').scrollIntoView()); await page.waitForTimeout(2500);
ok('counter finished', (await page.locator('[data-count]').first().textContent()).trim() === '99.4%', await page.locator('[data-count]').first().textContent());
// FAQ
const btns = page.locator('.faq-item__btn');
await btns.nth(1).scrollIntoViewIfNeeded(); await btns.nth(1).click();
ok('faq opens item 2', (await btns.nth(1).getAttribute('aria-expanded')) === 'true');
ok('faq closes item 1', (await btns.nth(0).getAttribute('aria-expanded')) === 'false');
await btns.nth(1).focus(); await page.keyboard.press('ArrowDown');
ok('faq arrow nav', await page.evaluate(() => document.activeElement.id === 'faq-3-btn'));
// carousel
await page.locator('#reviews').scrollIntoViewIfNeeded(); await page.waitForTimeout(800);
const before = await page.evaluate(() => document.getElementById('reviews-carousel').scrollLeft);
await page.click('#reviews-next'); await page.waitForTimeout(900);
const after = await page.evaluate(() => document.getElementById('reviews-carousel').scrollLeft);
ok('carousel next scrolls', after > before, `${before} -> ${after}`);
// form validation
await page.locator('#book').scrollIntoViewIfNeeded(); await page.waitForTimeout(800);
await page.click('#booking-submit');
ok('empty form shows errors', (await page.locator('#bk-name-error').textContent()).length > 0);
ok('invalid focus moved to name', await page.evaluate(() => document.activeElement.id === 'bk-name'));
await page.fill('#bk-name', 'Test Patient'); await page.fill('#bk-phone', '5551234567');
await page.fill('#bk-email', 'bad'); await page.click('#booking-submit');
ok('bad email flagged', (await page.locator('#bk-email-error').textContent()).length > 0);
await page.fill('#bk-email', 'a@b.co'); await page.click('#booking-submit');
await page.waitForSelector('#booking-success:not([hidden])', { timeout: 4000 }).catch(() => {});
ok('success state shown', await page.locator('#booking-success').isVisible());
await page.click('#booking-reset');
ok('reset returns to form', await page.locator('#booking-form').isVisible());
ok('no console/page errors (desktop)', errors.filter((e) => !/GL Driver|ReadPixels/.test(e)).length === 0, errors.join(' | '));
await ctx.close();

// --- Mobile ---
ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
page = await ctx.newPage();
await page.goto(url, { waitUntil: 'networkidle' }); await page.waitForTimeout(2500);
ok('mobile: no horizontal overflow', await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), await page.evaluate(() => document.documentElement.scrollWidth));
ok('mobile: bottom bar visible', await page.locator('.mobile-bar').isVisible());
ok('mobile: desktop nav hidden', !(await page.locator('.nav').isVisible()));
await page.click('#menu-btn');
ok('mobile: drawer opens', await page.locator('#drawer').isVisible() && (await page.getAttribute('#menu-btn', 'aria-expanded')) === 'true');
await page.click('.drawer__link[href="#faq"]'); await page.waitForTimeout(1200);
ok('mobile: drawer closes on nav', !(await page.locator('#drawer').isVisible()));
await page.screenshot({ path: 'shots/mobile-faq.png' });
await ctx.close();

// --- Reduced motion ---
ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
page = await ctx.newPage();
await page.goto(url, { waitUntil: 'networkidle' }); await page.waitForTimeout(2500);
ok('reduced: hero visible without animation', await page.evaluate(() => getComputedStyle(document.querySelector('.hero__title')).opacity === '1'));
await page.screenshot({ path: 'shots/reduced.png' });
await ctx.close();

// --- No WebGL ---
ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
page = await ctx.newPage();
await page.addInitScript(() => { const orig = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (t, ...a) { return /webgl/.test(t) ? null : orig.call(this, t, ...a); }; });
await page.goto(url, { waitUntil: 'networkidle' }); await page.waitForTimeout(2500);
ok('no-webgl: fallback tooth svg visible', await page.evaluate(() => getComputedStyle(document.querySelector('.hero__tooth')).opacity === '1' && !document.documentElement.classList.contains('webgl')));
await ctx.close();
await browser.close();
console.log(results.every(Boolean) ? '\nALL PASSED' : '\nSOME FAILED');
