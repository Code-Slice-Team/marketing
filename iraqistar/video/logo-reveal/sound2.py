"""Cinematic sound for the two IraqiStar reveals (6 s). python3 sound2.py words|glow → reveal-<v>.wav
Sub-bass hits on each word, a noise riser into the logo, a big impact with a shimmer, a dark pad. All synthesised."""
import numpy as np, wave, sys
V = sys.argv[1] if len(sys.argv) > 1 else "words"
SR = 44100; T = 6.0; N = int(T * SR); t = np.arange(N) / SR
mix = np.zeros(N); rng = np.random.default_rng(11)

def add(sig, at):
    i = int(at * SR); j = min(N, i + len(sig)); mix[i:j] += sig[: j - i]

def boom(at, vel=1.0, f0=90, dur=1.4):
    n = int(dur * SR); tt = np.arange(n) / SR
    f = f0 * np.exp(-tt * 6) + 38
    w = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 3.2)
    th = rng.standard_normal(n) * np.exp(-tt * 40) * 0.5          # transient click
    th = np.convolve(th, np.ones(8) / 8, mode="same")
    add((w + th) * vel, at)

def riser(at, dur, vel=0.5):
    n = int(dur * SR); tt = np.arange(n) / SR
    w = rng.standard_normal(n)
    k = 60; w = np.convolve(w, np.ones(k) / k, mode="same")        # dark noise
    # open it up over time by mixing in less-filtered noise
    w2 = np.convolve(rng.standard_normal(n), np.ones(6) / 6, mode="same")
    p = (tt / dur) ** 2
    w = w * (1 - p) + w2 * p * 0.6
    env = p * (1 - np.exp(-tt * 20))
    add(w * env * vel, at)

def shimmer(at, vel=0.3):
    for f, d in ((880, 2.4), (1318.5, 2.6), (1760, 2.2), (2637, 1.6)):
        n = int(d * SR); tt = np.arange(n) / SR
        env = (1 - np.exp(-tt / 0.02)) * np.exp(-tt / (d * 0.45))
        add(np.sin(2 * np.pi * f * tt) * env * vel * (880 / f) ** 0.6, at + (f - 880) / 12000)

def pad(at, dur, chord, vel=0.07):
    n = int(dur * SR); tt = np.arange(n) / SR
    env = np.minimum(tt / 1.2, 1) * np.clip((dur - tt) / 1.0, 0, 1)
    for f in chord:
        w = (np.sin(2 * np.pi * f * tt) + np.sin(2 * np.pi * f * 1.004 * tt) + 0.3 * np.sin(2 * np.pi * f * 2 * tt)) / 2.3
        add(w * env * vel, at)

def tick(at, vel=0.08):
    n = int(0.08 * SR); tt = np.arange(n) / SR
    add(np.sin(2 * np.pi * 2200 * tt) * np.exp(-tt * 90) * vel, at)

def whoosh(at, dur, vel=0.4):
    n = int(dur * SR); tt = np.arange(n) / SR
    w = np.convolve(rng.standard_normal(n), np.ones(10) / 10, mode="same")
    env = np.sin(np.pi * np.clip(tt / dur, 0, 1)) ** 1.5
    add(w * env * vel, at)

# dark pad bed the whole way (A minor, low)
pad(0.0, 6.0, (110, 130.8, 164.8, 220), vel=0.05)

if V == "words":
    for at, v in ((0.4, 0.8), (0.9, 0.85), (1.5, 0.9), (2.3, 1.0)):
        boom(at, vel=v)
        whoosh(at - 0.18, 0.3, vel=0.18)
    riser(2.5, 1.0, vel=0.55)
    LOGO = 3.5
else:
    whoosh(0.25, 1.5, vel=0.35)                       # letters sliding
    for i in range(18): tick(0.3 + i * 0.05, vel=0.05)
    n = int(0.6 * SR); tt = np.arange(n) / SR        # light sweep: bright noise burst
    add(np.convolve(rng.standard_normal(n), np.ones(3) / 3, mode="same") * np.exp(-tt * 7) * 0.3, 1.78)
    boom(1.8, vel=0.55, f0=70)
    riser(2.3, 0.9, vel=0.5)
    LOGO = 3.2

boom(LOGO, vel=1.2, f0=110, dur=2.0)
shimmer(LOGO + 0.05, vel=0.26)
pad(LOGO + 0.3, 6.0 - LOGO - 0.3, (220, 277.2, 329.6, 440), vel=0.06)   # lifts to A major under the logo
tick(LOGO + 1.3, vel=0.06)                                                # Arabic name lands

mix *= np.clip((T - t) / 0.55, 0, 1)
mix = np.tanh(mix / (np.abs(mix).max() * 0.85)); mix = mix / np.abs(mix).max() * 0.9
right = np.roll(mix, int(0.0007 * SR)); right[:40] = 0
st = np.stack([mix * 0.97 + right * 0.03, right * 0.97 + mix * 0.03], axis=1)
with wave.open(f"reveal-{V}.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype(np.int16).tobytes())
print("ok", V)
