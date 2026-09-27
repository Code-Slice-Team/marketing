// IraqiStar cinematic logo reveal — two variants, 6 s each, brand motion only.
//   node reveal2.mjs words  → tagline punches in word by word, then the logo
//   node reveal2.mjs glow   → tagline letters slide in glowing, a light sweep, then the logo
import { chromium } from "playwright";
import fs from "node:fs";
import { execSync } from "node:child_process";

const FPS = 30, DUR = 6.0;
const VARIANT = process.argv[2] || "words";
const MARK = "M12.00 0.80 L14.49 5.99 L19.92 4.08 L18.01 9.51 L23.20 12.00 L18.01 14.49 L19.92 19.92 L14.49 18.01 L12.00 23.20 L9.51 18.01 L4.08 19.92 L5.99 14.49 L0.80 12.00 L5.99 9.51 L4.08 4.08 L9.51 5.99 Z M9.40 8.10 L16.40 12.00 L9.40 15.90 Z";
const TAG = "من نجوم العراق… إليك";
const WORDS = ["من", "نجوم", "العراق…", "إليك"];

const html = (W, H) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-Bold.ttf);font-weight:700}
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-SemiBold.ttf);font-weight:600}
@font-face{font-family:Geist;src:url(fonts/Geist-Bold.ttf);font-weight:700}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#000}
#cam{position:absolute;inset:0;transform-origin:50% 50%;background:#08080f}
.glow{position:absolute;left:50%;top:50%;width:${Math.round(H * 1.1)}px;height:${Math.round(H * 1.1)}px;border-radius:50%;transform:translate(-50%,-50%);background:radial-gradient(circle, rgba(100,48,240,.55) 0%, rgba(100,48,240,0) 60%);opacity:0}
.flash{position:absolute;inset:0;background:#fff;opacity:0;mix-blend-mode:screen}
.sweep{position:absolute;top:0;bottom:0;width:${Math.round(W * 0.28)}px;left:0;background:linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(165,139,255,.35) 40%, rgba(255,255,255,.9) 50%, rgba(165,139,255,.35) 60%, rgba(255,255,255,0) 100%);opacity:0;mix-blend-mode:screen;filter:blur(6px)}
.vignette{position:absolute;inset:0;background:radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,.75) 100%);pointer-events:none}
.grain{position:absolute;inset:-20px;opacity:.07;pointer-events:none;mix-blend-mode:overlay}
.stage{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
/* tagline */
.tag{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;direction:rtl;font-family:"IBM Plex Sans Arabic";font-weight:700;font-size:${Math.round(H * 0.095)}px;line-height:1.35;color:#fff;letter-spacing:.005em;padding:0 6%}
.tag .w{display:inline-block;opacity:0;margin:0 ${Math.round(H * 0.018)}px;will-change:transform,filter}
.tag .m{display:inline-block;opacity:0;color:#fff;text-shadow:0 0 18px rgba(165,139,255,.85),0 0 2px #fff;-webkit-mask-image:linear-gradient(to left, #000 0%, #000 0%, transparent 0%);mask-image:linear-gradient(to left, #000 0%, #000 0%, transparent 0%)}
.edge{position:absolute;top:0;bottom:0;width:${Math.round(H * 0.06)}px;opacity:0;background:linear-gradient(90deg, rgba(165,139,255,0) 0%, rgba(255,255,255,.95) 50%, rgba(165,139,255,0) 100%);filter:blur(${Math.round(H * 0.012)}px);mix-blend-mode:screen}
/* logo */
.logo{position:absolute;left:0;right:0;top:50%;display:flex;flex-direction:column;align-items:center;transform:translateY(-50%)}
.lockup{display:flex;align-items:center;gap:${Math.round(H * 0.022)}px;direction:ltr}
.mark{width:${Math.round(H * 0.17)}px;height:${Math.round(H * 0.17)}px;fill:#6430f0;transform-origin:50% 50%;opacity:0;filter:drop-shadow(0 0 ${Math.round(H * 0.02)}px rgba(100,48,240,.9))}
.word{font-family:Geist;font-weight:700;font-size:${Math.round(H * 0.14)}px;letter-spacing:-.02em;color:#fff;line-height:1;display:flex;overflow:hidden}
.word span{display:inline-block;transform:translateY(110%);opacity:0}
.ar{font-family:"IBM Plex Sans Arabic";font-weight:700;font-size:${Math.round(H * 0.06)}px;color:#a58bff;margin-top:${Math.round(H * 0.035)}px;opacity:0;direction:rtl}
.rule{width:0;height:3px;background:#6430f0;border-radius:2px;margin-top:${Math.round(H * 0.03)}px}
</style></head><body>
<div id="cam">
  <div class="glow" id="glow"></div>
  <div class="tag" id="tag">${VARIANT === "words"
    ? WORDS.map(w => `<span class="w">${w}</span>`).join("")
    : `<span class="m" id="m">${TAG}</span>`}</div>
  <div class="edge" id="edge"></div>
  <div class="logo" id="logo">
    <div class="lockup" id="lk">
      <svg class="mark" id="mark" viewBox="0 0 24 24"><path fill-rule="evenodd" d="${MARK}"/></svg>
      <div class="word" id="word">${"IraqiStar".split("").map(c => `<span>${c}</span>`).join("")}</div>
    </div>
    <div class="rule" id="rule"></div>
    <div class="ar" id="ar">نجم العراق</div>
  </div>
  <div class="sweep" id="sweep"></div>
  <div class="flash" id="flash"></div>
  <div class="vignette"></div>
  <svg class="grain" id="grain" width="100%" height="100%"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="1" id="turb"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>
</div>
<script>
const V=${JSON.stringify(VARIANT)}, W=${W}, H=${H};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const eo=x=>1-Math.pow(1-x,3), ei=x=>x*x*x, eio=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
const seg=(t,s,d)=>clamp((t-s)/d,0,1);
const hit=(t,at,len)=>Math.exp(-Math.max(0,t-at)/len)*(t>=at?1:0);   // impact flash decay
const $=id=>document.getElementById(id);
const LOGO_AT = V==="words" ? 3.5 : 3.2;
window.renderAt=t=>{
  // camera: slow push, a kick on each impact
  let kick=0;
  if(V==="words"){ [0.4,0.9,1.5,2.3].forEach(a=>{kick+=hit(t,a,0.12)*0.02;}); }
  kick+=hit(t,LOGO_AT,0.18)*0.035;
  $('cam').style.transform=\`scale(\${(1+0.04*t/6+kick).toFixed(4)})\`;
  $('turb').setAttribute('seed', String(Math.floor(t*30)%50));
  // tagline
  let flash=0;
  if(V==="words"){
    const AT=[0.4,0.9,1.5,2.3];
    document.querySelectorAll('.w').forEach((el,i)=>{
      const k=seg(t,AT[i],0.32); const out=seg(t,3.0,0.35);
      const sc=(3.2-2.2*eo(k))*(1-0.15*ei(out)); const blur=(1-eo(k))*22+ei(out)*14;
      el.style.opacity=(clamp(k*3,0,1)*(1-out)).toFixed(3);
      el.style.transform=\`scale(\${sc.toFixed(3)})\`; el.style.filter=\`blur(\${blur.toFixed(1)}px)\`;
      el.style.textShadow=\`0 0 \${(40*(1-k)+8).toFixed(0)}px rgba(165,139,255,\${(0.9*(1-k)+0.25).toFixed(2)})\`;
      flash+=hit(t,AT[i],0.06)*0.16;
    });
  } else {
    // the tagline is one shaped run (Arabic letters must stay joined); a fast mask reveals it right to left with a glowing edge
    const m=$('m'); const k=seg(t,0.3,1.3); const p=eio(k)*112; const out=seg(t,2.8,0.35);
    m.style.opacity=(1-out).toFixed(3);
    const grad=\`linear-gradient(to left, #000 0%, #000 \${Math.max(0,p-6).toFixed(1)}%, transparent \${Math.min(112,p+4).toFixed(1)}%)\`;
    m.style.webkitMaskImage=grad; m.style.maskImage=grad;
    const sw=hit(t,1.8,0.3)*0.9;
    m.style.textShadow=\`0 0 \${(14+sw*34).toFixed(0)}px rgba(165,139,255,\${(0.7+sw*0.3).toFixed(2)}), 0 0 2px #fff\`;
    m.style.filter=\`brightness(\${(1+sw*0.5).toFixed(2)})\`;
    const r=m.getBoundingClientRect(); const ed=$('edge');
    ed.style.opacity=(k>0&&k<1?1:0); ed.style.left=(r.right - r.width*(p/100) - ${Math.round(H * 0.03)}).toFixed(0)+'px'; ed.style.top=(r.top-20)+'px'; ed.style.bottom='auto'; ed.style.height=(r.height+40)+'px';
    // light sweep across the tagline at 1.8 s
    const s=seg(t,1.75,0.55); $('sweep').style.opacity=(s>0&&s<1?1:0); $('sweep').style.left=((-0.3+1.3*eio(s))*W).toFixed(0)+'px';
    flash+=hit(t,1.8,0.08)*0.18;
    // whole tagline lifts away before the logo
    const out2=seg(t,2.8,0.4); $('tag').style.transform=\`translateY(calc(-50% - \${(eo(out2)*H*0.12).toFixed(0)}px))\`;
  }
  // glow breathes with the tagline, bursts on the logo
  $('glow').style.opacity=(0.35*eo(seg(t,0.2,1.5))*(1-seg(t,2.9,0.5)) + 0.75*eo(seg(t,LOGO_AT,0.35))*(1-0.4*seg(t,LOGO_AT+0.4,1.2))).toFixed(3);
  // logo impact
  const m=seg(t,LOGO_AT,0.42); const mk=$('mark');
  mk.style.opacity=clamp(m*4,0,1); mk.style.transform=\`scale(\${(0.1+0.9*(1+1.6*Math.pow(m-1,3)+0.6*Math.pow(m-1,2))).toFixed(4)}) rotate(\${((1-eo(m))*-160).toFixed(2)}deg)\`;
  flash+=hit(t,LOGO_AT,0.1)*0.7;
  const ww=$('word').getBoundingClientRect().width, gap=${Math.round(H * 0.022)};
  $('lk').style.transform=\`translateX(\${(((ww+gap)/2)*(1-eo(seg(t,LOGO_AT+0.3,0.6)))).toFixed(2)}px)\`;
  document.querySelectorAll('#word span').forEach((el,i)=>{const k=eo(seg(t,LOGO_AT+0.4+i*0.05,0.4));el.style.transform=\`translateY(\${((1-k)*110).toFixed(2)}%)\`;el.style.opacity=k.toFixed(3);});
  $('rule').style.width=(eo(seg(t,LOGO_AT+1.1,0.45))*${Math.round(H * 0.16)})+'px';
  const a=eo(seg(t,LOGO_AT+1.3,0.5)); $('ar').style.opacity=a; $('ar').style.transform=\`translateY(\${((1-a)*16).toFixed(1)}px)\`;
  $('flash').style.opacity=clamp(flash,0,1).toFixed(3);
  // fade to black
  document.body.style.opacity=(1-eo(seg(t,5.45,0.55))).toFixed(3);
};
</script></body></html>`;

const sizes = { square: [1080, 1080], wide: [1920, 1080] };
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
for (const [name, [W, H]] of Object.entries(sizes)) {
  const dir = `frames-${VARIANT}-${name}`; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir);
  fs.writeFileSync(`reveal-${VARIANT}-${name}.html`, html(W, H));
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.goto(`file://${process.cwd()}/reveal-${VARIANT}-${name}.html`); await page.evaluate(() => document.fonts.ready);
  const n = Math.round(DUR * FPS);
  for (let f = 0; f < n; f++) { await page.evaluate(t => window.renderAt(t), f / FPS); await page.screenshot({ path: `${dir}/${String(f).padStart(4, "0")}.png` }); }
  await page.close();
  execSync(`ffmpeg -v error -y -framerate ${FPS} -i ${dir}/%04d.png -c:v libx264 -pix_fmt yuv420p -crf 17 -preset medium -movflags +faststart reveal-${VARIANT}-${name}-silent.mp4`);
  console.log("frames", n, VARIANT, name);
}
await browser.close();
