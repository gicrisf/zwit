+++
title = "Emacs Indigo"
description = "Emacs Lisp bindings for the Indigo cheminformatics library."

[extra]
repo = "https://github.com/gicrisf/emacs-indigo"
language = ["Emacs Lisp", "C"]
+++

Emacs Indigo is a set of Emacs Lisp bindings for the Indigo cheminformatics toolkit. It lets Elisp code load, inspect, transform, and render molecules and reactions without leaving Emacs.

## What it covers

- Format conversions between SMILES, MOL, CML, and InChI
- Molecular properties, formulas, mass, rings, atoms, and bonds
- Stereochemistry, CIP descriptors, enhanced stereo, and allene detection
- Substructure matching and similarity searches
- Reaction processing, including catalyst iteration
- Iterators and lazy streams for traversing molecular structures
- SVG and PNG rendering
- Automatic resource cleanup through `indigo-with-*` macros

## Design

The package talks to Indigo through a native dynamic module. `indigo-install` downloads the official Indigo wheel, extracts the shared libraries and headers, and builds the module locally; `indigo-doctor` verifies the setup. The API provides `indigo-do-*` convenience functions for one-off work and scoped `indigo-with-*` macros for longer pipelines, including sequential variants that clean up correctly when a later binding fails.

Emacs Indigo is available on MELPA and targets Emacs 28.1+ on Linux x86_64. The repository contains the bindings, the native module build scripts, and the ERT suite.
