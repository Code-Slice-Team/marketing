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
# Three voices only: strings (ostinato + swells), cinematic drums, synth bass. 128 BPM feel over the film's hit points.
PROG = [(50, (62, 65, 69)), (46, (58, 62, 65)), (41, (57, 60, 65)), (48, (60, 64, 67))]
def bar_at(t): return PROG[int(t // 2) % 4]
K, SN, TOM1, TOM2, CRASH, HAT = 36, 38, 43, 41, 49, 42
S8 = 60 / 128 / 2   # one 8th note at 128 BPM
cc(STR, 7, 118, 0); cc(STR, 91, 60, 0); cc(BASS, 7, 46, 0); cc(DR, 7, 86, 0); cc(DR, 91, 50, 0)
def ostinato(t0, t1, vel=96, high=False, sixteenth=False):
    t = t0; i = 0; step = S8 / 2 if sixteenth else S8
    while t < t1 - 1e-6:
        root, keys = bar_at(t); root = root + 12; pat = [root, root, root + 7, root, root + 12, root, root + 7, root]
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
            if b == 3: note(DR, TOM2, t + 0.25, 0.2, 80)
        else:
            note(DR, K, t, 0.3, 118 if b in (0, 2) else 104)
            if b in (1, 3): note(DR, SN, t, 0.2, 110); note(DR, TOM1, t, 0.2, 90)
            note(DR, HAT, t + 0.25, 0.08, 46)
            if level >= 3:
                note(DR, K, t + 0.375, 0.2, 84) if b in (1, 3) else None
                note(DR, TOM2, t + 0.75, 0.15, 70) if b == 3 else None
        t += 0.5; i += 1
def roll(t0, t1, v0=50, v1=120):
    t = t0
    while t < t1: note(DR, SN, t, 0.05, int(v0 + (v1 - v0) * (t - t0) / (t1 - t0))); t += 0.0625
def hit(t0, big=False):
    note(DR, K, t0, 0.4, 127); note(DR, TOM1, t0, 0.4, 120); note(DR, SN, t0, 0.3, 115); note(DR, CRASH, t0, 1.6 if big else 0.9, 100 if big else 70)
    root, keys = bar_at(t0); chord(STR, [k - 12 for k in keys] + list(keys), t0, 1.4 if big else 0.6, 118 if big else 100); note(BASS, root - 12, t0, 1.2, 118)
# ---------- 0–3: four drum strikes + string stabs ----------
for i, t0 in enumerate((0.25, 0.75, 1.25, 2.0)): note(DR, K, t0, 0.3, 120); note(DR, TOM1, t0, 0.3, 110); chord(STR, [50, 57, 62], t0, 0.35, 100 + i * 6)
swell([38, 45, 50], 2.0, 1.1, 40, 120, 90); roll(2.3, 2.95, 40, 110)
# ---------- 3.0 hit → 3–7.6: pulse + long strings ----------
hit(3.0, True); ostinato(3.4, 7.6, 80); bass(3.0, 7.6, 96); drums(3.0, 7.6, 1); swell([62, 65, 69], 3.2, 4.4, 40, 100, 80)
# ---------- 7.6–17.2: ostinato drive builds ----------
hit(7.6); ostinato(7.6, 12.6, 92); bass(7.6, 12.6, 100); drums(7.6, 12.6, 2)
hit(12.6); ostinato(12.6, 17.2, 100, high=True); bass(12.6, 17.2, 104, eighths=True); drums(12.6, 17.2, 2)
swell([62, 65, 69, 74], 14.6, 2.6, 40, 120, 90); roll(15.7, 17.15)
# ---------- 17.2–28: full ----------
hit(17.2, True); ostinato(17.2, 28.0, 106, high=True, sixteenth=True); bass(17.2, 28.0, 108, eighths=True); drums(17.2, 28.0, 3)
swell([74, 77, 81], 17.2, 10.8, 80, 100, 70)
for h in (21.0, 24.4, 25.6, 26.8): hit(h)
# ---------- 28–30.8: breath — strings only ----------
hit(28.0, True); swell([50, 57, 62, 69], 28.2, 2.6, 60, 110, 84); note(BASS, 38, 28.0, 2.6, 96); roll(29.6, 30.75, 40, 120)
# ---------- 30.8–41.2: full, higher ----------
hit(30.8); ostinato(30.8, 40.9, 108, high=True, sixteenth=True); bass(30.8, 40.9, 110, eighths=True); drums(30.8, 40.9, 3)
for off, k, d in ((0.0, 86, 1.9), (2.0, 84, 1.9), (4.0, 81, 1.9), (6.0, 79, 1.9), (8.0, 81, 2.4)): note(STR, k, 30.8 + off, d, 96); note(STR, k - 12, 30.8 + off, d, 80)
for h in (33.0, 37.6): hit(h)
swell([62, 65, 69, 74, 81], 39.2, 1.7, 50, 125, 96); roll(39.4, 40.85, 56, 127)
# 40.9–41.2 silence → ---------- 41.2 finale ----------
hit(41.2, True); swell([38, 45, 50, 57, 62, 65, 69, 74], 41.2, 6.6, 120, 20, 110); note(BASS, 38, 41.2, 3.0, 112)
for h in (42.2, 42.9): note(DR, K, h, 0.4, 120); note(DR, TOM1, h, 0.4, 110); chord(STR, [62, 65, 69, 74], h, 0.5, 110)
for t0 in (44.0, 45.0, 46.0): note(DR, K, t0, 0.3, 80 - int((t0 - 44) * 15))
# ---------- write MIDI + render ----------
tracks = {}
for tick, pr, msg in sorted(ev, key=lambda e: (e[0], e[1])): tracks.setdefault(msg.channel, []).append((tick, msg))
for ch, msgs in sorted(tracks.items()):
    tr = mido.MidiTrack(); mid.tracks.append(tr); last = 0
    if ch == 0: tr.append(mido.MetaMessage('set_tempo', tempo=mido.bpm2tempo(BPM), time=0))
    for tick, msg in msgs: msg.time = tick - last; tr.append(msg); last = tick
mid.save('score4.mid')
subprocess.run(['fluidsynth', '-ni', '-F', 'score4_raw.wav', '-r', str(SR), '-g', '0.6', '-o', 'synth.reverb.room-size=0.6', '-o', 'synth.reverb.damp=0.4', '-o', 'synth.reverb.width=0.8', '-o', 'synth.reverb.level=0.5', '-o', 'synth.chorus.active=1', '/usr/share/sounds/sf2/FluidR3_GM.sf2', 'score4.mid'], check=True, capture_output=True)
w = wave.open('score4_raw.wav'); n = w.getnframes(); raw = np.frombuffer(w.readframes(n), dtype=np.int16).reshape(-1, w.getnchannels()) / 32767.0
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
for h in (0.25, 0.75, 1.25, 2.0, 3.0, 7.6, 12.6, 17.2, 21.0, 24.4, 25.6, 26.8, 28.0, 33.0, 37.6, 41.2, 42.2, 42.9): impact(h, 0.35 if h in BIG else (0.1 if h < 2.5 else 0.2))
for h in BIG: sub(h, 36.7, 1.6, 0.12)
riser(15.2, 2.0, 0.4); riser(29.3, 1.5, 0.3); riser(39.0, 2.1, 0.45)
mix = orch + fx[:, None]
gap = np.ones(N); i0, i1 = int(40.9 * SR), int(41.2 * SR); gap[i0:i0 + 900] = np.linspace(1, 0.02, 900); gap[i0 + 900:i1] = 0.02; mix *= gap[:, None]
mix = np.tanh(mix / (np.abs(mix).max() * 0.66)); mix = mix / np.abs(mix).max() * 0.94
mix *= np.clip((T - tt_) / 0.8, 0, 1)[:, None]
with wave.open('score4.wav', 'wb') as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((mix * 32767).astype(np.int16).tobytes())
print('ok', len(ev))
