# Site background

This directory documents the background treatment used by the site and keeps
the retired WebGL experiment available for reference.

The production background is now a static image with a pre-rendered animated
grain layer, delivered as responsive animated WebP files.

## Current implementation

The page renders:

- `static/bg.jpg` as the photographic base and static fallback.
- `static/bg-grain-384.webp`, `640`, `768`, and `1024` as animated,
  pre-grained variants generated from the same source.
- A CSS opacity fade from `0` to the value in `static/custom.css`.

The markup lives in `templates/index.html` and uses `<picture>`:

1. Every WebP `<source>` starts with `sizes="1px"`, so the browser always
   selects `384w` first.
2. The `<img>` rendered by `image.render` remains the static fallback.
3. The inline script adds `is-loaded` when the `384w` image loads, which starts
   the CSS fade.
4. After the first paint, if the viewport is wider than `640px` and the
   connection is not Save-Data/2G/3G, the script sets `sizes="100vw"` on the
   sources. The browser then upgrades to the media-capped target.

The media caps are in `config.toml` as
`[[extra.background_image_animated]]` groups:

- viewport up to `640px`: `384w`
- viewport up to `768px`: `384w` and `640w`
- viewport up to `1024px`: `384w` and `768w`
- larger viewports: `384w` and `1024w`

They are intentional: a plain `srcset` would still let a high-DPR phone select
the largest file. The caps guarantee that small viewports never request the
`1024w` variant.

| Variant | Approx. size |
| --- | --- |
| `bg-grain-384.webp` | 0.37 MiB |
| `bg-grain-640.webp` | 0.97 MiB |
| `bg-grain-768.webp` | 1.36 MiB |
| `bg-grain-1024.webp` | 2.35 MiB |

Small screens (`<=640px`) keep `384w` and do not upgrade. Larger screens
download `384w` first and then the selected variant, so the background appears
quickly at the cost of one extra small request. Save-Data and 2G/3G connections
also stay on `384w`.

| Screen | Downloads |
| --- | --- |
| `<=640px` | `384w` only |
| `641–768px` | `384w` + `640w` |
| `769–1024px` | `384w` + `768w` |
| `>1024px` | `384w` + `1024w` |

The browser caches both files across page navigations.

### Why not let Zola resize the WebP?

`image.render` uses `resize_image`, which decodes and re-encodes a single frame.
That would flatten the animated WebP. The animated files are therefore served
directly from `static/` and the responsive list is written manually in
`config.toml`.

## Generating the assets

The generator is `site-bg/generator/make_bg_grain.py`. It reads
`static/bg.jpg`, applies the keep-color grain formula from the old shader, and
writes the animated WebP variants into `static/`.

Run it from the repository root:

```bash
nix-shell -p python3 python3Packages.pillow python3Packages.numpy \
  --run "python site-bg/generator/make_bg_grain.py"
```

Optional environment variables:

| Variable | Default | Meaning |
| --- | --- | --- |
| `BG_SIZES` | `384,640,768,1024` | Comma-separated square sizes |
| `BG_FPS` | `10` | Frames per second |
| `BG_SECONDS` | `1.5` | Loop length |
| `BG_QUALITY` | `75` | Lossy WebP quality |

Each variant has 15 frames at the current settings. Regenerate everything after
changing `static/bg.jpg` or the grain parameters.

The grain math is the keep-color variant of the shader: it computes
display-referred luminance, adds the Gaussian grain delta, and returns
`color + delta`. The source color is preserved.

## WebGL archive

`site-bg/webgl/` contains the retired WebGL version:

- `site-bg-grain.js` — the full JavaScript as used, including the inline shader
- `site-bg-grain.frag` and `site-bg-grain.vert` — extracted shader sources
- `site-bg-webgl.css` — canvas and fade rules
- `bootstrap.html` — the template markup and load/fallback bootstrap
- `README.md` — context for the archived experiment

The WebGL version was removed because it kept a full-screen fragment shader
running at display refresh rate and produced intermittent compositor/geometry
artifacts. The animated WebP keeps the look while moving the work to image
decoding at 10fps.

See `BACKLOG.md` for the chronological evolution and remaining ideas.
