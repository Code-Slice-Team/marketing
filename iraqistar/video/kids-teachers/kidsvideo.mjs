// IraqiStar Kids — 60s teacher/kindergarten recruitment video, 1920x1080, brand motion, no people.
import { chromium } from "playwright";
import fs from "fs";
import { execSync } from "child_process";

const ROOT = "/home/claude/ig";
const OUT = `${ROOT}/kidsvideo`;
fs.mkdirSync(OUT, { recursive: true });
const FPS = 30;

const MARK = "M12.00 0.80 L14.49 5.99 L19.92 4.08 L18.01 9.51 L23.20 12.00 L18.01 14.49 L19.92 19.92 L14.49 18.01 L12.00 23.20 L9.51 18.01 L4.08 19.92 L5.99 14.49 L0.80 12.00 L5.99 9.51 L4.08 4.08 L9.51 5.99 Z M9.40 8.10 L16.40 12.00 L9.40 15.90 Z";
const K = { sun: "#ffd23f", sky: "#5cc8ff", grass: "#52d28f", berry: "#ff7a9c", tangerine: "#ffa04d", ink: "#1d1640", paper: "#ffffff" };
const I = K.ink;
const ART = {
  sun: `<g stroke="${I}" stroke-width="3" stroke-linecap="round"><path d="M32 4v6M32 54v6M4 32h6M54 32h6M12.2 12.2l4.2 4.2M47.6 47.6l4.2 4.2M12.2 51.8l4.2-4.2M47.6 16.4l4.2-4.2"/></g><circle cx="32" cy="32" r="15" fill="${K.sun}" stroke="${I}" stroke-width="3"/><circle cx="26.5" cy="30" r="2" fill="${I}"/><circle cx="37.5" cy="30" r="2" fill="${I}"/><path d="M26 36.5c3.2 3.4 8.8 3.4 12 0" fill="none" stroke="${I}" stroke-width="3" stroke-linecap="round"/>`,
  cloud: `<path d="M17 47h30.5a10.5 10.5 0 0 0 .9-21 14.5 14.5 0 0 0-27.8-3.2A11.8 11.8 0 0 0 17 47Z" fill="#ffffff" stroke="${I}" stroke-width="3" stroke-linejoin="round"/>`,
  book: `<g stroke="${I}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"><path d="M32 19c-6-4-14-5-23-4v31c9-1 17 0 23 4 6-4 14-5 23-4V15c-9-1-17 0-23 4Z" fill="${K.sky}"/><path d="M32 19v31" fill="none"/><path d="M15 24c4.5 0 8.5.8 11.5 2.2M15 31c4.5 0 8.5.8 11.5 2.2M37.5 26.2c3-1.4 7-2.2 11.5-2.2M37.5 33.2c3-1.4 7-2.2 11.5-2.2" fill="none"/></g>`,
  crayon: `<g stroke="${I}" stroke-width="3" stroke-linejoin="round" transform="rotate(-35 32 32)"><rect x="8" y="24" width="34" height="16" rx="3" fill="${K.berry}"/><path d="M42 24l14 8-14 8Z" fill="#ffffff"/><path d="M51 29.2 56 32l-5 2.8Z" fill="${I}"/><path d="M17 24v16M33 24v16" fill="none"/></g>`,
  block: `<g stroke="${I}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"><path d="M32 9 53 19.5v25L32 55 11 44.5v-25Z" fill="${K.grass}"/><path d="M32 9 53 19.5 32 30 11 19.5Z" fill="#ffffff"/><path d="M32 30v25" fill="none"/><path d="M17.5 45.5 21.5 33l4 15.2M18.7 41.6l5 2.3" fill="none"/><circle cx="42.5" cy="38.5" r="3.2" fill="${K.sun}"/></g>`,
  plane: `<g stroke="${I}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"><path d="M8 30 57 11 43 53 31 39Z" fill="#ffffff"/><path d="M57 11 31 39v12l6-7.5" fill="none"/><path d="M5 47c5 2.5 10 1 13.5-3" fill="none" stroke-dasharray="1 6"/></g>`,
  star: `<path d="M32 7.5l6.9 15 16.4 1.8-12.2 11.1 3.4 16.2L32 43.3 17.5 51.6l3.4-16.2L8.7 24.3l16.4-1.8Z" fill="${K.sun}" stroke="${I}" stroke-width="3" stroke-linejoin="round"/>`,
  shield: `<g stroke="${I}" stroke-width="3" stroke-linejoin="round"><path d="M32 7 53 15.5v14.5C53 43.5 44.2 52.6 32 57 19.8 52.6 11 43.5 11 30V15.5Z" fill="#ffffff"/><path d="M32 42.5c-6.4-4.2-10.5-7.8-10.5-12.4a5.2 5.2 0 0 1 10.5-1.3 5.2 5.2 0 0 1 10.5 1.3c0 4.6-4.1 8.2-10.5 12.4Z" fill="${K.berry}"/></g>`,
};
const st = (name, x, y, size, rot, ph) => `<svg class="sticker a" data-ph="${ph}" viewBox="0 0 64 64" style="left:${x}px;top:${y}px;width:${size}px;height:${size}px;--rot:${rot}deg">${ART[name]}</svg>`;
const mark = (size, fill = I) => `<svg viewBox="0 0 24 24" fill="${fill}" style="width:${size}px;height:${size}px"><path fill-rule="evenodd" d="${MARK}"/></svg>`;
const lockup = (size = 44) => `<div class="lockup" style="font-size:${size}px">${mark(size * 1.1)}IraqiStar<span class="kpill">Kids</span></div>`;
const check = `<svg viewBox="0 0 24 24" fill="none" stroke="${K.sun}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`;

// Scenes: [field, duration, html]. Elements with class "a" animate in staggered; data-d = extra delay (s).
const scenes = [
  ["sun", 6.0, `
    <div class="col" style="max-width:1500px">
      <div class="a" style="margin-bottom:40px">${lockup(60)}</div>
      <h1 class="a">تعلّم الأطفال؟</h1>
      <h1 class="a hi">جمهورك أكبر من صفّك.</h1>
      <p class="a lead">IraqiStar Kids: حصص مباشرة للأطفال، تقدّمها من بيتك للأهالي بكل العراق.</p>
    </div>
    ${st("sun", 140, 110, 240, -8, 0)}${st("book", 380, 760, 230, 10, 1)}${st("crayon", 110, 720, 190, 0, 2)}`],
  ["sky", 8.0, `
    <div class="row">
      <div class="col" style="width:820px">
        <h2 class="a">حصتك، بشكلها الحقيقي.</h2>
        <p class="a lead">حصة صغيرة، مدتها 30 أو 60 دقيقة، والأهالي يحجزون مقاعدها من رابط تشاركه.</p>
      </div>
      <div class="card a" data-d="0.3">
        <div class="cardtop" style="background:${K.sun}"><span class="day">الثلاثاء</span><span class="time">6:00 مساءً · 30 دقيقة</span></div>
        <div class="cardbody">
          <div class="ctitle">إنجليزي للمبتدئين</div>
          <div class="chost">${mark(30)} أ. سارة · <span class="verified">موثّقة للأطفال</span></div>
          <div class="seats"><div class="seatbar"><i class="a fill" data-d="0.9"></i></div><span>6 من 10 مقاعد محجوزة</span></div>
        </div>
      </div>
    </div>
    ${st("cloud", 80, 90, 220, 0, 0)}${st("plane", 120, 800, 200, -6, 1)}`],
  ["grass", 8.0, `
    <div class="col">
      <h2 class="a">أنت تحدد كلشي.</h2>
      <div class="tiles">
        <div class="tile a"><div class="tnum">1</div><b>الموعد</b><span>اليوم والساعة والمدة</span></div>
        <div class="tile a"><div class="tnum">2</div><b>عدد المقاعد</b><span>أقل عدد، وأكبر عدد</span></div>
        <div class="tile a"><div class="tnum">3</div><b>سعر المقعد</b><span>بالدينار، للطفل الواحد</span></div>
        <div class="tile a"><div class="tnum">4</div><b>طريقة الحصة</b><span>الأطفال يشاهدون، أو يتكلّمون ويشاركون</span></div>
      </div>
    </div>
    ${st("block", 140, 90, 200, 8, 0)}${st("star", 380, 110, 150, -12, 1)}`],
  ["berry", 9.0, `
    <div class="col">
      <h2 class="a">شلون تشتغل؟</h2>
      <div class="flow">
        <div class="fstep a"><div class="fnum">1</div><b>انشر حصتك</b><span>من حسابك، بدقائق</span></div>
        <div class="farrow a">‹</div>
        <div class="fstep a"><div class="fnum">2</div><b>شارك الرابط</b><span>على صفحتك أو مجموعة الأهالي</span></div>
        <div class="farrow a">‹</div>
        <div class="fstep a"><div class="fnum">3</div><b>الأهالي يحجزون</b><span>مقعد لكل طفل</span></div>
        <div class="farrow a">‹</div>
        <div class="fstep a"><div class="fnum">4</div><b>ادخل الغرفة</b><span>تفتح قبل الموعد بـ10 دقايق، من المتصفح</span></div>
      </div>
    </div>
    ${st("plane", 120, 110, 200, -10, 0)}${st("cloud", 380, 100, 180, 0, 1)}`],
  ["sun", 10.0, `
    <div class="row">
      <div class="col" style="width:900px">
        <h2 class="a">الأطفال بأمان.</h2>
        <h2 class="a hi">والأهل مطمئنين.</h2>
        <div class="checks">
          <div class="chk a"><i>${check}</i>كل معلّم وروضة يراجعهم فريقنا قبل أول حصة</div>
          <div class="chk a"><i>${check}</i>الطفل ما ينضم وحده، والوالد يگعد يمّه</div>
          <div class="chk a"><i>${check}</i>ماكو دردشة مكتوبة بحصص الأطفال</div>
          <div class="chk a"><i>${check}</i>أنت تختار: يشاهدون بس، أو يتكلّمون ويشاركون</div>
        </div>
      </div>
      <div class="a" data-d="0.4" style="position:relative;width:520px;height:520px">${st("shield", 60, 40, 440, 0, 0)}</div>
    </div>`],
  ["sky", 8.0, `
    <div class="col">
      <h2 class="a">شنو تعلّم؟</h2>
      <p class="a lead">كل حصة تنشر تحت موضوع، والأهالي يلگونها من صفحة الموضوع.</p>
      <div class="chips">
        <div class="chip a" style="background:${K.sun}">الإنجليزية</div>
        <div class="chip a" style="background:${K.grass}">العربية</div>
        <div class="chip a" style="background:${K.berry}">الرياضيات</div>
        <div class="chip a" style="background:${K.tangerine}">القصص</div>
        <div class="chip a" style="background:${K.sun}">الأناشيد</div>
        <div class="chip a" style="background:${K.grass}">الرياضة</div>
      </div>
    </div>
    ${st("book", 120, 100, 220, 10, 0)}${st("crayon", 120, 780, 200, 0, 1)}`],
  ["grass", 8.0, `
    <div class="col" style="max-width:1300px">
      <h2 class="a">وإذا ما اكتمل العدد؟</h2>
      <h2 class="a hi">تنلغي الحصة، ويرجع المبلغ للجميع.</h2>
      <p class="a lead">ماكو خسارة لأحد. وإذا اكتملت، تحصل على حصتك عن كل مقعد بعد الحصة.</p>
      <div class="note a">التقديم مجاني. نراجع وثائقك ونساعدك تبدي أول حصصك.</div>
    </div>
    ${st("star", 140, 110, 200, -12, 0)}${st("block", 120, 760, 200, 8, 1)}`],
  ["berry", 8.0, `
    <div class="col center">
      <div class="a">${mark(150)}</div>
      <div class="a big">IraqiStar<span class="kpill" style="font-size:.7em;padding:6px 40px">Kids</span></div>
      <p class="a lead" style="text-align:center">حصص مباشرة للأطفال، وأنت المعلّم.</p>
      <div class="a cta">قدّم طلب التدريس</div>
      <div class="a url">iraqistar.com/kids</div>
      <div class="a give">مع كل حجز، جزء من أرباحنا يدعم الأعمال الخيرية في العراق</div>
    </div>
    ${st("sun", 120, 100, 220, -8, 0)}${st("plane", 1600, 120, 200, -6, 1)}${st("book", 1560, 780, 220, 10, 2)}${st("crayon", 100, 780, 200, 0, 3)}`],
];

const CSS = `
@font-face{font-family:"Plex Arabic";font-weight:400;src:url("file://${ROOT}/node_modules/@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-400-normal.woff2")}
@font-face{font-family:"Plex Arabic";font-weight:500;src:url("file://${ROOT}/node_modules/@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-500-normal.woff2")}
@font-face{font-family:"Plex Arabic";font-weight:700;src:url("file://${ROOT}/node_modules/@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-700-normal.woff2")}
@font-face{font-family:"Geist";font-weight:100 900;src:url("file://${ROOT}/node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2")}
*{box-sizing:border-box;margin:0}
html,body{margin:0;background:#000}
body{font-family:"Plex Arabic",sans-serif;color:${I}}
.stage{width:1920px;height:1080px;position:relative;overflow:hidden;direction:rtl}
.scene{position:absolute;inset:0;padding:110px 120px;display:flex;align-items:center;opacity:0}
.scene>.col,.scene>.row{position:relative;z-index:2;width:100%}
.col{display:flex;flex-direction:column;gap:26px}
.col.center{align-items:center;text-align:center;gap:22px}
.row{display:flex;align-items:center;justify-content:space-between;gap:60px}
.lockup{display:inline-flex;align-items:center;gap:14px;font-family:Geist;font-weight:700;letter-spacing:-0.02em;direction:ltr}
.kpill{font-family:Geist;font-weight:700;font-size:.7em;background:${I};color:${K.sun};border-radius:999px;padding:4px 22px;margin-left:8px;letter-spacing:0}
h1{font-size:108px;line-height:1.28;font-weight:700}
h2{font-size:96px;line-height:1.3;font-weight:700}
.hi{background:#fff;border-radius:28px;padding:0 28px;display:inline-block;align-self:flex-start;box-decoration-break:clone}
.lead{font-size:44px;line-height:1.6;color:rgb(29 22 64 / .82);max-width:1000px}
.a{opacity:0;transform:translateY(60px)}
.sticker{position:absolute;z-index:1;filter:drop-shadow(0 16px 22px rgb(29 22 64 / .2));transform:rotate(var(--rot))}
.corner{position:absolute;left:120px;top:60px;z-index:3;direction:ltr}
.card{width:640px;border-radius:40px;overflow:hidden;background:#fff;border:4px solid ${I};box-shadow:0 14px 0 rgb(29 22 64 / .18);flex:none}
.cardtop{padding:30px 40px;display:flex;justify-content:space-between;align-items:baseline}
.day{font-size:44px;font-weight:700}.time{font-size:28px;font-weight:500}
.cardbody{padding:34px 40px;display:flex;flex-direction:column;gap:18px}
.ctitle{font-size:46px;font-weight:700}
.chost{font-size:28px;font-weight:500;display:flex;align-items:center;gap:12px}
.verified{background:${K.grass};border-radius:999px;padding:4px 16px;font-size:24px}
.seats{display:flex;flex-direction:column;gap:12px;font-size:26px;font-weight:500;color:rgb(29 22 64 / .8)}
.seatbar{height:18px;border-radius:9px;background:rgb(29 22 64 / .12);overflow:hidden}
.seatbar i{display:block;height:100%;width:60%;background:${K.berry};border-radius:9px;transform:none}
.tiles{display:grid;grid-template-columns:repeat(4,1fr);gap:28px;margin-top:20px}
.tile{background:#fff;border:4px solid ${I};border-radius:36px;padding:34px 32px;box-shadow:0 12px 0 rgb(29 22 64 / .18);display:flex;flex-direction:column;gap:10px;min-height:300px}
.tnum{width:76px;height:76px;border-radius:50%;background:${I};color:${K.sun};font-family:Geist;font-weight:700;font-size:40px;display:grid;place-items:center;margin-bottom:10px}
.tile b{font-size:42px}.tile span{font-size:28px;color:rgb(29 22 64 / .8);line-height:1.5}
.flow{display:flex;align-items:stretch;gap:20px;margin-top:20px}
.fstep{flex:1;background:#fff;border:4px solid ${I};border-radius:36px;padding:32px 30px;box-shadow:0 12px 0 rgb(29 22 64 / .18);display:flex;flex-direction:column;gap:8px}
.fnum{width:70px;height:70px;border-radius:50%;background:${I};color:${K.sun};font-family:Geist;font-weight:700;font-size:36px;display:grid;place-items:center;margin-bottom:8px}
.fstep b{font-size:38px}.fstep span{font-size:26px;color:rgb(29 22 64 / .8);line-height:1.5}
.farrow{align-self:center;font-size:90px;font-weight:700;opacity:.5;font-family:Geist}
.checks{display:flex;flex-direction:column;gap:18px;margin-top:10px}
.chk{display:flex;align-items:center;gap:20px;font-size:38px;font-weight:500;background:#fff;border:4px solid ${I};border-radius:999px;padding:16px 28px 16px 40px;box-shadow:0 10px 0 rgb(29 22 64 / .18)}
.chk i{flex:none;width:60px;height:60px;border-radius:50%;background:${I};display:grid;place-items:center}
.chk i svg{width:34px;height:34px}
.chips{display:flex;flex-wrap:wrap;gap:24px;margin-top:20px;max-width:1300px}
.chip{font-size:52px;font-weight:700;padding:22px 54px;border-radius:999px;border:4px solid ${I};box-shadow:0 10px 0 rgb(29 22 64 / .18)}
.note{align-self:flex-start;background:${I};color:#fff;border-radius:999px;padding:22px 44px;font-size:36px;font-weight:500;margin-top:10px}
.big{font-family:Geist;font-weight:700;font-size:150px;letter-spacing:-0.03em;direction:ltr;display:flex;align-items:center;gap:22px}
.cta{background:${I};color:${K.sun};border-radius:999px;padding:26px 80px;font-size:54px;font-weight:700;margin-top:10px}
.url{font-family:Geist;font-size:40px;font-weight:500;direction:ltr;color:rgb(29 22 64 / .8)}
.give{margin-top:30px;background:#fff;border-radius:999px;padding:16px 40px;font-size:30px;font-weight:500}
`;

const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>${CSS}</style></head><body><div class="stage">
${scenes.map(([f, d, h], i) => `<div class="scene" data-i="${i}" style="background:${K[f]}">${i > 0 && i < scenes.length - 1 ? `<div class="corner">${lockup(40)}</div>` : ""}${h}</div>`).join("")}
</div><script>
const D=${JSON.stringify(scenes.map((s) => s[1]))};const S=[...document.querySelectorAll('.scene')];
const ease=x=>{x=Math.min(Math.max(x,0),1);return 1-Math.pow(1-x,3)};
const spring=x=>{x=Math.min(Math.max(x,0),1);return 1-Math.pow(1-x,3)*Math.cos(x*4)};
window.renderAt=t=>{let a=0;S.forEach((el,i)=>{const s=a,e=a+D[i];a=e;const last=i===S.length-1;
 if(t<s-0.35||(t>=e&&!last)){el.style.opacity=0;return}
 const fadeIn=ease((t-(s-0.35))/0.35);const fadeOut=last?0:ease((t-(e-0.35))/0.35);el.style.opacity=fadeIn*(1-fadeOut);
 const lt=t-s;
 const els=[...el.querySelectorAll('.a')];
 els.forEach((x,k)=>{const dd=parseFloat(x.dataset.d||0);const p=spring((lt-0.15-k*0.13-dd)/0.7);
  if(x.classList.contains('fill')){x.style.opacity=1;x.style.transform='scaleX('+ease((lt-0.15-k*0.13-dd)/1.2)+')';x.style.transformOrigin='right';return}
  x.style.opacity=Math.min(1,p*1.4);x.style.transform='translateY('+((1-p)*60)+'px) scale('+(0.92+0.08*p)+')';});
 [...el.querySelectorAll('.sticker')].forEach(x=>{const ph=parseFloat(x.dataset.ph||0);const p=spring((lt-0.4-ph*0.2)/0.8);
  const bob=Math.sin((t+ph)*1.6)*10;x.style.opacity=p;x.style.transform='translateY('+((1-p)*80+bob)+'px) rotate(var(--rot)) scale('+(0.6+0.4*p)+')';});
});};
</script></body></html>`;
fs.writeFileSync(`${ROOT}/kidsvideo.html`, html);

const total = scenes.reduce((a, s) => a + s[1], 0);
console.log("total", total, "s");
if (process.argv[2] === "html") process.exit(0);

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }).catch(() => chromium.launch());
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto(`file://${ROOT}/kidsvideo.html`); await page.evaluate(() => document.fonts.ready);
const dir = `${OUT}/frames`; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir);
if (process.argv[2] === "stills") {
  const times = [1.5, 8, 15, 24, 34, 43, 51, 58];
  for (const t of times) { await page.evaluate((t) => window.renderAt(t), t); await page.screenshot({ path: `${OUT}/still-${t}.jpg`, type: "jpeg", quality: 85 }); }
  await browser.close(); process.exit(0);
}
const n = Math.round(total * FPS);
for (let f = 0; f < n; f++) {
  await page.evaluate((t) => window.renderAt(t), f / FPS);
  await page.screenshot({ path: `${dir}/${String(f).padStart(4, "0")}.jpg`, type: "jpeg", quality: 90 });
  if (f % 300 === 0) console.log("frame", f, "/", n);
}
await browser.close();
execSync(`ffmpeg -v error -y -framerate ${FPS} -i ${dir}/%04d.jpg -c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium -movflags +faststart ${OUT}/video-silent.mp4`);
fs.rmSync(dir, { recursive: true, force: true });
console.log("done");
