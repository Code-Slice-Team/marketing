// IraqiStar Kids — printable A4/A3 poster for partner kindergartens. Parents-facing, Kids palette, QR to /kids.
import { chromium } from "playwright";
import fs from "fs";
import { execSync } from "child_process";

const ROOT = "/home/claude/ig";
const OUT = `${ROOT}/poster`; fs.mkdirSync(OUT, { recursive: true });
const MARK = "M12.00 0.80 L14.49 5.99 L19.92 4.08 L18.01 9.51 L23.20 12.00 L18.01 14.49 L19.92 19.92 L14.49 18.01 L12.00 23.20 L9.51 18.01 L4.08 19.92 L5.99 14.49 L0.80 12.00 L5.99 9.51 L4.08 4.08 L9.51 5.99 Z M9.40 8.10 L16.40 12.00 L9.40 15.90 Z";
const K = { sun: "#ffd23f", sky: "#5cc8ff", grass: "#52d28f", berry: "#ff7a9c", tangerine: "#ffa04d", ink: "#1d1640" };
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
const st = (name, x, y, size, rot) => `<svg class="sticker" viewBox="0 0 64 64" style="left:${x}mm;top:${y}mm;width:${size}mm;height:${size}mm;transform:rotate(${rot}deg)">${ART[name]}</svg>`;
const mark = (size, fill = I) => `<svg viewBox="0 0 24 24" fill="${fill}" style="width:${size}mm;height:${size}mm;flex:none"><path fill-rule="evenodd" d="${MARK}"/></svg>`;
const check = `<svg viewBox="0 0 24 24" fill="none" stroke="${K.sun}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`;
const qr = fs.readFileSync(`${ROOT}/qr.svg`, "utf8").replace(/<\?xml[^>]*>/, "").replace(/width="[^"]*" height="[^"]*"/, 'width="100%" height="100%"').replace("<path", `<path fill="${I}"`);
const wave = (c) => `<svg class="wave" viewBox="0 0 1440 48" preserveAspectRatio="none"><path d="M0 48V26C80 12 160 4 240 10s160 28 240 30 160-22 240-26 160 14 240 20 160-8 240-18 160-8 240 2v30H0Z" fill="${c}"/></svg>`;

// Layout in mm on an A4 page (210 x 297) with a 3 mm bleed on each side (216 x 303).
const B = 3;
const html = (partner) => `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>
@font-face{font-family:"Plex Arabic";font-weight:400;src:url("file://${ROOT}/node_modules/@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-400-normal.woff2")}
@font-face{font-family:"Plex Arabic";font-weight:500;src:url("file://${ROOT}/node_modules/@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-500-normal.woff2")}
@font-face{font-family:"Plex Arabic";font-weight:700;src:url("file://${ROOT}/node_modules/@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-700-normal.woff2")}
@font-face{font-family:"Geist";font-weight:100 900;src:url("file://${ROOT}/node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2")}
@page{size:${210 + 2 * B}mm ${297 + 2 * B}mm;margin:0}
*{box-sizing:border-box;margin:0}
html,body{margin:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:"Plex Arabic",sans-serif;color:${I};width:${210 + 2 * B}mm;height:${297 + 2 * B}mm;overflow:hidden;position:relative;background:${K.sun};display:flex;flex-direction:column}
.band{position:relative;flex:none}
.band.last{flex:1}
.inner{position:relative;z-index:2;padding:0 ${B + 14}mm}
.wave{position:absolute;left:0;right:0;width:100%;height:9mm;display:block;z-index:1}
.sticker{position:absolute;z-index:1;filter:drop-shadow(0 1.2mm 1.6mm rgb(29 22 64 / .18))}
.lockup{display:inline-flex;align-items:center;gap:2.4mm;font-family:Geist;font-weight:700;font-size:9.5mm;letter-spacing:-0.02em;direction:ltr}
.kpill{font-family:Geist;font-weight:700;font-size:6.5mm;background:${I};color:${K.sun};border-radius:99mm;padding:.5mm 4.5mm;margin-left:1.5mm;letter-spacing:0}
h1{font-size:12mm;line-height:1.25;font-weight:700}
.hi{background:#fff;border-radius:6mm;padding:0 5mm;display:inline-block}
.lead{font-size:4.9mm;line-height:1.5;color:rgb(29 22 64 / .82)}
.partner{display:flex;align-items:center;gap:3mm;font-size:4.9mm;font-weight:500;margin-top:4mm}
.partner .line{flex:1;border-bottom:.6mm solid ${I};height:8mm;max-width:95mm}
.steps{display:flex;gap:4mm}
.step{flex:1;background:#fff;border:1mm solid ${I};border-radius:6mm;padding:3.5mm 4mm;box-shadow:0 2mm 0 rgb(29 22 64 / .18);display:flex;flex-direction:column;gap:1mm}
.num{width:10mm;height:10mm;border-radius:50%;background:${I};color:${K.sun};font-family:Geist;font-weight:700;font-size:6mm;display:grid;place-items:center;margin-bottom:1mm}
.step b{font-size:5.4mm;line-height:1.3}.step span{font-size:3.9mm;line-height:1.45;color:rgb(29 22 64 / .8)}
.chips{display:flex;flex-wrap:wrap;gap:2.6mm;justify-content:center}
.chip{font-size:4.8mm;font-weight:700;padding:1.4mm 5mm;border-radius:99mm;border:.9mm solid ${I};box-shadow:0 1.6mm 0 rgb(29 22 64 / .18);background:#fff}
.checks{display:flex;flex-direction:column;gap:2mm}
.chk{display:flex;align-items:center;gap:3mm;font-size:4.7mm;font-weight:500;background:#fff;border:.9mm solid ${I};border-radius:99mm;padding:1.4mm 3.5mm 1.4mm 6mm;box-shadow:0 1.6mm 0 rgb(29 22 64 / .18)}
.chk i{flex:none;width:8.5mm;height:8.5mm;border-radius:50%;background:${I};display:grid;place-items:center}
.chk i svg{width:5mm;height:5mm}
.qrbox{background:#fff;border:1.2mm solid ${I};border-radius:8mm;padding:4mm;box-shadow:0 3mm 0 rgb(29 22 64 / .18);width:46mm;height:46mm;flex:none}
.url{font-family:Geist;font-weight:700;font-size:7mm;direction:ltr;letter-spacing:-0.01em}
.give{position:absolute;left:0;right:0;bottom:0;height:${11 + B}mm;padding-bottom:${B}mm;background:${I};color:${K.sun};display:flex;align-items:center;justify-content:center;gap:3mm;font-size:4.6mm;font-weight:500}
.give svg{width:5.5mm;height:5.5mm}
.h2{font-size:8mm;line-height:1.3;font-weight:700}
</style></head><body>

<!-- SUN: hero -->
<div class="band" style="background:${K.sun};padding:${B + 10}mm 0 7mm">
  ${st("sun", 16, B + 10, 26, -8)}${st("crayon", 12, B + 66, 18, 0)}${st("cloud", 36, B + 72, 16, 0)}
  <div class="inner" style="padding-left:${B + 60}mm">
    <div class="lockup">${mark(12)}IraqiStar<span class="kpill">Kids</span></div>
    <h1 style="margin-top:5mm">حصص أونلاين للأطفال…<br><span class="hi">تعلّم وتفاعل من البيت</span></h1>
    <p class="lead" style="margin-top:4mm;max-width:135mm">خلّوا طفلكم يتعلّم ويتفاعل بحصص مباشرة ويا معلّمين ومعلّمات مختارين بعناية. اختاروا الحصة والموعد المناسبين، واحجزوا من الموبايل.</p>
    ${partner ? `<div class="partner"><span>حصص روضتنا</span><span class="line"></span><span>موجودة على IraqiStar Kids</span></div>` : ""}
  </div>
</div>

<!-- SKY: how -->
<div class="band" style="background:${K.sky};padding:1mm 0 7mm">
  ${wave(K.sky).replace('class="wave"', 'class="wave" style="top:-8.5mm"')}
  <div class="inner">
    <div class="h2" style="margin-bottom:3mm">الحجز؟ ثلاث خطوات وخلص.</div>
    <div class="steps">
      <div class="step"><div class="num">1</div><b>امسحوا الرمز</b><span>بكاميرا الموبايل، وشوفوا الحصص المتاحة</span></div>
      <div class="step"><div class="num">2</div><b>اختاروا واحجزوا</b><span>الموضوع والموعد المناسبين لطفلكم</span></div>
      <div class="step"><div class="num">3</div><b>وقت الحصة</b><span>ادخلوا بموعدها وساعدوا طفلكم يستعد للتعلّم والتفاعل</span></div>
    </div>
  </div>
</div>

<!-- GRASS: safety + topics -->
<div class="band" style="background:${K.grass};padding:1mm 0 7mm">
  ${wave(K.grass).replace('class="wave"', 'class="wave" style="top:-8.5mm"')}
  ${st("shield", 14, 14, 22, -6)}
  <div class="inner" style="padding-left:${B + 46}mm">
    <div class="h2" style="margin-bottom:3mm">راحة بالكم تهمّنا</div>
    <div class="checks">
      <div class="chk"><i>${check}</i>معلّمون مختارون بعناية، نراجع مؤهلاتهم قبل انضمامهم</div>
      <div class="chk"><i>${check}</i>حصة فردية ويا المعلّم، أو جماعية ويا أطفال آخرين</div>
      <div class="chk"><i>${check}</i>تسجيلات الحصص الفردية متاحة للمشاهدة لمدة 30 يوم</div>
    </div>
  </div>
</div>

<!-- BERRY: QR + topics -->
<div class="band last" style="background:${K.berry};padding:3mm 0 ${14 + B}mm">
  ${wave(K.berry).replace('class="wave"', 'class="wave" style="top:-8.5mm"')}
  ${st("star", 14, 42, 16, -12)}
  <div class="inner" style="display:flex;align-items:center;gap:7mm;height:100%">
    <div class="qrbox">${qr}</div>
    <div style="flex:1;display:flex;flex-direction:column;gap:3mm">
      <div class="h2">اختاروا أول حصة لطفلكم.</div>
      <div class="url">iraqistar.com/kids</div>
      <div class="chips" style="justify-content:flex-start">
        <span class="chip" style="background:${K.sun}">الإنجليزية</span><span class="chip" style="background:${K.sky}">العربية</span><span class="chip" style="background:${K.grass}">الرياضيات</span><span class="chip" style="background:${K.tangerine}">القصص</span><span class="chip" style="background:${K.sun}">الأناشيد</span><span class="chip" style="background:${K.sky}">الرياضة</span>
      </div>
    </div>
  </div>
  <div class="give"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.2 3 4.5 6.6 4.5c2 0 3.6 1 5.4 3 1.8-2 3.4-3 5.4-3 3.6 0 5.7 3.7 4.2 7.2C19.5 16.4 12 21 12 21Z"/></svg><span>IraqiStar™ Kids · نجم العراق</span></div>
</div>
</body></html>`;

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }).catch(() => chromium.launch());
for (const [name, partner] of [["kindergarten", true], ["generic", false]]) {
  const page = await browser.newPage();
  fs.writeFileSync(`${OUT}/_${name}.html`, html(partner));
  await page.goto(`file://${OUT}/_${name}.html`); await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: `${OUT}/iraqistar-kids-poster-${name}-A4-bleed3mm.pdf`, width: `${210 + 2 * B}mm`, height: `${297 + 2 * B}mm`, printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  await page.pdf({ path: `${OUT}/iraqistar-kids-poster-${name}-A3-bleed3mm.pdf`, width: `${(210 + 2 * B) * 1.4142}mm`, height: `${(297 + 2 * B) * 1.4142}mm`, scale: 1.4142, printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  execSync(`pdftoppm -r 110 -png -singlefile ${OUT}/iraqistar-kids-poster-${name}-A4-bleed3mm.pdf ${OUT}/preview-${name}`);
  await page.close();
}
await browser.close();
console.log(fs.readdirSync(OUT).join("\n"));
