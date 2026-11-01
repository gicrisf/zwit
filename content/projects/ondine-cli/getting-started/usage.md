+++
title = "Usage"
description = "Render diagrams and transform Markdown fences with the ondine command."
weight = 30

[extra]
lead = "The package is ondine-cli; the installed binary is ondine. This page covers both render modes and the Markdown transformer."
toc = true
+++

## Render diagrams

Render a `.mmd` or `.mermaid` file beside its source:

```sh
ondine flow.mmd
```

Render every SVG into one directory:

```sh
ondine diagrams/*.mmd --out-dir public/diagrams
```

Render standard input to standard output:

```sh
cat flow.mmd | ondine > flow.svg
```

Print diagrams as ASCII text:

```sh
ondine --ascii flow.mmd
```

With multiple files, ASCII output is concatenated in argument order. `--out-dir` is ignored in ASCII mode.

### Render options

| Option | Meaning |
|---|---|
| `-a`, `--ascii` | Print diagrams as ASCII text instead of writing SVG files. |
| `-o`, `--out-dir <DIR>` | Write every rendered SVG into one directory. |
| `-h`, `--help` | Print usage. |
| `-V`, `--version` | Print the version. |

Files named `.mmd` or `.mermaid` replace that suffix with `.svg`. Other names keep their extension, so `flow.txt` becomes `flow.txt.svg`.

## Transform Markdown fences

Transform a Markdown tree into a separate output tree:

```sh
ondine markdown content --out-dir build/content
```

The source files are not modified. Directory inputs mirror their relative paths under the output directory.

Check that generated Markdown is current:

```sh
ondine markdown content --out-dir build/content --check
```

Write one transformed file to standard output:

```sh
ondine markdown page.md --stdout
```

`--check` writes nothing and exits with status 1 when output is missing or stale. It requires an existing `--out-dir`. `--stdout` accepts exactly one Markdown file.

### Markdown options

| Option | Meaning |
|---|---|
| `-o`, `--out-dir <DIR>` | Write transformed Markdown to a separate tree. |
| `--check` | Write nothing, and exit with 1 when output is missing or out of date. |
| `--stdout` | Write one transformed Markdown file to standard output. |
| `-h`, `--help` | Print usage. |

Unlike render `--out-dir`, which collects SVG files into one directory, Markdown `--out-dir` preserves the input directory structure.

Only fences tagged `mermaid` are transformed. See [Markdown Fences](@/projects/ondine-cli/reference/markdown-fences.md) for fence syntax, output shape, and accessibility. See [Output and Errors](@/projects/ondine-cli/reference/output-and-errors.md) for diagnostics and exit behavior.
