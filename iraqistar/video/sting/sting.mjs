// IraqiStar tagline + logo reveal sting. ORIENT=landscape|portrait  MODE=open|end. 5.0 s @30fps.
import { chromium } from "playwright"; import fs from "node:fs"; import { execSync } from "node:child_process";
const FPS = 30, DUR = 6.0, P = process.env.ORIENT === "portrait", MODE = process.env.MODE || "end";
const W = P ? 1080 : 1920, H = P ? 1920 : 1080, S = P ? 1 : 1.15;
const MARK = "M12.00 0.80 L14.49 5.99 L19.92 4.08 L18.01 9.51 L23.20 12.00 L18.01 14.49 L19.92 19.92 L14.49 18.01 L12.00 23.20 L9.51 18.01 L4.08 19.92 L5.99 14.49 L0.80 12.00 L5.99 9.51 L4.08 4.08 L9.51 5.99 Z M9.40 8.10 L16.40 12.00 L9.40 15.90 Z";
const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-Bold.ttf);font-weight:700}
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-SemiBold.ttf);font-weight:600}
@font-face{font-family:Geist;src:url(fonts/Geist-Bold.ttf);font-weight:700}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#08080f;color:#fff;font-family:"IBM Plex Sans Arabic",sans-serif;position:relative}
#cam{position:absolute;inset:0;transform-origin:50% 50%}
.glow{position:absolute;left:50%;top:50%;width:${1600*S}px;height:${1600*S}px;border-radius:50%;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(100,48,240,.45) 0%,rgba(100,48,240,0) 60%);opacity:.5}
.tagwrap{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;padding:0 40px}
.tag{font-size:${(P?118:150)}px;font-weight:700;line-height:1.3;color:#fff;white-space:nowrap;text-shadow:0 0 40px rgba(165,139,255,.35);-webkit-mask-image:linear-gradient(to left,#000 0%,#000 0%,transparent 0%);mask-image:linear-gradient(to left,#000 0%,#000 0%,transparent 0%)}
.bar{position:absolute;top:-10%;height:120%;width:14px;background:linear-gradient(to bottom,rgba(165,139,255,0),#fff 40%,#a58bff 60%,rgba(165,139,255,0));border-radius:8px;box-shadow:0 0 60px 18px rgba(100,48,240,.9),0 0 120px 50px rgba(100,48,240,.45);opacity:0}
.slam{position:absolute;left:0;right:0;top:50%;text-align:center;font-size:${(P?230:260)}px;font-weight:700;color:#a58bff;opacity:0;white-space:nowrap;text-shadow:0 0 60px rgba(100,48,240,.8)}
.logo{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;opacity:0}
.logo .mk{display:inline-block;width:${(P?260:300)}px;height:${(P?260:300)}px}
.logo .mk svg{width:100%;height:100%;fill:#a58bff;filter:drop-shadow(0 0 50px rgba(100,48,240,.95))}
.logo .ar{font-size:${(P?130:150)}px;font-weight:700;line-height:1.1;margin-top:${(P?20:16)}px}
.logo .en{font-family:Geist;font-weight:700;font-size:${(P?40:46)}px;letter-spacing:.2em;text-indent:.2em;color:#a58bff;direction:ltr;margin-top:14px}
.logo .links{margin-top:${(P?34:30)}px;display:flex;justify-content:center;gap:${(P?10:18)}px;flex-wrap:wrap;direction:ltr;font-family:Geist;font-weight:700;font-size:${(P?40:42)}px;color:rgba(247,247,251,.9);letter-spacing:.02em;opacity:0}
.ring{position:absolute;left:50%;top:calc(50% - ${P?150:160}px);width:${(P?260:300)}px;height:${(P?260:300)}px;border-radius:50%;border:4px solid rgba(165,139,255,.9);transform:translate(-50%,-50%) scale(0);opacity:0;box-shadow:0 0 60px rgba(100,48,240,.8)}
.flash{position:absolute;inset:0;background:#fff;opacity:0}.flashd{position:absolute;inset:0;background:#6430f0;opacity:0}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 55%,rgba(0,0,0,.5) 100%)}
.fade{position:absolute;inset:0;background:#000;opacity:0}
.grain{position:absolute;inset:-20px;opacity:.07;mix-blend-mode:overlay;pointer-events:none}
</style></head><body><div id="cam"><div class="glow" id="glow"></div>
<div class="tagwrap" id="tw"><div class="tag" id="tg">من نجوم العراق…</div><div class="bar" id="bar"></div></div>
<div class="slam" id="slam">إليك</div>
<div class="ring" id="ring"></div><div class="ring" id="ring2"></div>
<div class="logo" id="logo"><span class="mk" id="mk"><svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="${MARK}"/></svg></span><div class="ar" id="lar">نجم العراق</div><div class="en" id="len">IRAQISTAR</div><div class="links" id="links"><span class="lk">iraqistar.com</span><span class="lk">${P?"":"· "}@iraqistar.iq</span></div></div>
<div class="vig"></div><div class="flash" id="flash"></div><div class="flashd" id="flashd"></div>
<svg class="grain" width="100%" height="100%"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="1" id="turb"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>
<div class="fade" id="fade"></div></div><script>
const MODE='${MODE}', DUR=${DUR};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)), eo=x=>1-Math.pow(1-x,3), ei=x=>x*x*x, eio=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2, back=x=>{const c=1.7;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)}, seg=(t,s,d)=>clamp((t-s)/d,0,1), hit=(t,a,l)=>t>=a?Math.exp(-(t-a)/l):0, $=id=>document.getElementById(id);
function reveal(p){const el=$('tg'); const x=(p*116-8); const m=\`linear-gradient(to left,#000 \${x-6}%,#000 \${x}%,transparent \${x+6}%)\`; el.style.webkitMaskImage=m; el.style.maskImage=m; const bar=$('bar'); const w=el.getBoundingClientRect().width; const left=(el.parentElement.getBoundingClientRect().width-w)/2; bar.style.right=(left+x/100*w)+'px'; bar.style.opacity=(p>0&&p<1?1:0);}
// timeline (s): VO phrase1 0.45–1.75, phrase2 (إليك) 2.30–2.65, logo 3.05
window.renderAt=t=>{
  $('turb').setAttribute('seed',String(Math.floor(t*30)%40));
  let kick=0, fl=0, fld=0;
  // tagline sweep with phrase 1
  reveal(eio(seg(t,0.40,1.35)));
  // إليك slam with phrase 2
  const sl=back(seg(t,2.28,0.32)); const s1=$('slam'); s1.style.opacity=clamp(sl*3,0,1)*(1-eo(seg(t,2.95,0.15))); s1.style.transform=\`translateY(\${(${P?150:120}+(1-sl)*80).toFixed(0)}px) scale(\${(0.5+0.5*sl).toFixed(3)})\`; s1.style.filter=\`blur(\${((1-Math.min(sl,1))*12).toFixed(1)}px)\`;
  const tw=$('tw'); tw.style.transform=\`translateY(-50%) translateY(\${(t>=2.28?-${P?120:110}*eo(seg(t,2.28,0.32)):0).toFixed(0)}px)\`; tw.style.opacity=(1-eo(seg(t,2.95,0.15))).toFixed(3);
  kick+=hit(t,2.28,0.12)*0.04; fld+=hit(t,2.28,0.08)*0.5;
  // logo burst 3.05
  const lg=back(seg(t,3.05,0.55)); const L=$('logo'); L.style.opacity=clamp(lg*3,0,1); $('mk').style.transform=\`scale(\${(0.2+0.8*Math.min(lg,1.1)).toFixed(3)}) rotate(\${((1-Math.min(lg,1))*-90).toFixed(1)}deg)\`;
  const la=eo(seg(t,3.35,0.4)); $('lar').style.opacity=la; $('lar').style.transform=\`translateY(\${((1-la)*30).toFixed(0)}px)\`; const le=eo(seg(t,3.6,0.4)); $('len').style.opacity=le; $('len').style.transform=\`translateY(\${((1-le)*20).toFixed(0)}px)\`; const lk=eo(seg(t,3.85,0.4)); $('links').style.opacity=lk; $('links').style.transform=\`translateY(\${((1-lk)*20).toFixed(0)}px)\`;
  [['ring',3.05],['ring2',3.2]].forEach(([id,s])=>{const k=seg(t,s,0.9); const r=$(id); r.style.opacity=(k>0&&k<1?(1-k):0).toFixed(3); r.style.transform=\`translate(-50%,-50%) scale(\${(0.6+k*4).toFixed(3)})\`;});
  fl+=hit(t,3.05,0.12)*0.7; kick+=hit(t,3.05,0.14)*0.05;
  $('glow').style.opacity=(0.45+0.4*Math.min(lg,1)+0.3*hit(t,2.28,0.3)).toFixed(3);
  $('cam').style.transform=\`scale(\${(1+0.015*(t/DUR)+kick).toFixed(4)})\`;
  $('flash').style.opacity=clamp(fl,0,1).toFixed(3); $('flashd').style.opacity=clamp(fld,0,1).toFixed(3);
  $('fade').style.opacity=(MODE==='end'?ei(seg(t,DUR-0.6,0.6)):0).toFixed(3);
  if(MODE==='open'){document.body.style.opacity=(1-ei(seg(t,DUR-0.25,0.25))).toFixed(3);}
};
</script></body></html>`;
const name = `sting-${P ? "9x16" : "16x9"}-${MODE}`;
fs.writeFileSync(name + ".html", html);
const dir = "frames-" + name; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir);
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }); const p = await b.newPage({ viewport: { width: W, height: H } });
p.on("pageerror", e => console.log("PAGEERR", e.message));
await p.goto("file://" + process.cwd() + "/" + name + ".html"); await p.evaluate(() => document.fonts.ready);
const only = process.argv[2] ? process.argv[2].split(",").map(Number) : null;
for (let f = 0; f < Math.round(DUR * FPS); f++) { if (only && !only.includes(f)) continue; await p.evaluate(t => window.renderAt(t), f / FPS); await p.screenshot({ path: `${dir}/${String(f).padStart(4, "0")}.jpg`, type: "jpeg", quality: 92 }); }
await b.close();
if (!only) execSync(`ffmpeg -v error -y -framerate ${FPS} -i ${dir}/%04d.jpg -c:v libx264 -pix_fmt yuv420p -crf 17 -preset medium -movflags +faststart ${name}-silent.mp4`);
console.log("done", name);
