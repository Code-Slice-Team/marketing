"""Sound for the IraqiStar logo reveal (4.5 s): a soft low whoosh under the mark, a two-note chime as the
wordmark lands, and a warm pad that fades with the picture. Synthesised with numpy; nothing to license."""
import numpy as np, wave
SR = 44100; T = 4.5; N = int(T * SR); t = np.arange(N) / SR
mix = np.zeros(N)

def add(sig, at):
    i = int(at * SR); j = min(N, i + len(sig)); mix[i:j] += sig[: j - i]

def tone(freq, dur, atk=0.01, dec=1.8, vel=1.0, harm=(1, 0.35, 0.12)):
    n = int(dur * SR); tt = np.arange(n) / SR
    env = (1 - np.exp(-tt / atk)) * np.exp(-tt / dec)
    w = sum(a * np.sin(2 * np.pi * freq * (k + 1) * tt) for k, a in enumerate(harm))
    return w * env * vel

# whoosh: filtered noise swelling 0.0–0.9 s with the mark
n = int(1.1 * SR); tt = np.arange(n) / SR
noise = np.random.default_rng(3).standard_normal(n)
k = 40; noise = np.convolve(noise, np.ones(k) / k, mode="same")          # dull it
env = np.sin(np.pi * np.clip(tt / 1.1, 0, 1)) ** 2 * (0.5 + 0.5 * tt / 1.1)
add(noise * env * 0.35, 0.0)

# chime: A5 then E6 as the letters rise, a little bell-like
add(tone(880, 2.2, dec=1.2, vel=0.28, harm=(1, 0.5, 0.2, 0.08)), 0.75)
add(tone(1318.5, 2.4, dec=1.4, vel=0.22, harm=(1, 0.5, 0.2, 0.08)), 1.05)
# low root under it
add(tone(110, 3.6, atk=0.15, dec=2.5, vel=0.32, harm=(1, 0.25)), 0.6)
# pad chord (A major) from 1.6 s, fading with the picture
for f in (220, 277.2, 329.6, 440):
    n = int(2.9 * SR); tt = np.arange(n) / SR
    env = np.minimum(tt / 0.6, 1) * np.clip((2.9 - tt) / 0.9, 0, 1)
    w = (np.sin(2 * np.pi * f * tt) + np.sin(2 * np.pi * f * 1.003 * tt)) / 2
    add(w * env * 0.06, 1.6)
# soft tick when the Arabic name lands
add(tone(1760, 0.5, atk=0.002, dec=0.12, vel=0.12, harm=(1, 0.3)), 1.85)

# master: fade out with the picture, normalise
mix *= np.clip((T - t) / 0.6, 0, 1)
mix = np.tanh(mix / (np.abs(mix).max() * 0.9)); mix = mix / np.abs(mix).max() * 0.85
right = np.roll(mix, int(0.0006 * SR)); right[:30] = 0
st = np.stack([mix, right], axis=1)
with wave.open("reveal.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype(np.int16).tobytes())
print("ok")
