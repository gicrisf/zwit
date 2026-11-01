+++
title = "Quick Start"
description = "Install ondine, render a diagram, and transform a Markdown tree."
weight = 10

[extra]
lead = "Install the binary, render a first diagram, and run the Markdown fence transformer."
toc = true
+++

## Requirements

You need Linux `x86_64` for the prebuilt binary, or Rust 1.97.0 or newer to build from source. Ondine CLI has no Node.js, npm, or WebAssembly runtime dependency.

## Install

With Cargo:

```sh
cargo install --git https://github.com/gicrisf/ondine-cli --locked --bin ondine
```

Prebuilt binaries are attached to each release. See [Installation](@/projects/ondine-cli/getting-started/installation.md) for the download and checksum commands.

## Render a diagram

Write Mermaid source in `flow.mmd`:

````text
flowchart LR
  A[Input] --> B[SVG]
````

Render it beside the source file:

```sh
ondine flow.mmd
```

This writes `flow.svg`. To render standard input:

```sh
cat flow.mmd | ondine > flow.svg
```

To print the diagram as ASCII text instead:

```sh
ondine --ascii flow.mmd
```

## Transform Markdown fences

Put a Mermaid fence in Markdown:

````markdown
```mermaid
flowchart LR
  A --> B
```
````

Transform the Markdown tree without modifying the source:

```sh
ondine markdown content --out-dir build/content
```

The output mirrors the input tree. Check that generated files are current:

```sh
ondine markdown content --out-dir build/content --check
```

See [Markdown Fences](@/projects/ondine-cli/reference/markdown-fences.md) for the full behavior.

## Next steps

- [Installation](@/projects/ondine-cli/getting-started/installation.md)
- [Usage](@/projects/ondine-cli/getting-started/usage.md)
- [Markdown Fences](@/projects/ondine-cli/reference/markdown-fences.md)
