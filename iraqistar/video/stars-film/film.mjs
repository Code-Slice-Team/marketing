// نجم العراق — star-facing brand film cut to the Rafoush v4 VO (+0.5 s). 1920x1080, 92 s, light violet illustration style.
import { chromium } from "playwright"; import fs from "node:fs"; import { execSync } from "node:child_process";
const FPS = 30, W = 1920, H = 1080, DUR = 92.0, O = 0.5;
const MARK = "M12.00 0.80 L14.49 5.99 L19.92 4.08 L18.01 9.51 L23.20 12.00 L18.01 14.49 L19.92 19.92 L14.49 18.01 L12.00 23.20 L9.51 18.01 L4.08 19.92 L5.99 14.49 L0.80 12.00 L5.99 9.51 L4.08 4.08 L9.51 5.99 Z M9.40 8.10 L16.40 12.00 L9.40 15.90 Z";
const mark = cls => `<span class="${cls}"><svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="${MARK}"/></svg></span>`;
const I = (d, cls = "") => `<svg class="ic ${cls}" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${d}</g></svg>`;
const IC = {
  person: `<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>`,
  heart: `<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>`,
  cap: `<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/>`,
  video: `<path d="M4 7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM16 10l5-3v10l-5-3"/>`,
  users: `<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M15 20c0-2.6 1.6-4.6 4-5"/>`,
  lock: `<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>`,
  check: `<path d="m5 12.5 4.5 4.5L19 7.5"/>`,
  x: `<path d="M6 6l12 12M18 6L6 18"/>`,
  wallet: `<path d="M3 7a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM16 12h4"/><circle cx="16" cy="13" r="1"/>`,
  clock: `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>`,
  timer: `<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 1.5M9 2h6M12 2v3"/>`,
  cake: `<path d="M4 20h16v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2zM4 16c2 1.5 4-1.5 6 0s4 1.5 6 0 2-1.5 4 0M12 8v4M12 4v1"/>`,
  ring: `<circle cx="12" cy="14" r="6"/><path d="M9 8l3-4 3 4"/>`,
  star: `<path d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.5 9.3l6.1-.7z"/>`,
  gift: `<rect x="3" y="8" width="18" height="4"/><path d="M5 12v8h14v-8M12 8v12M12 8c-2-4-6-4-6-1.5S10 8 12 8zm0 0c2-4 6-4 6-1.5S14 8 12 8z"/>`,
  msg: `<path d="M4 5h16v11H9l-5 4z"/>`,
  book: `<path d="M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z"/>`,
  smile: `<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>`,
  sad: `<circle cx="12" cy="12" r="9"/><path d="M8 16s1.5-2 4-2 4 2 4 2M9 9h.01M15 9h.01"/>`,
  baby: `<circle cx="12" cy="12" r="9"/><path d="M9 10h.01M15 10h.01M9 14c1 1.3 2 2 3 2s2-.7 3-2M12 3c0 2-2 2-2 4"/>`,
  med: `<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/>`,
  laugh: `<circle cx="12" cy="12" r="9"/><path d="M7 13h10c0 3-2.5 5-5 5s-5-2-5-5zM8 9l2 1M16 9l-2 1"/>`,
  bolt: `<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>`,
  share: `<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>`,
  bookmark: `<path d="M6 3h12v18l-6-4-6 4z"/>`,
  teacher: `<circle cx="12" cy="7" r="3.5"/><path d="M5 21c0-4 3-6.5 7-6.5s7 2.5 7 6.5M3 4h6M3 7h4"/>`,
  stetho: `<path d="M6 3v6a6 6 0 0 0 12 0V3M12 15v2a4 4 0 0 0 8 0v-1"/><circle cx="20" cy="14" r="2"/>`,
  whistle: `<circle cx="9" cy="14" r="5"/><path d="M13 11l8-3v4l-7 2"/>`,
  tutor: `<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4M7 9h6M7 12h10"/>`,
};
const v = x => x + O;
const SC = [["s1",0,8.0],["s2",8.0,14.2],["s3",14.2,25.0],["s4",25.0,35.0],["s5",35.0,38.9],["s6",38.9,48.0],["s7",48.0,61.2],["s8",61.2,71.0],["s9",71.0,76.5],["s10",76.5,82.0],["s11",82.0,84.0],["s12",84.0,92]];
const BUBS = [["وين الفيديو الجديد؟",IC.msg,80,60],["أحبك!",IC.heart,560,30],["ممكن تهنئة لأختي؟",IC.msg,40,250],["ردّ عليّ تكفى",IC.msg,600,230],["أول تعليق!",IC.msg,120,440],["منو يشوف من البصرة؟",IC.msg,520,430],["حبيبي ردّ",IC.heart,60,630],["تهنئة لأبوي؟",IC.msg,560,640]];
const CHIPS = [["عيد ميلاد",IC.cake],["خطوبة",IC.ring],["تخرّج",IC.cap],["مولود جديد",IC.baby],["شفاء عاجل",IC.med],["مزحة لصديق",IC.laugh],["تشجيع",IC.bolt],["نجاح",IC.star],["أحبك",IC.heart]];
const STARS = [["معلّمة الروضة","بعين الأطفال",IC.teacher],["المدرّس","بعين طلابه",IC.tutor],["الطبيب","بعين مرضاه",IC.stetho],["المدرّب","بعين لاعبيه",IC.whistle]];
const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-Regular.ttf);font-weight:400}
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-SemiBold.ttf);font-weight:600}
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-Bold.ttf);font-weight:700}
@font-face{font-family:Geist;src:url(fonts/Geist-Bold.ttf);font-weight:700}
@font-face{font-family:Geist;src:url(fonts/Geist-SemiBold.ttf);font-weight:600}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#f4f1ff;color:#1d1640;font-family:"IBM Plex Sans Arabic",sans-serif;position:relative}
#cam{position:absolute;inset:0;transform-origin:50% 50%}
.bg{position:absolute;inset:0;background:linear-gradient(160deg,#f7f4ff,#e9e2ff)}.bg:after{content:"";position:absolute;left:-200px;top:-300px;width:900px;height:900px;border-radius:50%;background:radial-gradient(circle,rgba(100,48,240,.16),rgba(100,48,240,0) 65%)}.bg:before{content:"";position:absolute;right:-300px;bottom:-400px;width:1100px;height:1100px;border-radius:50%;background:radial-gradient(circle,rgba(255,122,156,.12),rgba(255,122,156,0) 65%)}
#panel{position:absolute;inset:0}
.scene{position:absolute;inset:0;opacity:0}
.wm{position:absolute;top:40px;left:0;right:0;display:flex;justify-content:center;align-items:center;gap:12px;font-family:Geist;font-weight:700;font-size:24px;letter-spacing:.18em;direction:ltr;color:rgba(29,22,64,.55)}
.wm .m svg{width:28px;height:28px;fill:#6430f0}
.v{color:#6430f0}.pk{color:#ff7a9c}
.ic{width:100%;height:100%}
.o0{opacity:0}
/* layout: text column right (x 1000-1840), art column left (x 80-920) */
.txt{position:absolute;right:90px;width:820px;top:50%;transform:translateY(-50%);text-align:right}
.art{position:absolute;left:90px;width:820px;top:120px;bottom:60px}
.h{font-size:72px;font-weight:700;line-height:1.3;color:#1d1640;opacity:0}
.h.sm{font-size:48px;color:#6b6590;font-weight:600;margin-top:24px}
.big{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;font-size:150px;font-weight:700;color:#1d1640;opacity:0}
.bd{display:inline-block;background:#6430f0;color:#fff;border-radius:.5em;padding:.14em .6em .22em;font-size:52px;font-weight:700;box-shadow:0 20px 50px rgba(100,48,240,.35);opacity:0}
.bd .pk{color:#ffd9e4}
.bd.g{background:#1f9d61;box-shadow:0 20px 50px rgba(31,157,97,.35)}
.card{background:#fff;border-radius:36px;box-shadow:0 30px 70px rgba(100,48,240,.14),0 2px 0 #ddd6ff;opacity:0;will-change:transform}
/* s1 profile + bubbles */
.prof{position:absolute;left:230px;top:200px;width:360px;padding:40px 30px;text-align:center}
.prof .av{width:170px;height:170px;border-radius:50%;margin:0 auto;display:grid;place-items:center;background:linear-gradient(160deg,#6430f0,#a58bff);color:#fff}.prof .av .ic{width:100px;height:100px}
.prof b{display:block;font-size:40px;margin-top:20px}.prof span{display:block;font-size:24px;color:#6b6590;margin-top:4px;font-weight:600}
.prof .badge{display:inline-block;margin-top:16px;background:#f3f0ff;border:1.5px solid #ddd6ff;border-radius:999px;padding:6px 22px;font-family:Geist;font-weight:700;font-size:26px;direction:ltr;color:#6430f0}
.bub{position:absolute;display:flex;align-items:center;gap:14px;background:#fff;border-radius:999px;padding:14px 26px;font-size:28px;font-weight:600;color:#1d1640;box-shadow:0 16px 40px rgba(100,48,240,.16),0 2px 0 #ddd6ff;opacity:0;white-space:nowrap}
.bub i{width:44px;height:44px;border-radius:50%;background:#fff0f4;color:#ff7a9c;display:grid;place-items:center;flex:none}.bub i .ic{width:26px;height:26px}
.unread{position:absolute;left:560px;top:160px;background:#ff3b5c;color:#fff;border-radius:999px;padding:8px 22px;font-family:Geist;font-weight:700;font-size:36px;direction:ltr;box-shadow:0 14px 40px rgba(255,59,92,.45);opacity:0}
.clock{position:absolute;left:330px;top:720px;width:160px;height:160px;color:#6430f0;opacity:0}
/* s2 pills */
.pills{display:flex;flex-direction:column;gap:26px;position:absolute;left:120px;top:300px;width:720px}
.pill{display:flex;align-items:center;gap:24px;background:#fff;border-radius:999px;padding:22px 34px;font-size:56px;font-weight:700;color:#1d1640;box-shadow:0 20px 50px rgba(100,48,240,.18),0 2px 0 #ddd6ff;opacity:0;will-change:transform}
.pill i{width:90px;height:90px;border-radius:50%;background:#6430f0;color:#fff;display:grid;place-items:center;flex:none}.pill i .ic{width:54px;height:54px}.pill i.g{background:#1f9d61}.pill i.p{background:#ff7a9c}
/* s3/s4 story art */
.gift{position:absolute;left:240px;top:230px;width:340px;height:340px;border-radius:50%;background:#fff;display:grid;place-items:center;color:#6430f0;box-shadow:0 30px 70px rgba(100,48,240,.16),0 2px 0 #ddd6ff;opacity:0}.gift .ic{width:190px;height:190px}
.gift .q{position:absolute;right:-10px;top:-10px;width:100px;height:100px;border-radius:50%;background:#ff7a9c;color:#fff;display:grid;place-items:center;font-family:Geist;font-weight:700;font-size:64px;box-shadow:0 14px 40px rgba(255,122,156,.5)}
.req{position:absolute;left:60px;top:230px;width:700px;padding:38px 42px;text-align:right}
.req .who{display:flex;align-items:center;gap:20px}.req .av{width:80px;height:80px;border-radius:50%;background:#f3f0ff;display:grid;place-items:center;color:#6430f0;flex:none}.req .av .ic{width:48px;height:48px}
.req b{font-size:38px}.req small{display:block;font-size:24px;color:#6b6590;margin-top:4px;font-weight:600}
.req .chip{display:inline-flex;align-items:center;gap:10px;margin-top:20px;border:2px solid #6430f0;background:#f3f0ff;color:#6430f0;border-radius:999px;padding:8px 20px;font-size:26px;font-weight:700}.req .chip .ic{width:28px;height:28px}
.req p{font-size:32px;line-height:1.55;color:#2b2a3a;margin-top:18px}
.req .dur{display:flex;align-items:center;gap:14px;margin-top:20px;font-family:Geist;font-weight:700;font-size:34px;direction:ltr;justify-content:flex-end;color:#1d1640}.req .dur .ic{width:40px;height:40px;color:#6430f0}
.hearts{position:absolute;left:0;top:0;width:820px;height:900px;pointer-events:none}
.hearts span{position:absolute;width:60px;height:60px;color:#ff7a9c;opacity:0}
.okb{position:absolute;left:560px;top:120px;width:150px;height:150px;border-radius:50%;background:#7bf1a8;color:#0a0a10;display:grid;place-items:center;box-shadow:0 30px 80px rgba(46,204,113,.45);opacity:0}.okb .ic{width:84px;height:84px}
.mood{position:absolute;left:130px;top:700px;width:560px;padding:22px 30px;display:flex;align-items:center;gap:20px;text-align:right}
.mood .ic{width:60px;height:60px;color:#ff7a9c;flex:none}.mood .bar{flex:1;height:18px;border-radius:9px;background:#f1eefb;overflow:hidden}.mood .bar i{display:block;height:100%;width:25%;background:#ff7a9c;border-radius:9px}
.mood b{font-size:26px;color:#6b6590;font-weight:600;white-space:nowrap}
/* s5 chips grid */
.grid{position:absolute;left:120px;right:120px;top:300px;display:flex;flex-wrap:wrap;justify-content:center;gap:28px}
.gc{display:flex;align-items:center;gap:18px;background:#fff;border-radius:999px;padding:20px 40px;font-size:50px;font-weight:700;box-shadow:0 20px 50px rgba(100,48,240,.16),0 2px 0 #ddd6ff;opacity:0;will-change:transform}
.gc i{width:70px;height:70px;border-radius:50%;background:#f3f0ff;color:#6430f0;display:grid;place-items:center;flex:none}.gc i .ic{width:44px;height:44px}
.hc{position:absolute;left:0;right:0;top:120px;text-align:center;font-size:72px;font-weight:700;opacity:0}
/* s6 gifts */
.oldg{position:absolute;left:110px;top:260px;width:620px;display:flex;justify-content:space-between}
.oldg .g{width:200px;height:200px;border-radius:40px;background:#fff;display:grid;place-items:center;color:#b8b3cc;box-shadow:0 20px 50px rgba(29,22,64,.08);position:relative;opacity:0}.oldg .g .ic{width:100px;height:100px}
.oldg .g .tag{position:absolute;right:-16px;top:-16px;background:#ff3b5c;color:#fff;font-family:Geist;font-weight:700;font-size:22px;border-radius:999px;padding:6px 14px;direction:ltr}
.strike{position:absolute;left:100px;top:345px;height:12px;width:0;background:#ff3b5c;border-radius:6px;transform:rotate(-6deg);transform-origin:left center;box-shadow:0 8px 24px rgba(255,59,92,.4)}
.ch3{position:absolute;left:120px;top:560px;width:620px;display:flex;flex-direction:column;gap:18px}
.ch3 .c{display:flex;align-items:center;gap:18px;background:#fff;border-radius:999px;padding:18px 30px;font-size:44px;font-weight:700;box-shadow:0 16px 40px rgba(100,48,240,.16),0 2px 0 #ddd6ff;opacity:0;will-change:transform;width:fit-content}
.ch3 .c i{width:60px;height:60px;border-radius:50%;background:#6430f0;color:#fff;display:grid;place-items:center;flex:none}.ch3 .c i .ic{width:36px;height:36px}
.two{display:flex;gap:30px;justify-content:flex-end;margin-top:30px}
.two .h2{display:flex;align-items:center;gap:14px;background:#fff;border-radius:999px;padding:14px 28px;font-size:34px;font-weight:700;box-shadow:0 16px 40px rgba(100,48,240,.16),0 2px 0 #ddd6ff;opacity:0}.two .h2 .ic{width:44px;height:44px;color:#ff7a9c}
/* s7 stars */
.srow{position:absolute;left:100px;right:100px;top:360px;display:flex;gap:34px;direction:rtl}
.sc{flex:1;background:#fff;border-radius:40px;padding:40px 20px 36px;text-align:center;opacity:0;will-change:transform;box-shadow:0 30px 70px rgba(100,48,240,.14),0 2px 0 #ddd6ff;position:relative}
.sc .av{width:170px;height:170px;border-radius:50%;margin:0 auto;display:grid;place-items:center;background:linear-gradient(160deg,#6430f0,#a58bff);color:#fff}.sc .av .ic{width:96px;height:96px}
.sc:nth-child(2) .av{background:linear-gradient(160deg,#1f9d61,#7bf1a8)}.sc:nth-child(3) .av{background:linear-gradient(160deg,#ff7a9c,#ffb8c9)}.sc:nth-child(4) .av{background:linear-gradient(160deg,#f0a030,#ffd27a)}
.sc b{display:block;font-size:42px;margin-top:24px}.sc span{display:block;font-size:30px;color:#6b6590;margin-top:8px;font-weight:600}
.sc .st{position:absolute;right:24px;top:24px;width:64px;height:64px;color:#f0a030}
/* s8 record */
.rec{position:absolute;left:290px;top:140px;width:400px;height:820px;background:#1d1640;border-radius:56px;padding:12px;box-shadow:0 50px 120px rgba(29,22,64,.3);opacity:0}
.rec .cam{position:relative;width:100%;height:100%;border-radius:46px;overflow:hidden;background:radial-gradient(ellipse at 50% 35%,#a58bff,#6430f0 75%)}
.rec .sil{position:absolute;left:50%;bottom:0;width:360px;height:480px;transform:translateX(-50%);color:rgba(255,255,255,.55)}
.rec .top{position:absolute;top:26px;left:0;right:0;display:flex;justify-content:center;align-items:center;gap:14px;font-family:Geist;font-weight:700;font-size:32px;color:#fff;direction:ltr}
.rec .dot{width:20px;height:20px;border-radius:50%;background:#ff3b5c;box-shadow:0 0 20px #ff3b5c}
.rec .nm{position:absolute;left:50%;bottom:150px;transform:translateX(-50%);background:rgba(255,255,255,.92);color:#1d1640;border-radius:999px;padding:10px 26px;font-size:28px;font-weight:700;white-space:nowrap}
.rec .btn{position:absolute;left:50%;bottom:40px;transform:translateX(-50%);width:100px;height:100px;border-radius:50%;border:7px solid #fff;display:grid;place-items:center}.rec .btn i{width:64px;height:64px;border-radius:50%;background:#ff3b5c;display:block}
.acts{display:flex;flex-direction:column;gap:16px;align-items:flex-start;margin-top:26px;direction:rtl}
.acts .a{display:flex;align-items:center;gap:16px;background:#fff;border-radius:999px;padding:12px 26px;font-size:36px;font-weight:700;box-shadow:0 16px 40px rgba(100,48,240,.16),0 2px 0 #ddd6ff;opacity:0}.acts .a i{width:54px;height:54px;border-radius:50%;background:#f3f0ff;color:#6430f0;display:grid;place-items:center;flex:none}.acts .a i .ic{width:32px;height:32px}
.eq{position:absolute;right:90px;width:820px;top:50%;transform:translateY(-50%);text-align:center;opacity:0}
.eq .l{font-size:54px;font-weight:700}.eq .r{display:flex;justify-content:center;gap:22px;margin-top:26px;align-items:center}
.eq .t{background:#fff;border-radius:999px;padding:16px 30px;font-size:40px;font-weight:700;box-shadow:0 16px 40px rgba(100,48,240,.16),0 2px 0 #ddd6ff;display:flex;align-items:center;gap:12px;opacity:0}.eq .t .ic{width:44px;height:44px;color:#ff7a9c}
.eq .plus{font-family:Geist;font-weight:700;font-size:60px;color:#6430f0}
.eq .cnt{margin-top:26px;font-family:Geist;font-weight:700;font-size:64px;color:#1f9d61;direction:ltr;opacity:0}
/* s9 control */
.price{position:absolute;left:100px;top:200px;width:620px;padding:30px 36px;text-align:right}
.price .lb{font-size:30px;font-weight:700}.price .row{display:flex;gap:14px;margin-top:20px;flex-wrap:wrap;justify-content:flex-end}
.price .pc{border:2px solid #e2e0ec;border-radius:999px;padding:10px 24px;font-family:Geist;font-weight:700;font-size:28px;direction:ltr}.price .pc.on{background:#6430f0;border-color:#6430f0;color:#fff}
.price .row2{display:flex;gap:16px;margin-top:26px;justify-content:flex-end;align-items:center}
.price .tg{display:flex;align-items:center;gap:10px;border-radius:999px;padding:10px 22px;font-size:26px;font-weight:700;border:2px solid #e2e0ec;color:#6b6590}.price .tg .ic{width:30px;height:30px}
.price .tg.ok{background:#e6f8ee;border-color:#1f9d61;color:#1f9d61}.price .tg.no{background:#fff0f4;border-color:#ff7a9c;color:#ff3b5c}
.lockb{position:absolute;left:300px;top:640px;width:150px;height:150px;border-radius:50%;background:#7bf1a8;color:#0a0a10;display:grid;place-items:center;box-shadow:0 30px 80px rgba(46,204,113,.45);opacity:0}.lockb .ic{width:84px;height:84px}
.paid{position:absolute;left:470px;top:680px;background:#1f9d61;color:#fff;border-radius:999px;padding:12px 36px;font-size:40px;font-weight:700;opacity:0;white-space:nowrap}
/* s10 mission */
.conn{position:absolute;left:90px;top:300px;width:820px;height:420px}
.conn .n{position:absolute;top:60px;width:260px;height:260px;border-radius:50%;background:#fff;display:grid;place-items:center;box-shadow:0 30px 70px rgba(100,48,240,.16),0 2px 0 #ddd6ff;opacity:0}
.conn .n .ic{width:130px;height:130px;color:#6430f0}.conn .n b{position:absolute;bottom:-60px;left:0;right:0;text-align:center;font-size:32px;color:#6b6590;font-weight:600}
.conn svg.ln{position:absolute;left:0;top:0;width:820px;height:420px;overflow:visible}
.conn .ln path{stroke:#6430f0;stroke-width:10;fill:none;stroke-linecap:round;stroke-dasharray:400;stroke-dashoffset:400}
.sec{position:absolute;left:280px;top:720px;display:flex;align-items:center;gap:20px;background:#1d1640;color:#fff;border-radius:999px;padding:16px 34px;font-size:36px;font-weight:700;opacity:0;white-space:nowrap}.sec .ic{width:48px;height:48px;color:#7bf1a8}
/* s11 */
.ctaw{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;opacity:0}
.ctaw .t{font-size:96px;font-weight:700;line-height:1.3}
.ctaw .link{font-family:Geist;font-weight:700;font-size:44px;color:#6430f0;direction:ltr;margin-top:30px}
.consts{position:absolute;inset:0;opacity:0}.consts .m{position:absolute;color:#6430f0}.consts .m svg{width:100%;height:100%;fill:currentColor}
/* s12 sting */
#s12{background:linear-gradient(160deg,#6430f0,#4b1fd1)}
.tagwrap{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;padding:0 40px}
.tag{font-size:140px;font-weight:700;line-height:1.3;color:#fff;white-space:nowrap;text-shadow:0 0 40px rgba(255,255,255,.25);-webkit-mask-image:linear-gradient(to left,#000 0%,#000 0%,transparent 0%);mask-image:linear-gradient(to left,#000 0%,#000 0%,transparent 0%)}
.bar{position:absolute;top:-10%;height:120%;width:14px;background:linear-gradient(to bottom,rgba(165,139,255,0),#fff 40%,#a58bff 60%,rgba(165,139,255,0));border-radius:8px;box-shadow:0 0 60px 18px rgba(100,48,240,.9),0 0 120px 50px rgba(100,48,240,.45);opacity:0}
.slam{position:absolute;left:0;right:0;top:50%;text-align:center;font-size:250px;font-weight:700;color:#ffd9e4;opacity:0;white-space:nowrap;text-shadow:0 0 60px rgba(255,255,255,.5)}
.logo{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;opacity:0}
.logo .mk{display:inline-block;width:230px;height:230px}.logo .mk svg{width:100%;height:100%;fill:#fff;filter:drop-shadow(0 0 50px rgba(255,255,255,.6))}
.logo .ar{font-size:120px;font-weight:700;line-height:1.1;margin-top:14px;color:#fff}
.logo .en{font-family:Geist;font-weight:700;font-size:38px;letter-spacing:.2em;text-indent:.2em;color:#ffd9e4;direction:ltr;margin-top:10px}
.logo .links{margin-top:26px;font-family:Geist;font-weight:700;font-size:38px;color:rgba(255,255,255,.9);direction:ltr;opacity:0}
.ringx{position:absolute;left:50%;top:calc(50% - 135px);width:230px;height:230px;border-radius:50%;border:4px solid rgba(255,255,255,.9);transform:translate(-50%,-50%) scale(0);opacity:0;box-shadow:0 0 60px rgba(100,48,240,.8)}
.flash{position:absolute;inset:0;background:#fff;opacity:0}.flashd{position:absolute;inset:0;background:#a58bff;opacity:0}
.fade{position:absolute;inset:0;background:#000;opacity:0}
.grain{position:absolute;inset:-20px;opacity:.04;mix-blend-mode:overlay;pointer-events:none}
</style></head><body><div id="cam"><div class="bg"></div>
<div id="panel">
<div class="scene" id="s1"><div class="wm">${mark("m")}IRAQISTAR</div><div class="big" id="hi">مرحبا</div>
  <div class="art"><div class="card prof" id="prof"><div class="av">${I(IC.person)}</div><b>إنت</b><span>نجم بعيون جمهورك</span><div class="badge">1.8M</div></div><div class="unread" id="unread">0</div>
  ${BUBS.map(([t,ic,x,y],i)=>`<div class="bub" id="bb${i}" style="left:${x}px;top:${y}px"><i>${I(ic)}</i>${t}</div>`).join("")}</div>
  <div class="txt"><div class="h" id="h1a">مئات التعليقات والرسائل…<br><span class="v">كل يوم.</span></div><div class="h sm" id="h1b">وما عندك وقت تردّ على الكل.</div><div class="h" id="h1c" style="font-size:140px;margin-top:30px;color:#6430f0">صح؟</div></div></div>
<div class="scene" id="s2"><div class="wm">${mark("m")}IRAQISTAR</div>
  <div class="txt"><div class="h" id="h2a">بنجم العراق،<br>تحوّل حب جمهورك…</div><div class="h sm" id="h2b" style="font-size:44px">خلّيني أگلك شلون.</div></div>
  <div class="pills"><div class="pill" id="pl0"><i class="p">${I(IC.heart)}</i>لشي يفرّحهم</div><div class="pill" id="pl1"><i class="g">${I(IC.wallet)}</i>ويفيدك</div></div></div>
<div class="scene" id="s3"><div class="wm">${mark("m")}IRAQISTAR</div>
  <div class="art"><div class="gift" id="gift">${I(IC.gift)}<span class="q">?</span></div>
    <div class="card req" id="req3"><div class="who"><div class="av">${I(IC.person)}</div><div><b>طلب من: زوجها</b><small>رسالة فيديو باسمها</small></div></div><div class="chip">${I(IC.cake)}عيد ميلاد</div><p>«لزوجتي رنا… هي تحبك من زمان، هنّيها بعيد ميلادها»</p><div class="dur">${I(IC.timer)}<span id="d3">15</span> sec</div></div>
    <div class="hearts" id="hearts">${Array.from({length:10},(_,i)=>`<span style="left:${80+(i*137)%600}px;top:${120+(i*91)%520}px">${I(IC.heart)}</span>`).join("")}</div></div>
  <div class="txt"><div class="h" id="h3a">زوج محتار…<br><span class="v">شيجيب هدية لزوجته؟</span></div><div class="h sm" id="h3b">فيديو ١٥ ثانية، من نجم هي تحبه.</div><div style="margin-top:34px"><span class="bd" id="b3a">تخيّل <span class="pk">فرحتها</span></span></div><div style="margin-top:22px"><span class="bd g" id="b3b">تخيّل لو وصلك إنت هيچ فيديو</span></div></div></div>
<div class="scene" id="s4"><div class="wm">${mark("m")}IRAQISTAR</div>
  <div class="art"><div class="gift" id="book">${I(IC.book)}</div><div class="card mood" id="mood">${I(IC.sad)}<div class="bar"><i id="moodb"></i></div><b>نفسيته تعبانة</b></div>
    <div class="card req" id="req4"><div class="who"><div class="av">${I(IC.person)}</div><div><b>طلب من: أبوه</b><small>رسالة تشجيع</small></div></div><div class="chip">${I(IC.bolt)}قبل الامتحان</div><p>«ابني علي يحبك هواية… گلّه كلمة تشجّعه باچر بالامتحان»</p></div>
    <div class="okb" id="okb">${I(IC.check)}</div></div>
  <div class="txt"><div class="h" id="h4a">طالب عنده امتحان…<br><span class="v">ونفسيته تعبانة.</span></div><div class="h sm" id="h4b">أبوه يطلب فيديو من نجم يحبه ابنه.</div><div style="margin-top:34px"><span class="bd g" id="b4a">ممكن يصير سبب <span class="pk">بنجاحه</span></span></div></div></div>
<div class="scene" id="s5"><div class="wm">${mark("m")}IRAQISTAR</div><div class="hc" id="h5">أمثلة تصير <span class="v">كل يوم</span>… ويّا كل واحد بينا</div>
  <div class="grid">${CHIPS.map(([t,ic],i)=>`<div class="gc" id="gc${i}"><i>${I(ic)}</i>${t}</div>`).join("")}</div></div>
<div class="scene" id="s6"><div class="wm">${mark("m")}IRAQISTAR</div>
  <div class="art"><div class="oldg">${[["g0","$120"],["g1","$300"],["g2","$85"]].map(([id,p])=>`<div class="g" id="${id}">${I(IC.gift)}<span class="tag">${p}</span></div>`).join("")}</div><div class="strike" id="strike"></div>
    <div class="ch3">${[["c0","كلمة حلوة",IC.msg],["c1","مزحة خفيفة",IC.laugh],["c2","تشجيع من شخص يحبه",IC.bolt]].map(([id,t,ic])=>`<div class="c" id="${id}"><i>${I(ic)}</i>${t}</div>`).join("")}</div></div>
  <div class="txt"><div class="h" id="h6a">الهدايا صارت<br><span style="color:#ff3b5c">مملّة وغالية…</span></div><div class="h" id="h6b" style="margin-top:30px">هذي هدية <span class="v">ما تنتسى.</span></div>
    <div class="two"><div class="h2" id="hh0">${I(IC.heart)}للجمهور</div><div class="h2" id="hh1">${I(IC.heart)}وللنجم</div></div></div></div>
<div class="scene" id="s7"><div class="wm">${mark("m")}IRAQISTAR</div><div class="hc" id="h7">كل واحد هو <span class="v">نجم</span> بعين شخص</div>
  <div class="srow">${STARS.map(([a,b,ic],i)=>`<div class="sc" id="sc${i}"><span class="st">${I(IC.star)}</span><div class="av">${I(ic)}</div><b>${a}</b><span>${b}</span></div>`).join("")}</div></div>
<div class="scene" id="s8"><div class="wm">${mark("m")}IRAQISTAR</div>
  <div class="art"><div class="rec" id="rec"><div class="cam"><svg class="sil" viewBox="0 0 100 100" preserveAspectRatio="xMidYMax slice"><circle cx="50" cy="38" r="17" fill="currentColor"/><path d="M12 100c2-26 17-38 38-38s36 12 38 38Z" fill="currentColor"/></svg><div class="top"><span class="dot" id="dot"></span><span id="tmr">00:00</span></div><div class="nm">إلى: علي</div><div class="btn"><i></i></div></div></div></div>
  <div class="txt" id="t8"><div class="h" id="h8a">تسجّل فيديو…<br><span class="v">وتگول اسمه.</span></div>
    <div class="acts">${[["a0","راح يحتفظ بيه",IC.bookmark],["a1","وينشره",IC.share],["a2","ويحچي عنه",IC.msg]].map(([id,t,ic])=>`<div class="a" id="${id}"><i>${I(ic)}</i>${t}</div>`).join("")}</div></div>
  <div class="eq" id="eq"><div class="l">دقيقة من وقتك =</div><div class="r"><div class="t" id="e0">${I(IC.heart)}فرحة لواحد</div><span class="plus">+</span><div class="t" id="e1">${I(IC.users)}جمهور جديد إلك</div></div><div class="cnt" id="cnt">+0 followers</div></div></div>
<div class="scene" id="s9"><div class="wm">${mark("m")}IRAQISTAR</div>
  <div class="art"><div class="card price" id="price"><div class="lb">رسالة فيديو شخصية · سعرك</div><div class="row">${["25,000","50,000","75,000","100,000"].map((p,i)=>`<span class="pc" id="pc${i}">${p}</span>`).join("")}</div>
    <div class="row2"><span class="tg" id="tgok">${I(IC.check)}أقبل</span><span class="tg" id="tgno">${I(IC.x)}أرفض</span><span style="font-size:24px;color:#6b6590;font-weight:600">طلب جديد:</span></div></div>
    <div class="lockb" id="lockb">${I(IC.lock)}</div><div class="paid" id="paid">مدفوع ✓</div></div>
  <div class="txt"><div class="h" id="h9a">إنت تحدد <span class="v">سعرك.</span></div><div class="h" id="h9b" style="margin-top:14px">وإنت تختار <span class="v">شنو تقبل.</span></div><div class="h sm" id="h9c">وما يوصلك طلب إلا ويكون مدفوع.</div></div></div>
<div class="scene" id="s10"><div class="wm">${mark("m")}IRAQISTAR</div>
  <div class="art"><div class="conn"><svg class="ln"><path id="lnp" d="M270 190 C 400 60, 420 320, 550 190"/></svg><div class="n" id="n0" style="left:0">${I(IC.star)}<b>إنت</b></div><div class="n" id="n1" style="right:0">${I(IC.users)}<b>جمهورك</b></div></div>
    <div class="sec" id="sec">${I(IC.timer)}كل ثانية من وقتك… مدفوعة</div></div>
  <div class="txt"><div class="h" id="h10a">مهمّتنا <span class="v">بسيطة:</span></div><div class="h sm" id="h10b" style="font-size:52px;color:#1d1640">نوصّلك بجمهورك بسهولة…</div><div class="h sm" id="h10c" style="font-size:52px;color:#1d1640">وتنقبض على كل ثانية من وقتك.</div></div></div>
<div class="scene" id="s11"><div class="wm">${mark("m")}IRAQISTAR</div><div class="consts" id="consts">${Array.from({length:22},(_,i)=>`<span class="m" style="left:${(i*163)%1800+40}px;top:${(i*131)%980+60}px;width:${30+(i%4)*12}px;height:${30+(i%4)*12}px;opacity:${0.12+(i%3)*0.1}"><svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="${MARK}"/></svg></span>`).join("")}</div>
  <div class="ctaw" id="ctaw"><div class="t">سعيدين <span class="v">بوجودك</span> ويّانا.</div><div class="link">iraqistar.com/apply</div></div></div>
</div>
<div class="scene" id="s12"><div class="tagwrap" id="tw"><div class="tag" id="tg">من نجوم العراق…</div><div class="bar" id="barx"></div></div><div class="slam" id="slam">إليك</div><div class="ringx" id="rx1"></div><div class="ringx" id="rx2"></div>
  <div class="logo" id="logo"><span class="mk" id="mk"><svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="${MARK}"/></svg></span><div class="ar" id="lar">نجم العراق</div><div class="en" id="len">IRAQISTAR</div><div class="links" id="links">iraqistar.com · @iraqistar.iq</div></div></div>
<div class="flash" id="flash"></div><div class="flashd" id="flashd"></div>
<svg class="grain" width="100%" height="100%"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="1" id="turb"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>
<div class="fade" id="fade"></div></div><script>
const SC=${JSON.stringify(SC)}, DUR=${DUR}, O=${O};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)), eo=x=>1-Math.pow(1-x,3), ei=x=>x*x*x, eio=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2, back=x=>{const c=1.7;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)}, seg=(t,s,d)=>clamp((t-s)/d,0,1), hit=(t,a,l)=>t>=a?Math.exp(-(t-a)/l):0, $=id=>document.getElementById(id), v=x=>x+O;
function reveal(tagId,barId,p){const el=$(tagId); const x=(p*116-8); const m=\`linear-gradient(to left,#000 \${x-6}%,#000 \${x}%,transparent \${x+6}%)\`; el.style.webkitMaskImage=m; el.style.maskImage=m; const bar=$(barId); const w=el.getBoundingClientRect().width; const left=(el.parentElement.getBoundingClientRect().width-w)/2; bar.style.right=(left+x/100*w)+'px'; bar.style.opacity=(p>0&&p<1?1:0);}
let t_=0, kick=0;
function pop(id,s,d,dy,base,out){const k=back(seg(t_,s,d)); const el=$(id); let o=clamp(k*3,0,1); if(out!=null) o*=1-eo(seg(t_,out,0.3)); el.style.opacity=o; el.style.transform=(base||'')+' translateY('+((1-Math.min(k,1))*(dy==null?40:dy)).toFixed(0)+'px) scale('+(0.85+0.15*Math.min(k,1.1)).toFixed(3)+')'; if(t_>=s)kick+=hit(t_,s,0.08)*0.02; return k;}
function fadein(id,s,d,dy,out){const k=eo(seg(t_,s,d)); const el=$(id); let o=k; if(out!=null) o*=1-eo(seg(t_,out,0.3)); el.style.opacity=o; el.style.transform='translateY('+((1-k)*(dy==null?30:dy)).toFixed(0)+'px)'; return k;}
window.renderAt=t=>{ t_=t; kick=0;
  $('turb').setAttribute('seed',String(Math.floor(t*30)%40));
  let fl=0, fld=0;
  SC.forEach(([id,s,e])=>{const on=t>=s&&t<e; $(id).style.opacity=on?1:0; if(s>0&&id!=='s12'){kick+=hit(t,s,0.12)*0.03; fl+=hit(t,s,0.08)*0.35;}});
  // s1 — مرحبا 0.0-0.73 ; comments 1.09-4.27 ; ما عندك وقت 4.67 ; صح 6.81
  const h1=back(seg(t,v(0.05),0.5)); $('hi').style.opacity=clamp(h1*3,0,1)*(1-eo(seg(t,v(0.95),0.3))); $('hi').style.transform=\`translateY(-50%) scale(\${(0.7+0.3*Math.min(h1,1.1)).toFixed(3)})\`;
  pop('prof',v(1.1),0.5,60);
  BUBS.forEach((b,i)=>{const s=v(1.35+i*0.36); const k=back(seg(t,s,0.4)); const el=$('bb'+i); el.style.opacity=clamp(k*3,0,1); el.style.transform=\`translateY(\${((1-Math.min(k,1))*30).toFixed(0)}px) scale(\${(0.7+0.3*Math.min(k,1.1)).toFixed(3)})\`;});
  const un=seg(t,v(1.3),3.2); $('unread').style.opacity=eo(seg(t,v(1.3),0.3)); $('unread').textContent=String(Math.round(384*eo(un))); $('unread').style.transform=\`scale(\${(1+0.08*hit(t,v(1.3)+Math.floor((t-v(1.3))/0.36)*0.36,0.1)).toFixed(3)})\`;
  fadein('h1a',v(1.2),0.45); fadein('h1b',v(4.7),0.4);
  const sh=back(seg(t,v(6.85),0.35)); $('h1c').style.opacity=clamp(sh*3,0,1); $('h1c').style.transform=\`scale(\${(0.6+0.4*Math.min(sh,1.1)).toFixed(3)})\`; kick+=hit(t,v(6.85),0.1)*0.03;
  // s2 — 7.54 بنجم العراق ; 8.78 يفرّحهم ; 11.26 ويفيدك ; 12.19 خلّيني
  fadein('h2a',v(7.6),0.45);
  [[v(8.85),'pl0'],[v(11.3),'pl1']].forEach(([s,id])=>{const k=back(seg(t,s,0.45)); const el=$(id); el.style.opacity=clamp(k*3,0,1); el.style.transform=\`translateX(\${((1-Math.min(k,1))*-160).toFixed(0)}px) scale(\${(0.85+0.15*Math.min(k,1.1)).toFixed(3)})\`; kick+=hit(t,s,0.08)*0.025;});
  fadein('h2b',v(12.25),0.4);
  // s3 — 13.72 زوج محتار ; 17.36 يطلب فيديو ; 21.10 فرحتها ; 22.44 لو وصلك
  pop('gift',v(13.8),0.5,50,'',v(17.3)); fadein('h3a',v(13.9),0.45);
  pop('req3',v(17.4),0.5,80); fadein('h3b',v(17.5),0.4); $('d3').textContent=String(Math.round(15*eo(seg(t,v(17.9),0.8))));
  const hb=seg(t,v(21.1),1.4); Array.from($('hearts').children).forEach((h,i)=>{const k=seg(t,v(21.1)+i*0.06,0.9); h.style.opacity=(k>0&&k<1?Math.sin(k*Math.PI):0).toFixed(3); h.style.transform=\`translateY(\${(-k*160).toFixed(0)}px) scale(\${(0.6+k*0.8).toFixed(2)})\`;});
  pop('b3a',v(21.15),0.4,20); kick+=hit(t,v(21.15),0.1)*0.03; pop('b3b',v(22.5),0.4,20);
  // s4 — 24.51 طالب ; 27.42 أبوه ; 31.55 سبب بنجاحه
  pop('book',v(24.6),0.5,50,'',v(27.4)); pop('mood',v(24.9),0.45,40,'',v(27.4)); $('moodb').style.width=(25+10*Math.sin(t*2)).toFixed(0)+'%'; fadein('h4a',v(24.7),0.45);
  pop('req4',v(27.5),0.5,80); fadein('h4b',v(27.6),0.4);
  const ok=back(seg(t,v(31.6),0.45)); $('okb').style.opacity=clamp(ok*3,0,1); $('okb').style.transform=\`scale(\${(2-1*Math.min(ok,1.1)).toFixed(3)}) rotate(\${((1-Math.min(ok,1))*-25).toFixed(1)}deg)\`; kick+=hit(t,v(31.6),0.1)*0.035; pop('b4a',v(31.7),0.4,20);
  // s5 — 34.45 أمثلة
  fadein('h5',v(34.5),0.4); CHIPS.forEach((c,i)=>{const s=v(35.0+i*0.3); const k=back(seg(t,s,0.4)); const el=$('gc'+i); el.style.opacity=clamp(k*3,0,1); el.style.transform=\`translateY(\${((1-Math.min(k,1))*40).toFixed(0)}px) scale(\${(0.7+0.3*Math.min(k,1.1)).toFixed(3)})\`; if(t>=s)kick+=hit(t,s,0.06)*0.015;});
  // s6 — 38.42 مملّة ; 40.98 كلمة حلوة ; 44.94 ما تنتسى ; 46.59 للطرفين
  ['g0','g1','g2'].forEach((id,i)=>pop(id,v(38.5+i*0.15),0.4,30));
  $('strike').style.width=(640*eo(seg(t,v(39.6),0.35))).toFixed(0)+'px'; fadein('h6a',v(38.5),0.45);
  [['c0',v(41.0)],['c1',v(42.2)],['c2',v(43.3)]].forEach(([id,s])=>{const k=back(seg(t,s,0.4)); const el=$(id); el.style.opacity=clamp(k*3,0,1); el.style.transform=\`translateX(\${((1-Math.min(k,1))*-120).toFixed(0)}px)\`; kick+=hit(t,s,0.08)*0.02;});
  const nt=back(seg(t,v(45.0),0.45)); $('h6b').style.opacity=clamp(nt*3,0,1); $('h6b').style.transform=\`scale(\${(0.8+0.2*Math.min(nt,1.1)).toFixed(3)})\`; kick+=hit(t,v(45.0),0.1)*0.03;
  pop('hh0',v(46.65),0.35,20); pop('hh1',v(46.95),0.35,20);
  // s7 — 47.57 كل واحد ; 51.46 معلّمة ; 54.01 المدرّس ; 56.21 الطبيب ; 58.32 المدرّب
  fadein('h7',v(47.6),0.45); [v(51.5),v(54.05),v(56.25),v(58.35)].forEach((s,i)=>{const k=back(seg(t,s,0.5)); const el=$('sc'+i); el.style.opacity=clamp(k*3,0,1); el.style.transform=\`translateY(\${((1-Math.min(k,1))*90).toFixed(0)}px) scale(\${(0.85+0.15*Math.min(k,1.1)).toFixed(3)})\`; kick+=hit(t,s,0.1)*0.03;});
  // s8 — 60.67 تسجّل ; ~63.3 يحتفظ ; 66.57 دقيقة
  pop('rec',v(60.7),0.5,100); const rs=Math.floor(Math.max(0,t-v(61.0))); $('tmr').textContent='00:'+(rs<10?'0':'')+rs; $('dot').style.opacity=(Math.floor(t*2)%2?1:0.3);
  $('t8').style.opacity=(1-eo(seg(t,v(66.4),0.3))).toFixed(3); fadein('h8a',v(60.8),0.45);
  [['a0',v(63.3)],['a1',v(64.3)],['a2',v(65.3)]].forEach(([id,s])=>{const k=back(seg(t,s,0.4)); const el=$(id); el.style.opacity=clamp(k*3,0,1); el.style.transform=\`translateX(\${((1-Math.min(k,1))*80).toFixed(0)}px)\`; kick+=hit(t,s,0.08)*0.02;});
  const eqk=back(seg(t,v(66.6),0.45)); $('eq').style.opacity=clamp(eqk*3,0,1); $('eq').style.transform=\`translateY(-50%) scale(\${(0.85+0.15*Math.min(eqk,1.1)).toFixed(3)})\`;
  pop('e0',v(67.4),0.4,20); pop('e1',v(68.4),0.4,20); $('cnt').style.opacity=eo(seg(t,v(68.9),0.3)); $('cnt').textContent='+'+Math.round(2140*eo(seg(t,v(68.9),1.0))).toLocaleString('en-US')+' متابع';
  // s9 — 70.50 سعرك ; ~72 تختار ; 73.50 مدفوع
  pop('price',v(70.55),0.5,70); fadein('h9a',v(70.6),0.4); $('pc1').classList.toggle('on',t>=v(71.4)); $('pc1').style.transform=\`scale(\${(1+0.12*hit(t,v(71.4),0.15)).toFixed(3)})\`;
  fadein('h9b',v(72.0),0.4); $('tgok').classList.toggle('ok',t>=v(72.5)); $('tgno').classList.toggle('no',t>=v(72.5)&&t<v(72.5)); $('tgok').style.transform=\`scale(\${(1+0.12*hit(t,v(72.5),0.15)).toFixed(3)})\`;
  fadein('h9c',v(73.55),0.4); const kl=back(seg(t,v(73.6),0.4)); $('lockb').style.opacity=clamp(kl*3,0,1); $('lockb').style.transform=\`scale(\${(2.2-1.2*Math.min(kl,1.12)).toFixed(3)}) rotate(\${((1-Math.min(kl,1))*-25).toFixed(1)}deg)\`; kick+=hit(t,v(73.6),0.1)*0.035; fld+=hit(t,v(73.6),0.06)*0.3;
  pop('paid',v(74.4),0.4,20);
  // s10 — 76.00 مهمّتنا ; 77.28 نوصّلك ; 79.20 كل ثانية
  fadein('h10a',v(76.05),0.4); pop('n0',v(76.2),0.45,40); pop('n1',v(76.45),0.45,40); fadein('h10b',v(77.3),0.4);
  $('lnp').style.strokeDashoffset=String((400*(1-eo(seg(t,v(77.4),0.8)))).toFixed(1));
  fadein('h10c',v(79.25),0.4); pop('sec',v(79.3),0.45,30);
  // s11 — 81.52 سعيدين
  $('consts').style.opacity=eo(seg(t,v(81.5),0.6))*0.9; $('consts').style.transform=\`translateY(\${(-(t-v(81.5))*10).toFixed(0)}px)\`;
  const cw=back(seg(t,v(81.6),0.55)); $('ctaw').style.opacity=clamp(cw*3,0,1); $('ctaw').style.transform=\`translateY(-50%) scale(\${(0.8+0.2*Math.min(cw,1.1)).toFixed(3)})\`; kick+=hit(t,v(81.6),0.1)*0.03;
  // s12 — 84.65 من نجوم العراق ; 86.01 إليك ; logo 87.3
  const R0=v(84.65), SL=v(86.0), LG=87.3;
  reveal('tg','barx',eio(seg(t,R0,1.25)));
  const sl=back(seg(t,SL,0.32)); $('slam').style.opacity=clamp(sl*3,0,1)*(1-eo(seg(t,LG-0.15,0.15))); $('slam').style.transform=\`translateY(\${(130+(1-sl)*80).toFixed(0)}px) scale(\${(0.5+0.5*sl).toFixed(3)})\`; $('slam').style.filter=\`blur(\${((1-Math.min(sl,1))*12).toFixed(1)}px)\`;
  $('tw').style.transform=\`translateY(-50%) translateY(\${(t>=SL?-120*eo(seg(t,SL,0.32)):0).toFixed(0)}px)\`; $('tw').style.opacity=(1-eo(seg(t,LG-0.15,0.15))).toFixed(3); kick+=hit(t,SL,0.12)*0.04; fld+=hit(t,SL,0.08)*0.5;
  const lg=back(seg(t,LG,0.55)); $('logo').style.opacity=clamp(lg*3,0,1); $('mk').style.transform=\`scale(\${(0.2+0.8*Math.min(lg,1.1)).toFixed(3)}) rotate(\${((1-Math.min(lg,1))*-90).toFixed(1)}deg)\`;
  fadein('lar',LG+0.3,0.4); fadein('len',LG+0.55,0.4); fadein('links',LG+0.8,0.4,20);
  [['rx1',LG],['rx2',LG+0.15]].forEach(([id,s])=>{const k=seg(t,s,0.9); const r=$(id); r.style.opacity=(k>0&&k<1?(1-k):0).toFixed(3); r.style.transform=\`translate(-50%,-50%) scale(\${(0.6+k*4).toFixed(3)})\`;});
  fl+=hit(t,LG,0.12)*0.7; kick+=hit(t,LG,0.14)*0.05;
  $('cam').style.transform=\`scale(\${(1+0.01*(t/DUR)+kick*0.6).toFixed(4)})\`; $('panel').style.opacity=(1-eo(seg(t,83.75,0.25))).toFixed(3);
  $('flash').style.opacity=clamp(fl,0,1).toFixed(3); $('flashd').style.opacity=clamp(fld,0,1).toFixed(3);
  $('fade').style.opacity=ei(seg(t,DUR-0.8,0.8)).toFixed(3);
};
const BUBS=${JSON.stringify(BUBS.map(b=>b[0]))}, CHIPS=${JSON.stringify(CHIPS.map(c=>c[0]))};
</script></body></html>`;
fs.writeFileSync("film.html", html);
const dir = "frames"; if (!process.argv[2]) fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }); const p = await b.newPage({ viewport: { width: W, height: H } });
p.on("pageerror", e => console.log("PAGEERR", e.message));
await p.goto("file://" + process.cwd() + "/film.html"); await p.evaluate(() => document.fonts.ready);
const only = process.argv[2] ? process.argv[2].split(",").map(Number) : null;
for (let f = 0; f < Math.round(DUR * FPS); f++) { if (only && !only.includes(f)) continue; await p.evaluate(t => window.renderAt(t), f / FPS); await p.screenshot({ path: `${dir}/${String(f).padStart(4, "0")}.jpg`, type: "jpeg", quality: 90 }); }
await b.close();
if (!only) execSync(`ffmpeg -v error -y -framerate ${FPS} -i ${dir}/%04d.jpg -c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium -movflags +faststart film-silent.mp4`);
console.log("done");
