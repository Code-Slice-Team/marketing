// نجم العراق — social intro v2. Same choreography family as the reference, denser: 10 scenes, beat-locked cuts (128 BPM),
// camera kicks + flashes on every cut, grain. 1920x1080, 28.6 s, 30 fps.  node intro2.mjs [frames,...] → intro2-silent.mp4
import { chromium } from "playwright"; import fs from "node:fs"; import { execSync } from "node:child_process";
const FPS = 30, W = 1920, H = 1080, B = 60 / 128; const DUR = Math.round(61 * B * FPS) / FPS;
const T = k => +(k * B).toFixed(3);
const MARK = "M12.00 0.80 L14.49 5.99 L19.92 4.08 L18.01 9.51 L23.20 12.00 L18.01 14.49 L19.92 19.92 L14.49 18.01 L12.00 23.20 L9.51 18.01 L4.08 19.92 L5.99 14.49 L0.80 12.00 L5.99 9.51 L4.08 4.08 L9.51 5.99 Z M9.40 8.10 L16.40 12.00 L9.40 15.90 Z";
const RIB = "نجم العراق · IRAQISTAR · ".repeat(60);
const PATHS = [
  "M-200,200 C400,-100 900,700 1500,300 S2300,500 2400,100",
  "M-200,900 C300,300 1000,1200 1400,500 S2200,900 2400,700",
  "M-300,500 C500,1300 1100,-200 1700,800 S2200,300 2500,600",
  "M-200,-50 C600,900 1200,100 1600,1100 S2100,700 2400,1000",
];
const ribbons = (id) => `<svg class="rib" id="${id}" style="direction:ltr" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><defs>${PATHS.map((d,i)=>`<path id="${id}p${i}" d="${d}"/>`).join("")}</defs>
${PATHS.map((_,i)=>`<text class="rt" font-size="${36+i*4}"><textPath href="#${id}p${i}" id="${id}t${i}" startOffset="0">${RIB}</textPath></text>`).join("")}</svg>`;
const mark = cls => `<span class="${cls}"><svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="${MARK}"/></svg></span>`;
const card = (text, occ, img) => `<div class="card"><div class="ch">${mark("av")}<b>نجمك</b><span class="hd">${occ}</span></div><p>${text}</p>${img ? `<div class="thumb"><svg viewBox="0 0 24 24"><path d="M10 8.5v7l5.5-3.5Z"/></svg></div>` : ""}<div class="ic"><i>♡</i><i>↻</i><i>➤</i></div></div>`;
const words = (s) => s.split(" ").map(w => `<span>${w}</span>`).join(" ");

// scenes: [id, startBeat, endBeat, bg]
const SC = [["s1",0,5,"dark"],["s2",5,9,"white"],["s3",9,12,"white"],["s4",12,18,"white"],["s5",18,27,"dark"],["s6",27,33,"white"],["s7",33,41,"white"],["s8",41,47,"dark"],["s9",47,53,"white"],["s10",53,61,"dark"]];
const OCC = ["عيد ميلاد","تخرّج","زواج وخطوبة","عيد ورمضان","مقلب ومزاح","رومانسية","كرة القدم","رسالة غنائية","تحفيز","تهنئة أعمال","مولود جديد","اعتذار"];
const CATS = ["فنانين","رياضيين","مشاهير","خبراء","معلّمين","صنّاع محتوى"];

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
.hero .en b{color:#fff;font-weight:600;letter-spacing:.02em}
.type{font-size:60px;font-weight:600;color:#0c0b16;text-align:center;padding:0 120px;line-height:1.5}
.type span{opacity:0;display:inline-block}
.handle{position:relative;display:inline-flex;align-items:center;gap:18px;background:#fff;border:1.5px solid #e2e0ec;border-radius:999px;padding:14px 34px 14px 16px;color:#0c0b16;font-family:Geist;font-weight:600;font-size:40px;direction:ltr;box-shadow:0 12px 44px rgba(12,11,22,.14)}
.handle .av{width:64px;height:64px;border-radius:50%;background:#6430f0;display:grid;place-items:center}
.handle .av svg{width:38px;height:38px;fill:#fff}
.handle .ar{font-family:"IBM Plex Sans Arabic";font-weight:700;font-size:36px;color:#6430f0;margin-left:14px;padding-left:18px;border-left:2px solid #e2e0ec}
.kin{position:absolute;inset:0}
.kin div{position:absolute;left:0;right:0;top:50%;text-align:center;font-size:230px;line-height:1;font-weight:700;color:#0c0b16;letter-spacing:-.02em;opacity:0;white-space:nowrap}
.kin div.v{color:#6430f0}
.line{font-weight:700;font-size:62px;color:#fff;white-space:nowrap}
.line .hl{color:#a58bff}
.gstack{position:absolute;left:0;right:0;text-align:center;top:50%}
.gstack div{font-size:46px;font-weight:700;white-space:nowrap;line-height:1.12}
.occ{position:absolute;inset:0}
.occ .h{position:absolute;left:0;right:0;top:110px;text-align:center;font-size:54px;font-weight:700;color:#0c0b16;opacity:0}
.occ span{position:absolute;background:#fff;border:2px solid #e2e0ec;border-radius:999px;padding:16px 38px;font-size:40px;font-weight:700;color:#0c0b16;box-shadow:0 10px 40px rgba(12,11,22,.12);opacity:0;white-space:nowrap}
.occ span.v{background:#6430f0;color:#fff;border-color:#6430f0}
.cards{position:absolute;inset:0}
.card{position:absolute;width:540px;background:#fff;border:1px solid #e2e0ec;border-radius:24px;padding:24px 26px;color:#0c0b16;box-shadow:0 24px 70px rgba(12,11,22,.16);opacity:0;text-align:right}
.card .ch{display:flex;align-items:center;gap:12px;font-size:21px}
.card .av{width:42px;height:42px;border-radius:50%;background:#6430f0;display:grid;place-items:center}
.card .av svg{width:26px;height:26px;fill:#fff}
.card .hd{margin-inline-start:auto;background:#eae8f3;border-radius:999px;padding:4px 14px;font-size:17px;color:#4f5368}
.card p{margin-top:14px;font-size:23px;line-height:1.6}
.card .thumb{margin-top:14px;height:190px;border-radius:14px;background:linear-gradient(135deg,#6430f0,#a58bff);display:grid;place-items:center}
.card .thumb svg{width:66px;height:66px;fill:#fff}
.card .ic{margin-top:14px;display:flex;gap:22px;font-style:normal;font-size:24px;color:#4f5368;direction:ltr}
.like{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;font-size:66px;font-weight:700;color:#0c0b16;opacity:0}
.like .row{display:flex;justify-content:center;gap:56px;direction:ltr;margin-top:26px}
.like .row i{font-style:normal;font-size:84px;opacity:0;color:#0c0b16;display:inline-block}
.like .row i.on{color:#6430f0}
.cats{position:absolute;inset:0}
.cats .h{position:absolute;left:0;right:0;top:150px;text-align:center;font-size:58px;font-weight:700;color:#fff;opacity:0}
.cats div.w{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;font-size:210px;line-height:1;font-weight:700;color:#a58bff;opacity:0;white-space:nowrap}
.cloud{position:absolute;inset:0}
.cloud span{position:absolute;background:#fff;border:1px solid #e2e0ec;border-radius:999px;padding:10px 26px;font-size:27px;font-weight:600;color:#0c0b16;box-shadow:0 8px 30px rgba(12,11,22,.1);opacity:0;white-space:nowrap}
.center{font-size:70px;font-weight:700;color:#0c0b16;text-align:center;line-height:1.5}
.center .hl{color:#6430f0}
.end{position:relative;text-align:center;background:#08080f;padding:30px 80px 36px;border-radius:44px;box-shadow:0 0 0 2px #08080f,0 0 100px 70px rgba(8,8,15,.96)}
.end .ar{font-size:140px;font-weight:700;line-height:1.1;color:#fff}
.end .row{display:flex;justify-content:center;gap:18px;margin-top:18px;direction:ltr}
.end .give{position:absolute;left:0;right:0;bottom:60px;text-align:center;font-size:30px;color:rgba(255,255,255,.8);opacity:0}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 60%,rgba(0,0,0,.35) 100%);opacity:0}
.flash{position:absolute;inset:0;background:#fff;opacity:0}
.flashd{position:absolute;inset:0;background:#6430f0;opacity:0}
.grain{position:absolute;inset:-20px;opacity:.07;mix-blend-mode:overlay;pointer-events:none}
</style></head><body><div id="cam"><div class="bg" id="bg"></div><div class="glow" id="glow"></div>
<div class="scene" id="s1">${ribbons("r1")}<div class="hero" id="hero"><div class="ar">نجم العراق</div><div class="en">IRAQISTAR <b>· من نجوم العراق… إليك</b></div></div></div>
<div class="scene" id="s2"><div class="type" id="t2">${words("اطلب فيديو من نجمك، استلمه، وشاركه مع اللي تحب.")}</div></div>
<div class="scene" id="s3"><div class="handle" id="h3">${mark("av")}@iraqistar.iq<span class="ar">نجم العراق</span></div></div>
<div class="scene" id="s4"><div class="kin" id="kin"><div>فيديو</div><div class="v">باسمك</div><div>من نجمك</div></div></div>
<div class="scene" id="s5"><div class="line" id="l5">فيديو <span class="hl" id="hl1">شخصي</span>، جلسة <span class="hl" id="hl2">مباشرة</span>، حصص <span class="hl" id="hl3">للأطفال</span>، ومحتوى <span class="hl" id="hl4">لعملك</span>.</div>
  <div class="gstack" id="g5">${Array.from({length:11},(_,i)=>`<div style="color:${i===5?'#fff':`hsl(${255+(i-5)*6} 90% ${52+Math.abs(i-5)*4}%)`};opacity:${i===5?1:0.85-Math.abs(i-5)*0.13}">فيديو شخصي، جلسة مباشرة، حصص للأطفال، ومحتوى لعملك.</div>`).join("")}</div></div>
<div class="scene" id="s6"><div class="occ" id="occ"><div class="h">لأي مناسبة تخطر ببالك</div>${OCC.map((w,i)=>`<span class="${i%4===1?'v':''}" style="left:${[180,620,1080,1520][i%4]+(Math.floor(i/4)%2)*90}px;top:${[300,540,780][Math.floor(i/4)]}px">${w}</span>`).join("")}</div></div>
<div class="scene" id="s7"><div class="cards">${card("سارة، عيد ميلاد سعيد. أخوك عمر قال لي هذا يومك… خلّيه أحلى يوم بالسنة.","عيد ميلاد",true)}${card("مبروك التخرّج يا علي. تعبك بان، والجاي أحلى.","تخرّج",false)}${card("مقلب بصديقك؟ أنا وياك. شنو اسمه؟","مقلب ومزاح",false)}${card("أبو أحمد، كل عام وإنت بخير. عيدكم مبارك.","عيد",false)}</div>
  <div class="like" id="lk"><div id="lt"></div><div class="row"><i id="i1">♥</i><i id="i2">↻</i><i id="i3">➤</i></div></div></div>
<div class="scene" id="s8"><div class="cats" id="cats"><div class="h">نجوم بكل المجالات</div>${CATS.map(w=>`<div class="w">${w}</div>`).join("")}</div></div>
<div class="scene" id="s9"><div class="cloud" id="cl">${[["عيد ميلاد",200,170],["تخرّج",1520,150],["زواج وخطوبة",240,760],["عيد ورمضان",1480,790],["مقلب ومزاح",160,470],["رومانسية",1580,470],["كرة القدم",620,140],["رسالة غنائية",1120,130],["تحفيز",680,880],["تهنئة أعمال",1140,890]].map(([w,x,y])=>`<span style="left:${x}px;top:${y}px">${w}</span>`).join("")}</div>
  <div class="center" id="c9"><div id="c9a"></div><div id="c9b"></div></div></div>
<div class="scene" id="s10">${ribbons("r10")}<div class="end" id="end"><div class="ar">نجم العراق</div><div class="row"><div class="handle" style="font-size:36px;padding:10px 28px 10px 12px">${mark("av")}@iraqistar.iq</div><div class="handle" style="font-size:36px;padding:10px 28px">iraqistar.com</div></div></div><div class="give" id="gv">مع كل طلب، جزء من أرباحنا يروح للأعمال الخيرية بالعراق</div></div>
<div class="vig" id="vig"></div><div class="flash" id="flash"></div><div class="flashd" id="flashd"></div>
<svg class="grain" width="100%" height="100%"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="1" id="turb"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>
</div><script>
const B=${B}, SC=${JSON.stringify(SC)}, OCC_N=${OCC.length}, CATS_N=${CATS.length};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)), eo=x=>1-Math.pow(1-x,3), ei=x=>x*x*x, back=x=>{const c=1.7;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)}, seg=(t,s,d)=>clamp((t-s)/d,0,1), hit=(t,a,l)=>t>=a?Math.exp(-(t-a)/l):0, $=id=>document.getElementById(id);
const bt=k=>k*B;
function typeWords(el,t,s,step){el.querySelectorAll('span').forEach((w,i)=>{const k=eo(seg(t,s+i*step,0.12));w.style.opacity=k;w.style.transform=\`translateY(\${((1-k)*14).toFixed(1)}px)\`;});}
function ribbon(id,t,speed){for(let i=0;i<4;i++){$(id+'t'+i).setAttribute('startOffset',(-((t*speed*(1+i*0.25))%1200)-100)+'px');}}
window.renderAt=t=>{
  $('turb').setAttribute('seed',String(Math.floor(t*30)%40));
  let bg='dark', kick=0, fl=0, fld=0;
  SC.forEach(([id,s,e,mode])=>{const on=t>=bt(s)&&t<bt(e); $(id).style.opacity=on?1:0; if(on)bg=mode;
    if(s>0){kick+=hit(t,bt(s),0.12)*0.035; if(mode==='dark')fld+=hit(t,bt(s),0.06)*0.4; else fl+=hit(t,bt(s),0.08)*0.5;}});
  $('bg').className='bg'+(bg==='white'?' white':''); $('vig').style.opacity=bg==='dark'?1:0; $('glow').style.opacity=bg==='dark'?(0.6+0.4*Math.sin(t*4)).toFixed(3):0;
  // S1 hero
  ribbon('r1',t,300); const h1=back(seg(t,0.3,0.55)); $('hero').style.opacity=clamp(h1*3,0,1); $('hero').style.transform=\`scale(\${(0.6+0.4*h1).toFixed(3)})\`;
  // S2 typing
  typeWords($('t2'),t,bt(5)+0.1,0.19);
  // S3 handle
  const h3=back(seg(t,bt(9)+0.05,0.5)); $('h3').style.transform=\`scale(\${(0.5+0.5*h3).toFixed(3)})\`; $('h3').style.opacity=clamp(h3*3,0,1);
  // S4 kinetic 3 words, each slams in on a beat and stacks
  [...$('kin').children].forEach((d,i)=>{const s=bt(12+i*1.5); const k=eo(seg(t,s,0.22)); const later=Math.max(0,Math.floor((t-s)/(1.5*B))); d.style.opacity=(k*(1-later*0.35)).toFixed(3);
    const y=(i-1)*250-115; d.style.transform=\`translateY(\${(y-(1-k)*120).toFixed(0)}px) scale(\${(1.5-0.5*k).toFixed(3)})\`; d.style.filter=\`blur(\${((1-k)*14).toFixed(1)}px)\`;});
  // S5
  const l=$('l5'); const k5=eo(seg(t,bt(18)+0.05,0.4)); const k5b=eo(seg(t,bt(24),0.5)); l.style.opacity=(k5*(1-k5b)).toFixed(3); l.style.transform=\`translateY(\${((1-k5)*30).toFixed(0)}px) scale(\${(1.1-0.1*k5).toFixed(3)})\`;
  [1,2,3,4].forEach(i=>{const on=t>=bt(19+i); const el=$('hl'+i); el.style.color=on?'#a58bff':'#fff'; el.style.display='inline-block'; el.style.transform=\`scale(\${(1+0.1*hit(t,bt(19+i),0.15)).toFixed(3)})\`;});
  const g=$('g5'); g.style.opacity=k5b; g.style.transform=\`translateY(-50%) scaleY(\${(0.2+0.8*k5b).toFixed(3)})\`;
  // S6 occasions
  const oc=$('occ'); oc.querySelector('.h').style.opacity=eo(seg(t,bt(27),0.3));
  [...oc.querySelectorAll('span')].forEach((sp,i)=>{const s=bt(27)+0.2+i*(B/3); const k=back(seg(t,s,0.35)); sp.style.opacity=clamp(k*3,0,1); sp.style.transform=\`scale(\${(0.4+0.6*k).toFixed(3)}) rotate(\${((i%3-1)*2).toFixed(1)}deg)\`;});
  // S7 cards then like
  const cs=document.querySelectorAll('#s7 .card'); const pos=[[690,90],[1210,200],[190,260],[720,600]];
  cs.forEach((c,i)=>{const k=back(seg(t,bt(33)+i*B*0.75,0.4)); const out=eo(seg(t,bt(37.5),0.3)); c.style.opacity=(clamp(k*3,0,1)*(1-out)).toFixed(3); c.style.left=pos[i][0]+'px'; c.style.top=(pos[i][1]+(1-k)*160)+'px'; c.style.transform=\`rotate(\${((i%2?1:-1)*(2+i)).toFixed(1)}deg) scale(\${(0.85+0.15*k).toFixed(3)})\`;});
  const lk=$('lk'); const k7=eo(seg(t,bt(38),0.3)); lk.style.opacity=k7; $('lt').textContent=t<bt(39.5)?'اطلب، شارك،':'اطلب، شارك، وفرّح.';
  ['i1','i2','i3'].forEach((id,i)=>{const s=bt(38.5+i*0.5); const k=back(seg(t,s,0.3)); const el=$(id); el.style.opacity=clamp(k*3,0,1); el.style.transform=\`scale(\${(0.3+0.7*k).toFixed(3)})\`; el.classList.toggle('on',t>=s+0.25);});
  // S8 categories flashing
  const ct=$('cats'); ct.querySelector('.h').style.opacity=eo(seg(t,bt(41),0.3));
  [...ct.querySelectorAll('.w')].forEach((d,i)=>{const s=bt(41.5+i*0.9), e=s+0.9*B; const on=t>=s&&t<e; const k=eo(seg(t,s,0.14)); d.style.opacity=on?1:0; d.style.transform=\`translateY(-50%) scale(\${(1.3-0.3*k).toFixed(3)})\`; d.style.filter=\`blur(\${((1-k)*10).toFixed(1)}px)\`; if(on)kick+=hit(t,s,0.08)*0.02;});
  // S9 cloud + center
  document.querySelectorAll('#cl span').forEach((sp,i)=>{const k=eo(seg(t,bt(47)+i*0.12,0.35)); sp.style.opacity=k; sp.style.transform=\`translateY(\${((1-k)*30).toFixed(0)}px)\`;});
  const ws=['اطلب','الآن','من','نجمك']; $('c9a').innerHTML=ws.slice(0,Math.floor(seg(t,bt(47)+0.2,1.0)*4.999)).join(' ');
  $('c9b').innerHTML=t>=bt(50)?'نجوم بكل <span class="hl">المجالات</span>… حتى تلكه <span class="hl">نجمك</span>.':'';
  // S10 end
  ribbon('r10',t,260); const k10=back(seg(t,bt(53)+0.05,0.55)); $('end').style.opacity=clamp(k10*3,0,1); $('end').style.transform=\`scale(\${(0.6+0.4*k10).toFixed(3)})\`; $('gv').style.opacity=eo(seg(t,bt(55.5),0.5));
  // riser shake into end
  const r=seg(t,bt(50),bt(53)-bt(50)); const shake=r>0&&r<1?Math.sin(t*95)*2.5*r:0;
  $('cam').style.transform=\`scale(\${(1+0.02*(t/${DUR})+kick+0.05*ei(r)).toFixed(4)}) translate(\${shake.toFixed(1)}px,0)\`;
  $('flash').style.opacity=clamp(fl+(t>=bt(53)?hit(t,bt(53),0.14)*0.9:0),0,1).toFixed(3); $('flashd').style.opacity=clamp(fld,0,1).toFixed(3);
  document.body.style.opacity=(1-eo(seg(t,${DUR}-0.5,0.5))).toFixed(3);
};
</script></body></html>`;
fs.writeFileSync("intro2.html", html);
const dir = "frames2"; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir);
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }); const p = await b.newPage({ viewport: { width: W, height: H } });
p.on("pageerror", e => console.log("PAGEERR", e.message));
await p.goto("file://" + process.cwd() + "/intro2.html"); await p.evaluate(() => document.fonts.ready);
const only = process.argv[2] ? process.argv[2].split(",").map(Number) : null;
for (let f = 0; f < Math.round(DUR * FPS); f++) { if (only && !only.includes(f)) continue; await p.evaluate(t => window.renderAt(t), f / FPS); await p.screenshot({ path: `${dir}/${String(f).padStart(4, "0")}.jpg`, type: "jpeg", quality: 90 }); }
await b.close();
if (!only) execSync(`ffmpeg -v error -y -framerate ${FPS} -i ${dir}/%04d.jpg -c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium -movflags +faststart intro2-silent.mp4`);
console.log("done", DUR);
