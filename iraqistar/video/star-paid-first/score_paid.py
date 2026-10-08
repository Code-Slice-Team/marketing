"""Score for the gift-idea Reel (22 s): the same three voices as the launch film — strings ostinato, cinematic drums,
synth bass — cut to this timeline. Real sampled instruments via FluidSynth + light FX bed."""
import mido, subprocess, numpy as np, wave
from scipy.signal import butter, lfilter
BPM = 120; TPB = 480; SR = 44100; T = 20.0
sec = lambda s: int(round(s / (60 / BPM) * TPB))
mid = mido.MidiFile(ticks_per_beat=TPB); ev = []
def note(ch, key, t0, dur, vel=90):
    ev.append((sec(t0), 1, mido.Message('note_on', channel=ch, note=key, velocity=int(max(1, min(127, vel))))))
    ev.append((sec(t0 + dur), 0, mido.Message('note_off', channel=ch, note=key, velocity=0)))
def chord(ch, keys, t0, dur, vel=90):
    for k in keys: note(ch, k, t0, dur, vel)
def cc(ch, num, val, t0): ev.append((sec(t0), 0, mido.Message('control_change', channel=ch, control=num, value=int(max(0, min(127, val))))))
def prog(ch, p): ev.append((0, 0, mido.Message('program_change', channel=ch, program=p)))
def ramp(ch, num, a, b, t0, t1, steps=20):
    for i in range(steps + 1): cc(ch, num, a + (b - a) * i / steps, t0 + (t1 - t0) * i / steps)
STR, BASS = 0, 1; DR = 9
prog(STR, 48); prog(BASS, 38)
cc(STR, 7, 118, 0); cc(STR, 91, 60, 0); cc(BASS, 7, 46, 0); cc(DR, 7, 86, 0); cc(DR, 91, 50, 0); cc(STR, 10, 64, 0); cc(BASS, 10, 64, 0)
PROG = [(50, (62, 65, 69)), (46, (58, 62, 65)), (41, (57, 60, 65)), (48, (60, 64, 67))]
def bar_at(t): return PROG[int(t // 2) % 4]
K, SN, TOM1, TOM2, CRASH, HAT = 36, 38, 43, 41, 49, 42
S8 = 60 / 128 / 2
def ostinato(t0, t1, vel=96, high=False, sixteenth=False):
    t = t0; i = 0; step = S8 / 2 if sixteenth else S8
    while t < t1 - 1e-6:
        root, keys = bar_at(t); root += 12; pat = [root, root, root + 7, root, root + 12, root, root + 7, root]
        k = pat[i % 8]; v = vel if i % 2 == 0 else vel - 18
        note(STR, k, t, step * 0.8, v)
        if high: note(STR, k + 12, t, step * 0.75, v - 14)
        t += step; i += 1
def swell(keys, t0, dur, a, b, vel=90):
    chord(STR, keys, t0, dur, vel); ramp(STR, 11, a, b, t0, t0 + dur * 0.8)
def bass(t0, t1, vel=100, eighths=False):
    t = t0
    while t < t1 - 1e-6:
        root, keys = bar_at(t)
        if eighths:
            for j in range(8): note(BASS, root - 12, t + j * 0.25, 0.2, vel if j % 2 == 0 else vel - 22)
        else: note(BASS, root - 12, t, 0.9, vel); note(BASS, root - 12, t + 1.0, 0.9, vel - 10)
        t += 2.0
def drums(t0, t1, level):
    t = t0; i = 0
    while t < t1 - 1e-6:
        b = i % 4
        if level == 1:
            if b in (0, 2): note(DR, K, t, 0.3, 108)
        else:
            note(DR, K, t, 0.3, 118 if b in (0, 2) else 104)
            if b in (1, 3): note(DR, SN, t, 0.2, 110); note(DR, TOM1, t, 0.2, 90)
            note(DR, HAT, t + 0.25, 0.08, 46)
        t += 0.5; i += 1
def roll(t0, t1, v0=50, v1=120):
    t = t0
    while t < t1: note(DR, SN, t, 0.05, int(v0 + (v1 - v0) * (t - t0) / (t1 - t0))); t += 0.0625
def hit(t0, big=False):
    note(DR, K, t0, 0.4, 127); note(DR, TOM1, t0, 0.4, 120); note(DR, SN, t0, 0.3, 115); note(DR, CRASH, t0, 1.6 if big else 0.9, 100 if big else 70)
    root, keys = bar_at(t0); chord(STR, [k - 12 for k in keys] + list(keys), t0, 1.4 if big else 0.6, 118 if big else 100); note(BASS, root - 12, t0, 1.2, 118)
# 0–2.6 hook: warm swell + ticking hats (clock)
swell([50, 57, 62, 65], 0.1, 2.5, 40, 110, 88); note(DR, K, 0.3, 0.4, 104)
t = 0.5
while t < 2.5: note(DR, HAT, t, 0.06, 52); t += 0.25
# 2.6–5.0 timer: ostinato pulse + light drums, chip accent at 4.3
hit(2.6); ostinato(2.6, 5.0, 90); bass(2.6, 5.0, 96); drums(2.6, 5.0, 1)
note(DR, HAT, 4.3, 0.1, 80); note(STR, 86, 4.3, 0.5, 96); note(STR, 90, 4.4, 0.7, 92)
# 5.0–11.6 flow: full groove, step accents
hit(5.0); ostinato(5.0, 11.6, 96, high=True); bass(5.0, 11.6, 100, eighths=True); drums(5.0, 11.6, 2)
hit(7.2); hit(9.4)
for off, k, d in ((0.0, 74, 1.9), (2.2, 77, 1.9), (4.4, 81, 1.9), (6.4, 79, 0.2)): note(STR, k, 5.0 + off, d, 88)
# 11.6–14.0 chips
hit(11.6); ostinato(11.6, 14.0, 100, high=True, sixteenth=True); bass(11.6, 14.0, 104, eighths=True); drums(11.6, 14.0, 2)
# 14.0–16.4 no waiting: pull back, build
hit(14.0); ostinato(14.0, 16.2, 92); bass(14.0, 16.2, 96); drums(14.0, 16.2, 1)
swell([62, 65, 69, 74], 15.0, 1.4, 60, 120, 94); roll(15.5, 16.35, 50, 118)
# 16.4 end
hit(16.4, True); swell([38, 45, 50, 57, 62, 65, 69], 16.4, 3.4, 120, 20, 108); note(BASS, 38, 16.4, 2.8, 108)
# ---------- write + render ----------
tracks = {}
for tick, pr, msg in sorted(ev, key=lambda e: (e[0], e[1])): tracks.setdefault(msg.channel, []).append((tick, msg))
for ch, msgs in sorted(tracks.items()):
    tr = mido.MidiTrack(); mid.tracks.append(tr); last = 0
    if ch == 0: tr.append(mido.MetaMessage('set_tempo', tempo=mido.bpm2tempo(BPM), time=0))
    for tick, msg in msgs: msg.time = tick - last; tr.append(msg); last = tick
mid.save('score_paid.mid')
subprocess.run(['fluidsynth', '-ni', '-F', 'score_paid_raw.wav', '-r', str(SR), '-g', '0.6', '-o', 'synth.reverb.room-size=0.6', '-o', 'synth.reverb.level=0.5', '/usr/share/sounds/sf2/FluidR3_GM.sf2', 'score_paid.mid'], check=True, capture_output=True)
w = wave.open('score_paid_raw.wav'); n = w.getnframes(); raw = np.frombuffer(w.readframes(n), dtype=np.int16).reshape(-1, w.getnchannels()) / 32767.0
N = int(T * SR); orch = np.zeros((N, 2)); m_ = min(N, len(raw)); orch[:m_] = raw[:m_, :2]
fx = np.zeros(N); rng = np.random.default_rng(7); tt_ = np.arange(N) / SR
def lp(x, fc):
    b, a = butter(2, fc / (SR / 2)); return lfilter(b, a, x)
def add(sig, at):
    i = int(at * SR); j = min(N, i + len(sig)); fx[i:j] += sig[: j - i]
def impact(at, vel=1.0, dur=1.6):
    n = int(dur * SR); tt = np.arange(n) / SR; f = 44 + 70 * np.exp(-tt * 10)
    add(np.tanh(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 2.8) * 1.3) * vel * 0.5, at)
def riser(at, dur, vel=0.35):
    n = int(dur * SR); tt = np.arange(n) / SR; p = tt / dur; out = np.zeros(n); step = int(0.05 * SR); noise = rng.standard_normal(n)
    for i in range(0, n, step): out[i:i + step] = lp(noise[i:i + step], 500 + 8000 * (i / n) ** 2)
    add(out * p ** 2 * vel, at)
for h in (0.3, 2.6, 5.0, 7.2, 9.4, 11.6, 14.0, 16.4): impact(h, 0.3 if h == 16.4 else 0.16)
riser(15.0, 1.4, 0.35)
mix = orch + fx[:, None]
mix = np.tanh(mix / (np.abs(mix).max() * 0.66)); mix = mix / np.abs(mix).max() * 0.94
mix *= np.clip((T - tt_) / 0.8, 0, 1)[:, None]
with wave.open('score_paid.wav', 'wb') as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((mix * 32767).astype(np.int16).tobytes())
print('ok')
