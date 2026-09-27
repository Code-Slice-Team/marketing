// IraqiStar logo reveal — 4.5 s, brand motion only. Renders frames with Playwright and encodes with ffmpeg.
// Usage: node reveal.mjs [square|wide|both]
import { chromium } from "playwright";
import fs from "node:fs";
import { execSync } from "node:child_process";

const FPS = 30, DUR = 4.5;
const MARK = "M12.00 0.80 L14.49 5.99 L19.92 4.08 L18.01 9.51 L23.20 12.00 L18.01 14.49 L19.92 19.92 L14.49 18.01 L12.00 23.20 L9.51 18.01 L4.08 19.92 L5.99 14.49 L0.80 12.00 L5.99 9.51 L4.08 4.08 L9.51 5.99 Z M9.40 8.10 L16.40 12.00 L9.40 15.90 Z";

const html = (W, H) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-SemiBold.ttf);font-weight:600}
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-Bold.ttf);font-weight:700}
@font-face{font-family:Geist;src:url(fonts/Geist-Bold.ttf);font-weight:700}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#08080f}
.stage{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0}
.glow{position:absolute;left:50%;top:50%;width:${Math.round(H * 0.9)}px;height:${Math.round(H * 0.9)}px;border-radius:50%;transform:translate(-50%,-50%);background:radial-gradient(circle, rgba(100,48,240,.45) 0%, rgba(100,48,240,0) 62%);opacity:0}
.lockup{display:flex;align-items:center;gap:${Math.round(H * 0.022)}px;direction:ltr;position:relative}
.mark{width:${Math.round(H * 0.16)}px;height:${Math.round(H * 0.16)}px;fill:#6430f0;transform-origin:50% 50%}
.word{font-family:Geist;font-weight:700;font-size:${Math.round(H * 0.135)}px;letter-spacing:-.02em;color:#fff;line-height:1;display:flex;overflow:hidden}
.word span{display:inline-block;transform:translateY(110%);opacity:0}
.ar{font-family:"IBM Plex Sans Arabic";font-weight:700;font-size:${Math.round(H * 0.062)}px;color:#a58bff;margin-top:${Math.round(H * 0.035)}px;opacity:0;direction:rtl}
.tag{font-family:"IBM Plex Sans Arabic";font-weight:600;font-size:${Math.round(H * 0.04)}px;color:rgba(247,247,251,.8);margin-top:${Math.round(H * 0.03)}px;opacity:0;direction:rtl;letter-spacing:.01em}
.rule{width:0;height:3px;background:#6430f0;border-radius:2px;margin-top:${Math.round(H * 0.032)}px}
</style></head><body>
<div class="glow" id="glow"></div>
<div class="stage">
  <div class="lockup">
    <svg class="mark" id="mark" viewBox="0 0 24 24"><path fill-rule="evenodd" d="${MARK}"/></svg>
    <div class="word" id="word">${"IraqiStar".split("").map(c => `<span>${c}</span>`).join("")}</div>
  </div>
  <div class="rule" id="rule"></div>
  <div class="ar" id="ar">نجم العراق</div>
  <div class="tag" id="tag">من نجوم العراق… إليك</div>
</div>
<script>
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const ease=x=>1-Math.pow(1-x,3);            // ease-out cubic
const back=x=>{const c=1.4;return 1+c*Math.pow(x-1,3)+(c-1)*Math.pow(x-1,2)}; // small overshoot
const seg=(t,s,d)=>clamp((t-s)/d,0,1);
window.renderAt=t=>{
  // 0.0–0.9 mark spins in and settles; glow breathes in
  const m=seg(t,0.05,0.85);
  const mark=document.getElementById('mark');
  mark.style.transform=\`scale(\${(0.2+0.8*back(m)).toFixed(4)}) rotate(\${((1-ease(m))*-140).toFixed(2)}deg)\`;
  mark.style.opacity=clamp(m*3,0,1);
  document.getElementById('glow').style.opacity=(0.9*ease(seg(t,0.2,1.2))).toFixed(3);
  // the mark starts centred and slides left as the wordmark appears
  const lk=document.querySelector('.lockup'); const ww=document.getElementById('word').getBoundingClientRect().width; const gap=${Math.round(H * 0.022)};
  lk.style.transform=\`translateX(\${(((ww+gap)/2)*(1-ease(seg(t,0.6,0.7)))).toFixed(2)}px)\`;
  // 0.7–1.7 letters rise one by one
  document.querySelectorAll('#word span').forEach((el,i)=>{const k=ease(seg(t,0.7+i*0.055,0.45));el.style.transform=\`translateY(\${((1-k)*110).toFixed(2)}%)\`;el.style.opacity=k.toFixed(3);});
  // 1.5–2.0 rule draws
  document.getElementById('rule').style.width=(ease(seg(t,1.5,0.5))*${Math.round(H * 0.16)})+'px';
  // 1.8–2.4 Arabic name; 2.4–3.0 tagline
  const a=ease(seg(t,1.8,0.6)); const ar=document.getElementById('ar'); ar.style.opacity=a; ar.style.transform=\`translateY(\${((1-a)*18).toFixed(2)}px)\`;
  const g=ease(seg(t,2.4,0.6)); const tg=document.getElementById('tag'); tg.style.opacity=g; tg.style.transform=\`translateY(\${((1-g)*18).toFixed(2)}px)\`;
  // 3.9–4.5 fade to black
  document.body.style.opacity=(1-ease(seg(t,3.9,0.6))).toFixed(3);
};
</script></body></html>`;

const sizes = { square: [1080, 1080], wide: [1920, 1080] };
const which = process.argv[2] || "both";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
for (const [name, [W, H]] of Object.entries(sizes)) {
  if (which !== "both" && which !== name) continue;
  const dir = `frames-${name}`; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir);
  fs.writeFileSync(`reveal-${name}.html`, html(W, H));
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.goto(`file://${process.cwd()}/reveal-${name}.html`); await page.evaluate(() => document.fonts.ready);
  const n = Math.round(DUR * FPS);
  for (let f = 0; f < n; f++) { await page.evaluate(t => window.renderAt(t), f / FPS); await page.screenshot({ path: `${dir}/${String(f).padStart(4, "0")}.png` }); }
  await page.close();
  execSync(`ffmpeg -v error -y -framerate ${FPS} -i ${dir}/%04d.png -c:v libx264 -pix_fmt yuv420p -crf 17 -preset medium -movflags +faststart reveal-${name}-silent.mp4`);
  console.log("frames", n, name);
}
await browser.close();
