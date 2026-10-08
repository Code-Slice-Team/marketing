// نجم العراق — «الكلمة الصح» Instagram reel, cut to the Rafoush VO (+0.5 s). 1080x1920, 50 s, dark/violet.
import { chromium } from "playwright"; import fs from "node:fs"; import { execSync } from "node:child_process";
const FPS = 30, W = 1080, H = 1920, DUR = 50.0, O = 0.5;
const MARK = "M12.00 0.80 L14.49 5.99 L19.92 4.08 L18.01 9.51 L23.20 12.00 L18.01 14.49 L19.92 19.92 L14.49 18.01 L12.00 23.20 L9.51 18.01 L4.08 19.92 L5.99 14.49 L0.80 12.00 L5.99 9.51 L4.08 4.08 L9.51 5.99 Z M9.40 8.10 L16.40 12.00 L9.40 15.90 Z";
const mark = cls => `<span class="${cls}"><svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="${MARK}"/></svg></span>`;
const I = (d, cls = "") => `<svg class="ic ${cls}" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${d}</g></svg>`;
const IC = {
  person: `<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>`,
  heart: `<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>`,
  book: `<path d="M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z"/>`,
  sun: `<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>`,
  flag: `<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>`,
  store: `<path d="M3 9l1.5-5h15L21 9M3 9h18M5 9v11h14V9M9 20v-6h6v6"/>`,
  up: `<path d="M12 19V5M5 12l7-7 7 7"/>`,
  party: `<path d="M4 20l4-12 8 8zM14 4l1 2 2 1-2 1-1 2-1-2-2-1 2-1zM19 11l.6 1.4L21 13l-1.4.6L19 15l-.6-1.4L17 13l1.4-.6z"/>`,
  video: `<path d="M4 7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM16 10l5-3v10l-5-3"/>`,
  check: `<path d="m5 12.5 4.5 4.5L19 7.5"/>`,
  msg: `<path d="M4 5h16v11H9l-5 4z"/>`,
  clock: `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>`,
  star: `<path d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.5 9.3l6.1-.7z"/>`,
  cake: `<path d="M4 20h16v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2zM4 16c2 1.5 4-1.5 6 0s4 1.5 6 0 2-1.5 4 0M12 8v4M12 4v1"/>`,
  bolt: `<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>`,
  edit: `<path d="M4 20h4l10-10-4-4L4 16zM13 7l4 4"/>`,
};
const v = x => x + O;
// cards: [id, tab, label, icon, name, [[time, text],...], endTime]  (raw VO times)
const CARDS = [
  ["c0",0,"قبل الامتحان",IC.book,"لـ أحمد",[[8.14,"تعبك ما يضيع…"],[9.41,"والثقة نص النجاح."]],11.49],
  ["c1",0,"بعد يوم ثگيل",IC.sun,"لـ سارة",[[12.93,"الأيام الأحلى جاية،"],[14.44,"صدّگني."]],15.40],
  ["c2",0,"خطوة للهدف",IC.flag,"لـ علي",[[17.12,"كل خطوة صغيرة…"],[18.51,"تقرّب."]],19.37],
  ["c3",1,"افتتاح جديد",IC.store,"لـ أبو محمد",[[20.66,"مبروك المحل الجديد،"],[21.9,"والرزق على الله."]],23.52],
  ["c4",1,"ترقية أو إنجاز",IC.up,"لـ نور",[[24.51,"هالنجاح تعبك،"],[25.6,"وتستاهله."]],26.81],
  ["c5",2,"افتتاح الحفل",IC.party,"للحضور",[[27.94,"هلا بالحضور كلهم…"],[29.44,"والليلة إلكم."]],30.75],
];
const STARTS = [6.69,11.49,15.40,19.37,23.52,26.81];
const TABS = ["تحفيز","تهنئة عمل","مناسبات"];
const SC = [["s1",0,7.2],["s2",7.2,31.25],["s4",31.25,34.2],["s5",34.2,40.1],["s6",40.1,50]];
const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-Regular.ttf);font-weight:400}
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-SemiBold.ttf);font-weight:600}
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-Bold.ttf);font-weight:700}
@font-face{font-family:Geist;src:url(fonts/Geist-Bold.ttf);font-weight:700}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#08080f;color:#fff;font-family:"IBM Plex Sans Arabic",sans-serif;position:relative}
#cam{position:absolute;inset:0;transform-origin:50% 50%}
.bg{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 25%,#1a1040,#08080f 70%)}
.glow{position:absolute;left:50%;top:50%;width:1200px;height:1200px;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,rgba(100,48,240,.28),rgba(100,48,240,0) 60%)}
.scene{position:absolute;inset:0;opacity:0}
.wm{position:absolute;top:70px;left:0;right:0;display:flex;justify-content:center;align-items:center;gap:12px;font-family:Geist;font-weight:700;font-size:26px;letter-spacing:.18em;direction:ltr;color:rgba(255,255,255,.55)}
.wm .m svg{width:30px;height:30px;fill:#a58bff}
.v{color:#a58bff}.pk{color:#ff7a9c}
.ic{width:100%;height:100%}
.big{position:absolute;left:50px;right:50px;top:50%;transform:translateY(-50%);text-align:center;font-size:84px;font-weight:700;line-height:1.35;opacity:0}
.slam{position:absolute;left:0;right:0;top:50%;text-align:center;font-size:230px;font-weight:700;color:#ffd9e4;opacity:0;white-space:nowrap;text-shadow:0 0 60px rgba(255,122,156,.5)}
.row2{position:absolute;left:60px;right:60px;top:1180px;display:flex;flex-direction:column;gap:22px;align-items:center}
.pill{display:flex;align-items:center;gap:20px;background:rgba(255,255,255,.08);border:2px solid rgba(165,139,255,.35);border-radius:999px;padding:18px 36px;font-size:48px;font-weight:700;opacity:0;white-space:nowrap}
.pill i{width:64px;height:64px;border-radius:50%;background:#6430f0;display:grid;place-items:center;flex:none}.pill i .ic{width:38px;height:38px}
/* tabs */
.tabs{position:absolute;left:60px;right:60px;top:330px;display:flex;gap:14px;background:rgba(255,255,255,.06);border-radius:999px;padding:10px;opacity:0}
.tab{flex:1;text-align:center;padding:18px 0;border-radius:999px;font-size:34px;font-weight:700;color:rgba(255,255,255,.55)}
.tab.on{background:#6430f0;color:#fff;box-shadow:0 10px 40px rgba(100,48,240,.5)}
/* template card */
.card{position:absolute;left:60px;right:60px;top:560px;background:#fff;color:#1d1640;border-radius:44px;padding:44px 44px 48px;opacity:0;box-shadow:0 50px 120px rgba(0,0,0,.5);text-align:right}
.card .lab{display:inline-flex;align-items:center;gap:14px;background:#f3f0ff;color:#6430f0;border-radius:999px;padding:12px 26px;font-size:34px;font-weight:700}
.card .lab .ic{width:40px;height:40px}
.card .to{display:inline-block;margin-right:14px;background:#fff0f4;color:#d8366a;border-radius:999px;padding:12px 24px;font-size:30px;font-weight:700}
.card .star{display:flex;align-items:center;gap:18px;margin-top:34px}
.card .av{width:90px;height:90px;border-radius:50%;background:linear-gradient(160deg,#6430f0,#a58bff);display:grid;place-items:center;color:#fff;flex:none;position:relative}.card .av .ic{width:52px;height:52px}
.card .av .dot{position:absolute;right:-4px;bottom:-4px;width:30px;height:30px;border-radius:50%;background:#ff3b5c;border:4px solid #fff}
.card .sn{font-size:28px;color:#6b6590;font-weight:600}.card .sn b{display:block;font-size:32px;color:#1d1640}
.card .q{margin-top:26px;background:#f3f0ff;border-radius:30px;border-top-right-radius:8px;padding:30px 34px;font-size:50px;font-weight:700;line-height:1.5;min-height:230px;color:#1d1640}
.card .q span{display:inline;opacity:0}
.card .q .v{color:#6430f0}
.card .wave{display:flex;gap:6px;align-items:flex-end;height:50px;margin-top:22px;justify-content:center}
.card .wave i{width:8px;border-radius:4px;background:#a58bff;height:12px}
.hearts{position:absolute;inset:0;pointer-events:none}.hearts span{position:absolute;width:64px;height:64px;color:#ff7a9c;opacity:0}
/* s4 phone */
.rec{position:absolute;left:50%;top:420px;width:560px;height:1120px;transform:translateX(-50%);background:#1d1640;border-radius:70px;padding:14px;box-shadow:0 50px 120px rgba(0,0,0,.5);opacity:0}
.rec .cam{position:relative;width:100%;height:100%;border-radius:58px;overflow:hidden;background:radial-gradient(ellipse at 50% 35%,#a58bff,#6430f0 75%)}
.rec .sil{position:absolute;left:50%;bottom:0;width:480px;height:640px;transform:translateX(-50%);color:rgba(255,255,255,.55)}
.rec .bub{position:absolute;left:30px;right:30px;top:110px;background:#fff;color:#1d1640;border-radius:30px;padding:22px 28px;font-size:40px;font-weight:700;text-align:center;opacity:0;box-shadow:0 14px 40px rgba(0,0,0,.25)}
.rec .bub:after{content:"";position:absolute;left:50%;bottom:-16px;width:32px;height:32px;background:#fff;transform:translateX(-50%) rotate(45deg)}
.rec .nm{position:absolute;left:50%;bottom:60px;transform:translateX(-50%);background:rgba(255,255,255,.92);color:#1d1640;border-radius:999px;padding:12px 32px;font-size:34px;font-weight:700;white-space:nowrap}
.h4{position:absolute;left:60px;right:60px;top:200px;text-align:center;font-size:62px;font-weight:700;line-height:1.4;opacity:0}
/* s5 steps */
.h5{position:absolute;left:60px;right:60px;top:330px;text-align:center;font-size:72px;font-weight:700;opacity:0}
.steps{position:absolute;left:60px;right:60px;top:540px;display:flex;flex-direction:column;gap:28px}
.step{display:flex;align-items:center;gap:26px;background:#fff;color:#1d1640;border-radius:36px;padding:28px 34px;opacity:0;text-align:right;box-shadow:0 30px 80px rgba(0,0,0,.4)}
.step .n{width:84px;height:84px;border-radius:50%;background:#6430f0;color:#fff;font-family:Geist;font-weight:700;font-size:42px;display:grid;place-items:center;flex:none;direction:ltr}
.step b{display:block;font-size:44px}.step .sub{display:flex;gap:10px;margin-top:12px;flex-wrap:wrap}
.step .ch{border:2px solid #e2e0ec;border-radius:999px;padding:6px 18px;font-size:26px;font-weight:600;color:#6b6590}.step .ch.on{border-color:#6430f0;background:#f3f0ff;color:#6430f0}
.step .fld{margin-top:12px;background:#f3f0ff;border-radius:16px;padding:10px 18px;font-size:34px;font-weight:700;min-height:60px;color:#1d1640}.step .fld i{display:inline-block;width:3px;height:1em;background:#6430f0;vertical-align:-.15em}
.done{position:absolute;left:50%;top:1500px;transform:translateX(-50%);display:flex;align-items:center;gap:18px;background:#1f9d61;color:#fff;border-radius:999px;padding:18px 44px;font-size:48px;font-weight:700;opacity:0;white-space:nowrap}.done .ic{width:56px;height:56px}
/* s6 sting */
#s6{background:linear-gradient(170deg,#6430f0,#3a148f)}
.logo{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;opacity:0}
.logo .mk{display:inline-block;width:260px;height:260px}.logo .mk svg{width:100%;height:100%;fill:#fff;filter:drop-shadow(0 0 50px rgba(255,255,255,.6))}
.logo .ar{font-size:130px;font-weight:700;line-height:1.1;margin-top:14px;color:#fff}
.logo .en{font-family:Geist;font-weight:700;font-size:40px;letter-spacing:.2em;text-indent:.2em;color:#ffd9e4;direction:ltr;margin-top:10px}
.logo .tagl{margin-top:50px;font-size:74px;font-weight:700;color:#fff;line-height:1.4;padding:0 40px;-webkit-mask-image:linear-gradient(to left,#000 0%,transparent 0%);mask-image:linear-gradient(to left,#000 0%,transparent 0%)}
.logo .links{margin-top:40px;font-family:Geist;font-weight:700;font-size:38px;color:rgba(255,255,255,.9);direction:ltr;opacity:0}
.ringx{position:absolute;left:50%;top:calc(50% - 300px);width:260px;height:260px;border-radius:50%;border:4px solid rgba(255,255,255,.9);transform:translate(-50%,-50%) scale(0);opacity:0;box-shadow:0 0 60px rgba(100,48,240,.8)}
.flash{position:absolute;inset:0;background:#fff;opacity:0}.flashd{position:absolute;inset:0;background:#a58bff;opacity:0}
.fade{position:absolute;inset:0;background:#000;opacity:0}
.grain{position:absolute;inset:-20px;opacity:.05;mix-blend-mode:overlay;pointer-events:none}
</style></head><body><div id="cam"><div class="bg"></div><div class="glow" id="glow"></div>
<div class="scene" id="s1"><div class="wm">${mark("m")}IRAQISTAR</div><div class="big" id="b1">مرات، كل اللي<br>يحتاجه الواحد…</div><div class="slam" id="slam1">كلمة!</div>
  <div class="row2"><div class="pill" id="p0"><i>${I(IC.person)}</i>من الشخص الصح</div><div class="pill" id="p1"><i>${I(IC.clock)}</i>وبالوقت الصح</div></div></div>
<div class="scene" id="s2"><div class="wm">${mark("m")}IRAQISTAR</div><div class="tabs" id="tabs">${TABS.map((t,i)=>`<div class="tab" id="tab${i}">${t}</div>`).join("")}</div>
  ${CARDS.map(([id,tab,lab,ic,name,parts])=>`<div class="card" id="${id}"><div><span class="lab">${I(ic)}${lab}</span><span class="to">${name}</span></div><div class="star"><div class="av">${I(IC.star)}<span class="dot"></span></div><div class="sn"><b>نجمه المفضّل</b>رسالة فيديو · باسمه</div></div><div class="q">${parts.map((p,j)=>`<span id="${id}q${j}">${p[1]} </span>`).join("")}</div><div class="wave">${Array.from({length:28},(_,k)=>`<i data-k="${k}"></i>`).join("")}</div></div>`).join("")}
  <div class="hearts" id="hearts">${Array.from({length:8},(_,i)=>`<span style="left:${120+(i*131)%800}px;top:${1100+(i*77)%300}px">${I(IC.heart)}</span>`).join("")}</div></div>
<div class="scene" id="s4"><div class="wm">${mark("m")}IRAQISTAR</div><div class="h4" id="h4">تخيّل هالكلمات…<br><span class="v">بصوت نجمه المفضّل، وباسمه.</span></div>
  <div class="rec" id="rec"><div class="cam"><svg class="sil" viewBox="0 0 100 100" preserveAspectRatio="xMidYMax slice"><circle cx="50" cy="38" r="17" fill="currentColor"/><path d="M12 100c2-26 17-38 38-38s36 12 38 38Z" fill="currentColor"/></svg><div class="bub" id="bub">هلا أحمد… تعبك ما يضيع</div><div class="nm">إلى: أحمد</div></div></div></div>
<div class="scene" id="s5"><div class="wm">${mark("m")}IRAQISTAR</div><div class="h5" id="h5">بنجم العراق…</div>
  <div class="steps"><div class="step" id="st0"><span class="n">1</span><div><b>تختار المناسبة</b><div class="sub"><span class="ch">عيد ميلاد</span><span class="ch on" id="chm">تحفيز</span><span class="ch">تهنئة عمل</span><span class="ch">مناسبات</span></div></div></div>
    <div class="step" id="st1"><span class="n">2</span><div><b>تختار النموذج</b><div class="sub"><span class="ch on">قبل الامتحان</span><span class="ch">بعد وقت صعب</span><span class="ch">خطوة للهدف</span></div></div></div>
    <div class="step" id="st2"><span class="n">3</span><div style="flex:1"><b>تكتب الاسم</b><div class="fld"><span id="nm"></span><i id="cur"></i></div></div></div></div>
  <div class="done" id="done">${I(IC.check)}والباقي على النجم</div></div>
<div class="scene" id="s6"><div class="ringx" id="rx1"></div><div class="ringx" id="rx2"></div>
  <div class="logo" id="logo"><span class="mk" id="mk"><svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="${MARK}"/></svg></span><div class="ar" id="lar">نجم العراق</div><div class="en" id="len">IRAQISTAR</div><div class="tagl" id="tagl">الكلمة الصح…<br>من الشخص الصح.</div><div class="links" id="links">iraqistar.com · @iraqistar.iq</div></div></div>
<div class="flash" id="flash"></div><div class="flashd" id="flashd"></div>
<svg class="grain" width="100%" height="100%"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="1" id="turb"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>
<div class="fade" id="fade"></div></div><script>
const SC=${JSON.stringify(SC)}, DUR=${DUR}, O=${O}, CARDS=${JSON.stringify(CARDS.map(c=>[c[0],c[1],c[5].map(p=>p[0]),c[6]]))}, STARTS=${JSON.stringify(STARTS)};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)), eo=x=>1-Math.pow(1-x,3), ei=x=>x*x*x, eio=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2, back=x=>{const c=1.7;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)}, seg=(t,s,d)=>clamp((t-s)/d,0,1), hit=(t,a,l)=>t>=a?Math.exp(-(t-a)/l):0, $=id=>document.getElementById(id), v=x=>x+O;
let t_=0, kick=0;
function pop(id,s,d,dy,base){const k=back(seg(t_,s,d)); const el=$(id); el.style.opacity=clamp(k*3,0,1); el.style.transform=(base||'')+' translateY('+((1-Math.min(k,1))*(dy==null?40:dy)).toFixed(0)+'px) scale('+(0.85+0.15*Math.min(k,1.1)).toFixed(3)+')'; if(t_>=s)kick+=hit(t_,s,0.08)*0.02; return k;}
function fadein(id,s,d,dy){const k=eo(seg(t_,s,d)); const el=$(id); el.style.opacity=k; el.style.transform='translateY('+((1-k)*(dy==null?30:dy)).toFixed(0)+'px)'; return k;}
window.renderAt=t=>{ t_=t; kick=0;
  $('turb').setAttribute('seed',String(Math.floor(t*30)%40));
  let fl=0, fld=0;
  SC.forEach(([id,s,e])=>{const on=t>=s&&t<e; $(id).style.opacity=on?1:0; if(s>0&&id!=='s6'){kick+=hit(t,s,0.12)*0.03; fld+=hit(t,s,0.06)*0.35;}});
  $('glow').style.opacity=(0.6+0.4*Math.sin(t*2.5)).toFixed(3);
  // s1 — 0.0 مرات ; 2.90 كلمة! ; 3.74 الشخص الصح ; 5.29 الوقت الصح
  const b1=eo(seg(t,v(0.05),0.5)); $('b1').style.opacity=b1*(1-eo(seg(t,v(2.85),0.2))); $('b1').style.transform=\`translateY(-50%) translateY(\${((1-b1)*30).toFixed(0)}px)\`;
  const sl=back(seg(t,v(2.9),0.32)); $('slam1').style.opacity=clamp(sl*3,0,1); $('slam1').style.transform=\`translateY(-50%) translateY(\${((1-Math.min(sl,1))*80).toFixed(0)}px) scale(\${(0.5+0.5*Math.min(sl,1.1)).toFixed(3)})\`; $('slam1').style.filter=\`blur(\${((1-Math.min(sl,1))*12).toFixed(1)}px)\`; kick+=hit(t,v(2.9),0.12)*0.05; fld+=hit(t,v(2.9),0.08)*0.5;
  pop('p0',v(3.8),0.4,30); pop('p1',v(5.35),0.4,30);
  // s2 — cards
  fadein('tabs',7.2,0.4,-20);
  const curTab = t<v(19.37)?0:(t<v(26.81)?1:2); [0,1,2].forEach(i=>$('tab'+i).classList.toggle('on',i===curTab));
  CARDS.forEach(([id,tab,parts,end],i)=>{const s=v(STARTS[i]), e=v(end); const kin=back(seg(t,s,0.5)); const kout=eo(seg(t,e-0.05,0.3)); const el=$(id); const on=t>=s-0.01&&t<e+0.3; el.style.opacity=on?(clamp(kin*3,0,1)*(1-kout)).toFixed(3):0; el.style.transform=\`translateY(\${((1-Math.min(kin,1))*160-kout*140).toFixed(0)}px) scale(\${(0.9+0.1*Math.min(kin,1.05)-kout*0.05).toFixed(3)})\`; if(t>=s)kick+=hit(t,s,0.1)*0.03;
    parts.forEach((pt,j)=>{const k=eo(seg(t,v(pt),0.35)); const q=$(id+'q'+j); q.style.opacity=k; if(j===parts.length-1&&k>0) q.classList.add('v');});
    const spk=parts.some(pt=>t>=v(pt)&&t<e); Array.from(el.querySelectorAll('.wave i')).forEach((b,k)=>{b.style.height=(spk?(12+30*Math.abs(Math.sin(t*9+k*0.7))*Math.abs(Math.sin(t*3.3+k))):8).toFixed(0)+'px';});
  });
  Array.from($('hearts').children).forEach((h,i)=>{const base=v(29.44); const k=seg(t,base+i*0.08,1.0); h.style.opacity=(k>0&&k<1?Math.sin(k*Math.PI):0).toFixed(3); h.style.transform=\`translateY(\${(-k*300).toFixed(0)}px) scale(\${(0.6+k*0.8).toFixed(2)})\`;});
  // s4 — 30.75 تخيّل هالكلمات
  fadein('h4',v(30.8),0.45); pop('rec',v(31.0),0.55,120,'translateX(-50%)'); $('rec').style.transform=$('rec').style.transform.replace('translateX(-50%)  translateY','translateX(-50%) translateY'); pop('bub',v(32.0),0.4,20);
  // s5 — 33.68 بنجم العراق ; 34.56 تختار المناسبة ; 35.72 النموذج ; ~37.2 الاسم ; ~38.5 الباقي على النجم
  fadein('h5',v(33.7),0.4); pop('st0',v(34.6),0.45,60); pop('st1',v(35.75),0.45,60); pop('st2',v(37.1),0.45,60);
  const NAME='أحمد'; const n1=Math.floor(seg(t,v(37.6),0.7)*NAME.length); $('nm').textContent=NAME.slice(0,n1); $('cur').style.opacity=(t>=v(37.5)&&t<v(38.6)&&Math.floor(t*3)%2)?1:0;
  pop('done',v(38.55),0.45,30,'translateX(-50%)'); $('done').style.transform=$('done').style.transform.replace('translateX(-50%)  translateY','translateX(-50%) translateY'); kick+=hit(t,v(38.55),0.1)*0.03;
  // s6 — 39.62 نجم العراق ; 40.44–43.7 الكلمة الصح من الشخص الصح
  const LG=v(39.65);
  const lg=back(seg(t,LG,0.55)); $('logo').style.opacity=clamp(lg*3,0,1); $('mk').style.transform=\`scale(\${(0.2+0.8*Math.min(lg,1.1)).toFixed(3)}) rotate(\${((1-Math.min(lg,1))*-90).toFixed(1)}deg)\`;
  fadein('lar',LG+0.25,0.4); fadein('len',LG+0.5,0.4);
  const tp=eio(seg(t,v(40.45),2.6)); const x=tp*116-8; const mm=\`linear-gradient(to left,#000 \${x-6}%,#000 \${x}%,transparent \${x+6}%)\`; $('tagl').style.webkitMaskImage=mm; $('tagl').style.maskImage=mm;
  fadein('links',v(44.0),0.5,20);
  [['rx1',LG],['rx2',LG+0.15]].forEach(([id,s])=>{const k=seg(t,s,0.9); const r=$(id); r.style.opacity=(k>0&&k<1?(1-k):0).toFixed(3); r.style.transform=\`translate(-50%,-50%) scale(\${(0.6+k*4).toFixed(3)})\`;});
  fl+=hit(t,LG,0.12)*0.7; kick+=hit(t,LG,0.14)*0.05;
  $('cam').style.transform=\`scale(\${(1+0.012*(t/DUR)+kick*0.6).toFixed(4)})\`;
  $('flash').style.opacity=clamp(fl,0,1).toFixed(3); $('flashd').style.opacity=clamp(fld,0,1).toFixed(3);
  $('fade').style.opacity=ei(seg(t,DUR-0.8,0.8)).toFixed(3);
};
</script></body></html>`;
fs.writeFileSync("words.html", html);
const dir = "frames"; if (!process.argv[2]) fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }); const p = await b.newPage({ viewport: { width: W, height: H } });
p.on("pageerror", e => console.log("PAGEERR", e.message));
await p.goto("file://" + process.cwd() + "/words.html"); await p.evaluate(() => document.fonts.ready);
const only = process.argv[2] ? process.argv[2].split(",").map(Number) : null;
for (let f = 0; f < Math.round(DUR * FPS); f++) { if (only && !only.includes(f)) continue; await p.evaluate(t => window.renderAt(t), f / FPS); await p.screenshot({ path: `${dir}/${String(f).padStart(4, "0")}.jpg`, type: "jpeg", quality: 90 }); }
await b.close();
if (!only) execSync(`ffmpeg -v error -y -framerate ${FPS} -i ${dir}/%04d.jpg -c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium -movflags +faststart words-silent.mp4`);
console.log("done");
