import { chromium } from "playwright";
import { posts } from "./posts.mjs";
import fs from "fs";
import { execSync } from "child_process";

const ROOT = "/home/claude/ig";
const OUT = `${ROOT}/out`;
fs.mkdirSync(OUT, { recursive: true });
const only = process.argv[2] ? process.argv[2].split(",").map(Number) : null;

const MARK = "M12.00 0.80 L14.49 5.99 L19.92 4.08 L18.01 9.51 L23.20 12.00 L18.01 14.49 L19.92 19.92 L14.49 18.01 L12.00 23.20 L9.51 18.01 L4.08 19.92 L5.99 14.49 L0.80 12.00 L5.99 9.51 L4.08 4.08 L9.51 5.99 Z M9.40 8.10 L16.40 12.00 L9.40 15.90 Z";
const mark = (cls, fill, style = "") => `<svg class="${cls}" viewBox="0 0 24 24" fill="${fill}" style="${style}"><path fill-rule="evenodd" d="${MARK}"/></svg>`;

const CSS = `
@font-face{font-family:"Plex Arabic";font-weight:400;src:url("file://${ROOT}/node_modules/@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-400-normal.woff2")}
@font-face{font-family:"Plex Arabic";font-weight:500;src:url("file://${ROOT}/node_modules/@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-500-normal.woff2")}
@font-face{font-family:"Plex Arabic";font-weight:700;src:url("file://${ROOT}/node_modules/@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-700-normal.woff2")}
@font-face{font-family:"Geist";font-weight:100 900;src:url("file://${ROOT}/node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2")}
:root{--violet:#6430f0;--violet-soft:#a58bff;--ink:#0c0b16;--night:#08080f;--paper:#f4f3f9;--line:#e2e0ec;--pencil:#4f5368;--night-line:#33324a;--night-pencil:#b3b6cb}
*{box-sizing:border-box;margin:0}
html,body{margin:0}
body{font-family:"Plex Arabic",sans-serif}
.slide{width:1080px;height:1350px;position:relative;overflow:hidden;padding:96px 88px;display:flex;flex-direction:column}
.dark{background:var(--night);color:#f7f7fb}.light{background:var(--paper);color:var(--ink)}
.top{display:flex;justify-content:space-between;align-items:center;direction:ltr;position:relative;z-index:2}
.lockup{display:flex;align-items:center;gap:12px;font-family:Geist;font-weight:700;font-size:40px;letter-spacing:-0.02em}
.lockup svg{width:44px;height:44px}
.count{font-family:Geist;font-size:26px;font-weight:500;opacity:.55}
.foot{margin-top:auto;display:flex;justify-content:space-between;align-items:center;font-size:28px;font-weight:500;position:relative;z-index:2}
.dark .foot{color:var(--night-pencil)}.light .foot{color:var(--pencil)}
.swipe{display:flex;align-items:center;gap:14px}
.arrow{width:56px;height:56px;border-radius:50%;background:var(--violet);display:grid;place-items:center}
.arrow svg{width:26px;height:26px}
.ltr{direction:ltr;font-family:Geist}
h1{font-size:104px;line-height:1.3;font-weight:700}
h1.m{font-size:88px}
h2{font-size:80px;line-height:1.3;font-weight:700}
.v{color:var(--violet)}.dark .v{color:var(--violet-soft)}
.lead{font-size:40px;line-height:1.6;margin-top:36px;max-width:820px}
.dark .lead{color:var(--night-pencil)}.light .lead{color:var(--pencil)}
.eyebrow{display:inline-block;font-size:30px;font-weight:500;padding:12px 28px;border-radius:999px;margin-bottom:36px}
.dark .eyebrow{background:#1c1b2a;border:2px solid var(--night-line);color:#f7f7fb}.light .eyebrow{background:#fff;border:2px solid var(--line)}
.mid{margin-top:auto;margin-bottom:auto;position:relative;z-index:2}
.ghost{position:absolute;fill:var(--violet);opacity:.07;z-index:1}.dark .ghost{opacity:.16}
.steps{display:flex;flex-direction:column;gap:28px;margin-top:60px}
.step{display:flex;align-items:center;gap:32px;border-radius:32px;padding:36px 40px}
.light .step{background:#fff;border:2px solid var(--line)}.dark .step{background:#13121e;border:2px solid #222133}
.compact .step{padding:26px 36px}.compact{gap:20px}
.num{flex:none;width:84px;height:84px;border-radius:50%;background:var(--violet);color:#fff;font-family:Geist;font-weight:700;font-size:40px;display:grid;place-items:center}
.num svg{width:40px;height:40px}
.num.dot{width:28px;height:28px;margin:0 12px}
.step b{display:block;font-size:42px;font-weight:700}
.step span{display:block;font-size:30px;margin-top:6px}
.light .step span{color:var(--pencil)}.dark .step span{color:var(--night-pencil)}
.opts{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:64px}
.opt{display:flex;align-items:center;gap:22px;font-size:40px;font-weight:500;padding:30px 32px;border-radius:32px;background:#fff;border:2px solid var(--line)}
.dark .opt{background:#13121e;border-color:#222133}
.opt i{flex:none;font-style:normal;width:64px;height:64px;border-radius:50%;background:var(--violet);color:#fff;display:grid;place-items:center;font-weight:700;font-size:34px}
.q{font-size:64px;font-weight:700;line-height:1.4}
.a{font-size:200px;font-weight:700;line-height:1.25;margin-top:16px}
.bigword{font-family:Geist;font-weight:700;font-size:340px;line-height:1;letter-spacing:-0.04em;direction:ltr;text-align:right}
.center{align-items:center;text-align:center}
.bigmark{width:190px;height:190px;margin-bottom:56px}
.pill{display:inline-block;margin-top:52px;padding:20px 56px;border-radius:999px;background:var(--violet);color:#fff;font-size:44px;font-weight:700}
.url{font-family:Geist;font-size:36px;font-weight:500;margin-top:40px;direction:ltr}
.light .url{color:var(--pencil)}.dark .url{color:var(--night-pencil)}
.datechip{font-size:34px;font-weight:500;padding:14px 36px;border-radius:999px;border:2px solid var(--night-line);background:#13121e;display:inline-block;margin-bottom:48px}
/* mystery card */
.qcard{width:440px;height:600px;border-radius:40px;background:#13121e;border:2px solid #33324a;position:relative;margin:0 auto 40px;display:grid;place-items:center}
.qcard .q{font-family:Geist;font-weight:700;font-size:260px;line-height:1;color:#6c3af9}
.qchip{position:absolute;padding:16px 28px;border-radius:999px;font-size:30px;font-weight:500;background:#1c1b2a;border:2px solid #33324a;color:#f7f7fb;white-space:nowrap}
.qchip.to{top:40px;right:-60px;background:#6430f0;border-color:#6430f0}
.qchip.occ{bottom:120px;left:-90px}
.qbar{position:absolute;bottom:44px;left:40px;right:40px;height:8px;border-radius:8px;background:#33324a}
.qbar i{display:block;width:38%;height:100%;border-radius:8px;background:#a58bff}
/* giving strip */
.give{position:absolute;left:0;right:0;bottom:0;height:88px;z-index:3;display:flex;align-items:center;justify-content:center;gap:16px;background:#6430f0;color:#fff;font-size:29px;font-weight:500}
.give svg{width:34px;height:34px;flex:none}
.kids .give{background:#1d1640;color:#ffd23f}
.slide.hasgive{padding-bottom:160px}
.slide.hasgive .kwave{bottom:88px;height:180px}
.rgive{display:inline-flex;align-items:center;gap:18px;background:#6430f0;color:#fff;border-radius:999px;padding:22px 40px;font-size:30px;font-weight:500;line-height:1.5;white-space:nowrap}
.rgive svg{width:40px;height:40px;flex:none}
.kids .rgive{background:#1d1640;color:#ffd23f}
/* kids */
.kids{color:#1d1640}
.kids .foot{color:#1d1640}
.kids .lead{color:rgb(29 22 64 / .8)}
.kids h1,.kids h2{font-weight:700}
.kids .v{color:#1d1640;background:#fff;border-radius:24px;padding:0 22px;box-decoration-break:clone;-webkit-box-decoration-break:clone}
.kids .step{background:#fff;border:3px solid #1d1640;box-shadow:0 8px 0 rgb(29 22 64 / .18)}
.kids .step span{color:rgb(29 22 64 / .78)}
.kids .num{background:#1d1640;color:#ffd23f}
.kpill{font-family:Geist;font-weight:700;font-size:30px;background:#1d1640;color:#ffd23f;border-radius:999px;padding:4px 20px;margin-left:6px;letter-spacing:0}
.sticker{position:absolute;z-index:1;filter:drop-shadow(0 14px 18px rgb(29 22 64 / .2))}
.kwave{position:absolute;left:0;right:0;bottom:0;height:210px;z-index:1}
.kwave svg{display:block;width:100%;height:70px}
.kwave div{height:140px}
.kids .pill{background:#1d1640;color:#ffd23f}
/* reel */
.reel{width:1080px;height:1920px;position:relative;overflow:hidden}
.scene{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:0 96px;opacity:0}
.scene .l{font-weight:700;font-size:124px;line-height:1.35;will-change:transform,opacity}
.scene .l.big{font-size:190px}
.scene .l.huge{font-family:Geist;font-size:380px;letter-spacing:-0.04em;line-height:1.05}
.scene .l.ltr{direction:ltr;text-align:right}
.scene.c{align-items:center;text-align:center}
.rlock{position:absolute;top:150px;left:96px;direction:ltr}
`;

const lockup = (dark) => `<div class="lockup" style="color:${dark ? "#f7f7fb" : "#0c0b16"}">${mark("", dark ? "#6c3af9" : "#6430f0")}IraqiStar</div>`;
const ghostPos = { bl: "width:900px;height:900px;left:-330px;bottom:-300px", tr: "width:760px;height:760px;right:-300px;top:-260px", br: "width:820px;height:820px;right:-300px;bottom:-320px" };
const swipe = `<div class="swipe"><span>اسحب</span><div class="arrow"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></div></div>`;
const check = `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`;
const AR = ["أ", "ب", "ج", "د"];


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
const sticker = ([name, x, y, size, rot]) => `<svg class="sticker" viewBox="0 0 64 64" style="left:${x}px;top:${y}px;width:${size}px;height:${size}px;transform:rotate(${rot}deg)">${ART[name]}</svg>`;
const kLockup = `<div class="lockup" style="color:${I}">${mark("", I)}IraqiStar<span class="kpill">Kids</span></div>`;
const kWave = (c) => `<div class="kwave"><svg viewBox="0 0 1440 48" preserveAspectRatio="none"><path d="M0 48V26C80 12 160 4 240 10s160 28 240 30 160-22 240-26 160 14 240 20 160-8 240-18 160-8 240 2v30H0Z" fill="${c}"/></svg><div style="background:${c}"></div></div>`;
function kidsSlide(s, i, total) {
  const top = `<div class="top" style="width:100%">${kLockup}${total > 1 ? `<div class="count">${i + 1} / ${total}</div>` : ""}</div>`;
  const st = (s.stickers || []).map(sticker).join("");
  const foot = `<div class="foot" style="width:100%">${s.swipe ? `<span>${s.foot || "حصص مباشرة للأطفال"}</span>` + swipe.replace('class="arrow"', `class="arrow" style="background:${I}"`) : `<span>${s.foot || "حصص مباشرة للأطفال"}</span><span class="ltr">iraqistar.com</span>`}</div>`;
  let mid = "";
  if (s.kind === "khook") mid = `<h1 class="${(s.h1 + s.h2).length > 30 ? "m" : ""}">${s.h1}<br><span class="v">${s.h2}</span></h1>${s.sub ? `<p class="lead">${s.sub}</p>` : ""}`;
  else if (s.kind === "ksteps") mid = `<h2>${s.h1}<br><span class="v">${s.h2}</span></h2><div class="steps">${s.steps.map(([b, sp], k) => `<div class="step"><div class="num">${s.marker === "check" ? check.replace('stroke="#fff"', `stroke="${K.sun}"`) : k + 1}</div><div><b>${b}</b><span>${sp}</span></div></div>`).join("")}</div>`;
  else if (s.kind === "kclose") return `<section class="slide kids center" style="background:${K[s.field]}">${st}${kWave(K[s.wave || "sun"])}${top}<div class="mid">${mark("bigmark", I)}<h1 style="font-size:112px;direction:ltr;font-family:Geist">IraqiStar <span class="kpill" style="font-size:84px;padding:4px 40px">Kids</span></h1><p class="lead" style="font-size:46px;margin-inline:auto">حصص مباشرة للأطفال، وأنت وياهم.</p><div class="pill">قريباً</div></div><div class="foot" style="width:100%;justify-content:center"><span>تابعنا حتى يوصلك الخبر أول</span></div></section>`;
  return `<section class="slide kids" style="background:${K[s.field]}">${st}${kWave(K[s.wave || "sky"])}${top}<div class="mid">${mid}</div>${foot}</section>`;
}

const HEART = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.2 3 4.5 6.6 4.5c2 0 3.6 1 5.4 3 1.8-2 3.4-3 5.4-3 3.6 0 5.7 3.7 4.2 7.2C19.500 16.400 12 21 12 21Z"/></svg>`;
const GIVE = "مع كل طلب، جزء من أرباحنا يدعم الأعمال الخيرية في العراق";
function slideWithGive(s, i, total) {
  const html = slideHtml(s, i, total);
  if (!(total === 1 || i === 0 || i === total - 1)) return html;
  return html.replace('class="slide ', 'class="slide hasgive ').replace(/<\/section>$/, `<div class="give">${HEART}<span>${GIVE}</span></div></section>`);
}
function slideHtml(s, i, total) {
  if (s.kind[0] === "k") return kidsSlide(s, i, total);
  const dark = s.theme === "dark";
  const top = `<div class="top" style="width:100%">${lockup(dark)}${total > 1 ? `<div class="count">${i + 1} / ${total}</div>` : ""}</div>`;
  const ghost = s.ghost ? mark("ghost", "", ghostPos[s.ghost]) : "";
  const footR = s.foot ? (s.footLtr ? `<span class="ltr">${s.foot}</span>` : `<span>${s.foot}</span>`) : `<span>نجم العراق</span>`;
  const footL = s.swipe ? swipe : s.footLtr ? `<span>نجم العراق</span>` : `<span class="ltr">iraqistar.com</span>`;
  const foot = `<div class="foot" style="width:100%">${s.footLtr ? footL + footR : footR + footL}</div>`;
  const eyebrow = s.eyebrow ? `<div class="eyebrow">${s.eyebrow}</div><br>` : "";
  let mid = "";
  if (s.kind === "hook") {
    const long = (s.h1 + s.h2).length > 34;
    mid = `${eyebrow}<h1 class="${long ? "m" : ""}">${s.h1}<br><span class="v">${s.h2}</span></h1>${s.sub ? `<p class="lead">${s.sub}</p>` : ""}`;
  } else if (s.kind === "steps") {
    const st = s.start || 1;
    mid = `<h2>${s.h1}<br><span class="v">${s.h2}</span></h2><div class="steps ${s.compact ? "compact" : ""}">${s.steps.map(([b, sp], k) => `<div class="step"><div class="num ${s.marker === "dot" ? "dot" : ""}">${s.marker === "check" ? check : s.marker === "dot" ? "" : st + k}</div><div><b>${b}</b><span>${sp}</span></div></div>`).join("")}</div>`;
  } else if (s.kind === "ask") {
    mid = `<h1 class="m">${s.h1}<br><span class="v">${s.h2}</span></h1>${s.sub ? `<p class="lead">${s.sub}</p>` : ""}${s.options ? `<div class="opts">${s.options.map((o, k) => `<div class="opt"><i>${AR[k]}</i>${o}</div>`).join("")}</div>` : ""}`;
  } else if (s.kind === "qcard") {
    mid = `<div class="qcard"><div class="q">?</div><div class="qchip to">${s.to}</div><div class="qchip occ">${s.occ}</div><div class="qbar"><i></i></div></div><h2 style="text-align:center">${s.h1}<br><span class="v">${s.h2}</span></h2>`;
  } else if (s.kind === "vcard") {
    mid = `<div class="qcard">${mark("", "#6c3af9", "width:150px;height:150px")}<div class="qchip to">${s.to}</div><div class="qchip occ">${s.occ}</div><div class="qbar"><i></i></div></div><p style="text-align:center;font-size:24px;color:#8a8fa6;margin:-24px 0 32px">مثال توضيحي</p><h2 style="text-align:center">${s.h1}<br><span class="v">${s.h2}</span></h2>`;
  } else if (s.kind === "qa") {
    mid = `<div class="q">${s.q}</div><div class="a v">${s.a}</div><p class="lead">${s.sub}</p>`;
  } else if (s.kind === "big") {
    mid = `<div class="bigword v">${s.big}</div><h2 style="margin-top:24px">${s.h}</h2><p class="lead">${s.sub}</p>`;
  } else if (s.kind === "national") {
    return `<section class="slide dark center">${mark("ghost", "", "width:1500px;height:1500px;left:-210px;top:-75px;opacity:.10")}${top}<div class="mid">${mark("bigmark", "#6c3af9", "width:240px;height:240px")}<br><div class="datechip">${s.date}</div><h1>${s.h1}<br><span class="v">${s.h2}</span></h1><p class="lead" style="margin-inline:auto">${s.sub}</p></div><div class="foot" style="width:100%;justify-content:center"><span>نجم العراق</span></div></section>`;
  } else if (s.kind === "close") {
    return `<section class="slide ${s.theme} center">${top}<div class="mid">${mark("bigmark", dark ? "#6c3af9" : "#6430f0")}<h1 style="font-size:120px">نجم العراق</h1><p class="lead" style="font-size:46px;margin-inline:auto">من نجوم العراق… إليك</p><div class="pill">${s.pill}</div><div class="url">iraqistar.com</div></div><div class="foot" style="width:100%;justify-content:center"><span>${s.cta}</span></div></section>`;
  }
  return `<section class="slide ${s.theme}">${ghost}${top}<div class="mid">${mid}</div>${foot}</section>`;
}

function reelHtml(p) {
  const scenes = p.scenes.map((sc, i) => {
    const dark = sc.bg === "dark";
    if (K[sc.bg]) {
      if (sc.close) return `<div class="scene c kids" data-i="${i}" style="background:${K[sc.bg]};color:${I}">${(sc.stickers||[]).map(sticker).join("")}<div class="l" style="font-size:0">${mark("", I, "width:220px;height:220px")}</div><div class="l" style="font-size:120px;direction:ltr;font-family:Geist;margin-top:30px">IraqiStar <span class="kpill" style="font-size:92px;padding:4px 44px">Kids</span></div><div class="l" style="font-size:54px;font-weight:500;margin-top:30px">حصص مباشرة للأطفال، وأنت وياهم.</div><div class="l" style="font-size:0;margin-top:60px"><span class="pill" style="margin:0;font-size:56px;padding:26px 72px">قريباً</span></div><div class="l" style="font-size:0;margin-top:90px"><span class="rgive">${HEART}<span>${GIVE}</span></span></div></div>`;
      return `<div class="scene kids" data-i="${i}" style="background:${K[sc.bg]};color:${I}"><div class="rlock">${kLockup}</div>${(sc.stickers||[]).map(sticker).join("")}${sc.lines.map(([t, c]) => `<div class="l ${c.split(" ").filter((x) => x !== "h" && x !== "v").join(" ")}" style="position:relative;z-index:2">${c.split(" ").includes("v") ? `<span class="v">${t}</span>` : t}</div>`).join("")}</div>`;
    }
    const bg = dark ? "#08080f" : "#f4f3f9", ink = dark ? "#f7f7fb" : "#0c0b16", vio = dark ? "#a58bff" : "#6430f0";
    if (sc.close) {
      return `<div class="scene c" data-i="${i}" style="background:${bg};color:${ink}"><div class="l" style="font-size:0">${mark("", dark ? "#6c3af9" : "#6430f0", "width:230px;height:230px")}</div><div class="l" style="font-size:150px">نجم العراق</div><div class="l" style="font-size:54px;font-weight:400;color:${dark ? "#b3b6cb" : "#4f5368"}">من نجوم العراق… إليك</div><div class="l" style="font-size:0;margin-top:60px"><span class="pill" style="margin:0;font-size:56px;padding:26px 72px">${sc.pill || "قريباً"}</span></div><div class="l" style="font-size:44px;font-weight:500;margin-top:56px;color:${dark ? "#b3b6cb" : "#4f5368"}">${sc.cta || '<span class="ltr">iraqistar.com</span>'}</div><div class="l" style="font-size:0;margin-top:90px"><span class="rgive">${HEART}<span>${GIVE}</span></span></div></div>`;
    }
    return `<div class="scene" data-i="${i}" style="background:${bg};color:${ink}"><div class="rlock">${lockup(dark)}</div>${mark("", vio, `position:absolute;width:1300px;height:1300px;opacity:${dark ? 0.1 : 0.06};left:-420px;bottom:-380px`)}${sc.lines.map(([t, c]) => `<div class="l ${c.split(" ").filter((x) => x !== "h" && x !== "v").join(" ")}" style="${c.split(" ").includes("v") ? `color:${vio}` : ""}">${t}</div>`).join("")}</div>`;
  }).join("");
  const timing = JSON.stringify(p.scenes.map((s) => s.d));
  return `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>${CSS}</style></head><body><div class="reel">${scenes}</div><script>
const D=${timing};const S=[...document.querySelectorAll('.scene')];
const ease=x=>1-Math.pow(1-Math.min(Math.max(x,0),1),3);
window.renderAt=t=>{let a=0;S.forEach((el,i)=>{const s=a,e=a+D[i];a=e;const last=i===S.length-1;
 if(t<s||(t>=e&&!last)){el.style.opacity=0;return}
 el.style.opacity=1;const lt=t-s;
 [...el.querySelectorAll('.l')].forEach((l,k)=>{const step=Math.min(0.28,(D[i]*0.45)/Math.max(el.querySelectorAll('.l').length,1));const p=ease((lt-0.06-k*step)/0.42);
  const out=last?0:ease((lt-(D[i]-0.22))/0.22);
  l.style.opacity=p*(1-out);l.style.transform='translateY('+((1-p)*70-out*40)+'px)';});
});};
</script></body></html>`;
}

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }).catch(() => chromium.launch());
const manifest = [];
for (const p of posts) {
  const id = `post-${String(p.n).padStart(2, "0")}`;
  const files = [];
  if (p.existing) {
    const pg = await browser.newPage({ viewport: { width: 1080, height: 1350 } }); await pg.goto(`file://${ROOT}/slides.html`); await pg.evaluate(() => document.fonts.ready);
    for (let i = 1; i <= 5; i++) { await pg.locator('#s' + i).screenshot({ path: `${OUT}/${id}-slide${i}.png` }); files.push(`${id}-slide${i}.png`); } await pg.close();
  } else if (only && !only.includes(p.n)) {
    fs.readdirSync(OUT).filter((f) => f.startsWith(id)).sort().forEach((f) => files.push(f));
  } else if (p.type === "reel") {
    const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
    fs.writeFileSync(`${ROOT}/_tmp.html`, reelHtml(p)); await page.goto(`file://${ROOT}/_tmp.html`); await page.evaluate(() => document.fonts.ready);
    const total = p.scenes.reduce((a, s) => a + s.d, 0), fps = 30, dir = `${OUT}/_f${p.n}`;
    fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir);
    for (let f = 0; f < Math.round(total * fps); f++) {
      await page.evaluate((t) => window.renderAt(t), f / fps);
      await page.screenshot({ path: `${dir}/${String(f).padStart(4, "0")}.jpg`, type: "jpeg", quality: 92 });
    }
    // cover = last frame
    await page.screenshot({ path: `${OUT}/${id}-cover.png` });
    await page.close();
    execSync(`ffmpeg -v error -y -framerate ${fps} -i ${dir}/%04d.jpg -f lavfi -i anullsrc=r=44100:cl=stereo -shortest -c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium -c:a aac -b:a 128k -movflags +faststart ${OUT}/${id}-reel.mp4`);
    fs.rmSync(dir, { recursive: true, force: true });
    files.push(`${id}-reel.mp4`, `${id}-cover.png`);
    console.log(id, "reel", total + "s");
  } else {
    const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
    for (let i = 0; i < p.slides.length; i++) {
      fs.writeFileSync(`${ROOT}/_tmp.html`, `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>${CSS}</style></head><body>${slideWithGive(p.slides[i], i, p.slides.length)}</body></html>`); await page.goto(`file://${ROOT}/_tmp.html`);
      await page.evaluate(() => document.fonts.ready);
      const name = p.slides.length > 1 ? `${id}-slide${i + 1}.png` : `${id}.png`;
      await page.screenshot({ path: `${OUT}/${name}` }); files.push(name);
    }
    await page.close();
    console.log(id, files.length);
  }
  manifest.push({ n: p.n, id, date: p.date, type: p.type, pillar: p.pillar, title: p.title, files, caption: p.caption, comment: p.comment });
}
await browser.close();
fs.writeFileSync(`${OUT}/manifest.json`, JSON.stringify(manifest, null, 2));
