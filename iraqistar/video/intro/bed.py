"""28 s upbeat bed for the IraqiStar intro: pad, kick/hat groove from 2.6 s, plucked bass, soft ticks for the typewriter words,
whooshes on every section change, shimmer at the end. Synthesised."""
import numpy as np, wave
SR=44100; T=28.0; N=int(T*SR); t=np.arange(N)/SR; BPM=112; B=60/BPM
mix=np.zeros(N); rng=np.random.default_rng(7)
def add(sig,at):
    i=int(at*SR); j=min(N,i+len(sig)); mix[i:j]+=sig[:j-i]
def kick(at,vel=0.5):
    n=int(0.28*SR); tt=np.arange(n)/SR; f=135*np.exp(-tt*20)+46
    add(np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tt*9)*vel,at)
def hat(at,vel=0.06,dur=0.05):
    n=int(dur*SR); tt=np.arange(n)/SR; w=np.diff(rng.standard_normal(n),prepend=0)
    add(w*np.exp(-tt*70)*vel,at)
def bass(f,at,dur,vel=0.28):
    n=int(dur*SR); tt=np.arange(n)/SR
    add((np.sin(2*np.pi*f*tt)+0.3*np.sin(4*np.pi*f*tt))*np.exp(-tt*3.5)*(1-np.exp(-tt*300))*vel,at)
def pad(chord,at,dur,vel=0.045):
    n=int(dur*SR); tt=np.arange(n)/SR; env=np.minimum(tt/1.0,1)*np.clip((dur-tt)/1.0,0,1)
    for f in chord: add((np.sin(2*np.pi*f*tt)+np.sin(2*np.pi*f*1.004*tt))/2*env*vel,at)
def whoosh(at,vel=0.22,dur=0.45):
    n=int(dur*SR); tt=np.arange(n)/SR; w=np.convolve(rng.standard_normal(n),np.ones(12)/12,mode="same")
    add(w*np.sin(np.pi*tt/dur)**2*vel,at-dur*0.6)
def tick(at,vel=0.12):
    n=int(0.03*SR); tt=np.arange(n)/SR; add(np.sin(2*np.pi*2200*tt)*np.exp(-tt*180)*vel,at)
def shimmer(at,vel=0.2):
    for f,d in ((880,2.4),(1318.5,2.6),(1760,2.0)):
        n=int(d*SR); tt=np.arange(n)/SR
        add(np.sin(2*np.pi*f*tt)*(1-np.exp(-tt/0.02))*np.exp(-tt/(d*0.45))*vel*(880/f)**0.6,at)
prog=[(110,(220,261.6,329.6)),(87.3,(174.6,220,261.6)),(130.8,(261.6,329.6,392)),(98,(196,246.9,293.7))]
bars=int(T/(4*B))+1
for b in range(bars):
    t0=b*4*B; root,chord=prog[(b//2)%4]
    pad(chord,t0,4*B+0.5)
    if 2.6<=t0<26.5:
        for k in range(4): kick(t0+k*B,0.5 if k%2==0 else 0.38)
        for k in range(8): hat(t0+k*B/2,0.05 if k%2 else 0.08)
        bass(root,t0,B*0.9); bass(root,t0+1.5*B,B*0.5,0.2); bass(root,t0+2*B,B*0.9); bass(root*1.5,t0+3.5*B,B*0.5,0.18)
for at in (2.6,4.6,6.4,9.4,14.2,19.6,24.6): whoosh(at)
for i in range(9): tick(2.7+i*0.22)
for i in range(3): tick(6.5+i*0.25)
kick(0.5,0.6); kick(7.4,0.7); kick(12.6,0.6); kick(24.9,0.75); shimmer(24.95)
mix*=np.clip((T-t)/0.8,0,1)*np.minimum(t/0.2,1)
mix=np.tanh(mix/(np.abs(mix).max()*0.85)); mix=mix/np.abs(mix).max()*0.85
r=np.roll(mix,int(0.0006*SR)); r[:30]=0
st=np.stack([mix,r],axis=1)
with wave.open("bed.wav","wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st*32767).astype(np.int16).tobytes())
print("ok")
