+++
title = "cl-indigo"
description = "Common Lisp bindings for the Indigo cheminformatics toolkit."

template = "projects/page.html"
page_template = "docs/page.html"
sort_by = "weight"
weight = 155

[extra]
repo = "https://github.com/gicrisf/cl-indigo"
language = ["Common Lisp"]
+++

cl-indigo is a set of Common Lisp bindings for the [Indigo](https://lifescience.opensource.epam.com/indigo/) cheminformatics toolkit. It exposes Indigo's handle-based C API through CFFI and adds a higher-level, keyword-friendly Lisp interface for loading, inspecting, transforming, and rendering molecules and reactions.

> **Note:** cl-indigo is the Common Lisp counterpart of [Emacs Indigo](/projects/emacs-indigo/) and usually trails it slightly. Newer features and fixes may land in Emacs Indigo first.

## What it covers

- Format conversions between SMILES, MOL, and CML
- Molecular properties, formulas, masses, rings, atoms, and bonds
- Structure analysis, including stereocenters and aromaticity
- Substructure matching and similarity searches
- Reaction processing and manipulation
- Iterators and lazy streams with functional combinators
- Fingerprints and Tanimoto, Tversky, and Euclidean similarity
- SVG, PNG, and PDF rendering
- Automatic resource cleanup through `with-*` macros

## Design

The system has two packages. `cl-indigo.cffi` exposes the raw `%indigo-*` bindings, while `cl-indigo` provides the user-facing API. Objects are integer handles that match the Indigo C API directly.

The `with-*` macros wrap `unwind-protect`, so resources are released on normal exit or error. Sequential `*` variants bind multiple resources like `let*` and still clean up correctly when a later binding fails. Iterator streams are lazy, memoized, and compose through `stream-map`, `stream-filter`, `stream-take`, `stream-fold`, and `stream-collect`.

The API mirrors [Emacs Indigo](/projects/emacs-indigo/) adapted to Common Lisp conventions.

## Setup

Indigo itself must be available before loading the system. The included installer downloads `libindigo.so` and `libindigo-renderer.so` into `indigo-install/lib/`:

```bash
./install-indigo.sh linux-x86_64
```

You also need the GCC runtime libraries (`libstdc++`, `libgcc_s`), any Common Lisp implementation with CFFI support (SBCL is the tested one), and Quicklisp. Rendering additionally requires Cairo. On Nix, the provided `shell.nix` sets `LD_LIBRARY_PATH` for both Indigo and Cairo.

Load the system with ASDF:

```lisp
(load "~/quicklisp/setup.lisp")
(push #p"/path/to/cl-indigo/" asdf:*central-registry*)
(asdf:load-system :cl-indigo)
(use-package :cl-indigo)
```

Run `(asdf:test-system :cl-indigo)` to check the installation and exercise the test suite.

## Quick start

Stateless `do-*` functions cover one-off calculations and handle cleanup automatically:

```lisp
(do-molecular-weight "CCO")          ; => 46.069
(do-molecular-formula "CCO")         ; => "C2 H6 O"
(do-canonical-smiles "CCO")          ; => "CCO"
(do-ring-count "c1ccccc1")           ; => 1
(do-substructure-match "CCO" "[OH]") ; => T
```

Scoped `with-*` macros keep resources alive for a pipeline:

```lisp
(with-molecule (mol "c1ccccc1")
  (layout mol)
  (with-atoms-stream (stream mol)
    (stream-collect (stream-map #'atom-symbol stream))))
;; => ("C" "C" "C" "C" "C" "C")
```

## Rendering

Rendering needs `libindigo-renderer.so`. Options are set with `set-option`, `set-option-int`, `set-option-bool`, `set-option-float`, `set-option-color`, and `set-option-xy`, and output is written with `render-to-file` or `render`. A standalone script is included:

```bash
./render-mol.sh "c1ccccc1" /tmp/benzene.svg
```

## License

cl-indigo is licensed under GPL-3.0-or-later. See the [license](https://github.com/gicrisf/cl-indigo/blob/main/LICENSE).
