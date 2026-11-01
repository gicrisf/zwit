+++
title = "Output and Errors"
description = "File naming, diagnostics, exit codes, and compiler revision details."
weight = 20

[extra]
lead = "Where ondine writes files, how it reports failures, and which compiler revision it uses."
toc = true
+++

## Render output

`.mmd` and `.mermaid` sources replace their suffix with `.svg`:

```text
flow.mmd      -> flow.svg
flow.mermaid  -> flow.svg
```

Other names keep their extension:

```text
flow.txt      -> flow.txt.svg
```

Without `--out-dir`, the SVG is written beside the source. With `--out-dir`, every SVG is written into that directory. In ASCII mode, output goes to standard output instead.

## Markdown output

`ondine markdown` writes only Markdown files. Directory inputs preserve their relative structure under `--out-dir`.

A file with a failing Mermaid fence is not written. Other input files are still processed, and the command exits with status 1.

## Diagnostics

Compiler errors use this format:

```text
source:line:column: message
```

Errors without a position use:

```text
source: message
```

For Markdown fences, line and column numbers are adjusted to the Markdown file. The opening fence line is the reference for the diagram source.

## `--check` failures

When generated Markdown is missing or stale, `--check` prints:

```text
path/to/output.md is out of date
```

It writes nothing and exits with status 1.

## Exit status

The command exits with status 1 when any file fails to render or when `--check` finds stale output. It exits with status 0 when every requested operation succeeds.

Unclosed fences and non-Mermaid fences are copied unchanged, not reported as errors.

## Compiler revision

The compiler crate is pinned to a commit in `wevm/ondine` rather than a crates.io release. Update the `rev` in `Cargo.toml` deliberately, then run the test suite.

Ondine CLI makes no network requests. The release binary needs no Node.js, npm, or WebAssembly runtime.
