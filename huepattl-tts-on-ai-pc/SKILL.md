---
name: huepattl-tts-on-ai-pc
description: Use when narration, voice-over or other speech audio has to be generated (text to speech, Qwen3-TTS, voice cloning) and the Mac has too little memory, or when any GPU job should run on the home AI "PC" over SSH and the PC must be left as it was.
---

# Text to speech on the AI PC

Heavy speech synthesis runs on the home PC's GPU over SSH; the Mac only prepares the texts and
encodes the results. The PC is a shared machine (Ollama for chat): after a job it must be exactly
as before.

Proven 2026-11-15: 144 To Boldly Glow clips (two voices, en/de) in one unattended hour; the PC was
restored afterwards (Ollama model reloaded, nothing left running).

## The machine

Its address, SSH user, wake-on-LAN address, GPU, the services that share it and how it decides to
sleep are in **`machine.md` next to this file** - local only, not in the public repository. Read
it first; if it is missing, ask the owner. What matters for every job:

- Wake it if it does not answer (wake-on-LAN); a machine that lost power cannot be woken.
- Know the GPU's generation: older NVIDIA cards (Pascal and before) have no bfloat16 and slow
  float16 - run in float32; pick a PyTorch CUDA build that still lists the card's architecture
  (`torch.cuda.get_arch_list()`).
- Know what else holds GPU memory (a chat model kept loaded) and how to unload and reload it.
- Know what puts the machine to sleep and what counts as "busy" for it.

## Leave no trace

Everything lives in `~/tts`; `rm -rf ~/tts` removes all of it. No apt packages, no services.

```
~/tts/env.sh       # PATH (bin), UV_CACHE_DIR, UV_PYTHON_INSTALL_DIR, HF_HOME - all inside ~/tts
~/tts/bin/uv       # uv as a single binary (UV_INSTALL_DIR=~/tts/bin, INSTALLER_NO_MODIFY_PATH=1)
~/tts/bin/keep-awake.sh <pid>   # see "Staying awake"
~/tts/venv         # Python 3.12 (uv-managed) + torch/torchaudio cu126 + the TTS package
~/tts/hf           # downloaded models
~/tts/jobs/<name>  # one folder per job
```

## A job, in order

1. **Reachable?** `ssh ... true`; otherwise wake it and retry for a minute.
2. **Free the GPU** (the chat model: see machine.md): `curl -s localhost:11434/api/generate -d '{"model":"<chat model>","keep_alive":0}'`,
   then `nvidia-smi --query-gpu=memory.used --format=csv` shows a few MiB.
3. **Inputs:** `rsync -aR` the job's files into `~/tts/jobs/<name>/` (keep the project's relative
   layout so its scripts find their paths).
4. **Run detached** - SSH drops when the Mac sleeps:
   `cd ~/tts/jobs/<name>/... && . ~/tts/env.sh && nohup setsid ~/tts/venv/bin/python script.py ... > ~/tts/jobs/<name>/log 2>&1 < /dev/null &`,
   then start `~/tts/bin/keep-awake.sh <its pid>` the same way. Poll the log.
5. **Fetch** the results with `rsync`.
6. **Restore:** `curl -s localhost:11434/api/generate -d '{"model":"<chat model>","keep_alive":-1}'`
   (as `ollama-preload.service` does), check `curl -s localhost:11434/api/ps` lists it and no job or
   keep-awake process is left (`pgrep -af tts/`).

## Staying awake

Without sudo the sleep timer cannot be stopped and `systemd-inhibit` is denied. GPU load keeps the
PC awake while it synthesizes, but downloads and model loading do not. `keep-awake.sh <pid>` sends
a request for a model that does not exist to Ollama every 5 minutes while that process lives: it
loads nothing, Ollama logs `POST "/api/chat"` (404), and smart-suspend counts that as activity.
With the owner's sudo password: `sudo systemctl stop smart-suspend.timer` before, `start` after.

## To Boldly Glow narration (Qwen3-TTS)

Project: `packages/data-pipeline/narration/` (`synthesize.py`, `voices/`, `texts.json` from
`npm run narrate:export`, manifest in `packages/app/public/narration/manifest.json`).

- On the PC: `python synthesize.py build --masters-only` speaks the stale clips into
  `work/masters/<voice>/<locale>/<id>.wav` and lists them in `work/masters/pending.json`
  (an interrupted run resumes). Clone model `Qwen/Qwen3-TTS-12Hz-0.6B-Base`, float32 on Pascal
  (`synthesize.py` picks it), seed 1977. `design` (the 1.7B VoiceDesign model) is only for new
  voices and is too big for 6 GB in float32.
- Back on the Mac: rsync `work/masters/` home, then `synthesize.py encode` (ffmpeg: loudnorm
  I=-16/TP=-1.5/LRA=11, mono Opus 32 kbit/s 48 kHz WebM + MP3 64 kbit/s 44.1 kHz) writes the clips
  and the manifest. Then `npm test` in `packages/app` (the manifest test checks every clip).
- Lessons/tours whose clips are new are listed in `UNRECORDED_LESSONS` / `UNRECORDED_MISSIONS`
  (`packages/app/src/narration/narrationSegments.ts`); remove them once their clips exist.

## Common mistakes

- `pgrep -f`/`pkill -f <pattern>` over `ssh host '...'` matches the remote shell's own command line
  (it contains the pattern): pgrep reports a finished job as running, pkill kills your own SSH
  session. Use `ps -eo pid,args | grep "[p]attern"` and kill by PID.

- Loading in bfloat16 or float16 on the GTX 1060: errors or crawls - use float32.
- Forgetting to reload the Ollama model: the owner's chat starts cold (~1 min) next time.
- Running in the foreground over SSH: the job dies when the Mac sleeps.
- Installing with apt or pip into the system: not removable with `~/tts`.
