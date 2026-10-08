"""Minimal, clean score: felt piano, warm pad, soft sub, a string swell on the big moments — nothing else for the نجم العراق launch film — the sound of product launch films: felt piano motif,
Rhodes chords, warm pad, tight electronic drums with claps and snaps, plucked arpeggio, string lift, a vibraphone
counter-melody, risers into the hits and a silent beat before the finale. 48 s, 120 BPM, D minor. Real sampled
instruments (FluidR3 GM via FluidSynth) + a light synthesised FX bed. Usage: python3 score2.py → score2.wav"""
import mido, subprocess, numpy as np, wave
from scipy.signal import butter, lfilter
BPM = 120; TPB = 480; SR = 44100; T = 48.0; B = 0.5
sec = lambda s: int(round(s / (60 / BPM) * TPB))
mid = mido.MidiFile(ticks_per_beat=TPB); ev = []
def note(ch, key, t0, dur, vel=90):
    ev.append((sec(t0), 1, mido.Message('note_on', channel=ch, note=key, velocity=int(max(1, min(127, vel))))))
    ev.append((sec(t0 + dur), 0, mido.Message('note_off', channel=ch, note=key, velocity=0)))
def chord(ch, keys, t0, dur, vel=90):
    for k in keys: note(ch, k, t0, dur, vel)
def cc(ch, num, val, t0): ev.append((sec(t0), 0, mido.Message('control_change', channel=ch, control=num, value=int(max(0, min(127, val))))))
def prog(ch, p): ev.append((0, 0, mido.Message('program_change', channel=ch, program=p)))
def ramp(ch, num, a, b, t0, t1, steps=24):
    for i in range(steps + 1): cc(ch, num, a + (b - a) * i / steps, t0 + (t1 - t0) * i / steps)
PIANO, EP, PAD, BASS, PLUCK, STR, VIB, CHOIR, LEAD = 0, 1, 2, 3, 4, 5, 6, 7, 8; DR = 9
for ch, p in ((PIANO, 0), (EP, 4), (PAD, 89), (BASS, 38), (PLUCK, 45), (STR, 48), (VIB, 11), (CHOIR, 52), (LEAD, 80)): prog(ch, p)
for ch in range(10):
    if ch != DR: cc(ch, 7, 100, 0); cc(ch, 91, 55, 0); cc(ch, 10, 64, 0)
cc(PIANO, 91, 80, 0); cc(VIB, 91, 90, 0); cc(PAD, 91, 90, 0); cc(PLUCK, 10, 44, 0); cc(VIB, 10, 84, 0); cc(EP, 10, 58, 0); cc(STR, 10, 70, 0)
cc(BASS, 7, 96, 0); cc(DR, 7, 110, 0); cc(PAD, 7, 74, 0); cc(CHOIR, 7, 60, 0)
# harmony in D minor, one bar (2 s) each: Dm — Bb — F — C
PROG = [(50, (62, 65, 69, 74)), (46, (58, 62, 65, 70)), (41, (57, 60, 65, 69)), (48, (60, 64, 67, 72))]
def bar_at(t): return PROG[int(t // 2) % 4]
K, RIM, CRASH = 36, 37, 49
cc(PAD, 7, 66, 0); cc(STR, 7, 80, 0); cc(PIANO, 7, 108, 0); cc(BASS, 7, 52, 0); cc(DR, 7, 70, 0); cc(PIANO, 91, 96, 0); cc(PAD, 91, 100, 0)
MOTIF = [(0.0, 74, 1.4), (0.5, 69, 1.0), (1.0, 77, 1.8), (2.0, 74, 1.2), (2.5, 72, 0.9), (3.0, 69, 2.0)]        # 2 bars
MOTIF2 = [(0.0, 77, 1.4), (0.5, 74, 1.0), (1.0, 81, 1.8), (2.0, 79, 1.2), (2.5, 77, 0.9), (3.0, 74, 2.0)]       # answer
def piano_phrase(t0, m=MOTIF, vel=84, low=True):
    for off, k, d in m:
        note(PIANO, k, t0 + off, d, vel)
        if low and off in (0.0, 2.0): root, keys = bar_at(t0 + off); note(PIANO, root - 12, t0 + off, 1.9, vel - 26); note(PIANO, root - 5, t0 + off + 0.02, 1.9, vel - 34)
def pad_bed(t0, t1, vel=56):
    t = t0
    while t < t1 - 1e-6:
        root, keys = bar_at(t); chord(PAD, [k - 12 for k in keys[:3]], t, 2.15, vel); t += 2.0
def sub_bed(t0, t1, vel=70):
    t = t0
    while t < t1 - 1e-6:
        root, keys = bar_at(t); note(BASS, root - 12, t, 1.9, vel); t += 2.0
def soft_pulse(t0, t1, vel=72):
    t = t0
    while t < t1 - 1e-6: note(DR, K, t, 0.3, vel); t += 1.0
# ---------- S1 0–3: piano alone ----------
piano_phrase(0.05, MOTIF, 92)
for t0 in (0.25, 0.75, 1.25, 2.0): note(DR, RIM, t0, 0.1, 64)
# ---------- 3.0: warmth arrives; hero 3–7.6 ----------
note(DR, K, 3.0, 0.4, 100); note(DR, CRASH, 3.0, 1.4, 52)
pad_bed(3.0, 17.2, 58); sub_bed(3.0, 17.2, 84)
piano_phrase(3.6, MOTIF, 86); piano_phrase(7.6, MOTIF2, 84); piano_phrase(11.6, MOTIF, 86); piano_phrase(15.6, MOTIF2, 88, low=False)
chord(STR, [62, 65, 69], 12.6, 4.6, 52); ramp(STR, 11, 30, 105, 12.6, 17.2)
for h in (7.6, 12.6): note(DR, K, h, 0.4, 96)
# ---------- 17.2–28: the pulse begins ----------
note(DR, K, 17.2, 0.4, 110); note(DR, CRASH, 17.2, 1.6, 60)
pad_bed(17.2, 28.0, 66); sub_bed(17.2, 28.0, 92); soft_pulse(17.2, 28.0, 70)
chord(STR, [62, 65, 69, 74], 17.2, 10.8, 62)
piano_phrase(17.2, MOTIF, 92); piano_phrase(21.2, MOTIF2, 92); piano_phrase(25.2, MOTIF, 90)
for h in (21.0, 24.4, 25.6, 26.8): note(DR, K, h, 0.4, 100); note(DR, RIM, h, 0.1, 70)
# ---------- 28–30.8: breath — piano + pad only ----------
note(DR, K, 28.0, 0.4, 104); note(DR, CRASH, 28.0, 1.4, 50)
chord(PAD, [50, 57, 62, 69], 28.2, 2.8, 62)
for off, k, d in ((0.3, 86, 1.2), (0.8, 81, 1.0), (1.3, 77, 1.4), (1.9, 74, 1.8)): note(PIANO, k, 28.0 + off, d, 88)
note(BASS, 38, 28.0, 2.7, 60)
chord(STR, [62, 65, 69, 74], 29.4, 1.5, 60); ramp(STR, 11, 30, 110, 29.4, 30.8)
# ---------- 30.8–41.2: pulse again, strings carry the melody ----------
note(DR, K, 30.8, 0.4, 104)
pad_bed(30.8, 40.9, 66); sub_bed(30.8, 40.9, 92); soft_pulse(30.8, 40.9, 70)
chord(STR, [62, 65, 69, 74], 30.8, 10.0, 64)
piano_phrase(30.8, MOTIF, 92); piano_phrase(34.8, MOTIF2, 92); piano_phrase(38.8, MOTIF, 90, low=False)
for off, k, d in ((0.0, 86, 1.9), (2.0, 84, 1.9), (4.0, 81, 1.9), (6.0, 79, 1.9), (8.0, 81, 2.4)): note(STR, k, 30.8 + off, d, 78)
for h in (33.0, 37.6): note(DR, K, h, 0.4, 100); note(DR, RIM, h, 0.1, 70)
chord(STR, [62, 65, 69, 74, 81], 39.4, 1.5, 70); ramp(STR, 11, 40, 120, 39.4, 40.9)
# 40.9–41.2 silence → ---------- 41.2 finale ----------
note(DR, K, 41.2, 0.5, 116); note(DR, CRASH, 41.2, 2.0, 66)
chord(PAD, [50, 57, 62, 69, 74], 41.2, 6.8, 76); chord(STR, [62, 65, 69, 74, 81], 41.2, 6.5, 84); ramp(STR, 11, 120, 25, 44.5, 48.0); ramp(PAD, 11, 120, 25, 44.5, 48.0)
note(BASS, 38, 41.2, 3.2, 96); chord(PIANO, [38, 45, 50, 57, 62, 65, 69], 41.2, 4.0, 96)
for h in (42.2, 42.9): note(DR, K, h, 0.4, 104); chord(PIANO, [62, 65, 69, 74], h, 0.9, 92)
for off, k, d in ((2.4, 86, 1.6), (3.1, 81, 1.4), (3.8, 77, 1.8), (4.8, 74, 2.6)): note(PIANO, k, 41.2 + off, d, 76)
# ---------- write MIDI + render ----------
tracks = {}
for tick, pr, msg in sorted(ev, key=lambda e: (e[0], e[1])): tracks.setdefault(msg.channel, []).append((tick, msg))
for ch, msgs in sorted(tracks.items()):
    tr = mido.MidiTrack(); mid.tracks.append(tr); last = 0
    if ch == 0: tr.append(mido.MetaMessage('set_tempo', tempo=mido.bpm2tempo(BPM), time=0))
    for tick, msg in msgs: msg.time = tick - last; tr.append(msg); last = tick
mid.save('score3.mid')
subprocess.run(['fluidsynth', '-ni', '-F', 'score3_raw.wav', '-r', str(SR), '-g', '0.6', '-o', 'synth.reverb.room-size=0.6', '-o', 'synth.reverb.damp=0.4', '-o', 'synth.reverb.width=0.8', '-o', 'synth.reverb.level=0.5', '-o', 'synth.chorus.active=1', '/usr/share/sounds/sf2/FluidR3_GM.sf2', 'score3.mid'], check=True, capture_output=True)
w = wave.open('score3_raw.wav'); n = w.getnframes(); raw = np.frombuffer(w.readframes(n), dtype=np.int16).reshape(-1, w.getnchannels()) / 32767.0
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
def sub(at, f=36.7, dur=1.2, vel=0.5):
    n = int(dur * SR); tt = np.arange(n) / SR; add(np.sin(2 * np.pi * f * tt) * np.exp(-tt * 3) * vel, at)
BIG = (3.0, 17.2, 28.0, 41.2)
for h in (0.25, 0.75, 1.25, 2.0, 3.0, 7.6, 12.6, 17.2, 21.0, 24.4, 25.6, 26.8, 28.0, 33.0, 37.6, 41.2, 42.2, 42.9): impact(h, 0.25 if h in BIG else (0.06 if h < 2.5 else 0.12))
for h in BIG: sub(h, 36.7, 1.6, 0.1)
riser(15.2, 2.0, 0.22); riser(29.3, 1.5, 0.16); riser(39.0, 2.1, 0.26)
mix = orch + fx[:, None]
gap = np.ones(N); i0, i1 = int(40.9 * SR), int(41.2 * SR); gap[i0:i0 + 900] = np.linspace(1, 0.02, 900); gap[i0 + 900:i1] = 0.02; mix *= gap[:, None]
mix = np.tanh(mix / (np.abs(mix).max() * 0.66)); mix = mix / np.abs(mix).max() * 0.94
mix *= np.clip((T - tt_) / 0.8, 0, 1)[:, None]
with wave.open('score3.wav', 'wb') as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((mix * 32767).astype(np.int16).tobytes())
print('ok', len(ev))
