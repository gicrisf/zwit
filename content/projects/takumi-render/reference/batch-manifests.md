+++
title = "Batch Manifests"
description = "Render many HTML files with one font load and ordered output."
draft = false
weight = 10
[extra]
  lead = "Describe many HTML inputs and PNG outputs in one JSON file."
  toc = true
+++

A batch manifest is a JSON object with an optional `fonts` list and a required `cards` list:

```json
{
  "fonts": ["path/to/more/fonts"],
  "cards": [
    {
      "input": "html/home.html",
      "output": "static/og/home.png",
      "width": 1200,
      "height": 630
    },
    {
      "input": "html/post.html",
      "output": "static/og/post.png"
    }
  ]
}
```


## Fields {#fields}

| Field            | Required | Meaning                             |
|------------------|----------|-------------------------------------|
| `fonts`          | No       | Additional font directories.        |
| `cards`          | Yes      | Ordered list of inputs and outputs. |
| `cards[].input`  | Yes      | HTML file to read.                  |
| `cards[].output` | Yes      | PNG file to write.                  |
| `cards[].width`  | No       | Image width. Defaults to 1200.      |
| `cards[].height` | No       | Image height. Defaults to 630.      |


## Fonts {#fonts}

The `--fonts-dir` options and the manifest `fonts` list are combined. Fonts are loaded once before the first card, so a large batch does not re-register the same font files.

See [Fonts and Images](/projects/takumi-render/reference/fonts-and-images/) for supported formats and registration behavior.


## Paths and output {#paths-and-output}

All paths are resolved from the current working directory. The command creates each output directory as needed.

Cards render in list order. If a card fails, the command stops and exits with status 1. Earlier outputs remain on disk; remove stale output before a build if that matters.


## Example {#example}

```sh
takumi-render batch cards.json --fonts-dir site/fonts
```
