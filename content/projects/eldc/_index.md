+++
title = "eldc"
description = "Convert Emacs Lisp data files to JSON and YAML."

template = "projects/page.html"
page_template = "docs/page.html"
sort_by = "weight"
weight = 150

[extra]
repo = "https://github.com/gicrisf/eldc"
language = ["Emacs Lisp", "Rust"]
+++

eldc (Emacs Lisp Dictionary Converter) converts Emacs Lisp data files into structured formats. Write a configuration as an alist or plist, run `M-x eldc-json` or `M-x eldc-yaml`, and the package writes a standard JSON or YAML file beside the source. It is meant for configuration that is easier to express in Lisp: package manifests, CI workflows, and other structured data.

## Dynamic configuration

The last s-expression in the file is evaluated before conversion, so output can include computed values, timestamps, environment variables, and anything else Emacs Lisp can produce. This is the point of keeping configuration in Lisp rather than editing JSON or YAML by hand.

## How it works

JSON conversion uses Emacs' built-in `json-encode`, so it needs no external tooling. YAML is produced by passing that JSON through `eldc-j2y`, a small Rust converter built on serde. JSON is always the first step, which keeps the architecture open to other formats using the same approach.

## Usage

Write the data in an `.el` file:

```elisp
'(:name "my-app"
  :version "1.0.0"
  :dependencies (:react "^18.2.0"
                 :vite "^4.3.0"))
```

Then run `M-x eldc-json` to write `my-app.json`, or `M-x eldc-yaml` to write `my-app.yaml`.

Plists are recommended for nested objects, and vectors make arrays explicit. The native encoder follows Emacs' JSON conventions: `t` becomes `true`, `:json-false` becomes `false`, and `nil` becomes `null`.

## Installation

eldc is available on [MELPA](https://melpa.org/#/eldc):

```
M-x package-install RET eldc RET
```

It requires Emacs 25.1 or newer and the `deferred` package. YAML conversion also needs `eldc-j2y`: run `M-x eldc-download-binary` to fetch a prebuilt release, or install it from source with `cargo install --git https://github.com/gicrisf/eldc eldc-j2y`.

## Hooks

Before- and after-export hooks for both formats make it possible to validate data, format the output, or commit generated files. The before hooks receive the data and output path; the after hooks receive the output path.

## License

eldc is licensed under GPL-3.0-or-later. See the [license](https://github.com/gicrisf/eldc/blob/main/LICENSE).
