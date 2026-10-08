// IraqiStar Facebook cover — redesign, 1640x624, mobile-safe centre 1250px. Two concepts: "mark" (giant glowing Ishtar star +
// constellation) and "phone" (video message on a phone with floating occasion chips).
import { chromium } from "playwright"; import fs from "node:fs";
const W=1640,H=624;
const MARK="M12.00 0.80 L14.49 5.99 L19.92 4.08 L18.01 9.51 L23.20 12.00 L18.01 14.49 L19.92 19.92 L14.49 18.01 L12.00 23.20 L9.51 18.01 L4.08 19.92 L5.99 14.49 L0.80 12.00 L5.99 9.51 L4.08 4.08 L9.51 5.99 Z M9.40 8.10 L16.40 12.00 L9.40 15.90 Z";
const m=(cls,extra="")=>`<svg class="${cls}" viewBox="0 0 24 24" ${extra}><path fill-rule="evenodd" d="${MARK}"/></svg>`;
// constellation: small marks + dots, positions in the left/centre area
const seed=[[300,90,22],[520,150,14],[420,330,18],[640,80,10],[720,300,26],[560,470,12],[330,520,16],[860,160,12],[900,430,18],[760,540,10],[240,300,10],[980,90,14],[1000,300,9]];
const CONST=seed.map(([x,y,s],i)=>`<g transform="translate(${x},${y}) scale(${s/24}) rotate(${(i*37)%60})"><path d="${MARK}" fill="${i%3===0?'#a58bff':'#fff'}" opacity="${0.35+((i*7)%5)*0.12}"/></g>`).join("")
 +[[0,1],[1,3],[3,4],[4,7],[2,4],[2,6],[5,4],[8,4],[9,8],[10,0],[11,7],[12,8]].map(([a,b])=>`<line x1="${seed[a][0]+seed[a][2]/2}" y1="${seed[a][1]+seed[a][2]/2}" x2="${seed[b][0]+seed[b][2]/2}" y2="${seed[b][1]+seed[b][2]/2}" stroke="rgba(165,139,255,.28)" stroke-width="1.2"/>`).join("");
const dots=Array.from({length:70},(_,i)=>{const x=((i*811)%1640), y=((i*467)%624); return `<circle cx="${x}" cy="${y}" r="${1+(i%3)*0.6}" fill="#fff" opacity="${0.15+(i%5)*0.1}"/>`;}).join("");
const base=(body,extra)=>`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-Regular.ttf);font-weight:400}
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-SemiBold.ttf);font-weight:600}
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-Bold.ttf);font-weight:700}
@font-face{font-family:Geist;src:url(fonts/Geist-Bold.ttf);font-weight:700}
@font-face{font-family:Geist;src:url(fonts/Geist-SemiBold.ttf);font-weight:600}
*{margin:0;padding:0;box-sizing:border-box}
html{overflow:hidden;width:${W}px;height:${H}px}
body{width:${W}px;height:${H}px;overflow:hidden;position:relative;font-family:"IBM Plex Sans Arabic",sans-serif;background:#08080f;color:#f7f7fb}
.bg{position:absolute;inset:0;background:radial-gradient(ellipse 900px 700px at 28% 55%,rgba(100,48,240,.55),rgba(100,48,240,0) 70%),radial-gradient(ellipse 700px 500px at 85% 20%,rgba(84,39,217,.25),rgba(84,39,217,0) 70%),#08080f}
.horizon{position:absolute;left:0;right:0;top:66%;height:2px;background:linear-gradient(90deg,rgba(165,139,255,0),rgba(165,139,255,.55) 30%,rgba(165,139,255,.55) 70%,rgba(165,139,255,0));filter:blur(.5px)}
.horizon2{position:absolute;left:0;right:0;top:66%;height:160px;background:linear-gradient(to bottom,rgba(100,48,240,.22),rgba(100,48,240,0));transform:translateY(1px)}
.sky{position:absolute;inset:0;width:100%;height:100%}
.safe{position:absolute;left:195px;right:195px;top:0;bottom:0}
.txt{position:absolute;right:0;top:50%;transform:translateY(-50%);text-align:right}
.brand{display:flex;align-items:center;gap:12px}
.brand .mk{width:44px;height:44px;border-radius:12px;background:#6430f0;display:grid;place-items:center}.brand .mk svg{width:28px;height:28px;fill:#fff}
.brand b{font-family:Geist;font-weight:700;font-size:26px;letter-spacing:-.02em;direction:ltr;color:#fff}
.h1{font-size:118px;font-weight:700;line-height:1.1;margin-top:8px;color:#fff;text-shadow:0 0 50px rgba(100,48,240,.45)}
.tag{font-size:44px;font-weight:600;color:#a58bff;margin-top:-2px}
.meta{margin-top:26px;font-family:Geist;font-weight:600;font-size:24px;color:rgba(247,247,251,.8);direction:ltr;display:flex;gap:14px;justify-content:flex-end;align-items:center}
.meta b{color:#fff}.meta i{width:5px;height:5px;border-radius:50%;background:#a58bff;font-style:normal}
${extra}
</style></head><body><div class="bg"></div><div class="horizon2"></div><div class="horizon"></div>
<svg class="sky" viewBox="0 0 ${W} ${H}">${dots}${CONST}</svg>
${body}</body></html>`;
const TXT=`<div class="txt"><div class="brand"><span class="mk">${m("")}</span><b>IraqiStar</b></div><div class="h1">نجم العراق</div><div class="tag">من نجوم العراق… إليك</div><div class="meta"><b>iraqistar.com</b><i></i><span>@iraqistar.iq</span></div></div>`;
// concept 1: giant mark
const mark=base(`<div class="safe"><div class="hero"><svg class="big" viewBox="0 0 24 24"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c9b8ff"/><stop offset=".55" stop-color="#6430f0"/><stop offset="1" stop-color="#3b1aa8"/></linearGradient></defs><path fill="url(#g)" fill-rule="evenodd" d="${MARK}"/></svg>
  <svg class="orbit" viewBox="0 0 600 600"><circle cx="300" cy="300" r="270" fill="none" stroke="rgba(165,139,255,.28)" stroke-width="1" stroke-dasharray="3 10"/><circle cx="300" cy="300" r="215" fill="none" stroke="rgba(165,139,255,.18)" stroke-width="1"/><circle cx="300" cy="30" r="5" fill="#fff"/><circle cx="530" cy="430" r="4" fill="#a58bff"/><circle cx="90" cy="380" r="3" fill="#fff"/></svg></div>${TXT}</div>`,
`.hero{position:absolute;left:70px;top:50%;transform:translateY(-50%);width:480px;height:480px}
.big{position:absolute;left:60px;top:60px;width:360px;height:360px;filter:drop-shadow(0 0 40px rgba(100,48,240,.85)) drop-shadow(0 0 120px rgba(100,48,240,.45));transform:rotate(-8deg)}
.orbit{position:absolute;left:-60px;top:-60px;width:600px;height:600px;transform:rotate(20deg)}`)
// concept 2: phone with video + floating chips
const chips=[["عيد ميلاد",50,120,"v"],["تخرّج",480,70,""],["زواج وخطوبة",20,300,""],["مقلب ومزاح",470,250,"v"],["تحفيز",80,470,""],["رسالة غنائية",440,430,""]];
const phone=base(`<div class="safe"><div class="stage">
  <div class="phone"><div class="scr"><svg class="av" viewBox="0 0 100 100" preserveAspectRatio="xMidYMax slice"><circle cx="50" cy="40" r="17"/><path d="M12 100c2-26 17-38 38-38s36 12 38 38Z"/></svg>
   <div class="top">${m("")}نجمك · فيديو شخصي</div><div class="play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7Z"/></svg></div><div class="cap">عيد ميلاد سارة<small>من نجمك · 0:42</small></div><div class="prog"><i></i></div></div></div>
  ${chips.map(([w,x,y,c])=>`<span class="chip ${c}" style="left:${x}px;top:${y}px">${w}</span>`).join("")}
  <i class="hh" style="left:400px;top:190px">♥</i><i class="hh" style="left:430px;top:140px;font-size:22px">♥</i><i class="hh" style="left:385px;top:110px;font-size:16px">♥</i>
</div>${TXT}</div>`,
`.stage{position:absolute;left:0;top:0;width:640px;height:624px}
.phone{position:absolute;left:215px;top:70px;width:225px;height:480px;background:#0c0b16;border-radius:40px;padding:10px;box-shadow:0 40px 100px rgba(0,0,0,.7),0 0 0 2px #2a2940,0 0 90px rgba(100,48,240,.5);transform:rotate(-6deg)}
.scr{position:relative;width:100%;height:100%;border-radius:32px;overflow:hidden;background:linear-gradient(170deg,#6430f0,#a58bff 60%,#ff7a9c)}
.scr .av{position:absolute;inset:0;width:100%;height:100%;fill:rgba(255,255,255,.3)}
.top{position:absolute;top:16px;left:0;right:0;display:flex;align-items:center;justify-content:center;gap:8px;font-size:15px;font-weight:600;color:#fff}.top svg{width:20px;height:20px;fill:#fff}
.play{position:absolute;left:50%;top:50%;width:66px;height:66px;border-radius:50%;background:rgba(255,255,255,.92);transform:translate(-50%,-50%);display:grid;place-items:center}.play svg{width:32px;height:32px;fill:#6430f0;margin-left:4px}
.cap{position:absolute;bottom:64px;left:14px;right:14px;background:rgba(8,8,15,.55);border-radius:12px;padding:8px 12px;color:#fff;font-size:15px;font-weight:600;text-align:right}.cap small{display:block;font-size:12px;opacity:.8;font-weight:400;margin-top:2px}
.prog{position:absolute;bottom:34px;left:14px;right:14px;height:5px;background:rgba(255,255,255,.35);border-radius:3px}.prog i{display:block;height:100%;width:62%;background:#fff;border-radius:3px}
.chip{position:absolute;background:#fff;color:#0c0b16;border-radius:999px;padding:10px 22px;font-size:22px;font-weight:700;box-shadow:0 14px 40px rgba(0,0,0,.45);white-space:nowrap}
.chip.v{background:#6430f0;color:#fff}
.hh{position:absolute;color:#ff7a9c;font-style:normal;font-size:30px;text-shadow:0 0 20px rgba(255,122,156,.8)}`);
const b=await chromium.launch({executablePath:"/opt/pw-browsers/chromium"});
for(const [name,html] of [["mark",mark],["phone",phone]]){ fs.writeFileSync(`cover2-${name}.html`,html); const p=await b.newPage({viewport:{width:W,height:H}});
  await p.goto("file://"+process.cwd()+`/cover2-${name}.html`); await p.evaluate(()=>document.fonts.ready); await p.screenshot({path:`IraqiStar-facebook-cover-${name}.png`}); await p.close(); }
await b.close(); console.log("ok");
