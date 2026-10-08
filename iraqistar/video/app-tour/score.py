"""Orchestral-hybrid trailer score for the نجم العراق launch film (48 s, 120 BPM, D minor), written as MIDI and rendered
with real sampled instruments (FluidR3 GM soundfont via FluidSynth), then layered with a light synthesised FX bed
(impacts, risers, ticks) and mastered. Usage: python3 score.py → score.wav"""
import mido, subprocess, numpy as np, wave
from scipy.signal import butter, lfilter, fftconvolve
BPM = 120; TPB = 480; SR = 44100; T = 48.0
sec = lambda s: int(round(s / (60 / BPM) * TPB))          # seconds → ticks
mid = mido.MidiFile(ticks_per_beat=TPB)
ev = []                                                    # (tick, priority, message)
def note(ch, key, t0, dur, vel=90):
    ev.append((sec(t0), 1, mido.Message('note_on', channel=ch, note=key, velocity=int(vel))))
    ev.append((sec(t0 + dur), 0, mido.Message('note_off', channel=ch, note=key, velocity=0)))
def chord(ch, keys, t0, dur, vel=90):
    for k in keys: note(ch, k, t0, dur, vel)
def cc(ch, num, val, t0): ev.append((sec(t0), 0, mido.Message('control_change', channel=ch, control=num, value=int(val))))
def prog(ch, p): ev.append((0, 0, mido.Message('program_change', channel=ch, program=p)))
def ramp(ch, num, a, b, t0, t1, steps=24):
    for i in range(steps + 1): cc(ch, num, a + (b - a) * i / steps, t0 + (t1 - t0) * i / steps)
# channels
STR, BASS, TIMP, HORN, CHOIR, PIANO, HIT, TREM, BRASS, HIGH = 0, 1, 2, 3, 4, 5, 6, 7, 8, 10; DR = 9
for ch, p in ((STR, 48), (BASS, 43), (TIMP, 47), (HORN, 60), (CHOIR, 52), (PIANO, 0), (HIT, 55), (TREM, 44), (BRASS, 61), (HIGH, 48)): prog(ch, p)
for ch in range(11):
    if ch != DR: cc(ch, 7, 110, 0); cc(ch, 91, 70 if ch in (CHOIR, HORN, PIANO, HIT) else 40, 0); cc(ch, 10, 64, 0)
cc(STR, 10, 50, 0); cc(HIGH, 10, 78, 0); cc(BASS, 10, 60, 0); cc(TREM, 10, 70, 0)
# harmony (D minor): Dm Bb F A  — one bar (2 s) each
PROG = [("Dm", 50, (50, 53, 57, 62)), ("Bb", 46, (46, 50, 53, 58)), ("F", 41, (41, 45, 48, 53)), ("A", 45, (45, 49, 52, 57))]
def bar_at(t): return PROG[int(t // 2) % 4]
B = 0.5
# ---------- S1 0–3: piano motif + timpani hits ----------
for i, (t0, k) in enumerate(((0.05, 74), (0.55, 69), (1.05, 65), (1.85, 62))): note(PIANO, k, t0, 1.6, 78 - i * 4)
for t0 in (0.25, 0.75, 1.25, 2.0):
    note(TIMP, 38, t0, 0.5, 118); note(DR, 41, t0, 0.3, 120); note(DR, 36, t0, 0.3, 110)
note(DR, 49, 2.0, 1.0, 70)
# ---------- 3.0 BIG hit + hero (3–7.6) ----------
def big_hit(t0, keys, hold=2.2):
    chord(HORN, keys, t0, hold, 118); chord(BRASS, [k - 12 for k in keys[:2]], t0, hold * 0.6, 120)
    note(TIMP, 38, t0, 0.8, 127); note(TIMP, 38, t0 + 0.02, 0.8, 110); note(DR, 49, t0, 1.5, 112); note(DR, 36, t0, 0.4, 127); note(DR, 41, t0, 0.5, 127)
    note(HIT, 50, t0, 0.5, 100)
big_hit(3.0, [50, 57, 62, 65])
chord(CHOIR, [50, 57, 62, 65], 3.0, 4.6, 80); ramp(CHOIR, 11, 60, 110, 3.0, 6.0)
chord(STR, [38, 45, 50, 57], 3.2, 4.4, 70); ramp(STR, 11, 50, 100, 3.2, 7.4)
for t0, k in ((4.0, 74), (4.5, 77), (5.0, 81), (6.0, 79), (6.5, 77), (7.0, 74)): note(PIANO, k, t0, 1.2, 74)
# ---------- 7.6–12.6 exploded UI: ostinato starts ----------
def small_hit(t0, keys):
    chord(HORN, keys, t0, 0.9, 100); note(TIMP, 38, t0, 0.5, 110); note(DR, 49, t0, 1.0, 80); note(DR, 41, t0, 0.3, 110)
def ostinato(t0, t1, vel=88, high=False, brass=False):
    t = t0
    while t < t1 - 1e-6:
        name, root, keys = bar_at(t); pos = int(round((t - t0) / (B / 2))) % 8
        pat = [root + 12, root + 12, root + 19, root + 12, root + 12, root + 24, root + 19, root + 12]
        k = pat[pos]; v = vel if pos % 2 == 0 else vel - 14
        note(STR, k, t, B * 0.42, v)
        if high: note(HIGH, k + 12, t, B * 0.4, v - 10)
        if pos % 2 == 0: note(BASS, root, t, B * 0.8, vel)
        t += B / 2
def timpani(t0, t1, every=1.0, vel=104):
    t = t0
    while t < t1 - 1e-6:
        note(TIMP, bar_at(t)[1] - 12 if bar_at(t)[1] >= 45 else bar_at(t)[1], t, 0.5, vel); note(DR, 36, t, 0.3, vel - 6); t += every
def ticks(t0, t1, div=2, vel=52):
    t = t0
    while t < t1 - 1e-6: note(DR, 42, t, 0.1, vel); t += B / div
small_hit(7.6, [50, 57, 62]); ostinato(7.6, 12.6, 80); timpani(7.6, 12.6, 1.0, 96); ticks(7.6, 12.6, 2, 48)
chord(CHOIR, [50, 57, 62], 7.6, 5.0, 60)
# ---------- 12.6–17.2 macro dive: build ----------
small_hit(12.6, [46, 53, 58]); ostinato(12.6, 17.2, 92); timpani(12.6, 17.2, 1.0, 104); ticks(12.6, 17.2, 4, 46)
chord(CHOIR, [46, 53, 58, 62], 12.6, 4.6, 70)
chord(TREM, [62, 65, 69], 15.2, 2.0, 60); ramp(TREM, 11, 20, 127, 15.2, 17.2)
t = 15.7
while t < 17.15: note(DR, 38, t, 0.05, int(60 + 60 * (t - 15.7) / 1.5)); t += 0.0625
# ---------- 17.2–28 drive ----------
big_hit(17.2, [50, 57, 62, 65])
ostinato(17.2, 28.0, 104, high=True); timpani(17.2, 28.0, 0.5, 108); ticks(17.2, 28.0, 4, 56)
chord(CHOIR, [50, 57, 62, 65], 17.2, 10.8, 78)
t = 17.2
while t < 28.0:
    name, root, keys = bar_at(t)
    chord(BRASS, [root + 12, root + 19], t, 0.35, 108); chord(BRASS, [root + 12, root + 19], t + 1.0, 0.3, 96); chord(BRASS, [root + 12, root + 19], t + 1.5, 0.25, 100)
    note(DR, 43, t + 1.0, 0.3, 112); note(DR, 41, t + 1.5, 0.3, 112); note(DR, 38, t + 1.0, 0.2, 100); note(DR, 38, t + 1.5, 0.2, 90)
    t += 2.0
for h in (21.0, 24.4, 25.6, 26.8): note(HIT, 50, h, 0.6, 105); note(DR, 49, h, 1.0, 85); note(TIMP, 38, h, 0.5, 118)
# ---------- 28–30.8 break ----------
big_hit(28.0, [50, 57, 62, 65], 1.6)
chord(CHOIR, [50, 57, 62, 65, 69], 28.2, 2.8, 84)
for i, (t0, k) in enumerate(((28.4, 74), (28.9, 77), (29.4, 81), (29.9, 86), (30.3, 81))): note(PIANO, k, t0, 1.4, 80)
chord(TREM, [62, 65, 69, 74], 29.4, 1.5, 70); ramp(TREM, 11, 30, 127, 29.4, 30.8)
# ---------- 30.8–41.2 drive 2 with horn melody ----------
small_hit(30.8, [50, 57, 62]); ostinato(30.8, 40.9, 108, high=True); timpani(30.8, 40.9, 0.5, 110); ticks(30.8, 40.9, 4, 58)
chord(CHOIR, [50, 57, 62, 65], 30.8, 10.0, 80)
t = 30.8
while t < 40.8:
    name, root, keys = bar_at(t)
    chord(BRASS, [root + 12, root + 19], t, 0.35, 110); chord(BRASS, [root + 12, root + 19], t + 1.0, 0.3, 98); chord(BRASS, [root + 12, root + 19], t + 1.5, 0.25, 102)
    note(DR, 43, t + 1.0, 0.3, 114); note(DR, 41, t + 1.5, 0.3, 114); note(DR, 38, t + 1.0, 0.2, 104); note(DR, 38, t + 1.5, 0.2, 92)
    t += 2.0
MEL = [(30.8, 62, 1.5), (32.4, 65, 0.5), (32.9, 69, 1.4), (34.8, 67, 0.5), (35.3, 65, 0.5), (35.8, 64, 1.6), (37.6, 62, 0.8), (38.4, 65, 0.8), (39.2, 69, 1.6)]
for t0, k, d in MEL: note(HORN, k + 12, t0, d, 112); note(HORN, k, t0, d, 96)
for h in (33.0, 37.6): note(HIT, 50, h, 0.6, 105); note(DR, 49, h, 1.0, 85)
chord(TREM, [62, 65, 69, 74], 39.2, 1.7, 70); ramp(TREM, 11, 30, 127, 39.2, 40.9)
t = 39.4
while t < 40.85: note(DR, 38, t, 0.05, int(64 + 63 * (t - 39.4) / 1.45)); t += 0.0625
# 40.9–41.2 silence (nothing scheduled) → ---------- 41.2 finale ----------
big_hit(41.2, [50, 57, 62, 65, 74], 3.0); chord(CHOIR, [50, 57, 62, 65, 74], 41.2, 6.8, 96); ramp(CHOIR, 11, 127, 40, 44.5, 48.0)
chord(STR, [38, 45, 50, 57, 62], 41.2, 6.5, 100); ramp(STR, 11, 120, 30, 44.5, 48.0)
for h in (42.2, 42.9): chord(BRASS, [50, 57, 62], h, 0.5, 118); note(TIMP, 38, h, 0.5, 122); note(DR, 41, h, 0.3, 120); note(DR, 49, h, 0.8, 90)
for t0, k in ((43.6, 74), (44.3, 69), (45.0, 65), (46.0, 62)): note(PIANO, k, t0, 2.0, 72)
t = 44.0
while t < 47.5: note(TIMP, 38, t, 0.1, int(70 - 40 * (t - 44) / 3.5)); t += 0.125
# ---------- write MIDI ----------
tracks = {}
for tick, pr, msg in sorted(ev, key=lambda e: (e[0], e[1])):
    tracks.setdefault(msg.channel, []).append((tick, msg))
for ch, msgs in sorted(tracks.items()):
    tr = mido.MidiTrack(); mid.tracks.append(tr); last = 0
    if ch == 0: tr.append(mido.MetaMessage('set_tempo', tempo=mido.bpm2tempo(BPM), time=0))
    for tick, msg in msgs: msg.time = tick - last; tr.append(msg); last = tick
mid.save('score.mid')
subprocess.run(['fluidsynth', '-ni', '-F', 'score_raw.wav', '-r', str(SR), '-g', '0.55', '-o', 'synth.reverb.room-size=0.8', '-o', 'synth.reverb.damp=0.3', '-o', 'synth.reverb.width=0.9', '-o', 'synth.reverb.level=0.7', '/usr/share/sounds/sf2/FluidR3_GM.sf2', 'score.mid'], check=True, capture_output=True)
# ---------- FX bed (synth): impacts, risers, sub booms, silence gap, master ----------
w = wave.open('score_raw.wav'); n = w.getnframes(); raw = np.frombuffer(w.readframes(n), dtype=np.int16).reshape(-1, w.getnchannels()) / 32767.0
N = int(T * SR); orch = np.zeros((N, 2)); m_ = min(N, len(raw)); orch[:m_] = raw[:m_, :2] if raw.shape[1] >= 2 else np.repeat(raw[:m_], 2, axis=1)
fx = np.zeros(N); rng = np.random.default_rng(5); tt_ = np.arange(N) / SR
def lp(x, fc):
    b, a = butter(2, fc / (SR / 2)); return lfilter(b, a, x)
def add(sig, at):
    i = int(at * SR); j = min(N, i + len(sig)); fx[i:j] += sig[: j - i]
def impact(at, vel=1.0, dur=2.0):
    n = int(dur * SR); tt = np.arange(n) / SR; f = 42 + 80 * np.exp(-tt * 9)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 2.4); crash = lp(rng.standard_normal(n), 3500) * np.exp(-tt * 4) * 0.25
    add(np.tanh((body * 0.7 + crash) * 1.4) * vel * 0.6, at)
def riser(at, dur, vel=0.4):
    n = int(dur * SR); tt = np.arange(n) / SR; p = tt / dur; out = np.zeros(n); step = int(0.05 * SR); noise = rng.standard_normal(n)
    for i in range(0, n, step): out[i:i + step] = lp(noise[i:i + step], 400 + 9000 * (i / n) ** 2)
    add((out * 0.6 + np.sin(2 * np.pi * np.cumsum(110 * 2 ** (p * 2)) / SR) * 0.3) * p ** 1.8 * vel, at)
def downlifter(at, dur=1.2, vel=0.22):
    n = int(dur * SR); tt = np.arange(n) / SR; p = tt / dur
    add(np.sin(2 * np.pi * np.cumsum(600 * 0.25 ** p) / SR) * (1 - p) ** 2 * vel * 0.4 + lp(rng.standard_normal(n), 1500) * (1 - p) ** 3 * vel * 0.3, at)
HITS = [0.25, 0.75, 1.25, 2.0, 3.0, 7.6, 12.6, 17.2, 21.0, 24.4, 25.6, 26.8, 28.0, 33.0, 37.6, 41.2, 42.2, 42.9]
BIG = (3.0, 17.2, 28.0, 41.2)
for h in HITS: impact(h, 1.0 if h in BIG else 0.5)
for h in BIG: downlifter(h + 0.1)
riser(15.2, 2.0, 0.5); riser(29.2, 1.6, 0.4); riser(39.0, 2.1, 0.55)
mix = orch * 1.0 + fx[:, None] * 0.9
gap = np.ones(N); i0, i1 = int(40.9 * SR), int(41.2 * SR); gap[i0:i0 + 900] = np.linspace(1, 0.02, 900); gap[i0 + 900:i1] = 0.02; mix *= gap[:, None]
mix = np.tanh(mix / (np.abs(mix).max() * 0.62)); mix = mix / np.abs(mix).max() * 0.94
mix *= np.clip((T - tt_) / 0.8, 0, 1)[:, None]
with wave.open('score.wav', 'wb') as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((mix * 32767).astype(np.int16).tobytes())
print('ok', T, len(ev))
