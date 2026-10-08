"""Music bed for the نجم العراق intro v3 — 128 BPM, A minor, Am–F–C–G. Structure follows the video's beat grid:
intro swell (0–5) → tagline 1 sparse + slam (5–11) → drop A (11–24) → full (24–44) → category punches (44–50)
→ tagline 2 breakdown + riser (50–57) → outro chorus + tail (57–65). Sidechained supersaw pad, sub bass, plucked lead hook
with delay, 808-style kick, clap, hats, risers, impacts, a send reverb. All synthesised with numpy/scipy."""
import numpy as np, wave
from scipy.signal import butter, lfilter, fftconvolve
SR = 44100; BPM = 120; B = 60 / BPM; T = 48.0; N = int(T * SR); t = np.arange(N) / SR
rng = np.random.default_rng(3); bt = lambda k: k * B
bus = {k: np.zeros(N) for k in ("drums", "bass", "pad", "lead", "fx")}; sends = np.zeros(N)
def add(b, sig, at, send=0.0):
    i = int(at * SR)
    if i < 0: sig = sig[-i:]; i = 0
    j = min(N, i + len(sig))
    if j <= i: return
    bus[b][i:j] += sig[: j - i]
    if send: sends[i:j] += sig[: j - i] * send
def lp(x, fc, order=2):
    b, a = butter(order, min(fc, SR / 2 - 100) / (SR / 2)); return lfilter(b, a, x)
def hp(x, fc, order=2):
    b, a = butter(order, fc / (SR / 2), btype="high"); return lfilter(b, a, x)
def bp(x, lo, hi):
    b, a = butter(2, [lo / (SR / 2), hi / (SR / 2)], btype="band"); return lfilter(b, a, x)
def env_adsr(n, a, d, s, r):
    tt = np.arange(n) / SR; e = np.ones(n)
    e = np.where(tt < a, tt / max(a, 1e-4), e)
    e = np.where((tt >= a) & (tt < a + d), 1 - (1 - s) * (tt - a) / max(d, 1e-4), e)
    e = np.where(tt >= a + d, s, e)
    rn = int(r * SR);
    if rn > 0 and rn < n: e[-rn:] *= np.linspace(1, 0, rn)
    return e
def saw(f, n, ph=0.0):
    tt = np.arange(n) / SR; return 2 * ((f * tt + ph) % 1) - 1
NOTE = lambda m: 440 * 2 ** ((m - 69) / 12)
# ---------- drums ----------
def kick(at, vel=1.0):
    n = int(0.45 * SR); tt = np.arange(n) / SR; f = 48 + 160 * np.exp(-tt * 28)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 6.5)
    click = hp(rng.standard_normal(n), 2000) * np.exp(-tt * 220) * 0.6
    add("drums", np.tanh((body + click) * 1.8) * 0.9 * vel, at)
def clap(at, vel=0.8):
    n = int(0.3 * SR); tt = np.arange(n) / SR; e = np.zeros(n)
    for d in (0, 0.011, 0.021, 0.032): e += np.exp(-np.clip(tt - d, 0, None) * 40) * (tt >= d)
    e += np.exp(-tt * 9) * 0.8
    w = bp(rng.standard_normal(n), 400, 7000) * e
    add("drums", w * 0.45 * vel, at, send=0.35)
def snare(at, vel=0.8):
    n = int(0.25 * SR); tt = np.arange(n) / SR
    tone = np.sin(2 * np.pi * 185 * tt) * np.exp(-tt * 30) * 0.5
    w = bp(rng.standard_normal(n), 300, 9000) * np.exp(-tt * 18)
    add("drums", (tone + w) * 0.55 * vel, at, send=0.3)
def hat(at, vel=0.5, dur=0.05, open_=False):
    n = int((0.35 if open_ else dur) * SR); tt = np.arange(n) / SR
    w = hp(rng.standard_normal(n), 7000, 4) * np.exp(-tt * (9 if open_ else 80))
    add("drums", w * 0.16 * vel, at)
# ---------- tonal ----------
def sub(midi, at, dur, vel=0.9):
    n = int(dur * SR); tt = np.arange(n) / SR; f = NOTE(midi)
    s = np.sin(2 * np.pi * f * tt) + 0.5 * np.sin(2 * np.pi * 2 * f * tt) * np.exp(-tt * 8) + lp(saw(f, n), 380) * 0.5
    add("bass", s * env_adsr(n, 0.004, 0.08, 0.75, 0.04) * vel * 0.55, at)
def supersaw(midis, at, dur, vel=0.5, cutoff=2200, detune=0.012, atk=0.01, rel=0.25, send=0.35):
    n = int(dur * SR); s = np.zeros(n)
    for m in midis:
        f = NOTE(m)
        for k, d in enumerate((-1, -0.55, -0.2, 0.2, 0.55, 1)):
            s += saw(f * (1 + d * detune), n, rng.random()) * (0.6 if abs(d) < 0.3 else 1)
    s = lp(s / (len(midis) * 6), cutoff) * env_adsr(n, atk, 0.1, 0.9, rel)
    add("pad", s * vel, at, send=send)
def stab(midis, at, dur=0.18, vel=0.5):
    supersaw(midis, at, dur, vel, cutoff=3500, atk=0.003, rel=0.08, send=0.4)
def pluck(midi, at, dur=0.3, vel=0.6):
    n = int((dur + 0.4) * SR); tt = np.arange(n) / SR; f = NOTE(midi)
    s = saw(f, n) * 0.6 + np.sign(np.sin(2 * np.pi * f * tt)) * 0.25 + np.sin(2 * np.pi * f * tt) * 0.4
    cut = 900 + 5000 * np.exp(-tt * 14)
    # crude time-varying lowpass: two stages
    s = lp(s, 2600) * (0.6 + 0.4 * np.exp(-tt * 12))
    s = s * np.exp(-tt * (3.2 / dur)) * (1 - np.exp(-tt * 900))
    add("lead", s * vel * 0.5, at, send=0.45)
def shimmer(at, vel=0.25):
    for f, d in ((880, 2.4), (1318.5, 2.6), (1760, 2.0), (2637, 1.6)):
        n = int(d * SR); tt = np.arange(n) / SR
        add("fx", np.sin(2 * np.pi * f * tt) * (1 - np.exp(-tt / 0.02)) * np.exp(-tt / (d * 0.45)) * vel * (880 / f) ** 0.7, at, send=0.6)
def impact(at, vel=1.0, dur=1.8):
    n = int(dur * SR); tt = np.arange(n) / SR; f = 42 + 90 * np.exp(-tt * 9)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 2.6)
    crash = lp(rng.standard_normal(n), 4000) * np.exp(-tt * 4.5) * 0.2
    add("fx", np.tanh((body * 0.55 + crash * 1.4) * 1.5) * vel * 0.8, at, send=0.6)
def riser(at, dur, vel=0.3):
    n = int(dur * SR); tt = np.arange(n) / SR; p = tt / dur
    noise = hp(rng.standard_normal(n), 300 + 6000 * p ** 2) if False else rng.standard_normal(n)
    noise = np.array([0.0]) if n == 0 else noise
    # sweep: lowpass opening
    out = np.zeros(n); step = int(0.05 * SR)
    for i in range(0, n, step):
        seg = noise[i:i + step]; fc = 400 + 9000 * (i / n) ** 2; out[i:i + step] = lp(seg, fc)
    tone = np.sin(2 * np.pi * np.cumsum(110 * 2 ** (p * 2)) / SR) * 0.35
    add("fx", (out * 0.6 + tone) * p ** 1.6 * vel, at, send=0.5)
def rev_cymbal(at, dur=1.0, vel=0.18):
    n = int(dur * SR); tt = np.arange(n) / SR; p = tt / dur
    add("fx", hp(rng.standard_normal(n), 5000) * p ** 2.5 * vel, at - dur, send=0.5)
def sweep(at, dur, vel=0.22):
    n = int(dur * SR); tt = np.arange(n) / SR; p = tt / dur; win = np.sin(np.pi * p) ** 1.5
    out = np.zeros(n); step = int(0.04 * SR)
    noise = rng.standard_normal(n)
    for i in range(0, n, step):
        fc = 600 + 7000 * (i / n); out[i:i + step] = bp(noise[i:i + step], fc * 0.5, min(fc * 1.6, 18000))
    add("fx", out * win * vel, at, send=0.6)
    for f in (1318.5, 1975.5, 2637): add("fx", np.sin(2 * np.pi * f * tt) * win ** 2 * 0.045 * (1318.5 / f), at, send=0.7)
def whoosh(at, vel=0.16, dur=0.35):
    n = int(dur * SR); tt = np.arange(n) / SR
    add("fx", bp(rng.standard_normal(n), 800, 6000) * np.sin(np.pi * tt / dur) ** 2 * vel, at - dur * 0.7, send=0.4)
def boom(at, vel=0.7):
    n = int(0.8 * SR); tt = np.arange(n) / SR; f = 45 + 80 * np.exp(-tt * 12)
    add("fx", np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 5) * vel * 0.5, at)

# ---------- arrangement: modern hybrid trailer (120 BPM, 48 s) ----------
CH = {"Dm": (50, 53, 57, 62), "Bb": (46, 50, 53, 58), "F": (45, 48, 53, 57), "A": (45, 49, 52, 57)}
ROOT = {"Dm": 38, "Bb": 34, "F": 41, "A": 33}
PROG = ["Dm", "Bb", "F", "A"]
sc_kicks = []
def braam(at, midi=26, vel=0.9, dur=2.6):
    n = int(dur * SR); tt = np.arange(n) / SR; f0 = NOTE(midi)
    f = f0 * (1 + 0.06 * np.exp(-tt * 3))           # slight pitch drop
    s_ = np.zeros(n)
    for d in (-0.012, -0.005, 0.004, 0.011): s_ += 2 * ((np.cumsum(f * (1 + d)) / SR) % 1) - 1
    s_ = np.tanh(lp(s_, 1800) * 2.6)
    env = (1 - np.exp(-tt * 40)) * np.exp(-tt * 1.1)
    add("fx", s_ * env * vel * 0.55, at, send=0.5)
def taiko(at, vel=0.8):
    n = int(0.7 * SR); tt = np.arange(n) / SR; f = 80 + 140 * np.exp(-tt * 18)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 7)
    skin = bp(rng.standard_normal(n), 200, 2400) * np.exp(-tt * 26) * 0.9
    add("drums", np.tanh((body + skin) * 1.8) * vel, at, send=0.35); sc_kicks.append(at)
def slap(at, vel=0.5):
    n = int(0.4 * SR); tt = np.arange(n) / SR
    w = bp(rng.standard_normal(n), 300, 6000) * np.exp(-tt * 14) + np.sin(2 * np.pi * 170 * tt) * np.exp(-tt * 28) * 0.6
    add("drums", w * vel * 0.6, at, send=0.5)
def tick(at, vel=0.18, f=3200):
    n = int(0.04 * SR); tt = np.arange(n) / SR
    add("drums", (np.sin(2 * np.pi * f * tt) * 0.5 + hp(rng.standard_normal(n), 5000) * 0.5) * np.exp(-tt * 160) * vel, at)
def stacc(midi, at, dur, vel=0.4, cut=1800):
    n = int(dur * SR); tt = np.arange(n) / SR; f = NOTE(midi); s_ = np.zeros(n)
    for d in (-0.006, 0, 0.006): s_ += 2 * ((f * (1 + d) * tt) % 1) - 1
    s_ = lp(s_ / 3, cut) * env_adsr(n, 0.005, 0.05, 0.6, 0.05)
    add("pad", s_ * vel, at, send=0.4)
def choir(midis, at, dur, vel=0.3, cut=700):
    n = int(dur * SR); tt = np.arange(n) / SR; s_ = np.zeros(n)
    for mm in midis:
        f = NOTE(mm)
        for d in (-0.01, -0.004, 0.003, 0.009): s_ += 2 * ((f * (1 + d) * tt + rng.random()) % 1) - 1
    s_ = bp(s_ / (len(midis) * 4), 200, cut) * env_adsr(n, 0.8, 0.3, 0.9, 1.0)
    add("pad", s_ * vel, at, send=0.6)
def downlifter(at, dur=1.2, vel=0.25):
    n = int(dur * SR); tt = np.arange(n) / SR; p = tt / dur
    add("fx", np.sin(2 * np.pi * np.cumsum(600 * 0.25 ** p) / SR) * (1 - p) ** 2 * vel * 0.4 + lp(rng.standard_normal(n), 1500) * (1 - p) ** 3 * vel * 0.3, at, send=0.5)
HITS = [0.25, 0.75, 1.25, 2.0, 3.0, 7.6, 12.6, 17.2, 21.0, 24.4, 25.6, 26.8, 28.0, 33.0, 37.6, 41.2, 42.2, 42.9]
BIG = (3.0, 17.2, 28.0, 41.2)
for h in HITS:
    impact(h, 0.9 if h in BIG else 0.5, 2.0); boom(h, 0.5 if h in BIG else 0.25)
    if h in BIG: braam(h + 0.02, 26, 0.95); downlifter(h + 0.15)
    elif h > 2.5: braam(h + 0.02, 38, 0.4, 1.4)
for h in (0.25, 0.75, 1.25, 2.0): taiko(h, 1.0); slap(h, 0.8); stacc(50, h, 0.35, 0.5, 3000)
DRIVE0, DRIVE1 = 17.2, 41.2; BREAK = (28.0, 30.8)
bars = int(T / (4 * B)) + 1
for bar in range(bars):
    t0 = bar * 4 * B; ch = PROG[bar % 4]; r = ROOT[ch]
    if t0 < 3.0: continue
    drive = DRIVE0 <= t0 < DRIVE1 and not (BREAK[0] <= t0 < BREAK[1]); brk = BREAK[0] <= t0 < BREAK[1]
    build = 3.0 <= t0 < DRIVE0
    cut = 900 + 2600 * min(1, (t0 - 3) / 14) if build else (4200 if drive else 1400)
    choir(CH[ch], t0, 4 * B + 0.5, 0.32 if not brk else 0.22, 1600 if build else 2600)
    for k in range(4):
        at = t0 + k * B
        # low ostinato: root-root-fifth-root in 8ths
        pat = [r + 12, r + 12, r + 19, r + 12, r + 12, r + 24, r + 19, r + 12]
        for e in range(2):
            i8 = k * 2 + e; note = pat[i8 % 8]
            if build or drive: stacc(note, at + e * B / 2, B * 0.42, (0.28 if build else 0.42) * (1.0 if e == 0 else 0.8), cut)
            if drive: stacc(note + 12, at + e * B / 2, B * 0.4, 0.2, 6000)
        # ticks build through the build section, 16ths in drive
        if build: tick(at, 0.16); tick(at + B / 2, 0.10)
        if drive:
            for q in range(4): tick(at + q * B / 4, 0.14 if q % 2 else 0.2, 3200 if q else 4200)
        if build and k in (0, 2): taiko(at, 0.6 + 0.25 * (t0 - 3) / 14)
        if drive:
            taiko(at, 0.95 if k in (0, 2) else 0.7)
            if k in (1, 3): slap(at, 0.55)
        if brk and k == 0: taiko(at, 0.5)
        if drive or build: sub(r - 12 if r > 36 else r, at, B * 0.9, 0.3 if k in (0, 2) else 0.15)
    if drive and bar % 2 == 1: slap(t0 + 3.5 * B, 0.35); slap(t0 + 3.75 * B, 0.3)
# risers into the big hits, silence beat before the finale
riser(15.2, 2.0, 0.45); riser(26.2, 1.8, 0.4); riser(39.0, 2.0, 0.5)
rev_cymbal(3.0, 1.2, 0.3); rev_cymbal(17.2, 1.6, 0.35); rev_cymbal(28.0, 1.2, 0.25); rev_cymbal(41.2, 1.6, 0.35)
sweep(28.0, 2.6, 0.12)
# finale
choir(CH["Dm"], 41.2, T - 41.2, 0.4, 2000); sub(26, 41.2, T - 41.2 - 0.6, 0.7); shimmer(41.25, 0.3)
taiko(42.2, 0.9); braam(42.22, 26, 0.6, 1.6); taiko(42.9, 0.9); braam(42.92, 26, 0.6, 1.6)
for at in (44.0, 45.0, 46.0): taiko(at, 0.5)
# ---------- mix ----------
# sidechain envelope
sc = np.ones(N)
for at in sc_kicks:
    i = int(at * SR); n = int(0.32 * SR); tt = np.arange(min(n, N - i)) / SR
    sc[i:i + len(tt)] = np.minimum(sc[i:i + len(tt)], 0.55 + 0.45 * (1 - np.exp(-tt * 8)) ** 1.5)
# delay on lead (dotted 8th ping-pong-ish, mono here)
lead = bus["lead"].copy(); d = int(0.75 * B * SR)
for g, mult in ((0.42, 1), (0.22, 2), (0.1, 3)):
    lead[d * mult:] += bus["lead"][:-d * mult] * g
# reverb: exponentially decaying noise IR, lowpassed
ir_n = int(1.6 * SR); ir = lp(rng.standard_normal(ir_n), 3200) * np.exp(-np.arange(ir_n) / SR * 3.2); ir /= np.abs(ir).sum() ** 0.5 * 4
rev = fftconvolve(sends, ir)[:N] * 0.9
mix = hp(bus["drums"], 70) * 0.5 + bus["bass"] * sc * 0.25 + bus["pad"] * sc * 8.5 + lead * sc * 4.0 + hp(bus["fx"], 50) * 0.8 + rev * 2.4
mix = hp(mix, 35)
gap = np.ones(N); i0, i1 = int(40.88 * SR), int(41.2 * SR); gap[i0:i0 + 1300] = np.linspace(1, 0.03, 1300); gap[i0 + 1300:i1] = 0.03; mix *= gap
# master: gentle drive + limiter-ish
mix = np.tanh(mix / (np.abs(mix).max() * 0.6)) ; mix = mix / np.abs(mix).max() * 0.92
mix *= np.clip((T - t) / 0.9, 0, 1) * np.minimum(t / 0.1, 1)
r = np.roll(mix, int(0.0005 * SR)); r[:25] = 0
st = np.stack([mix * 0.96 + r * 0.04, r * 0.96 + mix * 0.04], axis=1)
with wave.open("music_trailer.wav", "wb") as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((st * 32767).astype(np.int16).tobytes())
seg=slice(int(bt(24)*SR),int(bt(44)*SR))
for k in bus: print(k, round(float(np.sqrt(np.mean(bus[k][seg]**2))),4))
print("lead+delay", round(float(np.sqrt(np.mean(lead[seg]**2))),4), "rev", round(float(np.sqrt(np.mean(rev[seg]**2))),4))
print("ok", T)
