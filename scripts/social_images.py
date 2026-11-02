#!/usr/bin/env python3

"""Generate Open Graph cards for every content page with takumi-render."""

from __future__ import annotations

import base64
import html
import json
import os
import re
import shutil
import string
import subprocess
import sys
import tempfile
import tomllib
import unicodedata
from datetime import date, datetime
from pathlib import Path, PurePosixPath

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content"
STATIC = ROOT / "static"
THEME = ROOT / "themes" / "mono"
OUTPUT = STATIC / "og"
TEMPLATE = ROOT / "scripts" / "social-card.html"

WIDTH = 1200
HEIGHT = 630
CONTENT_WIDTH = WIDTH - 2 * 44 - 2 * 56


def split_front_matter(source: str) -> tuple[dict, str]:
    if not source.startswith("+++\n"):
        return {}, source

    end = source.find("\n+++\n", 4)
    if end == -1:
        raise ValueError("unterminated TOML front matter")

    return tomllib.loads(source[4 : end + 1]), source[end + 5 :]


def markdown_files(directory: Path):
    data = []
    for path in directory.rglob("*.md"):
        if path.is_file():
            data.append(path)
    return sorted(data)


def clean_key(value: str) -> str:
    segments = value.replace("\\", "/").split("/")
    return "/".join(segment for segment in segments if segment and segment not in {".", ".."})


def slugify(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value)
    ascii_value = normalized.encode("ascii", "ignore").decode("ascii").lower()
    return re.sub(r"[^a-z0-9]+", "-", ascii_value).strip("-")


def slug_path(value: str) -> str:
    return "/".join(filter(None, (slugify(segment) for segment in clean_key(value).split("/"))))


def key_for(relative: str, data: dict) -> str:
    path = PurePosixPath(relative)
    directory = str(path.parent)
    base = path.name
    directory_key = "" if directory == "." else slug_path(directory)

    if base in {"_index.md", "index.md"}:
        key = directory_key or "home"
    else:
        filename = slugify(base[:-3])
        key = f"{directory_key}/{filename}" if directory_key else filename

    path_override = data.get("path")
    if isinstance(path_override, str) and path_override.strip():
        key = clean_key(path_override)

    slug_override = data.get("slug")
    if isinstance(slug_override, str) and slug_override.strip() and base != "_index.md":
        parent = str(PurePosixPath(key).parent)
        key = clean_key(slug_override if parent == "." else f"{parent}/{slug_override}")

    return key or "home"


def plain_text(markdown: str) -> str:
    text = re.sub(r"```.*?```", " ", markdown, flags=re.S)
    text = re.sub(r"~~~.*?~~~", " ", text, flags=re.S)
    text = re.sub(r"{%\s*(?:raw|endraw)\s*%}", " ", text)
    text = re.sub(r"!\[[^\]]*\]\([^)]*\)", " ", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"^#{1,6}\s+.*$", " ", text, flags=re.M)
    text = re.sub(r"^[ \t]*[-*+]\s+", "", text, flags=re.M)
    text = re.sub(r"^[ \t]*\d+\.\s+", "", text, flags=re.M)
    text = re.sub(r"[*_~`>#]", "", text)
    text = re.sub(r"&[a-z]+;", " ", text, flags=re.I)
    return re.sub(r"\s+", " ", text).strip()


def summary(body: str) -> str:
    intro = body.split("<!-- more -->", 1)[0]
    for paragraph in re.split(r"\n{2,}", intro):
        text = plain_text(paragraph)
        if text:
            return text[:240].strip()
    return ""


def format_date(value) -> str:
    if isinstance(value, datetime):
        return value.date().isoformat().replace("-", ".")
    if isinstance(value, date):
        return value.isoformat().replace("-", ".")
    if isinstance(value, str) and len(value) >= 10:
        return value[:10].replace("-", ".")
    return ""


def title_for(data: dict, relative: str) -> str:
    title = data.get("title")
    if isinstance(title, str) and title.strip():
        return title.strip()
    return PurePosixPath(relative).stem.replace("_", " ").replace("-", " ")


def description_for(data: dict, body: str, fallback: str) -> str:
    extra = data.get("extra") if isinstance(data.get("extra"), dict) else {}
    candidates = [data.get("description"), extra.get("lead"), summary(body), fallback]
    for candidate in candidates:
        if isinstance(candidate, str) and candidate.strip():
            return plain_text(candidate)[:260].strip()
    return fallback


def label_for(key: str, sections: dict[str, str]) -> str:
    if key == "home":
        return "about"
    if key == "posts":
        return "Blog"
    if key.startswith("posts/"):
        return "Posts"
    if key == "projects":
        return "Projects"

    if key.startswith("projects/"):
        parts = key.split("/")
        project_key = f"projects/{parts[1]}"
        if key == project_key:
            return "Projects"
        project = sections.get(project_key)
        if project:
            return project

    parent = str(PurePosixPath(key).parent)
    while parent and parent != ".":
        title = sections.get(parent)
        if title:
            return title
        parent = str(PurePosixPath(parent).parent)

    return "Zwit"


def data_url(mime: str, path: Path) -> str:
    encoded = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{encoded}"


def find_takumi_render() -> str:
    override = os.environ.get("TAKUMI_RENDER_BIN")
    if override:
        return override

    found = shutil.which("takumi-render")
    if found:
        return found

    for candidate in (
        ROOT / "target" / "release" / "takumi-render",
        ROOT.parent / "takumi-render" / "target" / "release" / "takumi-render",
    ):
        if candidate.is_file():
            return str(candidate)

    raise SystemExit(
        "takumi-render not found. Set TAKUMI_RENDER_BIN or install it with:\n"
        "  cargo install --path ../takumi-render --locked"
    )


def render_card(template: string.Template, card: dict, background: str, logo: str) -> str:
    label = card.get("label")
    label_html = ""
    if label:
        label_html = (
            '<span style="background-color:#fff3a8;border:3px solid #000000;'
            'box-shadow:4px 4px 0 #000000;font-size:24px;font-weight:500;'
            f'padding:6px 16px">{html.escape(label)}</span>'
        )

    title = card["title"]
    title_size = max(56, min(88, int(CONTENT_WIDTH / (0.6 * max(len(title), 1)))))

    return template.safe_substitute(
        background=background,
        logo=logo,
        label=label_html,
        title_size=title_size,
        title=html.escape(title),
        description=html.escape(card["description"]),
        footer=html.escape(card["footer"]),
    )


def main() -> int:
    config = tomllib.loads((ROOT / "config.toml").read_text())
    site_title = str(config.get("title") or "Zwit")
    site_description = str(config.get("description") or "")

    entries = []
    for path in markdown_files(CONTENT):
        relative = path.relative_to(CONTENT).as_posix()
        data, body = split_front_matter(path.read_text())
        if data.get("draft") is True:
            continue
        entries.append(
            {
                "body": body,
                "data": data,
                "is_section": PurePosixPath(relative).name == "_index.md",
                "key": key_for(relative, data),
                "relative": relative,
                "title": title_for(data, relative),
            }
        )

    sections = {
        entry["key"]: entry["title"]
        for entry in entries
        if entry["is_section"]
    }

    background = data_url("image/jpeg", STATIC / "bg.jpg")
    logo = data_url("image/svg+xml", STATIC / "logo" / "orbital-D-icon.svg")
    template = string.Template(TEMPLATE.read_text())

    cards = []
    for entry in entries:
        description = description_for(entry["data"], entry["body"], site_description)
        date_text = format_date(entry["data"].get("date"))
        footer = "home" if entry["key"] == "home" else date_text or f"/{entry['key']}/"
        cards.append(
            {
                "description": description,
                "footer": footer,
                "key": entry["key"],
                "label": label_for(entry["key"], sections),
                "title": entry["title"],
            }
        )

    cards.append(
        {
            "description": site_description,
            "footer": "site",
            "key": "default",
            "label": None,
            "title": site_title,
        }
    )

    shutil.rmtree(OUTPUT, ignore_errors=True)
    OUTPUT.mkdir(parents=True)

    with tempfile.TemporaryDirectory(prefix="zwit-social-") as temporary:
        temporary_path = Path(temporary)
        manifest_cards = []
        for card in cards:
            html_path = temporary_path / f"{card['key']}.html"
            html_path.parent.mkdir(parents=True, exist_ok=True)
            html_path.write_text(render_card(template, card, background, logo))
            manifest_cards.append(
                {
                    "input": str(html_path),
                    "output": str(OUTPUT / f"{card['key']}.png"),
                    "width": WIDTH,
                    "height": HEIGHT,
                }
            )

        manifest_path = temporary_path / "manifest.json"
        manifest_path.write_text(
            json.dumps(
                {
                    "fonts": [str(THEME / "static" / "fonts")],
                    "cards": manifest_cards,
                }
            )
        )

        subprocess.run(
            [find_takumi_render(), "batch", str(manifest_path)],
            cwd=ROOT,
            check=True,
        )

    print(f"social images: wrote {len(cards)} cards to {OUTPUT.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
