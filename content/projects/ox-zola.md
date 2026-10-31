+++
title = "Ox-Zola"
description = "An Org exporter backend for writing Zola posts in Org mode."

[extra]
repo = "https://github.com/gicrisf/ox-zola"
language = ["Emacs Lisp"]
+++

Ox-Zola is an Org export backend that writes Markdown with TOML front matter for the Zola static site generator. It is a drop-in replacement for ox-hugo when the target is Zola: existing `HUGO_*` keywords keep working, so migrating a site does not require rewriting its Org files.

## What it handles

Exports follow the usual ox-hugo model: files, subtrees, and whole-file WIM exports. Org tags can create categories and tags, file-level `zola_categories` and `zola_tags` keywords set taxonomies directly, and page bundles are configured through the existing export properties. Since it builds on ox-hugo, its subtree exports, property inheritance, and WIM detection remain available.

Configuration mirrors ox-hugo: point `ox-zola-base-dir` at the site and set the default section. The [repository](https://github.com/gicrisf/ox-zola) has the installation and migration notes.
