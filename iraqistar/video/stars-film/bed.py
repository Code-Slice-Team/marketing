import sys; sys.path.insert(0,'/home/claude/music')
from arrange import *
import wave, subprocess
T=92.0; S=Session(T,120); B=S.B
# VO at +0.5 s. Scene grid (film time): hook 0-8, promise 8-14.2, stories 14.2-35, examples 35-38.9, gifts 38.9-48, stars 48-61.2, record 61.2-71, control 71-76.5, mission 76.5-82, welcome 82-84, sting 84-92
groove(S,0.0,8.0,0)
groove(S,8.0,14.2,0,2)
groove(S,14.2,48.0,1,4)
groove(S,48.0,61.2,2,8)
groove(S,61.2,76.5,1,12)
groove(S,76.5,82.0,0,16)
for h in (8.0,14.2,25.0,35.0,38.9,48.0,61.2,71.0,76.5): S.add('fx',downlifter(0.8,0.25),h)
S.add('fx',riser(1.6,0.3),46.4); S.add('fx',riser(1.6,0.28),80.4)
m=S.mix()
N=S.N
def bell(f,dur=2.4,vel=1.0):
    n=int(dur*SR); t=np.arange(n)/SR
    return (np.sin(2*np.pi*f*t)*np.exp(-t*2.2)+0.4*np.sin(2*np.pi*f*2.01*t)*np.exp(-t*4))*vel*0.3
def add(sig,at,g=1.0):
    i=int(at*SR); s=np.stack([sig,sig],1) if sig.ndim==1 else sig; j=min(N,i+len(s)); m[i:j]+=s[:j-i]*g
# sting: pad under the tagline from 84, bells + crash at the logo 87.3
pd=pad([50,57,62,66],7.5,0.9); add(pd,84.0,0.5)
for k,(f,off) in enumerate(((587.33,0),(739.99,0.07),(880.0,0.14),(1174.66,0.22))): add(bell(f,2.8,1-0.12*k),87.3+off,0.9)
add(impact(0.45),87.3,0.6); add(crash(0.3,2.0),87.3,0.35)
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
