// نجم العراق — «وجهك إلك» star-facing film, cut to the Rafoush VO (+0.5 s). 1080x1920, 56 s. House dark ground, one violet, danger red for the fakes.
import { chromium } from "playwright"; import fs from "node:fs"; import { execSync } from "node:child_process";
const FPS = 30, W = 1080, H = 1920, DUR = 56.0, O = 0.5;
const MARK = "M12.00 0.80 L14.49 5.99 L19.92 4.08 L18.01 9.51 L23.20 12.00 L18.01 14.49 L19.92 19.92 L14.49 18.01 L12.00 23.20 L9.51 18.01 L4.08 19.92 L5.99 14.49 L0.80 12.00 L5.99 9.51 L4.08 4.08 L9.51 5.99 Z M9.40 8.10 L16.40 12.00 L9.40 15.90 Z";
const mark = cls => `<span class="${cls}"><svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="${MARK}"/></svg></span>`;
const I = (d, cls = "") => `<svg class="ic ${cls}" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</g></svg>`;
const SIL = `<svg class="sil" viewBox="0 0 100 100" preserveAspectRatio="xMidYMax slice"><circle cx="50" cy="36" r="18" fill="currentColor"/><path d="M8 100c2-28 18-40 42-40s40 12 42 40Z" fill="currentColor"/></svg>`;
const IC = {
  face: `<circle cx="12" cy="12" r="9"/><path d="M8.5 10h.01M15.5 10h.01M8.5 14.5c1 1.3 2.2 2 3.5 2s2.5-.7 3.5-2"/>`,
  mic: `<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>`,
  video: `<path d="M4 7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM16 10l5-3v10l-5-3"/>`,
  tag: `<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.5"/>`,
  eyeoff: `<path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.1A10 10 0 0 1 12 5c5 0 9 4 10 7-.4 1.1-1.1 2.3-2 3.3M6.6 6.6C4.6 8 3.3 10 2 12c1 3 5 7 10 7 1.6 0 3-.4 4.3-1"/>`,
  q: `<path d="M9 9a3 3 0 1 1 4.5 2.6c-1 .6-1.5 1.2-1.5 2.4M12 18h.01"/>`,
  x: `<path d="M6 6l12 12M18 6L6 18"/>`,
  check: `<path d="m5 12.5 4.5 4.5L19 7.5"/>`,
  shield: `<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="m9 12 2 2 4-4"/>`,
  lock: `<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>`,
  rec: `<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4" fill="currentColor"/>`,
  hand: `<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12M11 6a1.5 1.5 0 0 1 3 0v6M14 8a1.5 1.5 0 0 1 3 0v4M17 10a1.5 1.5 0 0 1 3 0v5a6 6 0 0 1-6 6h-2a6 6 0 0 1-5-2.7L4 14a1.6 1.6 0 0 1 2.6-1.8L8 13.5"/>`,
  wallet: `<path d="M3 7a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM16 12h4"/><circle cx="16" cy="13" r="1"/>`,
  heart: `<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>`,
  users: `<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M15 20c0-2.6 1.6-4.6 4-5"/>`,
  brief: `<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/>`,
  star: `<path d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.5 9.3l6.1-.7z"/>`,
  money: `<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.01M18 12h.01"/>`,
};
const v = x => x + O;
const SC = [["s1",0,19.6],["s2",19.6,22.5],["s3",22.5,38.9],["s4",38.9,48.3],["s5",48.3,56]];
const CLONES = [[-330,-120,0.72,-6],[330,-80,0.8,5],[-300,420,0.66,4],[320,460,0.7,-5],[0,-470,0.6,0],[-120,560,0.55,8]];
const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-Regular.ttf);font-weight:400}
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-SemiBold.ttf);font-weight:600}
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-Bold.ttf);font-weight:700}
@font-face{font-family:Geist;src:url(fonts/Geist-Bold.ttf);font-weight:700}
@font-face{font-family:"Geist Mono";src:url(fonts/Geist-Bold.ttf);font-weight:700}
:root{--ink:#f7f7fb;--pencil:#b3b6cb;--ground:#08080f;--surface:#13121e;--surface2:#1c1b2a;--line:#222133;--acc:#6c3af9;--accink:#a58bff;--danger:#ff6b78}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:var(--ground);color:var(--ink);font-family:"IBM Plex Sans Arabic",sans-serif;position:relative}
#cam{position:absolute;inset:0;transform-origin:50% 50%}
.bg{position:absolute;inset:0;background:var(--ground)}
.bg .g{position:absolute;left:50%;top:46%;width:1400px;height:1400px;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,rgba(108,58,249,.22),rgba(108,58,249,0) 60%);opacity:0}
.bg .r{position:absolute;left:50%;top:46%;width:1400px;height:1400px;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,rgba(255,107,120,.14),rgba(255,107,120,0) 60%);opacity:0}
.scan{position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(255,255,255,.035) 0 2px,transparent 2px 6px);opacity:0;pointer-events:none}
.scene{position:absolute;inset:0;opacity:0}
.wm{position:absolute;top:70px;left:0;right:0;display:flex;justify-content:center;align-items:center;gap:12px;font-family:Geist;font-weight:700;font-size:26px;letter-spacing:.18em;direction:ltr;color:var(--pencil)}
.wm .m svg{width:30px;height:30px;fill:var(--accink)}
.ic{width:100%;height:100%}
.v{color:var(--accink)}.d{color:var(--danger)}
.h{position:absolute;left:60px;right:60px;top:220px;text-align:center;font-size:66px;font-weight:700;line-height:1.35;opacity:0}
.h.lo{font-size:50px;color:var(--pencil);font-weight:600}
/* the star portrait */
.port{position:absolute;left:50%;top:54%;width:420px;height:420px;transform:translate(-50%,-50%);border-radius:50%;overflow:hidden;background:var(--surface2);color:#6b6a85}
.port .sil{position:absolute;left:50%;bottom:0;width:100%;height:100%;transform:translateX(-50%)}
.port.real{color:#c9bfff;background:radial-gradient(circle at 50% 30%,#2a1f5e,#13121e 70%)}
.ring{position:absolute;left:50%;top:54%;width:470px;height:470px;transform:translate(-50%,-50%);border-radius:50%;border:6px solid var(--acc);opacity:0;box-shadow:0 0 60px rgba(108,58,249,.6)}
.vbadge{position:absolute;left:50%;top:calc(54% + 200px);transform:translateX(-50%);display:flex;align-items:center;gap:14px;background:var(--acc);color:#fff;border-radius:999px;padding:14px 34px;font-size:40px;font-weight:700;opacity:0;white-space:nowrap;box-shadow:0 20px 60px rgba(108,58,249,.5)}.vbadge .ic{width:44px;height:44px}
/* clones */
.clone{position:absolute;left:50%;top:54%;width:420px;height:420px;border-radius:50%;overflow:hidden;background:var(--surface);color:#4a4860;opacity:0;outline:3px dashed rgba(255,107,120,.7);outline-offset:-3px}
.clone .sil{position:absolute;left:50%;bottom:0;width:100%;height:100%;transform:translateX(-50%)}
.clone .lb{position:absolute;left:50%;bottom:26px;transform:translateX(-50%);background:var(--danger);color:#1a0a0c;border-radius:999px;padding:6px 20px;font-size:26px;font-weight:700;white-space:nowrap}
.clone .rgb{position:absolute;inset:0;mix-blend-mode:screen;opacity:.5}
.clone .rgb.a{background:rgba(255,0,80,.25);transform:translateX(-6px)}.clone .rgb.b{background:rgba(0,180,255,.25);transform:translateX(6px)}
/* floating fake-site cards */
.site{position:absolute;display:flex;align-items:center;gap:14px;background:var(--surface);border:2px solid var(--line);border-radius:22px;padding:14px 22px;font-family:Geist;font-weight:700;font-size:24px;direction:ltr;color:var(--pencil);opacity:0;white-space:nowrap}
.site i{width:36px;height:36px;border-radius:10px;background:var(--danger);color:#1a0a0c;display:grid;place-items:center;flex:none}.site i .ic{width:22px;height:22px}
.chips{position:absolute;left:60px;right:60px;top:1700px;display:flex;flex-wrap:wrap;gap:16px;justify-content:center}
.chip{display:flex;align-items:center;gap:14px;background:var(--surface);border:2px solid var(--line);border-radius:999px;padding:14px 26px;font-size:36px;font-weight:700;opacity:0;white-space:nowrap}
.chip i{width:52px;height:52px;border-radius:50%;background:var(--surface2);color:var(--pencil);display:grid;place-items:center;flex:none}.chip i .ic{width:30px;height:30px}
.chip.bad{border-color:rgba(255,107,120,.6)}.chip.bad i{background:var(--danger);color:#1a0a0c}
.chip.good{border-color:var(--acc)}.chip.good i{background:var(--acc);color:#fff}
.chip.on{background:var(--acc);border-color:var(--acc);color:#fff}.chip.on i{background:#fff;color:var(--acc)}
/* two-portrait "which is him" */
.pair{position:absolute;left:60px;right:60px;top:560px;display:flex;gap:30px;opacity:0}
.pair .p{flex:1;aspect-ratio:1;border-radius:40px;overflow:hidden;background:var(--surface2);color:#6b6a85;position:relative}
.pair .p .sil{position:absolute;left:50%;bottom:0;width:100%;height:100%;transform:translateX(-50%)}
.pair .p .qq{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:120px;height:120px;border-radius:50%;background:var(--danger);color:#1a0a0c;display:grid;place-items:center;opacity:0}.pair .p .qq .ic{width:80px;height:80px}
.bigq{position:absolute;left:60px;right:60px;top:1120px;text-align:center;font-size:84px;font-weight:700;opacity:0}
.want{position:absolute;left:60px;right:60px;top:1120px;text-align:center;font-size:96px;font-weight:700;opacity:0;color:var(--accink)}
/* s3 cards */
.card{position:absolute;left:60px;right:60px;background:var(--surface);border:2px solid var(--line);border-radius:36px;opacity:0;text-align:right}
.rec3{top:560px;padding:30px 34px;display:flex;align-items:center;gap:24px}
.rec3 .ph{width:150px;height:260px;border-radius:26px;background:radial-gradient(ellipse at 50% 35%,#a58bff,#6c3af9 75%);position:relative;overflow:hidden;flex:none;color:rgba(255,255,255,.6)}
.rec3 .ph .sil{position:absolute;left:50%;bottom:0;width:140px;height:170px;transform:translateX(-50%)}
.rec3 .ph .dot{position:absolute;left:14px;top:14px;width:16px;height:16px;border-radius:50%;background:#ff3b5c;box-shadow:0 0 14px #ff3b5c}
.rec3 b{display:block;font-size:40px}.rec3 small{display:block;font-size:28px;color:var(--pencil);font-weight:600;margin-top:8px;line-height:1.5}
.rec3 .ok{display:inline-flex;align-items:center;gap:10px;margin-top:16px;background:var(--acc);color:#fff;border-radius:999px;padding:8px 20px;font-size:28px;font-weight:700;opacity:0}.rec3 .ok .ic{width:32px;height:32px}
.trip{position:absolute;left:60px;right:60px;top:900px;display:flex;gap:16px;justify-content:center}
.dec{top:1080px;padding:28px 34px}
.dec .lb{font-size:30px;color:var(--pencil);font-weight:600}.dec .row{display:flex;gap:12px;margin-top:14px;flex-wrap:wrap;justify-content:flex-end}
.dec .c{display:flex;align-items:center;gap:10px;border:2px solid var(--line);border-radius:999px;padding:10px 22px;font-size:30px;font-weight:700;color:var(--pencil);opacity:0}.dec .c .ic{width:30px;height:30px}
.dec .c.ok{border-color:#35b774;color:#7bf1a8}.dec .c.no{border-color:var(--danger);color:var(--danger)}.dec .c.pr{border-color:var(--acc);color:#fff;background:var(--acc);font-family:Geist;direction:ltr}
.paid{position:absolute;left:50%;top:1420px;transform:translateX(-50%);display:flex;align-items:center;gap:18px;background:#35b774;color:#06130c;border-radius:999px;padding:18px 40px;font-size:42px;font-weight:700;opacity:0;white-space:nowrap;box-shadow:0 20px 60px rgba(53,183,116,.4)}.paid .ic{width:50px;height:50px}
.nono{position:absolute;left:60px;right:60px;top:1560px;display:flex;gap:16px;justify-content:center}
/* s4 */
.prof{top:520px;padding:30px 34px;display:flex;align-items:center;gap:24px}
.prof .av{width:120px;height:120px;border-radius:50%;background:radial-gradient(circle at 50% 30%,#2a1f5e,#13121e 70%);color:#c9bfff;position:relative;overflow:hidden;flex:none;border:4px solid var(--acc)}.prof .av .sil{position:absolute;left:50%;bottom:0;width:100%;height:100%;transform:translateX(-50%)}
.prof b{display:block;font-size:40px}.prof small{display:block;font-size:28px;color:var(--pencil);font-weight:600;margin-top:6px}
.prof .vb{display:inline-flex;align-items:center;gap:8px;margin-top:12px;background:var(--acc);color:#fff;border-radius:999px;padding:6px 18px;font-size:26px;font-weight:700;opacity:0}.prof .vb .ic{width:28px;height:28px}
.biz{top:840px;padding:30px 34px;display:flex;align-items:center;gap:24px}
.biz .bi{width:110px;height:110px;border-radius:28px;background:var(--surface2);color:var(--accink);display:grid;place-items:center;flex:none}.biz .bi .ic{width:64px;height:64px}
.biz b{display:block;font-size:38px}.biz small{display:block;font-size:28px;color:var(--pencil);font-weight:600;margin-top:6px}
.biz .vb{display:inline-flex;align-items:center;gap:8px;margin-top:12px;background:var(--surface2);border:2px solid var(--acc);color:#fff;border-radius:999px;padding:6px 18px;font-size:26px;font-weight:700;opacity:0}.biz .vb .ic{width:28px;height:28px}
.gains{position:absolute;left:60px;right:60px;top:1180px;display:flex;flex-direction:column;gap:18px;align-items:center}
.gain{display:flex;align-items:center;gap:20px;background:var(--acc);color:#fff;border-radius:999px;padding:18px 40px;font-size:44px;font-weight:700;opacity:0;white-space:nowrap;box-shadow:0 20px 60px rgba(108,58,249,.4)}.gain i{width:60px;height:60px;border-radius:50%;background:#fff;color:var(--acc);display:grid;place-items:center;flex:none}.gain i .ic{width:36px;height:36px}
/* s5 sting */
.logo{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;opacity:0}
.logo .mk{display:inline-block;width:260px;height:260px}.logo .mk svg{width:100%;height:100%;fill:#fff;filter:drop-shadow(0 0 50px rgba(165,139,255,.7))}
.logo .ar{font-size:130px;font-weight:700;line-height:1.1;margin-top:14px;color:#fff}
.logo .en{font-family:Geist;font-weight:700;font-size:40px;letter-spacing:.2em;text-indent:.2em;color:var(--accink);direction:ltr;margin-top:10px}
.logo .tagl{margin-top:50px;font-size:78px;font-weight:700;color:#fff;line-height:1.4;padding:0 40px;-webkit-mask-image:linear-gradient(to left,#000 0%,transparent 0%);mask-image:linear-gradient(to left,#000 0%,transparent 0%)}
.logo .tagl .v{color:var(--accink)}
.logo .links{margin-top:40px;font-family:Geist;font-weight:700;font-size:36px;color:var(--pencil);direction:ltr;opacity:0}
.ringx{position:absolute;left:50%;top:calc(50% - 300px);width:260px;height:260px;border-radius:50%;border:4px solid rgba(165,139,255,.9);transform:translate(-50%,-50%) scale(0);opacity:0;box-shadow:0 0 60px rgba(108,58,249,.8)}
.flash{position:absolute;inset:0;background:#fff;opacity:0}.flashd{position:absolute;inset:0;background:var(--danger);opacity:0}
.fade{position:absolute;inset:0;background:#000;opacity:0}
.grain{position:absolute;inset:-20px;opacity:.06;mix-blend-mode:overlay;pointer-events:none}
</style></head><body><div id="cam"><div class="bg"><div class="g" id="glow"></div><div class="r" id="rglow"></div></div><div class="scan" id="scan"></div>
<div class="scene" id="s1"><div class="wm">${mark("m")}IRAQISTAR</div>
  <div class="h" id="h1a">مواقع وتطبيقات…<br>تاخذ <span class="d">وجهك</span>، <span class="d">صوتك</span>، <span class="d">فيديوهاتك</span></div>
  <div class="port" id="port">${SIL}</div>
  ${CLONES.map(([x,y,s,r],i)=>`<div class="clone" id="cl${i}" style="--x:${x}px;--y:${y}px;--s:${s};--r:${r}deg">${SIL}<div class="rgb a"></div><div class="rgb b"></div><div class="lb">مزيّف</div></div>`).join("")}
  ${[["fake-star.app",-370,-560],["clone-videos.net",330,-520],["ai-faces.io",-350,520],["deep-clips.xyz",340,590]].map(([t,x,y],i)=>`<div class="site" id="st${i}" style="left:calc(50% + ${x}px);top:calc(54% + ${y}px);transform:translate(-50%,-50%)"><i>${I(IC.x)}</i>${t}</div>`).join("")}
  <div class="chips"><div class="chip bad" id="c1a"><i>${I(IC.tag)}</i>يبيعون اسمك</div><div class="chip bad" id="c1b"><i>${I(IC.eyeoff)}</i>وإنت ما تدري</div></div>
  <div class="pair" id="pair"><div class="p">${SIL}<div class="qq" id="q0">${I(IC.q)}</div></div><div class="p">${SIL}<div class="qq" id="q1">${I(IC.q)}</div></div></div>
  <div class="bigq" id="bigq">هذا هو… <span class="d">لو مو هو؟</span></div>
  <div class="h" id="h1b" style="top:560px">الناس <span class="d">زهگت</span> من المصنوع.</div><div class="want" id="want">تريد الحقيقي.</div></div>
<div class="scene" id="s2"><div class="wm">${mark("m")}IRAQISTAR</div><div class="h" id="h2">نجم العراق<br><span class="v">يرجّع الأمور لمكانها.</span></div>
  <div class="port real" id="port2">${SIL}</div><div class="ring" id="ring2"></div><div class="vbadge" id="vb2">${I(IC.shield)}حقيقي</div></div>
<div class="scene" id="s3"><div class="wm">${mark("m")}IRAQISTAR</div><div class="h" id="h3">ما ينطلع فيديو باسمك…<br><span class="v">إلا إذا إنت سجّلته.</span></div>
  <div class="card rec3" id="rec3"><div class="ph"><span class="dot"></span>${SIL}</div><div><b>فيديو باسمك</b><small>سجّلته بنفسك، من موبايلك</small><span class="ok" id="ok3">${I(IC.check)}من إنت</span></div></div>
  <div class="trip"><div class="chip good" id="t0"><i>${I(IC.mic)}</i>بصوتك</div><div class="chip good" id="t1"><i>${I(IC.face)}</i>بوجهك</div><div class="chip good" id="t2"><i>${I(IC.hand)}</i>وبقرارك</div></div>
  <div class="card dec" id="dec"><div class="lb">طلب جديد · إنت تقرّر</div><div class="row"><span class="c ok" id="d0">${I(IC.check)}أقبل</span><span class="c no" id="d1">${I(IC.x)}أرفض</span><span class="c pr" id="d2">50,000 IQD</span></div></div>
  <div class="paid" id="paid">${I(IC.lock)}مدفوع مقدّماً</div>
  <div class="nono"><div class="chip bad" id="n0"><i>${I(IC.x)}</i>ماكو شغل ببلاش</div><div class="chip bad" id="n1"><i>${I(IC.x)}</i>ماكو واحد يستغلّك</div></div></div>
<div class="scene" id="s4"><div class="wm">${mark("m")}IRAQISTAR</div><div class="h" id="h4">جمهورك يعرف وين يلگاك…<br><span class="v">حقيقي.</span></div>
  <div class="card prof" id="prof"><div class="av">${SIL}</div><div><b>نجمك المفضّل</b><small>الملف الرسمي · iraqistar.com</small><span class="vb" id="vb4">${I(IC.shield)}نجم موثّق</span></div></div>
  <div class="card biz" id="biz"><div class="bi">${I(IC.brief)}</div><div><b>طلب من شركة</b><small>عربون مدفوع · عرض سعر</small><span class="vb" id="vb5">${I(IC.check)}رسمي</span></div></div>
  <div class="gains"><div class="gain" id="g0"><i>${I(IC.money)}</i>تكسب فلوس</div><div class="gain" id="g1"><i>${I(IC.heart)}</i>تكسب ثقة</div><div class="gain" id="g2"><i>${I(IC.star)}</i>وتحافظ على اسمك</div></div></div>
<div class="scene" id="s5"><div class="ringx" id="rx1"></div><div class="ringx" id="rx2"></div>
  <div class="logo" id="logo"><span class="mk" id="mk"><svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="${MARK}"/></svg></span><div class="ar" id="lar">نجم العراق</div><div class="en" id="len">IRAQISTAR</div><div class="tagl" id="tagl">وجهك <span class="v">إلك</span>…<br>وصوتك <span class="v">إلك</span>.</div><div class="links" id="links">iraqistar.com/apply · @iraqistar.iq</div></div></div>
<div class="flash" id="flash"></div><div class="flashd" id="flashd"></div>
<svg class="grain" width="100%" height="100%"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="1" id="turb"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>
<div class="fade" id="fade"></div></div><script>
const SC=${JSON.stringify(SC)}, DUR=${DUR}, O=${O}, CL=${JSON.stringify(CLONES)};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)), eo=x=>1-Math.pow(1-x,3), ei=x=>x*x*x, eio=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2, back=x=>{const c=1.7;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)}, seg=(t,s,d)=>clamp((t-s)/d,0,1), hit=(t,a,l)=>t>=a?Math.exp(-(t-a)/l):0, $=id=>document.getElementById(id), v=x=>x+O;
let t_=0, kick=0;
function pop(id,s,d,dy,base){const k=back(seg(t_,s,d)); const el=$(id); el.style.opacity=clamp(k*3,0,1); el.style.transform=(base||'')+' translateY('+((1-Math.min(k,1))*(dy==null?40:dy)).toFixed(0)+'px) scale('+(0.85+0.15*Math.min(k,1.1)).toFixed(3)+')'; if(t_>=s)kick+=hit(t_,s,0.08)*0.02; return k;}
function fadein(id,s,d,dy){const k=eo(seg(t_,s,d)); const el=$(id); el.style.opacity=k; el.style.transform='translateY('+((1-k)*(dy==null?30:dy)).toFixed(0)+'px)'; return k;}
function jit(t,i,a){return Math.sin(t*23+i*7)*a*(Math.sin(t*5.3+i)>0.6?1:0.15);}
window.renderAt=t=>{ t_=t; kick=0;
  $('turb').setAttribute('seed',String(Math.floor(t*30)%40));
  let fl=0, fld=0;
  SC.forEach(([id,s,e])=>{const on=t>=s&&t<e; $(id).style.opacity=on?1:0; if(s>0&&id!=='s5')kick+=hit(t,s,0.12)*0.03;});
  const problem=t<19.6;
  $('rglow').style.opacity=problem?(0.5+0.5*Math.sin(t*3)).toFixed(3)*1*eo(seg(t,v(3.6),1.0)):0; $('glow').style.opacity=problem?0:(0.7+0.3*Math.sin(t*2.5)).toFixed(3);
  $('scan').style.opacity=problem?(0.5+0.5*(Math.sin(t*9)>0.3)).toFixed(2)*0.8:0;
  // s1 — 0.0 مرحبا ; 1.08 مواقع وتطبيقات ; 3.65 تاخذ وجهك/صوتك/فيديوهاتك ; 9.04 يبيعون اسمك ; 10.44 ما تدري ; 11.57 جمهورك يحتار ; 13.86 هذا هو ; 14.82 لو مو هو ; 15.87 زهگت ; 17.84 تريد الحقيقي
  const p1=t<v(11.5);
  pop('port',v(0.1),0.6,0,'translate(-50%,-50%)'); $('port').style.transform=$('port').style.transform.replace('translate(-50%,-50%)  translateY','translate(-50%,-50%) translateY'); if(!p1)$('port').style.opacity=String(1-eo(seg(t,v(11.5),0.3)));
  fadein('h1a',v(1.15),0.45); if(!p1)$('h1a').style.opacity=String(Math.max(0,parseFloat($('h1a').style.opacity)*(1-eo(seg(t,v(11.5),0.3)))));
  CL.forEach(([x,y,s,r],i)=>{const st=v(3.7+i*0.55); const k=back(seg(t,st,0.35)); const el=$('cl'+i); let o=clamp(k*3,0,1)*(0.55+0.45*(Math.sin(t*13+i*3)>-0.2?1:0.3)); if(!p1)o*=1-eo(seg(t,v(11.5),0.3)); el.style.opacity=o.toFixed(3); el.style.transform=\`translate(-50%,-50%) translate(\${(x*Math.min(k,1)+jit(t,i,14)).toFixed(0)}px,\${(y*Math.min(k,1)).toFixed(0)}px) scale(\${(s*(0.6+0.4*Math.min(k,1))).toFixed(3)}) rotate(\${r}deg)\`; if(t>=st)fld+=hit(t,st,0.05)*0.12;});
  [0,1,2,3].forEach(i=>{const st=v(6.4+i*0.5); const k=back(seg(t,st,0.35)); const el=$('st'+i); let o=clamp(k*3,0,1); if(!p1)o*=1-eo(seg(t,v(11.5),0.3)); el.style.opacity=o.toFixed(3); el.style.transform=\`translate(-50%,-50%) translateY(\${((1-Math.min(k,1))*30+jit(t,i+9,6)).toFixed(0)}px)\`;});
  pop('c1a',v(9.1),0.4,30); pop('c1b',v(10.5),0.4,30); ['c1a','c1b'].forEach(id=>{if(!p1)$(id).style.opacity=String(Math.max(0,parseFloat($(id).style.opacity)*(1-eo(seg(t,v(11.5),0.3)))));});
  // which is him
  const p2=t>=v(11.5)&&t<v(15.8);
  const pk=back(seg(t,v(11.6),0.5)); $('pair').style.opacity=(p2?clamp(pk*3,0,1):0).toFixed(3); $('pair').style.transform=\`translateY(\${((1-Math.min(pk,1))*60).toFixed(0)}px)\`;
  $('q0').style.opacity=(p2&&t>=v(13.9)?1:0); $('q1').style.opacity=(p2&&t>=v(14.85)?1:0); $('q0').style.transform=\`translate(-50%,-50%) scale(\${(1+0.15*hit(t,v(13.9),0.15)).toFixed(3)})\`; $('q1').style.transform=\`translate(-50%,-50%) scale(\${(1+0.15*hit(t,v(14.85),0.15)).toFixed(3)})\`;
  fadein('bigq',v(13.9),0.4); if(!p2)$('bigq').style.opacity=0;
  // fed up / want real
  const p3=t>=v(15.8);
  fadein('h1b',v(15.9),0.45); if(!p3)$('h1b').style.opacity=0;
  const wk=back(seg(t,v(17.9),0.45)); $('want').style.opacity=(p3?clamp(wk*3,0,1):0).toFixed(3); $('want').style.transform=\`scale(\${(0.7+0.3*Math.min(wk,1.1)).toFixed(3)})\`; kick+=hit(t,v(17.9),0.1)*0.04;
  // s2 — 19.17 نجم العراق جاي يرجّع
  fadein('h2',19.65,0.5); const pr=back(seg(t,19.6,0.6)); $('port2').style.opacity=clamp(pr*3,0,1); $('port2').style.transform=\`translate(-50%,-50%) scale(\${(0.6+0.4*Math.min(pr,1.1)).toFixed(3)})\`;
  const rg=back(seg(t,20.4,0.5)); $('ring2').style.opacity=clamp(rg*3,0,1); $('ring2').style.transform=\`translate(-50%,-50%) scale(\${(1.6-0.6*Math.min(rg,1.1)).toFixed(3)})\`; fl+=hit(t,19.6,0.1)*0.5; kick+=hit(t,19.6,0.14)*0.05;
  pop('vb2',21.2,0.4,20,'translateX(-50%)'); $('vb2').style.transform=$('vb2').style.transform.replace('translateX(-50%)  translateY','translateX(-50%) translateY');
  // s3 — 22.12 ما ينطلع فيديو ; ~24.6 إلا إذا سجّلته ; 26.51 بصوتك/بوجهك/بقرارك ; 29.22 تقبل ; 30.82 ترفض/وبيش ; 32.65 مدفوع مقدّماً ; 35.47 ماكو شغل ببلاش / ~36.9 يستغلّك
  fadein('h3',v(22.2),0.45); pop('rec3',v(22.4),0.5,60); pop('ok3',v(24.7),0.4,10);
  pop('t0',v(26.6),0.4,30); pop('t1',v(27.4),0.4,30); pop('t2',v(28.2),0.4,30);
  pop('dec',v(29.0),0.45,50); pop('d0',v(29.3),0.35,10); pop('d1',v(30.9),0.35,10); pop('d2',v(31.7),0.35,10);
  pop('paid',v(32.7),0.45,30,'translateX(-50%)'); $('paid').style.transform=$('paid').style.transform.replace('translateX(-50%)  translateY','translateX(-50%) translateY'); kick+=hit(t,v(34.0),0.1)*0.03;
  pop('n0',v(35.55),0.4,30); pop('n1',v(36.9),0.4,30);
  // s4 — 38.51 جمهورك يعرف ; 40.38 حقيقي ; 41.23 الشركات ; 43.42 رسمي ; 44.20 فلوس ; 45.32 ثقة ; 46.24 اسمك
  fadein('h4',v(38.6),0.45); pop('prof',v(38.8),0.5,60); pop('vb4',v(40.45),0.4,10); pop('biz',v(41.3),0.5,60); pop('vb5',v(43.5),0.4,10);
  pop('g0',v(44.25),0.4,30); pop('g1',v(45.4),0.4,30); pop('g2',v(46.3),0.4,30);
  // s5 — 47.90 نجم العراق ; 49.18 وجهك إلك ; 50.36 وصوتك إلك
  const LG=v(47.95);
  const lg=back(seg(t,LG,0.55)); $('logo').style.opacity=clamp(lg*3,0,1); $('mk').style.transform=\`scale(\${(0.2+0.8*Math.min(lg,1.1)).toFixed(3)}) rotate(\${((1-Math.min(lg,1))*-90).toFixed(1)}deg)\`;
  fadein('lar',LG+0.25,0.4); fadein('len',LG+0.5,0.4);
  const tp=eio(seg(t,v(49.2),2.2)); const x=tp*116-8; const mm=\`linear-gradient(to left,#000 \${x-6}%,#000 \${x}%,transparent \${x+6}%)\`; $('tagl').style.webkitMaskImage=mm; $('tagl').style.maskImage=mm;
  fadein('links',v(51.8),0.5,20);
  [['rx1',LG],['rx2',LG+0.15]].forEach(([id,s])=>{const k=seg(t,s,0.9); const r=$(id); r.style.opacity=(k>0&&k<1?(1-k):0).toFixed(3); r.style.transform=\`translate(-50%,-50%) scale(\${(0.6+k*4).toFixed(3)})\`;});
  fl+=hit(t,LG,0.12)*0.7; kick+=hit(t,LG,0.14)*0.05;
  $('cam').style.transform=\`scale(\${(1+0.012*(t/DUR)+kick*0.6).toFixed(4)}) translate(\${(problem?jit(t,3,3):0).toFixed(1)}px,0)\`;
  $('flash').style.opacity=clamp(fl,0,1).toFixed(3); $('flashd').style.opacity=clamp(fld,0,1).toFixed(3);
  $('fade').style.opacity=ei(seg(t,DUR-0.8,0.8)).toFixed(3);
};
</script></body></html>`;
fs.writeFileSync("real.html", html);
const dir = "frames"; if (!process.argv[2]) fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }); const p = await b.newPage({ viewport: { width: W, height: H } });
p.on("pageerror", e => console.log("PAGEERR", e.message));
await p.goto("file://" + process.cwd() + "/real.html"); await p.evaluate(() => document.fonts.ready);
const only = process.argv[2] ? process.argv[2].split(",").map(Number) : null;
for (let f = 0; f < Math.round(DUR * FPS); f++) { if (only && !only.includes(f)) continue; await p.evaluate(t => window.renderAt(t), f / FPS); await p.screenshot({ path: `${dir}/${String(f).padStart(4, "0")}.jpg`, type: "jpeg", quality: 90 }); }
await b.close();
if (!only) execSync(`ffmpeg -v error -y -framerate ${FPS} -i ${dir}/%04d.jpg -c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium -movflags +faststart real-silent.mp4`);
console.log("done");
