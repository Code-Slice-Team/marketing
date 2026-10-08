// نجم العراق — IraqiStar Business Reel (9:16): brands find Iraqi stars / UGC creators. 65 beats @128 BPM (music3). 1080x1920.
import { chromium } from "playwright"; import fs from "node:fs"; import { execSync } from "node:child_process";
const FPS = 30, W = 1080, H = 1920, B = 60 / 128, BEATS = 65; const DUR = Math.round(BEATS * B * FPS) / FPS;
const MARK = "M12.00 0.80 L14.49 5.99 L19.92 4.08 L18.01 9.51 L23.20 12.00 L18.01 14.49 L19.92 19.92 L14.49 18.01 L12.00 23.20 L9.51 18.01 L4.08 19.92 L5.99 14.49 L0.80 12.00 L5.99 9.51 L4.08 4.08 L9.51 5.99 Z M9.40 8.10 L16.40 12.00 L9.40 15.90 Z";
const mark = cls => `<span class="${cls}"><svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="${MARK}"/></svg></span>`;
const RIB = "IRAQISTAR BUSINESS · نجم العراق للأعمال · ".repeat(50);
const PATHS = ["M-200,300 C300,0 700,900 1300,400","M-200,1300 C300,700 800,1700 1300,1000","M-300,800 C300,1700 700,-100 1300,900","M-200,100 C400,1100 800,200 1300,1500"];
const ribbons = id => `<svg class="rib" id="${id}" style="direction:ltr" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><defs>${PATHS.map((d,i)=>`<path id="${id}p${i}" d="${d}"/>`).join("")}</defs>${PATHS.map((_,i)=>`<text class="rt" font-size="${34+i*4}"><textPath href="#${id}p${i}" id="${id}t${i}" startOffset="0">${RIB}</textPath></text>`).join("")}</svg>`;
const words = s => s.split(" ").map(w => `<span>${w}</span>`).join(" ");
const WALL = [0,1,2,3,4,5,6,7,8].map(i => `<div class="wc" id="wc${i}"><img src="shots/ui/ugc-${i}.png"></div>`).join("");
const STEPS = [["1","اكتب شتحتاج","اسم نشاطك، نوع الفيديو، وموعد التسليم… وحتى السكربت علينا: نكتبه من وصفك."],["2","استلم الأسعار واختار","اطلب من نجم، أو انشر طلبك وخلّي النجوم يرسلولك أسعارهم."],["3","استلم الفيديو وانشره","شوفه، نزّله، واستخدمه بقنواتك وإعلاناتك الممولة."]];
const WHY = ["فيديو حقيقي، بلا ذكاء اصطناعي","سعر واضح قبل التنفيذ","حتى السكربت علينا","فلوسك محجوزة لحد التسليم"];
// scenes [id, startBeat, endBeat, bg]
const SC = [["s1",0,5,"dark"],["s2",5,11,"dark"],["s3",11,17,"white"],["s4",17,22,"dark"],["sf",22,28,"white"],["s5",28,33,"white"],["s6",33,43,"white"],["s7",43,50,"dark"],["s8",50,58,"dark"],["s9",58,65,"dark"]];
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
.scene{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:0}
.rib{position:absolute;inset:0;width:100%;height:100%}
.rt{fill:none;stroke:rgba(255,255,255,.8);stroke-width:1.1;font-family:Geist,"IBM Plex Sans Arabic";font-weight:700;letter-spacing:.06em}
.wm{position:absolute;top:70px;left:0;right:0;text-align:center;font-family:Geist;font-weight:600;font-size:24px;letter-spacing:.42em;text-indent:.42em;color:rgba(247,247,251,.55);direction:ltr}
.hero{position:relative;text-align:center;background:#08080f;padding:30px 60px 40px;border-radius:40px;box-shadow:0 0 0 2px #08080f,0 0 90px 60px rgba(8,8,15,.96)}
.hero .mk svg{width:150px;height:150px;fill:#a58bff;filter:drop-shadow(0 0 40px rgba(100,48,240,.9))}
.hero .en{font-family:Geist;font-weight:700;font-size:112px;letter-spacing:-.02em;color:#fff;direction:ltr;line-height:1.05;margin-top:10px}
.hero .bz{display:inline-block;font-family:Geist;font-weight:700;font-size:40px;letter-spacing:.1em;color:#08080f;background:#fff;border-radius:999px;padding:10px 36px;margin-top:22px;direction:ltr}
.hero .ar{font-size:44px;font-weight:600;color:#c9bfff;margin-top:24px}.hero .slg,.end .slg{font-size:40px;font-weight:600;color:#a58bff;margin-top:14px}
.tagwrap{position:relative;text-align:center;padding:0 40px}
.tag{font-size:84px;font-weight:700;line-height:1.3;color:#fff;white-space:nowrap;text-shadow:0 0 40px rgba(165,139,255,.35);-webkit-mask-image:linear-gradient(to left,#000 0%,#000 0%,transparent 0%);mask-image:linear-gradient(to left,#000 0%,#000 0%,transparent 0%)}
.tag .v{color:#a58bff}
.bar{position:absolute;top:-10%;height:120%;width:14px;background:linear-gradient(to bottom,rgba(165,139,255,0),#fff 40%,#a58bff 60%,rgba(165,139,255,0));border-radius:8px;box-shadow:0 0 60px 18px rgba(100,48,240,.9),0 0 120px 50px rgba(100,48,240,.45);opacity:0}
.slam{position:absolute;left:0;right:0;text-align:center;font-size:200px;font-weight:700;color:#a58bff;opacity:0;white-space:nowrap;text-shadow:0 0 60px rgba(100,48,240,.8)}
.type{font-size:66px;font-weight:600;color:#0c0b16;text-align:center;padding:0 90px;line-height:1.55}
.type span{opacity:0;display:inline-block}
.type .v{color:#6430f0}
/* wall */
.wh{position:absolute;left:0;right:0;top:150px;text-align:center;font-size:62px;font-weight:700;color:#fff;opacity:0;padding:0 60px;line-height:1.3}
.wall{position:absolute;left:60px;right:60px;top:360px;display:grid;grid-template-columns:repeat(3,1fr);gap:28px}
.wc{border-radius:28px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.6),0 0 0 1.5px rgba(165,139,255,.35);opacity:0;aspect-ratio:332/462}
.wc img{width:100%;height:100%;object-fit:cover;display:block}
.wsub{position:absolute;left:0;right:0;bottom:120px;text-align:center;font-size:44px;font-weight:600;color:#c9bfff;opacity:0}
.fh{position:absolute;left:0;right:0;top:130px;text-align:center;font-size:66px;font-weight:700;color:#0c0b16;opacity:0;padding:0 40px}.fh .v{color:#6430f0}
.chips{position:absolute;left:60px;right:60px;top:290px;display:flex;flex-wrap:wrap;gap:18px;justify-content:center}
.chip{background:#fff;border:2.5px solid #6430f0;border-radius:999px;padding:12px 30px;display:flex;align-items:baseline;gap:12px;box-shadow:0 16px 50px rgba(100,48,240,.18);opacity:0;will-change:transform}
.chip small{font-size:28px;color:#4f5368;font-weight:600}.chip b{font-size:38px;color:#0c0b16}.chip.hi{background:#6430f0;border-color:#6430f0}.chip.hi small{color:#d9d0ff}.chip.hi b{color:#fff}
.inds{position:absolute;left:0;top:560px;display:flex;gap:16px;direction:ltr;will-change:transform;opacity:0}.inds span{flex:none;background:#f3f0ff;border:1.5px solid #ddd6ff;border-radius:999px;padding:10px 26px;font-size:30px;font-weight:600;color:#4b2fb3;direction:rtl}
.fsub{position:absolute;left:0;right:0;top:500px;text-align:center;font-size:34px;font-weight:600;color:#4f5368;opacity:0}
.phone.fp{top:auto;bottom:-430px;transform:translate(-50%,0);width:620px;height:1260px;opacity:0}
.res{position:absolute;left:90px;right:90px;bottom:110px;text-align:center;background:#6430f0;color:#fff;border-radius:999px;padding:18px 0;font-size:44px;font-weight:700;box-shadow:0 20px 60px rgba(100,48,240,.5);opacity:0}.res .n{font-family:Geist;direction:ltr;display:inline-block;min-width:1.2em}
/* phone */
.phone{position:absolute;left:50%;top:50%;width:560px;height:1150px;transform:translate(-50%,-50%);background:#0c0b16;border-radius:80px;padding:16px;box-shadow:0 60px 140px rgba(12,11,22,.4),0 0 0 3px #2a2940;opacity:0}
.phone .scr{position:relative;width:100%;height:100%;border-radius:64px;overflow:hidden;background:#fff}
.scr .pg{position:absolute;left:0;top:0;width:100%;display:block;will-change:transform}.scr .hd{position:absolute;left:0;top:0;width:100%;display:block}
.bd{display:inline-block;background:rgba(8,8,15,.9);color:#fff;border:1.5px solid rgba(165,139,255,.5);border-radius:.5em;padding:.12em .5em .2em;box-shadow:0 24px 70px rgba(0,0,0,.5);font-size:54px;font-weight:700;line-height:1.3}
.bd .v{color:#a58bff}
.cap{position:absolute;left:40px;right:40px;text-align:center;opacity:0}
/* steps */
.sh{position:absolute;left:0;right:0;top:140px;text-align:center;font-size:72px;font-weight:700;color:#0c0b16;opacity:0}
.steps{position:absolute;left:70px;right:70px;top:330px;display:flex;flex-direction:column;gap:34px}
.st{background:#fff;border:2px solid #e2e0ec;border-radius:36px;padding:34px 40px;display:flex;gap:30px;align-items:flex-start;box-shadow:0 30px 80px rgba(12,11,22,.12);opacity:0;will-change:transform}
.st .n{flex:none;width:92px;height:92px;border-radius:50%;background:#6430f0;color:#fff;font-family:Geist;font-weight:700;font-size:50px;display:grid;place-items:center;direction:ltr}
.st b{display:block;font-size:58px;color:#0c0b16;line-height:1.2}
.st span{display:block;font-size:36px;color:#4f5368;line-height:1.5;margin-top:10px}
.dep{position:absolute;left:70px;right:70px;bottom:260px;background:#f3f0ff;border:2px solid #ddd6ff;border-radius:30px;padding:30px 38px;font-size:40px;line-height:1.5;color:#0c0b16;opacity:0;text-align:right}
.dep b{color:#6430f0}
/* why */
.wy{position:absolute;inset:0}
.wy .h{position:absolute;left:0;right:0;top:170px;text-align:center;font-size:58px;font-weight:700;color:rgba(247,247,251,.7);opacity:0}
.wy .w{position:absolute;left:60px;right:60px;top:50%;transform:translateY(-50%);text-align:center;font-size:92px;line-height:1.25;font-weight:700;color:#fff;opacity:0}
.wy .w i{display:inline-grid;place-items:center;width:110px;height:110px;border-radius:50%;background:#6430f0;margin-bottom:30px;font-style:normal}
.wy .w i svg{width:60px;height:60px;fill:none;stroke:#fff;stroke-width:3.2;stroke-linecap:round;stroke-linejoin:round}
.sub{position:absolute;left:40px;right:40px;text-align:center;font-size:44px;font-weight:600;color:rgba(247,247,251,.85);opacity:0;line-height:1.5}
.cta{display:inline-flex;align-items:center;gap:16px;background:#6430f0;color:#fff;border-radius:999px;padding:22px 54px;font-size:52px;font-weight:700;box-shadow:0 0 70px rgba(100,48,240,.7)}
.cta .m{width:50px;height:50px;display:grid;place-items:center}.cta .m svg{width:46px;height:46px;fill:#fff}
.link{font-family:Geist;font-weight:600;font-size:40px;color:#a58bff;direction:ltr;margin-top:30px}
.end{position:relative;text-align:center;background:#08080f;padding:40px 70px 46px;border-radius:44px;box-shadow:0 0 0 2px #08080f,0 0 100px 70px rgba(8,8,15,.96)}
.end .mk svg{width:130px;height:130px;fill:#a58bff;filter:drop-shadow(0 0 40px rgba(100,48,240,.9))}
.end .ar{font-size:120px;font-weight:700;line-height:1.1;color:#fff;margin-top:14px}
.end .en{font-family:Geist;font-weight:700;font-size:40px;letter-spacing:.14em;color:#a58bff;direction:ltr;margin-top:8px}
.end .row{display:flex;justify-content:center;gap:16px;margin-top:34px;direction:ltr;flex-wrap:wrap}
.handle{display:inline-flex;align-items:center;gap:14px;background:#fff;border-radius:999px;padding:12px 30px;color:#0c0b16;font-family:Geist;font-weight:600;font-size:34px;direction:ltr}
.handle .av{width:48px;height:48px;border-radius:50%;background:#6430f0;display:grid;place-items:center}.handle .av svg{width:30px;height:30px;fill:#fff}
.give{position:absolute;left:0;right:0;bottom:90px;text-align:center;font-size:30px;color:rgba(255,255,255,.75);opacity:0}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 60%,rgba(0,0,0,.35) 100%);opacity:0}
.flash{position:absolute;inset:0;background:#fff;opacity:0}.flashd{position:absolute;inset:0;background:#6430f0;opacity:0}
.grain{position:absolute;inset:-20px;opacity:.07;mix-blend-mode:overlay;pointer-events:none}
</style></head><body><div id="cam"><div class="bg" id="bg"></div><div class="glow" id="glow"></div>
<div class="scene" id="s1">${ribbons("r1")}<div class="hero" id="hero">${mark("mk")}<div class="en">IraqiStar</div><div class="bz">BUSINESS</div><div class="ar">سوّق لنشاطك ويا نجوم العراق</div><div class="slg">من نجوم العراق… إليك</div></div></div>
<div class="scene" id="s2"><div class="tagwrap"><div class="tag" id="tg1">تدوّر على وجه <span class="v">لبراندك؟</span></div><div class="bar" id="bar1"></div></div><div class="slam" id="slam1">لگيته.</div></div>
<div class="scene" id="s3"><div class="type" id="t3">${words("نجوم، مؤثّرين وصنّاع محتوى عراقيين… بمكان واحد، بأسعار واضحة، وفيديو حقيقي بلا ذكاء اصطناعي.")}</div></div>
<div class="scene" id="s4"><div class="wh" id="wh">نجوم وصنّاع محتوى<br>من كل العراق</div><div class="wall" id="wall">${WALL}</div><div class="wsub" id="wsub">كل واحد بملفه: المدينة، الفئة، وعدد المتابعين</div></div>
<div class="scene" id="sf"><div class="fh" id="fh">لگي <span class="v">الأنسب لنشاطك</span> بثواني</div><div class="fsub" id="fsub">فلتر جديد حسب المجال: مطاعم، أزياء، تجميل، تكنولوجيا…</div>
  <div class="chips" id="chips">${[["المجال","أكل ومطاعم"],["الفئة","صنّاع محتوى"],["المدينة","بغداد"],["المتابعين","+100K"]].map(([k,v],i)=>`<div class="chip${i===0?" hi":""}" id="ch${i}"><small>${k}</small><b>${v}</b></div>`).join("")}</div>
  <div class="inds" id="inds">${["أزياء وموضة","مكياج وتجميل","أكل ومطاعم","سفر وسياحة","تكنولوجيا وموبايلات","رياضة ولياقة","سيارات","لايف ستايل","عائلة وأمومة","بيت وديكور","مراجعة منتجات","ألعاب إلكترونية","كوميديا ومقالب","تعليم ومعلومات"].concat(["أزياء وموضة","مكياج وتجميل","أكل ومطاعم","سفر وسياحة","تكنولوجيا وموبايلات"]).map(w=>`<span>${w}</span>`).join("")}</div>
  <div class="phone fp" id="phf"><div class="scr"><img class="pg" id="pgf" src="shots/stitched/browse-prod.jpg"><img class="hd" src="shots/stitched/header-light.jpg"></div></div>
  <div class="res" id="res"><span class="n" id="resn">13</span> نجم يناسبون طلبك</div></div>
<div class="scene" id="s5"><div class="phone" id="ph"><div class="scr"><img class="pg" id="pg5" src="shots/stitched/ugc-prod.jpg"><img class="hd" src="shots/stitched/header-light.jpg"></div></div>
  <div class="cap" id="c1" style="top:150px"><span class="bd">اطلب من <span class="v">نجم معيّن</span></span></div>
  <div class="cap" id="c2" style="top:1600px"><span class="bd">أو انشر طلبك… <span class="v">والنجوم يرسلولك أسعارهم</span></span></div></div>
<div class="scene" id="s6"><div class="sh" id="sh6">شلون تشتغل؟</div><div class="steps" id="steps">${STEPS.map(([n,b,s],i)=>`<div class="st" id="st${i}"><div class="n">${n}</div><div><b>${b}</b><span>${s}</span></div></div>`).join("")}</div>
  <div class="dep" id="dep"><b>والباقي علينا:</b> الدفع الآمن، متابعة النجم والمواعيد، التذكيرات، والفيديو يوصلك جاهز للنشر. وإذا ما وصل بالوقت، فلوسك ترجعلك.</div></div>
<div class="scene" id="s7"><div class="wy" id="wy"><div class="h">ليش IraqiStar Business؟</div>${WHY.map(w=>`<div class="w"><i><svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg></i><br>${w}</div>`).join("")}</div></div>
<div class="scene" id="s8"><div class="tagwrap" style="margin-top:-200px"><div class="tag" id="tg2" style="font-size:96px">سوّق لنشاطك<br>ويا <span class="v">نجوم العراق.</span></div><div class="bar" id="bar2"></div></div><div class="sub" id="sub2" style="top:1120px">اكتب شنو تحتاج، واستلم عروض وأسعار من النجوم. النشر مجاني.</div><div class="sub" id="cta2" style="top:1290px"><span class="cta">${mark("m")}انشر طلبك هسه</span><div class="link">iraqistar.com/ugc</div></div></div>
<div class="scene" id="s9">${ribbons("r9")}<div class="end" id="end">${mark("mk")}<div class="ar">نجم العراق</div><div class="en">IRAQISTAR BUSINESS</div><div class="slg">من نجوم العراق… إليك</div><div class="row"><div class="handle">${mark("av")}@iraqistar.iq</div><div class="handle">iraqistar.com/ugc</div></div></div><div class="give" id="gv">ومع كل طلب، مساهمة بحملات عطاء للخير</div></div>
<div class="vig" id="vig"></div><div class="flash" id="flash"></div><div class="flashd" id="flashd"></div>
<svg class="grain" width="100%" height="100%"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="1" id="turb"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>
</div><script>
const B=${B}, SC=${JSON.stringify(SC)}, DUR=${DUR};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)), eo=x=>1-Math.pow(1-x,3), ei=x=>x*x*x, eio=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2, back=x=>{const c=1.7;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)}, seg=(t,s,d)=>clamp((t-s)/d,0,1), hit=(t,a,l)=>t>=a?Math.exp(-(t-a)/l):0, $=id=>document.getElementById(id), bt=k=>k*B;
function typeWords(el,t,s,step){el.querySelectorAll('span').forEach((w,i)=>{const k=eo(seg(t,s+i*step,0.12));w.style.opacity=k;w.style.transform=\`translateY(\${((1-k)*14).toFixed(1)}px)\`;});}
function ribbon(id,t,speed){for(let i=0;i<4;i++){$(id+'t'+i).setAttribute('startOffset',(-((t*speed*(1+i*0.25))%1200)-100)+'px');}}
function reveal(tagId,barId,p){const el=$(tagId); const x=(p*116-8); const m=\`linear-gradient(to left,#000 \${x-6}%,#000 \${x}%,transparent \${x+6}%)\`; el.style.webkitMaskImage=m; el.style.maskImage=m;
  const bar=$(barId); const w=el.getBoundingClientRect().width; bar.style.right=(x/100*w)+'px'; bar.style.opacity=(p>0&&p<1?1:0);}
window.renderAt=t=>{
  $('turb').setAttribute('seed',String(Math.floor(t*30)%40));
  let bg='dark', kick=0, fl=0, fld=0;
  SC.forEach(([id,s,e,mode])=>{const on=t>=bt(s)&&t<bt(e); $(id).style.opacity=on?1:0; if(on)bg=mode; if(s>0){kick+=hit(t,bt(s),0.12)*0.035; if(mode==='dark')fld+=hit(t,bt(s),0.06)*0.4; else fl+=hit(t,bt(s),0.08)*0.5;}});
  $('bg').className='bg'+(bg==='white'?' white':''); $('vig').style.opacity=bg==='dark'?1:0; $('glow').style.opacity=bg==='dark'?(0.6+0.4*Math.sin(t*4)).toFixed(3):0;
  // S1
  ribbon('r1',t,260); const h1=back(seg(t,0.3,0.55)); $('hero').style.opacity=clamp(h1*3,0,1); $('hero').style.transform=\`scale(\${(0.6+0.4*h1).toFixed(3)})\`;
  // S2
  reveal('tg1','bar1',eio(seg(t,bt(5)+0.1,2.2*B)));
  const sl=back(seg(t,bt(8.5),0.35)); const s1=$('slam1'); s1.style.opacity=clamp(sl*3,0,1); s1.style.transform=\`translateY(\${(170+(1-sl)*80).toFixed(0)}px) scale(\${(0.5+0.5*sl).toFixed(3)})\`; s1.style.filter=\`blur(\${((1-sl)*12).toFixed(1)}px)\`;
  $('tg1').style.transform=\`translateY(\${(t>=bt(8.5)?-140*eo(seg(t,bt(8.5),0.35)):0).toFixed(0)}px)\`; kick+=hit(t,bt(8.5),0.12)*0.04; fld+=hit(t,bt(8.5),0.08)*0.5;
  // S3
  typeWords($('t3'),t,bt(11)+0.1,0.16);
  // S4 wall
  $('wh').style.opacity=eo(seg(t,bt(17),0.35));
  for(let i=0;i<9;i++){const k=back(seg(t,bt(17.4)+i*0.12,0.45)); const el=$('wc'+i); el.style.opacity=clamp(k*3,0,1); el.style.transform=\`translateY(\${((1-k)*120).toFixed(0)}px) scale(\${(0.8+0.2*Math.min(k,1.1)).toFixed(3)}) rotate(\${((1-Math.min(k,1))*(i%2?6:-6)).toFixed(1)}deg)\`;}
  $('wall').style.transform=\`translateY(\${(-(t-bt(17))*22).toFixed(0)}px)\`;
  $('wsub').style.opacity=eo(seg(t,bt(20),0.4));
  // SF filter
  $('fh').style.opacity=eo(seg(t,bt(22),0.35));
  const fp=back(seg(t,bt(22)+0.1,0.6)); $('phf').style.opacity=clamp(fp*3,0,1); $('phf').style.transform=\`translate(-50%,\${((1-fp)*200).toFixed(0)}px)\`; $('pgf').style.transform=\`translateY(\${(-eio(seg(t,bt(23),2.0))*520).toFixed(0)}px)\`;
  [0,1,2,3].forEach(i=>{const k=back(seg(t,bt(23)+i*0.75*B,0.4)); const el=$('ch'+i); el.style.opacity=clamp(k*3,0,1); el.style.transform=\`scale(\${(0.6+0.4*Math.min(k,1.1)).toFixed(3)}) translateY(\${((1-Math.min(k,1))*-30).toFixed(0)}px)\`; if(t>=bt(23)+i*0.75*B)kick+=hit(t,bt(23)+i*0.75*B,0.08)*0.02;});
  const fsb=eo(seg(t,bt(24.5),0.4)); $('fsub').style.opacity=fsb; const ind=$('inds'); ind.style.opacity=eo(seg(t,bt(24.8),0.4)); ind.style.transform=\`translateX(\${(-(t-bt(24.8))*260-200).toFixed(0)}px)\`;
  const rs=back(seg(t,bt(26.2),0.45)); $('res').style.opacity=clamp(rs*3,0,1); $('res').style.transform=\`scale(\${(0.7+0.3*Math.min(rs,1.1)).toFixed(3)})\`; $('resn').textContent=String(Math.round(13-9*eo(seg(t,bt(26.2),0.6))));
  // S5 phone scroll
  const pk=back(seg(t,bt(28)+0.05,0.55)); const ph=$('ph'); ph.style.opacity=clamp(pk*3,0,1); ph.style.transform=\`translate(-50%,-50%) scale(\${(0.7+0.3*pk).toFixed(3)}) rotate(\${((1-pk)*-8).toFixed(1)}deg)\`;
  const pp=eio(seg(t,bt(28.6),bt(33)-bt(28.6))); $('pg5').style.transform=\`translateY(\${(-pp*1850).toFixed(0)}px)\`;
  const c1=eo(seg(t,bt(28.6),0.4)); $('c1').style.opacity=c1; $('c1').style.transform=\`translateY(\${((1-c1)*30).toFixed(0)}px)\`;
  const c2=back(seg(t,bt(30.8),0.45)); $('c2').style.opacity=clamp(c2*3,0,1); $('c2').style.transform=\`translateY(\${((1-c2)*30).toFixed(0)}px) scale(\${(0.9+0.1*Math.min(c2,1)).toFixed(3)})\`;
  // S6 steps
  $('sh6').style.opacity=eo(seg(t,bt(33),0.3));
  [0,1,2].forEach(i=>{const k=back(seg(t,bt(33.5)+i*1.5*B,0.5)); const el=$('st'+i); el.style.opacity=clamp(k*3,0,1); el.style.transform=\`translateX(\${((1-k)*160).toFixed(0)}px) scale(\${(0.9+0.1*Math.min(k,1.08)).toFixed(3)})\`; if(t>=bt(33.5)+i*1.5*B)kick+=hit(t,bt(33.5)+i*1.5*B,0.1)*0.02;});
  const dp=back(seg(t,bt(38.8),0.5)); $('dep').style.opacity=clamp(dp*3,0,1); $('dep').style.transform=\`translateY(\${((1-dp)*60).toFixed(0)}px)\`;
  // S7 why
  const wy=$('wy'); wy.querySelector('.h').style.opacity=eo(seg(t,bt(43),0.3));
  [...wy.querySelectorAll('.w')].forEach((d,i)=>{const s=bt(43.4+i*1.6), e=s+1.6*B; const on=t>=s&&t<e; const k=eo(seg(t,s,0.16)); d.style.opacity=on?1:0; d.style.transform=\`translateY(-50%) scale(\${(1.25-0.25*k).toFixed(3)})\`; d.style.filter=\`blur(\${((1-k)*10).toFixed(1)}px)\`; if(on)kick+=hit(t,s,0.08)*0.025;});
  // S8
  reveal('tg2','bar2',eio(seg(t,bt(50)+0.1,2.2*B)));
  const su=eo(seg(t,bt(52.6),0.4)); $('sub2').style.opacity=su; $('sub2').style.transform=\`translateY(\${((1-su)*30).toFixed(0)}px)\`;
  const cb=back(seg(t,bt(54),0.4)); $('cta2').style.opacity=clamp(cb*3,0,1); $('cta2').style.transform=\`scale(\${(0.6+0.4*cb).toFixed(3)})\`; kick+=hit(t,bt(54),0.1)*0.03;
  // S9
  ribbon('r9',t,220); const k9=back(seg(t,bt(58)+0.05,0.55)); $('end').style.opacity=clamp(k9*3,0,1); $('end').style.transform=\`scale(\${(0.6+0.4*k9).toFixed(3)})\`; $('gv').style.opacity=eo(seg(t,bt(60.5),0.5));
  const r=seg(t,bt(56),bt(58)-bt(56)); const shake=r>0&&r<1?Math.sin(t*95)*2.5*r:0;
  $('cam').style.transform=\`scale(\${(1+0.02*(t/DUR)+kick+0.05*ei(r)).toFixed(4)}) translate(\${shake.toFixed(1)}px,0)\`;
  $('flash').style.opacity=clamp(fl+(t>=bt(58)?hit(t,bt(58),0.14)*0.9:0),0,1).toFixed(3); $('flashd').style.opacity=clamp(fld,0,1).toFixed(3);
  document.body.style.opacity=(1-eo(seg(t,DUR-0.5,0.5))).toFixed(3);
};
</script></body></html>`;
fs.writeFileSync("biz.html", html);
const dir = "frames"; if (!process.argv[2]) fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }); const p = await b.newPage({ viewport: { width: W, height: H } });
p.on("pageerror", e => console.log("PAGEERR", e.message));
await p.goto("file://" + process.cwd() + "/biz.html"); await p.evaluate(() => document.fonts.ready);
const only = process.argv[2] ? process.argv[2].split(",").map(Number) : null;
for (let f = 0; f < Math.round(DUR * FPS); f++) { if (only && !only.includes(f)) continue; await p.evaluate(t => window.renderAt(t), f / FPS); await p.screenshot({ path: `${dir}/${String(f).padStart(4, "0")}.jpg`, type: "jpeg", quality: 90 }); }
await b.close();
if (!only) execSync(`ffmpeg -v error -y -framerate ${FPS} -i ${dir}/%04d.jpg -c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium -movflags +faststart biz-silent.mp4`);
console.log("done", DUR);
