"""Fast bed for the نجم العراق intro v2 (128 BPM, 28.6 s), locked to the beat grid the animation cuts on.
Four-on-the-floor kick, 16th hats, clap on 2 & 4, plucked bass, dark pad; boom + whoosh on every scene cut,
punches on the kinetic words / categories, ticks on the typewriter, riser into the end card, impact + shimmer. Synthesised."""
import numpy as np, wave
SR = 44100; B = 60 / 128; T = round(61 * B * 30) / 30; N = int(T * SR); t = np.arange(N) / SR
mix = np.zeros(N); rng = np.random.default_rng(11)
bt = lambda k: k * B
def add(sig, at):
    i = int(at * SR)
    if i < 0: sig = sig[-i:]; i = 0
    j = min(N, i + len(sig)); mix[i:j] += sig[: j - i]
def kick(at, vel=0.55):
    n = int(0.26 * SR); tt = np.arange(n) / SR; f = 150 * np.exp(-tt * 24) + 48
    add(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 11) * vel, at)
def hat(at, vel=0.06, dur=0.04):
    n = int(dur * SR); tt = np.arange(n) / SR; w = np.diff(rng.standard_normal(n), prepend=0)
    add(w * np.exp(-tt * 90) * vel, at)
def clap(at, vel=0.16):
    n = int(0.16 * SR); tt = np.arange(n) / SR; w = np.convolve(rng.standard_normal(n), np.ones(3) / 3, mode="same")
    env = np.exp(-tt * 28) * (1 + 0.6 * (np.sin(2 * np.pi * 90 * tt) > 0)[:n])
    add(w * env * vel, at)
def bass(f, at, dur, vel=0.3):
    n = int(dur * SR); tt = np.arange(n) / SR
    add((np.sin(2 * np.pi * f * tt) + 0.35 * np.sin(4 * np.pi * f * tt)) * np.exp(-tt * 5) * (1 - np.exp(-tt * 400)) * vel, at)
def pad(chord, at, dur, vel=0.04):
    n = int(dur * SR); tt = np.arange(n) / SR; env = np.minimum(tt / 0.6, 1) * np.clip((dur - tt) / 0.6, 0, 1)
    for f in chord: add((np.sin(2 * np.pi * f * tt) + np.sin(2 * np.pi * f * 1.004 * tt)) / 2 * env * vel, at)
def boom(at, vel=0.7, f0=95, dur=0.9):
    n = int(dur * SR); tt = np.arange(n) / SR; f = f0 * np.exp(-tt * 7) + 40
    w = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 4)
    th = np.convolve(rng.standard_normal(n), np.ones(8) / 8, mode="same") * np.exp(-tt * 45) * 0.5
    add((w + th) * vel, at)
def whoosh(at, vel=0.2, dur=0.4):
    n = int(dur * SR); tt = np.arange(n) / SR; w = np.convolve(rng.standard_normal(n), np.ones(10) / 10, mode="same")
    add(w * np.sin(np.pi * tt / dur) ** 2 * vel, at - dur * 0.7)
def punch(at, vel=0.45):
    n = int(0.3 * SR); tt = np.arange(n) / SR; f = 220 * np.exp(-tt * 30) + 60
    add(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 14) * vel, at)
    hat(at, 0.12, 0.08)
def tick(at, vel=0.1):
    n = int(0.03 * SR); tt = np.arange(n) / SR; add(np.sin(2 * np.pi * 2400 * tt) * np.exp(-tt * 180) * vel, at)
def shimmer(at, vel=0.22):
    for f, d in ((880, 2.4), (1318.5, 2.6), (1760, 2.0)):
        n = int(d * SR); tt = np.arange(n) / SR
        add(np.sin(2 * np.pi * f * tt) * (1 - np.exp(-tt / 0.02)) * np.exp(-tt / (d * 0.45)) * vel * (880 / f) ** 0.6, at)
# harmony: Am – F – C – G, one bar (4 beats) each
prog = [(110, (220, 261.6, 329.6)), (87.3, (174.6, 220, 261.6)), (130.8, (261.6, 329.6, 392)), (98, (196, 246.9, 293.7))]
for bar in range(16):
    k0 = bar * 4; t0 = bt(k0); root, chord = prog[bar % 4]
    pad(chord, t0, 4 * B + 0.3, 0.04 if k0 >= 5 else 0.03)
    if 5 <= k0 < 53:
        for k in range(4): kick(t0 + k * B, 0.6 if k % 2 == 0 else 0.5)
        for k in range(16): hat(t0 + k * B / 4, 0.09 if k % 4 == 0 else (0.05 if k % 2 else 0.035))
        clap(t0 + B); clap(t0 + 3 * B)
        bass(root, t0, B * 0.7); bass(root, t0 + 0.75 * B, B * 0.25, 0.18); bass(root, t0 + 1.5 * B, B * 0.5, 0.22)
        bass(root, t0 + 2 * B, B * 0.7); bass(root * 1.5, t0 + 2.75 * B, B * 0.25, 0.18); bass(root * 1.5, t0 + 3.5 * B, B * 0.5, 0.2)
# scene cuts (beats 5,9,12,18,27,33,41,47,53)
for k in (5, 9, 12, 18, 27, 33, 41, 47): boom(bt(k), 0.7); whoosh(bt(k))
boom(0.3, 0.8, dur=1.4)
# typewriter ticks
for i in range(9): tick(bt(5) + 0.1 + i * 0.19)
# kinetic words, highlight pops, occasions, cards, icons, categories
for i in range(3): punch(bt(12 + i * 1.5), 0.5)
for i in range(4): punch(bt(20 + i), 0.3)
for i in range(12): tick(bt(27) + 0.2 + i * B / 3, 0.09)
for i in range(4): punch(bt(33) + i * B * 0.75, 0.3)
for i in range(3): tick(bt(38.5 + i * 0.5), 0.12)
for i in range(6): punch(bt(41.5 + i * 0.9), 0.5)
# riser 50 → 53, impact, shimmer, outro pad
n = int(3 * B * SR); tt = np.arange(n) / SR; dur = 3 * B
w = np.convolve(rng.standard_normal(n), np.ones(40) / 40, mode="same") * (1 - tt / dur) + np.convolve(rng.standard_normal(n), np.ones(4) / 4, mode="same") * (tt / dur)
add(w * (tt / dur) ** 2 * 0.5, bt(50))
for i in range(12): hat(bt(50) + i * B / 4, 0.05 + i * 0.012, 0.03)
boom(bt(53), 1.2, f0=115, dur=2.0); shimmer(bt(53) + 0.05)
pad((220, 277.2, 329.6, 440), bt(53) + 0.2, T - bt(53), 0.06)
kick(bt(55), 0.5); kick(bt(57), 0.5); kick(bt(59), 0.45)
mix *= np.clip((T - t) / 0.7, 0, 1) * np.minimum(t / 0.15, 1)
mix = np.tanh(mix / (np.abs(mix).max() * 0.8)); mix = mix / np.abs(mix).max() * 0.9
r = np.roll(mix, int(0.0006 * SR)); r[:30] = 0
st = np.stack([mix * 0.97 + r * 0.03, r * 0.97 + mix * 0.03], axis=1)
with wave.open("bed2.wav", "wb") as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((st * 32767).astype(np.int16).tobytes())
print("ok", T)
