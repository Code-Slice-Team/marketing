// نجم العراق — "وقتك غالي" star-side Reel: payment is secured before any request reaches the star. 1080x1920, 20 s.
// node paid.mjs [frames] → paid-silent.mp4
import { chromium } from "playwright"; import fs from "node:fs"; import { execSync } from "node:child_process";
const FPS = 30, W = 1080, H = 1920, DUR = 20;
const MARK = "M12.00 0.80 L14.49 5.99 L19.92 4.08 L18.01 9.51 L23.20 12.00 L18.01 14.49 L19.92 19.92 L14.49 18.01 L12.00 23.20 L9.51 18.01 L4.08 19.92 L5.99 14.49 L0.80 12.00 L5.99 9.51 L4.08 4.08 L9.51 5.99 Z M9.40 8.10 L16.40 12.00 L9.40 15.90 Z";
const m = cls => `<svg class="${cls}" viewBox="0 0 24 24"><path fill-rule="evenodd" d="${MARK}"/></svg>`;
const LOCK = `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><rect x="12" y="28" width="40" height="30" rx="8" fill="currentColor" stroke="none"/><path d="M20 28v-8a12 12 0 0 1 24 0v8"/><circle cx="32" cy="43" r="4" fill="#0a0a10" stroke="none"/></svg>`;
const CHECK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`;
const step = (id, n, txt) => `<div class="step" id="${id}"><div class="n">${n}</div><div class="t">${txt}</div></div>`;
const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-Regular.ttf);font-weight:400}
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-Medium.ttf);font-weight:500}
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-SemiBold.ttf);font-weight:600}
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-Bold.ttf);font-weight:700}
@font-face{font-family:Geist;src:url(fonts/Geist-SemiBold.ttf);font-weight:600}
@font-face{font-family:Geist;src:url(fonts/Geist-Bold.ttf);font-weight:700}
*{margin:0;padding:0;box-sizing:border-box}
html{overflow:hidden;width:${W}px;height:${H}px}
body{width:${W}px;height:${H}px;overflow:hidden;background:#050508;color:#f7f7fb;font-family:"IBM Plex Sans Arabic",sans-serif;position:relative}
#shake{position:absolute;inset:0}
.bg{position:absolute;inset:0;background:radial-gradient(ellipse 800px 900px at 50% 45%,rgba(84,39,217,.28),rgba(84,39,217,0) 70%),#050508}
.beam{position:absolute;left:50%;top:50%;width:2600px;height:480px;margin-left:-1300px;margin-top:-240px;background:linear-gradient(90deg,rgba(100,48,240,0),rgba(140,100,255,.18) 40%,rgba(180,160,255,.24) 50%,rgba(140,100,255,.18) 60%,rgba(100,48,240,0));filter:blur(40px);opacity:.5}
.flare{position:absolute;left:50%;top:50%;width:1300px;height:1300px;margin:-650px 0 0 -650px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.9) 0%,rgba(165,139,255,.5) 12%,rgba(100,48,240,0) 55%);opacity:0;mix-blend-mode:screen}
.wm{position:absolute;top:80px;left:0;right:0;text-align:center;font-family:Geist;font-weight:600;font-size:26px;letter-spacing:.42em;text-indent:.42em;color:rgba(247,247,251,.6);direction:ltr}
.v{color:#a58bff}
.center{position:absolute;left:60px;right:60px;top:50%;transform:translateY(-50%);text-align:center;opacity:0}
/* S1 clock */
.clock{position:absolute;left:50%;top:50%;width:640px;height:640px;margin:-420px 0 0 -320px;opacity:0}
.clock svg{width:100%;height:100%;overflow:visible}
.clock .ring{fill:none;stroke:rgba(165,139,255,.25);stroke-width:6}
.clock .arc{fill:none;stroke:#a58bff;stroke-width:10;stroke-linecap:round;transform:rotate(-90deg);transform-origin:50% 50%;filter:drop-shadow(0 0 18px rgba(165,139,255,.8))}
.clock .hand{stroke:#fff;stroke-width:8;stroke-linecap:round;transform-origin:50% 50%}
.clock .dot{fill:#fff}
.h1{font-size:150px;font-weight:700;line-height:1.15}
.h2{font-size:104px;font-weight:600;line-height:1.35}
.sub{font-size:56px;font-weight:500;color:rgba(247,247,251,.75);margin-top:26px}
/* S2 timer */
.timer{font-family:Geist;font-weight:700;font-size:150px;letter-spacing:.04em;direction:ltr;color:#fff;margin-top:30px;font-variant-numeric:tabular-nums}
.chip{display:inline-flex;align-items:center;gap:16px;background:rgba(46,204,113,.14);border:2px solid rgba(46,204,113,.7);color:#7bf1a8;border-radius:999px;padding:12px 34px 16px;font-size:44px;font-weight:600;margin-top:34px;opacity:0}
.chip svg{width:44px;height:44px}
/* S3 flow */
.steps{position:absolute;left:90px;right:90px;top:250px}
.step{display:flex;align-items:center;gap:28px;height:120px;opacity:.28;transform:translateX(60px)}
.step .n{width:80px;height:80px;border-radius:50%;border:3px solid rgba(165,139,255,.6);display:grid;place-items:center;font-family:Geist;font-weight:700;font-size:40px;direction:ltr;color:#a58bff;flex:none}
.step.on .n{background:#6430f0;border-color:#a58bff;color:#fff;box-shadow:0 0 40px rgba(100,48,240,.8)}
.step .t{font-size:54px;font-weight:600;white-space:nowrap}
.step .t .v{color:#a58bff}
.card{position:absolute;left:110px;right:110px;top:820px;background:#10101a;border:2px solid #2a2842;border-radius:40px;padding:38px 42px;box-shadow:0 50px 120px rgba(0,0,0,.7);opacity:0}
.card .row{display:flex;align-items:center;gap:26px}
.card .av{width:110px;height:110px;border-radius:50%;background:linear-gradient(160deg,#2a2842,#3a3660);border:2px solid #3f3a6b;display:grid;place-items:center;font-size:48px;font-weight:600;color:#c9bfff;flex:none}
.card .who{font-size:44px;font-weight:600}.card .who small{display:block;font-size:30px;color:rgba(247,247,251,.6);font-weight:400;margin-top:6px}
.card .body{margin-top:34px;font-size:40px;line-height:1.5;color:rgba(247,247,251,.85)}
.card .price{margin-top:30px;display:flex;align-items:center;justify-content:space-between}
.card .price b{font-family:Geist;font-weight:700;font-size:64px;direction:ltr;color:#fff}
.card .price span{font-size:34px;color:rgba(247,247,251,.6)}
.card .lockb{position:absolute;left:-34px;top:-34px;width:150px;height:150px;border-radius:50%;background:#7bf1a8;color:#0a0a10;display:grid;place-items:center;box-shadow:0 20px 60px rgba(46,204,113,.45);opacity:0}
.card .lockb svg{width:82px;height:82px}
.card .paid{position:absolute;right:42px;bottom:-40px;background:#7bf1a8;color:#05140b;border-radius:999px;padding:10px 32px 14px;font-size:38px;font-weight:700;opacity:0;box-shadow:0 20px 50px rgba(46,204,113,.4)}
.star{position:absolute;left:0;right:0;top:1470px;display:flex;flex-direction:column;align-items:center;gap:20px;opacity:0}
.star .ring{width:220px;height:220px;border-radius:50%;background:radial-gradient(circle at 40% 35%,#8a66ff,#3a1bb0);display:grid;place-items:center;box-shadow:0 0 80px rgba(100,48,240,.7);position:relative}
.star .ring svg.mk{width:110px;height:110px;fill:#fff}
.star .ok{position:absolute;right:-10px;bottom:-6px;width:80px;height:80px;border-radius:50%;background:#7bf1a8;color:#05140b;display:grid;place-items:center;opacity:0}
.star .ok svg{width:50px;height:50px}
.star .lbl{font-size:44px;font-weight:600}
.star .lbl .v{color:#a58bff}
/* S4 chips */
.two{display:flex;justify-content:center;gap:34px;margin-bottom:60px}
.pill{font-size:72px;font-weight:700;padding:18px 54px 26px;border-radius:999px;border:3px solid rgba(165,139,255,.6);background:rgba(100,48,240,.18);opacity:0}
/* S5 strike */
.no{position:relative;display:inline-block}
.no .strike{position:absolute;right:-.1em;left:-.1em;top:54%;height:12px;width:0;background:#ff7a9c;border-radius:6px;box-shadow:0 0 20px rgba(255,122,156,.8)}
.end{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;opacity:0}
.end svg{width:150px;height:150px;fill:#a58bff;filter:drop-shadow(0 0 40px rgba(100,48,240,.9))}
.end .ar{font-size:132px;font-weight:600;margin-top:30px;line-height:1.15}
.end .tg{font-size:56px;color:#fff;margin-top:26px;font-weight:600}
.end .tg .v{color:#a58bff}
.end .cta{margin-top:48px;background:#6430f0;color:#fff;border-radius:999px;padding:18px 64px 26px;font-size:48px;font-weight:700;box-shadow:0 20px 60px rgba(100,48,240,.6)}
.end .meta{margin-top:40px;font-family:Geist;font-weight:600;font-size:36px;color:rgba(247,247,251,.85);direction:ltr;letter-spacing:.04em}
.end .meta b{color:#fff}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 55%,rgba(0,0,0,.6) 100%);pointer-events:none}
.grain{position:absolute;inset:-20px;opacity:.06;mix-blend-mode:overlay;pointer-events:none}
.fade{position:absolute;inset:0;background:#000;opacity:0}
</style></head><body><div id="shake"><div class="bg"></div><div class="beam" id="beam"></div>
<div class="wm">IRAQISTAR</div>
<div class="clock" id="clock"><svg viewBox="0 0 200 200"><circle class="ring" cx="100" cy="100" r="92"/><circle class="arc" id="arc" cx="100" cy="100" r="92" stroke-dasharray="578" stroke-dashoffset="578"/><line class="hand" id="hand" x1="100" y1="100" x2="100" y2="24"/><circle class="dot" cx="100" cy="100" r="7"/></svg></div>
<div class="center" id="s1" style="margin-top:200px"><div class="h1">وقتك <span class="v">غالي.</span></div></div>
<div class="center" id="s2"><div class="h2">وكل دقيقة منه…</div><div class="timer" id="timer">00:00</div><div class="h2" id="s2b" style="opacity:0"><span class="v">محسوبة.</span></div><div class="chip" id="chip">${CHECK} مدفوع</div></div>
<div class="steps" id="steps">${step("st1","1","العميل <span class='v'>يرسل</span> الطلب")}${step("st2","2","المبلغ <span class='v'>يُحجز مقدّماً</span>")}${step("st3","3","بعدها بس… <span class='v'>يوصلك</span> الطلب")}</div>
<div class="card" id="card"><div class="row"><div class="av">أ</div><div class="who">أحمد<small>طلب جديد · فيديو تهنئة</small></div></div><div class="body">«لأمي بعيد ميلادها… تحب تسمع صوتك 🎂»</div><div class="price"><b>25,000 IQD</b><span>سعرك المحدّد</span></div><div class="lockb" id="lockb">${LOCK}</div><div class="paid" id="paid">الدفع محجوز ✓</div></div>
<div class="star" id="star"><div class="ring">${m("mk")}<div class="ok" id="ok">${CHECK}</div></div><div class="lbl">النجم <span class="v">(إنت)</span></div></div>
<div class="center" id="s4"><div class="two"><div class="pill" id="p1">شخصي</div><div class="pill" id="p2">أعمال</div></div><div class="h2" id="s4b" style="opacity:0">نفس القاعدة:<br><span class="v">الدفع أول.</span></div></div>
<div class="center" id="s5"><div class="h2">لا انتظار…</div><div class="h2" style="margin-top:20px">لا <span class="no" id="no">«بعدين أدفعلك»<span class="strike" id="strike"></span></span></div><div class="sub" id="s5b" style="opacity:0">الطلب يوصلك… <span class="v">وفلوسه محجوزة.</span></div></div>
<div class="end" id="end">${m("")}<div class="ar">نجم العراق</div><div class="tg">إنت نجم <span class="v">بحياة شخص</span></div><div class="cta">انضم كنجم</div><div class="meta"><b>iraqistar.com</b> · @iraqistar.iq</div></div>
<div class="vig"></div><div class="flare" id="flare"></div>
<svg class="grain" width="100%" height="100%"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="1" id="turb"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>
<div class="fade" id="fade"></div></div>
<script>
var DUR=${DUR};
var clamp=function(x,a,b){return Math.max(a,Math.min(b,x))}, eo=function(x){return 1-Math.pow(1-x,3)}, ei=function(x){return x*x*x}, back=function(x){var c=1.6;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)}, seg=function(t,s,d){return clamp((t-s)/d,0,1)}, hit=function(t,a,l){return t>=a?Math.exp(-(t-a)/l):0}, $=function(id){return document.getElementById(id)};
var HITS=[0.3,2.6,5.0,7.2,9.4,11.6,14.0,16.4];
function show(id,tin,din,tout,dout,dy){var el=$(id); var k=eo(seg(t_,tin,din)); var o=1-ei(seg(t_,tout,dout)); el.style.opacity=(k*o).toFixed(3); el.style.transform='translateY(-50%) translateY('+((1-k)*(dy||40)).toFixed(0)+'px)'; return k*o;}
var t_=0;
window.renderAt=function(t){ t_=t;
  $('turb').setAttribute('seed',String(Math.floor(t*24)%40));
  var Hh=0; HITS.forEach(function(h){Hh+=hit(t,h,0.16)});
  $('shake').style.transform='translate('+(Math.sin(t*137)*5*Hh).toFixed(1)+'px,'+(Math.cos(t*91)*3*Hh).toFixed(1)+'px)';
  $('flare').style.opacity=clamp(Hh*0.6,0,1).toFixed(3); $('flare').style.transform='scale('+(0.6+Hh*0.8).toFixed(3)+')';
  $('beam').style.transform='rotate('+(-24+Math.sin(t*0.5)*8).toFixed(1)+'deg)'; $('beam').style.opacity=(0.35+0.4*Hh).toFixed(3);
  // S1 0–2.6 clock + وقتك غالي
  var ck=$('clock'); var kc=eo(seg(t,0.1,0.6)); var co=1-ei(seg(t,2.4,0.2)); ck.style.opacity=(kc*co).toFixed(3); ck.style.transform='scale('+(0.7+0.3*kc).toFixed(3)+')';
  $('arc').setAttribute('stroke-dashoffset',String((578*(1-seg(t,0.2,2.0))).toFixed(1))); $('hand').style.transform='rotate('+(seg(t,0.2,2.0)*360).toFixed(1)+'deg)';
  var s1=$('s1'); var k1=back(seg(t,0.3,0.5)); s1.style.opacity=(clamp(k1*3,0,1)*co).toFixed(3); s1.style.transform='translateY(-50%) translateY(200px) scale('+(0.7+0.3*Math.min(k1,1.1)).toFixed(3)+')'; s1.style.filter='blur('+((1-Math.min(k1,1))*10).toFixed(1)+'px)';
  // S2 2.6–5.0 timer
  var o2=show('s2',2.6,0.45,4.8,0.2,50); var tm=seg(t,2.7,1.6); var secs=Math.floor(tm*59); $('timer').textContent='00:'+(secs<10?'0':'')+secs; $('timer').style.color=t>=4.3?'#7bf1a8':'#fff';
  var k2b=back(seg(t,3.6,0.35)); $('s2b').style.opacity=clamp(k2b*3,0,1); $('s2b').style.transform='scale('+(1.3-0.3*Math.min(k2b,1.1)).toFixed(3)+')';
  var kch=back(seg(t,4.3,0.3)); $('chip').style.opacity=clamp(kch*3,0,1); $('chip').style.transform='scale('+(0.6+0.4*Math.min(kch,1.1)).toFixed(3)+')';
  // S3 5.0–11.6 flow
  var f_in=eo(seg(t,5.0,0.5)), f_out=1-ei(seg(t,11.4,0.2)); var fo=f_in*f_out;
  $('steps').style.opacity=fo.toFixed(3); $('star').style.opacity=fo.toFixed(3);
  [['st1',5.0],['st2',7.2],['st3',9.4]].forEach(function(s){var el=$(s[0]); var k=eo(seg(t,s[1],0.4)); el.classList.toggle('on',t>=s[1]); el.style.opacity=(0.28+0.72*k).toFixed(3); el.style.transform='translateX('+((1-k)*60).toFixed(0)+'px)';});
  var card=$('card'); var kcd=back(seg(t,5.2,0.6)); var kmv=eo(seg(t,9.4,0.6)); card.style.opacity=(clamp(kcd*3,0,1)*f_out).toFixed(3);
  card.style.transform='translateY('+(((1-kcd)*-260)+kmv*110).toFixed(0)+'px) scale('+((0.85+0.15*Math.min(kcd,1))*(1-0.14*kmv)).toFixed(3)+') rotate('+((1-Math.min(kcd,1))*4).toFixed(1)+'deg)';
  var kl=back(seg(t,7.2,0.35)); $('lockb').style.opacity=clamp(kl*3,0,1); $('lockb').style.transform='scale('+(2.4-1.4*Math.min(kl,1.12)).toFixed(3)+') rotate('+((1-Math.min(kl,1))*-30).toFixed(1)+'deg)';
  var kp=back(seg(t,7.6,0.35)); $('paid').style.opacity=clamp(kp*3,0,1); $('paid').style.transform='translateY('+((1-Math.min(kp,1))*30).toFixed(0)+'px) scale('+(0.7+0.3*Math.min(kp,1.1)).toFixed(3)+')';
  var ko=back(seg(t,9.9,0.35)); $('ok').style.opacity=clamp(ko*3,0,1); $('ok').style.transform='scale('+(0.4+0.6*Math.min(ko,1.15)).toFixed(3)+')';
  $('star').style.transform='translateY('+((1-f_in)*60).toFixed(0)+'px) scale('+(1+0.08*hit(t,9.9,0.3)).toFixed(3)+')';
  // S4 11.6–14.0
  show('s4',11.6,0.4,13.8,0.2,40);
  [['p1',11.6],['p2',11.95]].forEach(function(p){var k=back(seg(t,p[1],0.35)); var el=$(p[0]); el.style.opacity=clamp(k*3,0,1); el.style.transform='scale('+(0.5+0.5*Math.min(k,1.12)).toFixed(3)+')';});
  var k4=eo(seg(t,12.5,0.4)); $('s4b').style.opacity=k4; $('s4b').style.transform='translateY('+((1-k4)*20).toFixed(0)+'px)';
  // S5 14.0–16.4
  show('s5',14.0,0.4,16.2,0.2,40);
  var no=$('no'); $('strike').style.width=(eo(seg(t,14.7,0.3))*no.offsetWidth*1.04).toFixed(0)+'px'; no.style.opacity=t>=14.9?0.6:1;
  var k5=eo(seg(t,15.1,0.4)); $('s5b').style.opacity=k5; $('s5b').style.transform='translateY('+((1-k5)*20).toFixed(0)+'px)';
  // end 16.4+
  var e=$('end'); var ke=back(seg(t,16.4,0.6)); e.style.opacity=clamp(ke*3,0,1); e.style.transform='scale('+(0.8+0.2*Math.min(ke,1)).toFixed(3)+')';
  $('fade').style.opacity=ei(seg(t,DUR-0.7,0.7)).toFixed(3);
};
</script></body></html>`;
fs.writeFileSync("paid.html", html);
const dir = "frames"; if (!process.argv[2]) { fs.rmSync(dir, { recursive: true, force: true }); } fs.mkdirSync(dir, { recursive: true });
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }); const p = await b.newPage({ viewport: { width: W, height: H } });
p.on("pageerror", e => console.log("PAGEERR", e.message));
await p.goto("file://" + process.cwd() + "/paid.html"); await p.evaluate(() => document.fonts.ready);
const only = process.argv[2] ? process.argv[2].split(",").map(Number) : null;
for (let f = 0; f < DUR * FPS; f++) { if (only && !only.includes(f)) continue; await p.evaluate(t => window.renderAt(t), f / FPS); await p.screenshot({ path: `${dir}/${String(f).padStart(4, "0")}.jpg`, type: "jpeg", quality: 90 }); }
await b.close();
if (!only) execSync(`ffmpeg -v error -y -framerate ${FPS} -i ${dir}/%04d.jpg -c:v libx264 -pix_fmt yuv420p -crf 17 -preset medium -movflags +faststart paid-silent.mp4`);
console.log("done");
