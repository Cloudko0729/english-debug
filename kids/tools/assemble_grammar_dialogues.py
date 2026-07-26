"""Assemble pre-generated grammar dialogue lines into complete MP3 conversations.

Usage:
    python kids/tools/assemble_grammar_dialogues.py
    python kids/tools/assemble_grammar_dialogues.py --force
"""

import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
DB_DIR = ROOT / "grammar_db" / "bands"
FORCE = "--force" in sys.argv


def find_ffmpeg() -> str:
    executable = shutil.which("ffmpeg")
    if executable:
        return executable
    try:
        import imageio_ffmpeg

        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError as exc:
        raise RuntimeError("ffmpeg or imageio-ffmpeg is required") from exc


def quote_for_concat(filename: Path) -> str:
    return filename.resolve().as_posix().replace("'", "'\\''")


def assemble(ffmpeg: str, line_paths: list[Path], output: Path, silence: Path, temp_dir: Path) -> bool:
    if output.exists() and not FORCE:
        print(f"{output.name} (skip, exists)")
        return False
    missing = [filename for filename in line_paths if not filename.exists()]
    if missing:
        raise FileNotFoundError(f"Missing dialogue line: {missing[0]}")
    output.parent.mkdir(parents=True, exist_ok=True)
    list_file = temp_dir / f"{output.stem}.txt"
    rows: list[str] = []
    for index, filename in enumerate(line_paths):
        rows.append(f"file '{quote_for_concat(filename)}'")
        if index < len(line_paths) - 1:
            rows.append(f"file '{quote_for_concat(silence)}'")
    list_file.write_text("\n".join(rows) + "\n", encoding="utf-8")
    subprocess.run(
        [
            ffmpeg,
            "-y",
            "-loglevel",
            "error",
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            str(list_file),
            "-ar",
            "24000",
            "-ac",
            "1",
            "-b:a",
            "96k",
            str(output),
        ],
        check=True,
    )
    print(f"{output.name} ({output.stat().st_size // 1024} KB)")
    return True


def main() -> None:
    ffmpeg = find_ffmpeg()
    jobs: list[tuple[list[Path], Path]] = []
    for number in range(8):
        data = json.loads((DB_DIR / f"f{number}.json").read_text(encoding="utf-8"))
        for node in data["nodes"]:
            lines = [ROOT / turn["audio"] for turn in node["dialogue"]["turns"]]
            jobs.append((lines, ROOT / node["dialogue"]["fullAudio"]))

    built = 0
    with tempfile.TemporaryDirectory() as temp:
        temp_dir = Path(temp)
        silence = temp_dir / "silence.mp3"
        subprocess.run(
            [
                ffmpeg,
                "-y",
                "-loglevel",
                "error",
                "-f",
                "lavfi",
                "-i",
                "anullsrc=r=24000:cl=mono",
                "-t",
                "0.22",
                "-b:a",
                "96k",
                str(silence),
            ],
            check=True,
        )
        for lines, output in jobs:
            built += int(assemble(ffmpeg, lines, output, silence, temp_dir))
    print(f"done: {built} built, {len(jobs) - built} skipped, {len(jobs)} total")


if __name__ == "__main__":
    main()
