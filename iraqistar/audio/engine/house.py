"""Modern afro/deep-house engine for IraqiStar Reels — pure DSP (no GM samples): 808-style kick, amapiano log-drum
bass, claps, shakers, sidechained detuned-saw chords, plucks with dotted echo, Schroeder reverb, glued master."""
import numpy as np
from scipy.signal import butter, sosfilt, lfilter
SR = 44100
rng = np.random.default_rng(3)
def sos(kind, fc, order=2): return butter(order, np.clip(fc, 20, SR / 2 - 100) / (SR / 2), btype=kind, output='sos')
def env(n, a, d, s=0.0, r=0.05, hold=0.0):
    """ADSR-ish envelope over n samples (attack a, decay d, sustain level s held, release r) — seconds."""
    t = np.arange(n) / SR; e = np.zeros(n)
    A = max(1, int(a * SR)); D = max(1, int(d * SR)); H = int(hold * SR); R = max(1, int(r * SR))
    e[:A] = np.linspace(0, 1, A)[: n]
    i = A; seg_ = min(n - i, D); e[i:i + seg_] = 1 + (s - 1) * np.linspace(0, 1, D)[:seg_]; i += seg_
    seg_ = min(n - i, H); e[i:i + seg_] = s; i += seg_
    seg_ = min(n - i, R); e[i:i + seg_] = s * np.linspace(1, 0, R)[:seg_]; i += seg_
    return e
def f_of(midi): return 440 * 2 ** ((midi - 69) / 12)
# ---------------- instruments (return mono or stereo arrays) ----------------
def kick(vel=1.0):
    n = int(0.45 * SR); t = np.arange(n) / SR
    f = 48 + 110 * np.exp(-t * 38); ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t * 7.5)
    click = rng.standard_normal(n) * np.exp(-t * 400) * 0.5
    click = sosfilt(sos('high', 1800), click)
    x = np.tanh((body * 1.6 + click * 1.4) * 1.4) * vel * 0.62
    return x * env(n, 0.0005, 0.42, 0, 0.02)
def logdrum(midi, dur=0.32, vel=1.0):
    """amapiano log drum: sine w/ short pitch drop, saturated, punchy"""
    n = int(dur * SR); t = np.arange(n) / SR; f0 = f_of(midi)
    f = f0 * (1 + 0.9 * np.exp(-t * 60)); ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) + 0.35 * np.sin(2 * ph) * np.exp(-t * 12)
    x = np.tanh(x * 2.2) * env(n, 0.002, dur * 0.9, 0, 0.03) * vel
    return sosfilt(sos('low', 900), x)
def clap(vel=1.0):
    n = int(0.35 * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for k, off in enumerate((0, 0.011, 0.022, 0.033)):
        i = int(off * SR); m = n - i; x[i:] += rng.standard_normal(m) * np.exp(-np.arange(m) / SR * (300 if k < 3 else 22))
    x = sosfilt(sos('high', 900, 2), x); x = sosfilt(sos('low', 6500), x)
    return x * 0.9 * vel
def shaker(vel=1.0, dur=0.09):
    n = int(dur * SR); t = np.arange(n) / SR
    x = rng.standard_normal(n) * env(n, 0.004, dur * 0.8, 0, 0.01)
    return sosfilt(sos('high', 6500, 4), x) * 0.8 * vel
def hat(vel=1.0, dur=0.06):
    n = int(dur * SR); x = rng.standard_normal(n) * np.exp(-np.arange(n) / SR * 90)
    return sosfilt(sos('high', 8000, 4), x) * 0.5 * vel
def rim(vel=1.0):
    n = int(0.08 * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * 1700 * t) * np.exp(-t * 120) + rng.standard_normal(n) * np.exp(-t * 300) * 0.4
    return sosfilt(sos('high', 1200), x) * 0.8 * vel
def saw(f, n, detune=0.0, phase=0.0):
    t = np.arange(n) / SR; ph = (t * f * (1 + detune) + phase) % 1.0
    return 2 * ph - 1
def supersaw(midi, n, voices=6, spread=0.012):
    f = f_of(midi); L = np.zeros(n); R = np.zeros(n)
    for v in range(voices):
        d = spread * ((v / (voices - 1)) * 2 - 1); s = saw(f, n, d, rng.random())
        (L if v % 2 == 0 else R)[:] += s
    return np.stack([L, R], 1) / voices
def chord(midis, dur, cutoff=1800, vel=1.0, atk=0.01):
    n = int(dur * SR); x = np.zeros((n, 2))
    for m_ in midis: x += supersaw(m_, n)
    e = env(n, atk, dur * 0.35, 0.6, 0.12, hold=dur * 0.55)
    # filter env: open on attack then settle
    t = np.arange(n) / SR; fc = cutoff * (0.55 + 0.9 * np.exp(-t * 6))
    out = np.zeros_like(x); step = 512
    for i in range(0, n, step):
        j = min(n, i + step); s_ = sos('low', float(fc[min(j - 1, n - 1)]), 2)
        out[i:j] = sosfilt(s_, x[i:j], axis=0)
    return out * e[:, None] * 0.28 * vel
def pluck(midi, dur=0.5, vel=1.0):
    n = int(dur * SR); t = np.arange(n) / SR; f = f_of(midi)
    x = saw(f, n) * 0.6 + np.sin(2 * np.pi * f * t) * 0.6
    fc = 600 + 5200 * np.exp(-t * 18); out = np.zeros(n); step = 256
    for i in range(0, n, step):
        j = min(n, i + step); out[i:j] = sosfilt(sos('low', float(fc[min(j - 1, n - 1)]), 2), x[i:j])
    return out * env(n, 0.002, dur * 0.7, 0.0, 0.05) * 0.5 * vel
def pad(midis, dur, vel=1.0):
    n = int(dur * SR); x = np.zeros((n, 2))
    for m_ in midis: x += supersaw(m_, n, voices=4, spread=0.006)
    x = sosfilt(sos('low', 900), x, axis=0)
    return x * env(n, min(1.2, dur * 0.4), 0.2, 1.0, min(1.5, dur * 0.4), hold=max(0, dur - 2 * min(1.2, dur * 0.4)))[:, None] * 0.22 * vel
def riser(dur, vel=0.5):
    n = int(dur * SR); t = np.arange(n) / SR; p = t / dur
    x = rng.standard_normal(n); out = np.zeros(n); step = 2048
    for i in range(0, n, step):
        j = min(n, i + step); out[i:j] = sosfilt(sos('high', 300 + 9000 * (i / n) ** 2, 2), x[i:j])
    return out * (p ** 2.2) * vel * 0.9
def downlifter(dur=1.2, vel=0.5):
    n = int(dur * SR); t = np.arange(n) / SR
    f = 900 * np.exp(-t * 4) + 60; ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) * np.exp(-t * 3.0) + sosfilt(sos('low', 1200), rng.standard_normal(n)) * np.exp(-t * 5) * 0.5
    return x * vel * 0.8
def crash(vel=0.6, dur=1.8):
    n = int(dur * SR); t = np.arange(n) / SR
    x = rng.standard_normal(n) * np.exp(-t * 2.4); x = sosfilt(sos('high', 5000, 2), x)
    return x * vel * 0.5
def impact(vel=0.6):
    n = int(1.4 * SR); t = np.arange(n) / SR; f = 42 + 60 * np.exp(-t * 12); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.tanh(np.sin(ph) * np.exp(-t * 2.6) * 1.5) * vel * 0.5
# ---------------- effects ----------------
def reverb(x, mix=0.25, size=1.0):
    """simple Schroeder: 4 combs + 2 allpasses, per channel"""
    def comb(sig, d, g):
        out = np.zeros_like(sig); buf = np.zeros(d)
        # vectorised block IIR via lfilter: y[n] = x[n] + g*y[n-d]
        b = np.zeros(d + 1); b[0] = 1; a = np.zeros(d + 1); a[0] = 1; a[d] = -g
        return lfilter(b, a, sig)
    def allpass(sig, d, g=0.5):
        b = np.zeros(d + 1); b[0] = -g; b[d] = 1; a = np.zeros(d + 1); a[0] = 1; a[d] = -g
        return lfilter(b, a, sig)
    out = np.zeros_like(x)
    for ch in range(x.shape[1]):
        s = x[:, ch]; w = np.zeros_like(s)
        for d, g in ((1557, 0.84), (1617, 0.83), (1491, 0.82), (1422, 0.81)):
            w += comb(s, int(d * size) + ch * 23, g)
        w = allpass(w, 225); w = allpass(w, 556)
        w = sosfilt(sos('low', 5500), w) * 0.25
        out[:, ch] = s * (1 - mix) + w * mix
    return out
def echo(x, delay, fb=0.35, mix=0.3):
    d = int(delay * SR); n = len(x); y = np.copy(x)
    for k in range(1, 5):
        g = fb ** k
        if g < 0.02: break
        sh = np.zeros_like(x); sh[k * d:] = x[: n - k * d] * g
        sh = sosfilt(sos('low', 4200), sh, axis=0) if x.ndim == 2 else sosfilt(sos('low', 4200), sh)
        y += sh * mix / 0.3 * 0.3
    return y
def sidechain(n, kick_times, depth=0.55, rel=0.28):
    g = np.ones(n); t = np.arange(n) / SR
    for kt in kick_times:
        i = int(kt * SR)
        if i >= n: continue
        m = min(n, i + int(rel * SR)); tt = np.arange(m - i) / SR
        g[i:m] = np.minimum(g[i:m], 1 - depth * np.exp(-tt / (rel * 0.35)) * (1 - tt / rel) - 0 * tt)
    return np.clip(g, 0, 1)
# ---------------- session ----------------
class Session:
    def __init__(self, T, bpm):
        self.T = T; self.bpm = bpm; self.N = int(T * SR); self.B = 60 / bpm
        self.bus = {k: np.zeros((self.N, 2)) for k in ('drums', 'bass', 'chords', 'lead', 'fx')}
        self.kicks = []
    def add(self, bus, sig, at, pan=0.0, gain=1.0):
        i = int(at * SR)
        if i >= self.N or i < 0: return
        if sig.ndim == 1: sig = np.stack([sig * (1 - max(pan, 0)), sig * (1 + min(pan, 0))], 1)
        j = min(self.N, i + len(sig)); self.bus[bus][i:j] += sig[: j - i] * gain
    def mix(self, chord_sc=True):
        b = self.bus
        drums = b['drums']; bass = sosfilt(sos('high', 32), b['bass'], axis=0)
        chords = reverb(b['chords'], 0.28); lead = reverb(echo(b['lead'], self.B * 0.75, 0.4, 0.3), 0.3)
        if chord_sc and self.kicks:
            g = sidechain(self.N, self.kicks)[:, None]; chords = chords * g; lead = lead * (0.6 + 0.4 * g)
        for k_,v_ in (('drums',drums),('bass',bass),('chords',chords),('lead',lead),('fx',b['fx'])): print(k_, round(float(np.sqrt((v_**2).mean())),4))
        m = drums * 0.8 + bass * 0.34 + chords * 5.2 + lead * 5.0 + b['fx'] * 0.6
        m = sosfilt(sos('high', 28), m, axis=0)
        # glue: soft knee saturation + peak normalize
        m = np.tanh(m / (np.abs(m).max() * 0.62)) ; m = m / np.abs(m).max() * 0.93
        return m
def write(path, m):
    import wave
    with wave.open(path, 'wb') as f:
        f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((np.clip(m, -1, 1) * 32767).astype(np.int16).tobytes())
