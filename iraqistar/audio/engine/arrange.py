from house import *
PROG = [(45, (57, 60, 64, 67)), (41, (53, 57, 60, 64)), (48, (55, 60, 64, 67)), (43, (55, 59, 62, 67))]  # Am F C G
PENTA = [69, 72, 74, 76, 79, 81, 84, 86, 88]
BASSPAT = [(0, 0, 1.0), (3, 0, .8), (6, 7, .85), (8, 0, .9), (11, 0, .75), (14, 7, .8)]
def groove(S, t0, t1, level, bar_offset=0):
    B = S.B; s16 = B / 4; t = t0; bar = bar_offset
    while t < t1 - 1e-6:
        root, keys = PROG[bar % 4]; barlen = 4 * B; end = min(t1, t + barlen)
        # chords: stabs + pad
        for i, v in ((0, 1.0), (6, .8), (12, .85)):
            if t + i * s16 < end: S.add('chords', chord([k + 12 for k in keys], s16 * 2.2, cutoff=2600 if level < 2 else 3600, vel=v), t + i * s16)
        S.add('chords', pad([k - 12 for k in keys[:2]] + list(keys[2:]), min(barlen, end - t) + 0.3, vel=0.6 if level == 0 else 0.35), t)
        # percussion
        for i in range(16):
            tt = t + i * s16
            if tt >= end: break
            if i % 2 == 0: S.add('drums', shaker(0.8 if i % 4 == 0 else 0.55), tt, pan=0.25)
            else: S.add('drums', shaker(0.3, 0.06), tt, pan=-0.2)
            if level >= 1 and i % 4 == 0: S.add('drums', kick(1.0 if i in (0, 8) else 0.92), tt); S.kicks.append(tt)
            if level >= 1 and i in (4, 12): S.add('drums', clap(0.9), tt)
            if level >= 2 and i % 4 == 2: S.add('drums', hat(0.5), tt, pan=0.35)
            if level == 0 and i in (4, 12): S.add('drums', rim(0.6), tt, pan=-0.3)
            if i in (7, 15) and level >= 1: S.add('drums', rim(0.45), tt, pan=0.4)
        # log-drum bass
        if level >= 1:
            for i, off, v in BASSPAT:
                tt = t + i * s16
                if tt < end: S.add('bass', logdrum(root + off - 12 + 12, 0.3, v * (0.9 if level == 1 else 1.0)), tt)
        t += barlen; bar += 1
def lead_phrase(S, t0, notes, vel=0.9):
    """notes: list of (penta index or None, sixteenths)"""
    t = t0
    for idx, n in notes:
        if idx is not None: S.add('lead', pluck(PENTA[idx], 0.45, vel), t, pan=0.15)
        t += n * S.B / 4
def hit(S, t, big=False, dl=True):
    S.add('fx', crash(0.5 if big else 0.32), t); S.add('fx', impact(0.5 if big else 0.28), t)
    if dl: S.add('fx', downlifter(1.0, 0.35), t)
def tag(S, t):
    """cheeky two-note pluck tag (E5→C5) — the 'he already has it' moment"""
    S.add('lead', pluck(88, 0.35, 1.0), t, pan=-0.2); S.add('lead', pluck(84, 0.5, 0.9), t + S.B / 4, pan=0.2)
    S.add('drums', clap(1.0), t); S.add('fx', downlifter(0.8, 0.3), t)
