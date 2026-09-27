// IraqiStar Business — UGC recruitment Reel, cinematic cut: hard cuts, camera kicks, flashes, grain. 15 s, 1080x1920.
import { chromium } from "playwright"; import fs from "node:fs"; import { execSync } from "node:child_process";
const FPS = 30, DUR = 15, W = 1080, H = 1920;
const MARK = "M12.00 0.80 L14.49 5.99 L19.92 4.08 L18.01 9.51 L23.20 12.00 L18.01 14.49 L19.92 19.92 L14.49 18.01 L12.00 23.20 L9.51 18.01 L4.08 19.92 L5.99 14.49 L0.80 12.00 L5.99 9.51 L4.08 4.08 L9.51 5.99 Z M9.40 8.10 L16.40 12.00 L9.40 15.90 Z";
// shots: [id, start, end, kind]  kind: punch (scale-in from big + blur), slide (from side), stamp (numbered), end
const SHOTS = [
  ["w1", 0.0, 0.9, "punch"], ["w2", 0.9, 1.8, "punch"], ["w3", 1.8, 3.2, "punch"],
  ["card", 3.2, 4.6, "slide"],
  ["c1", 4.6, 5.4, "punch"], ["c2", 5.4, 6.2, "punch"], ["c3", 6.2, 7.0, "punch"],
  ["how", 7.0, 7.9, "punch"],
  ["st1", 7.9, 8.8, "stamp"], ["st2", 8.8, 9.7, "stamp"], ["st3", 9.7, 10.8, "stamp"],
  ["end", 12.0, 15.0, "end"],
];
const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-SemiBold.ttf);font-weight:600}
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-Bold.ttf);font-weight:700}
@font-face{font-family:Geist;src:url(fonts/Geist-Bold.ttf);font-weight:700}
*{margin:0;padding:0;box-sizing:border-box}
html{overflow:hidden;width:${W}px;height:${H}px}
body{width:${W}px;height:${H}px;overflow:hidden;background:#000;color:#f7f7fb;font-family:"IBM Plex Sans Arabic",sans-serif;position:relative}
#cam{position:absolute;inset:0;transform-origin:50% 50%;background:#08080f}
.glow{position:absolute;left:50%;top:46%;width:1500px;height:1500px;border-radius:50%;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(100,48,240,.55) 0%,rgba(100,48,240,0) 58%)}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 50%,rgba(0,0,0,.75) 100%)}
.flash{position:absolute;inset:0;background:#fff;opacity:0;mix-blend-mode:screen}
.grain{position:absolute;inset:-20px;opacity:.08;mix-blend-mode:overlay}
.shot{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 80px;text-align:center;opacity:0;will-change:transform,filter}
.big{font-size:150px;line-height:1.2;font-weight:700;text-shadow:0 0 40px rgba(165,139,255,.5)}
.big.ac{color:#a58bff}
.mid{font-size:112px;line-height:1.25;font-weight:700}
.chipbig{font-size:92px;font-weight:700;border:5px solid #a58bff;border-radius:999px;padding:30px 70px;box-shadow:0 0 60px rgba(100,48,240,.6)}
.card{width:860px;background:#13121e;border:2px solid rgba(165,139,255,.4);border-radius:34px;padding:38px 42px;display:flex;align-items:center;gap:28px;text-align:right;box-shadow:0 40px 100px rgba(0,0,0,.7)}
.card .ic{width:104px;height:104px;border-radius:26px;background:#6430f0;display:grid;place-items:center;flex:none}
.card .ic svg{width:56px;height:56px;fill:#fff}
.card b{display:block;font-size:40px}.card span{display:block;font-size:30px;color:rgba(247,247,251,.7);margin-top:6px}
.stamp{display:flex;align-items:center;gap:34px;font-size:84px;font-weight:700}
.stamp i{width:130px;height:130px;border-radius:50%;background:#6430f0;color:#fff;display:grid;place-items:center;font-family:Geist;font-style:normal;font-size:70px;flex:none;box-shadow:0 0 50px rgba(100,48,240,.8)}
.lockup{display:flex;align-items:center;gap:18px;direction:ltr;font-family:Geist;font-weight:700;font-size:104px;letter-spacing:-.02em}
.lockup svg{width:1.1em;height:1.1em;fill:#6430f0;filter:drop-shadow(0 0 34px rgba(100,48,240,.95))}
.tag{background:#2a2940;border-radius:999px;padding:8px 28px;font-size:.42em;letter-spacing:0}
.cta{margin-top:80px;background:#6430f0;color:#fff;border-radius:999px;padding:32px 66px;font-size:52px;font-weight:700;box-shadow:0 0 70px rgba(100,48,240,.7)}
.cta b{font-family:Geist;background:#fff;color:#6430f0;border-radius:999px;padding:2px 26px;margin:0 8px}
.give{position:absolute;left:60px;right:60px;bottom:120px;text-align:center;font-size:30px;color:rgba(247,247,251,.75);opacity:0}
.brand{position:absolute;top:90px;left:0;right:0;text-align:center;font-family:Geist;font-weight:700;font-size:40px;letter-spacing:-.02em;direction:ltr;opacity:.9}
</style></head><body><div id="cam">
<div class="glow" id="glow"></div>
<div class="brand">IraqiStar · Business</div>
<div class="shot" id="w1"><div class="big">تصوّر</div></div>
<div class="shot" id="w2"><div class="big">محتوى؟</div></div>
<div class="shot" id="w3"><div class="mid ac" style="color:#a58bff">الشركات<br>تدوّر عليك.</div></div>
<div class="shot" id="card"><div class="card"><div class="ic"><svg viewBox="0 0 24 24"><path d="M4 7h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Zm14 3 4-2v8l-4-2Z"/></svg></div><div><b>طلب جديد من شركة بمدينتك</b><span>فيديو 30 ثانية عن منتج · من موبايلك</span></div></div></div>
<div class="shot" id="c1"><div class="chipbig">سعرك بيدك</div></div>
<div class="shot" id="c2"><div class="chipbig">طلبات من شركات بمدينتك</div></div>
<div class="shot" id="c3"><div class="chipbig">تصوير من موبايلك</div></div>
<div class="shot" id="how"><div class="big ac">شلون؟</div></div>
<div class="shot" id="st1"><div class="stamp"><i>1</i>سجّل كصانع محتوى</div></div>
<div class="shot" id="st2"><div class="stamp"><i>2</i>حدد سعرك</div></div>
<div class="shot" id="st3"><div class="stamp"><i>3</i>استلم الطلبات وصوّر</div></div>
<div class="shot" id="end"><div class="lockup" id="lk"><svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="${MARK}"/></svg>IraqiStar<span class="tag">Business</span></div><div class="cta" id="cta">أرسل كلمة <b>UGC</b> بالرسائل</div></div>
<div class="give" id="give">مع كل طلب، جزء من أرباحنا يروح للأعمال الخيرية بالعراق · iraqistar.com</div>
<div class="vig"></div><div class="flash" id="flash"></div>
<svg class="grain" width="100%" height="100%"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="1" id="turb"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>
</div><script>
const SHOTS=${JSON.stringify(SHOTS)};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)), eo=x=>1-Math.pow(1-x,3), ei=x=>x*x*x, seg=(t,s,d)=>clamp((t-s)/d,0,1), hit=(t,a,l)=>t>=a?Math.exp(-(t-a)/l):0, $=id=>document.getElementById(id);
window.renderAt=t=>{
  let kick=0, flash=0;
  $('turb').setAttribute('seed', String(Math.floor(t*30)%40));
  SHOTS.forEach(([id,s,e,kind])=>{
    const el=$(id); const on=t>=s&&t<e; if(!on){el.style.opacity=0;return;}
    const k=eo(seg(t,s,0.16)); const out=(kind==='end')?0:ei(seg(t,e-0.12,0.12));
    el.style.opacity=(1-out).toFixed(3);
    if(kind==='punch'){ el.style.transform=\`scale(\${(1.35-0.35*k).toFixed(3)})\`; el.style.filter=\`blur(\${((1-k)*18).toFixed(1)}px)\`; kick+=hit(t,s,0.1)*0.03; flash+=hit(t,s,0.06)*0.22; }
    if(kind==='slide'){ el.style.transform=\`translateX(\${((1-k)*-420).toFixed(0)}px) rotate(\${((1-k)*-4).toFixed(2)}deg)\`; el.style.filter=\`blur(\${((1-k)*8).toFixed(1)}px)\`; kick+=hit(t,s,0.12)*0.035; flash+=hit(t,s,0.06)*0.15; }
    if(kind==='stamp'){ el.style.transform=\`scale(\${(1.6-0.6*k).toFixed(3)})\`; el.style.filter=\`blur(\${((1-k)*10).toFixed(1)}px)\`; kick+=hit(t,s,0.1)*0.04; flash+=hit(t,s,0.06)*0.3; }
    if(kind==='end'){ const m=seg(t,s,0.4); el.style.transform='none'; el.style.filter='none';
      const lk=$('lk'); lk.style.transform=\`scale(\${(0.2+0.8*(1+1.5*Math.pow(m-1,3)+0.5*Math.pow(m-1,2))).toFixed(3)})\`; lk.style.opacity=clamp(m*4,0,1);
      const c=eo(seg(t,s+0.5,0.4)); const cta=$('cta'); cta.style.opacity=c; cta.style.transform=\`translateY(\${((1-c)*40).toFixed(0)}px)\`;
      kick+=hit(t,s,0.18)*0.05; flash+=hit(t,s,0.12)*0.8; }
  });
  // riser shake before the logo
  const r=seg(t,10.8,1.2); const shake=r>0&&r<1? (Math.sin(t*90)*3*r) : 0;
  $('cam').style.transform=\`scale(\${(1+0.03*(t/15)+kick+0.06*ei(r)).toFixed(4)}) translate(\${shake.toFixed(1)}px,0)\`;
  $('glow').style.opacity=(0.7+0.3*Math.sin(t*2)+ (r>0&&r<1? r*0.5:0)).toFixed(3);
  $('flash').style.opacity=clamp(flash + (r>=1&&t<12.0?1:0),0,1).toFixed(3);
  $('give').style.opacity=eo(seg(t,12.8,0.5));
  document.body.style.opacity=(1-eo(seg(t,14.6,0.4))).toFixed(3);
};
</script></body></html>`;
fs.writeFileSync("reel2.html", html);
const dir = "frames2"; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir);
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }); const p = await b.newPage({ viewport: { width: W, height: H } });
await p.goto("file://" + process.cwd() + "/reel2.html"); await p.evaluate(() => document.fonts.ready);
for (let f = 0; f < DUR * FPS; f++) { await p.evaluate(t => window.renderAt(t), f / FPS); await p.screenshot({ path: `${dir}/${String(f).padStart(4, "0")}.jpg`, type: "jpeg", quality: 92 }); }
await b.close();
execSync(`ffmpeg -v error -y -framerate ${FPS} -i ${dir}/%04d.jpg -c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium -movflags +faststart reel2-silent.mp4`);
console.log("done");
