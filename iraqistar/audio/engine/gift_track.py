from arrange import *
S = Session(22.0, 122); B = S.B
# 0–1.6 intro: pad + shaker, rim
groove(S, 0.0, 1.6, 0); S.add('fx', impact(0.35), 0.3); S.add('fx', riser(1.3, 0.35), 0.3)
# 1.6–6.6 groove light, tags on stamps
hit(S, 1.6); groove(S, 1.6, 6.6, 1, 1)
for h in (2.4, 4.0, 5.6): tag(S, h)
# 6.6–9.6 breakdown: no kick, pad, riser
groove(S, 6.6, 9.6, 0, 2); S.add('fx', riser(2.9, 0.5), 6.7)
lead_phrase(S, 6.8, [(0, 4), (1, 4), (2, 4), (4, 4), (5, 4), (7, 3)], 0.7)
# 9.6–11.6 drop
hit(S, 9.6, True, False); groove(S, 9.6, 11.6, 2, 0)
lead_phrase(S, 9.6 + B, [(7, 2), (6, 2), (4, 4), (3, 2), (2, 2)], 1.0)
# 11.6–18.6 full
hit(S, 11.6, False, False); groove(S, 11.6, 18.6, 2, 1)
for k, ph in enumerate(([(4, 2), (4, 2), (7, 4), (6, 2), (4, 2), (2, 4)], [(2, 2), (3, 2), (4, 4), (None, 4), (6, 2), (4, 2)], [(7, 2), (7, 2), (8, 4), (7, 2), (6, 2), (4, 4)])):
    lead_phrase(S, 11.6 + k * 2 * 4 * B / 2, ph, 0.95)
tag(S, 16.0); S.add('fx', riser(2.4, 0.45), 16.2)
# 18.6 end: final chord, crash, tail
hit(S, 18.6, True, False)
S.add('chords', chord(PROG[0][1], 3.2, 2600, 1.1, 0.02), 18.6); S.add('chords', pad([33, 45, 57, 60, 64], 3.3, 0.9), 18.6)
S.add('bass', logdrum(45, 0.6, 1.0), 18.6); S.add('lead', pluck(81, 1.2, 0.9), 19.1); S.add('lead', pluck(84, 1.6, 0.9), 19.6)
m = S.mix(); m *= np.clip((22.0 - np.arange(S.N) / SR) / 0.8, 0, 1)[:, None]; write('gift_house.wav', m); print('ok')
