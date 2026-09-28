// IraqiStar social intro — same choreography and pacing as the reference template, rebuilt in code with our brand.
// 1920x1080, 28 s, 30 fps. node intro.mjs → intro-silent.mp4
import { chromium } from "playwright"; import fs from "node:fs"; import { execSync } from "node:child_process";
const FPS = 30, DUR = 28, W = 1920, H = 1080;
const MARK = "M12.00 0.80 L14.49 5.99 L19.92 4.08 L18.01 9.51 L23.20 12.00 L18.01 14.49 L19.92 19.92 L14.49 18.01 L12.00 23.20 L9.51 18.01 L4.08 19.92 L5.99 14.49 L0.80 12.00 L5.99 9.51 L4.08 4.08 L9.51 5.99 Z M9.40 8.10 L16.40 12.00 L9.40 15.90 Z";
const RIB = "IRAQISTAR · IRAQISTAR · ".repeat(60);
// ribbon paths (long curves crossing the frame)
const PATHS = [
  "M-200,200 C400,-100 900,700 1500,300 S2300,500 2400,100",
  "M-200,900 C300,300 1000,1200 1400,500 S2200,900 2400,700",
  "M-300,500 C500,1300 1100,-200 1700,800 S2200,300 2500,600",
  "M-200,-50 C600,900 1200,100 1600,1100 S2100,700 2400,1000",
];
const ribbons = (id) => `<svg class="rib" id="${id}" direction="ltr" style="direction:ltr" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><defs>${PATHS.map((d,i)=>`<path id="${id}p${i}" d="${d}"/>`).join("")}</defs>
${PATHS.map((_,i)=>`<text class="rt" font-size="${34+i*4}"><textPath href="#${id}p${i}" id="${id}t${i}" startOffset="0">${RIB}</textPath></text>`).join("")}</svg>`;

const card = (name, text, occ, img) => `<div class="card">
  <div class="ch"><span class="av"><svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="${MARK}"/></svg></span><b>${name}</b><span class="hd">${occ}</span></div>
  <p>${text}</p>${img ? `<div class="thumb"><svg viewBox="0 0 24 24"><path d="M10 8.5v7l5.5-3.5Z"/></svg></div>` : ""}
  <div class="ic"><i>♡</i><i>↻</i><i>➤</i></div></div>`;

const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-Regular.ttf);font-weight:400}
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-SemiBold.ttf);font-weight:600}
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-Bold.ttf);font-weight:700}
@font-face{font-family:Geist;src:url(fonts/Geist-Bold.ttf);font-weight:700}
@font-face{font-family:Geist;src:url(fonts/Geist-SemiBold.ttf);font-weight:600}
*{margin:0;padding:0;box-sizing:border-box}
html{overflow:hidden;width:${W}px;height:${H}px}
body{width:${W}px;height:${H}px;overflow:hidden;background:#08080f;color:#f7f7fb;font-family:"IBM Plex Sans Arabic",sans-serif;position:relative}
.bg{position:absolute;inset:0;background:#08080f}
.bg.white{background:#fff}
.scene{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:0}
.rib{position:absolute;inset:0;width:100%;height:100%}
.rt{fill:none;stroke:rgba(255,255,255,.85);stroke-width:1.1;font-family:Geist;font-weight:700;letter-spacing:.08em}
.welcome{font-family:Geist;font-weight:700;font-size:64px;letter-spacing:.02em;color:#fff;direction:ltr;background:#08080f;padding:18px 40px;border-radius:999px;box-shadow:0 0 0 2px #08080f,0 0 80px 50px rgba(8,8,15,.95)}
.welcome b{color:#6430f0}
.ink{color:#0c0b16}
.type{font-size:56px;font-weight:600;color:#0c0b16;letter-spacing:.01em}
.type span{opacity:0}
.handle{position:relative;display:inline-flex;align-items:center;gap:16px;background:#fff;border:1.5px solid #e2e0ec;border-radius:999px;padding:12px 28px 12px 14px;color:#0c0b16;font-family:Geist;font-weight:600;font-size:34px;direction:ltr;box-shadow:0 10px 40px rgba(12,11,22,.12)}
.handle .av{width:56px;height:56px;border-radius:50%;background:#6430f0;display:grid;place-items:center}
.handle .av svg{width:34px;height:34px;fill:#fff}
.big{font-size:300px;line-height:.95;font-weight:700;color:#0c0b16;letter-spacing:-.03em}
.big .n{font-family:Geist;letter-spacing:-.05em}
.stack{position:absolute;left:0;right:0;text-align:center}
.line{font-family:"IBM Plex Sans Arabic";font-weight:700;font-size:58px;color:#fff;white-space:nowrap}
.line .hl{color:#a58bff}
.gstack{position:absolute;left:0;right:0;text-align:center}
.gstack div{font-size:44px;font-weight:700;white-space:nowrap;line-height:1.12}
.cards{position:absolute;inset:0}
.card{position:absolute;width:520px;background:#fff;border:1px solid #e2e0ec;border-radius:22px;padding:22px 24px;color:#0c0b16;box-shadow:0 20px 60px rgba(12,11,22,.14);opacity:0;text-align:right}
.card .ch{display:flex;align-items:center;gap:12px;font-size:20px}
.card .av{width:40px;height:40px;border-radius:50%;background:#6430f0;display:grid;place-items:center}
.card .av svg{width:24px;height:24px;fill:#fff}
.card .hd{margin-inline-start:auto;background:#eae8f3;border-radius:999px;padding:4px 14px;font-size:16px;color:#4f5368}
.card p{margin-top:14px;font-size:22px;line-height:1.6;color:#0c0b16}
.card .thumb{margin-top:14px;height:180px;border-radius:14px;background:linear-gradient(135deg,#6430f0,#a58bff);display:grid;place-items:center}
.card .thumb svg{width:64px;height:64px;fill:#fff}
.card .ic{margin-top:14px;display:flex;gap:22px;font-style:normal;font-size:24px;color:#4f5368;direction:ltr}
.like{font-size:52px;font-weight:700;color:#0c0b16;display:flex;flex-direction:column;align-items:center;gap:22px}
.like .row{display:flex;gap:40px;direction:ltr}
.like .row i{font-style:normal;font-size:64px;opacity:0;color:#0c0b16}
.like .row i.on{color:#6430f0}
.cloud{position:absolute;inset:0}
.cloud span{position:absolute;background:#fff;border:1px solid #e2e0ec;border-radius:999px;padding:10px 24px;font-size:26px;font-weight:600;color:#0c0b16;box-shadow:0 8px 30px rgba(12,11,22,.1);opacity:0}
.center{font-size:64px;font-weight:700;color:#0c0b16;text-align:center;line-height:1.5}
.center .hl{color:#6430f0}
.give{position:absolute;left:0;right:0;bottom:70px;text-align:center;font-size:30px;color:rgba(255,255,255,.75);opacity:0}
</style></head><body>
<div class="bg" id="bg"></div>
<!-- S1 ribbons + welcome -->
<div class="scene" id="s1">${ribbons("r1")}<div class="welcome" id="w1">WELCOME TO <b>IRAQISTAR</b></div></div>
<!-- S2 typing -->
<div class="scene" id="s2"><div class="type" id="t2">${"اطلب فيديو من نجمك، استلمه، وشاركه مع اللي تحب".split(" ").map(w=>`<span>${w}</span>`).join(" ")}</div></div>
<!-- S3 handle -->
<div class="scene" id="s3"><div class="handle" id="h3"><span class="av"><svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="${MARK}"/></svg></span>@iraqistar.iq</div></div>
<!-- S4 big hours -->
<div class="scene" id="s4"><div class="type" id="t4" style="position:absolute;top:120px;left:0;right:0;text-align:center">${"الفيديو يوصلك خلال".split(" ").map(w=>`<span>${w}</span>`).join(" ")}</div>
  <div class="stack" id="st4" style="top:260px"><div class="big"><span class="n">7</span> أيام</div><div class="big"><span class="n">7</span> أيام</div><div class="big"><span class="n">7</span> أيام</div></div></div>
<!-- S5 black band lines -->
<div class="scene" id="s5"><div class="line" id="l5">فيديو <span class="hl" id="hl1">شخصي</span>، جلسة <span class="hl" id="hl2">مباشرة</span>، حصص <span class="hl" id="hl3">للأطفال</span>، ومحتوى <span class="hl" id="hl4">لعملك</span>.</div>
  <div class="gstack" id="g5">${Array.from({length:11},(_,i)=>`<div style="color:${i===5?'#fff':`hsl(${255+ (i-5)*6} 90% ${52+Math.abs(i-5)*4}%)`};opacity:${i===5?1:0.85-Math.abs(i-5)*0.13}">فيديو شخصي، جلسة مباشرة، حصص للأطفال، ومحتوى لعملك.</div>`).join("")}</div></div>
<!-- S6 cards -->
<div class="scene" id="s6"><div class="cards">
  ${card("نجمك", "سارة، عيد ميلاد سعيد! أخوك عمر قال لي هذا يومك… خلّيه أحلى يوم بالسنة.", "عيد ميلاد", true)}
  ${card("نجمك", "مبروك التخرّج يا علي. تعبك بان، والجاي أحلى.", "تخرّج", false)}
  ${card("نجمك", "مقلب بصديقك؟ أنا وياك. شنو اسمه؟", "مقلب ومزاح", false)}
</div>
  <div class="like" id="lk6"><span id="lt6"></span><div class="row"><i id="i1">♥</i><i id="i2">↻</i><i id="i3">➤</i></div></div></div>
<!-- S7 connect + cloud -->
<div class="scene" id="s7"><div class="cloud" id="cl7">${[["عيد ميلاد",220,180],["تخرّج",1500,160],["زواج وخطوبة",260,760],["عيد ورمضان",1480,780],["مقلب ومزاح",180,470],["رومانسية",1560,470],["كرة القدم",640,150],["رسالة غنائية",1120,140],["تحفيز",700,860],["تهنئة أعمال",1150,870]].map(([w,x,y])=>`<span style="left:${x}px;top:${y}px">${w}</span>`).join("")}</div>
  <div class="center" id="c7"><div id="c7a"></div><div id="c7b"></div></div></div>
<!-- S8 end -->
<div class="scene" id="s8">${ribbons("r8")}<div class="handle" id="h8" style="font-size:44px;padding:16px 36px 16px 18px"><span class="av"><svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="${MARK}"/></svg></span>@iraqistar.iq</div><div class="give" id="gv">مع كل طلب، جزء من أرباحنا يروح للأعمال الخيرية بالعراق · iraqistar.com</div></div>
<script>
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)), eo=x=>1-Math.pow(1-x,3), ei=x=>x*x*x, eio=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2, seg=(t,s,d)=>clamp((t-s)/d,0,1), $=id=>document.getElementById(id);
const S=[["s1",0,2.6,"dark"],["s2",2.6,4.6,"white"],["s3",4.6,6.4,"white"],["s4",6.4,9.4,"white"],["s5",9.4,14.2,"dark"],["s6",14.2,19.6,"white"],["s7",19.6,24.6,"white"],["s8",24.6,28,"dark"]];
function typeWords(el,t,s,step){const ws=el.querySelectorAll('span');ws.forEach((w,i)=>{w.style.opacity=t>=s+i*step?1:0;});}
function ribbon(id,t,speed){for(let i=0;i<4;i++){const tp=$(id+'t'+i);if(tp)tp.setAttribute('startOffset',(-((t*speed*(1+i*0.25))%1200)-100)+'px');}}
window.renderAt=t=>{
  let bg='dark';
  S.forEach(([id,s,e,mode])=>{const el=$(id);const on=t>=s&&t<e;el.style.opacity=on?1:0;if(on)bg=mode;});
  $('bg').className='bg'+(bg==='white'?' white':'');
  // S1
  ribbon('r1',t,260); $('w1').style.opacity=eo(seg(t,0.5,0.5)); $('w1').style.transform=\`scale(\${(0.9+0.1*eo(seg(t,0.5,0.5))).toFixed(3)})\`;
  // S2 typing
  typeWords($('t2'),t,2.7,0.22);
  // S3 handle pop
  const h=eo(seg(t,4.7,0.5)); $('h3').style.transform=\`scale(\${(0.6+0.4*h).toFixed(3)})\`; $('h3').style.opacity=h;
  // S4
  typeWords($('t4'),t,6.5,0.25);
  const st=$('st4'); const k4=eo(seg(t,7.4,0.7)); st.style.transform=\`translateY(\${((1-k4)*400).toFixed(0)}px)\`; st.style.opacity=clamp(k4*2,0,1);
  [...st.children].forEach((c,i)=>{c.style.opacity=i===0?1:(t>7.9+ (i-1)*0.25?0.35:0); c.style.transform=\`translateY(\${(i===0?0:-40*i)}px) scale(\${1-0.04*i})\`;});
  // S5
  const l=$('l5'); const k5=eo(seg(t,9.5,0.5)); l.style.opacity=k5; l.style.transform=\`translateY(\${((1-k5)*30).toFixed(0)}px)\`;
  [1,2,3,4].forEach(i=>{const on=t>=10.0+(i-1)*0.6; $('hl'+i).style.color=on?'#a58bff':'#fff';});
  const g=$('g5'); const k5b=eo(seg(t,12.6,0.6)); g.style.opacity=k5b; g.style.transform=\`translateY(-50%) scaleY(\${(0.2+0.8*k5b).toFixed(3)})\`; g.style.top='50%'; l.style.opacity=(k5*(1-k5b)).toFixed(3);
  // S6 cards
  const cs=document.querySelectorAll('#s6 .card'); const pos=[[700,120],[1180,220],[260,300]];
  cs.forEach((c,i)=>{const k=eo(seg(t,14.3+i*0.7,0.5)); const out=eo(seg(t,17.2,0.4)); c.style.opacity=(k*(1-out)).toFixed(3); c.style.left=pos[i][0]+'px'; c.style.top=(pos[i][1]+(1-k)*120)+'px'; c.style.transform=\`rotate(\${(i-1)*3}deg) scale(\${(0.9+0.1*k).toFixed(3)})\`;});
  const lk=$('lk6'); const k6=eo(seg(t,17.4,0.5)); lk.style.opacity=k6; $('lt6').textContent=t<18.6?'اطلب، شارك،':'اطلب، شارك، وفرّح';
  ['i1','i2','i3'].forEach((id,i)=>{const on=t>=17.9+i*0.35; const el=$(id); el.style.opacity=on?1:0; el.classList.toggle('on',t>=18.3+i*0.35);});
  // S7 cloud + center
  document.querySelectorAll('#cl7 span').forEach((sp,i)=>{const k=eo(seg(t,19.7+i*0.18,0.4)); sp.style.opacity=k; sp.style.transform=\`translateY(\${((1-k)*30).toFixed(0)}px)\`;});
  const words=['اطلب','الآن','من','نجمك']; $('c7a').innerHTML=words.slice(0,Math.floor(seg(t,20.4,1.2)*4.999)).join(' ');
  $('c7b').innerHTML=t>=22.0? 'نجوم بكل <span class="hl">المجالات</span>… حتى تلكه <span class="hl">نجمك</span>.':'';
  // S8
  ribbon('r8',t,220); const k8=eo(seg(t,24.9,0.5)); $('h8').style.opacity=k8; $('h8').style.transform=\`scale(\${(0.7+0.3*k8).toFixed(3)})\`; $('gv').style.opacity=eo(seg(t,25.8,0.6));
  document.body.style.opacity=(1-eo(seg(t,27.5,0.5))).toFixed(3);
};
</script></body></html>`;
fs.writeFileSync("intro.html", html);
const dir = "frames"; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir);
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }); const p = await b.newPage({ viewport: { width: W, height: H } });
await p.goto("file://" + process.cwd() + "/intro.html"); await p.evaluate(() => document.fonts.ready);
const only = process.argv[2] ? process.argv[2].split(",").map(Number) : null;
for (let f = 0; f < DUR * FPS; f++) { if (only && !only.includes(f)) continue; await p.evaluate(t => window.renderAt(t), f / FPS); await p.screenshot({ path: `${dir}/${String(f).padStart(4, "0")}.jpg`, type: "jpeg", quality: 90 }); }
await b.close();
if (!only) execSync(`ffmpeg -v error -y -framerate ${FPS} -i ${dir}/%04d.jpg -c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium -movflags +faststart intro-silent.mp4`);
console.log("done");
