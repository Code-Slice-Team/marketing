"""'Happy ukulele' ad style (the classic funny-explainer sound): bright uke strum, whistled melody, claps + shaker,
glockenspiel sparkle, and a slide-whistle 'womp' on every 'عنده' stamp. C major, 118 BPM, 22 s."""
import mido, subprocess, numpy as np, wave
BPM = 118; TPB = 480; SR = 44100; T = 22.0
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
UKE, WHI, GLK, BASS, SLW = 0, 1, 2, 3, 4; DR = 9
prog(UKE, 24); prog(WHI, 78); prog(GLK, 9); prog(BASS, 32); prog(SLW, 78)
cc(UKE, 7, 100, 0); cc(WHI, 7, 92, 0); cc(GLK, 7, 70, 0); cc(BASS, 7, 74, 0); cc(SLW, 7, 104, 0); cc(DR, 7, 84, 0)
for c in (UKE, WHI, GLK, SLW): cc(c, 91, 48, 0)
cc(UKE, 10, 52, 0); cc(GLK, 10, 84, 0); cc(WHI, 10, 66, 0)
# C  G  Am  F  (I V vi IV), one chord per beat-pair
PROG = [(48, (60, 64, 67, 72)), (43, (59, 62, 67, 71)), (45, (60, 64, 69, 72)), (41, (60, 65, 69, 72))]
def bar_at(t): return PROG[int(t // (2 * B)) % 4]
K, SN, CLAP, HAT, SHK, TAMB, CRASH = 36, 38, 39, 42, 82, 54, 49
def uke(t0, t1, vel=92, light=False):
    t = t0
    while t < t1 - 1e-6:
        keys = bar_at(t)[1]
        # island strum over 2 beats (8 sixteenths): D . D U . U D U
        pat = [(0, 1, vel), (2, 1, vel - 14), (3, -1, vel - 26), (5, -1, vel - 24), (6, 1, vel - 10), (7, -1, vel - 28)]
        if light: pat = [(0, 1, vel - 10), (4, 1, vel - 20)]
        for i, d, v in pat:
            ks = keys if d > 0 else list(reversed(keys))
            chord(UKE, ks, t + i * S16, S16 * 1.6, v, strum=0.014)
        t += 2 * B
def bass(t0, t1, vel=88):
    t = t0
    while t < t1 - 1e-6:
        r = bar_at(t)[0] - 12
        note(BASS, r, t, B * 0.8, vel); note(BASS, r + 7, t + B, B * 0.7, vel - 16)
        t += 2 * B
def drums(t0, t1, full=True):
    t = t0; i = 0
    while t < t1 - 1e-6:
        if full: note(DR, K, t, 0.15, 96 if i % 2 == 0 else 82)
        if i % 2 == 1: note(DR, CLAP, t, 0.15, 96 if full else 70)
        note(DR, SHK, t + E8, 0.08, 56); note(DR, SHK, t + E8 + S16, 0.08, 34)
        if full and i % 4 == 3: note(DR, TAMB, t + E8, 0.1, 60)
        t += B; i += 1
def whistle(seq, t0, vel=96):
    t = t0
    for k, n in seq:
        if k: note(WHI, k, t, n * E8 * 0.9, vel); note(GLK, k + 12, t, 0.25, vel - 40)
        t += n * E8
def womp(t0):
    """slide whistle down — the 'he already has it' gag"""
    bend(SLW, 0, t0); note(SLW, 84, t0, 0.55, 112)
    for i in range(1, 13): bend(SLW, -int(8192 * 0.95 * i / 12), t0 + 0.55 * i / 12)
    bend(SLW, 0, t0 + 0.6)
    note(DR, CLAP, t0, 0.1, 96); note(DR, TAMB, t0, 0.1, 80)
def sparkle(t0):
    for i, k in enumerate((84, 88, 91, 96)): note(GLK, k, t0 + i * 0.06, 0.5, 90)
# ---- timeline ----
# 0–1.6 question: uke pickup + whistle "hmm?" rising
chord(UKE, (60, 64, 67, 72), 0.05, 0.4, 90, strum=0.03)
uke(0.3, 1.6, 84, light=True); note(DR, SHK, 0.3, 0.08, 50); note(DR, SHK, 0.8, 0.08, 50)
whistle([(76, 1), (79, 1), (84, 2)], 0.45, 92)
for i, v in enumerate((70, 84, 98, 112)): note(DR, SN, 1.6 - 4 * S16 + i * S16, 0.08, v)
# items 1.6–6.6: groove; womp on each stamp
uke(1.6, 6.6); bass(1.6, 6.6); drums(1.6, 6.6)
whistle([(76, 1), (79, 1), (81, 2)], 1.6, 92); womp(2.45)
whistle([(79, 1), (81, 1), (84, 2)], 3.2, 94); womp(4.05)
whistle([(81, 1), (84, 1), (88, 2)], 4.8, 98); womp(5.65)
# but 6.6–9.6: uke light + shaker, whistle asks (rising), tambourine build
uke(6.6, 9.6, 82, light=True); drums(6.6, 9.4, full=False); bass(6.6, 9.6, 78)
whistle([(72, 2), (74, 2), (76, 2), (79, 2), (81, 2), (84, 2)], 6.7, 90)
t = 8.4
while t < 9.55: note(DR, TAMB, t, 0.08, int(50 + 70 * (t - 8.4) / 1.15)); t += S16
# big 9.6–11.6: crash + full band + whistle hook
note(DR, CRASH, 9.6, 1.2, 84); note(DR, K, 9.6, 0.2, 110); note(DR, CLAP, 9.6, 0.15, 110); sparkle(9.6)
uke(9.6, 11.6, 100); bass(9.6, 11.6, 96); drums(9.6, 11.6)
whistle([(None, 1), (84, 1), (88, 1), (91, 1), (89, 2), (88, 2)], 9.6, 104)
# phone 11.6–18.6: groove + whistle hook
uke(11.6, 18.6, 94); bass(11.6, 18.6); drums(11.6, 18.6)
HOOK = [(84, 1), (84, 1), (88, 2), (86, 1), (84, 1), (81, 2), (79, 1), (81, 1), (84, 2), (None, 4),
        (84, 1), (84, 1), (88, 2), (91, 1), (88, 1), (86, 2), (84, 1), (81, 1), (84, 4), (None, 2)]
whistle(HOOK, 11.6, 98)
sparkle(16.0); note(DR, CLAP, 16.0, 0.15, 104); note(DR, TAMB, 16.0, 0.1, 90)
whistle([(79, 1), (81, 1), (84, 1), (86, 1), (88, 1), (91, 1), (96, 2)], 17.2, 104)
t = 17.6
while t < 18.55: note(DR, TAMB, t, 0.08, int(60 + 60 * (t - 17.6) / 0.95)); t += S16
# end 18.6: bright resolve, uke rake, sparkle
note(DR, CRASH, 18.6, 1.4, 90); note(DR, K, 18.6, 0.2, 108); note(DR, CLAP, 18.6, 0.15, 104)
chord(UKE, (60, 64, 67, 72, 76), 18.6, 3.0, 104, strum=0.04); note(BASS, 36, 18.6, 2.6, 96)
sparkle(18.6); whistle([(91, 1), (96, 3)], 19.4, 92)
note(DR, SHK, 19.9, 0.08, 46); note(DR, SHK, 20.4, 0.08, 40)
# ---------- write + render ----------
tracks = {}
for tick, pr, msg in sorted(ev, key=lambda e: (e[0], e[1])): tracks.setdefault(msg.channel, []).append((tick, msg))
for ch, msgs in sorted(tracks.items()):
    tr = mido.MidiTrack(); mid.tracks.append(tr); last = 0
    if ch == 0: tr.append(mido.MetaMessage('set_tempo', tempo=mido.bpm2tempo(BPM), time=0))
    for tick, msg in msgs: msg.time = tick - last; tr.append(msg); last = tick
mid.save('score_gift_uke.mid')
subprocess.run(['fluidsynth', '-ni', '-F', 'score_gift_uke_raw.wav', '-r', str(SR), '-g', '0.7', '-o', 'synth.reverb.room-size=0.4', '-o', 'synth.reverb.level=0.3', '/usr/share/sounds/sf2/FluidR3_GM.sf2', 'score_gift_uke.mid'], check=True, capture_output=True)
w = wave.open('score_gift_uke_raw.wav'); n = w.getnframes(); raw = np.frombuffer(w.readframes(n), dtype=np.int16).reshape(-1, w.getnchannels()) / 32767.0
N = int(T * SR); mix = np.zeros((N, 2)); m_ = min(N, len(raw)); mix[:m_] = raw[:m_, :2]
tt_ = np.arange(N) / SR
mix = np.tanh(mix / (np.abs(mix).max() * 0.72)); mix = mix / np.abs(mix).max() * 0.9
mix *= np.clip((T - tt_) / 0.9, 0, 1)[:, None]
with wave.open('score_gift_uke.wav', 'wb') as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((mix * 32767).astype(np.int16).tobytes())
print('ok')
