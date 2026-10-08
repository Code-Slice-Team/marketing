from arrange import *
S = Session(20.0, 120); B = S.B
# 0–2.6 intro: pad + ticking hats (clock)
groove(S, 0.0, 2.6, 0); S.add('fx', impact(0.3), 0.3)
t = 0.5
while t < 2.5: S.add('drums', hat(0.6, 0.05), t, pan=0.3 if int(t * 4) % 2 else -0.3); t += 0.25
# 2.6–5.0 light groove
hit(S, 2.6); groove(S, 2.6, 5.0, 1, 1); tag(S, 4.3)
# 5.0–11.6 full flow
hit(S, 5.0, True, False); groove(S, 5.0, 11.6, 2, 0)
hit(S, 7.2, False, True); hit(S, 9.4, False, True)
for k, ph in enumerate(([(4, 2), (4, 2), (7, 4), (6, 2), (4, 2), (2, 4)], [(2, 2), (3, 2), (4, 4), (None, 4), (6, 2), (4, 2)], [(7, 2), (7, 2), (8, 4), (7, 2), (6, 2), (4, 4)])):
    lead_phrase(S, 5.0 + k * 4 * B, ph, 0.9)
# 11.6–14.0 chips
hit(S, 11.6); groove(S, 11.6, 14.0, 2, 1); lead_phrase(S, 11.6 + B, [(7, 2), (6, 2), (4, 4), (3, 2), (2, 2)], 1.0)
# 14.0–16.4 break + build
hit(S, 14.0, False, True); groove(S, 14.0, 16.4, 0, 2); S.add('fx', riser(2.3, 0.5), 14.1)
lead_phrase(S, 14.2, [(0, 4), (2, 4), (4, 4), (5, 4), (7, 4)], 0.75)
# 16.4 end: resolve
hit(S, 16.4, True, False); groove(S, 16.4, 18.4, 2, 0)
S.add('chords', chord(PROG[0][1], 3.4, 2600, 1.1, 0.02), 18.4); S.add('chords', pad([33, 45, 57, 60, 64], 1.6, 0.9), 18.4)
S.add('bass', logdrum(45, 0.6, 1.0), 18.4); S.add('lead', pluck(81, 1.2, 0.9), 18.9); S.add('lead', pluck(84, 1.6, 0.9), 19.3)
m = S.mix(); m *= np.clip((20.0 - np.arange(S.N) / SR) / 0.7, 0, 1)[:, None]; write('paid_house.wav', m); print('ok')
