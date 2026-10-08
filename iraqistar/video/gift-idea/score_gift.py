"""Score for the gift-idea Reel (22 s): the same three voices as the launch film — strings ostinato, cinematic drums,
synth bass — cut to this timeline. Real sampled instruments via FluidSynth + light FX bed."""
import mido, subprocess, numpy as np, wave
from scipy.signal import butter, lfilter
BPM = 120; TPB = 480; SR = 44100; T = 22.0
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
# 0–1.6 question: swell + pulse
swell([50, 57, 62], 0.1, 1.6, 40, 110, 88); note(DR, K, 0.3, 0.4, 110); drums(0.5, 1.6, 1)
# items 1.6–6.6: ostinato + stamps on hits
ostinato(1.6, 6.6, 92); bass(1.6, 6.6, 100); drums(1.6, 6.6, 1)
for h in (2.4, 4.0, 5.6): hit(h)
# but 6.6–9.6: strings only, building
swell([62, 65, 69], 6.6, 3.0, 40, 120, 90); note(BASS, 38, 6.6, 2.9, 90); roll(8.6, 9.55, 40, 120)
# big 9.6–11.6
hit(9.6, True); ostinato(9.6, 11.6, 104, high=True, sixteenth=True); bass(9.6, 11.6, 108, eighths=True); drums(9.6, 11.6, 2)
# phone 11.6–18.6 full
hit(11.6); ostinato(11.6, 18.4, 104, high=True, sixteenth=True); bass(11.6, 18.4, 108, eighths=True); drums(11.6, 18.4, 2)
for off, k, d in ((0.0, 86, 1.9), (2.0, 84, 1.9), (4.0, 81, 1.9), (6.0, 79, 0.8)): note(STR, k, 11.6 + off, d, 92)
hit(16.0)
swell([62, 65, 69, 74], 17.2, 1.4, 60, 125, 96); roll(17.4, 18.55, 56, 127)
# end 18.6
hit(18.6, True); swell([38, 45, 50, 57, 62, 65, 69], 18.6, 3.3, 120, 20, 110); note(BASS, 38, 18.6, 2.6, 110)
# ---------- write + render ----------
tracks = {}
for tick, pr, msg in sorted(ev, key=lambda e: (e[0], e[1])): tracks.setdefault(msg.channel, []).append((tick, msg))
for ch, msgs in sorted(tracks.items()):
    tr = mido.MidiTrack(); mid.tracks.append(tr); last = 0
    if ch == 0: tr.append(mido.MetaMessage('set_tempo', tempo=mido.bpm2tempo(BPM), time=0))
    for tick, msg in msgs: msg.time = tick - last; tr.append(msg); last = tick
mid.save('score_gift.mid')
subprocess.run(['fluidsynth', '-ni', '-F', 'score_gift_raw.wav', '-r', str(SR), '-g', '0.6', '-o', 'synth.reverb.room-size=0.6', '-o', 'synth.reverb.level=0.5', '/usr/share/sounds/sf2/FluidR3_GM.sf2', 'score_gift.mid'], check=True, capture_output=True)
w = wave.open('score_gift_raw.wav'); n = w.getnframes(); raw = np.frombuffer(w.readframes(n), dtype=np.int16).reshape(-1, w.getnchannels()) / 32767.0
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
for h in (0.3, 2.4, 4.0, 5.6, 9.6, 11.6, 16.0, 18.6): impact(h, 0.35 if h in (9.6, 18.6) else 0.2)
riser(7.8, 1.8, 0.4); riser(17.0, 1.6, 0.45)
mix = orch + fx[:, None]
mix = np.tanh(mix / (np.abs(mix).max() * 0.66)); mix = mix / np.abs(mix).max() * 0.94
mix *= np.clip((T - tt_) / 0.8, 0, 1)[:, None]
with wave.open('score_gift.wav', 'wb') as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((mix * 32767).astype(np.int16).tobytes())
print('ok')
