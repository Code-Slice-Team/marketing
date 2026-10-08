// نجم العراق — app presentation for stars, premium cut. 1080x1920, 34 s. Slow floating phones with glass glare, restrained type,
// soft crossfades and light sweeps — no shakes, no flashes.
import { chromium } from "playwright"; import fs from "node:fs"; import { execSync } from "node:child_process";
const FPS = 30, W = 1080, H = 1920, DUR = 34;
const MARK = "M12.00 0.80 L14.49 5.99 L19.92 4.08 L18.01 9.51 L23.20 12.00 L18.01 14.49 L19.92 19.92 L14.49 18.01 L12.00 23.20 L9.51 18.01 L4.08 19.92 L5.99 14.49 L0.80 12.00 L5.99 9.51 L4.08 4.08 L9.51 5.99 Z M9.40 8.10 L16.40 12.00 L9.40 15.90 Z";
const m = cls => `<svg class="${cls}" viewBox="0 0 24 24"><path fill-rule="evenodd" d="${MARK}"/></svg>`;
const phone = (id, imgs, cls = "") => `<div class="phone ${cls}" id="${id}"><div class="scr">${imgs.map((s, i) => `<img class="s${i}" src="${s}">`).join("")}<div class="glare"></div></div><div class="edge"></div></div>`;
// scenes: [id, start, end]
const SC = [["s0",0,3.6],["s1",3.2,7.6],["s2",7.2,11.6],["s3",11.2,15.6],["s4",15.2,19.6],["s5",19.2,23.6],["s6",23.2,26.8],["s7",26.4,30],["s8",29.6,34]];
const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-Regular.ttf);font-weight:400}
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-Medium.ttf);font-weight:500}
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-SemiBold.ttf);font-weight:600}
@font-face{font-family:Geist;src:url(fonts/Geist-SemiBold.ttf);font-weight:600}
*{margin:0;padding:0;box-sizing:border-box}
html{overflow:hidden;width:${W}px;height:${H}px}
body{width:${W}px;height:${H}px;overflow:hidden;background:#050508;color:#f7f7fb;font-family:"IBM Plex Sans Arabic",sans-serif;position:relative}
#cam{position:absolute;inset:0;transform-origin:50% 50%;perspective:2200px}
.bg{position:absolute;inset:0;background:radial-gradient(ellipse 800px 1100px at 50% 40%,rgba(84,39,217,.28),rgba(84,39,217,0) 70%),#050508}
.dust{position:absolute;inset:0}
.dust i{position:absolute;width:3px;height:3px;border-radius:50%;background:#fff;opacity:.35}
.line{position:absolute;left:50%;top:0;width:1px;height:0;background:linear-gradient(to bottom,rgba(165,139,255,0),rgba(165,139,255,.7),rgba(165,139,255,0))}
.wm{position:absolute;top:96px;left:0;right:0;text-align:center;font-family:Geist;font-weight:600;font-size:26px;letter-spacing:.42em;color:rgba(247,247,251,.7);direction:ltr;text-indent:.42em}
.scene{position:absolute;inset:0;opacity:0}
.phone{position:absolute;left:50%;top:50%;width:600px;height:1300px;margin-left:-300px;margin-top:-650px;background:#0a0a10;border-radius:82px;padding:14px;transform-style:preserve-3d;will-change:transform;box-shadow:0 80px 160px rgba(0,0,0,.8),0 0 0 2px #26243a}
.phone .edge{position:absolute;inset:-2px;border-radius:84px;pointer-events:none;background:linear-gradient(135deg,rgba(255,255,255,.35),rgba(255,255,255,0) 30%,rgba(255,255,255,0) 70%,rgba(165,139,255,.35));-webkit-mask:linear-gradient(#000,#000) content-box,linear-gradient(#000,#000);-webkit-mask-composite:xor;mask-composite:exclude;padding:2px}
.scr{position:relative;width:100%;height:100%;border-radius:68px;overflow:hidden;background:#0a0a10}
.scr img{position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover;object-position:top;opacity:0}
.scr img.s0{opacity:1}
.glare{position:absolute;inset:-40%;background:linear-gradient(115deg,rgba(255,255,255,0) 42%,rgba(255,255,255,.14) 50%,rgba(255,255,255,0) 58%);transform:translateX(-120%);pointer-events:none}
.phone.sm{width:460px;height:997px;margin-left:-230px;margin-top:-498px;border-radius:64px}.phone.sm .scr{border-radius:52px}
.cap{position:absolute;left:70px;right:70px;text-align:center;opacity:0}
.cap.top{top:190px}.cap.bot{bottom:150px}
.cap .k{font-family:Geist;font-weight:600;font-size:22px;letter-spacing:.36em;text-indent:.36em;color:#a58bff;direction:ltr;margin-bottom:22px}
.cap h1{font-size:64px;font-weight:500;line-height:1.3;letter-spacing:-.01em}
.cap p{font-size:32px;font-weight:400;color:rgba(247,247,251,.72);margin-top:16px;line-height:1.6}
.cap .rule{width:64px;height:1px;background:rgba(165,139,255,.7);margin:26px auto 0}
.title{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.title svg{width:110px;height:110px;fill:#a58bff;opacity:0;filter:drop-shadow(0 0 30px rgba(100,48,240,.6))}
.title .ar{font-size:132px;font-weight:500;line-height:1.15;margin-top:36px;opacity:0}
.title .en{font-family:Geist;font-weight:600;font-size:30px;letter-spacing:.5em;text-indent:.5em;color:rgba(247,247,251,.75);direction:ltr;margin-top:18px;opacity:0}
.title .tg{font-size:44px;font-weight:400;color:#a58bff;margin-top:34px;opacity:0}
.end .ar{font-size:104px;font-weight:500;line-height:1.25;opacity:0}
.end .ar b{font-weight:600;color:#a58bff}
.end .cta{margin-top:54px;font-family:Geist;font-weight:600;font-size:36px;letter-spacing:.08em;direction:ltr;color:#fff;border:1px solid rgba(165,139,255,.7);border-radius:999px;padding:20px 48px;opacity:0}
.end .inv{margin-top:34px;font-size:30px;color:rgba(247,247,251,.65);opacity:0}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 55%,rgba(0,0,0,.6) 100%)}
.grain{position:absolute;inset:-20px;opacity:.05;mix-blend-mode:overlay;pointer-events:none}
</style></head><body><div id="cam"><div class="bg"></div>
<div class="dust">${Array.from({length:40},(_,i)=>`<i style="left:${(i*263)%1080}px;top:${(i*577)%1920}px;opacity:${(0.15+(i%4)*0.1).toFixed(2)};width:${2+(i%3)}px;height:${2+(i%3)}px"></i>`).join("")}</div>
<div class="line" id="line"></div>
<div class="wm" id="wm">IRAQISTAR</div>
<div class="scene" id="s0"><div class="title">${m("mk")}<div class="ar" id="t-ar">نجم العراق</div><div class="en" id="t-en">IRAQISTAR</div><div class="tg" id="t-tg">من نجوم العراق… إليك</div></div></div>
<div class="scene" id="s1">${phone("p1a",["browse-1.jpg"],"sm")}${phone("p1b",["home-1.jpg"],"sm")}${phone("p1c",["profile-1.jpg"],"sm")}<div class="cap bot" id="c1"><div class="k">THE PLATFORM</div><h1>منصّة عراقية للنجوم وجمهورهم</h1><p>رسائل فيديو، جلسات مباشرة، حصص للأطفال ومحتوى للأعمال</p></div></div>
<div class="scene" id="s2">${phone("p2",["profile-1.jpg","profile-2.jpg"])}<div class="cap top" id="c2"><div class="k">YOUR PAGE</div><h1>صفحتك… باسمك وصورتك</h1><div class="rule"></div><p>مناسباتك، لغاتك، وحساباتك بمكان واحد</p></div></div>
<div class="scene" id="s3">${phone("p3",["profile-2.jpg"])}<div class="cap top" id="c3"><div class="k">YOUR PRICE</div><h1>إنت تحدد سعرك</h1><div class="rule"></div><p>وتستلمه كامل، بدون أي خصم</p></div></div>
<div class="scene" id="s4">${phone("p4",["home-2.jpg","home-1.jpg"])}<div class="cap top" id="c4"><div class="k">REQUESTS</div><h1>الطلبات توصلك جاهزة</h1><div class="rule"></div><p>المناسبة، الاسم، والرسالة… وإنت تسجّل الفيديو بوقتك</p></div></div>
<div class="scene" id="s5">${phone("p5",["sessions-1.jpg","sessions-2.jpg"])}<div class="cap top" id="c5"><div class="k">LIVE SESSIONS</div><h1>جلسات مباشرة بوقتك</h1><div class="rule"></div><p>درس، تدريب أو استشارة، بالمدّة والسعر اللي تختارهم</p></div></div>
<div class="scene" id="s6">${phone("p6a",["kids-1.jpg"],"sm")}${phone("p6b",["ugc-1.jpg"],"sm")}<div class="cap bot" id="c6"><div class="k">KIDS · BUSINESS</div><h1>حصص للأطفال، ومحتوى للشركات</h1></div></div>
<div class="scene" id="s7">${phone("p7",["home-4.jpg"])}<div class="cap top" id="c7"><div class="k">GIVING</div><h1>وبكل طلب… خير</h1><div class="rule"></div><p>جزء من كل طلب يروح للأعمال الخيرية بالعراق</p></div></div>
<div class="scene" id="s8"><div class="title end"><div class="ar" id="e-ar">إنت <b>نجم</b> بحياة شخص.</div><div class="cta" id="e-cta">iraqistar.com/apply</div><div class="inv" id="e-inv">الانضمام بدعوة خاصة · @iraqistar.iq</div></div></div>
<div class="vig"></div>
<svg class="grain" width="100%" height="100%"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="1" id="turb"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>
</div><script>
const SC=${JSON.stringify(SC)}, DUR=${DUR};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)), eo=x=>1-Math.pow(1-x,3), eio=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2, seg=(t,s,d)=>clamp((t-s)/d,0,1), $=id=>document.getElementById(id);
function fadeScene(el,t,s,e,f=0.6){const i=eo(seg(t,s,f)), o=1-eo(seg(t,e-f,f)); el.style.opacity=(i*o).toFixed(3); return i*o;}
function floatPhone(id,t,s,x,y,ry0,ry1,rz,scale0,scale1,glareAt){const p=$(id); const k=seg(t,s,4.4); const drift=Math.sin((t-s)*0.9)*10; const in_=eo(seg(t,s,1.1));
  p.style.transform=\`translate(\${x}px,\${(y+(1-in_)*120+drift).toFixed(0)}px) rotateY(\${(ry0+(ry1-ry0)*k).toFixed(2)}deg) rotateZ(\${rz}deg) scale(\${(scale0+(scale1-scale0)*k).toFixed(4)})\`;
  const g=p.querySelector('.glare'); const gk=seg(t,s+glareAt,1.4); g.style.transform=\`translateX(\${(-120+240*eio(gk)).toFixed(0)}%)\`;}
function swap(id,t,at,d=0.8){const p=$(id); const imgs=p.querySelectorAll('img'); if(imgs.length<2)return; const k=eo(seg(t,at,d)); imgs[1].style.opacity=k; imgs[1].style.transform=\`translateY(\${((1-k)*24).toFixed(0)}px)\`;}
function cap(id,t,s,delay=0.5){const c=$(id); const k=eo(seg(t,s+delay,0.9)); c.style.opacity=k; c.style.transform=\`translateY(\${((1-k)*26).toFixed(0)}px)\`;
  const ks=c.querySelector('.k'); if(ks){ks.style.letterSpacing=(0.6-0.24*k).toFixed(3)+'em';}}
window.renderAt=t=>{
  $('turb').setAttribute('seed',String(Math.floor(t*12)%40));
  document.querySelectorAll('.dust i').forEach((d,i)=>{d.style.transform=\`translate(\${(Math.sin(t*0.3+i)*14).toFixed(1)}px,\${(-t*(6+(i%5)*3)%1920).toFixed(1)}px)\`;});
  $('line').style.height=(eo(seg(t,0.2,1.6))*1920)+'px'; $('line').style.opacity=(1-eo(seg(t,2.6,0.8))).toFixed(3);
  $('wm').style.opacity=(t>3.4?eo(seg(t,3.4,1))*(1-eo(seg(t,29.6,0.6))):0).toFixed(3);
  SC.forEach(([id,s,e])=>{const el=$(id); const on=t>=s&&t<e; if(!on){el.style.opacity=0;return;} fadeScene(el,t,s,e);
    if(id==='s0'){const mk=el.querySelector('.mk'); const k0=eo(seg(t,0.6,1.0)); mk.style.opacity=k0; mk.style.transform=\`scale(\${(0.7+0.3*k0).toFixed(3)}) rotate(\${((1-k0)*-30).toFixed(1)}deg)\`;
      const k1=eo(seg(t,1.2,1.0)); $('t-ar').style.opacity=k1; $('t-ar').style.transform=\`translateY(\${((1-k1)*30).toFixed(0)}px)\`; $('t-ar').style.filter=\`blur(\${((1-k1)*8).toFixed(1)}px)\`;
      const k2=eo(seg(t,1.7,0.9)); $('t-en').style.opacity=k2; $('t-en').style.letterSpacing=(0.9-0.4*k2).toFixed(3)+'em';
      const k3=eo(seg(t,2.2,0.9)); $('t-tg').style.opacity=k3; $('t-tg').style.transform=\`translateY(\${((1-k3)*20).toFixed(0)}px)\`; el.style.transform=\`scale(\${(1+0.04*seg(t,0,3.6)).toFixed(4)})\`;}
    if(id==='s1'){floatPhone('p1b',t,s,0,-40,-6,6,0,0.98,1.04,0.9); floatPhone('p1a',t,s+0.15,-330,60,18,10,-4,0.86,0.9,1.3); floatPhone('p1c',t,s+0.3,330,60,-18,-10,4,0.86,0.9,1.6); cap('c1',t,s,0.9);}
    if(id==='s2'){floatPhone('p2',t,s,0,120,-8,6,0,0.98,1.05,0.6); swap('p2',t,s+2.4); cap('c2',t,s);}
    if(id==='s3'){floatPhone('p3',t,s,0,120,8,-4,0,1.02,1.09,0.5); cap('c3',t,s);}
    if(id==='s4'){floatPhone('p4',t,s,0,120,-7,7,0,0.98,1.05,0.6); swap('p4',t,s+2.5); cap('c4',t,s);}
    if(id==='s5'){floatPhone('p5',t,s,0,120,7,-6,0,0.98,1.05,0.6); swap('p5',t,s+2.4); cap('c5',t,s);}
    if(id==='s6'){floatPhone('p6a',t,s,-250,-60,14,8,-3,0.92,0.97,0.7); floatPhone('p6b',t,s+0.2,250,-60,-14,-8,3,0.92,0.97,1.1); cap('c6',t,s,0.8);}
    if(id==='s7'){floatPhone('p7',t,s,0,120,-6,5,0,0.98,1.05,0.6); cap('c7',t,s);}
    if(id==='s8'){const k1=eo(seg(t,s+0.5,1.1)); $('e-ar').style.opacity=k1; $('e-ar').style.transform=\`translateY(\${((1-k1)*30).toFixed(0)}px)\`; $('e-ar').style.filter=\`blur(\${((1-k1)*8).toFixed(1)}px)\`;
      const k2=eo(seg(t,s+1.6,0.9)); $('e-cta').style.opacity=k2; $('e-cta').style.transform=\`translateY(\${((1-k2)*20).toFixed(0)}px)\`;
      const k3=eo(seg(t,s+2.3,0.9)); $('e-inv').style.opacity=k3;}
  });
  $('cam').style.transform=\`scale(\${(1+0.015*Math.sin(t*0.25)).toFixed(4)})\`;
  document.body.style.opacity=(1-eo(seg(t,DUR-0.8,0.8))).toFixed(3);
};
</script></body></html>`;
fs.writeFileSync("reel2.html", html);
const dir = "frames2"; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir);
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }); const p = await b.newPage({ viewport: { width: W, height: H } });
p.on("pageerror", e => console.log("PAGEERR", e.message));
await p.goto("file://" + process.cwd() + "/reel2.html"); await p.evaluate(() => document.fonts.ready);
await p.evaluate(() => Promise.all([...document.images].map(i => i.complete ? 1 : new Promise(r => { i.onload = r; i.onerror = r; }))));
const only = process.argv[2] ? process.argv[2].split(",").map(Number) : null;
for (let f = 0; f < DUR * FPS; f++) { if (only && !only.includes(f)) continue; await p.evaluate(t => window.renderAt(t), f / FPS); await p.screenshot({ path: `${dir}/${String(f).padStart(4, "0")}.jpg`, type: "jpeg", quality: 90 }); }
await b.close();
if (!only) execSync(`ffmpeg -v error -y -framerate ${FPS} -i ${dir}/%04d.jpg -c:v libx264 -pix_fmt yuv420p -crf 17 -preset medium -movflags +faststart reel2-silent.mp4`);
console.log("done");
