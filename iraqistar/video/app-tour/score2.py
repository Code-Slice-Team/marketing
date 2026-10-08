"""Modern cinematic-pop score for the نجم العراق launch film — the sound of product launch films: felt piano motif,
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
# harmony in D minor, one bar (2 s) each: Dm — Bb — F — C   (the "pop-cinematic" loop)
PROG = [(50, (62, 65, 69, 74)), (46, (58, 62, 65, 70)), (41, (57, 60, 65, 69)), (48, (60, 64, 67, 72))]
def bar_at(t): return PROG[int(t // 2) % 4]
K, CLAP, RIM, HAT, OHAT, SHK, CRASH, SN = 36, 39, 37, 42, 46, 82, 49, 38
MOTIF = [(0.0, 74, 1.4), (0.5, 69, 1.0), (1.0, 77, 1.6), (2.0, 74, 1.2), (2.5, 72, 0.8), (3.0, 69, 1.8)]     # piano, 2 bars
# ---------- S1 0–3: felt piano + snaps + sub ----------
for off, k, d in MOTIF[:4]: note(PIANO, k, off + 0.05, d, 96); note(PIANO, k - 12, off + 0.05, d, 70)
for i, t0 in enumerate((0.25, 0.75, 1.25, 2.0)): note(DR, RIM, t0, 0.1, 100); note(DR, K, t0, 0.3, 80 + i * 6)
chord(PAD, [62, 69, 74], 0.0, 3.4, 40); ramp(PAD, 11, 30, 90, 0.0, 3.0)
# ---------- 3.0 hit + hero 3–7.6 (soft groove, half-time) ----------
def hit(t0, big=False):
    note(DR, K, t0, 0.4, 127); note(DR, CLAP, t0, 0.2, 110 if big else 90); note(DR, CRASH, t0, 1.2, 96 if big else 70)
    root, keys = bar_at(t0); chord(EP, keys, t0, 1.5 if big else 0.8, 100 if big else 84); note(BASS, root - 12, t0, 0.9, 110)
hit(3.0, True)
def pad_bed(t0, t1, vel=60):
    t = t0
    while t < t1 - 1e-6:
        root, keys = bar_at(t); chord(PAD, [k - 12 for k in keys[:3]], t, 2.1, vel); t += 2.0
def ep_bed(t0, t1, vel=78, rhythm=False):
    t = t0
    while t < t1 - 1e-6:
        root, keys = bar_at(t)
        if rhythm: chord(EP, keys, t, 0.7, vel); chord(EP, keys, t + 1.0, 0.45, vel - 10); chord(EP, keys, t + 1.5, 0.45, vel - 6)
        else: chord(EP, keys, t, 1.9, vel)
        t += 2.0
def drums(t0, t1, level):
    t = t0
    while t < t1 - 1e-6:
        beat = int(round((t - t0) / B)) % 4
        if level == 1:
            if beat in (0, 2): note(DR, K, t, 0.3, 104)
            if beat in (1, 3): note(DR, RIM, t, 0.1, 70)
            note(DR, HAT, t + B / 2, 0.1, 50)
        else:
            note(DR, K, t, 0.3, 112 if beat in (0, 2) else 100)
            if beat in (1, 3): note(DR, CLAP, t, 0.2, 100); note(DR, SN, t, 0.15, 60)
            note(DR, HAT, t, 0.1, 62); note(DR, HAT, t + B / 2, 0.1, 48)
            if level >= 3:
                note(DR, SHK, t + B / 4, 0.08, 40); note(DR, SHK, t + 3 * B / 4, 0.08, 46)
                if beat == 3: note(DR, OHAT, t + B / 2, 0.25, 58)
        t += B
def bassline(t0, t1, vel=104):
    t = t0
    while t < t1 - 1e-6:
        root, keys = bar_at(t); r = root - 12
        for off, d, v in ((0, 0.45, vel), (0.5, 0.2, vel - 20), (0.75, 0.2, vel - 16), (1.0, 0.45, vel - 6), (1.5, 0.45, vel - 10)): note(BASS, r, t + off, d, v)
        t += 2.0
def arp(t0, t1, vel=76):
    t = t0
    while t < t1 - 1e-6:
        root, keys = bar_at(t); seq = [keys[0], keys[1], keys[2], keys[3], keys[2], keys[1]] * 2 + [keys[0], keys[2], keys[3], keys[2]]
        for i, k in enumerate(seq): note(PLUCK, k + 12, t + i * B / 4, 0.2, vel - (0 if i % 4 == 0 else 12))
        t += 2.0
pad_bed(3.0, 7.6, 66); ep_bed(3.4, 7.6, 70); drums(3.5, 7.6, 1)
for off, k, d in MOTIF: note(PIANO, k, 3.6 + off, d, 76)
note(BASS, 38, 3.5, 1.6, 96); note(BASS, 34, 5.5, 1.6, 96)
# ---------- 7.6–17.2 groove builds ----------
hit(7.6); pad_bed(7.6, 17.2, 62); ep_bed(7.6, 17.2, 80, rhythm=True); drums(7.6, 12.6, 2); bassline(7.6, 17.2)
hit(12.6); drums(12.6, 17.2, 3)
for i in range(2):
    for off, k, d in MOTIF: note(PIANO, k, 7.6 + i * 4 + off, d, 72)
chord(STR, [62, 65, 69], 12.6, 4.6, 60); ramp(STR, 11, 40, 110, 12.6, 17.2)
chord(CHOIR, [50, 57, 62], 14.6, 2.6, 60); ramp(CHOIR, 11, 20, 100, 14.6, 17.2)
t = 15.7
while t < 17.15: note(DR, SN, t, 0.05, int(50 + 70 * (t - 15.7) / 1.5)); t += 0.0625
# ---------- 17.2–28 full ----------
hit(17.2, True); pad_bed(17.2, 28.0, 68); ep_bed(17.2, 28.0, 86, rhythm=True); drums(17.2, 28.0, 3); bassline(17.2, 28.0, 108); arp(17.2, 28.0, 80)
chord(STR, [62, 65, 69, 74], 17.2, 10.8, 66); ramp(STR, 11, 90, 100, 17.2, 27.0)
VIBMEL = [(0.0, 81, 0.75), (1.0, 77, 0.5), (1.5, 74, 1.5), (3.0, 79, 0.5), (3.5, 77, 0.5), (4.0, 74, 1.4), (6.0, 72, 0.5), (6.5, 74, 0.5), (7.0, 77, 1.8)]
for off, k, d in VIBMEL: note(VIB, k, 17.2 + off, d, 92); note(VIB, k, 25.2 + off, d, 92) if 25.2 + off < 27.8 else None
for h in (21.0, 24.4, 25.6, 26.8): note(DR, CRASH, h, 1.0, 74); note(DR, CLAP, h, 0.2, 110)
# ---------- 28–30.8 break: piano + pad ----------
hit(28.0, True)
for k_ in (K, CLAP): pass
chord(PAD, [50, 57, 62, 69], 28.2, 2.8, 70); chord(CHOIR, [62, 65, 69], 28.2, 2.8, 62)
for off, k, d in ((0.3, 86, 1.2), (0.8, 81, 1.0), (1.3, 77, 1.2), (1.8, 74, 1.6), (2.3, 81, 0.8)): note(PIANO, k, 28.0 + off, d, 84)
note(BASS, 38, 28.0, 2.6, 90)
chord(STR, [62, 65, 69, 74], 29.3, 1.6, 70); ramp(STR, 11, 30, 120, 29.3, 30.8)
# ---------- 30.8–41.2 full 2 with lead ----------
hit(30.8); pad_bed(30.8, 40.9, 68); ep_bed(30.8, 40.9, 86, rhythm=True); drums(30.8, 40.9, 3); bassline(30.8, 40.9, 110); arp(30.8, 40.9, 80)
chord(STR, [62, 65, 69, 74], 30.8, 10.0, 68)
LEADMEL = [(0.0, 74, 1.5), (1.6, 77, 0.5), (2.1, 81, 1.4), (4.0, 79, 0.5), (4.5, 77, 0.5), (5.0, 76, 1.6), (6.8, 74, 0.8), (7.6, 77, 0.8), (8.4, 81, 1.6)]
for off, k, d in LEADMEL: note(LEAD, k, 30.8 + off, d, 72); note(VIB, k, 30.8 + off, d, 80)
for h in (33.0, 37.6): note(DR, CRASH, h, 1.0, 74); note(DR, CLAP, h, 0.2, 110)
t = 39.4
while t < 40.85: note(DR, SN, t, 0.05, int(56 + 70 * (t - 39.4) / 1.45)); t += 0.0625
chord(CHOIR, [62, 65, 69, 74], 39.4, 1.5, 70); ramp(CHOIR, 11, 30, 120, 39.4, 40.9)
# 40.9–41.2 silence → ---------- 41.2 finale ----------
hit(41.2, True); chord(PAD, [50, 57, 62, 69, 74], 41.2, 6.8, 80); chord(STR, [62, 65, 69, 74, 81], 41.2, 6.5, 84); ramp(STR, 11, 120, 30, 44.5, 48.0); ramp(PAD, 11, 120, 30, 44.5, 48.0)
chord(EP, [62, 65, 69, 74], 41.2, 3.0, 96); note(BASS, 38, 41.2, 3.0, 110)
for h in (42.2, 42.9): note(DR, K, h, 0.3, 120); note(DR, CLAP, h, 0.2, 110); chord(EP, [62, 65, 69], h, 0.5, 100)
for off, k, d in ((2.4, 86, 1.6), (3.1, 81, 1.4), (3.8, 77, 1.6), (4.8, 74, 2.4)): note(PIANO, k, 41.2 + off, d, 70)
# ---------- write MIDI + render ----------
tracks = {}
for tick, pr, msg in sorted(ev, key=lambda e: (e[0], e[1])): tracks.setdefault(msg.channel, []).append((tick, msg))
for ch, msgs in sorted(tracks.items()):
    tr = mido.MidiTrack(); mid.tracks.append(tr); last = 0
    if ch == 0: tr.append(mido.MetaMessage('set_tempo', tempo=mido.bpm2tempo(BPM), time=0))
    for tick, msg in msgs: msg.time = tick - last; tr.append(msg); last = tick
mid.save('score2.mid')
subprocess.run(['fluidsynth', '-ni', '-F', 'score2_raw.wav', '-r', str(SR), '-g', '0.6', '-o', 'synth.reverb.room-size=0.6', '-o', 'synth.reverb.damp=0.4', '-o', 'synth.reverb.width=0.8', '-o', 'synth.reverb.level=0.5', '-o', 'synth.chorus.active=1', '/usr/share/sounds/sf2/FluidR3_GM.sf2', 'score2.mid'], check=True, capture_output=True)
w = wave.open('score2_raw.wav'); n = w.getnframes(); raw = np.frombuffer(w.readframes(n), dtype=np.int16).reshape(-1, w.getnchannels()) / 32767.0
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
for h in (0.25, 0.75, 1.25, 2.0, 3.0, 7.6, 12.6, 17.2, 21.0, 24.4, 25.6, 26.8, 28.0, 33.0, 37.6, 41.2, 42.2, 42.9): impact(h, 0.9 if h in BIG else (0.15 if h < 2.5 else 0.4))
for h in BIG: sub(h, 36.7, 1.6, 0.5)
riser(15.2, 2.0, 0.4); riser(29.3, 1.5, 0.3); riser(39.0, 2.1, 0.45)
mix = orch + fx[:, None]
gap = np.ones(N); i0, i1 = int(40.9 * SR), int(41.2 * SR); gap[i0:i0 + 900] = np.linspace(1, 0.02, 900); gap[i0 + 900:i1] = 0.02; mix *= gap[:, None]
mix = np.tanh(mix / (np.abs(mix).max() * 0.66)); mix = mix / np.abs(mix).max() * 0.94
mix *= np.clip((T - tt_) / 0.8, 0, 1)[:, None]
with wave.open('score2.wav', 'wb') as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((mix * 32767).astype(np.int16).tobytes())
print('ok', len(ev))
