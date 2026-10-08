// IraqiStar Facebook page cover — 1640x624 (FB recommended upload). Mobile-safe zone = central 1250px.
import { chromium } from "playwright"; import fs from "node:fs";
const W=1640,H=624;
const MARK="M12.00 0.80 L14.49 5.99 L19.92 4.08 L18.01 9.51 L23.20 12.00 L18.01 14.49 L19.92 19.92 L14.49 18.01 L12.00 23.20 L9.51 18.01 L4.08 19.92 L5.99 14.49 L0.80 12.00 L5.99 9.51 L4.08 4.08 L9.51 5.99 Z M9.40 8.10 L16.40 12.00 L9.40 15.90 Z";
const AV=`<svg class="av" viewBox="0 0 100 100" preserveAspectRatio="xMidYMax slice"><circle cx="50" cy="38" r="18"/><path d="M14 96c2-24 16-36 36-36s34 12 36 36Z"/></svg>`;
const STARS=[["فنان","#6430f0","#ff7a9c","عيد ميلاد"],["لاعب كرة","#1d1640","#5cc8ff","تحفيز"],["مقدّمة برامج","#5427d9","#ffa04d","تخرّج"],["شيف","#ff7a9c","#ffd23f","تهنئة"]];
const card=([r,c1,c2,o],i)=>`<div class="sc" style="--i:${i}"><div class="ph" style="background:linear-gradient(160deg,${c1},${c2})">${AV}<span class="occ">${o}</span><span class="play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7Z"/></svg></span></div><div class="nm">نجمك <span>${r}</span></div></div>`;
const page=(mode)=>`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-Regular.ttf);font-weight:400}
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-SemiBold.ttf);font-weight:600}
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-Bold.ttf);font-weight:700}
@font-face{font-family:Geist;src:url(fonts/Geist-Bold.ttf);font-weight:700}
@font-face{font-family:Geist;src:url(fonts/Geist-SemiBold.ttf);font-weight:600}
*{margin:0;padding:0;box-sizing:border-box}
html{overflow:hidden;width:${W}px;height:${H}px}
body{width:${W}px;height:${H}px;overflow:hidden;position:relative;font-family:"IBM Plex Sans Arabic",sans-serif;
  background:${mode==='dark'?'#08080f':'#fff'};color:${mode==='dark'?'#f7f7fb':'#0c0b16'}}
.glow{position:absolute;left:62%;top:50%;width:1100px;height:1100px;border-radius:50%;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(100,48,240,${mode==='dark'?.45:.16}) 0%,rgba(100,48,240,0) 60%)}
.rib{position:absolute;inset:0;width:100%;height:100%;direction:ltr}
.rt{fill:none;stroke:${mode==='dark'?'rgba(255,255,255,.22)':'rgba(100,48,240,.18)'};stroke-width:1;font-family:"IBM Plex Sans Arabic";font-weight:700;letter-spacing:.04em}
.safe{position:absolute;left:195px;right:195px;top:0;bottom:0}
.txt{position:absolute;right:-40px;top:50%;transform:translateY(-50%);width:640px;padding:30px 40px;text-align:right;border-radius:40px;background:radial-gradient(ellipse at center,${mode==='dark'?'rgba(8,8,15,.96)':'rgba(255,255,255,.96)'} 45%,${mode==='dark'?'rgba(8,8,15,0)':'rgba(255,255,255,0)'} 75%)}
.brand{display:flex;align-items:center;gap:14px;justify-content:flex-start}
.brand .m{width:52px;height:52px;border-radius:14px;background:#6430f0;display:grid;place-items:center}.brand .m svg{width:34px;height:34px;fill:#fff}
.brand b{font-family:Geist;font-weight:700;font-size:30px;letter-spacing:-.02em;direction:ltr}
.h1{font-size:96px;font-weight:700;line-height:1.15;margin-top:10px}
.tag{font-size:40px;font-weight:600;margin-top:2px;color:${mode==='dark'?'#a58bff':'#6430f0'}}
.line{font-size:24px;margin-top:18px;color:${mode==='dark'?'rgba(247,247,251,.78)':'#4f5368'};line-height:1.6}
.line b{font-weight:600;color:${mode==='dark'?'#fff':'#0c0b16'}}
.chips{display:flex;gap:10px;margin-top:20px;justify-content:flex-start}
.chips span{border:1.5px solid ${mode==='dark'?'rgba(165,139,255,.5)':'#e2e0ec'};background:${mode==='dark'?'rgba(255,255,255,.04)':'#fff'};border-radius:999px;padding:8px 18px;font-size:22px;font-weight:600}
.chips span.v{background:#6430f0;color:#fff;border-color:#6430f0}
.cards{position:absolute;left:0;top:50%;transform:translateY(-50%);display:flex;gap:22px;direction:ltr}
.sc{width:150px;background:${mode==='dark'?'#13121e':'#fff'};border:1.5px solid ${mode==='dark'?'rgba(165,139,255,.35)':'#e2e0ec'};border-radius:22px;padding:10px;text-align:center;direction:rtl;box-shadow:0 26px 60px rgba(12,11,22,${mode==='dark'?.6:.14});transform:translateY(calc((var(--i) - 1.5) * 26px)) rotate(calc((var(--i) - 1.5) * 2deg))}
.sc .ph{position:relative;height:170px;border-radius:16px;overflow:hidden}
.sc .ph .av{position:absolute;inset:0;width:100%;height:100%;fill:rgba(255,255,255,.28)}
.sc .occ{position:absolute;top:8px;right:8px;background:rgba(8,8,15,.7);color:#fff;border-radius:999px;padding:3px 10px;font-size:14px;font-weight:600}
.sc .play{position:absolute;left:50%;top:50%;width:46px;height:46px;border-radius:50%;background:rgba(255,255,255,.92);transform:translate(-50%,-50%);display:grid;place-items:center}.sc .play svg{width:22px;height:22px;fill:#6430f0;margin-left:3px}
.sc .nm{margin-top:10px;font-size:17px;font-weight:700}.sc .nm span{display:block;font-weight:400;font-size:14px;color:${mode==='dark'?'rgba(247,247,251,.65)':'#4f5368'}}
.foot{position:absolute;left:0;right:0;bottom:16px;text-align:center;font-family:Geist;font-weight:600;font-size:18px;color:${mode==='dark'?'rgba(247,247,251,.55)':'#6f7386'};direction:ltr;letter-spacing:.02em}
</style></head><body>
<div class="glow"></div>
<svg class="rib" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><defs><path id="p1" d="M-100,520 C300,300 700,700 1000,380 S1500,200 1800,420"/><path id="p2" d="M-100,120 C400,-60 600,360 1000,160 S1500,60 1800,240"/></defs>
<text class="rt" font-size="30"><textPath href="#p1" startOffset="-40">${"نجم العراق · IRAQISTAR · ".repeat(20)}</textPath></text>
<text class="rt" font-size="26"><textPath href="#p2" startOffset="-120">${"IRAQISTAR · نجم العراق · ".repeat(20)}</textPath></text></svg>
<div class="safe">
  <div class="txt">
    <div class="brand"><span class="m"><svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="${MARK}"/></svg></span><b>IraqiStar</b></div>
    <div class="h1">نجم العراق</div>
    <div class="tag">من نجوم العراق… إليك</div>
    <div class="line" style="margin-top:26px"><b>iraqistar.com</b> · @iraqistar.iq</div>
    
  </div>
  <div class="cards">${STARS.map(card).join("")}</div>
</div>

</body></html>`;
const b=await chromium.launch({executablePath:"/opt/pw-browsers/chromium"});
for(const mode of ["dark","light"]){ fs.writeFileSync(`cover-${mode}.html`,page(mode)); const p=await b.newPage({viewport:{width:W,height:H},deviceScaleFactor:1});
  await p.goto("file://"+process.cwd()+`/cover-${mode}.html`); await p.evaluate(()=>document.fonts.ready);
  await p.screenshot({path:`IraqiStar-facebook-cover-${mode}.png`}); await p.screenshot({path:`mobile-${mode}.png`,clip:{x:195,y:0,width:1250,height:624}}); await p.close(); }
await b.close(); console.log("ok");
