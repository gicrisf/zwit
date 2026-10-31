+++
title = "Tochemfig"
description = "An Emacs interface to mol2chemfig for drawing chemical structures."

template = "projects/page.html"
page_template = "docs/page.html"
sort_by = "weight"
weight = 110

[extra]
repo = "https://github.com/gicrisf/tochemfig"
language = ["Emacs Lisp"]
+++

Tochemfig is an Emacs interface to mol2chemfig. It turns molfiles or SMILES strings into chemfig code, the LaTeX/TiKZ package for drawing chemical structures.

## How it works

Tochemfig does not reimplement the drawing pipeline. It builds a mol2chemfig command from your input and configured options, runs it through the shell, and inserts the generated chemfig code into the current buffer. mol2chemfig can be the Python 3 tool, the original Python 2 package, or its LUA web client. Output that uses the chemfig package still needs a LaTeX/TiKZ toolchain to render.

## Interface

The package offers several entry points: `tochemfig-default` uses the configured defaults, `tochemfig-custom` walks through options interactively, and `tochemfig-custom-raw` exposes the underlying flags directly. Smaller commands override one option at a time, such as `tochemfig-input-direct` for pasting a SMILES string. Options include rotation, horizontal and vertical flipping, relative angles, aromatic circles, fancy bonds, explicit carbons and methyls, submols, compact output, and wrapping the result in `\chemfig{...}`.

The package is under development and not on MELPA yet. It can be installed from the [repository](https://github.com/gicrisf/tochemfig), which also documents the available commands and configuration variables.
