import { chromium } from "playwright";
import fs from "fs";
const d=(p)=>"data:font/woff2;base64,"+fs.readFileSync(p).toString("base64");
const R = process.cwd();
const MARK = "M12.00 0.80 L14.49 5.99 L19.92 4.08 L18.01 9.51 L23.20 12.00 L18.01 14.49 L19.92 19.92 L14.49 18.01 L12.00 23.20 L9.51 18.01 L4.08 19.92 L5.99 14.49 L0.80 12.00 L5.99 9.51 L4.08 4.08 L9.51 5.99 Z M9.40 8.10 L16.40 12.00 L9.40 15.90 Z";
const HEART = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.2 3 4.5 6.6 4.5c2 0 3.6 1 5.4 3 1.8-2 3.4-3 5.4-3 3.6 0 5.7 3.7 4.2 7.2C19.5 16.4 12 21 12 21Z"/></svg>`;
const html = `<html><head><style>
@font-face{font-family:"Plex Arabic";font-weight:500;src:url("${d(R+"/node_modules/@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-500-normal.woff2")}")}
@font-face{font-family:"Geist";font-weight:100 900;src:url("${d(R+"/node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2")}")}
html,body{margin:0;background:transparent}
.f{width:1080px;height:1920px;position:relative}
.lock{position:absolute;top:150px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:14px;direction:ltr;
 font-family:Geist;font-weight:700;font-size:46px;letter-spacing:-0.02em;color:#f7f7fb;
 background:rgba(8,8,15,.62);border:2px solid rgba(255,255,255,.12);border-radius:999px;padding:18px 36px 18px 28px}
.lock svg{width:52px;height:52px}
.give{position:absolute;bottom:300px;left:50%;transform:translateX(-50%);display:inline-flex;align-items:center;gap:16px;direction:rtl;
 background:#6430f0;color:#fff;border-radius:999px;padding:22px 40px;font-family:"Plex Arabic";font-weight:500;font-size:36px;line-height:1.4;white-space:nowrap;
 box-shadow:0 10px 30px rgba(0,0,0,.35)}
.give svg{width:40px;height:40px;flex:none}
</style></head><body><div class="f">
<div class="lock"><svg viewBox="0 0 24 24" fill="#6c3af9"><path fill-rule="evenodd" d="${MARK}"/></svg>IraqiStar</div>
<div class="give">${HEART}<span>جزء من أرباح المنصة يروح للعمل الخيري بالعراق</span></div>
</div></body></html>`;
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }).catch(() => chromium.launch());
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.setContent(html); await p.evaluate(async () => { await document.fonts.ready; return [...document.fonts].map(f=>f.family+":"+f.status); }).then(console.log);
await p.screenshot({ path: "overlay.png", omitBackground: true });
await b.close();
