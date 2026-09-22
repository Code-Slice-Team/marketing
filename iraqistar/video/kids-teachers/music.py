"""Original, royalty-free soundtrack for the IraqiStar Kids video: a bright, gentle marimba-and-pluck
track in C major at 108 BPM, with soft chords, a round bass, a light shaker/kick, and a small "pop"
on every scene change. Synthesised from scratch with numpy, so there is nothing to license."""
import numpy as np, sys, wave

SR = 44100
BPM = 108
BEAT = 60 / BPM
TOTAL = float(sys.argv[1]) if len(sys.argv) > 1 else 65.0
SCENE_CUTS = [6, 14, 22, 31, 41, 49, 57]  # seconds; from the video's scene durations

N = int(TOTAL * SR)
mix = np.zeros(N)

def note(freq, dur, kind="marimba", vel=1.0):
    n = int(dur * SR); t = np.arange(n) / SR
    if kind == "marimba":
        env = np.exp(-t * 7.5) * (1 - np.exp(-t * 900))
        w = np.sin(2*np.pi*freq*t) + 0.35*np.sin(2*np.pi*freq*4*t)*np.exp(-t*18) + 0.12*np.sin(2*np.pi*freq*10*t)*np.exp(-t*40)
    elif kind == "pluck":
        env = np.exp(-t * 3.2) * (1 - np.exp(-t * 600))
        w = np.sin(2*np.pi*freq*t) + 0.5*np.sin(2*np.pi*freq*2*t)*np.exp(-t*6) + 0.25*np.sin(2*np.pi*freq*3*t)*np.exp(-t*9)
    elif kind == "pad":
        a = min(0.6, dur*0.3); env = np.minimum(t/a, 1) * np.minimum((dur - t)/0.5, 1).clip(0, 1)
        det = [0.997, 1.0, 1.003]
        w = sum(np.sin(2*np.pi*freq*d*t + 0.3*np.sin(2*np.pi*0.7*t)) for d in det) / 3
        w += 0.3*np.sin(2*np.pi*freq*2*t) / 3
    elif kind == "bass":
        env = np.exp(-t * 4) * (1 - np.exp(-t * 400))
        w = np.sin(2*np.pi*freq*t) + 0.2*np.sin(2*np.pi*freq*2*t)
    return w * env * vel

def add(sig, at):
    i = int(at * SR); j = min(N, i + len(sig))
    if i < N: mix[i:j] += sig[: j - i]

def shaker(at, vel=0.18):
    n = int(0.09 * SR); t = np.arange(n)/SR
    w = np.random.randn(n) * np.exp(-t*55)
    w = np.convolve(w, np.ones(5)/5, mode="same")   # take the fizz off
    w = np.diff(w, prepend=0) * 2                    # then thin the lows: a soft shaker band
    add(w * vel, at)

def kick(at, vel=0.5):
    n = int(0.25 * SR); t = np.arange(n)/SR
    f = 120 * np.exp(-t*18) + 45
    add(np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-t*12) * vel, at)

def pop(at, vel=0.5):
    n = int(0.12 * SR); t = np.arange(n)/SR
    f = 900 * np.exp(-t*30) + 300
    add(np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-t*35) * vel, at)

# Notes (Hz)
def hz(name):
    names = {"C":0,"D":2,"E":4,"F":5,"G":7,"A":9,"B":11}
    n, o = name[:-1], int(name[-1])
    return 440 * 2 ** ((names[n] + 12*(o-4) - 9) / 12)

# Chords: I V vi IV, two bars each, looped. Bar = 4 beats.
CH = [("C", ["C3","E4","G4","C5"], "C2"), ("G", ["G3","B3","D4","G4"], "G2"), ("A", ["A3","C4","E4","A4"], "A2"), ("F", ["F3","A3","C4","F4"], "F2")]
bars = int(TOTAL / (4*BEAT)) + 1
rng = np.random.default_rng(7)
# Pentatonic melody pool per chord (C major pentatonic, chord tones weighted)
PENT = ["C5","D5","E5","G5","A5","C6"]
motif = [0, 2, 3, 2, 4, 3, 2, 0]  # indices into PENT, a simple singable shape

for b in range(bars):
    t0 = b * 4 * BEAT
    chord = CH[(b // 2) % 4]
    intro = b < 2
    outro = t0 > TOTAL - 6
    # pad
    if not intro:
        for nn in chord[1]:
            add(note(hz(nn), 4*BEAT, "pad", 0.06), t0)
    # bass on 1 and 3 (and the "and" of 4 for bounce)
    if not intro:
        add(note(hz(chord[2]), BEAT*1.6, "bass", 0.35), t0)
        add(note(hz(chord[2]), BEAT*1.2, "bass", 0.28), t0 + 2*BEAT)
        add(note(hz(chord[2]) * 1.5 if b % 2 else hz(chord[2]), BEAT*0.5, "bass", 0.2), t0 + 3.5*BEAT)
    # marimba arpeggio, 8ths
    arp = chord[1][1:] + [chord[1][1]]
    for k in range(8):
        f = hz(arp[k % len(arp)]) * (2 if k in (3, 7) else 1)
        vel = 0.28 if k % 2 == 0 else 0.18
        if intro and k % 2: continue
        add(note(f, BEAT*0.9, "marimba", vel), t0 + k*BEAT/2)
    # pluck melody every other bar after the intro
    if not intro and b % 2 == 1 and not outro:
        shift = (b // 2) % 3
        for k, m in enumerate(motif):
            idx = min(len(PENT)-1, m + (1 if shift == 1 else 0))
            if rng.random() < 0.15: continue
            add(note(hz(PENT[idx]), BEAT*1.1, "pluck", 0.32), t0 + k*BEAT/2)
    # percussion
    if not intro:
        for k in range(8):
            shaker(t0 + k*BEAT/2, 0.07 if k % 2 == 0 else 0.035)
        kick(t0, 0.45); kick(t0 + 2*BEAT, 0.35)
        if b % 2 == 1: kick(t0 + 3.5*BEAT, 0.22)

for c in SCENE_CUTS:
    pop(c, 0.4)

# final chord ring-out on the last downbeat before the end
end_bar = (int((TOTAL - 5) / (4*BEAT))) * 4 * BEAT
for nn in ["C3","E4","G4","C5","E5"]:
    add(note(hz(nn), 4.5, "pluck", 0.35), end_bar)
    add(note(hz(nn), 5.0, "pad", 0.07), end_bar)

# gentle low-pass (moving average) to soften highs, then master fade
k = 6
mix = np.convolve(mix, np.ones(k)/k, mode="same")
fade_in = np.minimum(np.arange(N)/(SR*1.0), 1)
fade_out = np.minimum((N - np.arange(N))/(SR*2.5), 1).clip(0, 1)
mix *= fade_in * fade_out
# soft-knee limiter and normalise to -1 dBFS
mix = np.tanh(mix / (np.abs(mix).max() * 0.8))
mix = mix / np.abs(mix).max() * 0.89

# light stereo width: delay the right channel copy of highs slightly
right = np.roll(mix, int(0.0007*SR)); right[:40] = 0
stereo = np.stack([mix*0.98 + right*0.02, right*0.98 + mix*0.02], axis=1)
pcm = (stereo * 32767).astype(np.int16)
with wave.open(sys.argv[2] if len(sys.argv) > 2 else "music.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print("wrote", TOTAL, "s")
