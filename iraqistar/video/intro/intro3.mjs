// نجم العراق — social intro v3: two tagline reveals (mask sweep + light bar), star-profile carousel, phone mockup with a
// playing video message, sliding request-card carousel, category run, end card. Beat-locked at 128 BPM. 1920x1080.
import { chromium } from "playwright"; import fs from "node:fs"; import { execSync } from "node:child_process";
const FPS = 30, W = 1920, H = 1080, B = 60 / 128, BEATS = 65; const DUR = Math.round(BEATS * B * FPS) / FPS;
const MARK = "M12.00 0.80 L14.49 5.99 L19.92 4.08 L18.01 9.51 L23.20 12.00 L18.01 14.49 L19.92 19.92 L14.49 18.01 L12.00 23.20 L9.51 18.01 L4.08 19.92 L5.99 14.49 L0.80 12.00 L5.99 9.51 L4.08 4.08 L9.51 5.99 Z M9.40 8.10 L16.40 12.00 L9.40 15.90 Z";
const RIB = "نجم العراق · IRAQISTAR · ".repeat(60);
const PATHS = ["M-200,200 C400,-100 900,700 1500,300 S2300,500 2400,100","M-200,900 C300,300 1000,1200 1400,500 S2200,900 2400,700","M-300,500 C500,1300 1100,-200 1700,800 S2200,300 2500,600","M-200,-50 C600,900 1200,100 1600,1100 S2100,700 2400,1000"];
const ribbons = id => `<svg class="rib" id="${id}" style="direction:ltr" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><defs>${PATHS.map((d,i)=>`<path id="${id}p${i}" d="${d}"/>`).join("")}</defs>${PATHS.map((_,i)=>`<text class="rt" font-size="${36+i*4}"><textPath href="#${id}p${i}" id="${id}t${i}" startOffset="0">${RIB}</textPath></text>`).join("")}</svg>`;
const mark = cls => `<span class="${cls}"><svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="${MARK}"/></svg></span>`;
const words = s => s.split(" ").map(w => `<span>${w}</span>`).join(" ");
const AV = `<svg viewBox="0 0 100 100"><circle cx="50" cy="38" r="18"/><path d="M14 96c2-24 16-36 36-36s34 12 36 36Z"/></svg>`;
const STARS = [["فنان","#6430f0","#ff7a9c"],["لاعب كرة","#1d1640","#5cc8ff"],["مقدّمة برامج","#5427d9","#ffa04d"],["شيف","#ff7a9c","#ffd23f"],["مدرّب","#0c0b16","#6430f0"],["مؤثّر","#5cc8ff","#6430f0"],["شاعر","#52d28f","#1d1640"],["ممثلة","#a58bff","#ff7a9c"],["كوميديان","#ffa04d","#6430f0"]];
const starCard = ([role,c1,c2],i) => `<div class="sc"><div class="ph" style="background:linear-gradient(160deg,${c1},${c2})">${AV}<span class="vb">${mark("m")}موثّق</span></div><div class="nm">نجمك</div><div class="rl">${role}</div><div class="bt">اطلب فيديو</div></div>`;
const REQ = [["سارة، عيد ميلاد سعيد. أخوك عمر قال لي هذا يومك… خلّيه أحلى يوم بالسنة.","عيد ميلاد",true],["مبروك التخرّج يا علي. تعبك بان، والجاي أحلى.","تخرّج",false],["مقلب بصديقك؟ أنا وياك. شنو اسمه؟","مقلب ومزاح",false],["أبو أحمد، كل عام وإنت بخير. عيدكم مبارك.","عيد",true],["نور، سبع سنين… وهسه صرتي أذكى بنت بالصف.","نجاح",false]];
const card = ([text,occ,img]) => `<div class="card"><div class="ch">${mark("av")}<b>نجمك</b><span class="hd">${occ}</span></div><p>${text}</p>${img?`<div class="thumb"><svg viewBox="0 0 24 24"><path d="M10 8.5v7l5.5-3.5Z"/></svg></div>`:""}<div class="ic"><i>♡</i><i>↻</i><i>➤</i></div></div>`;
const OCC = ["عيد ميلاد","تخرّج","زواج وخطوبة","عيد ورمضان","مقلب ومزاح","رومانسية","كرة القدم","رسالة غنائية","تحفيز","تهنئة أعمال","مولود جديد","اعتذار"];
const CATS = ["فنانين","رياضيين","مشاهير","خبراء","معلّمين","صنّاع محتوى"];
// scenes [id, startBeat, endBeat, bg]
const SC = [["s1",0,5,"dark"],["s2",5,11,"dark"],["s3",11,15,"white"],["s4",15,18,"white"],["s5",18,24,"white"],["s6",24,32,"dark"],["s7",32,38,"white"],["s8",38,44,"white"],["s9",44,50,"dark"],["s10",50,57,"dark"],["s11",57,65,"dark"]];

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
.glow{position:absolute;left:50%;top:50%;width:1600px;height:1600px;border-radius:50%;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(100,48,240,.35) 0%,rgba(100,48,240,0) 60%);opacity:0}
.scene{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:0}
.rib{position:absolute;inset:0;width:100%;height:100%}
.rt{fill:none;stroke:rgba(255,255,255,.85);stroke-width:1.1;font-family:"IBM Plex Sans Arabic";font-weight:700;letter-spacing:.04em}
.hero{position:relative;text-align:center;background:#08080f;padding:26px 70px 34px;border-radius:40px;box-shadow:0 0 0 2px #08080f,0 0 90px 60px rgba(8,8,15,.96)}
.hero .ar{font-size:150px;font-weight:700;line-height:1.1;color:#fff}
.hero .en{font-family:Geist;font-weight:700;font-size:40px;letter-spacing:.14em;color:#a58bff;direction:ltr;margin-top:6px}
/* tagline reveal */
.tagwrap{position:relative;text-align:center}
.tag{font-size:150px;font-weight:700;line-height:1.25;color:#fff;white-space:nowrap;text-shadow:0 0 40px rgba(165,139,255,.35);-webkit-mask-image:linear-gradient(to left,#000 0%,#000 0%,transparent 0%);mask-image:linear-gradient(to left,#000 0%,#000 0%,transparent 0%)}
.tag .v{color:#a58bff}
.bar{position:absolute;top:-10%;height:120%;width:14px;background:linear-gradient(to bottom,rgba(165,139,255,0),#fff 40%,#a58bff 60%,rgba(165,139,255,0));border-radius:8px;box-shadow:0 0 60px 18px rgba(100,48,240,.9),0 0 120px 50px rgba(100,48,240,.45);opacity:0}
.slam{position:absolute;left:0;right:0;text-align:center;font-size:230px;font-weight:700;color:#a58bff;opacity:0;white-space:nowrap;text-shadow:0 0 60px rgba(100,48,240,.8)}
.sub{position:absolute;left:0;right:0;text-align:center;font-size:48px;font-weight:600;color:rgba(247,247,251,.85);opacity:0}
.cta{display:inline-flex;align-items:center;gap:16px;background:#6430f0;color:#fff;border-radius:999px;padding:18px 44px;font-size:44px;font-weight:700;box-shadow:0 0 70px rgba(100,48,240,.7)}
.cta .m{width:44px;height:44px;display:grid;place-items:center}.cta .m svg{width:40px;height:40px;fill:#fff}
.type{font-size:60px;font-weight:600;color:#0c0b16;text-align:center;padding:0 120px;line-height:1.5}
.type span{opacity:0;display:inline-block}
.handle{position:relative;display:inline-flex;align-items:center;gap:18px;background:#fff;border:1.5px solid #e2e0ec;border-radius:999px;padding:14px 34px 14px 16px;color:#0c0b16;font-family:Geist;font-weight:600;font-size:40px;direction:ltr;box-shadow:0 12px 44px rgba(12,11,22,.14)}
.handle .av{width:64px;height:64px;border-radius:50%;background:#6430f0;display:grid;place-items:center}
.handle .av svg{width:38px;height:38px;fill:#fff}
.handle .ar{font-family:"IBM Plex Sans Arabic";font-weight:700;font-size:36px;color:#6430f0;margin-left:14px;padding-left:18px;border-left:2px solid #e2e0ec}
.kin{position:absolute;inset:0}
.kin div{position:absolute;left:0;right:0;top:50%;text-align:center;font-size:230px;line-height:1;font-weight:700;color:#0c0b16;letter-spacing:-.02em;opacity:0;white-space:nowrap}
.kin div.v{color:#6430f0}
/* star carousel */
.sh{position:absolute;left:0;right:0;top:90px;text-align:center;font-size:58px;font-weight:700;color:#fff;opacity:0}
.strip{position:absolute;top:215px;left:0;display:flex;gap:40px;direction:ltr;will-change:transform}
.sc{width:400px;background:#13121e;border:1.5px solid rgba(165,139,255,.35);border-radius:28px;padding:16px;text-align:center;direction:rtl;box-shadow:0 30px 80px rgba(0,0,0,.6);opacity:0;flex:none}
.sc .ph{position:relative;height:400px;border-radius:20px;overflow:hidden}
.sc .ph svg{position:absolute;inset:0;width:100%;height:100%;fill:rgba(255,255,255,.28)}
.sc .vb{position:absolute;top:12px;left:12px;display:inline-flex;align-items:center;gap:6px;background:rgba(8,8,15,.7);color:#fff;border-radius:999px;padding:6px 14px 6px 10px;font-size:20px;font-weight:600}
.sc .vb .m{width:22px;height:22px;display:grid;place-items:center}.sc .vb .m svg{position:static;width:22px;height:22px;fill:#a58bff}
.sc .nm{margin-top:18px;font-size:36px;font-weight:700;color:#fff}
.sc .rl{font-size:27px;color:rgba(247,247,251,.7);margin-top:4px}
.sc .bt{margin-top:16px;background:#6430f0;color:#fff;border-radius:999px;padding:14px 0;font-size:29px;font-weight:700}
/* phone */
.phone{position:absolute;left:50%;top:50%;width:400px;height:820px;transform:translate(-50%,-50%);background:#0c0b16;border-radius:60px;padding:16px;box-shadow:0 50px 120px rgba(12,11,22,.35),0 0 0 3px #2a2940;opacity:0}
.phone .scr{position:relative;width:100%;height:100%;border-radius:46px;overflow:hidden;background:linear-gradient(170deg,#6430f0,#a58bff 60%,#ff7a9c)}
.phone .scr .av2{position:absolute;inset:0;width:100%;height:100%;fill:rgba(255,255,255,.3)}
.phone .top{position:absolute;top:22px;left:0;right:0;display:flex;align-items:center;justify-content:center;gap:10px;font-size:22px;font-weight:600;color:#fff}
.phone .top .av{width:34px;height:34px;border-radius:50%;background:#fff;display:grid;place-items:center}.phone .top .av svg{width:22px;height:22px;fill:#6430f0}
.phone .cap{position:absolute;bottom:110px;left:24px;right:24px;background:rgba(8,8,15,.55);border-radius:18px;padding:14px 18px;color:#fff;font-size:24px;font-weight:600;text-align:right}
.phone .cap small{display:block;font-size:18px;opacity:.8;font-weight:400;margin-top:4px}
.phone .prog{position:absolute;bottom:60px;left:24px;right:24px;height:8px;background:rgba(255,255,255,.35);border-radius:4px}
.phone .prog i{display:block;height:100%;width:0;background:#fff;border-radius:4px}
.phone .play{position:absolute;left:50%;top:50%;width:110px;height:110px;border-radius:50%;background:rgba(255,255,255,.9);transform:translate(-50%,-50%);display:grid;place-items:center}
.phone .play svg{width:56px;height:56px;fill:#6430f0;margin-left:6px}
.heart{position:absolute;font-size:44px;color:#ff7a9c;opacity:0;font-style:normal}
.side{position:absolute;top:50%;width:520px;transform:translateY(-50%);text-align:center;font-size:54px;font-weight:700;color:#0c0b16;line-height:1.5;opacity:0}
.side .v{color:#6430f0}
.omar{position:absolute;bottom:60px;left:0;display:flex;gap:18px;direction:ltr;will-change:transform}
.omar span{flex:none;background:#fff;border:2px solid #e2e0ec;border-radius:999px;padding:12px 34px;font-size:32px;font-weight:700;color:#0c0b16;box-shadow:0 10px 40px rgba(12,11,22,.1);direction:rtl}
.omar span.v{background:#6430f0;color:#fff;border-color:#6430f0}
/* cards carousel */
.cstrip{position:absolute;top:130px;left:0;display:flex;gap:40px;direction:ltr;align-items:flex-start}
.card{width:540px;flex:none;background:#fff;border:1px solid #e2e0ec;border-radius:24px;padding:24px 26px;color:#0c0b16;box-shadow:0 24px 70px rgba(12,11,22,.16);text-align:right;direction:rtl;opacity:0}
.card .ch{display:flex;align-items:center;gap:12px;font-size:21px}
.card .av{width:42px;height:42px;border-radius:50%;background:#6430f0;display:grid;place-items:center}.card .av svg{width:26px;height:26px;fill:#fff}
.card .hd{margin-inline-start:auto;background:#eae8f3;border-radius:999px;padding:4px 14px;font-size:17px;color:#4f5368}
.card p{margin-top:14px;font-size:23px;line-height:1.6}
.card .thumb{margin-top:14px;height:190px;border-radius:14px;background:linear-gradient(135deg,#6430f0,#a58bff);display:grid;place-items:center}.card .thumb svg{width:66px;height:66px;fill:#fff}
.card .ic{margin-top:14px;display:flex;gap:22px;font-style:normal;font-size:24px;color:#4f5368;direction:ltr}
.like{position:absolute;left:0;right:0;bottom:90px;text-align:center;font-size:60px;font-weight:700;color:#0c0b16;opacity:0}
.like .row{display:inline-flex;gap:46px;direction:ltr;margin-right:40px;vertical-align:middle}
.like .row i{font-style:normal;font-size:74px;opacity:0;color:#0c0b16;display:inline-block}
.like .row i.on{color:#6430f0}
.cats{position:absolute;inset:0}
.cats .h{position:absolute;left:0;right:0;top:150px;text-align:center;font-size:58px;font-weight:700;color:#fff;opacity:0}
.cats div.w{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;font-size:210px;line-height:1;font-weight:700;color:#a58bff;opacity:0;white-space:nowrap}
.end{position:relative;text-align:center;background:#08080f;padding:30px 80px 36px;border-radius:44px;box-shadow:0 0 0 2px #08080f,0 0 100px 70px rgba(8,8,15,.96)}
.end .ar{font-size:140px;font-weight:700;line-height:1.1;color:#fff}
.end .row{display:flex;justify-content:center;gap:18px;margin-top:18px;direction:ltr}
.give{position:absolute;left:0;right:0;bottom:60px;text-align:center;font-size:30px;color:rgba(255,255,255,.8);opacity:0}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 60%,rgba(0,0,0,.35) 100%);opacity:0}
.flash{position:absolute;inset:0;background:#fff;opacity:0}.flashd{position:absolute;inset:0;background:#6430f0;opacity:0}
.grain{position:absolute;inset:-20px;opacity:.07;mix-blend-mode:overlay;pointer-events:none}
</style></head><body><div id="cam"><div class="bg" id="bg"></div><div class="glow" id="glow"></div>
<div class="scene" id="s1">${ribbons("r1")}<div class="hero" id="hero"><div class="ar">نجم العراق</div><div class="en">IRAQISTAR</div></div></div>
<div class="scene" id="s2"><div class="tagwrap"><div class="tag" id="tg1">من نجوم العراق…</div><div class="bar" id="bar1"></div></div><div class="slam" id="slam1">إليك</div></div>
<div class="scene" id="s3"><div class="type" id="t3">${words("اطلب فيديو من نجمك، استلمه، وشاركه مع اللي تحب.")}</div></div>
<div class="scene" id="s4"><div class="handle" id="h4">${mark("av")}@iraqistar.iq<span class="ar">نجم العراق</span></div></div>
<div class="scene" id="s5"><div class="kin" id="kin"><div>فيديو</div><div class="v">باسمك</div><div>من نجمك</div></div></div>
<div class="scene" id="s6"><div class="sh" id="sh6">اختار نجمك</div><div class="strip" id="strip">${STARS.map(starCard).join("")}</div></div>
<div class="scene" id="s7"><div class="side" id="sd1" style="right:120px">فيديو <span class="v">يوصلك</span><br>على موبايلك</div><div class="side" id="sd2" style="left:120px">وتشاركه <span class="v">بلحظة</span><br>مع اللي تحب</div>
  <div class="phone" id="ph"><div class="scr"><svg class="av2" viewBox="0 0 100 100" preserveAspectRatio="xMidYMax slice"><circle cx="50" cy="40" r="17"/><path d="M12 100c2-26 17-38 38-38s36 12 38 38Z"/></svg><div class="top">${mark("av")}نجمك · فيديو شخصي</div><div class="play" id="play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7Z"/></svg></div><div class="cap">عيد ميلاد سارة<small>من نجمك · 0:42</small></div><div class="prog"><i id="prog"></i></div></div></div>
  ${[0,1,2,3,4,5].map(i=>`<i class="heart" id="hb${i}" style="left:${1170+ (i%3)*40}px;top:${520}px">♥</i>`).join("")}
  <div class="omar" id="omar">${OCC.concat(OCC).map((w,i)=>`<span class="${i%4===1?'v':''}">${w}</span>`).join("")}</div></div>
<div class="scene" id="s8"><div class="cstrip" id="cstrip">${REQ.map(card).join("")}</div><div class="like" id="lk"><span id="lt"></span><span class="row"><i id="i1">♥</i><i id="i2">↻</i><i id="i3">➤</i></span></div></div>
<div class="scene" id="s9"><div class="cats" id="cats"><div class="h">نجوم بكل المجالات</div>${CATS.map(w=>`<div class="w">${w}</div>`).join("")}</div></div>
<div class="scene" id="s10"><div class="tagwrap" style="margin-top:-120px"><div class="tag" id="tg2">إنت <span class="v">نجم</span> بحياة شخص.</div><div class="bar" id="bar2"></div></div><div class="sub" id="sub2" style="top:640px">معلّم، مدرّب، طبيب، فنان، صانع محتوى… إذا أكو شخص يعتبرك نجمه</div><div class="sub" id="cta2" style="top:740px"><span class="cta">${mark("m")}انضم كنجم على نجم العراق</span></div></div>
<div class="scene" id="s11">${ribbons("r11")}<div class="end" id="end"><div class="ar">نجم العراق</div><div class="row"><div class="handle" style="font-size:36px;padding:10px 28px 10px 12px">${mark("av")}@iraqistar.iq</div><div class="handle" style="font-size:36px;padding:10px 28px">iraqistar.com</div></div></div><div class="give" id="gv">مع كل طلب، جزء من أرباحنا يروح للأعمال الخيرية بالعراق</div></div>
<div class="vig" id="vig"></div><div class="flash" id="flash"></div><div class="flashd" id="flashd"></div>
<svg class="grain" width="100%" height="100%"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="1" id="turb"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>
</div><script>
const B=${B}, SC=${JSON.stringify(SC)}, DUR=${DUR};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)), eo=x=>1-Math.pow(1-x,3), ei=x=>x*x*x, eio=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2, back=x=>{const c=1.7;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)}, seg=(t,s,d)=>clamp((t-s)/d,0,1), hit=(t,a,l)=>t>=a?Math.exp(-(t-a)/l):0, $=id=>document.getElementById(id), bt=k=>k*B;
function typeWords(el,t,s,step){el.querySelectorAll('span').forEach((w,i)=>{const k=eo(seg(t,s+i*step,0.12));w.style.opacity=k;w.style.transform=\`translateY(\${((1-k)*14).toFixed(1)}px)\`;});}
function ribbon(id,t,speed){for(let i=0;i<4;i++){$(id+'t'+i).setAttribute('startOffset',(-((t*speed*(1+i*0.25))%1200)-100)+'px');}}
// mask sweep reveal, right→left (RTL reading). p in 0..1
function reveal(tagId,barId,p){const el=$(tagId); const x=(p*116-8); const m=\`linear-gradient(to left,#000 \${x-6}%,#000 \${x}%,transparent \${x+6}%)\`; el.style.webkitMaskImage=m; el.style.maskImage=m;
  const bar=$(barId); const w=el.getBoundingClientRect().width; bar.style.right=(x/100*w)+'px'; bar.style.opacity=(p>0&&p<1?1:0);}
window.renderAt=t=>{
  $('turb').setAttribute('seed',String(Math.floor(t*30)%40));
  let bg='dark', kick=0, fl=0, fld=0;
  SC.forEach(([id,s,e,mode])=>{const on=t>=bt(s)&&t<bt(e); $(id).style.opacity=on?1:0; if(on)bg=mode; if(s>0){kick+=hit(t,bt(s),0.12)*0.035; if(mode==='dark')fld+=hit(t,bt(s),0.06)*0.4; else fl+=hit(t,bt(s),0.08)*0.5;}});
  $('bg').className='bg'+(bg==='white'?' white':''); $('vig').style.opacity=bg==='dark'?1:0; $('glow').style.opacity=bg==='dark'?(0.6+0.4*Math.sin(t*4)).toFixed(3):0;
  // S1
  ribbon('r1',t,300); const h1=back(seg(t,0.3,0.55)); $('hero').style.opacity=clamp(h1*3,0,1); $('hero').style.transform=\`scale(\${(0.6+0.4*h1).toFixed(3)})\`;
  // S2 tagline 1: sweep over 2.2 beats, then إليك slams on beat 8.5
  reveal('tg1','bar1',eio(seg(t,bt(5)+0.1,2.2*B)));
  const sl=back(seg(t,bt(8.5),0.35)); const s1=$('slam1'); s1.style.opacity=clamp(sl*3,0,1); s1.style.transform=\`translateY(\${(120+(1-sl)*80).toFixed(0)}px) scale(\${(0.5+0.5*sl).toFixed(3)})\`; s1.style.filter=\`blur(\${((1-sl)*12).toFixed(1)}px)\`;
  $('tg1').style.transform=\`translateY(\${(t>=bt(8.5)?-110*eo(seg(t,bt(8.5),0.35)):0).toFixed(0)}px)\`; kick+=hit(t,bt(8.5),0.12)*0.04; fld+=hit(t,bt(8.5),0.08)*0.5;
  // S3 typing
  typeWords($('t3'),t,bt(11)+0.1,0.19);
  // S4 handle
  const h4=back(seg(t,bt(15)+0.05,0.5)); $('h4').style.transform=\`scale(\${(0.5+0.5*h4).toFixed(3)})\`; $('h4').style.opacity=clamp(h4*3,0,1);
  // S5 kinetic
  [...$('kin').children].forEach((d,i)=>{const s=bt(18+i*1.5); const k=eo(seg(t,s,0.22)); const later=Math.max(0,Math.floor((t-s)/(1.5*B))); d.style.opacity=(k*(1-later*0.35)).toFixed(3); const y=(i-1)*250-115; d.style.transform=\`translateY(\${(y-(1-k)*120).toFixed(0)}px) scale(\${(1.5-0.5*k).toFixed(3)})\`; d.style.filter=\`blur(\${((1-k)*14).toFixed(1)}px)\`;});
  // S6 star carousel: cards pop in staggered, strip slides
  $('sh6').style.opacity=eo(seg(t,bt(24),0.3));
  const st=$('strip'); const sx=1920-440*3+40 - (t-bt(24))*470; st.style.transform=\`translateX(\${sx.toFixed(0)}px)\`;
  [...st.children].forEach((c,i)=>{const k=back(seg(t,bt(24)+0.15+i*0.16,0.4)); c.style.opacity=clamp(k*3,0,1); c.style.transform=\`translateY(\${((1-k)*140).toFixed(0)}px) scale(\${(0.8+0.2*k).toFixed(3)})\`;});
  // S7 phone
  const pk=back(seg(t,bt(32)+0.05,0.5)); const ph=$('ph'); ph.style.opacity=clamp(pk*3,0,1); ph.style.transform=\`translate(-50%,-50%) scale(\${(0.7+0.3*pk).toFixed(3)}) rotate(\${((1-pk)*-8).toFixed(1)}deg)\`;
  const pp=seg(t,bt(33),bt(38)-bt(33)); $('prog').style.width=(pp*100).toFixed(1)+'%'; $('play').style.opacity=(1-eo(seg(t,bt(33),0.3))).toFixed(2); $('play').style.transform=\`translate(-50%,-50%) scale(\${(1+eo(seg(t,bt(33),0.3))*0.6).toFixed(2)})\`;
  [0,1,2,3,4,5].forEach(i=>{const s=bt(33.5)+i*0.35; const k=seg(t,s,1.4); const el=$('hb'+i); el.style.opacity=(k>0&&k<1?Math.sin(k*Math.PI):0).toFixed(2); el.style.transform=\`translate(\${(Math.sin(k*9+i)*30).toFixed(0)}px,\${(-k*380).toFixed(0)}px) scale(\${(0.6+k*0.8).toFixed(2)})\`;});
  const sd1=eo(seg(t,bt(33),0.4)), sd2=eo(seg(t,bt(35),0.4)); $('sd1').style.opacity=sd1; $('sd1').style.transform=\`translateY(-50%) translateX(\${((1-sd1)*60).toFixed(0)}px)\`; $('sd2').style.opacity=sd2; $('sd2').style.transform=\`translateY(-50%) translateX(\${((1-sd2)*-60).toFixed(0)}px)\`;
  const om=$('omar'); om.style.transform=\`translateX(\${(-(t-bt(32))*220).toFixed(0)}px)\`; om.style.opacity=eo(seg(t,bt(32.5),0.4));
  // S8 cards carousel + like
  const cs=$('cstrip'); const cx=1920-580-(t-bt(38))*300; cs.style.transform=\`translateX(\${cx.toFixed(0)}px)\`;
  [...cs.children].forEach((c,i)=>{const k=back(seg(t,bt(38)+0.1+i*0.22,0.4)); c.style.opacity=clamp(k*3,0,1); c.style.transform=\`translateY(\${((1-k)*120).toFixed(0)}px) rotate(\${((i%2?1:-1)*1.5).toFixed(1)}deg)\`;});
  const k8=eo(seg(t,bt(40.5),0.3)); $('lk').style.opacity=k8; $('lt').textContent=t<bt(42)?'اطلب، شارك،':'اطلب، شارك، وفرّح.';
  ['i1','i2','i3'].forEach((id,i)=>{const s=bt(41+i*0.5); const k=back(seg(t,s,0.3)); const el=$(id); el.style.opacity=clamp(k*3,0,1); el.style.transform=\`scale(\${(0.3+0.7*k).toFixed(3)})\`; el.classList.toggle('on',t>=s+0.25);});
  // S9 categories
  const ct=$('cats'); ct.querySelector('.h').style.opacity=eo(seg(t,bt(44),0.3));
  [...ct.querySelectorAll('.w')].forEach((d,i)=>{const s=bt(44.5+i*0.9), e=s+0.9*B; const on=t>=s&&t<e; const k=eo(seg(t,s,0.14)); d.style.opacity=on?1:0; d.style.transform=\`translateY(-50%) scale(\${(1.3-0.3*k).toFixed(3)})\`; d.style.filter=\`blur(\${((1-k)*10).toFixed(1)}px)\`; if(on)kick+=hit(t,s,0.08)*0.02;});
  // S10 tagline 2 reveal + sub + cta
  reveal('tg2','bar2',eio(seg(t,bt(50)+0.1,2.4*B)));
  const su=eo(seg(t,bt(53),0.4)); $('sub2').style.opacity=su; $('sub2').style.transform=\`translateY(\${((1-su)*30).toFixed(0)}px)\`;
  const cb=back(seg(t,bt(54.5),0.4)); $('cta2').style.opacity=clamp(cb*3,0,1); $('cta2').style.transform=\`scale(\${(0.6+0.4*cb).toFixed(3)})\`; kick+=hit(t,bt(54.5),0.1)*0.03;
  // S11 end
  ribbon('r11',t,260); const k11=back(seg(t,bt(57)+0.05,0.55)); $('end').style.opacity=clamp(k11*3,0,1); $('end').style.transform=\`scale(\${(0.6+0.4*k11).toFixed(3)})\`; $('gv').style.opacity=eo(seg(t,bt(59.5),0.5));
  const r=seg(t,bt(54.5),bt(57)-bt(54.5)); const shake=r>0&&r<1?Math.sin(t*95)*2.5*r:0;
  $('cam').style.transform=\`scale(\${(1+0.02*(t/DUR)+kick+0.05*ei(r)).toFixed(4)}) translate(\${shake.toFixed(1)}px,0)\`;
  $('flash').style.opacity=clamp(fl+(t>=bt(57)?hit(t,bt(57),0.14)*0.9:0),0,1).toFixed(3); $('flashd').style.opacity=clamp(fld,0,1).toFixed(3);
  document.body.style.opacity=(1-eo(seg(t,DUR-0.5,0.5))).toFixed(3);
};
</script></body></html>`;
fs.writeFileSync("intro3.html", html);
const dir = "frames3"; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir);
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }); const p = await b.newPage({ viewport: { width: W, height: H } });
p.on("pageerror", e => console.log("PAGEERR", e.message));
await p.goto("file://" + process.cwd() + "/intro3.html"); await p.evaluate(() => document.fonts.ready);
const only = process.argv[2] ? process.argv[2].split(",").map(Number) : null;
for (let f = 0; f < Math.round(DUR * FPS); f++) { if (only && !only.includes(f)) continue; await p.evaluate(t => window.renderAt(t), f / FPS); await p.screenshot({ path: `${dir}/${String(f).padStart(4, "0")}.jpg`, type: "jpeg", quality: 90 }); }
await b.close();
if (!only) execSync(`ffmpeg -v error -y -framerate ${FPS} -i ${dir}/%04d.jpg -c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium -movflags +faststart intro3-silent.mp4`);
console.log("done", DUR);
