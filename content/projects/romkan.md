+++
title = "Romkan.el"
description = "Romaji/Kana conversion for Emacs Lisp."

[extra]
repo = "https://github.com/gicrisf/romkan.el"
language = ["Emacs Lisp"]
+++

Romkan.el converts between Japanese romaji and kana inside Emacs Lisp. It supports hiragana and katakana, plus Hepburn and Kunrei-shiki romanization.

## API

- `romkan-to-katakana` converts romaji to katakana.
- `romkan-to-hiragana` converts romaji to hiragana.
- `romkan-to-kana` is an alias for `romkan-to-katakana`.
- `romkan-to-hepburn` converts kana or Kunrei-shiki romaji to Hepburn romaji.
- `romkan-to-kunrei` converts kana or Hepburn romaji to Kunrei-shiki romaji.
- `romkan-to-roma` converts kana to Hepburn romaji.

The package is designed as a library for other Emacs packages and custom functions rather than an interactive input method. Conversion tables are injected as static constants instead of being generated procedurally, trading some repetition for faster operations and more readable tables.

It is based on the Ruby and Python Romkan implementations and is distributed under the BSD license. [Kaomel](@/projects/kaomel.md) uses it for Japanese romanization.
