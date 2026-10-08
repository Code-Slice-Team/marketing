"""Music bed for the نجم العراق intro v3 — 128 BPM, A minor, Am–F–C–G. Structure follows the video's beat grid:
intro swell (0–5) → tagline 1 sparse + slam (5–11) → drop A (11–24) → full (24–44) → category punches (44–50)
→ tagline 2 breakdown + riser (50–57) → outro chorus + tail (57–65). Sidechained supersaw pad, sub bass, plucked lead hook
with delay, 808-style kick, clap, hats, risers, impacts, a send reverb. All synthesised with numpy/scipy."""
import numpy as np, wave
from scipy.signal import butter, lfilter, fftconvolve
SR = 44100; BPM = 84; B = 60 / BPM; T = 34.0; N = int(T * SR); t = np.arange(N) / SR
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

# ---------- arrangement: premium app tour (84 BPM, 34 s) ----------
CH = {"Am": (57, 60, 64, 69), "F": (53, 57, 60, 65), "C": (55, 60, 64, 67), "G": (55, 59, 62, 67), "Dm": (50, 53, 57, 62)}
ROOT = {"Am": 33, "F": 29, "C": 36, "G": 31, "Dm": 38}
PROG = ["Am", "F", "C", "G"]
sc_kicks = []
def softkick(at, vel=0.5):
    n = int(0.6 * SR); tt = np.arange(n) / SR; f = 46 + 90 * np.exp(-tt * 18)
    add("drums", np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 4.5) * vel, at); sc_kicks.append(at)
def glass(at, midi, vel=0.2):
    n = int(1.6 * SR); tt = np.arange(n) / SR; f = NOTE(midi)
    s_ = (np.sin(2 * np.pi * f * tt) + 0.4 * np.sin(2 * np.pi * f * 2.01 * tt) + 0.15 * np.sin(2 * np.pi * f * 3.02 * tt)) * np.exp(-tt * 2.2)
    add("lead", s_ * vel * (1 - np.exp(-tt * 600)), at, send=0.7)
SCENES = [0, 3.2, 7.2, 11.2, 15.2, 19.2, 23.2, 26.4, 29.6]
# pad bed: one chord per bar (4 beats), slow filter opening through the piece
bars = int(T / (4 * B)) + 1
for bar in range(bars):
    t0 = bar * 4 * B; ch = PROG[bar % 4]
    cut = 900 + 1800 * min(1, t0 / 24)
    supersaw(CH[ch], t0, 4 * B + 0.4, 0.42, cutoff=cut, atk=0.5, rel=0.6, send=0.5)
    # sub on 1 and 3, soft kick on 1 and 3 from 3.2 s, heartbeat ghost on 2.5
    for k in (0, 2):
        at = t0 + k * B
        sub(ROOT[ch], at, B * 1.6, 0.7)
        if at >= 3.2 and at < 30: softkick(at, 0.5 if k == 0 else 0.4)
    if t0 >= 7 and t0 < 30: hat(t0 + 3 * B + B / 2, 0.25, 0.06)
# sparse melody: one phrase per scene, plucks with long delay
MEL = [[(0.0, 76), (0.75, 72), (1.5, 69)], [(0.0, 72), (1.0, 74), (2.0, 76)], [(0.0, 69), (0.75, 72), (1.5, 71)], [(0.0, 76), (1.0, 79), (2.2, 76)], [(0.0, 74), (0.75, 72), (1.5, 69)], [(0.0, 72), (1.0, 76), (2.0, 74)], [(0.0, 69), (1.0, 72)], [(0.0, 76), (0.75, 74), (1.5, 72)], [(0.0, 81), (0.6, 76), (1.2, 72), (2.4, 69)]]
for i, s0 in enumerate(SCENES):
    for off, mnote in MEL[i]:
        pluck(mnote, s0 + 0.4 + off * B, B * 1.2, 0.5)
    glass(s0 + 0.05, 88 if i % 2 == 0 else 93, 0.16)
# opening and closing gestures
shimmer(0.6, 0.14); rev_cymbal(3.2, 1.2, 0.18)
sweep(26.4, 3.2, 0.14)
impact(29.6, 0.55, 2.4); shimmer(29.65, 0.22)
supersaw(CH["Am"], 29.6, T - 29.6, 0.5, cutoff=2600, atk=0.05, rel=2.0, send=0.6)
sub(33, 29.6, T - 29.6 - 0.5, 0.6); softkick(29.6, 0.6)
pluck(76, 30.2, B * 2, 0.5); pluck(72, 30.2 + B, B * 2, 0.45); pluck(69, 30.2 + 2 * B, B * 3, 0.5)
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
mix = bus["drums"] * 0.6 + bus["bass"] * sc * 0.45 + bus["pad"] * sc * 5.0 + lead * sc * 5.0 + bus["fx"] * 0.9 + rev * 1.8
mix = hp(mix, 45)
# master: gentle drive + limiter-ish
mix = np.tanh(mix / (np.abs(mix).max() * 0.7)) ; mix = mix / np.abs(mix).max() * 0.85
mix *= np.clip((T - t) / 0.9, 0, 1) * np.minimum(t / 0.1, 1)
r = np.roll(mix, int(0.0005 * SR)); r[:25] = 0
st = np.stack([mix * 0.96 + r * 0.04, r * 0.96 + mix * 0.04], axis=1)
with wave.open("music_lux.wav", "wb") as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((st * 32767).astype(np.int16).tobytes())
seg=slice(int(bt(24)*SR),int(bt(44)*SR))
for k in bus: print(k, round(float(np.sqrt(np.mean(bus[k][seg]**2))),4))
print("lead+delay", round(float(np.sqrt(np.mean(lead[seg]**2))),4), "rev", round(float(np.sqrt(np.mean(rev[seg]**2))),4))
print("ok", T)
