"""15 s house-brand bed for the UGC Reel: a dark pad, soft kick on the beat, hats, a plucked bass line. Synthesised."""
import numpy as np, wave
SR = 44100; T = 15.0; N = int(T * SR); t = np.arange(N) / SR; BPM = 100; B = 60 / BPM
mix = np.zeros(N); rng = np.random.default_rng(5)
def add(sig, at):
    i = int(at * SR); j = min(N, i + len(sig)); mix[i:j] += sig[: j - i]
def kick(at, vel=0.55):
    n = int(0.3 * SR); tt = np.arange(n) / SR; f = 130 * np.exp(-tt * 20) + 45
    add(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9) * vel, at)
def hat(at, vel=0.06, dur=0.05):
    n = int(dur * SR); tt = np.arange(n) / SR; w = rng.standard_normal(n); w = np.diff(w, prepend=0)
    add(w * np.exp(-tt * 70) * vel, at)
def bass(f, at, dur, vel=0.3):
    n = int(dur * SR); tt = np.arange(n) / SR
    add((np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * 2 * f * tt)) * np.exp(-tt * 3.5) * (1 - np.exp(-tt * 300)) * vel, at)
def pad(chord, at, dur, vel=0.05):
    n = int(dur * SR); tt = np.arange(n) / SR; env = np.minimum(tt / 1.0, 1) * np.clip((dur - tt) / 1.0, 0, 1)
    for f in chord: add((np.sin(2 * np.pi * f * tt) + np.sin(2 * np.pi * f * 1.004 * tt)) / 2 * env * vel, at)
# A minor → F → C → G, 2 bars each
prog = [(110, (220, 261.6, 329.6)), (87.3, (174.6, 220, 261.6)), (130.8, (261.6, 329.6, 392)), (98, (196, 246.9, 293.7))]
bars = int(T / (4 * B)) + 1
for b in range(bars):
    t0 = b * 4 * B; root, chord = prog[(b // 2) % 4]
    pad(chord, t0, 4 * B + 0.5)
    if b >= 1:
        for k in range(4):
            kick(t0 + k * B, 0.5 if k % 2 == 0 else 0.4)
        for k in range(8): hat(t0 + k * B / 2, 0.05 if k % 2 else 0.08)
        bass(root, t0, B * 0.9); bass(root, t0 + 1.5 * B, B * 0.5, 0.22); bass(root, t0 + 2 * B, B * 0.9); bass(root * 1.5, t0 + 3.5 * B, B * 0.5, 0.2)
# little rise into the end card
n = int(1.2 * SR); tt = np.arange(n) / SR; w = np.convolve(rng.standard_normal(n), np.ones(30) / 30, mode="same")
add(w * (tt / 1.2) ** 2 * 0.25, 11.2); kick(12.4, 0.7)
mix *= np.clip((T - t) / 0.6, 0, 1) * np.minimum(t / 0.3, 1)
mix = np.tanh(mix / (np.abs(mix).max() * 0.85)); mix = mix / np.abs(mix).max() * 0.85
r = np.roll(mix, int(0.0006 * SR)); r[:30] = 0
st = np.stack([mix, r], axis=1)
with wave.open("beat.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype(np.int16).tobytes())
print("ok")
