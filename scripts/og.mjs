// Generates public/og-image.png (1200x630) as a branded placeholder. Re-run after changing text.
import { chromium } from 'playwright-core';
const html = `<html><body style="margin:0;width:1200px;height:630px;background:linear-gradient(135deg,#f5fbfa,#c8dbfe 120%);font-family:Helvetica,Arial,sans-serif;display:flex;align-items:center;padding:0 90px;box-sizing:border-box;position:relative;overflow:hidden">
<div style="position:absolute;right:-120px;top:-120px;width:640px;height:640px;border-radius:50%;background:radial-gradient(circle,#7bf6f0aa,transparent 70%)"></div>
<div style="position:relative;max-width:700px"><div style="display:flex;align-items:center;gap:16px;margin-bottom:36px"><div style="width:64px;height:64px;border-radius:18px;background:#2bb5b0"></div><div style="font-size:30px;font-weight:700;color:#006a67;letter-spacing:-.5px">Aura Dental Studio</div></div>
<div style="font-size:68px;line-height:1.08;font-weight:800;color:#171d1c;letter-spacing:-2px">Healthy smiles engineered with <span style="color:#006a67;font-style:italic">precision</span> &amp; artistry</div>
<div style="margin-top:28px;font-size:26px;color:#3c4948">San Francisco • Pacific Heights</div></div></body></html>`;
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
await p.setContent(html); await p.screenshot({ path: 'public/og-image.png' });
await b.close();
