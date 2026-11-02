#!/usr/bin/env python3

import argparse
import os
import re
import shutil
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BUILD = ROOT / ".zola-build"
CONTENT = ROOT / "content"
CONFIG = ROOT / "config.toml"
PUBLIC = ROOT / "public"
STATIC = ROOT / "static"
TEMPLATES = ROOT / "templates"
THEMES = ROOT / "themes"
ONDINE_URL = "https://github.com/gicrisf/ondine-cli"
KATEX_RENDER_INSTALL_URL = "https://raw.githubusercontent.com/gicrisf/katex-render/main/install.sh"
MATH_RUNTIME_SCRIPT = re.compile(
    r'\s*<script\b[^>]*\bsrc="[^"]*'
    r'(?:katex\.min\.js|auto-render\.min\.js|assets/js/math\.js)'
    r'[^"]*"[^>]*>\s*</script>',
    re.IGNORECASE,
)


def find_ondine() -> str:
    override = os.environ.get("ONDINE_BIN")
    if override:
        return override

    found = shutil.which("ondine")
    if found:
        return found

    raise SystemExit(
        "ondine not found. Set ONDINE_BIN or install it with:\n"
        f"  cargo install --git {ONDINE_URL} --locked --bin ondine"
    )


def find_katex_render() -> str:
    override = os.environ.get("KATEX_RENDER_BIN")
    if override:
        return override

    found = shutil.which("katex-render")
    if found:
        return found

    raise SystemExit(
        "katex-render not found. Set KATEX_RENDER_BIN or install it with:\n"
        f"  curl -fsSL {KATEX_RENDER_INSTALL_URL} | bash"
    )


def is_markdown(path: Path) -> bool:
    return path.suffix.lower() in {".md", ".markdown"}


def generate_social_images() -> None:
    script = ROOT / "scripts" / "social_images.py"
    subprocess.run([sys.executable, str(script)], cwd=ROOT, check=True)


def link(path: Path, target: Path) -> None:
    if path.is_symlink() or path.is_file():
        path.unlink()
    elif path.is_dir():
        shutil.rmtree(path)

    path.symlink_to(target, target_is_directory=target.is_dir())


def ensure_root() -> None:
    BUILD.mkdir(exist_ok=True)
    link(BUILD / "config.toml", CONFIG)
    link(BUILD / "static", STATIC)
    link(BUILD / "templates", TEMPLATES)
    link(BUILD / "themes", THEMES)


def copy_content_assets(output: Path) -> None:
    for source in CONTENT.rglob("*"):
        if not source.is_file() or is_markdown(source):
            continue

        destination = output / source.relative_to(CONTENT)
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, destination)


def prepare_content(ondine: str) -> None:
    output = BUILD / "content"
    shutil.rmtree(output, ignore_errors=True)
    output.mkdir(parents=True)

    copy_content_assets(output)

    result = subprocess.run(
        [ondine, "markdown", str(CONTENT), "--out-dir", str(output)],
        cwd=ROOT,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        sys.stderr.write(result.stderr)
        raise subprocess.CalledProcessError(result.returncode, result.args)


def render_math(katex_render: str) -> None:
    subprocess.run(
        [katex_render, "--root", str(PUBLIC)],
        cwd=ROOT,
        check=True,
    )


def strip_runtime_math_scripts() -> None:
    for path in PUBLIC.rglob("*.html"):
        source = path.read_text()
        output = MATH_RUNTIME_SCRIPT.sub("", source)
        if output != source:
            path.write_text(output)


def strip_runtime_math_assets() -> None:
    for relative in (
        "assets/katex/katex.min.js",
        "assets/katex/auto-render.min.js",
        "assets/js/math.js",
    ):
        (PUBLIC / relative).unlink(missing_ok=True)


def zola(command: str, args: list[str]) -> int:
    result = subprocess.run(
        ["zola", "--root", str(BUILD), command, *args],
        cwd=ROOT,
    )
    return result.returncode


def build(ondine: str, katex_render: str, args: list[str]) -> int:
    generate_social_images()
    ensure_root()
    prepare_content(ondine)
    code = zola("build", ["--force", "--output-dir", str(PUBLIC), *args])
    if code:
        return code

    render_math(katex_render)
    strip_runtime_math_scripts()
    strip_runtime_math_assets()
    return 0


def check(ondine: str, args: list[str]) -> int:
    ensure_root()
    prepare_content(ondine)
    return zola("check", args)


def snapshot() -> dict[Path, tuple[int, int]]:
    state = {}
    for base in (CONTENT, CONFIG):
        paths = [base] if base.is_file() else base.rglob("*")
        for path in paths:
            if path.is_file():
                stat = path.stat()
                state[path] = (stat.st_mtime_ns, stat.st_size)
    return state


def serve(ondine: str, args: list[str]) -> int:
    generate_social_images()
    ensure_root()
    prepare_content(ondine)

    process = subprocess.Popen(["zola", "--root", str(BUILD), "serve", *args], cwd=ROOT)
    state = snapshot()

    try:
        while process.poll() is None:
            time.sleep(0.8)
            next_state = snapshot()
            if next_state == state:
                continue

            state = next_state
            print("content changed; reprocessing Mermaid fences", file=sys.stderr)
            try:
                prepare_content(ondine)
            except subprocess.CalledProcessError:
                print("reprocessing failed; keeping the previous build", file=sys.stderr)
    except KeyboardInterrupt:
        process.terminate()

    return process.wait()


def main() -> int:
    parser = argparse.ArgumentParser(prog="site.py")
    subparsers = parser.add_subparsers(dest="command", required=True)

    for name in ("build", "check", "serve"):
        subparsers.add_parser(name)

    parsed, zola_args = parser.parse_known_args()
    ondine = find_ondine()

    if parsed.command == "build":
        return build(ondine, find_katex_render(), zola_args)
    if parsed.command == "check":
        return check(ondine, zola_args)
    return serve(ondine, zola_args)


if __name__ == "__main__":
    raise SystemExit(main())
