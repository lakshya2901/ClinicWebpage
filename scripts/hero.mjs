import { chromium } from 'playwright-core';
const [url, out, w = '1440', h = '900'] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'] });
const p = await (await b.newContext({ viewport: { width: +w, height: +h } })).newPage();
p.on('pageerror', (e) => console.log('pageerror', e.message));
await p.goto(url, { waitUntil: 'networkidle' }); await p.waitForTimeout(6000);
await p.screenshot({ path: out });
await b.close();
