+++
title = "Quick Start"
description = "Install takumi-render and render a first HTML card to PNG."
draft = false
weight = 10
[extra]
  lead = "Install takumi-render, write a card in HTML, and render it with a font directory."
  toc = true
+++

## Requirements {#requirements}

The prebuilt binary targets Linux `x86_64`. Building from source requires Rust 1.91 or newer.

Takumi Render does not need Node.js, npm, or WebAssembly at runtime. It does need at least one font file because Takumi does not load system fonts.


## Install {#install}

Download the latest Linux `x86_64` release from the [releases page](https://github.com/gicrisf/takumi-render/releases), or install from source:

```sh
cargo install --git https://github.com/gicrisf/takumi-render --locked
```

See [Installation](/projects/takumi-render/getting-started/installation/) for manual download and verification steps.


## Write a card {#write-a-card}

Create `card.html`. Set explicit dimensions on the root element so the layout fills the image:

```html
<!doctype html>
<html>
<body style="margin:0">
  <div style="width:1200px;height:630px;display:flex;align-items:center;justify-content:center;background:#ececec;font-family:'IBM Plex Mono',monospace">
    <h1 style="font-size:72px">Hello from Takumi</h1>
  </div>
</body>
</html>
```

The font family name must match a font registered from `--fonts-dir`.


## Render the card {#render-the-card}

```sh
takumi-render render \
  --html card.html \
  --output card.png \
  --fonts-dir path/to/fonts
```

The default image is 1200×630. Override it with `--width` and `--height`:

```sh
takumi-render render \
  --html card.html \
  --output card.png \
  --width 800 \
  --height 400 \
  --fonts-dir path/to/fonts
```

To read HTML from standard input, use `--html -` or omit `--html`:

```sh
cat card.html | takumi-render render --output card.png --fonts-dir path/to/fonts
```


## Batch mode {#batch-mode}

For many cards, use a manifest so fonts load once:

```sh
takumi-render batch cards.json --fonts-dir path/to/fonts
```

See [Batch Manifests](/projects/takumi-render/reference/batch-manifests/) for the JSON shape.


## Next steps {#next-steps}

-   [Installation](/projects/takumi-render/getting-started/installation/)
-   [Usage](/projects/takumi-render/getting-started/usage/)
-   [Batch Manifests](/projects/takumi-render/reference/batch-manifests/)
