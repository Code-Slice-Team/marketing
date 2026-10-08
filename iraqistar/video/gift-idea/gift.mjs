// نجم العراق — "محتار شتهديه؟" gift-idea Reel. 1080x1920, 22 s. Kinetic Iraqi copy, stamped "عنده" items, phone with the
// video message, end card. node gift.mjs [frames] → gift-silent.mp4
import { chromium } from "playwright"; import fs from "node:fs"; import { execSync } from "node:child_process";
const FPS = 30, W = 1080, H = 1920, DUR = 22;
const MARK = "M12.00 0.80 L14.49 5.99 L19.92 4.08 L18.01 9.51 L23.20 12.00 L18.01 14.49 L19.92 19.92 L14.49 18.01 L12.00 23.20 L9.51 18.01 L4.08 19.92 L5.99 14.49 L0.80 12.00 L5.99 9.51 L4.08 4.08 L9.51 5.99 Z M9.40 8.10 L16.40 12.00 L9.40 15.90 Z";
const m = cls => `<svg class="${cls}" viewBox="0 0 24 24"><path fill-rule="evenodd" d="${MARK}"/></svg>`;
// simple line icons (own drawings)
const ICO = {
  perfume: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="26" y="6" width="12" height="8" rx="2"/><path d="M28 14v6M36 14v6"/><path d="M18 24h28l4 10v18a6 6 0 0 1-6 6H20a6 6 0 0 1-6-6V34z"/><path d="M22 40h20"/></svg>`,
  phone: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="18" y="6" width="28" height="52" rx="6"/><path d="M27 12h10M30 50h4"/></svg>`,
  shirt: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10l10 6 10-6 12 8-6 10-6-3v29H22V25l-6 3-6-10z"/></svg>`,
};
const item = (id, ico, word, stamp) => `<div class="item" id="${id}"><div class="ico">${ICO[ico]}</div><div class="w"><span class="txt">${word}</span><span class="strike"></span></div><div class="stamp">${stamp}</div></div>`;
const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-Regular.ttf);font-weight:400}
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-Medium.ttf);font-weight:500}
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-SemiBold.ttf);font-weight:600}
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-Bold.ttf);font-weight:700}
@font-face{font-family:Geist;src:url(fonts/Geist-SemiBold.ttf);font-weight:600}
*{margin:0;padding:0;box-sizing:border-box}
html{overflow:hidden;width:${W}px;height:${H}px}
body{width:${W}px;height:${H}px;overflow:hidden;background:#050508;color:#f7f7fb;font-family:"IBM Plex Sans Arabic",sans-serif;position:relative}
#shake{position:absolute;inset:0}
.bg{position:absolute;inset:0;background:radial-gradient(ellipse 800px 900px at 50% 45%,rgba(84,39,217,.28),rgba(84,39,217,0) 70%),#050508}
.beam{position:absolute;left:50%;top:50%;width:2600px;height:480px;margin-left:-1300px;margin-top:-240px;background:linear-gradient(90deg,rgba(100,48,240,0),rgba(140,100,255,.18) 40%,rgba(180,160,255,.24) 50%,rgba(140,100,255,.18) 60%,rgba(100,48,240,0));filter:blur(40px);opacity:.5}
.flare{position:absolute;left:50%;top:50%;width:1300px;height:1300px;margin:-650px 0 0 -650px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.9) 0%,rgba(165,139,255,.5) 12%,rgba(100,48,240,0) 55%);opacity:0;mix-blend-mode:screen}
.wm{position:absolute;top:80px;left:0;right:0;text-align:center;font-family:Geist;font-weight:600;font-size:26px;letter-spacing:.42em;text-indent:.42em;color:rgba(247,247,251,.6);direction:ltr}
.q{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;font-size:150px;font-weight:700;line-height:1.2;opacity:0}
.q .v{color:#a58bff}
.items{position:absolute;left:90px;right:90px;top:50%;transform:translateY(-50%)}
.item{position:relative;display:flex;align-items:center;gap:44px;height:260px;opacity:0;will-change:transform}
.item .ico{width:150px;height:150px;flex:none;color:#a58bff;filter:drop-shadow(0 0 24px rgba(100,48,240,.6))}
.item .ico svg{width:100%;height:100%}
.item .w{position:relative;font-size:132px;font-weight:700;line-height:1;white-space:nowrap}
.item .strike{position:absolute;right:-.1em;top:52%;height:12px;width:0;background:#ff7a9c;border-radius:6px;box-shadow:0 0 20px rgba(255,122,156,.8)}
.item .stamp{position:absolute;left:0;top:50%;transform:translateY(-50%) rotate(-10deg) scale(3);font-size:78px;font-weight:700;color:#ff7a9c;border:6px solid #ff7a9c;border-radius:22px;padding:6px 30px 12px;opacity:0;white-space:nowrap;box-shadow:0 0 40px rgba(255,122,156,.35),inset 0 0 0 3px rgba(5,5,8,.6);background:rgba(5,5,8,.55)}
.but{position:absolute;left:70px;right:70px;top:50%;transform:translateY(-50%);text-align:center;opacity:0}
.but .l1{font-size:96px;font-weight:600;line-height:1.35}
.but .l1 .v{color:#a58bff}
.but .l2{font-size:96px;font-weight:600;line-height:1.35;margin-top:10px}
.big{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;font-size:176px;font-weight:700;line-height:1.2;opacity:0;color:#fff}
.big .v{color:#a58bff}
.phone{position:absolute;left:50%;top:50%;width:520px;height:1060px;margin-left:-260px;margin-top:-450px;background:#0a0a10;border-radius:76px;padding:14px;box-shadow:0 60px 140px rgba(0,0,0,.8),0 0 0 2px #2a2842,0 0 120px rgba(100,48,240,.35);opacity:0}
.scr{position:relative;width:100%;height:100%;border-radius:62px;overflow:hidden;background:linear-gradient(170deg,#6430f0,#a58bff 60%,#ff7a9c)}
.scr .av{position:absolute;inset:0;width:100%;height:100%;fill:rgba(255,255,255,.3)}
.scr .top{position:absolute;top:26px;left:0;right:0;display:flex;align-items:center;justify-content:center;gap:12px;font-size:26px;font-weight:600;color:#fff}
.scr .top svg{width:30px;height:30px;fill:#fff}
.scr .play{position:absolute;left:50%;top:50%;width:130px;height:130px;border-radius:50%;background:rgba(255,255,255,.92);transform:translate(-50%,-50%);display:grid;place-items:center}
.scr .play svg{width:62px;height:62px;fill:#6430f0;margin-left:6px}
.scr .pcap{position:absolute;bottom:120px;left:28px;right:28px;background:rgba(8,8,15,.55);border-radius:20px;padding:18px 22px;color:#fff;font-size:34px;font-weight:600;text-align:right}
.scr .pcap small{display:block;font-size:24px;opacity:.8;font-weight:400;margin-top:4px}
.scr .prog{position:absolute;bottom:66px;left:28px;right:28px;height:8px;background:rgba(255,255,255,.35);border-radius:4px}.scr .prog i{display:block;height:100%;width:0;background:#fff;border-radius:4px}
.heart{position:absolute;color:#ff7a9c;font-style:normal;font-size:56px;opacity:0;text-shadow:0 0 20px rgba(255,122,156,.8)}
.cap{position:absolute;left:60px;right:60px;text-align:center;opacity:0}
.cap h1{font-size:66px;font-weight:600;line-height:1.3}
.cap h1 .v{color:#a58bff}
.bd{display:inline-block;background:rgba(8,8,15,.86);border:1.5px solid rgba(165,139,255,.45);border-radius:.5em;padding:.14em .5em .2em;box-shadow:0 24px 70px rgba(0,0,0,.6)}
.end{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;opacity:0}
.end svg{width:150px;height:150px;fill:#a58bff;filter:drop-shadow(0 0 40px rgba(100,48,240,.9))}
.end .ar{font-size:132px;font-weight:600;margin-top:30px;line-height:1.15}
.end .tg{font-size:44px;color:#a58bff;margin-top:20px}
.end .meta{margin-top:40px;font-family:Geist;font-weight:600;font-size:36px;color:rgba(247,247,251,.85);direction:ltr;letter-spacing:.04em}
.end .meta b{color:#fff}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 55%,rgba(0,0,0,.6) 100%);pointer-events:none}
.grain{position:absolute;inset:-20px;opacity:.06;mix-blend-mode:overlay;pointer-events:none}
.fade{position:absolute;inset:0;background:#000;opacity:0}
</style></head><body><div id="shake"><div class="bg"></div><div class="beam" id="beam"></div>
<div class="wm">IRAQISTAR</div>
<div class="q" id="q">محتار <span class="v">شتهديه؟</span></div>
<div class="items">${item("i1","perfume","عطر؟","عنده.")}${item("i2","phone","موبايل؟","عنده.")}${item("i3","shirt","ملابس؟","عنده هواية.")}</div>
<div class="but" id="but"><div class="l1">بس فيديو من <span class="v">نجمه المفضّل</span></div><div class="l2">يذكر اسمه؟</div></div>
<div class="big" id="big">أكيد <span class="v">ما عنده!</span></div>
<div class="phone" id="ph"><div class="scr"><svg class="av" viewBox="0 0 100 100" preserveAspectRatio="xMidYMax slice"><circle cx="50" cy="40" r="17"/><path d="M12 100c2-26 17-38 38-38s36 12 38 38Z"/></svg><div class="top">${m("")}نجمه المفضّل · فيديو شخصي</div><div class="play" id="play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7Z"/></svg></div><div class="pcap">لـ أحمد… عيد ميلاد سعيد<small>رسالة باسمه · 0:42</small></div><div class="prog"><i id="prog"></i></div></div></div>
${[0,1,2,3,4,5].map(i=>`<i class="heart" id="hb${i}" style="left:${760+(i%3)*40}px;top:900px">♥</i>`).join("")}
<div class="cap" id="c1" style="top:200px"><h1><span class="bd">هدية ما تنلگى <span class="v">بأي محل</span></span></h1></div>
<div class="cap" id="c2" style="top:1560px"><h1><span class="bd">رسالة باسمه… تبقى وياه <span class="v">العمر كله.</span></span></h1></div>
<div class="end" id="end">${m("")}<div class="ar">نجم العراق</div><div class="tg">من نجوم العراق… إليك</div><div class="meta"><b>iraqistar.com</b> · @iraqistar.iq</div></div>
<div class="vig"></div><div class="flare" id="flare"></div>
<svg class="grain" width="100%" height="100%"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="1" id="turb"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>
<div class="fade" id="fade"></div></div>
<script>
var DUR=${DUR};
var clamp=function(x,a,b){return Math.max(a,Math.min(b,x))}, eo=function(x){return 1-Math.pow(1-x,3)}, ei=function(x){return x*x*x}, back=function(x){var c=1.6;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)}, seg=function(t,s,d){return clamp((t-s)/d,0,1)}, hit=function(t,a,l){return t>=a?Math.exp(-(t-a)/l):0}, $=function(id){return document.getElementById(id)};
var HITS=[0.3,2.4,4.0,5.6,9.6,11.6,16.0,18.6];
var ITEMS=[['i1',1.6,2.4],['i2',3.2,4.0],['i3',4.8,5.6]];
window.renderAt=function(t){
  $('turb').setAttribute('seed',String(Math.floor(t*24)%40));
  var Hh=0; HITS.forEach(function(h){Hh+=hit(t,h,0.16)});
  $('shake').style.transform='translate('+(Math.sin(t*137)*6*Hh).toFixed(1)+'px,'+(Math.cos(t*91)*4*Hh).toFixed(1)+'px)';
  $('flare').style.opacity=clamp(Hh*0.7,0,1).toFixed(3); $('flare').style.transform='scale('+(0.6+Hh*0.8).toFixed(3)+')';
  $('beam').style.transform='rotate('+(-24+Math.sin(t*0.5)*8).toFixed(1)+'deg)'; $('beam').style.opacity=(0.35+0.4*Hh).toFixed(3);
  // Q 0–1.6
  var q=$('q'); var kq=back(seg(t,0.15,0.5)); var qo=1-ei(seg(t,1.35,0.25)); q.style.opacity=(clamp(kq*3,0,1)*qo).toFixed(3); q.style.transform='translateY(-50%) scale('+(0.6+0.4*kq).toFixed(3)+')'; q.style.filter='blur('+((1-Math.min(kq,1))*10).toFixed(1)+'px)';
  // items 1.6–6.6 (stay stacked, each stamped)
  ITEMS.forEach(function(it,i){var el=$(it[0]); var s=it[1], st=it[2]; var k=back(seg(t,s,0.5)); var out=ei(seg(t,6.4,0.25)); el.style.opacity=(clamp(k*3,0,1)*(1-out)).toFixed(3); el.style.transform='translateX('+((1-k)*420).toFixed(0)+'px)';
    var ks=back(seg(t,st,0.28)); var sp=el.querySelector('.stamp'); sp.style.opacity=clamp(ks*3,0,1); sp.style.transform='translateY(-50%) rotate(-10deg) scale('+(3-2*Math.min(ks,1.15)).toFixed(3)+')';
    var w=el.querySelector('.w'); var strike=el.querySelector('.strike'); strike.style.width=(eo(seg(t,st+0.08,0.25))*w.offsetWidth*1.05).toFixed(0)+'px'; w.style.opacity=t>=st+0.1?0.55:1;});
  // but 6.6–9.6
  var b=$('but'); var kb=eo(seg(t,6.7,0.6)); var bo=1-ei(seg(t,9.35,0.25)); b.style.opacity=(kb*bo).toFixed(3); b.style.transform='translateY(-50%) translateY('+((1-kb)*40).toFixed(0)+'px)';
  b.querySelector('.l2').style.opacity=eo(seg(t,7.6,0.5));
  // big 9.6–11.6
  var bg=$('big'); var kg=back(seg(t,9.6,0.4)); var go=1-ei(seg(t,11.4,0.2)); bg.style.opacity=(clamp(kg*3,0,1)*go).toFixed(3); bg.style.transform='translateY(-50%) scale('+(1.5-0.5*Math.min(kg,1.1)).toFixed(3)+')'; bg.style.filter='blur('+((1-Math.min(kg,1))*14).toFixed(1)+'px)';
  // phone 11.6–18.6
  var ph=$('ph'); var kp=back(seg(t,11.6,0.6)); var po=1-eo(seg(t,18.3,0.3)); ph.style.opacity=(clamp(kp*3,0,1)*po).toFixed(3); ph.style.transform='translateY('+((1-kp)*300).toFixed(0)+'px) rotate('+((1-kp)*-8).toFixed(1)+'deg) scale('+(0.8+0.2*Math.min(kp,1)).toFixed(3)+')';
  var pp=seg(t,12.4,5.6); $('prog').style.width=(pp*100).toFixed(1)+'%'; $('play').style.opacity=(1-eo(seg(t,12.4,0.3))).toFixed(2); $('play').style.transform='translate(-50%,-50%) scale('+(1+eo(seg(t,12.4,0.3))*0.6).toFixed(2)+')';
  [0,1,2,3,4,5].forEach(function(i){var s=12.8+i*0.5; var k=seg(t,s,1.5); var el=$('hb'+i); el.style.opacity=(k>0&&k<1?Math.sin(k*Math.PI):0).toFixed(2); el.style.transform='translate('+(Math.sin(k*8+i)*36).toFixed(0)+'px,'+(-k*420).toFixed(0)+'px) scale('+(0.6+k*0.8).toFixed(2)+')';});
  var c1=$('c1'); var k1=eo(seg(t,12.0,0.5)); c1.style.opacity=(k1*po).toFixed(3); c1.style.transform='translateY('+((1-k1)*24).toFixed(0)+'px)';
  var c2=$('c2'); var k2=back(seg(t,16.0,0.5)); c2.style.opacity=(clamp(k2*3,0,1)*po).toFixed(3); c2.style.transform='translateY('+((1-k2)*30).toFixed(0)+'px) scale('+(0.9+0.1*Math.min(k2,1)).toFixed(3)+')';
  // end 18.6+
  var e=$('end'); var ke=back(seg(t,18.6,0.6)); e.style.opacity=clamp(ke*3,0,1); e.style.transform='scale('+(0.8+0.2*Math.min(ke,1)).toFixed(3)+')';
  $('fade').style.opacity=ei(seg(t,DUR-0.7,0.7)).toFixed(3);
};
</script></body></html>`;
fs.writeFileSync("gift.html", html);
const dir = "frames"; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir);
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }); const p = await b.newPage({ viewport: { width: W, height: H } });
p.on("pageerror", e => console.log("PAGEERR", e.message));
await p.goto("file://" + process.cwd() + "/gift.html"); await p.evaluate(() => document.fonts.ready);
const only = process.argv[2] ? process.argv[2].split(",").map(Number) : null;
for (let f = 0; f < DUR * FPS; f++) { if (only && !only.includes(f)) continue; await p.evaluate(t => window.renderAt(t), f / FPS); await p.screenshot({ path: `${dir}/${String(f).padStart(4, "0")}.jpg`, type: "jpeg", quality: 90 }); }
await b.close();
if (!only) execSync(`ffmpeg -v error -y -framerate ${FPS} -i ${dir}/%04d.jpg -c:v libx264 -pix_fmt yuv420p -crf 17 -preset medium -movflags +faststart gift-silent.mp4`);
console.log("done");
