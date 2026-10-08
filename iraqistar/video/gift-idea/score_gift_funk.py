"""Happy funk score for the gift-idea Reel (22 s). Slap bass, clavinet stabs, brass section, muted-trumpet
'wah-wah' on every 'عنده' stamp, tight funk drums. E dorian vamp (Em7 / A7)."""
import mido, subprocess, numpy as np, wave
BPM = 112; TPB = 480; SR = 44100; T = 22.0
B = 60 / BPM; E8 = B / 2; S16 = B / 4
sec = lambda s: int(round(s / B * TPB))
mid = mido.MidiFile(ticks_per_beat=TPB); ev = []
def note(ch, key, t0, dur, vel=90):
    ev.append((sec(t0), 1, mido.Message('note_on', channel=ch, note=key, velocity=int(max(1, min(127, vel))))))
    ev.append((sec(t0 + dur), 0, mido.Message('note_off', channel=ch, note=key, velocity=0)))
def chord(ch, keys, t0, dur, vel=90, strum=0.0):
    for i, k in enumerate(keys): note(ch, k, t0 + i * strum, dur, vel)
def cc(ch, num, val, t0): ev.append((sec(t0), 0, mido.Message('control_change', channel=ch, control=num, value=int(max(0, min(127, val))))))
def bend(ch, val, t0): ev.append((sec(t0), 0, mido.Message('pitchwheel', channel=ch, pitch=int(max(-8192, min(8191, val))))))
def prog(ch, p): ev.append((0, 0, mido.Message('program_change', channel=ch, program=p)))
CLV, BASS, BRS, TPT, GTR = 0, 1, 2, 3, 4; DR = 9
prog(CLV, 7); prog(BASS, 37); prog(BRS, 61); prog(TPT, 59); prog(GTR, 28)
cc(CLV, 7, 84, 0); cc(BASS, 7, 96, 0); cc(BRS, 7, 100, 0); cc(TPT, 7, 104, 0); cc(GTR, 7, 78, 0); cc(DR, 7, 100, 0)
for c in (CLV, BRS, TPT, GTR): cc(c, 91, 40, 0)
cc(CLV, 10, 50, 0); cc(GTR, 10, 80, 0); cc(TPT, 10, 60, 0)
K, SN, CLAP, HAT, OHAT, RIDE, CRASH, COW = 36, 38, 39, 42, 46, 51, 49, 56
BAR = 4 * B
# vamp: bar A = Em7 (E), bar B = A7 (A)
def vamp(t): return (40, (52, 55, 59, 62)) if int(t // (2 * B)) % 2 == 0 else (45, (49, 55, 57, 61))  # two beats each
def slap(t0, t1, vel=104):
    """funk bass in 16ths: root octave pops"""
    t = t0
    while t < t1 - 1e-6:
        r = vamp(t)[0] - 12
        # beat pattern over 2 beats (8 sixteenths): R . R(oct) . . R  . R-slide
        pat = [(0, r, vel), (2, r + 12, vel - 10), (3, r, vel - 20), (5, r + 12, vel - 6), (6, r + 10, vel - 24), (7, r + 12, vel - 8)]
        for i, k, v in pat: note(BASS, k, t + i * S16, S16 * 0.9, v)
        t += 2 * B
def clav(t0, t1, vel=96):
    t = t0
    while t < t1 - 1e-6:
        keys = vamp(t)[1]
        for i, v in ((0, vel), (3, vel - 26), (4, vel - 10), (6, vel - 20), (7, vel - 30)): chord(CLV, keys, t + i * S16, S16 * 0.6, v)
        t += 2 * B
def gtr(t0, t1, vel=72):
    """muted funk guitar 16ths (chicka)"""
    t = t0; i = 0
    while t < t1 - 1e-6:
        keys = [k + 12 for k in vamp(t)[1][1:]]
        chord(GTR, keys, t, S16 * 0.5, vel - (0 if i % 2 == 0 else 22), strum=0.006)
        t += S16; i += 1
def drums(t0, t1, level=2):
    t = t0; i = 0
    while t < t1 - 1e-6:
        b = i % 4
        note(DR, K, t, 0.15, 112 if b == 0 else 100 if b == 2 else 0) if b in (0, 2) else None
        if b == 1: note(DR, K, t + S16 * 3, 0.15, 90)
        if b == 2: note(DR, K, t + S16 * 2, 0.15, 84)
        if b in (1, 3): note(DR, SN, t, 0.15, 112); note(DR, CLAP, t, 0.15, 90)
        if level == 2:
            for j in range(4):
                if not (b == 3 and j == 2): note(DR, HAT, t + j * S16, 0.06, 72 if j % 2 == 0 else 48)
            if b == 3: note(DR, OHAT, t + S16 * 2, 0.2, 80)
        else:
            for j in range(4): note(DR, HAT, t + j * S16, 0.06, 60 if j % 2 == 0 else 40)
        t += B; i += 1
def stab(t0, big=False):
    keys = [64, 67, 71, 74] if big else [64, 67, 71]
    chord(BRS, keys, t0, 0.35 if not big else 0.9, 118 if big else 106, strum=0.008)
    note(DR, K, t0, 0.15, 118); note(DR, SN, t0, 0.15, 116); note(DR, CLAP, t0, 0.15, 110)
    if big: note(DR, CRASH, t0, 1.2, 96)
def wah(t0):
    """muted trumpet 'wah-wah' — two notes sliding down, the 'he already has it' punchline"""
    note(TPT, 71, t0, 0.22, 112)
    bend(TPT, 0, t0 + 0.36); note(TPT, 69, t0 + 0.36, 0.5, 108)
    for i in range(1, 9): bend(TPT, -int(8192 * 0.55 * i / 8), t0 + 0.36 + 0.5 * i / 8)
    bend(TPT, 0, t0 + 0.95)
    note(DR, COW, t0, 0.1, 90)
def riff(t0, vel=106):
    """brass hook, 2 bars"""
    seq = [(64, 1), (67, 1), (69, 2), (None, 1), (71, 1), (69, 1), (67, 1), (64, 2), (None, 2), (62, 1), (64, 3)]
    t = t0
    for k, n in seq:
        if k: chord(BRS, [k, k + 4 if k in (64, 69) else k + 3], t, min(n * E8 * 0.85, 0.7), vel)
        t += n * E8
def fill(t0):
    for i, (k, v) in enumerate(((SN, 90), (SN, 96), (SN, 104), (SN, 112), (SN, 118), (CLAP, 120), (SN, 124), (CRASH, 100))): note(DR, k, t0 + i * S16, 0.1, v)
# ---- timeline ----
# 0–1.6 question: bass lick pickup + cowbell, drum fill into groove
note(DR, COW, 0.05, 0.1, 96); note(DR, COW, 0.3, 0.1, 110)
for i, k in enumerate((28, 31, 33, 35, 40)): note(BASS, k, 0.3 + i * S16, S16 * 0.9, 108)
chord(CLV, (52, 55, 59, 62), 0.3, 0.3, 100); chord(CLV, (52, 55, 59, 62), 0.85, 0.3, 90)
fill(1.6 - 8 * S16 + S16) if False else None
for i in range(4): note(DR, HAT, 0.3 + i * E8, 0.06, 60)
for i, v in enumerate((90, 100, 110, 120)): note(DR, SN, 1.6 - 4 * S16 + i * S16, 0.1, v)
# items 1.6–6.6: groove; on each stamp: stab + wah-wah
drums(1.6, 6.6, 2); slap(1.6, 6.6); clav(1.6, 6.6); gtr(1.6, 6.6)
for h in (2.4, 4.0, 5.6): stab(h); wah(h + 0.05)
# but 6.6–9.6: breakdown — bass + hats only, trumpet asks the question (rising), fill
drums(6.6, 9.4, 1); slap(6.6, 9.4, 96); gtr(6.6, 9.4, 60)
for i, k in enumerate((64, 66, 67, 69, 71, 74)): note(TPT, k, 6.7 + i * 0.42, 0.34, 96 + i * 4)
fill(9.6 - 8 * S16)
# big 9.6–11.6: full band + big stab + riff
stab(9.6, True); drums(9.6, 11.6, 2); slap(9.6, 11.6, 110); clav(9.6, 11.6, 104); gtr(9.6, 11.6, 80)
chord(BRS, [64, 67, 71, 76], 10.2, 0.3, 104); chord(BRS, [62, 66, 69, 74], 10.5, 0.3, 100); chord(BRS, [64, 67, 71, 76], 10.8, 0.8, 110)
# phone 11.6–18.6: groove + brass hook
stab(11.6); drums(11.6, 18.6, 2); slap(11.6, 18.6); clav(11.6, 18.6); gtr(11.6, 18.6)
riff(12.0); riff(14.15, 100)
stab(16.0); wah(16.05)
riff(16.6, 108)
fill(18.6 - 8 * S16)
# end 18.6: final hit, bass slide, brass sustained
stab(18.6, True); chord(BRS, [64, 67, 71, 74, 79], 18.6, 2.2, 112, strum=0.01); chord(CLV, (52, 55, 59, 62, 67), 18.6, 1.6, 104)
note(BASS, 40, 18.6, 1.2, 112); note(BASS, 28, 19.7, 1.2, 100)
for i in range(1, 9): bend(BASS, -int(8192 * i / 8), 19.75 + 1.0 * i / 8)
bend(BASS, 0, 20.9)
note(DR, COW, 19.6, 0.1, 80); note(DR, HAT, 20.1, 0.06, 50); note(DR, COW, 20.6, 0.1, 70)
# ---------- write + render ----------
tracks = {}
for tick, pr, msg in sorted(ev, key=lambda e: (e[0], e[1])): tracks.setdefault(msg.channel, []).append((tick, msg))
for ch, msgs in sorted(tracks.items()):
    tr = mido.MidiTrack(); mid.tracks.append(tr); last = 0
    if ch == 0: tr.append(mido.MetaMessage('set_tempo', tempo=mido.bpm2tempo(BPM), time=0))
    for tick, msg in msgs: msg.time = tick - last; tr.append(msg); last = tick
mid.save('score_gift_funk.mid')
subprocess.run(['fluidsynth', '-ni', '-F', 'score_gift_funk_raw.wav', '-r', str(SR), '-g', '0.7', '-o', 'synth.reverb.room-size=0.35', '-o', 'synth.reverb.level=0.3', '/usr/share/sounds/sf2/FluidR3_GM.sf2', 'score_gift_funk.mid'], check=True, capture_output=True)
w = wave.open('score_gift_funk_raw.wav'); n = w.getnframes(); raw = np.frombuffer(w.readframes(n), dtype=np.int16).reshape(-1, w.getnchannels()) / 32767.0
N = int(T * SR); mix = np.zeros((N, 2)); m_ = min(N, len(raw)); mix[:m_] = raw[:m_, :2]
tt_ = np.arange(N) / SR
mix = np.tanh(mix / (np.abs(mix).max() * 0.7)); mix = mix / np.abs(mix).max() * 0.92
mix *= np.clip((T - tt_) / 0.9, 0, 1)[:, None]
with wave.open('score_gift_funk.wav', 'wb') as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((mix * 32767).astype(np.int16).tobytes())
print('ok')
