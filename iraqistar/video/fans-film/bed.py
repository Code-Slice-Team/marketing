import sys; sys.path.insert(0,'/home/claude/music')
from arrange import *
import wave, subprocess
T=108.0; S=Session(T,120); B=S.B
# VO at +0.5. hook 0-12.7 | يفيديو إلك 12.7-16.2 | how 16.2-26.4 | gift 26.4-38.5 | moment 38.5-49.2 | sessions 49.2-63 | why 63-78.5 | ataa 78.5-87 | easy 87-92.9 | cta 92.9-100.6 | sting 100.6-108
groove(S,0.0,12.7,0)
groove(S,12.7,16.2,0,2)
groove(S,16.2,38.5,1,4)
groove(S,38.5,49.2,1,8)
groove(S,49.2,63.0,2,12)
groove(S,63.0,78.5,1,16)
groove(S,78.5,87.0,0,20)
groove(S,87.0,100.6,1,24)
for h in (12.7,16.2,26.4,38.5,49.2,63.0,78.5,87.0,92.9): S.add('fx',downlifter(0.8,0.25),h)
S.add('fx',riser(1.6,0.3),47.6); S.add('fx',riser(1.6,0.3),99.0)
m=S.mix()
N=S.N
def bell(f,dur=2.4,vel=1.0):
    n=int(dur*SR); t=np.arange(n)/SR
    return (np.sin(2*np.pi*f*t)*np.exp(-t*2.2)+0.4*np.sin(2*np.pi*f*2.01*t)*np.exp(-t*4))*vel*0.3
def add(sig,at,g=1.0):
    i=int(at*SR); s=np.stack([sig,sig],1) if sig.ndim==1 else sig; j=min(N,i+len(s)); m[i:j]+=s[:j-i]*g
pd=pad([50,57,62,66],7.5,0.9); add(pd,100.6,0.5)
LG=100.75
for k,(f,off) in enumerate(((587.33,0),(739.99,0.07),(880.0,0.14),(1174.66,0.22))): add(bell(f,2.8,1-0.12*k),LG+off,0.9)
add(impact(0.45),LG,0.6); add(crash(0.3,2.0),LG,0.35)
m=sosfilt(sos('high',30),m,axis=0); m=np.tanh(m/(np.abs(m).max()*0.8)); m=m/np.abs(m).max()*0.45
subprocess.run(['ffmpeg','-y','-v','error','-i','vo.mp3','-ar',str(SR),'-ac','2','vo44.wav'],check=True)
w=wave.open('vo44.wav'); vo=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).reshape(-1,w.getnchannels())/32767.0
vo=vo/np.abs(vo).max()*0.95
i=int(0.5*SR); j=min(N,i+len(vo))
env_=np.sqrt(np.convolve(vo.mean(1)**2,np.ones(4410)/4410,'same')); d=1-0.55*np.clip(env_/(env_.max()+1e-9)*3,0,1)
duck=np.ones(N); duck[i:j]=d[:j-i]
k=np.ones(2205)/2205; duck=np.convolve(duck,k,'same')
mix=m*duck[:,None]; mix[i:j]+=vo[:j-i]
mix=np.clip(mix,-1,1)*np.clip((T-np.arange(N)/SR)/0.8,0,1)[:,None]
write('mix.wav',mix); print('ok',round(float(np.abs(mix).max()),2))
