// نجم العراق — teachers & trainers Instagram reel, cut to the Rafoush VO (+0.5 s). 1080x1920, 55 s. Kids-world palette from DESIGN.md: flat colour fields, Kids Ink text, Kids Paper cards.
import { chromium } from "playwright"; import fs from "node:fs"; import { execSync } from "node:child_process";
const FPS = 30, W = 1080, H = 1920, DUR = 55.0, O = 0.5;
const MARK = "M12.00 0.80 L14.49 5.99 L19.92 4.08 L18.01 9.51 L23.20 12.00 L18.01 14.49 L19.92 19.92 L14.49 18.01 L12.00 23.20 L9.51 18.01 L4.08 19.92 L5.99 14.49 L0.80 12.00 L5.99 9.51 L4.08 4.08 L9.51 5.99 Z M9.40 8.10 L16.40 12.00 L9.40 15.90 Z";
const mark = cls => `<span class="${cls}"><svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="${MARK}"/></svg></span>`;
const I = (d, cls = "") => `<svg class="ic ${cls}" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</g></svg>`;
const IC = {
  person: `<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>`,
  users: `<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M15 20c0-2.6 1.6-4.6 4-5"/>`,
  lang: `<path d="M4 5h10M9 3v2M11 5c-1 5-4 8-7 10M6 9c1 3 4 6 7 7M13 20l4-9 4 9M14.5 17h5"/>`,
  math: `<path d="M4 6h6l-3 6 3 6H4M14 8h6M14 16h6M17 11v2"/>`,
  code: `<path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/>`,
  design: `<circle cx="12" cy="12" r="9"/><circle cx="8.5" cy="10" r="1.3"/><circle cx="12" cy="7.5" r="1.3"/><circle cx="15.5" cy="10" r="1.3"/><path d="M12 21c-2 0-3-1.5-2-3s3-1 3-2.5c0-1 3-1.5 3-3.5"/>`,
  fit: `<path d="M3 10v4M6 8v8M18 8v8M21 10v4M6 12h12"/>`,
  cook: `<path d="M8 3v3M12 3v3M16 3v3M5 10h14v3a7 7 0 0 1-14 0zM9 21h6"/>`,
  music: `<path d="M9 18V6l11-2v12"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>`,
  law: `<path d="M12 3v18M4 7h16M6 7l-3 7a3 3 0 0 0 6 0zM18 7l-3 7a3 3 0 0 0 6 0zM8 21h8"/>`,
  clock: `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>`,
  lock: `<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>`,
  check: `<path d="m5 12.5 4.5 4.5L19 7.5"/>`,
  x: `<path d="M6 6l12 12M18 6L6 18"/>`,
  cal: `<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>`,
  calx: `<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M7 14h2M11 14h2M15 14h2M7 18h2M11 18h2"/>`,
  globe: `<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>`,
  pin: `<path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>`,
  link: `<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>`,
  wallet: `<path d="M3 7a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM16 12h4"/><circle cx="16" cy="13" r="1"/>`,
  list: `<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>`,
  browser: `<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M6 6.5h.01M9 6.5h.01"/>`,
  home: `<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>`,
  video: `<path d="M4 7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM16 10l5-3v10l-5-3"/>`,
  sparkle: `<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>`,
};
const v = x => x + O;
const SC = [["s1",0,10.6,"sun"],["s2",10.6,22.5,"sky"],["s3",22.5,38.3,"grass"],["s4",38.3,44.6,"tang"],["s5",44.6,47.7,"berry"],["s6",47.7,55,"ink"]];
const FIELDS = [["لغات",IC.lang,3.1],["رياضيات",IC.math,3.85],["برمجة",IC.code,4.6],["تصميم",IC.design,5.35],["لياقة",IC.fit,6.1],["طبخ",IC.cook,6.85],["موسيقى",IC.music,7.6],["قانون",IC.law,8.35]];
const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-Regular.ttf);font-weight:400}
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-SemiBold.ttf);font-weight:600}
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-Bold.ttf);font-weight:700}
@font-face{font-family:Geist;src:url(fonts/Geist-Bold.ttf);font-weight:700}
:root{--ink:#1d1640;--paper:#fff;--sun:#ffd23f;--sky:#5cc8ff;--grass:#52d28f;--berry:#ff7a9c;--tang:#ffa04d;--ink75:rgba(29,22,64,.75)}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:var(--sun);color:var(--ink);font-family:"IBM Plex Sans Arabic",sans-serif;position:relative}
#cam{position:absolute;inset:0;transform-origin:50% 50%}
.field{position:absolute;inset:0}
.field.sun{background:var(--sun)}.field.sky{background:var(--sky)}.field.grass{background:var(--grass)}.field.tang{background:var(--tang)}.field.berry{background:var(--berry)}.field.ink{background:var(--ink)}
.scene{position:absolute;inset:0;opacity:0}
.wm{position:absolute;top:70px;left:0;right:0;display:flex;justify-content:center;align-items:center;gap:12px;font-family:Geist;font-weight:700;font-size:26px;letter-spacing:.18em;direction:ltr;color:var(--ink)}
.wm .m svg{width:30px;height:30px;fill:var(--ink)}
.wm .tag{margin-left:6px;background:var(--ink);color:#fff;border-radius:999px;padding:4px 16px;font-size:20px;letter-spacing:.08em}
.ic{width:100%;height:100%}
.h{position:absolute;left:60px;right:60px;top:260px;text-align:center;font-size:76px;font-weight:700;line-height:1.3;color:var(--ink);opacity:0}
.h .lo{color:var(--ink75)}
.big{position:absolute;left:60px;right:60px;top:50%;transform:translateY(-50%);text-align:center;font-size:92px;font-weight:700;line-height:1.35;color:var(--ink)}
.card{position:absolute;left:60px;right:60px;background:var(--paper);color:var(--ink);border-radius:36px;box-shadow:0 24px 60px rgba(29,22,64,.18);opacity:0;text-align:right}
.chip{display:flex;align-items:center;gap:16px;background:var(--paper);color:var(--ink);border-radius:999px;padding:18px 30px;font-size:40px;font-weight:700;opacity:0;white-space:nowrap;box-shadow:0 14px 40px rgba(29,22,64,.16)}
.chip i{width:60px;height:60px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;flex:none}.chip i .ic{width:36px;height:36px}
.chip.inv{background:var(--ink);color:#fff}.chip.inv i{background:#fff;color:var(--ink)}
/* s1 */
.grid{position:absolute;left:60px;right:60px;top:760px;display:flex;flex-wrap:wrap;gap:20px;justify-content:center}
.any{position:absolute;left:50%;top:1420px;transform:translateX(-50%);background:var(--ink);color:#fff;border-radius:999px;padding:20px 56px;font-size:60px;font-weight:700;opacity:0;white-space:nowrap}
/* s2 */
.pr{top:620px;padding:34px}
.pr .lb{font-size:30px;font-weight:700;color:var(--ink75);margin-top:22px}.pr .lb:first-child{margin-top:0}
.pr .row{display:flex;gap:12px;margin-top:12px;flex-wrap:wrap}
.pr .c{border:3px solid #e2e0ec;border-radius:999px;padding:10px 22px;font-size:30px;font-weight:700;opacity:0}
.pr .c.on{background:var(--sky);border-color:var(--sky)}
.pr .c.g{font-family:Geist;direction:ltr}
.bk{top:1330px;padding:28px 34px;display:flex;align-items:center;gap:22px}
.bk .av{width:90px;height:90px;border-radius:50%;background:var(--sky);display:grid;place-items:center;color:var(--ink);flex:none}.bk .av .ic{width:52px;height:52px}
.bk b{display:block;font-size:36px}.bk small{display:block;font-size:26px;color:var(--ink75);font-weight:600;margin-top:4px}
.bk .lk{margin-right:auto;width:84px;height:84px;border-radius:50%;background:var(--grass);display:grid;place-items:center;color:var(--ink);opacity:0;flex:none}.bk .lk .ic{width:48px;height:48px}
/* s3 */
.gp{top:560px;padding:30px 34px}
.gp .tt{font-size:40px;font-weight:700}.gp .st{font-size:26px;color:var(--ink75);font-weight:600;margin-top:4px}
.gp .seats{display:grid;grid-template-columns:repeat(8,1fr);gap:10px;margin-top:22px}
.gp .seats span{aspect-ratio:1;border-radius:50%;background:#eae8f3;color:var(--ink);display:grid;place-items:center;opacity:.5}.gp .seats span.on{background:var(--grass);opacity:1}.gp .seats span .ic{width:60%;height:60%}
.gchips{position:absolute;left:60px;right:60px;top:1000px;display:flex;flex-direction:column;gap:16px;align-items:center}
.gchips .r{display:flex;gap:14px}.gchips .chip{font-size:34px;padding:14px 26px}.gchips .chip i{width:52px;height:52px}.gchips .chip i .ic{width:30px;height:30px}
.ctl{top:1240px;padding:26px 34px;display:flex;gap:20px}
.ctl .b{flex:1;text-align:center}.ctl .b small{display:block;font-size:26px;color:var(--ink75);font-weight:600}.ctl .b b{display:block;font-size:44px;font-family:Geist;direction:ltr;margin-top:6px}
.ctl .b .pm{display:flex;justify-content:center;gap:12px;margin-top:8px}.ctl .b .pm span{width:44px;height:44px;border-radius:50%;background:#eae8f3;display:grid;place-items:center;font-family:Geist;font-weight:700;font-size:28px}
.share{position:absolute;left:60px;right:60px;top:1240px;display:flex;align-items:center;gap:18px;background:var(--paper);border-radius:999px;padding:18px 28px;opacity:0;box-shadow:0 14px 40px rgba(29,22,64,.16)}
.share .ic{width:44px;height:44px;flex:none}.share .u{flex:1;font-family:Geist;font-weight:700;font-size:28px;direction:ltr;text-align:left;color:var(--ink75);white-space:nowrap;overflow:hidden}.share .cp{background:var(--ink);color:#fff;border-radius:999px;padding:10px 24px;font-size:26px;font-weight:700;white-space:nowrap}
.earn{position:absolute;left:60px;right:60px;top:1420px;display:flex;align-items:center;justify-content:space-between;background:var(--ink);color:#fff;border-radius:30px;padding:24px 34px;opacity:0}
.earn b{font-size:36px}.earn .n{font-family:Geist;font-weight:700;font-size:48px;direction:ltr;color:var(--grass)}
/* s4 */
.plan{top:560px;padding:30px 34px}
.plan .tt{display:flex;align-items:center;gap:14px;font-size:36px;font-weight:700}.plan .tt .ic{width:44px;height:44px}
.plan .li{display:flex;align-items:center;gap:16px;margin-top:16px;font-size:30px;font-weight:600;opacity:0}.plan .li i{width:44px;height:44px;border-radius:12px;background:var(--tang);display:grid;place-items:center;flex:none;font-family:Geist;font-size:22px;font-weight:700;direction:ltr}
.no{position:absolute;left:60px;right:60px;top:1120px;display:flex;gap:16px;justify-content:center}
.no .chip i{background:#c42f3c}
.frm{position:absolute;left:60px;right:60px;top:1280px;display:flex;gap:16px;justify-content:center}
/* s5 */
.wal{top:600px;padding:34px;background:var(--ink);color:#fff}
.wal .lb{font-size:30px;color:rgba(255,255,255,.75);font-weight:600}.wal .n{font-family:Geist;font-weight:700;font-size:84px;direction:ltr;text-align:left;margin-top:8px;color:#fff}
.wal .btn{margin-top:22px;background:var(--berry);color:var(--ink);border-radius:999px;padding:16px 0;text-align:center;font-size:34px;font-weight:700}
.ring{position:absolute;left:50%;top:1080px;transform:translateX(-50%);width:300px;height:300px;opacity:0}
.ring svg{width:100%;height:100%;transform:rotate(-90deg)}
.ring .t{position:absolute;inset:0;display:grid;place-items:center;font-family:Geist;font-weight:700;font-size:72px;color:var(--ink);direction:ltr;text-align:center;line-height:1}
.ring .t small{display:block;font-family:"IBM Plex Sans Arabic";font-size:28px;color:var(--ink75);font-weight:600;margin-top:6px}
/* s6 */
.logo{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;opacity:0}
.logo .mk{display:inline-block;width:260px;height:260px}.logo .mk svg{width:100%;height:100%;fill:#fff}
.logo .ar{font-size:130px;font-weight:700;line-height:1.1;margin-top:14px;color:#fff}
.logo .en{display:inline-flex;align-items:center;gap:14px;font-family:Geist;font-weight:700;font-size:40px;letter-spacing:.2em;color:#fff;direction:ltr;margin-top:10px}.logo .en .tag{background:#6430f0;color:#fff;border-radius:999px;padding:4px 18px;font-size:26px;letter-spacing:.08em}
.logo .tagl{margin-top:50px;font-size:84px;font-weight:700;color:var(--sun);line-height:1.3;-webkit-mask-image:linear-gradient(to left,#000 0%,transparent 0%);mask-image:linear-gradient(to left,#000 0%,transparent 0%)}
.logo .cta{display:inline-block;margin-top:40px;background:var(--sun);color:var(--ink);border-radius:999px;padding:18px 48px;font-size:40px;font-weight:700;opacity:0}
.logo .links{margin-top:26px;font-family:Geist;font-weight:700;font-size:34px;color:rgba(255,255,255,.85);direction:ltr;opacity:0}
.fade{position:absolute;inset:0;background:#000;opacity:0}
</style></head><body><div id="cam"><div class="field sun" id="field"></div>
<div class="scene" id="s1"><div class="wm">${mark("m")}IRAQISTAR<span class="tag">LIVE</span></div><div class="h" id="h1"><span id="h1a" style="display:block;opacity:0">عندك خبرة…</span><span id="h1b" style="display:block;opacity:0">وناس تريد تتعلّم منك؟</span></div>
  <div class="grid">${FIELDS.map(([t,ic],i)=>`<div class="chip" id="f${i}"><i>${I(ic)}</i>${t}</div>`).join("")}</div><div class="any" id="any">أي مجال.</div></div>
<div class="scene" id="s2"><div class="wm">${mark("m")}IRAQISTAR<span class="tag">LIVE</span></div><div class="h" id="h2">تقدّم جلساتك أونلاين…<br><span class="lo">وتنقبض عليها.</span></div>
  <div class="card pr" id="pr"><div class="lb">سعر الجلسة الخاصة</div><div class="row">${["25,000","50,000","75,000"].map((p,i)=>`<span class="c g" id="p${i}">${p}</span>`).join("")}</div><div class="lb">المدّة</div><div class="row">${["30 دقيقة","60 دقيقة","90 دقيقة"].map((p,i)=>`<span class="c" id="d${i}">${p}</span>`).join("")}</div><div class="lb">الأوقات اللي تناسبك</div><div class="row">${["السبت 6 م","الاثنين 8 م","الأربعاء 6 م"].map((p,i)=>`<span class="c" id="t${i}">${p}</span>`).join("")}</div></div>
  <div class="card bk" id="bk"><div class="av">${I(IC.person)}</div><div><b>أحمد حجز ودفع</b><small>الاثنين 8 م · 60 دقيقة</small></div><div class="lk" id="lk">${I(IC.lock)}</div></div></div>
<div class="scene" id="s3"><div class="wm">${mark("m")}IRAQISTAR<span class="tag">LIVE</span></div><div class="h" id="h3">تعلّم أكثر من واحد<br><span class="lo">بنفس الوقت؟</span></div>
  <div class="card gp" id="gp"><div class="tt">جلسة جماعية</div><div class="st">محادثة إنجليزية للمبتدئين</div><div class="seats" id="seats">${Array.from({length:16},()=>`<span>${I(IC.person)}</span>`).join("")}</div></div>
  <div class="gchips"><div class="r"><div class="chip" id="g0"><i>${I(IC.cal)}</i>حصة وحدة</div><div class="chip" id="g1"><i>${I(IC.calx)}</i>دورة كاملة</div></div><div class="r"><div class="chip" id="g2"><i>${I(IC.globe)}</i>أونلاين</div><div class="chip" id="g3"><i>${I(IC.pin)}</i>حضوري بمكانك</div></div></div>
  <div class="card ctl" id="ctl"><div class="b"><small>سعر المقعد</small><b id="sp">10,000</b></div><div class="b"><small>عدد المقاعد</small><b id="sc">16</b><div class="pm"><span>−</span><span>+</span></div></div></div>
  <div class="share" id="share">${I(IC.link)}<span class="u">iraqistar.com/g/english-a1</span><span class="cp">نسخ الرابط</span></div>
  <div class="earn" id="earn"><b>يوصلك كامل</b><span class="n" id="en">0 IQD</span></div></div>
<div class="scene" id="s4"><div class="wm">${mark("m")}IRAQISTAR<span class="tag">LIVE</span></div><div class="h" id="h4">وحتى خطة الحصص…<br><span class="lo">نجهّزها وياك.</span></div>
  <div class="card plan" id="plan"><div class="tt">${I(IC.list)}خطة الدورة · 4 حصص</div>${["التعارف وأساسيات النطق","الجمل اليومية والتحيّة","الأسئلة والأجوبة","محادثة كاملة وتقييم"].map((l,i)=>`<div class="li" id="li${i}"><i>${i+1}</i>${l}</div>`).join("")}</div>
  <div class="no"><div class="chip" id="n0"><i>${I(IC.x)}</i>لا ستوديو</div><div class="chip" id="n1"><i>${I(IC.x)}</i>لا تطبيق</div></div>
  <div class="frm"><div class="chip inv" id="m0"><i>${I(IC.browser)}</i>من المتصفح</div><div class="chip inv" id="m1"><i>${I(IC.home)}</i>ومن بيتك</div></div></div>
<div class="scene" id="s5"><div class="wm">${mark("m")}IRAQISTAR<span class="tag">LIVE</span></div><div class="h" id="h5">أرباحك توصلك<br><span class="lo">خلال 24 ساعة</span></div>
  <div class="card wal" id="wal"><div class="lb">أرباحك المتاحة</div><div class="n">320,000 IQD</div><div class="btn">اسحب</div></div>
  <div class="ring" id="ring"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="none" stroke="rgba(29,22,64,.15)" stroke-width="8"/><circle id="arc" cx="50" cy="50" r="44" fill="none" stroke="#1d1640" stroke-width="8" stroke-linecap="round" stroke-dasharray="276.5" stroke-dashoffset="276.5"/></svg><div class="t"><span id="hrs">24</span><small>ساعة</small></div></div></div>
<div class="scene" id="s6"><div class="logo" id="logo"><span class="mk" id="mk"><svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="${MARK}"/></svg></span><div class="ar" id="lar">نجم العراق</div><div class="en" id="len">IRAQISTAR<span class="tag">LIVE</span></div><div class="tagl" id="tagl">خبرتك إلها جمهور.</div><div><span class="cta" id="cta">قدّم كخبير</span></div><div class="links" id="links">iraqistar.com/apply · @iraqistar.iq</div></div></div>
<div class="fade" id="fade"></div></div><script>
const SC=${JSON.stringify(SC)}, DUR=${DUR}, O=${O}, FT=${JSON.stringify(FIELDS.map(f=>f[2]))};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)), eo=x=>1-Math.pow(1-x,3), ei=x=>x*x*x, eio=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2, back=x=>{const c=1.7;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)}, seg=(t,s,d)=>clamp((t-s)/d,0,1), hit=(t,a,l)=>t>=a?Math.exp(-(t-a)/l):0, $=id=>document.getElementById(id), v=x=>x+O;
let t_=0, kick=0;
function pop(id,s,d,dy,base){const k=back(seg(t_,s,d)); const el=$(id); el.style.opacity=clamp(k*3,0,1); el.style.transform=(base||'')+' translateY('+((1-Math.min(k,1))*(dy==null?40:dy)).toFixed(0)+'px) scale('+(0.85+0.15*Math.min(k,1.1)).toFixed(3)+')'; if(t_>=s)kick+=hit(t_,s,0.08)*0.02; return k;}
function fadein(id,s,d,dy){const k=eo(seg(t_,s,d)); const el=$(id); el.style.opacity=k; el.style.transform='translateY('+((1-k)*(dy==null?30:dy)).toFixed(0)+'px)'; return k;}
function slide(id,s,d,dx){const k=back(seg(t_,s,d)); const el=$(id); el.style.opacity=clamp(k*3,0,1); el.style.transform=\`translateX(\${((1-Math.min(k,1))*dx).toFixed(0)}px) scale(\${(0.85+0.15*Math.min(k,1.1)).toFixed(3)})\`; if(t_>=s)kick+=hit(t_,s,0.08)*0.02; return k;}
window.renderAt=t=>{ t_=t; kick=0;
  let fieldCls='sun';
  SC.forEach(([id,s,e,f])=>{const on=t>=s&&t<e; $(id).style.opacity=on?1:0; if(on)fieldCls=f; if(s>0&&id!=='s6')kick+=hit(t,s,0.12)*0.03;});
  $('field').className='field '+fieldCls;
  // s1 — 0.0 عندك خبرة ; 1.12 وناس تريد ; fields 3.1… ; 8.9 أي مجال
  $('h1').style.opacity=1; fadein('h1a',v(0.05),0.45); fadein('h1b',v(1.15),0.45);
  FT.forEach((s,i)=>pop('f'+i,v(s),0.4,30)); pop('any',v(8.9),0.45,30,'translateX(-50%)'); $('any').style.transform=$('any').style.transform.replace('translateX(-50%)  translateY','translateX(-50%) translateY'); kick+=hit(t,v(8.9),0.1)*0.03;
  // s2 — 10.12 بنجم العراق ; 11.33 تقدّم جلساتك ; 14.28 سعر ; ~16.0 المدّة ; ~17.3 الأوقات ; 18.97 يحجز ويدفع ; ~20.6 قبل ما يبدي
  fadein('h2',v(10.2),0.45); pop('pr',v(13.9),0.5,60);
  [0,1,2].forEach(i=>{pop('p'+i,v(14.35+i*0.12),0.3,10); pop('d'+i,v(16.05+i*0.12),0.3,10); pop('t'+i,v(17.35+i*0.12),0.3,10);});
  $('p1').classList.toggle('on',t>=v(15.0)); $('d1').classList.toggle('on',t>=v(16.7)); $('t1').classList.toggle('on',t>=v(18.0)); $('t2').classList.toggle('on',t>=v(18.3));
  pop('bk',v(19.05),0.5,60); pop('lk',v(20.6),0.4,0); kick+=hit(t,v(20.6),0.1)*0.03;
  // s3 — 22.06 أكثر من واحد ; 24.76 سوّي جلسة جماعية ; 26.27 حصة وحدة ; 27.21 دورة ; 28.36 أونلاين ; ~29.3 حضوري ; 30.47 سعر المقعد وعدد ; 33.20 تشارك الرابط ; 35.28 كل مقعد ينباع يوصلك كامل
  fadein('h3',v(22.1),0.45); pop('gp',v(24.8),0.5,60); const sn=Math.floor(seg(t,v(25.1),1.6)*16); Array.from($('seats').children).forEach((s,i)=>s.classList.toggle('on',i<sn));
  slide('g0',v(26.3),0.4,120); slide('g1',v(27.25),0.4,120); slide('g2',v(28.4),0.4,120); slide('g3',v(29.3),0.4,120);
  const ctlOn=t<v(33.2); pop('ctl',v(30.5),0.45,50); if(!ctlOn)$('ctl').style.opacity=String(Math.max(0,1-eo(seg(t,v(33.2),0.25)))); $('sp').textContent=(Math.round(10000*eo(seg(t,v(30.8),0.8))/1000)*1000).toLocaleString('en-US'); $('sc').textContent=String(Math.round(16*eo(seg(t,v(31.6),0.8))));
  pop('share',v(33.25),0.45,40); pop('earn',v(35.35),0.45,40); $('en').textContent=(Math.round(160000*eo(seg(t,v(35.6),1.2))/1000)*1000).toLocaleString('en-US')+' IQD';
  // s4 — 37.77 خطة الحصص ; 40.33 لا ستوديو / ~41.2 لا تطبيق ; 42.16 من المتصفح / ~43.1 ومن بيتك
  fadein('h4',v(37.85),0.45); pop('plan',v(38.3),0.5,60); [0,1,2,3].forEach(i=>fadein('li'+i,v(38.9+i*0.3),0.3,14));
  pop('n0',v(40.4),0.4,30); pop('n1',v(41.2),0.4,30); pop('m0',v(42.2),0.4,30); pop('m1',v(43.1),0.4,30);
  // s5 — 44.12 أرباحك… 24 ساعة (~45.6)
  fadein('h5',v(44.2),0.45); pop('wal',v(44.4),0.5,60); const rg=back(seg(t,v(45.4),0.4)); $('ring').style.opacity=clamp(rg*3,0,1); const rp=eo(seg(t,v(45.6),1.0)); $('arc').setAttribute('stroke-dashoffset',String((276.5*(1-rp)).toFixed(1))); $('hrs').textContent=String(Math.round(24*rp));
  // s6 — 47.25 نجم العراق ; 48.44–50.02 خبرتك إلها جمهور
  const LG=v(47.3);
  const lg=back(seg(t,LG,0.55)); $('logo').style.opacity=clamp(lg*3,0,1); $('mk').style.transform=\`scale(\${(0.2+0.8*Math.min(lg,1.1)).toFixed(3)}) rotate(\${((1-Math.min(lg,1))*-90).toFixed(1)}deg)\`;
  fadein('lar',LG+0.25,0.4); fadein('len',LG+0.5,0.4);
  const tp=eio(seg(t,v(48.45),1.5)); const x=tp*116-8; const mm=\`linear-gradient(to left,#000 \${x-6}%,#000 \${x}%,transparent \${x+6}%)\`; $('tagl').style.webkitMaskImage=mm; $('tagl').style.maskImage=mm;
  pop('cta',v(50.3),0.45,20); fadein('links',v(50.9),0.5,20); kick+=hit(t,LG,0.14)*0.05;
  $('cam').style.transform=\`scale(\${(1+0.012*(t/DUR)+kick*0.6).toFixed(4)})\`;
  $('fade').style.opacity=ei(seg(t,DUR-0.8,0.8)).toFixed(3);
};
</script></body></html>`;
fs.writeFileSync("teach.html", html);
const dir = "frames"; if (!process.argv[2]) fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }); const p = await b.newPage({ viewport: { width: W, height: H } });
p.on("pageerror", e => console.log("PAGEERR", e.message));
await p.goto("file://" + process.cwd() + "/teach.html"); await p.evaluate(() => document.fonts.ready);
const only = process.argv[2] ? process.argv[2].split(",").map(Number) : null;
for (let f = 0; f < Math.round(DUR * FPS); f++) { if (only && !only.includes(f)) continue; await p.evaluate(t => window.renderAt(t), f / FPS); await p.screenshot({ path: `${dir}/${String(f).padStart(4, "0")}.jpg`, type: "jpeg", quality: 90 }); }
await b.close();
if (!only) execSync(`ffmpeg -v error -y -framerate ${FPS} -i ${dir}/%04d.jpg -c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium -movflags +faststart teach-silent.mp4`);
console.log("done");
