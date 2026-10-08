import sys; sys.path.insert(0,'/home/claude/music')
from arrange import *
import wave, subprocess
T=50.0; S=Session(T,120); B=S.B
groove(S,0.0,7.2,0); groove(S,7.2,20.0,1,2); groove(S,20.0,31.2,2,6); groove(S,31.2,34.2,0,10); groove(S,34.2,40.1,1,12)
for h in (7.2,12.0,15.9,20.0,24.0,27.3,31.2,34.2): S.add('fx',downlifter(0.7,0.22),h)
S.add('fx',riser(1.4,0.3),38.7)
m=S.mix(); N=S.N
def bell(f,dur=2.4,vel=1.0):
    n=int(dur*SR); t=np.arange(n)/SR
    return (np.sin(2*np.pi*f*t)*np.exp(-t*2.2)+0.4*np.sin(2*np.pi*f*2.01*t)*np.exp(-t*4))*vel*0.3
def add(sig,at,g=1.0):
    i=int(at*SR); s=np.stack([sig,sig],1) if sig.ndim==1 else sig; j=min(N,i+len(s)); m[i:j]+=s[:j-i]*g
LG=40.15
pd=pad([50,57,62,66],8.5,0.9); add(pd,LG-0.1,0.5)
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
