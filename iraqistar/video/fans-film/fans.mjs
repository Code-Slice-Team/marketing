// نجم العراق — fan-facing brand film, cut to the Rafoush fans VO (+0.5 s). 1920x1080, 108 s, blush/pink palette.
import { chromium } from "playwright"; import fs from "node:fs"; import { execSync } from "node:child_process";
const FPS = 30, W = 1920, H = 1080, DUR = 108.0, O = 0.5;
const MARK = "M12.00 0.80 L14.49 5.99 L19.92 4.08 L18.01 9.51 L23.20 12.00 L18.01 14.49 L19.92 19.92 L14.49 18.01 L12.00 23.20 L9.51 18.01 L4.08 19.92 L5.99 14.49 L0.80 12.00 L5.99 9.51 L4.08 4.08 L9.51 5.99 Z M9.40 8.10 L16.40 12.00 L9.40 15.90 Z";
const mark = cls => `<span class="${cls}"><svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="${MARK}"/></svg></span>`;
const I = (d, cls = "") => `<svg class="ic ${cls}" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${d}</g></svg>`;
const IC = {
  person: `<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>`,
  heart: `<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>`,
  cap: `<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/>`,
  video: `<path d="M4 7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM16 10l5-3v10l-5-3"/>`,
  users: `<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M15 20c0-2.6 1.6-4.6 4-5"/>`,
  pin: `<path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>`,
  check: `<path d="m5 12.5 4.5 4.5L19 7.5"/>`,
  cake: `<path d="M4 20h16v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2zM4 16c2 1.5 4-1.5 6 0s4 1.5 6 0 2-1.5 4 0M12 8v4M12 4v1"/>`,
  ring: `<circle cx="12" cy="14" r="6"/><path d="M9 8l3-4 3 4"/>`,
  star: `<path d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.5 9.3l6.1-.7z"/>`,
  gift: `<rect x="3" y="8" width="18" height="4"/><path d="M5 12v8h14v-8M12 8v12M12 8c-2-4-6-4-6-1.5S10 8 12 8zm0 0c2-4 6-4 6-1.5S14 8 12 8z"/>`,
  msg: `<path d="M4 5h16v11H9l-5 4z"/>`,
  baby: `<circle cx="12" cy="12" r="9"/><path d="M9 10h.01M15 10h.01M9 14c1 1.3 2 2 3 2s2-.7 3-2M12 3c0 2-2 2-2 4"/>`,
  bolt: `<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>`,
  replay: `<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/><path d="M10 9l5 3-5 3z"/>`,
  music: `<path d="M9 18V6l11-2v12"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>`,
  ball: `<circle cx="12" cy="12" r="9"/><path d="M12 3v4l-4 3 1.5 5h5L16 10l-4-3M3.5 10l4.5 0M20.5 10h-4.5M8 21l1.5-6M16 21l-1.5-6"/>`,
  mic: `<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>`,
  tutor: `<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4M7 9h6M7 12h10"/>`,
  whistle: `<circle cx="9" cy="14" r="5"/><path d="M13 11l8-3v4l-7 2"/>`,
  phone: `<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>`,
  undo: `<path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>`,
  smile: `<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>`,
  sparkle: `<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>`,
  download: `<path d="M12 3v12M7 10l5 5 5-5M4 20h16"/>`,
};
const v = x => x + O;
const SC = [["s1",0,12.7],["s2",12.7,16.2],["s3",16.2,26.4],["s4",26.4,38.5],["s5",38.5,49.2],["s6",49.2,63.0],["s7",63.0,78.5],["s8",78.5,87.0],["s9",87.0,92.9],["s10",92.9,100.6],["s11",100.6,108]];
const OCC = [["عيد ميلاد",IC.cake],["خطوبة",IC.ring],["تخرّج",IC.cap],["مولود جديد",IC.baby],["بدون مناسبة",IC.heart]];
const WHY = [["أغنية رافقتنا",IC.music],["مباراة ما نسيناها",IC.ball],["كلمة شجّعتنا نكمّل",IC.bolt]];
const CATS = [["فن",IC.mic],["رياضة",IC.ball],["صنّاع محتوى",IC.video],["تعليم",IC.tutor],["تدريب",IC.whistle]];
const SESS = [["جلسة أونلاين","إنت ونجمك… تسولفون وتسأله",IC.video],["جلسة جماعية","ويا ناس يشاركونك نفس الشغف",IC.users],["لقاء حضوري","حسب المتاح عند كل نجم",IC.pin]];
const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-Regular.ttf);font-weight:400}
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-SemiBold.ttf);font-weight:600}
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-Bold.ttf);font-weight:700}
@font-face{font-family:Geist;src:url(fonts/Geist-Bold.ttf);font-weight:700}
@font-face{font-family:Geist;src:url(fonts/Geist-SemiBold.ttf);font-weight:600}
:root{--ink:#2b1232;--mut:#8a6a84;--pk:#ff5c87;--pkd:#d8366a;--pkl:#ffe3eb;--vi:#6430f0;--gr:#1f9d61;--line:#ffd1dd}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#fff5f8;color:var(--ink);font-family:"IBM Plex Sans Arabic",sans-serif;position:relative}
#cam{position:absolute;inset:0;transform-origin:50% 50%}
.bg{position:absolute;inset:0;background:linear-gradient(160deg,#fff7fa,#ffe6ee)}.bg:after{content:"";position:absolute;left:-200px;top:-300px;width:900px;height:900px;border-radius:50%;background:radial-gradient(circle,rgba(255,92,135,.18),rgba(255,92,135,0) 65%)}.bg:before{content:"";position:absolute;right:-300px;bottom:-400px;width:1100px;height:1100px;border-radius:50%;background:radial-gradient(circle,rgba(100,48,240,.10),rgba(100,48,240,0) 65%)}
#panel{position:absolute;inset:0}
.scene{position:absolute;inset:0;opacity:0}
.wm{position:absolute;top:40px;left:0;right:0;display:flex;justify-content:center;align-items:center;gap:12px;font-family:Geist;font-weight:700;font-size:24px;letter-spacing:.18em;direction:ltr;color:rgba(43,18,50,.5)}
.wm .m svg{width:28px;height:28px;fill:var(--pk)}
.pk{color:var(--pk)}.vi{color:var(--vi)}
.ic{width:100%;height:100%}
.txt{position:absolute;right:90px;width:820px;top:50%;transform:translateY(-50%);text-align:right}
.art{position:absolute;left:90px;width:820px;top:120px;bottom:60px}
.h{font-size:72px;font-weight:700;line-height:1.3;opacity:0}
.h.sm{font-size:46px;color:var(--mut);font-weight:600;margin-top:24px}
.big{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;font-size:140px;font-weight:700;opacity:0;line-height:1.3}
.bd{display:inline-block;background:var(--pk);color:#fff;border-radius:.5em;padding:.14em .6em .22em;font-size:52px;font-weight:700;box-shadow:0 20px 50px rgba(255,92,135,.35);opacity:0}
.bd.g{background:var(--gr);box-shadow:0 20px 50px rgba(31,157,97,.35)}.bd.v{background:var(--vi);box-shadow:0 20px 50px rgba(100,48,240,.35)}
.card{background:#fff;border-radius:36px;box-shadow:0 30px 70px rgba(216,54,106,.14),0 2px 0 var(--line);opacity:0;will-change:transform}
.chip{display:flex;align-items:center;gap:18px;background:#fff;border-radius:999px;padding:18px 32px;font-size:46px;font-weight:700;box-shadow:0 20px 50px rgba(216,54,106,.14),0 2px 0 var(--line);opacity:0;will-change:transform;white-space:nowrap}
.chip i{width:68px;height:68px;border-radius:50%;background:var(--pkl);color:var(--pkd);display:grid;place-items:center;flex:none}.chip i .ic{width:40px;height:40px}
.chip.on i{background:var(--pk);color:#fff}
/* phone */
.phone{position:absolute;left:210px;top:60px;width:400px;height:820px;background:var(--ink);border-radius:56px;padding:12px;box-shadow:0 50px 120px rgba(43,18,50,.3);opacity:0}
.phone .scr{position:relative;width:100%;height:100%;border-radius:46px;overflow:hidden;background:#fff}
.phone .notif{position:absolute;left:14px;right:14px;top:60px;background:#fff;border-radius:22px;padding:14px 16px;display:flex;align-items:center;gap:12px;box-shadow:0 14px 40px rgba(43,18,50,.18);opacity:0;text-align:right}
.phone .notif i{width:48px;height:48px;border-radius:14px;background:var(--pk);color:#fff;display:grid;place-items:center;flex:none}.phone .notif i .ic{width:28px;height:28px}
.phone .notif b{display:block;font-size:20px}.phone .notif span{display:block;font-size:17px;color:var(--mut)}
.phone .vid{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 35%,#ff9db6,#d8366a 75%);opacity:0}
.phone .sil{position:absolute;left:50%;bottom:0;width:360px;height:480px;transform:translateX(-50%);color:rgba(255,255,255,.55)}
.phone .bub{position:absolute;left:24px;right:24px;top:90px;background:#fff;color:var(--ink);border-radius:26px;padding:16px 22px;font-size:30px;font-weight:700;text-align:center;opacity:0;box-shadow:0 14px 40px rgba(43,18,50,.2)}
.phone .bub:after{content:"";position:absolute;left:50%;bottom:-14px;width:28px;height:28px;background:#fff;transform:translateX(-50%) rotate(45deg)}
.phone .nm{position:absolute;left:50%;bottom:40px;transform:translateX(-50%);background:rgba(255,255,255,.92);border-radius:999px;padding:8px 22px;font-size:24px;font-weight:700;color:var(--ink);white-space:nowrap}
.hearts{position:absolute;left:0;top:0;width:820px;height:900px;pointer-events:none}
.hearts span{position:absolute;width:60px;height:60px;color:var(--pk);opacity:0}
.stack{position:absolute;left:60px;top:160px;width:700px;display:flex;flex-direction:column;gap:20px;align-items:flex-end}
/* s3 steps */
.steps{position:absolute;left:60px;top:150px;width:720px;display:flex;flex-direction:column;gap:26px}
.step{display:flex;align-items:center;gap:24px;background:#fff;border-radius:30px;padding:24px 30px;box-shadow:0 20px 50px rgba(216,54,106,.14),0 2px 0 var(--line);opacity:0;will-change:transform;text-align:right}
.step .n{width:70px;height:70px;border-radius:50%;background:var(--pk);color:#fff;font-family:Geist;font-weight:700;font-size:34px;display:grid;place-items:center;flex:none;direction:ltr}
.step b{display:block;font-size:36px}.step span{display:block;font-size:24px;color:var(--mut);margin-top:4px;font-weight:600}
.step .mini{margin-right:auto;display:flex;gap:8px}.step .mini .av{width:56px;height:56px;border-radius:50%;background:var(--pkl);color:var(--pkd);display:grid;place-items:center}.step .mini .av .ic{width:32px;height:32px}
.step.on{outline:3px solid var(--pk)}
/* s4 gift + reaction */
.gift{position:absolute;left:240px;top:230px;width:340px;height:340px;border-radius:50%;background:#fff;display:grid;place-items:center;color:var(--pk);box-shadow:0 30px 70px rgba(216,54,106,.16),0 2px 0 var(--line);opacity:0}.gift .ic{width:190px;height:190px}
.react{position:absolute;left:110px;top:120px;width:600px;padding:30px;text-align:center}
.react .face{width:200px;height:200px;border-radius:50%;background:var(--pkl);color:var(--pkd);display:grid;place-items:center;margin:0 auto}.react .face .ic{width:130px;height:130px}
.react b{display:block;font-size:40px;margin-top:20px}.react span{display:block;font-size:26px;color:var(--mut);margin-top:6px;font-weight:600}
.occ{position:absolute;left:60px;right:60px;top:620px;display:flex;flex-wrap:wrap;gap:18px;justify-content:center}
.occ .chip{font-size:38px;padding:14px 26px}.occ .chip i{width:56px;height:56px}.occ .chip i .ic{width:34px;height:34px}
/* s5 moment */
.keep{position:absolute;left:110px;top:200px;width:600px;padding:34px;text-align:right}
.keep .thumb{height:300px;border-radius:26px;background:radial-gradient(ellipse at 50% 40%,#ff9db6,#d8366a 80%);position:relative;overflow:hidden}
.keep .thumb .sil{position:absolute;left:50%;bottom:0;width:260px;height:300px;transform:translateX(-50%);color:rgba(255,255,255,.55)}
.keep .thumb .rp{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,.92);color:var(--pkd);display:grid;place-items:center}.keep .thumb .rp .ic{width:64px;height:64px}
.keep .row{display:flex;justify-content:space-between;align-items:center;margin-top:22px}
.keep b{font-size:32px}.keep .cnt{font-family:Geist;font-weight:700;font-size:30px;color:var(--pk);direction:ltr;display:flex;align-items:center;gap:8px}.keep .cnt .ic{width:34px;height:34px}
/* s6 sessions */
.srow{position:absolute;left:100px;right:100px;top:330px;display:flex;gap:34px;direction:rtl}
.sc{flex:1;background:#fff;border-radius:40px;padding:40px 28px 40px;text-align:center;opacity:0;will-change:transform;box-shadow:0 30px 70px rgba(216,54,106,.14),0 2px 0 var(--line)}
.sc .av{width:170px;height:170px;border-radius:50%;margin:0 auto;display:grid;place-items:center;background:linear-gradient(160deg,#ff5c87,#ff9db6);color:#fff}.sc .av .ic{width:96px;height:96px}
.sc:nth-child(2) .av{background:linear-gradient(160deg,#6430f0,#a58bff)}.sc:nth-child(3) .av{background:linear-gradient(160deg,#1f9d61,#7bf1a8)}
.sc b{display:block;font-size:46px;margin-top:24px}.sc span{display:block;font-size:28px;color:var(--mut);margin-top:10px;font-weight:600;line-height:1.5}
.hc{position:absolute;left:0;right:0;top:120px;text-align:center;font-size:72px;font-weight:700;opacity:0}
/* s7 why */
.why{position:absolute;left:60px;top:200px;width:720px;display:flex;flex-direction:column;gap:20px;align-items:flex-end}
.cats{position:absolute;left:60px;right:60px;top:780px;display:flex;flex-wrap:wrap;gap:18px;justify-content:center}
/* s8 ataa */
.atile{position:absolute;left:230px;top:200px;width:360px;height:360px;border-radius:64px;background:#fff;display:grid;place-items:center;box-shadow:0 0 0 2px var(--line),0 40px 90px rgba(216,54,106,.2);opacity:0}.atile img{width:310px;height:310px;object-fit:contain}
.ppl{position:absolute;left:120px;top:640px;width:580px;display:flex;justify-content:center;gap:14px}
.ppl span{width:70px;height:70px;border-radius:50%;background:var(--pkl);color:var(--pkd);display:grid;place-items:center;opacity:0}.ppl span .ic{width:40px;height:40px}
/* s9 easy */
.ez{position:absolute;left:110px;top:200px;width:600px;padding:34px;text-align:right}
.ez .row{display:flex;align-items:center;gap:18px}.ez .row i{width:70px;height:70px;border-radius:20px;background:var(--pkl);color:var(--pkd);display:grid;place-items:center;flex:none}.ez .row i .ic{width:40px;height:40px}
.ez b{font-size:34px}.ez .btn{margin-top:26px;background:var(--pk);color:#fff;border-radius:999px;padding:16px 0;text-align:center;font-size:30px;font-weight:700}
.refund{position:absolute;left:150px;top:600px;display:flex;align-items:center;gap:18px;background:var(--gr);color:#fff;border-radius:999px;padding:16px 34px;font-size:36px;font-weight:700;opacity:0;white-space:nowrap}.refund .ic{width:48px;height:48px}
/* s10 cta */
.ctaw{position:absolute;left:60px;right:60px;top:50%;transform:translateY(-50%);text-align:center;opacity:0}
.ctaw .t{font-size:84px;font-weight:700;line-height:1.3}
.ctaw .stores{display:flex;justify-content:center;gap:24px;margin-top:40px}
.ctaw .st{display:inline-flex;align-items:center;gap:14px;background:var(--ink);color:#fff;border-radius:999px;padding:18px 40px;font-family:Geist;font-weight:700;font-size:30px;direction:ltr;opacity:0}.ctaw .st .ic{width:34px;height:34px}
.ctaw .l2{font-size:52px;font-weight:700;margin-top:40px;opacity:0}.ctaw .l3{font-size:52px;font-weight:700;margin-top:10px;opacity:0;color:var(--pkd)}
.consts{position:absolute;inset:0;opacity:0}.consts .m{position:absolute;color:var(--pk)}.consts .m svg{width:100%;height:100%;fill:currentColor}
/* s11 sting (pink) */
#s11{background:linear-gradient(160deg,#ff5c87,#c92a5e)}
.logo{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;opacity:0}
.logo .mk{display:inline-block;width:230px;height:230px}.logo .mk svg{width:100%;height:100%;fill:#fff;filter:drop-shadow(0 0 50px rgba(255,255,255,.6))}
.logo .ar{font-size:120px;font-weight:700;line-height:1.1;margin-top:14px;color:#fff}
.logo .en{font-family:Geist;font-weight:700;font-size:38px;letter-spacing:.2em;text-indent:.2em;color:#ffe3eb;direction:ltr;margin-top:10px}
.logo .tagl{margin-top:30px;font-size:72px;font-weight:700;color:#fff;white-space:nowrap;-webkit-mask-image:linear-gradient(to left,#000 0%,transparent 0%);mask-image:linear-gradient(to left,#000 0%,transparent 0%)}
.logo .links{margin-top:22px;font-family:Geist;font-weight:700;font-size:36px;color:rgba(255,255,255,.9);direction:ltr;opacity:0}
.ringx{position:absolute;left:50%;top:calc(50% - 200px);width:230px;height:230px;border-radius:50%;border:4px solid rgba(255,255,255,.9);transform:translate(-50%,-50%) scale(0);opacity:0;box-shadow:0 0 60px rgba(255,92,135,.8)}
.flash{position:absolute;inset:0;background:#fff;opacity:0}.flashd{position:absolute;inset:0;background:#ff9db6;opacity:0}
.fade{position:absolute;inset:0;background:#000;opacity:0}
.grain{position:absolute;inset:-20px;opacity:.04;mix-blend-mode:overlay;pointer-events:none}
</style></head><body><div id="cam"><div class="bg"></div>
<div id="panel">
<div class="scene" id="s1"><div class="wm">${mark("m")}IRAQISTAR</div>
  <div class="art"><div class="phone" id="ph1"><div class="scr"><div class="notif" id="notif"><i>${I(IC.star)}</i><div><b>نجم العراق</b><span>وصلك فيديو من نجمك!</span></div></div>
    <div class="vid" id="vid1"><svg class="sil" viewBox="0 0 100 100" preserveAspectRatio="xMidYMax slice"><circle cx="50" cy="38" r="17" fill="currentColor"/><path d="M12 100c2-26 17-38 38-38s36 12 38 38Z" fill="currentColor"/></svg><div class="bub" id="bub1">هلا سارة!</div><div class="nm">إلى: سارة</div></div></div></div>
    <div class="hearts" id="hearts1">${Array.from({length:10},(_,i)=>`<span style="left:${160+(i*137)%480}px;top:${120+(i*91)%520}px">${I(IC.heart)}</span>`).join("")}</div></div>
  <div class="txt"><div class="h" id="h1a">تخيّل تفتح موبايلك…<br><span class="pk">وتسمع نجمك يگول اسمك!</span></div>
    <div class="stack" style="position:static;width:auto;margin-top:34px">${[["k0","عيد ميلاد سعيد",IC.cake],["k1","مبروك النجاح",IC.cap],["k2","إنت تگدر",IC.bolt]].map(([id,t,ic])=>`<div class="chip" id="${id}"><i>${I(ic)}</i>${t}</div>`).join("")}</div></div></div>
<div class="scene" id="s2"><div class="wm">${mark("m")}IRAQISTAR</div><div class="big" id="b2"><span id="b2a" style="opacity:0;display:block;font-size:90px;color:var(--mut)">مو فيديو للكل…</span><span id="b2b" style="opacity:0;display:block">فيديو <span class="pk">إلك</span></span><span id="b2c" style="opacity:0;display:block">وباسمك!</span></div></div>
<div class="scene" id="s3"><div class="wm">${mark("m")}IRAQISTAR</div>
  <div class="art"><div class="steps">${[["st0","1","تختار النجم","من الفن والرياضة والمحتوى وأكثر",`<div class="mini"><span class="av">${I(IC.mic)}</span><span class="av">${I(IC.ball)}</span><span class="av">${I(IC.video)}</span></div>`],["st1","2","تكتب المناسبة","وشنو تحب تسمع منه",""],["st2","3","يسجّل لك فيديو خاص","بصوته… وبطلّته",`<div class="mini"><span class="av" style="background:var(--pk);color:#fff">${I(IC.video)}</span></div>`]].map(([id,n,a,b,x])=>`<div class="step" id="${id}"><span class="n">${n}</span><div><b>${a}</b><span>${b}</span></div>${x}</div>`).join("")}</div></div>
  <div class="txt"><div class="h" id="h3a">بنجم العراق،<br><span class="pk">هاللحظة تصير حقيقة.</span></div></div></div>
<div class="scene" id="s4"><div class="wm">${mark("m")}IRAQISTAR</div>
  <div class="art"><div class="gift" id="gift">${I(IC.gift)}</div>
    <div class="card react" id="react"><div class="face">${I(IC.smile)}</div><b>«هذا… يحچي وياي؟!»</b><span>نجمه المفضّل، يباركله باسمه</span></div>
    <div class="hearts" id="hearts4">${Array.from({length:10},(_,i)=>`<span style="left:${100+(i*137)%600}px;top:${100+(i*91)%420}px">${I(IC.heart)}</span>`).join("")}</div></div>
  <div class="txt" id="t4"><div class="h" id="h4a">وإذا الهدية<br><span class="pk">لشخص تحبّه…</span></div><div class="h sm" id="h4b">تخيّل ردّة فعله.</div></div>
  <div class="occ" id="occ">${OCC.map(([t,ic],i)=>`<div class="chip" id="oc${i}"><i>${I(ic)}</i>${t}</div>`).join("")}</div></div>
<div class="scene" id="s5"><div class="wm">${mark("m")}IRAQISTAR</div>
  <div class="art"><div class="card keep" id="keep"><div class="thumb"><svg class="sil" viewBox="0 0 100 100" preserveAspectRatio="xMidYMax slice"><circle cx="50" cy="38" r="17" fill="currentColor"/><path d="M12 100c2-26 17-38 38-38s36 12 38 38Z" fill="currentColor"/></svg><div class="rp">${I(IC.replay)}</div></div><div class="row"><b>فيديو من نجمي ❤</b><div class="cnt">${I(IC.replay)}<span id="rp">1</span>×</div></div></div></div>
  <div class="txt"><div class="h" id="h5a">مرات، كل اللي نريده…<br><span class="pk">نفرّح شخص غالي علينا.</span></div><div class="h sm" id="h5b">وأحلى شي؟</div><div style="margin-top:26px"><span class="bd" id="b5" style="font-size:72px">هاللحظة تبقى!</span></div><div class="h sm" id="h5c">يرجعله كل ما يحب… ويتذكّر منو فرّح قلبه.</div></div></div>
<div class="scene" id="s6"><div class="wm">${mark("m")}IRAQISTAR</div><div class="hc" id="h6">وتگدر <span class="pk">تقرّب أكثر</span></div>
  <div class="srow">${SESS.map(([a,b,ic],i)=>`<div class="sc" id="sc${i}"><div class="av">${I(ic)}</div><b>${a}</b><span>${b}</span></div>`).join("")}</div></div>
<div class="scene" id="s7"><div class="wm">${mark("m")}IRAQISTAR</div>
  <div class="art"><div class="why">${WHY.map(([t,ic],i)=>`<div class="chip" id="wy${i}"><i>${I(ic)}</i>${t}</div>`).join("")}</div></div>
  <div class="txt" id="t7"><div class="h" id="h7a">مرات، ورا إعجابنا بشخص…</div><div class="h" id="h7b" style="margin-top:30px">نجم العراق يجمع ناس<br><span class="pk">إلهم مكان بحياتنا.</span></div></div>
  <div class="cats" id="cats">${CATS.map(([t,ic],i)=>`<div class="chip" id="ct${i}"><i>${I(ic)}</i>${t}</div>`).join("")}</div></div>
<div class="scene" id="s8"><div class="wm">${mark("m")}IRAQISTAR</div>
  <div class="art"><div class="atile" id="atile"><img src="shots/ataa-logo.png"></div><div class="ppl" id="ppl">${Array.from({length:7},()=>`<span>${I(IC.person)}</span>`).join("")}</div></div>
  <div class="txt"><div class="h" id="h8a">ومع كل فرحة،<br>جزء يروح <span class="pk">لعطاء</span></div><div class="h sm" id="h8b">حتى توصل الفرحة لناس أكثر.</div><div class="h" id="h8c" style="margin-top:30px;font-size:60px">الناس للناس…<br><span class="pk">والخير يكبر بيناتنا.</span></div></div></div>
<div class="scene" id="s9"><div class="wm">${mark("m")}IRAQISTAR</div>
  <div class="art"><div class="card ez" id="ez"><div class="row"><i>${I(IC.phone)}</i><b>طلبك… من موبايلك</b></div><div class="row" style="margin-top:18px"><i>${I(IC.sparkle)}</i><b>بدقيقة وحدة</b></div><div class="btn">اطلب فيديو</div></div>
    <div class="refund" id="refund">${I(IC.undo)}ما سجّل؟ يرجعلك المبلغ كامل</div></div>
  <div class="txt"><div class="h" id="h9a">وطلبك <span class="pk">سهل.</span></div><div class="h sm" id="h9b">وإذا النجم ما گدر يسجّل…<br>يرجعلك المبلغ كامل.</div></div></div>
<div class="scene" id="s10"><div class="wm">${mark("m")}IRAQISTAR</div><div class="consts" id="consts">${Array.from({length:22},(_,i)=>`<span class="m" style="left:${(i*163)%1800+40}px;top:${(i*131)%980+60}px;width:${30+(i%4)*12}px;height:${30+(i%4)*12}px;opacity:${0.1+(i%3)*0.08}"><svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="${MARK}"/></svg></span>`).join("")}</div>
  <div class="ctaw" id="ctaw"><div class="t">حمّل تطبيق نجم العراق…<br><span class="pk">واختار نجمك!</span></div><div class="stores"><span class="st" id="sa">${I(IC.download)}App Store</span><span class="st" id="sg">${I(IC.download)}Google Play</span></div><div class="l2" id="l2">إلك، أو لشخص غالي عليك…</div><div class="l3" id="l3">خلّي الفرحة هالمرّة تجي بالاسم.</div></div></div>
</div>
<div class="scene" id="s11"><div class="ringx" id="rx1"></div><div class="ringx" id="rx2"></div>
  <div class="logo" id="logo"><span class="mk" id="mk"><svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="${MARK}"/></svg></span><div class="ar" id="lar">نجم العراق</div><div class="en" id="len">IRAQISTAR</div><div class="tagl" id="tagl">أقرب للي تحبّهم.</div><div class="links" id="links">iraqistar.com · @iraqistar.iq</div></div></div>
<div class="flash" id="flash"></div><div class="flashd" id="flashd"></div>
<svg class="grain" width="100%" height="100%"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="1" id="turb"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>
<div class="fade" id="fade"></div></div><script>
const SC=${JSON.stringify(SC)}, DUR=${DUR}, O=${O};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)), eo=x=>1-Math.pow(1-x,3), ei=x=>x*x*x, eio=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2, back=x=>{const c=1.7;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)}, seg=(t,s,d)=>clamp((t-s)/d,0,1), hit=(t,a,l)=>t>=a?Math.exp(-(t-a)/l):0, $=id=>document.getElementById(id), v=x=>x+O;
let t_=0, kick=0;
function pop(id,s,d,dy,base,out){const k=back(seg(t_,s,d)); const el=$(id); let o=clamp(k*3,0,1); if(out!=null) o*=1-eo(seg(t_,out,0.3)); el.style.opacity=o; el.style.transform=(base||'')+' translateY('+((1-Math.min(k,1))*(dy==null?40:dy)).toFixed(0)+'px) scale('+(0.85+0.15*Math.min(k,1.1)).toFixed(3)+')'; if(t_>=s)kick+=hit(t_,s,0.08)*0.02; return k;}
function fadein(id,s,d,dy,out){const k=eo(seg(t_,s,d)); const el=$(id); let o=k; if(out!=null) o*=1-eo(seg(t_,out,0.3)); el.style.opacity=o; el.style.transform='translateY('+((1-k)*(dy==null?30:dy)).toFixed(0)+'px)'; return k;}
function slide(id,s,d,dx){const k=back(seg(t_,s,d)); const el=$(id); el.style.opacity=clamp(k*3,0,1); el.style.transform=\`translateX(\${((1-Math.min(k,1))*dx).toFixed(0)}px) scale(\${(0.85+0.15*Math.min(k,1.1)).toFixed(3)})\`; if(t_>=s)kick+=hit(t_,s,0.08)*0.02; return k;}
function burst(id,s){Array.from($(id).children).forEach((h,i)=>{const k=seg(t_,s+i*0.06,0.9); h.style.opacity=(k>0&&k<1?Math.sin(k*Math.PI):0).toFixed(3); h.style.transform=\`translateY(\${(-k*160).toFixed(0)}px) scale(\${(0.6+k*0.8).toFixed(2)})\`;});}
window.renderAt=t=>{ t_=t; kick=0;
  $('turb').setAttribute('seed',String(Math.floor(t*30)%40));
  let fl=0, fld=0;
  SC.forEach(([id,s,e])=>{const on=t>=s&&t<e; $(id).style.opacity=on?1:0; if(s>0&&id!=='s11'){kick+=hit(t,s,0.12)*0.03; fl+=hit(t,s,0.08)*0.35;}});
  // s1 — 0.0 تخيّل تفتح موبايلك ; 1.91 وتسمع نجمك ; 4.85 يهنّيك ; 6.54 يباركلك ; 8.39 كلمة تشجيع
  pop('ph1',v(0.05),0.5,80); pop('notif',v(0.6),0.4,-30);
  $('vid1').style.opacity=eo(seg(t,v(1.95),0.35)); pop('bub1',v(2.6),0.4,20); burst('hearts1',v(2.9));
  fadein('h1a',v(1.95),0.45);
  slide('k0',v(4.9),0.4,120); slide('k1',v(6.6),0.4,120); slide('k2',v(8.45),0.4,120);
  // s2 — 12.22 مو فيديو للكل ; 13.47 فيديو إلك ; 14.58 وباسمك
  $('b2').style.opacity=1; fadein('b2a',v(12.25),0.4); const bb=back(seg(t,v(13.5),0.4)); $('b2b').style.opacity=clamp(bb*3,0,1); $('b2b').style.transform=\`scale(\${(0.7+0.3*Math.min(bb,1.1)).toFixed(3)})\`; kick+=hit(t,v(13.5),0.1)*0.03;
  const bc=back(seg(t,v(14.6),0.35)); $('b2c').style.opacity=clamp(bc*3,0,1); $('b2c').style.transform=\`scale(\${(0.6+0.4*Math.min(bc,1.1)).toFixed(3)})\`; kick+=hit(t,v(14.6),0.1)*0.04; fld+=hit(t,v(14.6),0.06)*0.3;
  // s3 — 15.72 بنجم العراق ; 18.60 تختار ; 19.72 تكتب ; 22.20 يسجّل
  fadein('h3a',v(15.8),0.45); [[v(18.65),'st0'],[v(19.8),'st1'],[v(22.25),'st2']].forEach(([s,id],i)=>{slide(id,s,0.45,-120); $(id).classList.toggle('on',t>=s&&t<s+1.4);});
  // s4 — 25.95 وإذا الهدية ; 27.87 تخيّل ردّة فعله ; 32.87 عيد ميلاد… ; 36.66 من غير مناسبة
  pop('gift',v(26.0),0.5,50,'',v(27.85)); fadein('h4a',v(26.05),0.45); pop('react',v(27.95),0.5,80); burst('hearts4',v(28.6)); fadein('h4b',v(28.0),0.4);
  $('t4').style.opacity=(1-eo(seg(t,v(32.6),0.3))).toFixed(3); $('react').style.opacity=String(Math.min(parseFloat($('react').style.opacity||0),1-eo(seg(t,v(32.6),0.3))));
  OCC.forEach((c,i)=>{const s=v(i<4?32.95+i*0.85:36.75); const k=back(seg(t,s,0.4)); const el=$('oc'+i); el.style.opacity=clamp(k*3,0,1); el.style.transform=\`translateY(\${((1-Math.min(k,1))*40).toFixed(0)}px) scale(\${(0.7+0.3*Math.min(k,1.1)).toFixed(3)})\`; if(t>=s)kick+=hit(t,s,0.06)*0.015;}); $('oc4').classList.toggle('on',t>=v(36.75));
  // s5 — 38.33 مرات ; 41.95 وأحلى شي ; 42.82 هاللحظة تبقى ; 44.16 فيديو يرجعله
  fadein('h5a',v(38.4),0.45); fadein('h5b',v(42.0),0.35); const b5=back(seg(t,v(42.85),0.4)); $('b5').style.opacity=clamp(b5*3,0,1); $('b5').style.transform=\`scale(\${(0.6+0.4*Math.min(b5,1.1)).toFixed(3)})\`; kick+=hit(t,v(42.85),0.1)*0.035; fld+=hit(t,v(42.85),0.06)*0.3;
  pop('keep',v(44.2),0.5,80); fadein('h5c',v(44.3),0.4); $('rp').textContent=String(1+Math.floor(eo(seg(t,v(44.8),3.0))*11)); $('keep').querySelector('.rp').style.transform=\`translate(-50%,-50%) scale(\${(1+0.1*Math.sin(t*6)).toFixed(3)})\`;
  // s6 — 48.75 تقرّب ; 50.46 أونلاين ; 55.91 جماعية ; 59.15 حضوري
  fadein('h6',v(48.8),0.45); [v(50.5),v(55.95),v(59.2)].forEach((s,i)=>{const k=back(seg(t,s,0.5)); const el=$('sc'+i); el.style.opacity=clamp(k*3,0,1); el.style.transform=\`translateY(\${((1-Math.min(k,1))*90).toFixed(0)}px) scale(\${(0.85+0.15*Math.min(k,1.1)).toFixed(3)})\`; kick+=hit(t,s,0.1)*0.03;});
  // s7 — 62.43 ورا إعجابنا ; 64.93 أغنية… ; 69.46 يجمع ناس ; 73.45 فن رياضة محتوى ; 76.04 تعليم تدريب
  fadein('h7a',v(62.5),0.45); WHY.forEach((w,i)=>slide('wy'+i,v(65.0+i*1.4),0.4,-120));
  $('t7').style.opacity=1; fadein('h7b',v(69.5),0.45);
  CATS.forEach((c,i)=>{const s=v(i<3?73.5+i*0.75:76.1+(i-3)*0.8); const k=back(seg(t,s,0.4)); const el=$('ct'+i); el.style.opacity=clamp(k*3,0,1); el.style.transform=\`translateY(\${((1-Math.min(k,1))*40).toFixed(0)}px) scale(\${(0.7+0.3*Math.min(k,1.1)).toFixed(3)})\`; if(t>=s)kick+=hit(t,s,0.06)*0.015;});
  ['wy0','wy1','wy2'].forEach(id=>{$(id).style.opacity=String(Math.min(parseFloat($(id).style.opacity||0),1-eo(seg(t,v(73.2),0.3))));}); $('h7a').style.opacity=String(Math.min(parseFloat($('h7a').style.opacity||0),1-eo(seg(t,v(73.2),0.3))));
  // s8 — 78.25 عطاء ; 80.80 ناس أكثر ; 83.43 الناس للناس
  const at=back(seg(t,v(78.3),0.55)); $('atile').style.opacity=clamp(at*3,0,1); $('atile').style.transform=\`scale(\${(0.5+0.5*Math.min(at,1.1)).toFixed(3)}) rotate(\${((1-Math.min(at,1))*-10).toFixed(1)}deg)\`; fadein('h8a',v(78.35),0.45);
  Array.from($('ppl').children).forEach((p,i)=>{const k=back(seg(t,v(80.85)+i*0.12,0.35)); p.style.opacity=clamp(k*3,0,1); p.style.transform=\`translateY(\${((1-Math.min(k,1))*30).toFixed(0)}px)\`;}); fadein('h8b',v(80.9),0.4); fadein('h8c',v(83.5),0.5);
  // s9 — 86.53 طلبك سهل ; 88.60 ما گدر يسجّل
  pop('ez',v(86.6),0.5,80); fadein('h9a',v(86.65),0.4); fadein('h9b',v(88.65),0.4); pop('refund',v(89.6),0.45,30);
  // s10 — 92.45 حمّل ; 95.44 إلك ; 97.52 خلّي الفرحة
  $('consts').style.opacity=eo(seg(t,v(92.5),0.6))*0.9; $('consts').style.transform=\`translateY(\${(-(t-v(92.5))*10).toFixed(0)}px)\`;
  const cw=back(seg(t,v(92.55),0.55)); $('ctaw').style.opacity=clamp(cw*3,0,1); $('ctaw').style.transform=\`translateY(-50%) scale(\${(0.8+0.2*Math.min(cw,1.1)).toFixed(3)})\`; kick+=hit(t,v(92.55),0.1)*0.03;
  pop('sa',v(93.4),0.4,20); pop('sg',v(93.7),0.4,20); fadein('l2',v(95.5),0.4); fadein('l3',v(97.6),0.4);
  // s11 — 100.17 نجم العراق ; 101.41 أقرب للي تحبّهم
  const LG=v(100.2);
  const lg=back(seg(t,LG,0.55)); $('logo').style.opacity=clamp(lg*3,0,1); $('mk').style.transform=\`scale(\${(0.2+0.8*Math.min(lg,1.1)).toFixed(3)}) rotate(\${((1-Math.min(lg,1))*-90).toFixed(1)}deg)\`;
  fadein('lar',LG+0.3,0.4); fadein('len',LG+0.55,0.4);
  const tp=eio(seg(t,v(101.45),1.1)); const x=tp*116-8; const mm=\`linear-gradient(to left,#000 \${x-6}%,#000 \${x}%,transparent \${x+6}%)\`; $('tagl').style.webkitMaskImage=mm; $('tagl').style.maskImage=mm;
  fadein('links',v(102.6),0.4,20);
  [['rx1',LG],['rx2',LG+0.15]].forEach(([id,s])=>{const k=seg(t,s,0.9); const r=$(id); r.style.opacity=(k>0&&k<1?(1-k):0).toFixed(3); r.style.transform=\`translate(-50%,-50%) scale(\${(0.6+k*4).toFixed(3)})\`;});
  fl+=hit(t,LG,0.12)*0.7; kick+=hit(t,LG,0.14)*0.05;
  $('cam').style.transform=\`scale(\${(1+0.01*(t/DUR)+kick*0.6).toFixed(4)})\`; $('panel').style.opacity=(1-eo(seg(t,100.35,0.25))).toFixed(3);
  $('flash').style.opacity=clamp(fl,0,1).toFixed(3); $('flashd').style.opacity=clamp(fld,0,1).toFixed(3);
  $('fade').style.opacity=ei(seg(t,DUR-0.8,0.8)).toFixed(3);
};
const OCC=${JSON.stringify(OCC.map(c=>c[0]))}, WHY=${JSON.stringify(WHY.map(c=>c[0]))}, CATS=${JSON.stringify(CATS.map(c=>c[0]))};
</script></body></html>`;
fs.writeFileSync("fans.html", html);
const dir = "frames"; if (!process.argv[2]) fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }); const p = await b.newPage({ viewport: { width: W, height: H } });
p.on("pageerror", e => console.log("PAGEERR", e.message));
await p.goto("file://" + process.cwd() + "/fans.html"); await p.evaluate(() => document.fonts.ready);
const only = process.argv[2] ? process.argv[2].split(",").map(Number) : null;
for (let f = 0; f < Math.round(DUR * FPS); f++) { if (only && !only.includes(f)) continue; await p.evaluate(t => window.renderAt(t), f / FPS); await p.screenshot({ path: `${dir}/${String(f).padStart(4, "0")}.jpg`, type: "jpeg", quality: 90 }); }
await b.close();
if (!only) execSync(`ffmpeg -v error -y -framerate ${FPS} -i ${dir}/%04d.jpg -c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium -movflags +faststart fans-silent.mp4`);
console.log("done");
