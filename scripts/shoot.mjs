// Usage: node scripts/shoot.mjs <url> <outPrefix> [--full] [--wait ms]
// Takes 1440 and 390 screenshots with the system Chrome (no browser download needed).
import { chromium } from 'playwright-core';
const [url, prefix, ...flags] = process.argv.slice(2);
const waitMs = Number(flags[flags.indexOf('--wait') + 1]) || 1500;
const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
for (const [name, w, h] of [['d', 1440, 900], ['m', 390, 844]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: flags.includes('--reduced') ? 'reduce' : 'no-preference' });
  const page = await ctx.newPage();
  page.on('console', (m) => ['error', 'warning'].includes(m.type()) && console.log(`[${name}] ${m.type()}:`, m.text()));
  page.on('pageerror', (e) => console.log(`[${name}] pageerror:`, e.message));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(waitMs);
  if (flags.includes('--scroll')) {
    // trigger scroll-based reveals
    const H = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 500) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(120); }
    await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(800);
  }
  await page.screenshot({ path: `${prefix}-${name}.png`, fullPage: true });
  if (flags.includes('--slices')) {
    const H = await page.evaluate(() => document.documentElement.scrollHeight);
    const step = name === 'd' ? 1000 : 1400;
    for (let y = 0, i = 0; y < H; y += step, i++) {
      await page.screenshot({ path: `${prefix}-${name}-${String(i).padStart(2, '0')}.png`, fullPage: true, clip: { x: 0, y, width: w, height: Math.min(step, H - y) } });
    }
  }
  console.log(`saved ${prefix}-${name}.png`, await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.scrollHeight]));
  await ctx.close();
}
await browser.close();
