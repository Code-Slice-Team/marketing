// نجم العراق — launch film for stars. 1080x1920, 40 s, 120 BPM. 3D camera moves, exploded UI, macro dives, phone wall,
// kinetic type on hits, light beams and flares. Real screens throughout.
import { chromium } from "playwright"; import fs from "node:fs"; import { execSync } from "node:child_process";
const FPS = 30, W = 1080, H = 1920, DUR = 48;
const MARK = "M12.00 0.80 L14.49 5.99 L19.92 4.08 L18.01 9.51 L23.20 12.00 L18.01 14.49 L19.92 19.92 L14.49 18.01 L12.00 23.20 L9.51 18.01 L4.08 19.92 L5.99 14.49 L0.80 12.00 L5.99 9.51 L4.08 4.08 L9.51 5.99 Z M9.40 8.10 L16.40 12.00 L9.40 15.90 Z";
const m = cls => `<svg class="${cls}" viewBox="0 0 24 24"><path fill-rule="evenodd" d="${MARK}"/></svg>`;
const SW = 600, SH = 1300, SCALE = SW / 750, HDR = Math.round(205 * SCALE);
const phone = (id, page, cls = "", hdr = "header", page2 = null) => `<div class="phone ${cls}" id="${id}"><div class="scr"><div class="page" id="${id}-pg"><img src="stitched/${page}.jpg"></div>${page2 ? `<div class="page pg2" id="${id}-pg2"><img src="stitched/${page2}.jpg"></div>` : ""}<div class="hdr" id="${id}-hdr"><img src="stitched/${hdr}.jpg"></div><div class="notch"></div><div class="refl" id="${id}-refl"></div></div><div class="edge"></div></div>`;
const ui = (id, file, w, x, y, z, rz = 0) => `<div class="ui" id="${id}" data-x="${x}" data-y="${y}" data-z="${z}" data-rz="${rz}" style="width:${w}px"><img src="ui/${file}.png"></div>`;

const css = `
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-Regular.ttf);font-weight:400}
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-Medium.ttf);font-weight:500}
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-SemiBold.ttf);font-weight:600}
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-Bold.ttf);font-weight:700}
@font-face{font-family:Geist;src:url(fonts/Geist-SemiBold.ttf);font-weight:600}
@font-face{font-family:Geist;src:url(fonts/Geist-Bold.ttf);font-weight:700}
*{margin:0;padding:0;box-sizing:border-box}
html{overflow:hidden;width:${W}px;height:${H}px}
body{width:${W}px;height:${H}px;overflow:hidden;background:#030306;color:#f7f7fb;font-family:"IBM Plex Sans Arabic",sans-serif;position:relative}
#shake{position:absolute;inset:0}
#world{position:absolute;inset:0;perspective:1900px;perspective-origin:50% 48%}
#cam{position:absolute;inset:0;transform-style:preserve-3d}
.bg{position:absolute;inset:0;background:radial-gradient(ellipse 800px 1000px at 50% 50%,rgba(84,39,217,.22),rgba(84,39,217,0) 70%),#030306}
.beam{position:absolute;left:50%;top:50%;width:2600px;height:520px;margin-left:-1300px;margin-top:-260px;background:linear-gradient(90deg,rgba(100,48,240,0),rgba(120,80,255,.16) 35%,rgba(180,160,255,.22) 50%,rgba(120,80,255,.16) 65%,rgba(100,48,240,0));filter:blur(40px);opacity:.6;transform-origin:50% 50%}
.flare{position:absolute;left:50%;top:50%;width:1400px;height:1400px;margin:-700px 0 0 -700px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.9) 0%,rgba(165,139,255,.55) 12%,rgba(100,48,240,.25) 30%,rgba(100,48,240,0) 60%);opacity:0;mix-blend-mode:screen}
.streak{position:absolute;left:-200px;width:900px;height:3px;background:linear-gradient(90deg,rgba(255,255,255,0),#fff,rgba(165,139,255,0));opacity:0;transform-origin:0 50%;filter:blur(.6px)}
.g3{position:absolute;left:50%;top:50%;transform-style:preserve-3d}
.phone{position:absolute;left:0;top:0;width:${SW+28}px;height:${SH+28}px;margin-left:-${(SW+28)/2}px;margin-top:-${(SH+28)/2}px;background:#0a0a10;border-radius:84px;padding:14px;transform-style:preserve-3d;box-shadow:0 60px 140px rgba(0,0,0,.85),0 0 0 2px #2a2842;will-change:transform}
.phone .edge{position:absolute;inset:-2px;border-radius:86px;pointer-events:none;padding:2px;background:linear-gradient(135deg,rgba(255,255,255,.5),rgba(255,255,255,0) 28%,rgba(255,255,255,0) 72%,rgba(165,139,255,.5));-webkit-mask:linear-gradient(#000,#000) content-box,linear-gradient(#000,#000);-webkit-mask-composite:xor;mask-composite:exclude}
.scr{position:relative;width:${SW}px;height:${SH}px;border-radius:70px;overflow:hidden;background:#0b0b14}
.page{position:absolute;left:0;top:0;width:${SW}px;will-change:transform}.page.pg2{opacity:0}.page img{display:block;width:${SW}px}
.hdr{position:absolute;left:0;top:0;width:${SW}px;height:${HDR}px;z-index:3}.hdr img{display:block;width:${SW}px}
.notch{position:absolute;top:12px;left:50%;width:150px;height:34px;margin-left:-75px;background:#0a0a10;border-radius:999px;z-index:4}
.refl{position:absolute;inset:0;z-index:5;pointer-events:none;background:linear-gradient(115deg,rgba(255,255,255,0) 40%,rgba(255,255,255,.14) 50%,rgba(255,255,255,0) 60%);transform:translateX(-120%)}
.ui{position:absolute;left:50%;top:50%;border-radius:26px;overflow:hidden;box-shadow:0 40px 90px rgba(0,0,0,.7),0 0 0 1px rgba(165,139,255,.25);opacity:0;will-change:transform;transform-style:preserve-3d}
.ui img{display:block;width:100%}
.kin{position:absolute;left:0;right:0;top:50%;text-align:center;transform:translateY(-50%);font-weight:700;line-height:1.05;letter-spacing:-.02em;opacity:0;white-space:nowrap}
.kin.v{color:#a58bff}
.lbl{position:absolute;left:0;right:0;text-align:center;font-family:Geist;font-weight:600;font-size:24px;letter-spacing:.42em;text-indent:.42em;color:rgba(247,247,251,.7);direction:ltr;opacity:0}
.cap{position:absolute;left:60px;right:60px;text-align:center;opacity:0}
.cap h1{font-size:72px;font-weight:600;line-height:1.25;text-shadow:0 10px 50px rgba(0,0,0,.8)}
.cap h1 .v{color:#a58bff}
.cap p{font-size:32px;font-weight:400;color:rgba(247,247,251,.75);margin-top:14px;line-height:1.55}
.notif{position:absolute;left:50%;top:50%;width:640px;margin-left:-320px;background:rgba(19,18,30,.92);border:1px solid rgba(165,139,255,.35);border-radius:30px;padding:26px 30px;box-shadow:0 40px 100px rgba(0,0,0,.7),0 0 80px rgba(100,48,240,.35);backdrop-filter:blur(10px);opacity:0;text-align:right}
.notif .row{display:flex;align-items:center;gap:14px}.notif .mk{width:52px;height:52px;border-radius:14px;background:#6430f0;display:grid;place-items:center;flex:none}.notif .mk svg{width:32px;height:32px;fill:#fff}
.notif b{font-size:30px;font-weight:600;display:block}.notif small{font-size:22px;color:rgba(247,247,251,.65);display:block;margin-top:2px}
.notif .tag{margin-inline-start:auto;background:rgba(165,139,255,.18);color:#a58bff;border-radius:999px;padding:6px 16px;font-size:20px;font-weight:600}
.notif p{margin-top:18px;font-size:26px;line-height:1.6;color:rgba(247,247,251,.9)}
.notif .btns{display:flex;gap:12px;margin-top:20px}.notif .btns span{flex:1;text-align:center;border-radius:999px;padding:14px 0;font-size:24px;font-weight:600;border:1px solid rgba(247,247,251,.25)}.notif .btns span.p{background:#6430f0;border-color:#6430f0}
.emk{width:220px;height:220px;fill:#a58bff;filter:drop-shadow(0 0 40px rgba(100,48,240,.9))}
.pct{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;font-family:Geist;font-weight:700;font-size:360px;letter-spacing:-.05em;direction:ltr;line-height:1;opacity:0;text-shadow:0 0 80px rgba(100,48,240,.6)}
.bd{display:inline-block;background:rgba(8,8,15,.86);border:1.5px solid rgba(165,139,255,.45);border-radius:.32em;padding:.06em .36em .1em;box-shadow:0 24px 70px rgba(0,0,0,.6),0 0 0 6px rgba(8,8,15,.35);line-height:1.15}
.cap h1 .bd{border-radius:.5em;padding:.14em .5em .2em}
.cap p .bd{font-size:.94em;border-radius:.7em;padding:.22em .7em .3em;border-color:rgba(165,139,255,.25);background:rgba(8,8,15,.8);margin-top:.25em}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 50%,rgba(0,0,0,.65) 100%);pointer-events:none}
.grain{position:absolute;inset:-20px;opacity:.06;mix-blend-mode:overlay;pointer-events:none}
.fade{position:absolute;inset:0;background:#000;opacity:0;pointer-events:none}
`;

const body = `<div id="shake"><div class="bg"></div><div class="beam" id="beam1"></div><div class="beam" id="beam2"></div>
<div id="world"><div id="cam">
  <!-- hero phone (home) -->
  <div class="g3" id="g-hero">${phone("ph1", "home")}
    ${ui("u1","card-video",300,-360,-420,420,-6)}${ui("u2","card-live",300,370,-300,520,5)}${ui("u3","occasions",640,0,560,380,0)}${ui("u4","star-sara",230,-420,250,640,-8)}${ui("u5","star-aws",230,430,330,700,7)}${ui("u6","search",560,0,-720,300,0)}${ui("u7","star-nasma",200,-330,-40,820,4)}
  </div>
  <!-- profile phone for the macro dive -->
  <div class="g3" id="g-prof">${phone("ph2", "profile", "", "header", "studio-services")}</div>
  <!-- phone wall -->
  <div class="g3" id="g-wall">${["home","browse","profile","sessions","kids","ugc","browse"].map((p,i)=>`<div class="g3" style="transform:translate3d(${(i-3)*760}px,${(i%2?40:-40)}px,${-Math.abs(i-3)*120}px) rotateY(-22deg)">${phone("pw"+i,p,"wall")}</div>`).join("")}</div>
  <!-- request flow -->
  <div class="g3" id="g-req">${phone("ph3", "studio-home", "", "studio-header")}</div>
  <!-- sessions -->
  <div class="g3" id="g-ses">${phone("ph4", "sessions")}${ui("u8","s-sara",260,-400,-120,420,-6)}${ui("u9","s-laith",260,400,60,480,6)}</div>
  <!-- kids / business carousel -->
  <div class="g3" id="g-kb"><div class="g3" id="kb-rot"><div class="g3" style="transform:translate3d(-560px,0,-80px) rotateY(30deg) scale(0.86)">${phone("ph5","kids")}</div><div class="g3" style="transform:translate3d(560px,0,-80px) rotateY(-30deg) scale(0.86)">${phone("ph6","ugc")}</div></div></div>
  <!-- giving card -->
  <div class="g3" id="g-give">${ui("u10","giving",680,0,140,0,0)}</div>
  <div class="g3" id="g-earn">${phone("ph7", "studio-earnings", "", "studio-header")}</div>
</div></div>
<div class="flare" id="flare"></div>
${[0,1,2,3].map(i=>`<div class="streak" id="st${i}"></div>`).join("")}
<div class="kin" id="k1" style="font-size:330px"><span class="bd">نجم</span></div><div class="kin v" id="k2" style="font-size:330px"><span class="bd">العراق</span></div>
<div class="lbl" id="l1" style="top:1500px">IRAQISTAR</div>
<div class="cap" id="c-tag" style="top:1560px"><h1 style="font-size:56px;font-weight:500;color:#a58bff">من نجوم العراق… إليك</h1></div>
<div class="cap" id="c-all" style="top:150px"><h1><span class="bd">كل شي… <span class="v">بمكان واحد</span></span></h1><p><span class="bd">رسائل فيديو، جلسات مباشرة، حصص للأطفال ومحتوى للأعمال</span></p></div>
<div class="kin" id="k3" style="font-size:170px"><span class="bd">صفحتك</span></div><div class="kin v" id="k4" style="font-size:170px"><span class="bd">بسعرك</span></div>
<div class="cap" id="c-wall" style="top:1580px"><h1 style="font-size:52px;font-weight:500"><span class="bd">رسائل · جلسات · حصص · محتوى</span></h1></div>
<div class="notif" id="notif"><div class="row"><span class="mk">${m("")}</span><div><b>طلب جديد · عيد ميلاد</b><small>من عمر، لأخته سارة</small></div><span class="tag">بسعرك</span></div><p>«أختي سارة عيد ميلادها الجمعة… تحبك من سنين. رسالة قصيرة باسمها تخلّي يومها.»</p><div class="btns"><span>أرفض</span><span class="p">أقبل وأسجّل</span></div></div>
<div class="kin" id="k5" style="font-size:118px"><span class="bd">الطلب يوصلك</span></div><div class="kin v" id="k6" style="font-size:118px"><span class="bd">تسجّل بوقتك</span></div><div class="kin" id="k7" style="font-size:118px"><span class="bd">والفيديو يوصل</span></div>
<div class="pct" id="pct">0%</div>
<div class="cap" id="c-pct" style="top:1250px"><h1><span class="bd">سعرك… <span class="v">يوصلك كامل</span></span></h1><p><span class="bd">أرباحك بصفحة وحدة، وتسحبها وقت ما تريد</span></p></div>
<div class="cap" id="c-give" style="top:220px"><h1><span class="bd">وبكل طلب… <span class="v">خير</span></span></h1><p><span class="bd">جزء من كل طلب يروح للأعمال الخيرية بالعراق</span></p></div>
<div class="cap" id="c-ses" style="top:160px"><h1><span class="bd">جلسات مباشرة <span class="v">بوقتك</span></span></h1><p><span class="bd">درس، تدريب أو استشارة، بالمدّة والسعر اللي تختارهم</span></p></div>
<div class="cap" id="c-kb" style="top:160px"><h1><span class="bd">وللأطفال… <span class="v">وللشركات</span></span></h1></div>
<div class="kin" id="e0" style="font-size:250px;top:42%">${m("emk")}</div>
<div class="kin" id="e1" style="font-size:150px;top:50%">إنت <span style="color:#a58bff">نجم</span></div><div class="kin" id="e2" style="font-size:150px;top:50%">بحياة شخص.</div>
<div class="cap" id="e3" style="top:1230px"><h1 style="font-family:Geist;font-size:40px;letter-spacing:.08em;direction:ltr;border:1px solid rgba(165,139,255,.7);border-radius:999px;padding:20px 48px;display:inline-block;font-weight:600">iraqistar.com/apply</h1><p style="margin-top:26px">الانضمام بدعوة خاصة · @iraqistar.iq</p></div>
<div class="vig"></div>
<svg class="grain" width="100%" height="100%"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="1" id="turb"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>
<div class="fade" id="fade"></div></div>`;

// inner script — plain string, no template interpolation, no backticks
const script = String.raw`
var SCALE=__SCALE__, SH=__SH__, DUR=__DUR__;
var clamp=function(x,a,b){return Math.max(a,Math.min(b,x))}, eo=function(x){return 1-Math.pow(1-x,3)}, ei=function(x){return x*x*x}, eio=function(x){return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2}, back=function(x){var c=1.5;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)}, seg=function(t,s,d){return clamp((t-s)/d,0,1)}, hit=function(t,a,l){return t>=a?Math.exp(-(t-a)/l):0}, $=function(id){return document.getElementById(id)};
var HITS=[0.25,0.75,1.25,2.0,3.0,7.6,12.6,17.2,21.0,24.4,25.6,26.8,28.0,33.0,37.6,41.2,42.2,42.9];
function hide(id){$(id).style.opacity=0}
function show(id,o){$(id).style.opacity=o}
function cam(x,y,z,rx,ry){$('cam').style.transform='translate3d('+x+'px,'+y+'px,'+z+'px) rotateX('+rx+'deg) rotateY('+ry+'deg)'}
function group(id,x,y,z,rx,ry,vis){var g=$(id); g.style.transform='translate3d('+x+'px,'+y+'px,'+z+'px) rotateX('+rx+'deg) rotateY('+ry+'deg)'; g.style.visibility=vis?'visible':'hidden'}
function scroll(id,y){$(id+'-pg').style.transform='translateY('+(-y*SCALE)+'px)'}
function refl(id,ry){$(id+'-refl').style.transform='translateX('+(clamp(-ry/40,-1,1)*80).toFixed(0)+'%)'}
function kin(id,t,s,d,hold){var el=$(id); var k=eo(seg(t,s,d)); var o=hold?1-ei(seg(t,s+hold,0.18)):1; el.style.opacity=(clamp(k*3,0,1)*o).toFixed(3); el.style.transform='translateY(-50%) scale('+(1.35-0.35*k).toFixed(3)+')'; el.style.filter='blur('+((1-k)*16).toFixed(1)+'px)'; el.style.letterSpacing=(0.12-0.14*k).toFixed(3)+'em';}
function cap(id,t,s,e){var el=$(id); var k=eo(seg(t,s,0.5)), o=1-eo(seg(t,e-0.3,0.3)); el.style.opacity=(k*o).toFixed(3); el.style.transform='translateY('+((1-k)*26).toFixed(0)+'px)';}
function uiPlace(id,t,s,stag,camx,camy){var el=$(id); var x=+el.dataset.x, y=+el.dataset.y, z=+el.dataset.z, rz=+el.dataset.rz; var k=back(seg(t,s+stag,0.7)); el.style.opacity=clamp(k*3,0,1); el.style.transform='translate3d('+(-el.offsetWidth/2+x*k+camx*z/900).toFixed(0)+'px,'+(-el.offsetHeight/2+y*k+camy*z/900).toFixed(0)+'px,'+(z*k).toFixed(0)+'px) rotateZ('+(rz*k).toFixed(1)+'deg)';}
window.renderAt=function(t){
  $('turb').setAttribute('seed',String(Math.floor(t*24)%40));
  var H=0; HITS.forEach(function(h){H+=hit(t,h,0.16)});
  $('shake').style.transform='translate('+(Math.sin(t*137)*7*H).toFixed(1)+'px,'+(Math.cos(t*91)*5*H).toFixed(1)+'px)';
  $('flare').style.opacity=clamp(H*0.9,0,1).toFixed(3); $('flare').style.transform='scale('+(0.6+H*0.8).toFixed(3)+')';
  $('beam1').style.transform='rotate('+(-28+Math.sin(t*0.4)*6).toFixed(1)+'deg) translateX('+(Math.sin(t*0.3)*200).toFixed(0)+'px)'; $('beam2').style.transform='rotate('+(34+Math.cos(t*0.35)*5).toFixed(1)+'deg) translateY('+(Math.cos(t*0.25)*220).toFixed(0)+'px)';
  $('beam1').style.opacity=(0.35+0.5*H).toFixed(3); $('beam2').style.opacity=(0.25+0.4*H).toFixed(3);
  // streaks on hits
  [0,1,2,3].forEach(function(i){var el=$('st'+i); var last=-9; HITS.forEach(function(h){if(t>=h&&t-h<0.6)last=h;}); if(last<0){el.style.opacity=0;return;} var k=seg(t,last,0.5); el.style.opacity=((1-k)*0.8).toFixed(3); el.style.transform='translate('+(-300+k*2000+i*120).toFixed(0)+'px,'+(300+i*420).toFixed(0)+'px) rotate('+(-18+i*9)+'deg) scaleX('+(0.4+k*1.6).toFixed(2)+')';});
  // defaults
  ['g-hero','g-prof','g-wall','g-req','g-ses','g-kb','g-give','g-earn'].forEach(function(g){$(g).style.visibility='hidden'});
  ['k1','k2','l1','c-tag','c-all','k3','k4','c-wall','notif','k5','k6','k7','pct','c-pct','c-give','c-ses','c-kb','e0','e1','e2','e3'].forEach(hide);
  document.querySelectorAll('.ui').forEach(function(u){u.style.opacity=0});
  cam(0,0,0,0,0);
  // ---- S1 typography 0–3
  if(t<3.0){ kin('k1',t,0.25,0.35,0); kin('k2',t,0.75,0.35,0); $('k1').style.transform='translateY(-50%) translateY(-190px) scale('+(1.35-0.35*eo(seg(t,0.25,0.35))).toFixed(3)+')'; $('k2').style.transform='translateY(-50%) translateY(190px) scale('+(1.35-0.35*eo(seg(t,0.75,0.35))).toFixed(3)+')';
    var out=ei(seg(t,2.6,0.4)); $('k1').style.opacity=(clamp(eo(seg(t,0.25,0.35))*3,0,1)*(1-out)).toFixed(3); $('k2').style.opacity=(clamp(eo(seg(t,0.75,0.35))*3,0,1)*(1-out)).toFixed(3);
    var f=eo(seg(t,1.25,0.4)); $('e0').style.opacity=(f*(1-out)).toFixed(3); $('e0').style.transform='translateY(-50%) translateY(-540px) scale('+(0.3+0.7*back(seg(t,1.25,0.6))).toFixed(3)+') rotate('+((1-f)*90).toFixed(0)+'deg)'; }
  // ---- S2 hero reveal 3–7.6
  if(t>=3.0&&t<7.6){ group('g-hero',0,0,0,0,0,true); var k=eo(seg(t,3.0,2.4)); var ry=70-78*k, z=-2600+2600*k, rx=18-18*k; var drift=Math.sin((t-3)*0.8)*3;
    $('ph1').style.transform='translate3d(0,0,'+z.toFixed(0)+'px) rotateX('+(rx).toFixed(1)+'deg) rotateY('+(ry+drift).toFixed(1)+'deg)'; refl('ph1',ry+drift); scroll('ph1',0);
    var l=eo(seg(t,4.9,0.8)); show('l1',l); $('l1').style.letterSpacing=(0.9-0.48*l).toFixed(3)+'em'; cap('c-tag',t,5.4,7.6); }
  // ---- S3 exploded UI 7.6–12.6
  if(t>=7.6&&t<12.6){ group('g-hero',0,0,0,0,0,true); var k=eo(seg(t,7.6,1.2)); var cx=Math.sin((t-7.6)*0.5)*90, cy=Math.cos((t-7.6)*0.45)*50; cam(cx,cy,-120*k,cy*0.02,-cx*0.03);
    var ry=-8+30*k; $('ph1').style.transform='translate3d(0,60px,'+(-200*k).toFixed(0)+'px) rotateX('+(6*k).toFixed(1)+'deg) rotateY('+ry.toFixed(1)+'deg)'; refl('ph1',ry); scroll('ph1',0);
    ['u6','u1','u2','u3','u4','u5','u7'].forEach(function(u,i){uiPlace(u,t,7.65,i*0.11,cx,cy)}); cap('c-all',t,8.2,12.6); }
  // ---- S4 macro dive 12.6–17.2
  if(t>=12.6&&t<17.2){ group('g-prof',0,0,0,0,0,true); var k=eio(seg(t,12.6,1.6)); var z=1050*k; var px=-40*k, py=140*k; var pan=eio(seg(t,15.0,1.2));
    $('ph2').style.transform='translate3d('+(px+80*pan).toFixed(0)+'px,'+(py).toFixed(0)+'px,'+z.toFixed(0)+'px) rotateY('+(-6+6*k).toFixed(1)+'deg)'; refl('ph2',-6+6*k); scroll('ph2',1780);
    var sw=eo(seg(t,15.0,0.5)); $('ph2-pg2').style.opacity=sw; $('ph2-pg2').style.transform='translateY('+(-(900+80*pan)*SCALE)+'px)'; $('ph2-hdr').style.opacity=1-sw;
    kin('k3',t,13.0,0.35,1.8); kin('k4',t,15.0,0.35,1.9); }
  // ---- S5 phone wall 17.2–21
  if(t>=17.2&&t<21.0){ group('g-wall',0,0,0,0,0,true); var k=eio(seg(t,17.2,3.6)); var x=2400-4800*k; cam(x,0,-500,4,-8+Math.sin(k*Math.PI)*6);
    for(var i=0;i<7;i++){scroll('pw'+i,(i*380)%900); refl('pw'+i,-22);} cap('c-wall',t,17.6,21.0); }
  // ---- S6 request flow 21–28
  if(t>=21.0&&t<28.0){ group('g-req',0,0,0,0,0,true); var k=eo(seg(t,21.0,0.9)); var ry=-30+16*k; $('ph3').style.transform='translate3d(0,120px,'+(-300+100*k).toFixed(0)+'px) rotateX(6deg) rotateY('+ry.toFixed(1)+'deg)'; refl('ph3',ry); scroll('ph3',0);
    var n=back(seg(t,21.4,0.7)); var nout=ei(seg(t,24.4,0.3)); show('notif',clamp(n*3,0,1)*(1-nout)); $('notif').style.transform='translateY('+(-820+120*n+(-nout*300)).toFixed(0)+'px) scale('+(0.8+0.2*n).toFixed(3)+') rotateX('+((1-n)*-40).toFixed(0)+'deg)';
    kin('k5',t,24.4,0.3,0.95); kin('k6',t,25.6,0.3,0.95); kin('k7',t,26.8,0.3,0.95); }
  // ---- S7 money + giving 28–33
  if(t>=28.0&&t<33.0){ group('g-earn',0,0,0,0,0,true); var ke=eo(seg(t,28.0,1.0)); var rye=-22+10*ke; $('ph7').style.transform='translate3d(0,160px,'+(-700+150*ke).toFixed(0)+'px) rotateX(8deg) rotateY('+rye.toFixed(1)+'deg)'; refl('ph7',rye); scroll('ph7',0); $('ph7').style.opacity=(0.55*(1-eo(seg(t,30.6,0.4)))).toFixed(3); $('ph7').style.filter='blur('+(2+3*(1-ke)).toFixed(1)+'px)';
    var k=eio(seg(t,28.0,1.5)); var v=Math.round(100*k); $('pct').textContent=v+'%'; show('pct',eo(seg(t,28.0,0.3))*(1-ei(seg(t,30.8,0.3)))); $('pct').style.transform='translateY(-50%) translateY(-120px) scale('+(0.9+0.1*k).toFixed(3)+')';
    cap('c-pct',t,28.4,31.0);
    if(t>=30.8){ group('g-give',0,0,0,0,0,true); var g=back(seg(t,30.9,0.7)); var u=$('u10'); u.style.opacity=clamp(g*3,0,1); u.style.transform='translate3d(-340px,'+(-160+(1-g)*400).toFixed(0)+'px,'+(300*g).toFixed(0)+'px) rotateX('+((1-g)*30).toFixed(0)+'deg)'; cap('c-give',t,31.1,33.0);} }
  // ---- S8 sessions 33–37.6
  if(t>=33.0&&t<37.6){ group('g-ses',0,0,0,0,0,true); var k=eo(seg(t,33.0,1.0)); var ry=25-25*k+Math.sin((t-33)*0.7)*4; cam(0,0,0,0,0);
    $('ph4').style.transform='translate3d(0,100px,'+(-500+300*k).toFixed(0)+'px) rotateY('+ry.toFixed(1)+'deg)'; refl('ph4',ry); scroll('ph4',1700+eio(seg(t,34.5,1.2))*60);
    uiPlace('u8',t,34.2,0,0,0); uiPlace('u9',t,34.2,0.2,0,0); cap('c-ses',t,33.4,37.6); }
  // ---- S9 kids/business carousel 37.6–41.2
  if(t>=37.6&&t<41.2){ group('g-kb',0,60,-400,0,0,true); var k=eio(seg(t,37.6,3.4)); $('kb-rot').style.transform='rotateY('+(30-60*k).toFixed(1)+'deg)'; scroll('ph5',0); scroll('ph6',0); refl('ph5',28); refl('ph6',-28); cap('c-kb',t,37.9,41.2); }
  // ---- S10 end 41.2–48
  if(t>=41.2){ var f=back(seg(t,41.2,0.7)); show('e0',clamp(f*3,0,1)); $('e0').style.transform='translateY(-50%) translateY(-430px) scale('+(0.3+0.7*f).toFixed(3)+') rotate('+((1-f)*60).toFixed(0)+'deg)';
    kin('e1',t,42.2,0.35,0); $('e1').style.transform='translateY(-50%) translateY(-110px) scale('+(1.35-0.35*eo(seg(t,42.2,0.35))).toFixed(3)+')'; kin('e2',t,42.9,0.35,0); $('e2').style.transform='translateY(-50%) translateY(110px) scale('+(1.35-0.35*eo(seg(t,42.9,0.35))).toFixed(3)+')';
    cap('e3',t,44.0,48.5); }
  $('fade').style.opacity=(ei(seg(t,DUR-0.8,0.8))).toFixed(3);
};`.replace("__SCALE__", SCALE).replace("__SH__", SH).replace("__DUR__", DUR);

const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>${css}</style></head><body>${body}<script>${script}</script></body></html>`;
fs.writeFileSync("reel4.html", html);
const dir = "frames4"; if (!process.env.RESUME) fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }); const p = await b.newPage({ viewport: { width: W, height: H } });
p.on("pageerror", e => console.log("PAGEERR", e.message));
await p.goto("file://" + process.cwd() + "/reel4.html"); await p.evaluate(() => document.fonts.ready);
await p.evaluate(() => Promise.all([...document.images].map(i => i.complete ? 1 : new Promise(r => { i.onload = r; i.onerror = r; }))));
const only = process.argv[2] ? process.argv[2].split(",").map(Number) : null;
for (let f = 0; f < DUR * FPS; f++) { if (only && !only.includes(f)) continue; if (process.env.RESUME && fs.existsSync(`${dir}/${String(f).padStart(4, "0")}.jpg`)) continue; await p.evaluate(t => window.renderAt(t), f / FPS); await p.screenshot({ path: `${dir}/${String(f).padStart(4, "0")}.jpg`, type: "jpeg", quality: 90 }); }
await b.close();
if (!only) execSync(`ffmpeg -v error -y -framerate ${FPS} -i ${dir}/%04d.jpg -c:v libx264 -pix_fmt yuv420p -crf 17 -preset medium -movflags +faststart reel4-silent.mp4`);
console.log("done");
