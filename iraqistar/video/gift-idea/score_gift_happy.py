"""Happy / upbeat score for the gift-idea Reel (22 s). Bright D-major pop: nylon guitar strums, glockenspiel melody,
finger bass, light pop drums (kick, clap, shaker). No cinematic impacts — just soft pops on the stamps."""
import mido, subprocess, numpy as np, wave
BPM = 124; TPB = 480; SR = 44100; T = 22.0
B = 60 / BPM; E = B / 2
sec = lambda s: int(round(s / B * TPB))
mid = mido.MidiFile(ticks_per_beat=TPB); ev = []
def note(ch, key, t0, dur, vel=90):
    ev.append((sec(t0), 1, mido.Message('note_on', channel=ch, note=key, velocity=int(max(1, min(127, vel))))))
    ev.append((sec(t0 + dur), 0, mido.Message('note_off', channel=ch, note=key, velocity=0)))
def chord(ch, keys, t0, dur, vel=90, strum=0.0):
    for i, k in enumerate(keys): note(ch, k, t0 + i * strum, dur, vel)
def cc(ch, num, val, t0): ev.append((sec(t0), 0, mido.Message('control_change', channel=ch, control=num, value=int(max(0, min(127, val))))))
def prog(ch, p): ev.append((0, 0, mido.Message('program_change', channel=ch, program=p)))
GTR, GLK, BASS, PAD = 0, 1, 2, 3; DR = 9
prog(GTR, 24); prog(GLK, 9); prog(BASS, 33); prog(PAD, 48)
cc(GTR, 7, 100, 0); cc(GLK, 7, 96, 0); cc(BASS, 7, 66, 0); cc(PAD, 7, 70, 0); cc(DR, 7, 88, 0)
for c in (GTR, GLK, PAD): cc(c, 91, 55, 0)
cc(GTR, 10, 54, 0); cc(GLK, 10, 76, 0)
# D major: D - A - Bm - G  (I V vi IV), one chord per bar (2 beats per bar here = ~0.97 s), progression every 4 bars
PROG = [(50, (50, 57, 62, 66)), (45, (45, 57, 61, 64)), (47, (47, 57, 62, 66)), (43, (43, 55, 59, 62))]
BAR = 2 * B
def bar_at(t): return PROG[int(t // BAR) % 4]
K, SN, CLAP, HAT, SHK, TAMB, CRASH = 36, 38, 39, 42, 82, 54, 49
def strum(t0, t1, vel=88, busy=True):
    t = t0
    while t < t1 - 1e-6:
        root, keys = bar_at(t); up = [k + 12 for k in keys[1:]]
        # pattern per bar (2 beats): down . down-up . up down-up
        pat = [(0, 1, vel), (E, 1, vel - 30), (B, 1, vel - 8), (B + E, -1, vel - 24)] if busy else [(0, 1, vel), (B, 1, vel - 12)]
        for off, d, v in pat:
            ks = up if d > 0 else list(reversed(up))
            chord(GTR, ks, t + off, E * 0.9, v, strum=0.012)
        t += BAR
def bass(t0, t1, vel=96, walk=True):
    t = t0
    while t < t1 - 1e-6:
        root, keys = bar_at(t); r = root - 12
        if walk:
            for off, k, v in ((0, r, vel), (E, r, vel - 30), (B, r + 7, vel - 10), (B + E, r + 12 if int(t // BAR) % 2 else r, vel - 26)): note(BASS, k, t + off, E * 0.85, v)
        else: note(BASS, r, t, B * 0.9, vel); note(BASS, r + 7, t + B, B * 0.9, vel - 14)
        t += BAR
def drums(t0, t1, level=2):
    t = t0; i = 0
    while t < t1 - 1e-6:
        note(DR, K, t, 0.2, 104 if i % 2 == 0 else 96)
        if i % 2 == 1: note(DR, CLAP, t, 0.2, 100 if level == 2 else 78)
        if level == 2:
            note(DR, SHK, t + E, 0.1, 58); note(DR, HAT, t, 0.1, 44)
            if i % 4 == 3: note(DR, TAMB, t + E, 0.1, 66)
        t += B; i += 1
def melody(seq, t0, vel=100):
    """seq: list of (key or None, length in eighths)"""
    t = t0
    for k, n in seq:
        if k is not None: note(GLK, k, t, min(n * E * 0.95, 0.6), vel)
        t += n * E
def pop(t0):  # cheeky stamp accent
    note(GLK, 86, t0, 0.15, 110); note(GLK, 90, t0 + 0.07, 0.25, 96); note(DR, CLAP, t0, 0.2, 110); note(DR, TAMB, t0, 0.2, 90)
def pad(t0, t1, vel=70):
    t = t0
    while t < t1 - 1e-6:
        root, keys = bar_at(t); chord(PAD, keys, t, min(BAR, t1 - t), vel); t += BAR
# ---- timeline ----
# 0–1.6 question: playful pickup
note(GLK, 74, 0.05, 0.3, 96); note(GLK, 78, 0.3, 0.3, 100); note(GLK, 81, 0.55, 0.5, 108)
note(DR, K, 0.3, 0.2, 100); note(DR, SHK, 0.55, 0.1, 60); note(DR, SHK, 0.8, 0.1, 60)
strum(0.3, 1.6, 84, busy=False); bass(0.3, 1.6, 90, walk=False); note(DR, CLAP, 1.3, 0.2, 90)
# items 1.6–6.6: full groove, pops on stamps
strum(1.6, 6.6, 90); bass(1.6, 6.6, 96); drums(1.6, 6.6, 2)
melody([(74, 1), (78, 1), (81, 2), (None, 4)], 1.6, 94)
melody([(78, 1), (81, 1), (86, 2), (None, 4)], 3.2, 96)
melody([(81, 1), (86, 1), (90, 2), (None, 4)], 4.8, 100)
for h in (2.4, 4.0, 5.6): pop(h)
# but 6.6–9.6: strip to guitar + shaker, pad rising, glock question
strum(6.6, 9.6, 78, busy=False); pad(6.6, 9.6, 60); note(BASS, 38, 6.6, 2.9, 80)
t = 6.6
while t < 9.5: note(DR, SHK, t, 0.1, 54); t += E
melody([(74, 2), (76, 2), (78, 2), (81, 2), (83, 2), (86, 2)], 6.7, 92)
t = 8.6
while t < 9.55: note(DR, SN, t, 0.05, int(50 + 70 * (t - 8.6) / 0.95)); t += E / 2
# big 9.6–11.6: everything + crash + hook
note(DR, CRASH, 9.6, 1.2, 90); note(DR, K, 9.6, 0.3, 118); note(DR, CLAP, 9.6, 0.2, 116)
chord(GLK, [86, 90, 93], 9.6, 0.6, 112); chord(PAD, [62, 66, 69, 74], 9.6, 2.0, 84)
strum(9.6, 11.6, 96); bass(9.6, 11.6, 104); drums(9.6, 11.6, 2)
melody([(None, 1), (81, 1), (86, 1), (90, 1), (88, 2), (86, 2)], 9.6, 104)
# phone 11.6–18.6: warm and bright, hook melody
strum(11.6, 18.6, 92); bass(11.6, 18.6, 100); drums(11.6, 18.6, 2); pad(11.6, 18.6, 56)
HOOK = [(86, 1), (86, 1), (90, 2), (88, 1), (86, 1), (83, 2), (81, 1), (83, 1), (86, 2), (None, 4),
        (86, 1), (86, 1), (90, 2), (93, 1), (90, 1), (88, 2), (86, 1), (83, 1), (86, 4), (None, 2)]
melody(HOOK, 11.6, 100)
pop(16.0); note(DR, CRASH, 16.0, 1.0, 70)
melody([(81, 1), (83, 1), (86, 1), (88, 1), (90, 1), (93, 1), (95, 2)], 17.2, 104)
t = 17.6
while t < 18.55: note(DR, SN, t, 0.05, int(60 + 60 * (t - 17.6) / 0.95)); t += E / 2
# end 18.6: bright resolve
note(DR, CRASH, 18.6, 1.5, 96); note(DR, K, 18.6, 0.3, 116); note(DR, CLAP, 18.6, 0.2, 110)
chord(GTR, [62, 66, 69, 74, 78], 18.6, 3.0, 100, strum=0.03); chord(PAD, [50, 57, 62, 66, 69, 74], 18.6, 3.2, 84)
note(BASS, 38, 18.6, 2.8, 104); chord(GLK, [86, 90, 93, 98], 18.6, 1.2, 112, strum=0.05)
melody([(93, 1), (98, 1), (102, 3)], 19.6, 92)
note(DR, SHK, 19.8, 0.1, 50); note(DR, SHK, 20.3, 0.1, 44)
# ---------- write + render ----------
tracks = {}
for tick, pr, msg in sorted(ev, key=lambda e: (e[0], e[1])): tracks.setdefault(msg.channel, []).append((tick, msg))
for ch, msgs in sorted(tracks.items()):
    tr = mido.MidiTrack(); mid.tracks.append(tr); last = 0
    if ch == 0: tr.append(mido.MetaMessage('set_tempo', tempo=mido.bpm2tempo(BPM), time=0))
    for tick, msg in msgs: msg.time = tick - last; tr.append(msg); last = tick
mid.save('score_gift_happy.mid')
subprocess.run(['fluidsynth', '-ni', '-F', 'score_gift_happy_raw.wav', '-r', str(SR), '-g', '0.7', '-o', 'synth.reverb.room-size=0.45', '-o', 'synth.reverb.level=0.35', '/usr/share/sounds/sf2/FluidR3_GM.sf2', 'score_gift_happy.mid'], check=True, capture_output=True)
w = wave.open('score_gift_happy_raw.wav'); n = w.getnframes(); raw = np.frombuffer(w.readframes(n), dtype=np.int16).reshape(-1, w.getnchannels()) / 32767.0
N = int(T * SR); mix = np.zeros((N, 2)); m_ = min(N, len(raw)); mix[:m_] = raw[:m_, :2]
tt_ = np.arange(N) / SR
mix = np.tanh(mix / (np.abs(mix).max() * 0.7)); mix = mix / np.abs(mix).max() * 0.92
mix *= np.clip((T - tt_) / 0.9, 0, 1)[:, None]
with wave.open('score_gift_happy.wav', 'wb') as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((mix * 32767).astype(np.int16).tobytes())
print('ok')
