// نجم العراق — app tour Reel for stars. 1080x1920, 128 BPM beat grid, real phone screenshots sliding in, fast cuts.
import { chromium } from "playwright"; import fs from "node:fs"; import { execSync } from "node:child_process";
const FPS = 30, W = 1080, H = 1920, B = 60 / 128, BEATS = 54; const DUR = Math.round(BEATS * B * FPS) / FPS;
const MARK = "M12.00 0.80 L14.49 5.99 L19.92 4.08 L18.01 9.51 L23.20 12.00 L18.01 14.49 L19.92 19.92 L14.49 18.01 L12.00 23.20 L9.51 18.01 L4.08 19.92 L5.99 14.49 L0.80 12.00 L5.99 9.51 L4.08 4.08 L9.51 5.99 Z M9.40 8.10 L16.40 12.00 L9.40 15.90 Z";
const m = cls => `<svg class="${cls}" viewBox="0 0 24 24"><path fill-rule="evenodd" d="${MARK}"/></svg>`;
// scenes: id, startBeat, endBeat, screenshot(s), entry direction, caption (top), sub caption; second screenshot = in-phone swipe at midpoint
const SC = [
  ["hook", 0, 4, null, null, null, null],
  ["home", 4, 9, ["home-1.jpg"], "up", "الموقع شغّال…", "وجمهورك يطلب من صفحتك مباشرة"],
  ["browse", 9, 13, ["browse-1.jpg", "browse-2.jpg"], "right", "كل النجوم بصفحة وحدة", "والمعجب يختار نجمه"],
  ["profile", 13, 19, ["profile-1.jpg", "profile-2.jpg"], "left", "صفحتك… بإسمك وصورتك", "المناسبات اللي تختارها، وبسعرك إنت"],
  ["occasions", 19, 23, ["home-2.jpg"], "up", "الطلبات تجيك جاهزة", "عيد ميلاد، تخرّج، تهنئة…"],
  ["sessions", 23, 28, ["sessions-1.jpg", "sessions-2.jpg"], "right", "وجلسات مباشرة", "درس، تدريب أو استشارة، بالوقت اللي يناسبك"],
  ["kids", 28, 32, ["kids-1.jpg"], "left", "وحصص للأطفال", "IraqiStar Kids"],
  ["ugc", 32, 36, ["ugc-1.jpg"], "up", "ومحتوى للشركات", "IraqiStar Business"],
  ["giving", 36, 40, ["home-4.jpg"], "right", "وكل طلب… بيه خير", "جزء من كل طلب يروح للأعمال الخيرية"],
  ["apply", 40, 46, ["apply-1.jpg"], "left", "انضم من هنا", "iraqistar.com/apply"],
  ["end", 46, 54, null, null, null, null],
];
const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-Regular.ttf);font-weight:400}
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-SemiBold.ttf);font-weight:600}
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-Bold.ttf);font-weight:700}
@font-face{font-family:Geist;src:url(fonts/Geist-Bold.ttf);font-weight:700}
@font-face{font-family:Geist;src:url(fonts/Geist-SemiBold.ttf);font-weight:600}
*{margin:0;padding:0;box-sizing:border-box}
html{overflow:hidden;width:${W}px;height:${H}px}
body{width:${W}px;height:${H}px;overflow:hidden;background:#08080f;color:#f7f7fb;font-family:"IBM Plex Sans Arabic",sans-serif;position:relative}
#cam{position:absolute;inset:0;transform-origin:50% 50%;perspective:1800px}
.bg{position:absolute;inset:0;background:radial-gradient(ellipse 900px 900px at 50% 42%,rgba(100,48,240,.5),rgba(100,48,240,0) 70%),#08080f}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(165,139,255,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(165,139,255,.07) 1px,transparent 1px);background-size:90px 90px;mask-image:radial-gradient(circle at 50% 45%,#000 20%,transparent 75%);-webkit-mask-image:radial-gradient(circle at 50% 45%,#000 20%,transparent 75%)}
.brand{position:absolute;top:70px;left:0;right:0;display:flex;justify-content:center;align-items:center;gap:14px;font-family:Geist;font-weight:700;font-size:40px;direction:ltr;letter-spacing:-.02em;opacity:.95}
.brand svg{width:44px;height:44px;fill:#a58bff}
.scene{position:absolute;inset:0;opacity:0}
.phone{position:absolute;left:50%;top:50%;width:640px;height:1386px;margin-left:-320px;margin-top:-693px;background:#0c0b16;border-radius:76px;padding:16px;box-shadow:0 60px 140px rgba(0,0,0,.75),0 0 0 3px #2a2940,0 0 120px rgba(100,48,240,.45);transform-style:preserve-3d;will-change:transform}
.scr{position:relative;width:100%;height:100%;border-radius:60px;overflow:hidden;background:#0c0b16}
.scr img{position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover;object-position:top}
.scr img.b{transform:translateY(100%)}
.notch{position:absolute;top:14px;left:50%;width:180px;height:36px;margin-left:-90px;background:#0c0b16;border-radius:999px;z-index:2}
.cap{position:absolute;left:50px;right:50px;top:170px;text-align:center;font-size:74px;font-weight:700;line-height:1.25;text-shadow:0 8px 40px rgba(0,0,0,.8);opacity:0}
.cap .v{color:#a58bff}
.sub{position:absolute;left:60px;right:60px;bottom:120px;text-align:center;font-size:40px;font-weight:600;color:rgba(247,247,251,.9);line-height:1.5;opacity:0;text-shadow:0 6px 30px rgba(0,0,0,.8)}
.sub.en{font-family:Geist;font-weight:700;direction:ltr;letter-spacing:-.01em}
.pill{display:inline-block;background:#6430f0;color:#fff;border-radius:999px;padding:14px 36px;font-size:40px;font-weight:700;box-shadow:0 0 60px rgba(100,48,240,.7)}
.hook{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.hook .big{font-size:120px;font-weight:700;line-height:1.15;opacity:0}
.hook .t{font-size:52px;font-weight:600;color:#a58bff;margin-top:26px;opacity:0}
.hook svg{width:160px;height:160px;fill:#a58bff;filter:drop-shadow(0 0 40px rgba(100,48,240,.9));margin-bottom:40px;opacity:0}
.end{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.end .tag{font-size:104px;font-weight:700;line-height:1.2;opacity:0}
.end .tag .v{color:#a58bff}
.end .cta{margin-top:50px;opacity:0}
.end .cta .pill{font-size:46px;padding:20px 48px}
.end .meta{margin-top:34px;font-family:Geist;font-weight:600;font-size:36px;color:rgba(247,247,251,.8);direction:ltr;opacity:0}
.end .meta b{color:#fff}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 55%,rgba(0,0,0,.55) 100%)}
.flash{position:absolute;inset:0;background:#fff;opacity:0}
.grain{position:absolute;inset:-20px;opacity:.07;mix-blend-mode:overlay;pointer-events:none}
</style></head><body><div id="cam"><div class="bg"></div><div class="grid"></div>
<div class="brand">${m("")}IraqiStar</div>
${SC.map(([id,s,e,imgs,dir,cap,sub])=>{
  if(id==="hook") return `<div class="scene" id="hook"><div class="hook">${m("mk")}<div class="big" id="hb">شوف نجم العراق<br>من جوّه</div><div class="t" id="ht">جولة سريعة بالتطبيق… للنجوم</div></div></div>`;
  if(id==="end") return `<div class="scene" id="end"><div class="end"><div class="tag" id="et">إنت <span class="v">نجم</span><br>بحياة شخص.</div><div class="cta" id="ec"><span class="pill">قدّم طلبك على iraqistar.com/apply</span></div><div class="meta" id="em"><b>iraqistar.com</b> · @iraqistar.iq</div></div></div>`;
  const en = /^[A-Za-z]/.test(sub);
  return `<div class="scene" id="${id}"><div class="phone" id="${id}-ph"><div class="notch"></div><div class="scr"><img class="a" src="${imgs[0]}">${imgs[1]?`<img class="b" id="${id}-b" src="${imgs[1]}">`:""}</div></div>
    <div class="cap" id="${id}-cap">${cap}</div><div class="sub ${en?'en':''}" id="${id}-sub">${en&&sub.includes('/')?`<span class="pill">${sub}</span>`:sub}</div></div>`;
}).join("")}
<div class="vig"></div><div class="flash" id="flash"></div>
<svg class="grain" width="100%" height="100%"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="1" id="turb"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>
</div><script>
const B=${B}, SC=${JSON.stringify(SC)}, DUR=${DUR};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)), eo=x=>1-Math.pow(1-x,3), ei=x=>x*x*x, back=x=>{const c=1.4;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)}, seg=(t,s,d)=>clamp((t-s)/d,0,1), hit=(t,a,l)=>t>=a?Math.exp(-(t-a)/l):0, $=id=>document.getElementById(id), bt=k=>k*B;
const ENTRY={up:[0,900,0,0],right:[1100,0,-35,0],left:[-1100,0,35,0]};
window.renderAt=t=>{
  $('turb').setAttribute('seed',String(Math.floor(t*30)%40));
  let kick=0, fl=0;
  SC.forEach(([id,s,e,imgs,dir,cap,sub],i)=>{
    const S=bt(s), E=bt(e); const on=t>=S-0.05&&t<E; const el=$(id); el.style.opacity=on?1:0; if(!on)return;
    if(i>0){kick+=hit(t,S,0.12)*0.035; fl+=hit(t,S,0.07)*0.35;}
    if(id==='hook'){ const k1=back(seg(t,0.15,0.5)); const mk=el.querySelector('.mk'); mk.style.opacity=clamp(k1*3,0,1); mk.style.transform=\`scale(\${(0.4+0.6*k1).toFixed(3)}) rotate(\${((1-k1)*40).toFixed(1)}deg)\`;
      const k2=eo(seg(t,bt(1),0.35)); $('hb').style.opacity=k2; $('hb').style.transform=\`translateY(\${((1-k2)*40).toFixed(0)}px) scale(\${(1.15-0.15*k2).toFixed(3)})\`; $('hb').style.filter=\`blur(\${((1-k2)*10).toFixed(1)}px)\`;
      const k3=eo(seg(t,bt(2),0.35)); $('ht').style.opacity=k3; $('ht').style.transform=\`translateY(\${((1-k3)*30).toFixed(0)}px)\`;
      const out=ei(seg(t,E-0.25,0.25)); el.style.opacity=(1-out).toFixed(3); el.style.transform=\`scale(\${(1+out*0.2).toFixed(3)})\`; return; }
    if(id==='end'){ const k1=eo(seg(t,S+0.05,0.4)); $('et').style.opacity=k1; $('et').style.transform=\`scale(\${(1.2-0.2*k1).toFixed(3)})\`; $('et').style.filter=\`blur(\${((1-k1)*12).toFixed(1)}px)\`;
      const k2=back(seg(t,bt(48),0.45)); $('ec').style.opacity=clamp(k2*3,0,1); $('ec').style.transform=\`scale(\${(0.6+0.4*k2).toFixed(3)})\`;
      const k3=eo(seg(t,bt(49.5),0.4)); $('em').style.opacity=k3; return; }
    // phone entry with overshoot, exit fast
    const [ex,ey,ry,rz]=ENTRY[dir]; const k=back(seg(t,S,0.55)); const out=ei(seg(t,E-0.22,0.22));
    const ph=$(id+'-ph'); const ox=dir==='up'?0:(dir==='right'?-700:700); const oy=dir==='up'?-800:0;
    const x=ex*(1-k)+ox*out, y=ey*(1-k)+oy*out; const drift=Math.sin((t-S)*1.2)*6; const idle=(t-S)*-14;
    ph.style.transform=\`translate(\${x.toFixed(0)}px,\${(y+idle).toFixed(0)}px) rotateY(\${(ry*(1-k)+drift).toFixed(1)}deg) rotateZ(\${(rz*(1-k)-ry*out*0.5).toFixed(1)}deg) scale(\${(0.85+0.15*Math.min(k,1)).toFixed(3)})\`;
    ph.style.filter=\`blur(\${((1-Math.min(k,1))*8+out*10).toFixed(1)}px)\`;
    // in-phone swipe at midpoint
    if(imgs[1]){ const mid=S+(E-S)*0.5; const sw=eo(seg(t,mid,0.4)); $(id+'-b').style.transform=\`translateY(\${((1-sw)*100).toFixed(1)}%)\`; if(sw>0&&sw<1)kick+=0.01; }
    const c=eo(seg(t,S+0.12,0.35)); const capEl=$(id+'-cap'); capEl.style.opacity=c; capEl.style.transform=\`translateY(\${((1-c)*-40).toFixed(0)}px) scale(\${(1.25-0.25*c).toFixed(3)})\`; capEl.style.filter=\`blur(\${((1-c)*10).toFixed(1)}px)\`;
    const sb=eo(seg(t,S+0.45,0.35)); const sbEl=$(id+'-sub'); sbEl.style.opacity=sb; sbEl.style.transform=\`translateY(\${((1-sb)*40).toFixed(0)}px)\`;
    el.style.opacity=(1-out*0.6).toFixed(3);
  });
  const r=seg(t,bt(44),bt(46)-bt(44)); const shake=r>0&&r<1?Math.sin(t*95)*3*r:0;
  $('cam').style.transform=\`scale(\${(1+0.02*(t/DUR)+kick+0.05*ei(r)).toFixed(4)}) translate(\${shake.toFixed(1)}px,0)\`;
  $('flash').style.opacity=clamp(fl+(t>=bt(46)?hit(t,bt(46),0.14)*0.9:0),0,1).toFixed(3);
  document.body.style.opacity=(1-eo(seg(t,DUR-0.5,0.5))).toFixed(3);
};
</script></body></html>`;
fs.writeFileSync("reel.html", html);
const dir = "frames"; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir);
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }); const p = await b.newPage({ viewport: { width: W, height: H } });
p.on("pageerror", e => console.log("PAGEERR", e.message));
await p.goto("file://" + process.cwd() + "/reel.html"); await p.evaluate(() => document.fonts.ready);
await p.evaluate(() => Promise.all([...document.images].map(i => i.complete ? 1 : new Promise(r => { i.onload = r; i.onerror = r; }))));
const only = process.argv[2] ? process.argv[2].split(",").map(Number) : null;
for (let f = 0; f < Math.round(DUR * FPS); f++) { if (only && !only.includes(f)) continue; await p.evaluate(t => window.renderAt(t), f / FPS); await p.screenshot({ path: `${dir}/${String(f).padStart(4, "0")}.jpg`, type: "jpeg", quality: 90 }); }
await b.close();
if (!only) execSync(`ffmpeg -v error -y -framerate ${FPS} -i ${dir}/%04d.jpg -c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium -movflags +faststart reel-silent.mp4`);
console.log("done", DUR);
