# Kids English podcast generator (Kokoro TTS, multi-voice segments -> one MP3)
# Usage: python generate_podcast.py <spec.json>
# spec: {"outdir": "...", "episodes": {"u1": [
#          {"v": "zf_xiaobei", "lang": "cmn", "t": "中文講解…", "speed": 1.0},
#          {"v": "af_heart",   "lang": "en-us", "t": "English example.", "speed": 0.9},
#          {"pause": 0.6}, ... ]}}
import json
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

MODEL_DIR = Path(r"C:\Users\CloudKo_Home\py\kokoro_models")


def main():
    spec = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    outdir = Path(spec["outdir"])
    outdir.mkdir(parents=True, exist_ok=True)
    k = Kokoro(str(MODEL_DIR / "kokoro-v1.0.onnx"), str(MODEL_DIR / "voices-v1.0.bin"))

    with tempfile.TemporaryDirectory() as tmp:
        for name, segs in spec["episodes"].items():
            parts, sr = [], 24000
            for seg in segs:
                if "pause" in seg:
                    parts.append(np.zeros(int(sr * float(seg["pause"])), dtype=np.float32))
                    continue
                samples, sr = k.create(
                    seg["t"],
                    voice=seg.get("v", "zf_xiaobei"),
                    speed=float(seg.get("speed", 1.0)),
                    lang=seg.get("lang", "cmn"),
                )
                parts.append(samples.astype(np.float32))
                parts.append(np.zeros(int(sr * 0.35), dtype=np.float32))  # 段間小停頓
            audio = np.concatenate(parts)
            wav = Path(tmp) / f"{name}.wav"
            sf.write(wav, audio, sr)
            mp3 = outdir / f"{name}.mp3"
            subprocess.run(
                ["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-b:a", "80k", str(mp3)],
                check=True,
            )
            print(f"{name}.mp3 {len(audio)/sr:.0f}s ({mp3.stat().st_size // 1024} KB)")

    print(f"done: {len(spec['episodes'])} episodes -> {outdir}")


if __name__ == "__main__":
    main()
