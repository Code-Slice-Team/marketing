// نجم العراق — live & group sessions Instagram reel, cut to the Rafoush VO (+0.5 s). 1080x1920, 65 s, dark/violet.
import { chromium } from "playwright"; import fs from "node:fs"; import { execSync } from "node:child_process";
const FPS = 30, W = 1080, H = 1920, DUR = 65.0, O = 0.5;
const MARK = "M12.00 0.80 L14.49 5.99 L19.92 4.08 L18.01 9.51 L23.20 12.00 L18.01 14.49 L19.92 19.92 L14.49 18.01 L12.00 23.20 L9.51 18.01 L4.08 19.92 L5.99 14.49 L0.80 12.00 L5.99 9.51 L4.08 4.08 L9.51 5.99 Z M9.40 8.10 L16.40 12.00 L9.40 15.90 Z";
const mark = cls => `<span class="${cls}"><svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="${MARK}"/></svg></span>`;
const I = (d, cls = "") => `<svg class="ic ${cls}" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${d}</g></svg>`;
const IC = {
  person: `<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>`,
  users: `<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M15 20c0-2.6 1.6-4.6 4-5"/>`,
  video: `<path d="M4 7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM16 10l5-3v10l-5-3"/>`,
  book: `<path d="M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z"/>`,
  dumb: `<path d="M3 10v4M6 8v8M18 8v8M21 10v4M6 12h12"/>`,
  bulb: `<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.3 1 2.5h6c0-1.2.4-1.9 1-2.5A6 6 0 0 0 12 3z"/>`,
  scale: `<path d="M12 3v18M4 7h16M6 7l-3 7a3 3 0 0 0 6 0zM18 7l-3 7a3 3 0 0 0 6 0zM8 21h8"/>`,
  tutor: `<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4M7 9h6M7 12h10"/>`,
  whistle: `<circle cx="9" cy="14" r="5"/><path d="M13 11l8-3v4l-7 2"/>`,
  star: `<path d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.5 9.3l6.1-.7z"/>`,
  clock: `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>`,
  globe: `<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>`,
  pin: `<path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>`,
  cal: `<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>`,
  calx: `<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M7 14h2M11 14h2M15 14h2M7 18h2M11 18h2"/>`,
  check: `<path d="m5 12.5 4.5 4.5L19 7.5"/>`,
  shield: `<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="m9 12 2 2 4-4"/>`,
  bell: `<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0"/>`,
  timer: `<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 1.5M9 2h6M12 2v3"/>`,
  undo: `<path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>`,
  card: `<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18M7 15h4"/>`,
  mic: `<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>`,
  child: `<circle cx="12" cy="7" r="3.5"/><path d="M7 21c0-3.5 2-6 5-6s5 2.5 5 6M9 7c1-2 5-2 6 0"/>`,
  browser: `<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M6 6.5h.01M9 6.5h.01"/>`,
};
const v = x => x + O;
const SC = [["s1",0,4.5],["s2",4.5,19.2],["s3",19.2,28.8],["s4",28.8,41.6],["s5",41.6,47.4],["s6",47.4,56.6],["s7",56.6,65]];
const TYPES = [["تعليم ودروس","درس خصوصي قبل الامتحان",IC.book,10.12],["مهارات وتدريب","تعلّم مهارة جديدة",IC.dumb,12.26],["نصيحة وإرشاد","رأي أهل الخبرة بمشروعك أو شغلك",IC.bulb,14.03],["استشارة مهنية","محامي، مختص، أو مستشار",IC.scale,16.31]];
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
.v{color:#a58bff}.pk{color:#ff7a9c}.gr{color:#7bf1a8}
.ic{width:100%;height:100%}
.big{position:absolute;left:50px;right:50px;top:50%;transform:translateY(-50%);text-align:center;font-size:84px;font-weight:700;line-height:1.35;opacity:0}
.h{position:absolute;left:60px;right:60px;top:300px;text-align:center;font-size:66px;font-weight:700;line-height:1.35;opacity:0}
.card{position:absolute;left:60px;right:60px;background:#fff;color:#1d1640;border-radius:40px;box-shadow:0 50px 120px rgba(0,0,0,.5);opacity:0;text-align:right}
/* s2 */
.exp{position:absolute;left:60px;right:60px;top:560px;display:flex;justify-content:center;gap:18px}
.exp .e{display:flex;align-items:center;gap:14px;background:rgba(255,255,255,.08);border:2px solid rgba(165,139,255,.35);border-radius:999px;padding:14px 26px;font-size:36px;font-weight:700;opacity:0;white-space:nowrap}
.exp .e i{width:56px;height:56px;border-radius:50%;background:#6430f0;display:grid;place-items:center;flex:none}.exp .e i .ic{width:32px;height:32px}
.types{position:absolute;left:60px;right:60px;top:720px;display:flex;flex-direction:column;gap:22px}
.ty{display:flex;align-items:center;gap:24px;background:#fff;color:#1d1640;border-radius:34px;padding:26px 30px;opacity:0;text-align:right;box-shadow:0 30px 80px rgba(0,0,0,.4)}
.ty i{width:96px;height:96px;border-radius:28px;background:#f3f0ff;color:#6430f0;display:grid;place-items:center;flex:none}.ty i .ic{width:56px;height:56px}
.ty b{display:block;font-size:40px}.ty span{display:block;font-size:28px;color:#6b6590;margin-top:6px;font-weight:600}
/* s3 call */
.call{position:absolute;left:60px;right:60px;top:530px;height:700px;border-radius:44px;overflow:hidden;background:#1d1640;opacity:0;box-shadow:0 50px 120px rgba(0,0,0,.5)}
.call .tile{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,#a58bff,#6430f0 80%)}
.call .tile .sil{position:absolute;left:50%;bottom:0;width:560px;height:640px;transform:translateX(-50%);color:rgba(255,255,255,.55)}
.call .me{position:absolute;right:24px;bottom:24px;width:260px;height:340px;border-radius:28px;background:radial-gradient(ellipse at 50% 40%,#ffb8c9,#d8366a 80%);overflow:hidden;border:4px solid rgba(255,255,255,.8)}
.call .me .sil{position:absolute;left:50%;bottom:0;width:240px;height:280px;transform:translateX(-50%);color:rgba(255,255,255,.55)}
.call .tag{position:absolute;left:24px;top:24px;background:rgba(0,0,0,.45);color:#fff;border-radius:999px;padding:10px 22px;font-size:28px;font-weight:700;display:flex;align-items:center;gap:10px}.call .tag .dot{width:16px;height:16px;border-radius:50%;background:#ff3b5c}
.call .nm{position:absolute;left:24px;bottom:24px;background:rgba(255,255,255,.92);color:#1d1640;border-radius:999px;padding:10px 24px;font-size:30px;font-weight:700}
.f2f{position:absolute;left:0;right:0;top:240px;text-align:center;font-size:76px;line-height:1.3;font-weight:700;opacity:0}
.pick{position:absolute;left:60px;right:60px;top:1290px;padding:28px 32px;border-radius:34px;background:#fff;color:#1d1640;opacity:0;box-shadow:0 30px 80px rgba(0,0,0,.4)}
.pick .lb{font-size:28px;color:#6b6590;font-weight:600}.pick .row{display:flex;gap:12px;margin-top:12px;flex-wrap:wrap}
.pick .c{border:2px solid #e2e0ec;border-radius:999px;padding:10px 22px;font-size:30px;font-weight:700}.pick .c.on{background:#6430f0;border-color:#6430f0;color:#fff}
.nb{position:absolute;left:50%;top:1600px;transform:translateX(-50%);display:flex;align-items:center;gap:16px;background:#6430f0;color:#fff;border-radius:999px;padding:16px 36px;font-size:38px;font-weight:700;opacity:0;white-space:nowrap;box-shadow:0 20px 60px rgba(100,48,240,.5)}.nb .ic{width:46px;height:46px}
/* s4 group */
.grp{position:absolute;left:60px;right:60px;top:500px;padding:34px;border-radius:40px;background:#fff;color:#1d1640;opacity:0;box-shadow:0 50px 120px rgba(0,0,0,.5);text-align:right}
.grp .tt{font-size:40px;font-weight:700}.grp .st{font-size:28px;color:#6b6590;font-weight:600;margin-top:6px}
.grp .seats{display:grid;grid-template-columns:repeat(8,1fr);gap:12px;margin-top:26px}
.grp .seats span{aspect-ratio:1;border-radius:50%;background:#f3f0ff;color:#6430f0;display:grid;place-items:center;opacity:.35}.grp .seats span.on{background:#6430f0;color:#fff;opacity:1}.grp .seats span .ic{width:60%;height:60%}
.grp .cnt{margin-top:18px;font-size:28px;color:#6b6590;font-weight:600}
.gchips{position:absolute;left:60px;right:60px;top:1060px;display:flex;flex-direction:column;gap:18px;align-items:center}
.gchips .r{display:flex;gap:16px}
.gc{display:flex;align-items:center;gap:14px;background:rgba(255,255,255,.08);border:2px solid rgba(165,139,255,.35);border-radius:999px;padding:16px 28px;font-size:36px;font-weight:700;opacity:0;white-space:nowrap}
.gc i{width:54px;height:54px;border-radius:50%;background:#6430f0;display:grid;place-items:center;flex:none}.gc i .ic{width:32px;height:32px}
.cmp{position:absolute;left:60px;right:60px;top:1340px;display:flex;gap:20px;opacity:0}
.cmp .b{flex:1;background:#fff;color:#1d1640;border-radius:30px;padding:22px 24px;text-align:center}
.cmp .b small{display:block;font-size:26px;color:#6b6590;font-weight:600}.cmp .b .bar{height:26px;border-radius:13px;background:#e2e0ec;margin-top:14px;overflow:hidden;direction:ltr}.cmp .b .bar i{display:block;height:100%;background:#6430f0;border-radius:13px}
.cmp .b.g .bar i{background:#1f9d61}.cmp .b b{display:block;font-size:32px;margin-top:12px}
/* s5 kids */
.kid{position:absolute;left:60px;right:60px;top:520px;padding:34px;border-radius:40px;background:#fff;color:#1d1640;opacity:0;box-shadow:0 50px 120px rgba(0,0,0,.5);text-align:right}
.kid .row{display:flex;align-items:center;gap:20px}.kid .av{width:110px;height:110px;border-radius:50%;background:linear-gradient(160deg,#1f9d61,#7bf1a8);display:grid;place-items:center;color:#fff;flex:none}.kid .av .ic{width:64px;height:64px}
.kid b{font-size:40px}.kid small{display:block;font-size:28px;color:#6b6590;font-weight:600;margin-top:4px}
.kid .ver{display:inline-flex;align-items:center;gap:12px;margin-top:24px;background:#e6f8ee;color:#1f9d61;border-radius:999px;padding:12px 24px;font-size:30px;font-weight:700;opacity:0}.kid .ver .ic{width:36px;height:36px}
.kid .with{display:flex;align-items:center;gap:16px;margin-top:22px;font-size:32px;font-weight:700;opacity:0}.kid .with i{width:70px;height:70px;border-radius:50%;background:#f3f0ff;color:#6430f0;display:grid;place-items:center}.kid .with i .ic{width:40px;height:40px}
/* s6 steps */
.steps{position:absolute;left:60px;right:60px;top:460px;display:flex;flex-direction:column;gap:20px}
.stp{display:flex;align-items:center;gap:22px;background:#fff;color:#1d1640;border-radius:30px;padding:22px 30px;opacity:0;text-align:right;box-shadow:0 30px 80px rgba(0,0,0,.4);font-size:40px;font-weight:700}
.stp i{width:80px;height:80px;border-radius:50%;background:#6430f0;color:#fff;display:grid;place-items:center;flex:none}.stp i .ic{width:46px;height:46px}.stp i.g{background:#1f9d61}
.q{position:absolute;left:60px;right:60px;top:1180px;text-align:center;font-size:60px;font-weight:700;opacity:0}
.refund{position:absolute;left:50%;top:1330px;transform:translateX(-50%);display:flex;align-items:center;gap:18px;background:#1f9d61;color:#fff;border-radius:999px;padding:20px 44px;font-size:46px;font-weight:700;opacity:0;white-space:nowrap;box-shadow:0 20px 60px rgba(31,157,97,.5)}.refund .ic{width:54px;height:54px}
/* s7 sting */
#s7{background:linear-gradient(170deg,#6430f0,#3a148f)}
.logo{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;opacity:0}
.logo .mk{display:inline-block;width:260px;height:260px}.logo .mk svg{width:100%;height:100%;fill:#fff;filter:drop-shadow(0 0 50px rgba(255,255,255,.6))}
.logo .ar{font-size:130px;font-weight:700;line-height:1.1;margin-top:14px;color:#fff}
.logo .en{font-family:Geist;font-weight:700;font-size:40px;letter-spacing:.2em;text-indent:.2em;color:#ffd9e4;direction:ltr;margin-top:10px}
.logo .tagl{margin-top:50px;font-size:70px;font-weight:700;color:#fff;line-height:1.4;padding:0 40px;-webkit-mask-image:linear-gradient(to left,#000 0%,transparent 0%);mask-image:linear-gradient(to left,#000 0%,transparent 0%)}
.logo .links{margin-top:40px;font-family:Geist;font-weight:700;font-size:38px;color:rgba(255,255,255,.9);direction:ltr;opacity:0}
.ringx{position:absolute;left:50%;top:calc(50% - 300px);width:260px;height:260px;border-radius:50%;border:4px solid rgba(255,255,255,.9);transform:translate(-50%,-50%) scale(0);opacity:0;box-shadow:0 0 60px rgba(100,48,240,.8)}
.flash{position:absolute;inset:0;background:#fff;opacity:0}.flashd{position:absolute;inset:0;background:#a58bff;opacity:0}
.fade{position:absolute;inset:0;background:#000;opacity:0}
.grain{position:absolute;inset:-20px;opacity:.05;mix-blend-mode:overlay;pointer-events:none}
</style></head><body><div id="cam"><div class="bg"></div><div class="glow" id="glow"></div>
<div class="scene" id="s1"><div class="wm">${mark("m")}IRAQISTAR</div><div class="big" id="b1"><span id="b1a" style="display:block;opacity:0">تريد تتعلّم شي جديد…</span><span id="b1b" style="display:block;opacity:0;margin-top:20px" class="v">بس من شخص تثق بيه؟</span></div></div>
<div class="scene" id="s2"><div class="wm">${mark("m")}IRAQISTAR</div><div class="h" id="h2">جلسة فيديو <span class="v">مباشرة</span><br>ويا…</div>
  <div class="exp">${[["معلّم",IC.tutor],["مدرّب",IC.whistle],["صاحب خبرة",IC.star]].map(([t,ic],i)=>`<div class="e" id="e${i}"><i>${I(ic)}</i>${t}</div>`).join("")}</div>
  <div class="types">${TYPES.map(([a,b,ic],i)=>`<div class="ty" id="ty${i}"><i>${I(ic)}</i><div><b>${a}</b><span>${b}</span></div></div>`).join("")}</div></div>
<div class="scene" id="s3"><div class="wm">${mark("m")}IRAQISTAR</div><div class="f2f" id="f2f">إنت والخبير…<br><span class="v">وجه لوجه.</span></div>
  <div class="call" id="call"><div class="tile"><svg class="sil" viewBox="0 0 100 100" preserveAspectRatio="xMidYMax slice"><circle cx="50" cy="38" r="17" fill="currentColor"/><path d="M12 100c2-26 17-38 38-38s36 12 38 38Z" fill="currentColor"/></svg></div><div class="tag"><span class="dot"></span><span id="ctm">00:00</span></div><div class="nm">أ. سارة · تعليم ودروس</div><div class="me"><svg class="sil" viewBox="0 0 100 100" preserveAspectRatio="xMidYMax slice"><circle cx="50" cy="38" r="17" fill="currentColor"/><path d="M12 100c2-26 17-38 38-38s36 12 38 38Z" fill="currentColor"/></svg></div></div>
  <div class="pick" id="pick"><div class="lb">الوقت</div><div class="row"><span class="c">6:00 م</span><span class="c on">7:30 م</span><span class="c">9:00 م</span></div><div class="lb" style="margin-top:18px">المدّة</div><div class="row"><span class="c" id="d30">30 دقيقة</span><span class="c" id="d60">60 دقيقة</span><span class="c" id="d90">90 دقيقة</span></div></div>
  <div class="nb" id="nb">${I(IC.browser)}من المتصفح · بدون تطبيق</div></div>
<div class="scene" id="s4"><div class="wm">${mark("m")}IRAQISTAR</div><div class="h" id="h4">تحب تتعلّم<br><span class="v">ويا ناس مثلك؟</span></div>
  <div class="grp" id="grp"><div class="tt">الجلسات الجماعية</div><div class="st">محادثة إنجليزية للمبتدئين · أ. سارة</div><div class="seats" id="seats">${Array.from({length:16},()=>`<span>${I(IC.person)}</span>`).join("")}</div><div class="cnt"><span id="scnt">0</span> من 16 مقعد محجوز</div></div>
  <div class="gchips"><div class="r"><div class="gc" id="g0"><i>${I(IC.cal)}</i>حصة وحدة</div><div class="gc" id="g1"><i>${I(IC.calx)}</i>دورة كاملة</div></div><div class="r"><div class="gc" id="g2"><i>${I(IC.globe)}</i>أونلاين</div><div class="gc" id="g3"><i>${I(IC.pin)}</i>حضوري بمدينتك</div></div></div>
  <div class="cmp" id="cmp"><div class="b g"><small>سعر المقعد</small><div class="bar"><i style="width:22%"></i></div><b class="gr" style="color:#1f9d61">أرخص هواية</b></div><div class="b"><small>الجلسة الخاصة</small><div class="bar"><i style="width:100%"></i></div><b>وجه لوجه</b></div></div></div>
<div class="scene" id="s5"><div class="wm">${mark("m")}IRAQISTAR</div><div class="h" id="h5">وحتى <span class="v">لأطفالك…</span></div>
  <div class="kid" id="kid"><div class="row"><div class="av">${I(IC.child)}</div><div><b>حصة رسم للأطفال</b><small>IraqiStar Kids · 6 – 10 سنوات</small></div></div><div class="ver" id="ver">${I(IC.shield)}فريقنا راجع الوثائق</div><div class="with" id="with"><i>${I(IC.users)}</i>وإنت تحضر وياهم</div></div></div>
<div class="scene" id="s6"><div class="wm">${mark("m")}IRAQISTAR</div>
  <div class="steps"><div class="stp" id="st0"><i>${I(IC.check)}</i>تحجز</div><div class="stp" id="st1"><i>${I(IC.card)}</i>تدفع</div><div class="stp" id="st2"><i>${I(IC.bell)}</i>يوصلك تذكير قبل الموعد</div><div class="stp" id="st3"><i class="g">${I(IC.timer)}</i>الغرفة تفتح قبل 10 دقايق</div></div>
  <div class="q" id="q6">ما اكتمل العدد؟</div><div class="refund" id="refund">${I(IC.undo)}فلوسك ترجعلك كاملة</div></div>
<div class="scene" id="s7"><div class="ringx" id="rx1"></div><div class="ringx" id="rx2"></div>
  <div class="logo" id="logo"><span class="mk" id="mk"><svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="${MARK}"/></svg></span><div class="ar" id="lar">نجم العراق</div><div class="en" id="len">IRAQISTAR</div><div class="tagl" id="tagl">تعلّم من أهل الخبرة…<br>وجه لوجه.</div><div class="links" id="links">iraqistar.com/sessions · @iraqistar.iq</div></div></div>
<div class="flash" id="flash"></div><div class="flashd" id="flashd"></div>
<svg class="grain" width="100%" height="100%"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="1" id="turb"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>
<div class="fade" id="fade"></div></div><script>
const SC=${JSON.stringify(SC)}, DUR=${DUR}, O=${O}, TY=${JSON.stringify(TYPES.map(t=>t[3]))};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)), eo=x=>1-Math.pow(1-x,3), ei=x=>x*x*x, eio=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2, back=x=>{const c=1.7;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)}, seg=(t,s,d)=>clamp((t-s)/d,0,1), hit=(t,a,l)=>t>=a?Math.exp(-(t-a)/l):0, $=id=>document.getElementById(id), v=x=>x+O;
let t_=0, kick=0;
function pop(id,s,d,dy,base){const k=back(seg(t_,s,d)); const el=$(id); el.style.opacity=clamp(k*3,0,1); el.style.transform=(base||'')+' translateY('+((1-Math.min(k,1))*(dy==null?40:dy)).toFixed(0)+'px) scale('+(0.85+0.15*Math.min(k,1.1)).toFixed(3)+')'; if(t_>=s)kick+=hit(t_,s,0.08)*0.02; return k;}
function fadein(id,s,d,dy){const k=eo(seg(t_,s,d)); const el=$(id); el.style.opacity=k; el.style.transform='translateY('+((1-k)*(dy==null?30:dy)).toFixed(0)+'px)'; return k;}
function slide(id,s,d,dx){const k=back(seg(t_,s,d)); const el=$(id); el.style.opacity=clamp(k*3,0,1); el.style.transform=\`translateX(\${((1-Math.min(k,1))*dx).toFixed(0)}px) scale(\${(0.85+0.15*Math.min(k,1.1)).toFixed(3)})\`; if(t_>=s)kick+=hit(t_,s,0.08)*0.02; return k;}
window.renderAt=t=>{ t_=t; kick=0;
  $('turb').setAttribute('seed',String(Math.floor(t*30)%40));
  let fl=0, fld=0;
  SC.forEach(([id,s,e])=>{const on=t>=s&&t<e; $(id).style.opacity=on?1:0; if(s>0&&id!=='s7'){kick+=hit(t,s,0.12)*0.03; fld+=hit(t,s,0.06)*0.35;}});
  $('glow').style.opacity=(0.6+0.4*Math.sin(t*2.5)).toFixed(3);
  // s1 — 0.0 تريد تتعلّم ; 1.94 بس من شخص تثق بيه
  $('b1').style.opacity=1; fadein('b1a',v(0.05),0.5); const b1=back(seg(t,v(1.95),0.45)); $('b1b').style.opacity=clamp(b1*3,0,1); $('b1b').style.transform=\`scale(\${(0.8+0.2*Math.min(b1,1.1)).toFixed(3)})\`; kick+=hit(t,v(1.95),0.1)*0.03;
  // s2 — 4.05 بنجم العراق ; 5.33 تحجز جلسة… معلّم مدرّب صاحب خبرة ~7.2/8.1/9.0 ; types at 10.12/12.26/14.03/16.31
  fadein('h2',v(4.1),0.45); [v(7.2),v(8.1),v(9.0)].forEach((s,i)=>pop('e'+i,s,0.4,30));
  TY.forEach((s,i)=>slide('ty'+i,v(s),0.45,-140));
  // s3 — 18.76 إنت والخبير ; 20.11 وجه لوجه ; 21.32 الوقت والمدّة ; 23.67 ساعة ونص ; 25.11 المتصفح
  fadein('f2f',v(18.8),0.45); pop('call',v(20.15),0.55,120); const cs=Math.floor(Math.max(0,t-v(20.5))); $('ctm').textContent='00:'+(cs<10?'0':'')+cs;
  pop('pick',v(21.4),0.45,60); $('d30').classList.toggle('on',t>=v(22.3)&&t<v(23.7)); $('d60').classList.toggle('on',t>=v(23.0)&&t<v(23.7)); $('d90').classList.toggle('on',t>=v(23.7)); $('d90').style.transform=\`scale(\${(1+0.12*hit(t,v(23.7),0.15)).toFixed(3)})\`;
  pop('nb',v(25.2),0.45,30,'translateX(-50%)'); $('nb').style.transform=$('nb').style.transform.replace('translateX(-50%)  translateY','translateX(-50%) translateY');
  // s4 — 28.35 ويا ناس مثلك ; 30.46 الجلسات الجماعية ; 32.08 حصة وحدة / 33.6 دورة ; 35.57 أونلاين / 36.5 حضوري ; 37.74 أرخص
  fadein('h4',v(28.4),0.45); pop('grp',v(30.5),0.5,80); const sn=Math.floor(seg(t,v(30.9),2.2)*13); Array.from($('seats').children).forEach((s,i)=>s.classList.toggle('on',i<sn)); $('scnt').textContent=String(sn);
  slide('g0',v(32.15),0.4,120); slide('g1',v(33.6),0.4,120); slide('g2',v(35.6),0.4,120); slide('g3',v(36.5),0.4,120);
  const cm=back(seg(t,v(37.8),0.5)); $('cmp').style.opacity=clamp(cm*3,0,1); $('cmp').style.transform=\`translateY(\${((1-Math.min(cm,1))*50).toFixed(0)}px)\`; kick+=hit(t,v(37.8),0.1)*0.03;
  // s5 — 41.09 لأطفالك ; 42.53 حصص ويا معلّمين فريقنا تحقّق ; ~45.3 إنت تحضر وياهم
  fadein('h5',v(41.15),0.45); pop('kid',v(42.0),0.5,80); pop('ver',v(43.6),0.4,20); pop('with',v(45.3),0.4,20);
  // s6 — 46.92 تحجز ; 47.72 تدفع ; ~48.6 تذكير ; 50.32 الغرفة ; 52.75 ما اكتمل ; 54.12 فلوسك
  slide('st0',v(46.95),0.4,-120); slide('st1',v(47.75),0.4,-120); slide('st2',v(48.6),0.4,-120); slide('st3',v(50.4),0.4,-120);
  fadein('q6',v(52.8),0.35); pop('refund',v(54.15),0.45,30,'translateX(-50%)'); $('refund').style.transform=$('refund').style.transform.replace('translateX(-50%)  translateY','translateX(-50%) translateY'); kick+=hit(t,v(54.15),0.1)*0.035;
  // s7 — 56.11 نجم العراق ; 57.32–59.69 تعلّم من أهل الخبرة، وجه لوجه
  const LG=v(56.15);
  const lg=back(seg(t,LG,0.55)); $('logo').style.opacity=clamp(lg*3,0,1); $('mk').style.transform=\`scale(\${(0.2+0.8*Math.min(lg,1.1)).toFixed(3)}) rotate(\${((1-Math.min(lg,1))*-90).toFixed(1)}deg)\`;
  fadein('lar',LG+0.25,0.4); fadein('len',LG+0.5,0.4);
  const tp=eio(seg(t,v(57.35),2.2)); const x=tp*116-8; const mm=\`linear-gradient(to left,#000 \${x-6}%,#000 \${x}%,transparent \${x+6}%)\`; $('tagl').style.webkitMaskImage=mm; $('tagl').style.maskImage=mm;
  fadein('links',v(60.2),0.5,20);
  [['rx1',LG],['rx2',LG+0.15]].forEach(([id,s])=>{const k=seg(t,s,0.9); const r=$(id); r.style.opacity=(k>0&&k<1?(1-k):0).toFixed(3); r.style.transform=\`translate(-50%,-50%) scale(\${(0.6+k*4).toFixed(3)})\`;});
  fl+=hit(t,LG,0.12)*0.7; kick+=hit(t,LG,0.14)*0.05;
  $('cam').style.transform=\`scale(\${(1+0.012*(t/DUR)+kick*0.6).toFixed(4)})\`;
  $('flash').style.opacity=clamp(fl,0,1).toFixed(3); $('flashd').style.opacity=clamp(fld,0,1).toFixed(3);
  $('fade').style.opacity=ei(seg(t,DUR-0.8,0.8)).toFixed(3);
};
</script></body></html>`;
fs.writeFileSync("learn.html", html);
const dir = "frames"; if (!process.argv[2]) fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }); const p = await b.newPage({ viewport: { width: W, height: H } });
p.on("pageerror", e => console.log("PAGEERR", e.message));
await p.goto("file://" + process.cwd() + "/learn.html"); await p.evaluate(() => document.fonts.ready);
const only = process.argv[2] ? process.argv[2].split(",").map(Number) : null;
for (let f = 0; f < Math.round(DUR * FPS); f++) { if (only && !only.includes(f)) continue; await p.evaluate(t => window.renderAt(t), f / FPS); await p.screenshot({ path: `${dir}/${String(f).padStart(4, "0")}.jpg`, type: "jpeg", quality: 90 }); }
await b.close();
if (!only) execSync(`ffmpeg -v error -y -framerate ${FPS} -i ${dir}/%04d.jpg -c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium -movflags +faststart learn-silent.mp4`);
console.log("done");
