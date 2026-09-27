#!/usr/bin/env bash
# Composite the IraqiStar star-welcome concept sample.
# Inputs (next to this script): male.mp4, female.mp4 (9:16, speech audio), overlay.png (from overlay.mjs)
# Output: iraqistar-star-welcome-sample.mp4 — 15s, 1080x1920, 30fps, 7.5s + 7.5s hard cut.
# If a clip's speech runs past its 7.5s slot, that clip is sped up just enough to fit (pitch preserved).
set -euo pipefail
cd "$(dirname "$0")"
SEG=7.5

speech_end() { # time the last speech ends (start of trailing silence), else clip duration
  local f=$1 dur last
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
  last=$(ffmpeg -hide_banner -i "$f" -af silencedetect=n=-35dB:d=0.25 -f null - 2>&1 | awk '/silence_start/{s=$NF} /silence_end/{e=1} END{print s}')
  python3 -c "d=$dur; s='$last'; s=float(s) if s else d; print(s if s>1 else d)"
}
factor() { python3 -c "e=$1; print(max(1.0, round((e+0.15)/$SEG, 4)))"; }

EM=$(speech_end male.mp4);  FM=$(factor "$EM")
EF=$(speech_end female.mp4); FF=$(factor "$EF")
echo "male speech ends ${EM}s -> speed x${FM};  female speech ends ${EF}s -> speed x${FF}"

ffmpeg -y -loglevel error -i male.mp4 -i female.mp4 -i overlay.png -filter_complex "
[0:v]setpts=PTS/$FM,trim=0:$SEG,setpts=PTS-STARTPTS,fps=30,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1[v0];
[1:v]setpts=PTS/$FF,trim=0:$SEG,setpts=PTS-STARTPTS,fps=30,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1[v1];
[0:a]aresample=48000,aformat=channel_layouts=stereo,atempo=$FM,atrim=0:$SEG,asetpts=PTS-STARTPTS,apad=whole_dur=$SEG,afade=t=out:st=7.47:d=0.03[a0];
[1:a]aresample=48000,aformat=channel_layouts=stereo,atempo=$FF,atrim=0:$SEG,asetpts=PTS-STARTPTS,apad=whole_dur=$SEG,afade=t=in:d=0.02,afade=t=out:st=7.4:d=0.1[a1];
[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a];
[v][2:v]overlay=0:0:format=auto,format=yuv420p[vo];
[a]loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000,aformat=sample_fmts=fltp:channel_layouts=stereo[ao]" \
 -map "[vo]" -map "[ao]" -c:v libx264 -preset slow -crf 18 -profile:v high -r 30 -c:a aac -b:a 192k -ar 48000 -movflags +faststart \
 iraqistar-star-welcome-sample.mp4
ffprobe -v error -show_entries format=duration:stream=codec_type,width,height -of compact iraqistar-star-welcome-sample.mp4
