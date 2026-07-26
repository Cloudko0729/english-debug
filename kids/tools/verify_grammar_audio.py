"""Decode-check every MP3 path referenced by the F0–F7 grammar database."""

import json
import sys
from pathlib import Path

import soundfile as sf


ROOT = Path(__file__).resolve().parent.parent
DB_DIR = ROOT / "grammar_db"


def collect_audio(value, output: set[str]) -> None:
    if isinstance(value, dict):
        for child in value.values():
            collect_audio(child, output)
    elif isinstance(value, list):
        for child in value:
            collect_audio(child, output)
    elif isinstance(value, str) and value.lower().endswith(".mp3"):
        output.add(value)


def main() -> None:
    paths: set[str] = set()
    for filename in (DB_DIR / "bands").glob("*.json"):
        collect_audio(json.loads(filename.read_text(encoding="utf-8")), paths)

    errors: list[str] = []
    durations: list[float] = []
    sample_rates: set[int] = set()
    channels: set[int] = set()
    for relative in sorted(paths):
        filename = ROOT / relative
        try:
            info = sf.info(filename)
            duration = info.frames / info.samplerate
            if duration < 0.1:
                errors.append(f"{relative}: duration {duration:.3f}s")
            durations.append(duration)
            sample_rates.add(info.samplerate)
            channels.add(info.channels)
        except Exception as exc:  # noqa: BLE001 - report every unreadable asset
            errors.append(f"{relative}: {exc}")

    if errors:
        print(f"Grammar audio verification failed ({len(errors)}):", file=sys.stderr)
        for error in errors:
            print(f"- {error}", file=sys.stderr)
        raise SystemExit(1)

    print(
        json.dumps(
            {
                "ok": True,
                "files": len(paths),
                "sampleRates": sorted(sample_rates),
                "channels": sorted(channels),
                "minimumDurationSeconds": round(min(durations), 3),
                "maximumDurationSeconds": round(max(durations), 3),
                "totalDurationMinutes": round(sum(durations) / 60, 2),
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
