// نجم العراق — app presentation v3: a fixed phone, the real pages scroll inside it (stitched captures, sticky header kept),
// slow drifts and beat-timed scroll bursts, page pushes on navigation. 1080x1920, 36 s.
import { chromium } from "playwright"; import fs from "node:fs"; import { execSync } from "node:child_process";
const FPS = 30, W = 1080, H = 1920, DUR = 36;
const MARK = "M12.00 0.80 L14.49 5.99 L19.92 4.08 L18.01 9.51 L23.20 12.00 L18.01 14.49 L19.92 19.92 L14.49 18.01 L12.00 23.20 L9.51 18.01 L4.08 19.92 L5.99 14.49 L0.80 12.00 L5.99 9.51 L4.08 4.08 L9.51 5.99 Z M9.40 8.10 L16.40 12.00 L9.40 15.90 Z";
const m = cls => `<svg class="${cls}" viewBox="0 0 24 24"><path fill-rule="evenodd" d="${MARK}"/></svg>`;
const SW = 632, SH = 1368, SCALE = SW / 750; // screen size, image scale
// pages: id, start, end, image height(2x px), scroll keys [time, y(2x px), duration] — y in source pixels, interpolated with ease-in-out
const PAGES = [
  ["home", 3.6, 11.4, 8610, [[3.6, 0, 0], [5.6, 450, 2.0], [6.2, 1100, 0.55], [7.9, 3480, 0.6], [9.4, 4300, 0.6], [11.0, 4360, 1.6]]],
  ["profile", 11.4, 17.4, 3868, [[11.4, 0, 0], [13.4, 520, 2.0], [14.5, 1640, 0.55], [16.3, 2000, 0.55]]],
  ["browse", 17.4, 21.0, 3620, [[17.4, 0, 0], [20.6, 2240, 3.0]]],
  ["sessions", 21.0, 26.4, 5694, [[21.0, 0, 0], [22.9, 1460, 0.55], [24.7, 4180, 0.6], [26.2, 4190, 1.4]]],
  ["kids", 26.4, 29.4, 4424, [[26.4, 0, 0], [27.7, 1920, 0.55], [29.2, 2000, 1.4]]],
  ["ugc", 29.4, 32.4, 3024, [[29.4, 0, 0], [30.7, 900, 0.55], [32.2, 960, 1.4]]],
];
// captions: [time, label, title, sub]
const CAPS = [
  [3.6, "THE PLATFORM", "منصّة عراقية للنجوم وجمهورهم", "رسائل فيديو، جلسات مباشرة، حصص للأطفال ومحتوى للأعمال"],
  [6.2, "OCCASIONS", "الطلبات توصلك بمناسبات جاهزة", "عيد ميلاد، تخرّج، تهنئة… والاسم والرسالة"],
  [9.4, "GIVING", "وبكل طلب… خير", "جزء من كل طلب يروح للأعمال الخيرية بالعراق"],
  [11.4, "YOUR PAGE", "صفحتك… باسمك وصورتك", "مناسباتك، لغاتك، وحساباتك بمكان واحد"],
  [14.5, "YOUR PRICE", "إنت تحدد سعرك", "وتستلمه كامل، بدون أي خصم"],
  [17.4, "STARS", "كل النجوم بصفحة وحدة", "والمعجب يختار نجمه ويطلب"],
  [21.0, "LIVE SESSIONS", "جلسات مباشرة بوقتك", "درس، تدريب أو استشارة، بالمدّة والسعر اللي تختارهم"],
  [24.7, "EXPERTS", "عندك خبرة تفيد غيرك؟", "قدّم جلسات مدفوعة وحدّد أوقاتك"],
  [26.4, "KIDS", "حصص للأطفال", "IraqiStar Kids"],
  [29.4, "BUSINESS", "ومحتوى للشركات", "IraqiStar Business"],
];
const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-Regular.ttf);font-weight:400}
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-Medium.ttf);font-weight:500}
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-SemiBold.ttf);font-weight:600}
@font-face{font-family:Geist;src:url(fonts/Geist-SemiBold.ttf);font-weight:600}
*{margin:0;padding:0;box-sizing:border-box}
html{overflow:hidden;width:${W}px;height:${H}px}
body{width:${W}px;height:${H}px;overflow:hidden;background:#050508;color:#f7f7fb;font-family:"IBM Plex Sans Arabic",sans-serif;position:relative}
#cam{position:absolute;inset:0;transform-origin:50% 55%}
.bg{position:absolute;inset:0;background:radial-gradient(ellipse 760px 1000px at 50% 58%,rgba(84,39,217,.30),rgba(84,39,217,0) 70%),#050508}
.dust i{position:absolute;border-radius:50%;background:#fff}
.wm{position:absolute;top:80px;left:0;right:0;text-align:center;font-family:Geist;font-weight:600;font-size:24px;letter-spacing:.42em;text-indent:.42em;color:rgba(247,247,251,.6);direction:ltr;opacity:0}
.cap{position:absolute;left:60px;right:60px;top:150px;text-align:center;opacity:0}
.cap .k{font-family:Geist;font-weight:600;font-size:21px;letter-spacing:.36em;text-indent:.36em;color:#a58bff;direction:ltr;margin-bottom:18px}
.cap h1{font-size:60px;font-weight:500;line-height:1.3}
.cap p{font-size:29px;font-weight:400;color:rgba(247,247,251,.7);margin-top:12px;line-height:1.6}
.cap p.en{font-family:Geist;font-weight:600;direction:ltr;letter-spacing:.06em}
.phone{position:absolute;left:50%;top:440px;width:${SW+28}px;height:${SH+28}px;margin-left:-${(SW+28)/2}px;background:#0a0a10;border-radius:84px;padding:14px;box-shadow:0 80px 160px rgba(0,0,0,.8),0 0 0 2px #26243a,0 0 140px rgba(100,48,240,.25);opacity:0}
.phone .edge{position:absolute;inset:-2px;border-radius:86px;pointer-events:none;padding:2px;background:linear-gradient(135deg,rgba(255,255,255,.35),rgba(255,255,255,0) 30%,rgba(255,255,255,0) 70%,rgba(165,139,255,.35));-webkit-mask:linear-gradient(#000,#000) content-box,linear-gradient(#000,#000);-webkit-mask-composite:xor;mask-composite:exclude}
.scr{position:relative;width:${SW}px;height:${SH}px;border-radius:70px;overflow:hidden;background:#0b0b14}
.page{position:absolute;left:0;top:0;width:${SW}px;opacity:0;will-change:transform}
.page img{display:block;width:${SW}px}
.hdr{position:absolute;left:0;top:0;width:${SW}px;height:${Math.round(205*SCALE)}px;z-index:3}
.hdr img{display:block;width:${SW}px}
.notch{position:absolute;top:12px;left:50%;width:150px;height:34px;margin-left:-75px;background:#0a0a10;border-radius:999px;z-index:4}
.glare{position:absolute;inset:-40%;z-index:5;background:linear-gradient(115deg,rgba(255,255,255,0) 44%,rgba(255,255,255,.10) 50%,rgba(255,255,255,0) 56%);transform:translateX(-120%);pointer-events:none}
.title{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;opacity:0}
.title svg{width:110px;height:110px;fill:#a58bff;filter:drop-shadow(0 0 30px rgba(100,48,240,.6))}
.title .ar{font-size:132px;font-weight:500;line-height:1.15;margin-top:36px}
.title .en{font-family:Geist;font-weight:600;font-size:30px;letter-spacing:.5em;text-indent:.5em;color:rgba(247,247,251,.75);direction:ltr;margin-top:18px}
.title .tg{font-size:44px;font-weight:400;color:#a58bff;margin-top:34px}
.title .ar,.title .en,.title .tg,.title svg{opacity:0}
.end .ar{font-size:100px;font-weight:500;line-height:1.25}
.end .ar b{font-weight:600;color:#a58bff}
.end .cta{margin-top:54px;font-family:Geist;font-weight:600;font-size:36px;letter-spacing:.08em;direction:ltr;color:#fff;border:1px solid rgba(165,139,255,.7);border-radius:999px;padding:20px 48px;opacity:0}
.end .inv{margin-top:34px;font-size:30px;color:rgba(247,247,251,.65);opacity:0}
.line{position:absolute;left:50%;top:0;width:1px;height:0;background:linear-gradient(to bottom,rgba(165,139,255,0),rgba(165,139,255,.7),rgba(165,139,255,0))}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 55%,rgba(0,0,0,.6) 100%)}
.grain{position:absolute;inset:-20px;opacity:.05;mix-blend-mode:overlay;pointer-events:none}
</style></head><body><div id="cam"><div class="bg"></div>
<div class="dust">${Array.from({length:36},(_,i)=>`<i style="left:${(i*263)%1080}px;top:${(i*577)%1920}px;opacity:${(0.12+(i%4)*0.08).toFixed(2)};width:${2+(i%3)}px;height:${2+(i%3)}px"></i>`).join("")}</div>
<div class="line" id="line"></div><div class="wm" id="wm">IRAQISTAR</div>
<div class="title" id="t0">${m("mk")}<div class="ar" id="t-ar">نجم العراق</div><div class="en" id="t-en">IRAQISTAR</div><div class="tg" id="t-tg">من نجوم العراق… إليك</div></div>
${CAPS.map((c,i)=>`<div class="cap" id="cap${i}"><div class="k">${c[1]}</div><h1>${c[2]}</h1><p class="${/^[A-Za-z]/.test(c[3])?'en':''}">${c[3]}</p></div>`).join("")}
<div class="phone" id="phone"><div class="scr">${PAGES.map(p=>`<div class="page" id="pg-${p[0]}"><img src="stitched/${p[0]}.jpg"></div>`).join("")}<div class="hdr" id="hdr"><img src="stitched/header.jpg"></div><div class="notch"></div><div class="glare" id="glare"></div></div><div class="edge"></div></div>
<div class="title end" id="t1"><div class="ar" id="e-ar">إنت <b>نجم</b> بحياة شخص.</div><div class="cta" id="e-cta">iraqistar.com/apply</div><div class="inv" id="e-inv">الانضمام بدعوة خاصة · @iraqistar.iq</div></div>
<div class="vig"></div>
<svg class="grain" width="100%" height="100%"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="1" id="turb"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>
</div><script>
const PAGES=${JSON.stringify(PAGES)}, CAPS=${JSON.stringify(CAPS)}, SCALE=${SCALE}, SH=${SH}, DUR=${DUR};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)), eo=x=>1-Math.pow(1-x,3), eio=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2, seg=(t,s,d)=>clamp((t-s)/d,0,1), $=id=>document.getElementById(id);
function scrollAt(keys,t){ // keys: [time, y, dur] — reach y at time over dur before it
  let y=keys[0][1];
  for(let i=1;i<keys.length;i++){const [tt,yy,d]=keys[i]; const prev=keys[i-1][1]; if(t>=tt){y=yy;continue;} if(t>=tt-d){const k=eio((t-(tt-d))/d); y=prev+(yy-prev)*k; break;} else {y=prev;break;}}
  return y;}
window.renderAt=t=>{
  $('turb').setAttribute('seed',String(Math.floor(t*12)%40));
  document.querySelectorAll('.dust i').forEach((d,i)=>{d.style.transform=\`translate(\${(Math.sin(t*0.3+i)*14).toFixed(1)}px,\${(-t*(5+(i%5)*3)).toFixed(1)}px)\`;});
  $('line').style.height=(eo(seg(t,0.2,1.6))*1920)+'px'; $('line').style.opacity=(1-eo(seg(t,2.6,0.8))).toFixed(3);
  // title
  const t0=$('t0'); t0.style.opacity=(t<3.6?1-eo(seg(t,3.0,0.6)):0).toFixed(3); t0.style.transform=\`scale(\${(1+0.04*seg(t,0,3.6)).toFixed(4)})\`;
  const mk=t0.querySelector('.mk'); const k0=eo(seg(t,0.6,1.0)); mk.style.opacity=k0; mk.style.transform=\`scale(\${(0.7+0.3*k0).toFixed(3)}) rotate(\${((1-k0)*-30).toFixed(1)}deg)\`;
  const k1=eo(seg(t,1.2,1.0)); $('t-ar').style.opacity=k1; $('t-ar').style.transform=\`translateY(\${((1-k1)*30).toFixed(0)}px)\`; $('t-ar').style.filter=\`blur(\${((1-k1)*8).toFixed(1)}px)\`;
  const k2=eo(seg(t,1.7,0.9)); $('t-en').style.opacity=k2; $('t-en').style.letterSpacing=(0.9-0.4*k2).toFixed(3)+'em';
  const k3=eo(seg(t,2.2,0.9)); $('t-tg').style.opacity=k3; $('t-tg').style.transform=\`translateY(\${((1-k3)*20).toFixed(0)}px)\`;
  // phone in, out
  const pin=eo(seg(t,3.3,1.0)), pout=eo(seg(t,32.4,0.7)); const ph=$('phone'); ph.style.opacity=(pin*(1-pout)).toFixed(3); ph.style.transform=\`translateY(\${((1-pin)*140+pout*-60).toFixed(0)}px) scale(\${(0.96+0.04*pin-0.03*pout).toFixed(4)})\`;
  $('wm').style.opacity=(eo(seg(t,3.6,1))*(1-eo(seg(t,32.4,0.6)))).toFixed(3);
  // pages: scroll + push transitions
  PAGES.forEach(([id,s,e,hgt,keys],i)=>{const el=$('pg-'+id); const on=t>=s-0.5&&t<e+0.6; if(!on){el.style.opacity=0;return;}
    const y=scrollAt(keys,t)*SCALE; const enter=eio(seg(t,s,0.45)); const next=PAGES[i+1]; const exit=next?eio(seg(t,next[1],0.45)):0;
    const off=(1-enter)*SH - exit*SH*0.35; el.style.opacity=(enter*(1-exit)).toFixed(3); el.style.transform=\`translateY(\${(off-y).toFixed(1)}px)\`;
    if(!next&&t>=e) el.style.opacity=0; });
  const gl=seg(t,3.8,1.6); $('glare').style.transform=\`translateX(\${(-120+240*eio(gl)).toFixed(0)}%)\`;
  // captions: each visible until the next one
  CAPS.forEach((c,i)=>{const s=c[0]; const e=i+1<CAPS.length?CAPS[i+1][0]:32.4; const el=$('cap'+i); const k=eo(seg(t,s+0.12,0.7)), o=1-eo(seg(t,e-0.25,0.25)); el.style.opacity=(k*o).toFixed(3); el.style.transform=\`translateY(\${((1-k)*22).toFixed(0)}px)\`; el.querySelector('.k').style.letterSpacing=(0.6-0.24*k).toFixed(3)+'em';});
  // end
  const t1=$('t1'); t1.style.opacity=t>=32.4?1:0; const e1=eo(seg(t,32.9,1.1)); $('e-ar').style.opacity=e1; $('e-ar').style.transform=\`translateY(\${((1-e1)*30).toFixed(0)}px)\`; $('e-ar').style.filter=\`blur(\${((1-e1)*8).toFixed(1)}px)\`;
  const e2=eo(seg(t,34.0,0.9)); $('e-cta').style.opacity=e2; $('e-cta').style.transform=\`translateY(\${((1-e2)*20).toFixed(0)}px)\`; $('e-inv').style.opacity=eo(seg(t,34.6,0.9));
  $('cam').style.transform=\`scale(\${(1+0.012*Math.sin(t*0.25)).toFixed(4)})\`;
  document.body.style.opacity=(1-eo(seg(t,DUR-0.8,0.8))).toFixed(3);
};
</script></body></html>`;
fs.writeFileSync("reel3.html", html);
const dir = "frames3"; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir);
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }); const p = await b.newPage({ viewport: { width: W, height: H } });
p.on("pageerror", e => console.log("PAGEERR", e.message));
await p.goto("file://" + process.cwd() + "/reel3.html"); await p.evaluate(() => document.fonts.ready);
await p.evaluate(() => Promise.all([...document.images].map(i => i.complete ? 1 : new Promise(r => { i.onload = r; i.onerror = r; }))));
const only = process.argv[2] ? process.argv[2].split(",").map(Number) : null;
for (let f = 0; f < DUR * FPS; f++) { if (only && !only.includes(f)) continue; await p.evaluate(t => window.renderAt(t), f / FPS); await p.screenshot({ path: `${dir}/${String(f).padStart(4, "0")}.jpg`, type: "jpeg", quality: 90 }); }
await b.close();
if (!only) execSync(`ffmpeg -v error -y -framerate ${FPS} -i ${dir}/%04d.jpg -c:v libx264 -pix_fmt yuv420p -crf 17 -preset medium -movflags +faststart reel3-silent.mp4`);
console.log("done");
