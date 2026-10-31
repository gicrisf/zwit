+++
title = "Kaomel"
description = "A keyboard-driven kaomoji picker for Emacs."

[extra]
repo = "https://github.com/gicrisf/kaomel"
language = "Emacs Lisp"
+++

Kaomel is a kaomoji picker for Emacs. It opens a fuzzy-searchable list of kaomojis, lets you choose one without touching the mouse, and inserts it at point or copies it to the clipboard.

## Design

The package was built around two constraints: the interface should not lock users into a specific completion framework, and the dataset should stay extensible. It works with Vertico, Helm, and other completion systems, and it keeps the source data separate from the optimized Emacs Lisp representation loaded at runtime.

The dataset covers Japanese, English, and Italian tags, with romanization for Japanese terms so the same kaomoji can be found through different spellings. The goal is to make the collection searchable in the way Emacs users expect: type a fragment, see the matches, pick one.

The [repository](https://github.com/gicrisf/kaomel) contains the package, dataset build tooling, and configuration options.
