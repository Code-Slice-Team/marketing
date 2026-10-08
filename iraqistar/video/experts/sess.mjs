// IraqiStar LIVE — recruit experts for 1:1 online, group online and in-person sessions. — one idea per frame, ≤5 words, visual-led. 65 beats @128 (music3). 1080x1920.
import { chromium } from "playwright"; import fs from "node:fs"; import { execSync } from "node:child_process";
const FPS = 30, W = 1080, H = 1920, B = 60 / 128, BEATS = 65; const DUR = Math.round(BEATS * B * FPS) / FPS;
const MARK = "M12.00 0.80 L14.49 5.99 L19.92 4.08 L18.01 9.51 L23.20 12.00 L18.01 14.49 L19.92 19.92 L14.49 18.01 L12.00 23.20 L9.51 18.01 L4.08 19.92 L5.99 14.49 L0.80 12.00 L5.99 9.51 L4.08 4.08 L9.51 5.99 Z M9.40 8.10 L16.40 12.00 L9.40 15.90 Z";
const mark = cls => `<span class="${cls}"><svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="${MARK}"/></svg></span>`;
const RIB = "IRAQISTAR LIVE · جلسات مباشرة · نجم العراق · ".repeat(50);
const PATHS = ["M-200,300 C300,0 700,900 1300,400","M-200,1300 C300,700 800,1700 1300,1000","M-300,800 C300,1700 700,-100 1300,900","M-200,100 C400,1100 800,200 1300,1500"];
const ribbons = id => `<svg class="rib" id="${id}" style="direction:ltr" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><defs>${PATHS.map((d,i)=>`<path id="${id}p${i}" d="${d}"/>`).join("")}</defs>${PATHS.map((_,i)=>`<text class="rt" font-size="${34+i*4}"><textPath href="#${id}p${i}" id="${id}t${i}" startOffset="0">${RIB}</textPath></text>`).join("")}</svg>`;
const SC = [["s1",0,4,"dark"],["s2",4,11,"dark"],["s3",11,18,"white"],["s4",18,25,"white"],["s5",25,32,"white"],["s6",32,39,"dark"],["s7",39,48,"dark"],["s8",48,57,"dark"],["s9",57,65,"dark"]];
const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-Regular.ttf);font-weight:400}
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-SemiBold.ttf);font-weight:600}
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-Bold.ttf);font-weight:700}
@font-face{font-family:Geist;src:url(fonts/Geist-Bold.ttf);font-weight:700}
@font-face{font-family:Geist;src:url(fonts/Geist-SemiBold.ttf);font-weight:600}
*{margin:0;padding:0;box-sizing:border-box}
html{overflow:hidden;width:${W}px;height:${H}px}
body{width:${W}px;height:${H}px;overflow:hidden;background:#08080f;color:#f7f7fb;font-family:"IBM Plex Sans Arabic",sans-serif;position:relative}
#cam{position:absolute;inset:0;transform-origin:50% 50%}
.bg{position:absolute;inset:0;background:#08080f}.bg.white{background:#fff}
.glow{position:absolute;left:50%;top:50%;width:1500px;height:1500px;border-radius:50%;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(100,48,240,.35) 0%,rgba(100,48,240,0) 60%);opacity:0}
.scene{position:absolute;inset:0;opacity:0}
.rib{position:absolute;inset:0;width:100%;height:100%}
.rt{fill:none;stroke:rgba(255,255,255,.8);stroke-width:1.1;font-family:Geist,"IBM Plex Sans Arabic";font-weight:700;letter-spacing:.06em}
.wm{position:absolute;top:80px;left:0;right:0;text-align:center;display:flex;justify-content:center;align-items:center;gap:14px;font-family:Geist;font-weight:700;font-size:30px;letter-spacing:.18em;direction:ltr;color:rgba(247,247,251,.75)}
.wm .m svg{width:34px;height:34px;fill:#a58bff}
.wm.dk{color:rgba(12,11,22,.6)}.wm.dk .m svg{fill:#6430f0}
.v{color:#a58bff}.white .v,.vd{color:#6430f0}
.big{position:absolute;left:60px;right:60px;top:50%;transform:translateY(-50%);text-align:center;font-size:132px;font-weight:700;line-height:1.25;color:#fff;opacity:0}
.big.dk{color:#0c0b16}
.h{position:absolute;left:60px;right:60px;top:170px;text-align:center;font-size:80px;font-weight:700;line-height:1.25;color:#0c0b16;opacity:0}
.h.lt{color:#fff}
/* wall */
.wall{position:absolute;left:60px;right:60px;top:430px;display:grid;grid-template-columns:repeat(3,1fr);gap:26px}
.wc{border-radius:28px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.6),0 0 0 1.5px rgba(165,139,255,.35);opacity:0;aspect-ratio:332/462}
.wc img{width:100%;height:100%;object-fit:cover;display:block}
.slam{position:absolute;left:0;right:0;top:50%;text-align:center;font-size:260px;font-weight:700;color:#fff;opacity:0;white-space:nowrap;text-shadow:0 0 80px rgba(100,48,240,.9),0 20px 60px rgba(0,0,0,.6)}
.sub{position:absolute;left:60px;right:60px;text-align:center;font-size:50px;font-weight:600;color:#c9bfff;opacity:0;line-height:1.4}
/* filter */
.phone{position:absolute;left:50%;width:600px;height:1230px;transform:translateX(-50%);background:#0c0b16;border-radius:80px;padding:16px;box-shadow:0 60px 140px rgba(12,11,22,.35),0 0 0 3px #2a2940;opacity:0}
.phone .scr{position:relative;width:100%;height:100%;border-radius:64px;overflow:hidden;background:#fff}
.scr .pg{position:absolute;left:0;top:0;width:100%;display:block;will-change:transform}.scr .hd{position:absolute;left:0;top:0;width:100%;display:block}
.chips{position:absolute;left:60px;right:60px;top:340px;display:flex;flex-wrap:wrap;gap:20px;justify-content:center}
.chip{background:#fff;border:3px solid #6430f0;border-radius:999px;padding:16px 40px;font-size:48px;font-weight:700;color:#0c0b16;box-shadow:0 16px 50px rgba(100,48,240,.18);opacity:0;will-change:transform}
.chip.hi{background:#6430f0;color:#fff}
.res{position:absolute;left:90px;right:90px;bottom:120px;text-align:center;background:#6430f0;color:#fff;border-radius:999px;padding:22px 0;font-size:54px;font-weight:700;box-shadow:0 20px 60px rgba(100,48,240,.5);opacity:0}.res .n{font-family:Geist;direction:ltr;display:inline-block;min-width:1.2em}
/* brief */
.brief{position:absolute;left:70px;right:70px;top:520px;background:#fff;border:2px solid #e2e0ec;border-radius:40px;padding:40px 44px;box-shadow:0 30px 90px rgba(12,11,22,.14);opacity:0;text-align:right}
.brief .lb{font-size:32px;color:#4f5368;font-weight:600}
.brief .fld{margin-top:14px;background:#f3f0ff;border-radius:22px;padding:22px 28px;font-size:44px;font-weight:600;color:#0c0b16;min-height:110px;line-height:1.45}
.brief .fld i{display:inline-block;width:4px;height:1em;background:#6430f0;vertical-align:-.15em;margin-right:4px}
.brief .row{display:flex;gap:16px;margin-top:22px;flex-wrap:wrap}
.brief .tg{background:#fff;border:2px solid #e2e0ec;border-radius:999px;padding:10px 26px;font-size:32px;font-weight:600;color:#0c0b16}
.brief .tg.on{border-color:#6430f0;color:#6430f0;background:#f3f0ff}
.badge{position:absolute;left:50%;transform:translateX(-50%);top:1300px;background:#08080f;color:#fff;border-radius:999px;padding:24px 56px;font-size:60px;font-weight:700;box-shadow:0 30px 80px rgba(0,0,0,.35);opacity:0;white-space:nowrap}
.badge .v{color:#a58bff}
/* quotes */
.qs{position:absolute;left:70px;right:70px;top:480px;display:flex;flex-direction:column;gap:26px}
.q{background:#fff;border:2px solid #e2e0ec;border-radius:34px;padding:24px 30px;display:flex;align-items:center;gap:24px;box-shadow:0 24px 70px rgba(12,11,22,.12);opacity:0;will-change:transform;position:relative}
.q img{width:130px;height:130px;border-radius:28px;object-fit:cover;flex:none}
.q .nm{font-size:40px;font-weight:700;color:#0c0b16}.q .dl{font-size:30px;color:#4f5368;margin-top:6px}
.q .pr{margin-inline-start:auto;font-family:Geist;font-weight:700;font-size:44px;color:#0c0b16;direction:ltr;text-align:right}.q .pr small{display:block;font-family:"IBM Plex Sans Arabic";font-size:26px;color:#4f5368;font-weight:600}
.q .ok{position:absolute;left:-18px;top:-18px;width:76px;height:76px;border-radius:50%;background:#1f9d61;display:grid;place-items:center;opacity:0}
.q .ok svg{width:44px;height:44px;fill:none;stroke:#fff;stroke-width:3.2;stroke-linecap:round;stroke-linejoin:round}
.q.pick{border-color:#6430f0;box-shadow:0 30px 90px rgba(100,48,240,.25)}
/* player */
.player{position:absolute;left:90px;right:90px;top:560px;height:900px;border-radius:44px;overflow:hidden;background:#13121e;box-shadow:0 50px 140px rgba(0,0,0,.7),0 0 0 2px rgba(165,139,255,.35);opacity:0}
.player img{width:100%;height:100%;object-fit:cover;display:block;filter:brightness(.85)}
.player .play{position:absolute;left:50%;top:50%;width:170px;height:170px;border-radius:50%;background:rgba(255,255,255,.95);transform:translate(-50%,-50%);display:grid;place-items:center}
.player .play svg{width:80px;height:80px;fill:#6430f0;margin-left:8px}
.player .bar{position:absolute;left:40px;right:40px;bottom:120px;height:10px;border-radius:5px;background:rgba(255,255,255,.3)}.player .bar i{display:block;height:100%;width:0;background:#fff;border-radius:5px}
.player .meta{position:absolute;left:40px;right:40px;bottom:40px;display:flex;justify-content:space-between;align-items:center;color:#fff;font-size:30px;font-weight:600}
.player .meta .dl{background:#6430f0;border-radius:999px;padding:10px 28px}
.tagm{position:absolute;left:40px;top:40px;background:rgba(8,8,15,.75);color:#fff;border-radius:999px;padding:10px 24px;font-size:28px;font-weight:600}
/* trust */
.tr{position:absolute;left:60px;right:60px;top:50%;transform:translateY(-50%);text-align:center;opacity:0}
.tr i{display:inline-grid;place-items:center;width:200px;height:200px;border-radius:50%;background:#6430f0;box-shadow:0 0 90px rgba(100,48,240,.7);font-style:normal}
.tr i svg{width:100px;height:100px;fill:none;stroke:#fff;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
.tr b{display:block;font-size:104px;font-weight:700;line-height:1.2;color:#fff;margin-top:50px}
/* cta */
.tagwrap{position:absolute;left:40px;right:40px;top:560px;text-align:center}
.tag{font-size:104px;font-weight:700;line-height:1.3;color:#fff;-webkit-mask-image:linear-gradient(to left,#000 0%,#000 0%,transparent 0%);mask-image:linear-gradient(to left,#000 0%,#000 0%,transparent 0%)}
.tag .v{color:#a58bff}
.bar2{position:absolute;top:-10%;height:120%;width:14px;background:linear-gradient(to bottom,rgba(165,139,255,0),#fff 40%,#a58bff 60%,rgba(165,139,255,0));border-radius:8px;box-shadow:0 0 60px 18px rgba(100,48,240,.9),0 0 120px 50px rgba(100,48,240,.45);opacity:0}
.cta{position:absolute;left:0;right:0;top:1040px;text-align:center;opacity:0}
.cta .btn{display:inline-flex;align-items:center;gap:18px;background:#6430f0;color:#fff;border-radius:999px;padding:26px 64px;font-size:60px;font-weight:700;box-shadow:0 0 80px rgba(100,48,240,.7)}
.cta .btn .m svg{width:52px;height:52px;fill:#fff}
.cta .link{font-family:Geist;font-weight:600;font-size:44px;color:#a58bff;direction:ltr;margin-top:34px}
.cta .free{font-size:40px;color:rgba(247,247,251,.75);margin-top:18px;font-weight:600}
/* end */
.end{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);text-align:center;background:#08080f;padding:40px 70px 46px;border-radius:44px;box-shadow:0 0 0 2px #08080f,0 0 100px 70px rgba(8,8,15,.96);opacity:0}
.end .mk svg{width:130px;height:130px;fill:#a58bff;filter:drop-shadow(0 0 40px rgba(100,48,240,.9))}
.end .ar{font-size:120px;font-weight:700;line-height:1.1;color:#fff;margin-top:14px;white-space:nowrap}
.end .en{font-family:Geist;font-weight:700;font-size:40px;letter-spacing:.14em;color:#a58bff;direction:ltr;margin-top:8px}
.end .slg{font-size:42px;font-weight:600;color:#c9bfff;margin-top:16px}
.end .row{display:flex;justify-content:center;gap:16px;margin-top:34px;direction:ltr;flex-wrap:wrap}
.handle{display:inline-flex;align-items:center;gap:14px;background:#fff;border-radius:999px;padding:12px 30px;color:#0c0b16;font-family:Geist;font-weight:600;font-size:34px;direction:ltr}
.handle .av{width:48px;height:48px;border-radius:50%;background:#6430f0;display:grid;place-items:center}.handle .av svg{width:30px;height:30px;fill:#fff}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 60%,rgba(0,0,0,.35) 100%);opacity:0}
.flash{position:absolute;inset:0;background:#fff;opacity:0}.flashd{position:absolute;inset:0;background:#6430f0;opacity:0}
.grain{position:absolute;inset:-20px;opacity:.07;mix-blend-mode:overlay;pointer-events:none}

.modes{position:absolute;left:60px;right:60px;top:520px;display:flex;flex-direction:column;gap:40px}
.mode{display:flex;align-items:center;gap:34px;background:rgba(255,255,255,.06);border:2px solid rgba(165,139,255,.45);border-radius:40px;padding:44px 40px;opacity:0;will-change:transform}
.mode i{flex:none;width:140px;height:140px;border-radius:50%;background:#6430f0;display:grid;place-items:center;font-style:normal;box-shadow:0 0 50px rgba(100,48,240,.6)}
.mode i svg{width:62px;height:62px;fill:none;stroke:#fff;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.mode b{font-size:80px;color:#fff;line-height:1.15}.mode span{display:block;font-size:40px;color:#c9bfff;margin-top:8px;font-weight:600}
.seatgrid{position:absolute;left:90px;right:90px;top:560px;display:grid;grid-template-columns:repeat(6,1fr);gap:22px}
.seat{aspect-ratio:1;border-radius:22px;background:#f3f0ff;border:2px solid #e2e0ec;display:grid;place-items:center;transition:none}
.seat svg{width:60%;height:60%;fill:none;stroke:#c9bfff;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.seat.on{background:#6430f0;border-color:#6430f0;box-shadow:0 10px 30px rgba(100,48,240,.35)}.seat.on svg{stroke:#fff}
.calc{position:absolute;left:70px;right:70px;top:1130px;text-align:center;opacity:0}
.calc .eq{font-family:Geist;font-weight:600;font-size:52px;color:#4f5368;direction:ltr}
.calc .eq b{color:#0c0b16}
.calc .tot{font-family:Geist;font-weight:700;font-size:120px;color:#6430f0;direction:ltr;margin-top:10px;line-height:1.1}
.calc .lb{font-size:44px;font-weight:700;color:#0c0b16;margin-top:6px}
.ticks{position:absolute;left:70px;right:70px;top:1230px;display:flex;flex-direction:column;gap:22px}
.tick{display:flex;align-items:center;gap:22px;background:#fff;border:2px solid #e2e0ec;border-radius:999px;padding:18px 30px;font-size:46px;font-weight:700;color:#0c0b16;box-shadow:0 16px 50px rgba(12,11,22,.1);opacity:0;will-change:transform}
.tick i{flex:none;width:64px;height:64px;border-radius:50%;background:#1f9d61;display:grid;place-items:center;font-style:normal}.tick i svg{width:38px;height:38px;fill:none;stroke:#fff;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
.form{position:absolute;left:70px;right:70px;top:540px;background:#13121e;border:2px solid rgba(165,139,255,.35);border-radius:40px;padding:40px 44px;opacity:0;text-align:right;box-shadow:0 40px 100px rgba(0,0,0,.5)}
.form .lb{font-size:30px;color:#c9bfff;font-weight:600}
.form .fld{margin-top:12px;background:#08080f;border:1.5px solid rgba(165,139,255,.3);border-radius:22px;padding:20px 26px;font-size:40px;font-weight:600;color:#fff;min-height:96px;line-height:1.45}
.form .fld.d{font-size:32px;font-weight:400;color:rgba(247,247,251,.85);min-height:220px}
.form .fld i{display:inline-block;width:4px;height:1em;background:#a58bff;vertical-align:-.15em;margin-right:4px}
.form .gen{display:inline-flex;align-items:center;gap:12px;margin-top:18px;background:#6430f0;color:#fff;border-radius:999px;padding:12px 30px;font-size:32px;font-weight:700}
</style></head><body><div id="cam"><div class="bg" id="bg"></div><div class="glow" id="glow"></div>
<div class="scene" id="s1"><div class="wm">${mark("m")}IRAQISTAR LIVE</div><div class="big" id="hook">عندك خبرة<br><span class="v">تعلّمها؟</span></div></div>
<div class="scene" id="s2"><div class="wm">${mark("m")}IRAQISTAR LIVE</div><div class="h lt" id="h2">قدّمها بالطريقة<br><span class="v">اللي تناسبك</span></div>
  <div class="modes">${[["جلسة خاصة","أونلاين، وجه لوجه",`<path d="M3 8a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM16 10l5-3v10l-5-3"/>`],["جلسة جماعية","أونلاين، مقعد لكل شخص",`<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M15 20c0-2.6 1.6-4.6 4-5"/>`],["حضوري","بمدينتك، بالمكان اللي تختاره",`<path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>`]].map(([t,d,ic],i)=>`<div class="mode" id="md${i}"><i><svg viewBox="0 0 24 24">${ic}</svg></i><div><b>${t}</b><span>${d}</span></div></div>`).join("")}</div></div>
<div class="scene" id="s3"><div class="wm dk">${mark("m")}IRAQISTAR LIVE</div><div class="h" id="h3">إنت <span class="vd">تحدد</span> كل شي</div>
  <div class="chips" id="chips">${["الموعد","المدّة","سعر المقعد","المكان"].map((v,i)=>`<div class="chip${i===2?" hi":""}" id="ch${i}">${v}</div>`).join("")}</div>
  <div class="phone" id="phg" style="top:600px"><div class="scr"><img class="pg" id="pgg" src="shots/stitched/group-prod.jpg"><img class="hd" src="shots/stitched/header-light.jpg"></div></div></div>
<div class="scene" id="s4"><div class="wm dk">${mark("m")}IRAQISTAR LIVE</div><div class="h" id="h4">جلسة وحدة…<br><span class="vd">18 مقعد</span></div>
  <div class="seatgrid" id="seats">${Array.from({length:18},(_,i)=>`<div class="seat" id="st${i}"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg></div>`).join("")}</div>
  <div class="calc" id="calc"><div class="eq"><b id="nseat">0</b> × 15,000 IQD</div><div class="tot" id="tot">0</div><div class="lb">يوصلك كامل، بساعة وحدة</div></div></div>
<div class="scene" id="s5"><div class="wm dk">${mark("m")}IRAQISTAR LIVE</div><div class="h" id="h5">الحجز، الدفع، والتذكير…<br><span class="vd">علينا</span></div>
  <div class="phone" id="phs" style="top:520px;height:660px"><div class="scr"><img class="pg" id="pgs" src="shots/stitched/sessions-prod.jpg" style="transform:translateY(-440px)"><img class="hd" src="shots/stitched/header-light.jpg"></div></div>
  <div class="ticks">${["رابط جلستك، تشاركه بضغطة","المقعد يتأكد بعد الدفع","تذكير لكل من حجز"].map((t,i)=>`<div class="tick" id="tk${i}"><i><svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg></i>${t}</div>`).join("")}</div></div>
<div class="scene" id="s6"><div class="wm">${mark("m")}IRAQISTAR LIVE</div><div class="h lt" id="h6">حتى وصف الجلسة<br><span class="v">علينا</span></div>
  <div class="form" id="form"><div class="lb">العنوان</div><div class="fld"><span id="ttl"></span><i id="cur1"></i></div><div class="lb" style="margin-top:22px">عن الجلسة</div><div class="fld d"><span id="dsc"></span><i id="cur2"></i></div><div class="gen">${mark("m")}اكتبه لي</div></div></div>
<div class="scene" id="s7"><div class="wm">${mark("m")}IRAQISTAR LIVE</div>${[["الدفع قبل الموعد",`<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>`],["سعرك يوصلك كامل",`<path d="M12 2v20M17 6.5c0-1.9-2.2-3-5-3s-5 1.1-5 3 2.2 3 5 3 5 1.1 5 3-2.2 3-5 3-5-1.1-5-3"/>`],["من المتصفح، بلا تطبيق",`<rect x="3" y="5" width="18" height="13" rx="2"/><path d="M8 21h8M12 18v3"/>`]].map(([t,ic],i)=>`<div class="tr" id="tr${i}"><i><svg viewBox="0 0 24 24">${ic}</svg></i><b>${t}</b></div>`).join("")}</div>
<div class="scene" id="s8"><div class="wm">${mark("m")}IRAQISTAR LIVE</div><div class="tagwrap"><div class="tag" id="tg">إنت نجم<br><span class="v">بحياة شخص.</span></div><div class="bar2" id="barx"></div></div><div class="cta" id="cta"><span class="btn">${mark("m")}انضم كنجم</span><div class="free">التقديم مجاني</div><div class="link">iraqistar.com/apply</div></div></div>
<div class="scene" id="s9">${ribbons("r9")}<div class="end" id="end">${mark("mk")}<div class="ar">نجم العراق</div><div class="en">IRAQISTAR LIVE</div><div class="slg">من نجوم العراق… إليك</div><div class="row"><div class="handle">${mark("av")}@iraqistar.iq</div><div class="handle">iraqistar.com/apply</div></div></div></div>
<div class="vig" id="vig"></div><div class="flash" id="flash"></div><div class="flashd" id="flashd"></div>
<svg class="grain" width="100%" height="100%"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="1" id="turb"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>
</div><script>
const B=${B}, SC=${JSON.stringify(SC)}, DUR=${DUR};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)), eo=x=>1-Math.pow(1-x,3), ei=x=>x*x*x, eio=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2, back=x=>{const c=1.7;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)}, seg=(t,s,d)=>clamp((t-s)/d,0,1), hit=(t,a,l)=>t>=a?Math.exp(-(t-a)/l):0, $=id=>document.getElementById(id), bt=k=>k*B;
function ribbon(id,t,speed){for(let i=0;i<4;i++){$(id+'t'+i).setAttribute('startOffset',(-((t*speed*(1+i*0.25))%1200)-100)+'px');}}
function reveal(tagId,barId,p){const el=$(tagId); const x=(p*116-8); const m=\`linear-gradient(to left,#000 \${x-6}%,#000 \${x}%,transparent \${x+6}%)\`; el.style.webkitMaskImage=m; el.style.maskImage=m; const bar=$(barId); const w=el.getBoundingClientRect().width; bar.style.right=(x/100*w)+'px'; bar.style.opacity=(p>0&&p<1?1:0);}
function pop(id,s,d,dy){const k=back(seg(t_,s,d)); const el=$(id); el.style.opacity=clamp(k*3,0,1); el.style.transform=(el.dataset.base||'')+' translateY('+((1-Math.min(k,1))*(dy==null?40:dy)).toFixed(0)+'px) scale('+(0.85+0.15*Math.min(k,1.1)).toFixed(3)+')'; return k;}
const BRIEF='فيديو قصير لمطعمنا الجديد بالمنصور، يبيّن الأجواء والأطباق المميزة.';
let t_=0;
window.renderAt=t=>{ t_=t;
  $('turb').setAttribute('seed',String(Math.floor(t*30)%40));
  let bg='dark', kick=0, fl=0, fld=0;
  SC.forEach(([id,s,e,mode])=>{const on=t>=bt(s)&&t<bt(e); $(id).style.opacity=on?1:0; if(on)bg=mode; if(s>0){kick+=hit(t,bt(s),0.12)*0.035; if(mode==='dark')fld+=hit(t,bt(s),0.06)*0.4; else fl+=hit(t,bt(s),0.08)*0.5;}});
  $('bg').className='bg'+(bg==='white'?' white':''); $('vig').style.opacity=bg==='dark'?1:0; $('glow').style.opacity=bg==='dark'?(0.6+0.4*Math.sin(t*4)).toFixed(3):0;
  // S1 hook 0-4
  const hk=back(seg(t,0.2,0.5)); $('hook').style.opacity=clamp(hk*3,0,1); $('hook').style.transform=\`translateY(-50%) scale(\${(0.7+0.3*Math.min(hk,1.1)).toFixed(3)})\`; $('hook').style.filter=\`blur(\${((1-Math.min(hk,1))*12).toFixed(1)}px)\`;
  // S2 modes 4-11
  $('h2').style.opacity=eo(seg(t,bt(4),0.35));
  [0,1,2].forEach(i=>{const s=bt(5)+i*1.5*B; const k=back(seg(t,s,0.5)); const el=$('md'+i); el.style.opacity=clamp(k*3,0,1); el.style.transform=\`translateX(\${((1-k)*200).toFixed(0)}px) scale(\${(0.9+0.1*Math.min(k,1.08)).toFixed(3)})\`; if(t>=s){kick+=hit(t,s,0.1)*0.03; fld+=hit(t,s,0.06)*0.3;}});
  // S3 control 11-18
  $('h3').style.opacity=eo(seg(t,bt(11),0.35));
  const fp=back(seg(t,bt(11)+0.1,0.6)); $('phg').style.opacity=clamp(fp*3,0,1); $('phg').style.transform=\`translateX(-50%) translateY(\${((1-fp)*300).toFixed(0)}px)\`; $('pgg').style.transform=\`translateY(\${(-eio(seg(t,bt(12.5),3.5))*260).toFixed(0)}px)\`;
  [0,1,2,3].forEach(i=>{const s=bt(12)+i*1.0*B; const k=back(seg(t,s,0.4)); const el=$('ch'+i); el.style.opacity=clamp(k*3,0,1); el.style.transform=\`scale(\${(0.5+0.5*Math.min(k,1.12)).toFixed(3)})\`; if(t>=s)kick+=hit(t,s,0.08)*0.025;});
  // S4 seats 18-25
  $('h4').style.opacity=eo(seg(t,bt(18),0.35)); $('calc').style.opacity=eo(seg(t,bt(18.6),0.4));
  const ns=Math.round(eo(seg(t,bt(19),3.2))*18); for(let i=0;i<18;i++){$('st'+i).classList.toggle('on',i<ns);} $('nseat').textContent=String(ns); $('tot').textContent=(ns*15000).toLocaleString('en-US')+' IQD';
  if(ns===18)kick+=hit(t,bt(22.2),0.12)*0.04;
  // S5 we handle 25-32
  $('h5').style.opacity=eo(seg(t,bt(25),0.35)); pop('phs',bt(25.2),0.55,120); $('phs').style.transform=$('phs').style.transform.replace('scale','translateX(-50%) scale');
  [0,1,2].forEach(i=>{const s=bt(26.5)+i*1.3*B; const k=back(seg(t,s,0.45)); const el=$('tk'+i); el.style.opacity=clamp(k*3,0,1); el.style.transform=\`translateX(\${((1-k)*160).toFixed(0)}px)\`; if(t>=s)kick+=hit(t,s,0.08)*0.025;});
  // S6 description 32-39
  $('h6').style.opacity=eo(seg(t,bt(32),0.35)); pop('form',bt(32.3),0.5,60);
  const T1='محادثة إنجليزية للمبتدئين'; const n1=Math.floor(seg(t,bt(33),1.2)*T1.length); $('ttl').textContent=T1.slice(0,n1); $('cur1').style.opacity=(t<bt(34.6)&&Math.floor(t*3)%2)?1:0;
  const D1='جلسة أسبوعية نتدرّب بيها على المحادثة اليومية بثقة: تحية، تعارف، ومواقف من الحياة. مناسبة لمن يعرف الأساسيات ويريد يحچي بدون خوف.'; const n2=Math.floor(eo(seg(t,bt(35),2.4))*D1.length); $('dsc').textContent=D1.slice(0,n2); $('cur2').style.opacity=(t>=bt(35)&&Math.floor(t*3)%2)?1:0;
  // S7 trust 39-48
  [0,1,2].forEach(i=>{const s=bt(39+i*3), e=s+3*B; const on=t>=s&&t<e; const k=back(seg(t,s,0.4)); const el=$('tr'+i); el.style.opacity=on?clamp(k*3,0,1):0; el.style.transform=\`translateY(-50%) scale(\${(0.75+0.25*Math.min(k,1.1)).toFixed(3)})\`; if(on){kick+=hit(t,s,0.1)*0.035; fld+=hit(t,s,0.06)*0.3;}});
  // S8 cta 48-57
  reveal('tg','barx',eio(seg(t,bt(48)+0.1,2.2*B)));
  const cb=back(seg(t,bt(51),0.45)); $('cta').style.opacity=clamp(cb*3,0,1); $('cta').style.transform=\`scale(\${(0.7+0.3*Math.min(cb,1.1)).toFixed(3)})\`; kick+=hit(t,bt(51),0.1)*0.03;
  // S9 end 57-65
  ribbon('r9',t,220); const k9=back(seg(t,bt(57)+0.05,0.55)); $('end').style.opacity=clamp(k9*3,0,1); $('end').style.transform=\`translate(-50%,-50%) scale(\${(0.6+0.4*k9).toFixed(3)})\`;
  const r=seg(t,bt(55),bt(57)-bt(55)); const shake=r>0&&r<1?Math.sin(t*95)*2.5*r:0;
  $('cam').style.transform=\`scale(\${(1+0.02*(t/DUR)+kick+0.05*ei(r)).toFixed(4)}) translate(\${shake.toFixed(1)}px,0)\`;
  $('flash').style.opacity=clamp(fl+(t>=bt(57)?hit(t,bt(57),0.14)*0.9:0),0,1).toFixed(3); $('flashd').style.opacity=clamp(fld,0,1).toFixed(3);
  document.body.style.opacity=(1-eo(seg(t,DUR-0.5,0.5))).toFixed(3);
};
</script></body></html>`;
fs.writeFileSync("sess.html", html);
const dir = "frames"; if (!process.argv[2]) fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }); const p = await b.newPage({ viewport: { width: W, height: H } });
p.on("pageerror", e => console.log("PAGEERR", e.message));
await p.goto("file://" + process.cwd() + "/sess.html"); await p.evaluate(() => document.fonts.ready);
const only = process.argv[2] ? process.argv[2].split(",").map(Number) : null;
for (let f = 0; f < Math.round(DUR * FPS); f++) { if (only && !only.includes(f)) continue; await p.evaluate(t => window.renderAt(t), f / FPS); await p.screenshot({ path: `${dir}/${String(f).padStart(4, "0")}.jpg`, type: "jpeg", quality: 90 }); }
await b.close();
if (!only) execSync(`ffmpeg -v error -y -framerate ${FPS} -i ${dir}/%04d.jpg -c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium -movflags +faststart sess-silent.mp4`);
console.log("done", DUR);
