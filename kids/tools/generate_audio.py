# Kids English audio generator (Kokoro TTS, voice: af_heart)
# Usage: python generate_audio.py <items.json>
# items.json: {"outdir": "...", "voice": "af_heart", "speed": 0.9,
#              "items": {"filename": "text to speak", ...}}
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import soundfile as sf
from kokoro_onnx import Kokoro

MODEL_DIR = Path(r"C:\Users\CloudKo_Home\py\kokoro_models")


def find_ffmpeg():
    executable = shutil.which("ffmpeg")
    if executable:
        return executable
    try:
        import imageio_ffmpeg

        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError as exc:
        raise RuntimeError("ffmpeg or imageio-ffmpeg is required to create MP3 files") from exc


def main():
    spec = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    outdir = Path(spec["outdir"])
    outdir.mkdir(parents=True, exist_ok=True)
    voice = spec.get("voice", "af_heart")
    speed = spec.get("speed", 0.9)
    ffmpeg = find_ffmpeg()

    kokoro = Kokoro(str(MODEL_DIR / "kokoro-v1.0.onnx"), str(MODEL_DIR / "voices-v1.0.bin"))

    with tempfile.TemporaryDirectory() as tmp:
        for name, text in spec["items"].items():
            mp3 = outdir / f"{name}.mp3"
            if mp3.exists():
                print(f"{name}.mp3 (skip, exists)")
                continue
            samples, sr = kokoro.create(text, voice=voice, speed=speed, lang="en-us")
            wav = Path(tmp) / f"{name}.wav"
            sf.write(wav, samples, sr)
            subprocess.run(
                [ffmpeg, "-y", "-loglevel", "error", "-i", str(wav), "-b:a", "96k", str(mp3)],
                check=True,
            )
            print(f"{name}.mp3 ({mp3.stat().st_size // 1024} KB)")

    print(f"done: {len(spec['items'])} files -> {outdir}")


if __name__ == "__main__":
    main()
