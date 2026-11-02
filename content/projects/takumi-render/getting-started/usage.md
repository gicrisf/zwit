+++
title = "Usage"
description = "Render one HTML file or a batch manifest to PNG."
draft = false
weight = 30
[extra]
  lead = "Render one HTML file or a batch manifest, with explicit fonts, dimensions, and outputs."
  toc = true
+++

## Render one file {#render-one-file}

```sh
takumi-render render \
  --html card.html \
  --output card.png \
  --width 1200 \
  --height 630 \
  --fonts-dir path/to/fonts
```

`--html` defaults to `-`, so standard input works without an extra flag:

```sh
cat card.html | takumi-render render --output card.png --fonts-dir path/to/fonts
```


### Render options {#render-options}

| Option                  | Meaning                                                |
|-------------------------|--------------------------------------------------------|
| `--html <FILE>`         | HTML file to read. Defaults to `-` for standard input. |
| `-o`, `--output <FILE>` | PNG file to write. Required.                           |
| `--width <PX>`          | Image width. Defaults to 1200.                         |
| `--height <PX>`         | Image height. Defaults to 630.                         |
| `--fonts-dir <DIR>`     | Font directory. Repeat for multiple directories.       |
| `-h`, `--help`          | Print usage.                                           |
| `-V`, `--version`       | Print the version.                                     |


## Batch mode {#batch-mode}

```sh
takumi-render batch cards.json --fonts-dir path/to/fonts
```

Batch mode loads the font set once and renders every card in order. Font directories from the command line and the manifest are combined.


## Paths {#paths}

Input, output, and manifest font paths are resolved from the current working directory. The command creates output directories as needed. Relative paths in a manifest are not resolved from the manifest location.


## Next steps {#next-steps}

-   [Batch Manifests](/projects/takumi-render/reference/batch-manifests/)
-   [Fonts and Images](/projects/takumi-render/reference/fonts-and-images/)
-   [CLI Reference](/projects/takumi-render/reference/cli-reference/)
