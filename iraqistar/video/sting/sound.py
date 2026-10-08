import sys; sys.path.insert(0,'/home/claude/music')
from house import *
import wave
T=6.0; N=int(T*SR); mix=np.zeros((N,2))
def add(sig, at, gain=1.0, pan=0.0):
    i=int(at*SR)
    if sig.ndim==1: sig=np.stack([sig*(1-max(pan,0)),sig*(1+min(pan,0))],1)
    j=min(N,i+len(sig)); mix[i:j]+=sig[:j-i]*gain
# warm pad D major, soft, fades out at the end
pd=pad([50,57,62,66],5.7,0.9); add(pd,0.2,0.55)
# whoosh into the tagline
add(riser(1.3,0.6),0.0,0.5)
# soft thump on "إليك"
add(impact(0.7),2.28,0.9); add(crash(0.25,1.2),2.28,0.35)
# logo: chime arpeggio + shimmer + gentle sub
def bell(f,dur=2.2,vel=1.0):
    n=int(dur*SR); t=np.arange(n)/SR
    x=np.sin(2*np.pi*f*t)*np.exp(-t*2.2)+0.4*np.sin(2*np.pi*f*2.01*t)*np.exp(-t*4)+0.15*np.sin(2*np.pi*f*3.0*t)*np.exp(-t*6)
    return x*vel*0.35
for k,(f,off) in enumerate(((587.33,0),(739.99,0.07),(880.0,0.14),(1174.66,0.22))): add(bell(f,2.4,1.0-0.12*k),3.05+off,0.9,pan=(-0.3+0.2*k))
add(crash(0.35,2.0),3.05,0.45); add(impact(0.5),3.05,0.5)
# master
mix=sosfilt(sos('high',30),mix,axis=0)
mix=np.tanh(mix/(np.abs(mix).max()*0.8)); mix=mix/np.abs(mix).max()*0.6
# voice-over
w=wave.open('vo48.wav'); vo=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).reshape(-1,w.getnchannels())/32767.0
if vo.shape[1]==1: vo=np.repeat(vo,2,1)
vo=vo/np.abs(vo).max()*0.95
i=int(0.40*SR); j=min(N,i+len(vo)); mix[i:j]+=vo[:j-i]
# duck the bed slightly under the voice (already quiet); final limiter
mix=np.clip(mix,-1,1)*np.clip((T-np.arange(N)/SR)/0.4,0,1)[:,None]
write('sting.wav',mix); print('ok', round(float(np.abs(mix).max()),2))
