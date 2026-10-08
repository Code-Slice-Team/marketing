import sys; sys.path.insert(0,'/home/claude/music')
from house import *
import wave, subprocess
# Film grid (VO +0.5): problem 0-19.6 | turn 19.6-22.5 | promise 22.5-38.9 | payoff 38.9-48.3 | sting 48.3-56
T=56.0; S=Session(T,100); B=S.B; s8=B/2
TURN=19.6; LG=48.4
# --- problem: minor drone, ticking, sparse sub pulse, growing unease ---
def drone(midis,dur,vel=1.0):
    n=int(dur*SR); t=np.arange(n)/SR; x=np.zeros(n)
    for m in midis:
        f=f_of(m); x+=np.sin(2*np.pi*f*t)*0.5+0.25*np.sin(2*np.pi*f*2.003*t)+0.12*saw(f,n,0.004)
    x=sosfilt(sos('low',500+300*np.sin(0)),x)
    return x*env(n,1.2,0.5,0.85,1.5,hold=max(0.1,dur-3.3))*vel*0.07
S.add('chords',drone([38,45,50],TURN+0.6,1.0),0.0)          # D minor-ish low drone
S.add('chords',drone([53,56],TURN-6.0,0.5),6.0)              # tension dyad from "يبيعون اسمك"
t=0.0; k=0
while t<TURN-0.4:
    if k%2==0: S.add('drums',rim(0.35),t,pan=0.3)            # tick
    if k%4==0: S.add('bass',logdrum(38,0.5,0.55),t)          # sub pulse on the beat
    if k%8==6 and t>6: S.add('drums',hat(0.3,0.05),t,pan=-0.3)
    t+=s8; k+=1
# unease swells: noise riser into the turn, impact on the turn
S.add('fx',riser(2.4,0.35),TURN-2.4); S.add('fx',impact(0.5),TURN); S.add('fx',downlifter(1.0,0.3),TURN)
# --- promise: warm major pad, soft 4/4 kick, shaker, pluck arpeggio ---
PROG=[[48,55,60,64],[45,52,57,60],[53,60,64,67],[55,59,62,67]]  # C, Am, F, G
bar=4*B; t=TURN; i=0
while t<LG-0.3:
    ch=PROG[i%4]
    S.add('chords',pad(ch,bar+0.4,0.55),t)
    S.add('chords',chord([m+12 for m in ch],s8*1.6,cutoff=2200,vel=0.5),t)
    for q in range(8):
        tt=t+q*s8
        if tt>=LG-0.3: break
        if q%2==0: S.add('drums',kick(0.8 if q==0 else 0.7),tt); S.kicks.append(tt)
        if q%2==1: S.add('drums',shaker(0.5),tt,pan=0.25)
        if q in (2,6): S.add('drums',clap(0.5),tt)
        if q%2==0: S.add('bass',logdrum(ch[0]-12,0.4,0.8),tt)
        if t>=TURN+bar and q in (0,3,5): S.add('lead',pluck(ch[(q//2)%4]+12,0.4,0.7),tt,pan=0.15)
    t+=bar; i+=1
S.add('fx',downlifter(0.8,0.25),22.5); S.add('fx',downlifter(0.8,0.25),38.9); S.add('fx',riser(1.6,0.3),LG-1.7)
m=S.mix(chord_sc=True); N=S.N
def bell(f,dur=2.4,vel=1.0):
    n=int(dur*SR); t=np.arange(n)/SR
    return (np.sin(2*np.pi*f*t)*np.exp(-t*2.2)+0.4*np.sin(2*np.pi*f*2.01*t)*np.exp(-t*4))*vel*0.3
def add(sig,at,g=1.0):
    i=int(at*SR); s=np.stack([sig,sig],1) if sig.ndim==1 else sig; j=min(N,i+len(s)); m[i:j]+=s[:j-i]*g
pd=pad([48,55,60,64],7.5,0.9); add(pd,LG-0.1,0.5)
for k,(f,off) in enumerate(((523.25,0),(659.25,0.07),(783.99,0.14),(1046.5,0.22))): add(bell(f,2.8,1-0.12*k),LG+off,0.9)
add(impact(0.45),LG,0.6); add(crash(0.3,2.0),LG,0.35)
m=sosfilt(sos('high',30),m,axis=0); m=np.tanh(m/(np.abs(m).max()*0.8)); m=m/np.abs(m).max()*0.42
subprocess.run(['ffmpeg','-y','-v','error','-i','vo.mp3','-ar',str(SR),'-ac','2','vo44.wav'],check=True)
w=wave.open('vo44.wav'); vo=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).reshape(-1,w.getnchannels())/32767.0
vo=vo/np.abs(vo).max()*0.95
i=int(0.5*SR); j=min(N,i+len(vo))
env_=np.sqrt(np.convolve(vo.mean(1)**2,np.ones(4410)/4410,'same')); d=1-0.5*np.clip(env_/(env_.max()+1e-9)*3,0,1)
duck=np.ones(N); duck[i:j]=d[:j-i]
k=np.ones(2205)/2205; duck=np.convolve(duck,k,'same')
mix=m*duck[:,None]; mix[i:j]+=vo[:j-i]
mix=np.clip(mix,-1,1)*np.clip((T-np.arange(N)/SR)/0.8,0,1)[:,None]
write('mix.wav',mix); write('bed.wav',m); print('ok',round(float(np.abs(mix).max()),2))
