import math
import os
from pathlib import Path

import numpy as np
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "static" / "bg.jpg"
OUT_DIR = ROOT / "static"

SIZES = [
    int(value)
    for value in os.environ.get("BG_SIZES", "384,512,640,768,1024").split(",")
    if value.strip()
]
FPS = int(os.environ.get("BG_FPS", "10"))
SECONDS = float(os.environ.get("BG_SECONDS", "1.5"))
QUALITY = int(os.environ.get("BG_QUALITY", "75"))
NIGHT = 0.0
INTENSITY = 0.4 + (0.065 - 0.4) * NIGHT
NOISE_SCALE = 1.0

frame_count = max(1, round(FPS * SECONDS))
source = ImageOps.exif_transpose(Image.open(SRC)).convert("RGB")

for size in SIZES:
    base = ImageOps.fit(
        source,
        (size, size),
        method=Image.Resampling.LANCZOS,
    )
    rgb = np.asarray(base, dtype=np.float32) / 255.0
    h, w = rgb.shape[:2]

    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    x += 0.5
    y += 0.5

    su = x * NOISE_SCALE / w
    sv = y * NOISE_SCALE / h
    seed = su * 12.9898 + sv * 78.233

    sigma = 0.75 + (0.6 - 0.75) * NIGHT
    o = sigma * sigma
    norm = 1.0 / (o * math.sqrt(2.0 * math.pi))
    gray = rgb @ np.array([0.299, 0.587, 0.114], dtype=np.float32)
    hashed = np.sin(seed) * 43758.5453

    frames = []
    for i in range(frame_count):
        t = i / FPS
        n = hashed + t * 1.5
        n = n - np.floor(n)
        gauss = norm * np.exp(-(n * n) / (2.0 * o * o))
        delta = gauss * (1.0 - gray) * INTENSITY
        out = np.clip(rgb + delta[..., None], 0.0, 1.0)
        frames.append(Image.fromarray((out * 255.0).round().astype(np.uint8), "RGB"))

    out_path = OUT_DIR / f"bg-grain-{size}.webp"
    frames[0].save(
        out_path,
        save_all=True,
        append_images=frames[1:],
        duration=round(1000 / FPS),
        loop=0,
        quality=QUALITY,
        method=6,
    )
    print(
        f"{out_path.relative_to(ROOT)}: {len(frames)} frames, "
        f"{FPS} fps, {SECONDS}s, {size}x{size}, "
        f"{os.path.getsize(out_path) / 1024 / 1024:.2f} MiB"
    )
