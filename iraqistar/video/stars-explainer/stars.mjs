// نجم العراق — "إنت نجم بحياة شخص" explainer for stars, cut to the Rafoush VO (+0.5 s). 1080x1920, 46 s, flat illustration style.
import { chromium } from "playwright"; import fs from "node:fs"; import { execSync } from "node:child_process";
const FPS = 30, W = 1080, H = 1920, DUR = 46.0;
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
  lock: `<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>`,
  check: `<path d="m5 12.5 4.5 4.5L19 7.5"/>`,
  wallet: `<path d="M3 7a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM16 12h4"/><circle cx="16" cy="13" r="1"/>`,
  clock: `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>`,
  phone: `<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>`,
  cake: `<path d="M4 20h16v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2zM4 16c2 1.5 4-1.5 6 0s4 1.5 6 0 2-1.5 4 0M12 8v4M12 4v1"/>`,
  ring: `<circle cx="12" cy="14" r="6"/><path d="M9 8l3-4 3 4"/>`,
  star: `<path d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.5 9.3l6.1-.7z"/>`,
};
const SC = [["s1",0,1.6,"dark"],["s2",1.6,4.9,"dark"],["s3",4.9,7.4,"dark"],["s4",7.4,12.6,"white"],["s5",12.6,16.8,"white"],["s6",16.8,21.4,"white"],["s7",21.4,25.2,"dark"],["s8",25.2,27.4,"dark"],["s9",27.4,30.4,"white"],["s10",30.4,33.4,"white"],["s11",33.4,39.2,"dark"],["s12",39.2,46,"dark"]];
const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-Regular.ttf);font-weight:400}
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-SemiBold.ttf);font-weight:600}
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-Bold.ttf);font-weight:700}
@font-face{font-family:Geist;src:url(fonts/Geist-Bold.ttf);font-weight:700}
@font-face{font-family:Geist;src:url(fonts/Geist-SemiBold.ttf);font-weight:600}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#08080f;color:#fff;font-family:"IBM Plex Sans Arabic",sans-serif;position:relative}
#cam{position:absolute;inset:0;transform-origin:50% 50%}
.bg{position:absolute;inset:0;background:#08080f}.bg.white{background:#fff}
.glow{position:absolute;left:50%;top:50%;width:1500px;height:1500px;border-radius:50%;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(100,48,240,.35) 0%,rgba(100,48,240,0) 60%);opacity:0}
.scene{position:absolute;inset:0;opacity:0}
.wm{position:absolute;top:80px;left:0;right:0;display:flex;justify-content:center;align-items:center;gap:14px;font-family:Geist;font-weight:700;font-size:30px;letter-spacing:.18em;direction:ltr;color:rgba(247,247,251,.7)}
.wm .m svg{width:34px;height:34px;fill:#a58bff}.wm.dk{color:rgba(12,11,22,.55)}.wm.dk .m svg{fill:#6430f0}
.v{color:#a58bff}.vd{color:#6430f0}
.h{position:absolute;left:60px;right:60px;top:180px;text-align:center;font-size:84px;font-weight:700;line-height:1.25;color:#fff;opacity:0}
.h.dk{color:#0c0b16}
.big{position:absolute;left:60px;right:60px;top:50%;transform:translateY(-50%);text-align:center;font-size:128px;font-weight:700;line-height:1.25;color:#fff;opacity:0}
.ic{width:100%;height:100%}
/* s2 two cards */
.two{position:absolute;left:60px;right:60px;top:50%;transform:translateY(-50%);display:flex;gap:30px;direction:rtl}
.card{flex:1;background:#13121e;border:2px solid rgba(165,139,255,.4);border-radius:40px;padding:44px 30px;text-align:center;opacity:0;will-change:transform}
.card .av{width:220px;height:220px;border-radius:50%;margin:0 auto;display:grid;place-items:center;background:linear-gradient(160deg,#6430f0,#a58bff);color:#fff;position:relative}
.card .av .ic{width:120px;height:120px}
.card .bub{position:absolute;width:64px;height:64px;border-radius:50%;background:#ff7a9c;color:#fff;display:grid;place-items:center;box-shadow:0 10px 30px rgba(255,122,156,.5)}
.card .bub .ic{width:36px;height:36px}
.card .bg2{background:linear-gradient(160deg,#1f9d61,#7bf1a8)}
.card b{display:block;font-size:52px;margin-top:30px}
.card span{display:block;font-size:32px;color:#c9bfff;margin-top:8px;font-weight:600}
.card .badge{display:inline-block;margin-top:22px;background:#08080f;border:1.5px solid rgba(165,139,255,.5);border-radius:999px;padding:8px 24px;font-family:Geist;font-weight:700;font-size:30px;direction:ltr}
/* s4 phone form */
.phone{position:absolute;left:50%;top:50%;width:620px;height:1250px;transform:translate(-50%,-50%);background:#0c0b16;border-radius:80px;padding:16px;box-shadow:0 60px 140px rgba(12,11,22,.3),0 0 0 3px #2a2940;opacity:0}
.phone .scr{position:relative;width:100%;height:100%;border-radius:64px;overflow:hidden;background:#fff;padding:60px 36px;text-align:right;color:#0c0b16}
.scr .tt{font-size:40px;font-weight:700}.scr .st{font-size:26px;color:#4f5368;margin-top:6px}
.scr .lb{font-size:28px;font-weight:600;margin-top:36px;color:#0c0b16}
.scr .chips{display:flex;flex-wrap:wrap;gap:12px;margin-top:14px}
.scr .chip{border:2px solid #e2e0ec;border-radius:999px;padding:10px 22px;font-size:26px;font-weight:600;display:flex;align-items:center;gap:8px}
.scr .chip .ic{width:28px;height:28px;color:#6430f0}
.scr .chip.on{border-color:#6430f0;background:#f3f0ff;color:#6430f0}
.scr .fld{margin-top:14px;background:#f3f0ff;border-radius:18px;padding:18px 22px;font-size:32px;font-weight:600;min-height:76px}
.scr .fld.ta{min-height:170px;font-weight:400;font-size:28px;line-height:1.5;color:#2b2a3a}
.scr .fld i{display:inline-block;width:3px;height:1em;background:#6430f0;vertical-align:-.15em}
.scr .btn{position:absolute;left:36px;right:36px;bottom:50px;background:#6430f0;color:#fff;border-radius:999px;padding:22px 0;text-align:center;font-size:34px;font-weight:700}
.cap{position:absolute;left:60px;right:60px;text-align:center;opacity:0}
.bd{display:inline-block;background:#08080f;color:#fff;border:1.5px solid rgba(165,139,255,.5);border-radius:.5em;padding:.14em .6em .22em;font-size:56px;font-weight:700;box-shadow:0 24px 70px rgba(0,0,0,.35)}
.bd .v{color:#a58bff}
/* s5 pills */
.pills{position:absolute;left:70px;right:70px;top:1060px;display:flex;flex-direction:column;gap:26px}
.pill{display:flex;align-items:center;gap:26px;background:#fff;border:3px solid #6430f0;border-radius:999px;padding:20px 34px;font-size:54px;font-weight:700;color:#0c0b16;box-shadow:0 20px 60px rgba(100,48,240,.18);opacity:0;will-change:transform}
.pill i{width:84px;height:84px;border-radius:50%;background:#6430f0;color:#fff;display:grid;place-items:center;flex:none;font-style:normal}.pill i .ic{width:46px;height:46px}
/* s6 pricing */
.price{position:absolute;left:70px;right:70px;top:520px;background:#fff;border:2px solid #e2e0ec;border-radius:40px;padding:40px 44px;box-shadow:0 30px 90px rgba(12,11,22,.12);opacity:0;text-align:right}
.price .lb{font-size:34px;font-weight:700;color:#0c0b16}.price .sub{font-size:26px;color:#4f5368;margin-top:6px}
.price .row{display:flex;gap:16px;margin-top:22px;flex-wrap:wrap}
.price .pc{border:2px solid #e2e0ec;border-radius:999px;padding:14px 30px;font-family:Geist;font-weight:700;font-size:34px;direction:ltr;color:#0c0b16}
.price .pc.on{background:#6430f0;border-color:#6430f0;color:#fff}
.arrow{position:absolute;left:50%;top:960px;transform:translateX(-50%);width:120px;height:120px;color:#6430f0;opacity:0}
.payout{position:absolute;left:70px;right:70px;top:1100px;text-align:center;opacity:0}
.payout .lb{font-size:44px;font-weight:600;color:#4f5368}
.payout .n{font-family:Geist;font-weight:700;font-size:150px;color:#6430f0;direction:ltr;line-height:1.1}
.payout .ok{display:inline-flex;align-items:center;gap:14px;margin-top:16px;background:#1f9d61;color:#fff;border-radius:999px;padding:12px 36px;font-size:44px;font-weight:700}
.payout .ok .ic{width:44px;height:44px}
/* s7 lock */
.req{position:absolute;left:80px;right:80px;top:600px;background:#13121e;border:2px solid #2a2842;border-radius:40px;padding:40px 44px;text-align:right;opacity:0}
.req .who{display:flex;align-items:center;gap:22px}.req .av{width:92px;height:92px;border-radius:50%;background:#2a2842;display:grid;place-items:center;color:#c9bfff}.req .av .ic{width:50px;height:50px}
.req b{font-size:40px;color:#fff}.req small{display:block;font-size:28px;color:#8f8ba8;margin-top:4px}
.req p{font-size:34px;line-height:1.5;color:rgba(247,247,251,.85);margin-top:26px}
.req .pr{margin-top:26px;font-family:Geist;font-weight:700;font-size:56px;direction:ltr;color:#fff;text-align:left}
.lockb{position:absolute;left:50%;top:430px;transform:translateX(-50%);width:200px;height:200px;border-radius:50%;background:#7bf1a8;color:#0a0a10;display:grid;place-items:center;box-shadow:0 30px 80px rgba(46,204,113,.45);opacity:0}
.lockb .ic{width:110px;height:110px}
.paid{position:absolute;left:50%;top:1180px;transform:translateX(-50%);background:#7bf1a8;color:#05140b;border-radius:999px;padding:16px 46px;font-size:54px;font-weight:700;opacity:0;white-space:nowrap}
/* s8 record */
.rec{position:absolute;left:50%;top:50%;width:620px;height:1250px;transform:translate(-50%,-50%);background:#0c0b16;border-radius:80px;padding:16px;box-shadow:0 0 0 3px #2a2940;opacity:0}
.rec .cam{position:relative;width:100%;height:100%;border-radius:64px;overflow:hidden;background:radial-gradient(ellipse at 50% 35%,#3a2f6b,#13121e 70%)}
.rec .sil{position:absolute;left:50%;bottom:0;width:520px;height:720px;transform:translateX(-50%);color:rgba(165,139,255,.55)}
.rec .top{position:absolute;top:36px;left:0;right:0;display:flex;justify-content:center;align-items:center;gap:14px;font-family:Geist;font-weight:700;font-size:34px;color:#fff;direction:ltr}
.rec .dot{width:22px;height:22px;border-radius:50%;background:#ff3b5c;box-shadow:0 0 20px #ff3b5c}
.rec .btn{position:absolute;left:50%;bottom:60px;transform:translateX(-50%);width:140px;height:140px;border-radius:50%;border:8px solid #fff;display:grid;place-items:center}
.rec .btn i{width:90px;height:90px;border-radius:50%;background:#ff3b5c;display:block}
/* s9 wallet */
.wal{position:absolute;left:80px;right:80px;top:560px;background:#08080f;color:#fff;border-radius:40px;padding:44px 48px;text-align:right;box-shadow:0 40px 100px rgba(12,11,22,.35);opacity:0}
.wal .lb{font-size:32px;color:#c9bfff;font-weight:600}
.wal .n{font-family:Geist;font-weight:700;font-size:96px;direction:ltr;text-align:left;margin-top:8px}
.wal .btn{margin-top:26px;background:#6430f0;color:#fff;border-radius:999px;padding:18px 0;text-align:center;font-size:40px;font-weight:700}
.ring{position:absolute;left:50%;top:1150px;transform:translateX(-50%);width:300px;height:300px;opacity:0}
.ring svg{width:100%;height:100%;transform:rotate(-90deg)}
.ring .t{position:absolute;inset:0;display:grid;place-items:center;font-family:Geist;font-weight:700;font-size:64px;color:#0c0b16;direction:ltr;text-align:center;line-height:1}
.ring .t small{display:block;font-family:"IBM Plex Sans Arabic";font-size:28px;color:#4f5368;font-weight:600;margin-top:4px}
.done{position:absolute;left:50%;top:1500px;transform:translateX(-50%);background:#1f9d61;color:#fff;border-radius:999px;padding:14px 42px;font-size:48px;font-weight:700;opacity:0;white-space:nowrap}
/* s10 ataa */
.atile{position:absolute;left:50%;top:560px;transform:translateX(-50%);width:460px;height:460px;border-radius:70px;background:#fff;display:grid;place-items:center;box-shadow:0 0 0 2px #ddd6ff,0 40px 100px rgba(100,48,240,.25);opacity:0}
.atile img{width:400px;height:400px;object-fit:contain}
.aslg{position:absolute;left:60px;right:60px;top:1100px;text-align:center;font-size:62px;font-weight:700;color:#0c0b16;opacity:0;line-height:1.3}
.aslg .vd{color:#6430f0}
/* s11 cta */
.ctaw{position:absolute;left:60px;right:60px;top:50%;transform:translateY(-50%);text-align:center;opacity:0}
.ctaw .t{font-size:84px;font-weight:700;line-height:1.3}
.ctaw .btn{display:inline-flex;align-items:center;gap:18px;background:#6430f0;color:#fff;border-radius:999px;padding:26px 64px;font-size:60px;font-weight:700;box-shadow:0 0 80px rgba(100,48,240,.7);margin-top:50px}
.ctaw .btn .m svg{width:52px;height:52px;fill:#fff}
.ctaw .link{font-family:Geist;font-weight:600;font-size:46px;color:#a58bff;direction:ltr;margin-top:34px}
.ctaw .free{font-size:38px;color:rgba(247,247,251,.75);margin-top:14px;font-weight:600}
.consts{position:absolute;inset:0;opacity:0}
.consts .m{position:absolute;color:#a58bff}.consts .m svg{width:100%;height:100%;fill:currentColor}
/* s12 sting */
.tagwrap{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;padding:0 40px}
.tag{font-size:118px;font-weight:700;line-height:1.3;color:#fff;white-space:nowrap;text-shadow:0 0 40px rgba(165,139,255,.35);-webkit-mask-image:linear-gradient(to left,#000 0%,#000 0%,transparent 0%);mask-image:linear-gradient(to left,#000 0%,#000 0%,transparent 0%)}
.bar{position:absolute;top:-10%;height:120%;width:14px;background:linear-gradient(to bottom,rgba(165,139,255,0),#fff 40%,#a58bff 60%,rgba(165,139,255,0));border-radius:8px;box-shadow:0 0 60px 18px rgba(100,48,240,.9),0 0 120px 50px rgba(100,48,240,.45);opacity:0}
.slam{position:absolute;left:0;right:0;top:50%;text-align:center;font-size:230px;font-weight:700;color:#a58bff;opacity:0;white-space:nowrap;text-shadow:0 0 60px rgba(100,48,240,.8)}
.logo{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;opacity:0}
.logo .mk{display:inline-block;width:260px;height:260px}.logo .mk svg{width:100%;height:100%;fill:#a58bff;filter:drop-shadow(0 0 50px rgba(100,48,240,.95))}
.logo .ar{font-size:130px;font-weight:700;line-height:1.1;margin-top:20px}
.logo .en{font-family:Geist;font-weight:700;font-size:40px;letter-spacing:.2em;text-indent:.2em;color:#a58bff;direction:ltr;margin-top:14px}
.logo .links{margin-top:34px;font-family:Geist;font-weight:700;font-size:40px;color:rgba(247,247,251,.9);direction:ltr;opacity:0}
.ringx{position:absolute;left:50%;top:calc(50% - 150px);width:260px;height:260px;border-radius:50%;border:4px solid rgba(165,139,255,.9);transform:translate(-50%,-50%) scale(0);opacity:0;box-shadow:0 0 60px rgba(100,48,240,.8)}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 60%,rgba(0,0,0,.35) 100%);opacity:0}
.flash{position:absolute;inset:0;background:#fff;opacity:0}.flashd{position:absolute;inset:0;background:#6430f0;opacity:0}
.fade{position:absolute;inset:0;background:#000;opacity:0}
.grain{position:absolute;inset:-20px;opacity:.07;mix-blend-mode:overlay;pointer-events:none}
</style></head><body><div id="cam"><div class="bg" id="bg"></div><div class="glow" id="glow"></div>
<div class="scene" id="s1"><div class="wm">${mark("m")}IRAQISTAR</div><div class="big" id="hi" style="font-size:150px">هلا بيك</div></div>
<div class="scene" id="s2"><div class="wm">${mark("m")}IRAQISTAR</div><div class="two">
  <div class="card" id="c1"><div class="av">${I(IC.person)}<span class="bub" style="right:-10px;top:-6px">${I(IC.heart)}</span><span class="bub" style="left:-16px;bottom:10px;width:50px;height:50px">${I(IC.heart)}</span></div><b>جمهور يحبّك</b><span>فنان، لاعب، مؤثّر</span><div class="badge">1.8M</div></div>
  <div class="card" id="c2"><div class="av bg2">${I(IC.cap)}</div><b>خبرة تعلّمها</b><span>معلّم، مدرّب، خبير</span><div class="badge" style="font-family:'IBM Plex Sans Arabic'">30 دقيقة</div></div></div></div>
<div class="scene" id="s3"><div class="wm">${mark("m")}IRAQISTAR</div><div class="big" id="b3">إنت <span class="v">نجم</span><br>بحياة شخص.</div></div>
<div class="scene" id="s4"><div class="wm dk">${mark("m")}IRAQISTAR</div><div class="phone" id="ph4"><div class="scr"><div class="tt">اطلب فيديو من نجمك</div><div class="st">اكتب لمنو الرسالة وشنو تحب ينقال بيها.</div>
  <div class="lb">شنو المناسبة؟</div><div class="chips"><span class="chip on" id="oc0">${I(IC.cake)}عيد ميلاد</span><span class="chip">${I(IC.cap)}تخرّج</span><span class="chip">${I(IC.ring)}خطوبة</span><span class="chip">${I(IC.star)}تحفيز</span></div>
  <div class="lb">اسم صاحب المناسبة</div><div class="fld"><span id="nm"></span><i id="cur4"></i></div>
  <div class="lb">شنو تحب ينقال بالرسالة؟</div><div class="fld ta"><span id="msg"></span></div>
  <div class="btn">ادفع وأرسل الطلب</div></div></div>
  <div class="cap" id="cap4" style="top:150px"><span class="bd">رسالة فيديو <span class="v">باسمه</span></span></div></div>
<div class="scene" id="s5"><div class="wm dk">${mark("m")}IRAQISTAR</div><div class="h dk" id="h5">أو يحجزون <span class="vd">جلسة وياك</span></div>
  <div class="cardbig" style="position:absolute;left:50%;top:430px;transform:translateX(-50%);width:420px;height:420px;border-radius:50%;background:linear-gradient(160deg,#6430f0,#a58bff);display:grid;place-items:center;color:#fff"><svg class="ic" style="width:220px;height:220px" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${IC.video}</g></svg></div>
  <div class="pills">${[["أونلاين",IC.video],["جماعية",IC.users],["حضوري",IC.pin]].map(([t,ic],i)=>`<div class="pill" id="pl${i}"><i>${I(ic)}</i>${t}</div>`).join("")}</div></div>
<div class="scene" id="s6"><div class="wm dk">${mark("m")}IRAQISTAR</div><div class="h dk" id="h6">إنت تحدد <span class="vd">سعرك</span></div>
  <div class="price" id="price"><div class="lb">رسالة فيديو شخصية</div><div class="sub">السعر اللي تحدده يوصلك كامل.</div><div class="row">${["25,000","50,000","75,000","100,000"].map((p,i)=>`<span class="pc" id="pc${i}">${p}</span>`).join("")}</div></div>
  <div class="arrow" id="arrow"><svg class="ic" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v16M6 14l6 6 6-6"/></g></svg></div>
  <div class="payout" id="payout"><div class="lb">اللي يوصلك</div><div class="n" id="pn">50,000</div><div class="ok">${I(IC.check)}كامل</div></div></div>
<div class="scene" id="s7"><div class="wm">${mark("m")}IRAQISTAR</div><div class="h" id="h7">ما يوصلك طلب<br><span class="v">قبل ما يندفع</span></div>
  <div class="req" id="req"><div class="who"><div class="av">${I(IC.person)}</div><div><b>أحمد</b><small>طلب جديد · فيديو تهنئة</small></div></div><p>«لأمي بعيد ميلادها… تحب تسمع صوتك»</p><div class="pr">50,000 IQD</div></div>
  <div class="lockb" id="lockb">${I(IC.lock)}</div><div class="paid" id="paid">الدفع محجوز ✓</div></div>
<div class="scene" id="s8"><div class="wm">${mark("m")}IRAQISTAR</div><div class="rec" id="rec"><div class="cam"><svg class="sil" viewBox="0 0 100 100" preserveAspectRatio="xMidYMax slice"><circle cx="50" cy="38" r="17" fill="currentColor"/><path d="M12 100c2-26 17-38 38-38s36 12 38 38Z" fill="currentColor"/></svg><div class="top"><span class="dot" id="dot"></span><span id="tmr">00:00</span></div><div class="btn"><i></i></div></div></div>
  <div class="cap" id="cap8" style="top:150px"><span class="bd">من موبايلك… <span class="v">بلا استوديو</span></span></div></div>
<div class="scene" id="s9"><div class="wm dk">${mark("m")}IRAQISTAR</div><div class="h dk" id="h9">أرباحك توصلك<br><span class="vd">خلال 24 ساعة</span></div>
  <div class="wal" id="wal"><div class="lb">أرباحك المتاحة</div><div class="n" id="wn">270,000 IQD</div><div class="btn" id="wbtn">اسحب</div></div>
  <div class="ring" id="ring"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="none" stroke="#e2e0ec" stroke-width="8"/><circle id="arc" cx="50" cy="50" r="44" fill="none" stroke="#6430f0" stroke-width="8" stroke-linecap="round" stroke-dasharray="276.5" stroke-dashoffset="276.5"/></svg><div class="t"><span id="hrs">24</span><small>ساعة</small></div></div>
  <div class="done" id="done">تم التحويل ✓</div></div>
<div class="scene" id="s10"><div class="wm dk">${mark("m")}IRAQISTAR</div><div class="h dk" id="h10">ومع كل طلب…<br><span class="vd">مساهمة بالخير</span></div><div class="atile" id="atile"><img src="shots/ataa-logo.png"></div><div class="aslg" id="aslg">الناس للناس…<br><span class="vd">معًا نصنع الخير</span></div></div>
<div class="scene" id="s11"><div class="wm">${mark("m")}IRAQISTAR</div><div class="consts" id="consts">${Array.from({length:16},(_,i)=>`<span class="m" style="left:${(i*61)%1000+40}px;top:${(i*173)%1700+100}px;width:${30+(i%4)*12}px;height:${30+(i%4)*12}px;opacity:${0.15+(i%3)*0.12}"><svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="${MARK}"/></svg></span>`).join("")}</div>
  <div class="ctaw" id="ctaw"><div class="t">قدّم طلب الانضمام</div><span class="btn">${mark("m")}انضم كنجم</span><div class="link">iraqistar.com/apply</div><div class="free">التقديم مجاني · ونجومك ينتظرونك</div></div></div>
<div class="scene" id="s12"><div class="tagwrap" id="tw"><div class="tag" id="tg">من نجوم العراق…</div><div class="bar" id="barx"></div></div><div class="slam" id="slam">إليك</div><div class="ringx" id="rx1"></div><div class="ringx" id="rx2"></div>
  <div class="logo" id="logo"><span class="mk" id="mk"><svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="${MARK}"/></svg></span><div class="ar" id="lar">نجم العراق</div><div class="en" id="len">IRAQISTAR</div><div class="links" id="links">iraqistar.com · @iraqistar.iq</div></div></div>
<div class="vig" id="vig"></div><div class="flash" id="flash"></div><div class="flashd" id="flashd"></div>
<svg class="grain" width="100%" height="100%"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="1" id="turb"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>
<div class="fade" id="fade"></div></div><script>
const SC=${JSON.stringify(SC)}, DUR=${DUR};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)), eo=x=>1-Math.pow(1-x,3), ei=x=>x*x*x, eio=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2, back=x=>{const c=1.7;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)}, seg=(t,s,d)=>clamp((t-s)/d,0,1), hit=(t,a,l)=>t>=a?Math.exp(-(t-a)/l):0, $=id=>document.getElementById(id);
function reveal(tagId,barId,p){const el=$(tagId); const x=(p*116-8); const m=\`linear-gradient(to left,#000 \${x-6}%,#000 \${x}%,transparent \${x+6}%)\`; el.style.webkitMaskImage=m; el.style.maskImage=m; const bar=$(barId); const w=el.getBoundingClientRect().width; const left=(el.parentElement.getBoundingClientRect().width-w)/2; bar.style.right=(left+x/100*w)+'px'; bar.style.opacity=(p>0&&p<1?1:0);}
let t_=0;
function pop(id,s,d,dy,base){const k=back(seg(t_,s,d)); const el=$(id); el.style.opacity=clamp(k*3,0,1); el.style.transform=(base||'')+' translateY('+((1-Math.min(k,1))*(dy==null?40:dy)).toFixed(0)+'px) scale('+(0.85+0.15*Math.min(k,1.1)).toFixed(3)+')'; return k;}
function fadein(id,s,d,dy){const k=eo(seg(t_,s,d)); const el=$(id); el.style.opacity=k; el.style.transform='translateY('+((1-k)*(dy==null?30:dy)).toFixed(0)+'px)'; return k;}
const NAME='أحمد', MSG='لأمي بعيد ميلادها… تحب تسمع صوتك';
window.renderAt=t=>{ t_=t;
  $('turb').setAttribute('seed',String(Math.floor(t*30)%40));
  let bg='dark', kick=0, fl=0, fld=0;
  SC.forEach(([id,s,e,mode])=>{const on=t>=s&&t<e; $(id).style.opacity=on?1:0; if(on)bg=mode; if(s>0){kick+=hit(t,s,0.12)*0.03; if(mode==='dark')fld+=hit(t,s,0.06)*0.35; else fl+=hit(t,s,0.08)*0.45;}});
  $('bg').className='bg'+(bg==='white'?' white':''); $('vig').style.opacity=bg==='dark'?1:0; $('glow').style.opacity=bg==='dark'?(0.6+0.4*Math.sin(t*3)).toFixed(3):0;
  // s1 0-1.6
  const h1=back(seg(t,0.35,0.5)); $('hi').style.opacity=clamp(h1*3,0,1); $('hi').style.transform=\`translateY(-50%) scale(\${(0.7+0.3*Math.min(h1,1.1)).toFixed(3)})\`;
  // s2 1.6-4.9 (VO: جمهور ~1.6, خبرة ~3.4)
  [['c1',1.7],['c2',3.4]].forEach(([id,s],i)=>{const k=back(seg(t,s,0.5)); const el=$(id); el.style.opacity=clamp(k*3,0,1); el.style.transform=\`translateX(\${((1-k)*(i?-220:220)).toFixed(0)}px) scale(\${(0.85+0.15*Math.min(k,1.08)).toFixed(3)})\`; if(t>=s)kick+=hit(t,s,0.1)*0.025;});
  // s3 4.9-7.4
  const b3=back(seg(t,4.9,0.45)); $('b3').style.opacity=clamp(b3*3,0,1); $('b3').style.transform=\`translateY(-50%) scale(\${(1.3-0.3*Math.min(b3,1.1)).toFixed(3)})\`; $('b3').style.filter=\`blur(\${((1-Math.min(b3,1))*12).toFixed(1)}px)\`; fld+=hit(t,4.9,0.08)*0.4;
  // s4 7.4-12.6 phone form; name types at 9.2, message at 10.3
  pop('ph4',7.45,0.55,120,'translate(-50%,-50%)'); $('ph4').style.transform=$('ph4').style.transform.replace('translate(-50%,-50%)  translateY','translate(-50%,-50%) translateY');
  const n1=Math.floor(seg(t,9.2,0.7)*NAME.length); $('nm').textContent=NAME.slice(0,n1); $('cur4').style.opacity=(t>=9.2&&t<10.3&&Math.floor(t*3)%2)?1:0;
  const n2=Math.floor(eo(seg(t,10.3,1.6))*MSG.length); $('msg').textContent=MSG.slice(0,n2);
  fadein('cap4',8.0,0.4);
  // s5 12.6-16.8 pills at ~14.1, 14.8, 15.5
  fadein('h5',12.6,0.35);
  [[14.1],[14.8],[15.5]].forEach(([s],i)=>{const k=back(seg(t,s,0.4)); const el=$('pl'+i); el.style.opacity=clamp(k*3,0,1); el.style.transform=\`translateX(\${((1-k)*160).toFixed(0)}px)\`; if(t>=s)kick+=hit(t,s,0.08)*0.025;});
  // s6 16.8-21.4: chips, select 50,000 at 18.0, arrow 19.0, payout 19.4, كامل 20.6
  fadein('h6',16.8,0.35); pop('price',16.9,0.5,60);
  $('pc1').classList.toggle('on',t>=18.0); const sel=hit(t,18.0,0.15); $('pc1').style.transform=\`scale(\${(1+0.12*sel).toFixed(3)})\`;
  const ar=eo(seg(t,19.0,0.3)); $('arrow').style.opacity=ar; $('arrow').style.transform=\`translateX(-50%) translateY(\${((1-ar)*-30).toFixed(0)}px)\`;
  const po=back(seg(t,19.4,0.45)); $('payout').style.opacity=clamp(po*3,0,1); $('payout').style.transform=\`scale(\${(0.8+0.2*Math.min(po,1.1)).toFixed(3)})\`; $('pn').textContent=(Math.round(50000*eo(seg(t,19.4,0.9))/1000)*1000).toLocaleString('en-US');
  $('payout').querySelector('.ok').style.opacity=eo(seg(t,20.6,0.3)); kick+=hit(t,20.6,0.1)*0.03;
  // s7 21.4-25.2: card 21.5, lock 22.6, paid 23.9 (ووقتك محفوظ ~24.0)
  fadein('h7',21.4,0.35); pop('req',21.55,0.5,80);
  const kl=back(seg(t,22.6,0.4)); $('lockb').style.opacity=clamp(kl*3,0,1); $('lockb').style.transform=\`translateX(-50%) scale(\${(2.2-1.2*Math.min(kl,1.12)).toFixed(3)}) rotate(\${((1-Math.min(kl,1))*-25).toFixed(1)}deg)\`; kick+=hit(t,22.6,0.1)*0.035; fld+=hit(t,22.6,0.06)*0.3;
  const kp=back(seg(t,23.9,0.4)); $('paid').style.opacity=clamp(kp*3,0,1); $('paid').style.transform=\`translateX(-50%) scale(\${(0.7+0.3*Math.min(kp,1.1)).toFixed(3)})\`;
  // s8 25.2-27.4 record
  pop('rec',25.25,0.5,100,'translate(-50%,-50%)'); $('rec').style.transform=$('rec').style.transform.replace('translate(-50%,-50%)  translateY','translate(-50%,-50%) translateY');
  const rs=Math.floor(Math.max(0,t-25.6)); $('tmr').textContent='00:'+(rs<10?'0':'')+rs; $('dot').style.opacity=(Math.floor(t*2)%2?1:0.3); fadein('cap8',25.6,0.4);
  // s9 27.4-30.4 wallet; ring at 28.4; done 29.6
  fadein('h9',27.4,0.35); pop('wal',27.5,0.5,70);
  const wb=hit(t,28.3,0.15); $('wbtn').style.transform=\`scale(\${(1-0.08*wb).toFixed(3)})\`;
  const rg=back(seg(t,28.4,0.4)); $('ring').style.opacity=clamp(rg*3,0,1); const rp=eo(seg(t,28.6,1.0)); $('arc').setAttribute('stroke-dashoffset',String((276.5*(1-rp)).toFixed(1))); $('hrs').textContent=String(Math.round(24*rp));
  const dn=back(seg(t,29.6,0.4)); $('done').style.opacity=clamp(dn*3,0,1); $('done').style.transform=\`translateX(-50%) scale(\${(0.7+0.3*Math.min(dn,1.1)).toFixed(3)})\`; kick+=hit(t,29.6,0.1)*0.03;
  // s10 30.4-33.4
  fadein('h10',30.4,0.35); const at=back(seg(t,30.6,0.55)); $('atile').style.opacity=clamp(at*3,0,1); $('atile').style.transform=\`translateX(-50%) scale(\${(0.5+0.5*Math.min(at,1.1)).toFixed(3)}) rotate(\${((1-Math.min(at,1))*-10).toFixed(1)}deg)\`; fadein('aslg',31.6,0.45);
  // s11 33.4-39.2
  $('consts').style.opacity=eo(seg(t,33.4,0.6))*0.9; $('consts').style.transform=\`translateY(\${(-(t-33.4)*12).toFixed(0)}px)\`;
  const cw=back(seg(t,33.6,0.55)); $('ctaw').style.opacity=clamp(cw*3,0,1); $('ctaw').style.transform=\`translateY(-50%) scale(\${(0.8+0.2*Math.min(cw,1.1)).toFixed(3)})\`; kick+=hit(t,33.6,0.1)*0.03;
  // s12 39.2-46: VO "من نجوم العراق" 39.3–40.9, "إليك" 40.8–41.2 ; logo 41.8
  reveal('tg','barx',eio(seg(t,39.25,1.5)));
  const sl=back(seg(t,40.85,0.32)); $('slam').style.opacity=clamp(sl*3,0,1)*(1-eo(seg(t,41.65,0.15))); $('slam').style.transform=\`translateY(\${(150+(1-sl)*80).toFixed(0)}px) scale(\${(0.5+0.5*sl).toFixed(3)})\`; $('slam').style.filter=\`blur(\${((1-Math.min(sl,1))*12).toFixed(1)}px)\`;
  $('tw').style.transform=\`translateY(-50%) translateY(\${(t>=40.85?-120*eo(seg(t,40.85,0.32)):0).toFixed(0)}px)\`; $('tw').style.opacity=(1-eo(seg(t,41.65,0.15))).toFixed(3); kick+=hit(t,40.85,0.12)*0.04; fld+=hit(t,40.85,0.08)*0.5;
  const lg=back(seg(t,41.8,0.55)); $('logo').style.opacity=clamp(lg*3,0,1); $('mk').style.transform=\`scale(\${(0.2+0.8*Math.min(lg,1.1)).toFixed(3)}) rotate(\${((1-Math.min(lg,1))*-90).toFixed(1)}deg)\`;
  fadein('lar',42.1,0.4); fadein('len',42.35,0.4); fadein('links',42.6,0.4,20);
  [['rx1',41.8],['rx2',41.95]].forEach(([id,s])=>{const k=seg(t,s,0.9); const r=$(id); r.style.opacity=(k>0&&k<1?(1-k):0).toFixed(3); r.style.transform=\`translate(-50%,-50%) scale(\${(0.6+k*4).toFixed(3)})\`;});
  fl+=hit(t,41.8,0.12)*0.7; kick+=hit(t,41.8,0.14)*0.05;
  $('cam').style.transform=\`scale(\${(1+0.015*(t/DUR)+kick).toFixed(4)})\`;
  $('flash').style.opacity=clamp(fl,0,1).toFixed(3); $('flashd').style.opacity=clamp(fld,0,1).toFixed(3);
  $('fade').style.opacity=ei(seg(t,DUR-0.7,0.7)).toFixed(3);
};
</script></body></html>`;
fs.writeFileSync("stars.html", html);
const dir = "frames"; if (!process.argv[2]) fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }); const p = await b.newPage({ viewport: { width: W, height: H } });
p.on("pageerror", e => console.log("PAGEERR", e.message));
await p.goto("file://" + process.cwd() + "/stars.html"); await p.evaluate(() => document.fonts.ready);
const only = process.argv[2] ? process.argv[2].split(",").map(Number) : null;
for (let f = 0; f < Math.round(DUR * FPS); f++) { if (only && !only.includes(f)) continue; await p.evaluate(t => window.renderAt(t), f / FPS); await p.screenshot({ path: `${dir}/${String(f).padStart(4, "0")}.jpg`, type: "jpeg", quality: 90 }); }
await b.close();
if (!only) execSync(`ffmpeg -v error -y -framerate ${FPS} -i ${dir}/%04d.jpg -c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium -movflags +faststart stars-silent.mp4`);
console.log("done");
