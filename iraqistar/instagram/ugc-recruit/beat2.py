"""Cinematic bed for the fast-cut UGC Reel (15 s): boom on every cut, driving kick/hat from 3.2 s, riser 10.8-12,
big impact + shimmer at 12, dark pad throughout. All synthesised."""
import numpy as np, wave
SR = 44100; T = 15.0; N = int(T * SR); t = np.arange(N) / SR; B = 60 / 110
mix = np.zeros(N); rng = np.random.default_rng(9)
def add(sig, at):
    i = int(at * SR); j = min(N, i + len(sig)); mix[i:j] += sig[: j - i]
def boom(at, vel=0.8, f0=95, dur=1.0):
    n = int(dur * SR); tt = np.arange(n) / SR; f = f0 * np.exp(-tt * 7) + 40
    w = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 3.5)
    th = np.convolve(rng.standard_normal(n), np.ones(8) / 8, mode="same") * np.exp(-tt * 45) * 0.5
    add((w + th) * vel, at)
def kick(at, vel=0.5):
    n = int(0.25 * SR); tt = np.arange(n) / SR; f = 140 * np.exp(-tt * 22) + 48
    add(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 10) * vel, at)
def hat(at, vel=0.07):
    n = int(0.05 * SR); tt = np.arange(n) / SR; w = np.diff(rng.standard_normal(n), prepend=0)
    add(w * np.exp(-tt * 70) * vel, at)
def bass(f, at, dur, vel=0.28):
    n = int(dur * SR); tt = np.arange(n) / SR
    add((np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(4 * np.pi * f * tt)) * np.exp(-tt * 4) * (1 - np.exp(-tt * 300)) * vel, at)
def pad(chord, at, dur, vel=0.05):
    n = int(dur * SR); tt = np.arange(n) / SR; env = np.minimum(tt / 0.8, 1) * np.clip((dur - tt) / 0.8, 0, 1)
    for f in chord: add((np.sin(2 * np.pi * f * tt) + np.sin(2 * np.pi * f * 1.004 * tt)) / 2 * env * vel, at)
def shimmer(at, vel=0.25):
    for f, d in ((880, 2.4), (1318.5, 2.6), (1760, 2.0)):
        n = int(d * SR); tt = np.arange(n) / SR
        add(np.sin(2 * np.pi * f * tt) * (1 - np.exp(-tt / 0.02)) * np.exp(-tt / (d * 0.45)) * vel * (880 / f) ** 0.6, at)
pad((110, 130.8, 164.8, 220), 0, 12.2, 0.05)
# booms on the cuts
for at, v in ((0.0, 0.7), (0.9, 0.75), (1.8, 0.95), (3.2, 0.8), (4.6, 0.7), (5.4, 0.7), (6.2, 0.7), (7.0, 0.85), (7.9, 0.75), (8.8, 0.75), (9.7, 0.8)):
    boom(at, v)
# beat from the card shot to the riser
b0 = 3.2; k = 0; roots = [110, 87.3, 130.8, 98]
while b0 + k * B < 10.8:
    at = b0 + k * B
    kick(at, 0.5 if k % 2 == 0 else 0.38); hat(at, 0.06); hat(at + B / 2, 0.09)
    if k % 2 == 0: bass(roots[(k // 4) % 4], at, B * 0.9)
    k += 1
# riser and impact
n = int(1.2 * SR); tt = np.arange(n) / SR
w = np.convolve(rng.standard_normal(n), np.ones(40) / 40, mode="same") * (1 - (tt / 1.2)) + np.convolve(rng.standard_normal(n), np.ones(4) / 4, mode="same") * (tt / 1.2)
add(w * (tt / 1.2) ** 2 * 0.5, 10.8)
boom(12.0, 1.2, f0=115, dur=2.0); shimmer(12.05)
pad((220, 277.2, 329.6, 440), 12.3, 2.7, 0.06)
mix *= np.clip((T - t) / 0.5, 0, 1)
mix = np.tanh(mix / (np.abs(mix).max() * 0.85)); mix = mix / np.abs(mix).max() * 0.9
r = np.roll(mix, int(0.0007 * SR)); r[:40] = 0
st = np.stack([mix * 0.97 + r * 0.03, r * 0.97 + mix * 0.03], axis=1)
with wave.open("beat2.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype(np.int16).tobytes())
print("ok")
