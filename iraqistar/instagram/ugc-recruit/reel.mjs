// IraqiStar Business — UGC creator recruitment Reel, 15 s, 1080x1920, brand motion only.
import { chromium } from "playwright"; import fs from "node:fs"; import { execSync } from "node:child_process";
const FPS = 30, DUR = 15, W = 1080, H = 1920;
const MARK = "M12.00 0.80 L14.49 5.99 L19.92 4.08 L18.01 9.51 L23.20 12.00 L18.01 14.49 L19.92 19.92 L14.49 18.01 L12.00 23.20 L9.51 18.01 L4.08 19.92 L5.99 14.49 L0.80 12.00 L5.99 9.51 L4.08 4.08 L9.51 5.99 Z M9.40 8.10 L16.40 12.00 L9.40 15.90 Z";
const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-SemiBold.ttf);font-weight:600}
@font-face{font-family:"IBM Plex Sans Arabic";src:url(fonts/IBMPlexSansArabic-Bold.ttf);font-weight:700}
@font-face{font-family:Geist;src:url(fonts/Geist-Bold.ttf);font-weight:700}
*{margin:0;padding:0;box-sizing:border-box}
html{overflow:hidden;width:${W}px;height:${H}px}
body{width:${W}px;height:${H}px;overflow:hidden;background:#08080f;color:#f7f7fb;font-family:"IBM Plex Sans Arabic",sans-serif;position:relative}
#cam{position:absolute;inset:0;transform-origin:50% 50%}
.glow{position:absolute;left:50%;top:45%;width:1400px;height:1400px;border-radius:50%;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(100,48,240,.5) 0%,rgba(100,48,240,0) 58%)}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 55%,rgba(0,0,0,.65) 100%)}
.scene{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 90px;text-align:center;opacity:0}
.h{font-size:104px;line-height:1.25;font-weight:700}
.h .ac{color:#a58bff}
.s{font-size:44px;line-height:1.7;color:rgba(247,247,251,.85);margin-top:40px}
.chip{border:3px solid rgba(165,139,255,.6);border-radius:999px;padding:22px 48px;font-size:44px;font-weight:600;margin:14px 0;opacity:0;background:rgba(255,255,255,.03)}
.card{width:820px;background:#13121e;border:2px solid rgba(165,139,255,.35);border-radius:32px;padding:34px 38px;display:flex;align-items:center;gap:26px;text-align:right;box-shadow:0 30px 80px rgba(0,0,0,.6)}
.card .ic{width:96px;height:96px;border-radius:24px;background:#6430f0;display:grid;place-items:center;flex:none}
.card .ic svg{width:50px;height:50px;fill:#fff}
.card b{display:block;font-size:36px}.card span{display:block;font-size:28px;color:rgba(247,247,251,.7);margin-top:6px}
.step{display:flex;align-items:center;gap:26px;margin:18px 0;font-size:48px;font-weight:700;opacity:0;width:760px;text-align:right}
.step i{width:84px;height:84px;border-radius:50%;background:#6430f0;color:#fff;display:grid;place-items:center;font-family:Geist;font-style:normal;font-size:44px;flex:none}
.lockup{display:flex;align-items:center;gap:16px;direction:ltr;font-family:Geist;font-weight:700;font-size:96px;letter-spacing:-.02em}
.lockup svg{width:1.1em;height:1.1em;fill:#6430f0;filter:drop-shadow(0 0 30px rgba(100,48,240,.9))}
.tag{background:#2a2940;border-radius:999px;padding:8px 26px;font-size:.42em;letter-spacing:0}
.cta{margin-top:70px;background:#6430f0;color:#fff;border-radius:999px;padding:30px 64px;font-size:50px;font-weight:700;box-shadow:0 0 60px rgba(100,48,240,.6)}
.cta b{font-family:Geist;background:#fff;color:#6430f0;border-radius:999px;padding:2px 24px;margin:0 8px}
.give{position:absolute;left:60px;right:60px;bottom:110px;text-align:center;font-size:30px;color:rgba(247,247,251,.75);opacity:0}
.brand{position:absolute;top:90px;left:0;right:0;text-align:center;font-family:Geist;font-weight:700;font-size:40px;letter-spacing:-.02em;direction:ltr;opacity:.9}
</style></head><body><div id="cam">
<div class="glow" id="glow"></div><div class="vig"></div>
<div class="brand">IraqiStar · Business</div>
<div class="scene" id="s1"><div class="h">تصوّر محتوى؟<br><span class="ac">الشركات تدوّر عليك.</span></div></div>
<div class="scene" id="s2"><div class="card"><div class="ic"><svg viewBox="0 0 24 24"><path d="M4 7h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Zm14 3 4-2v8l-4-2Z"/></svg></div><div><b>طلب جديد من شركة بمدينتك</b><span>فيديو 30 ثانية عن منتج · من موبايلك</span></div></div><div class="s">توصلك الطلبات، وإنت تختار.</div></div>
<div class="scene" id="s3"><div class="chip">سعرك بيدك</div><div class="chip">طلبات من شركات بمدينتك</div><div class="chip">تصوير من موبايلك</div></div>
<div class="scene" id="s4"><div class="step"><i>1</i>سجّل كصانع محتوى</div><div class="step"><i>2</i>حدد سعرك</div><div class="step"><i>3</i>استلم الطلبات وصوّر</div></div>
<div class="scene" id="s5"><div class="lockup"><svg viewBox="0 0 24 24"><path fill-rule="evenodd" d="${MARK}"/></svg>IraqiStar<span class="tag">Business</span></div><div class="cta">أرسل كلمة <b>UGC</b> بالرسائل</div></div>
<div class="give" id="give">مع كل طلب، جزء من أرباحنا يروح للأعمال الخيرية بالعراق · iraqistar.com</div>
</div><script>
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)), eo=x=>1-Math.pow(1-x,3), seg=(t,s,d)=>clamp((t-s)/d,0,1), $=id=>document.getElementById(id);
const SC=[["s1",0,3.2],["s2",3.2,3.2],["s3",6.4,3.0],["s4",9.4,3.0],["s5",12.4,2.6]];
function show(el,t,s,e){const i=eo(seg(t,s,0.45)), o=1-eo(seg(t,e-0.35,0.35)); el.style.opacity=(i*o).toFixed(3); el.style.transform=\`translateY(\${((1-i)*40).toFixed(1)}px) scale(\${(0.97+0.03*i).toFixed(3)})\`;}
window.renderAt=t=>{
  $('cam').style.transform=\`scale(\${(1+0.03*(t/15)).toFixed(4)})\`;
  SC.forEach(([id,s,d])=>show($(id),t,s,s+d));
  document.querySelectorAll('#s3 .chip').forEach((el,i)=>{const k=eo(seg(t,6.6+i*0.35,0.4)); el.style.opacity=k; el.style.transform=\`translateX(\${((1-k)*-60).toFixed(1)}px)\`;});
  document.querySelectorAll('#s4 .step').forEach((el,i)=>{const k=eo(seg(t,9.6+i*0.4,0.4)); el.style.opacity=k; el.style.transform=\`translateX(\${((1-k)*60).toFixed(1)}px)\`;});
  $('give').style.opacity=eo(seg(t,13.0,0.5));
  document.body.style.opacity=(1-eo(seg(t,14.6,0.4))).toFixed(3);
};
</script></body></html>`;
fs.writeFileSync("reel.html", html);
const dir = "frames"; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir);
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }); const p = await b.newPage({ viewport: { width: W, height: H } });
await p.goto("file://" + process.cwd() + "/reel.html"); await p.evaluate(() => document.fonts.ready);
const n = DUR * FPS;
for (let f = 0; f < n; f++) { await p.evaluate(t => window.renderAt(t), f / FPS); await p.screenshot({ path: `${dir}/${String(f).padStart(4, "0")}.jpg`, type: "jpeg", quality: 92 }); }
await b.close();
execSync(`ffmpeg -v error -y -framerate ${FPS} -i ${dir}/%04d.jpg -c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium -movflags +faststart reel-silent.mp4`);
console.log("frames", n);
