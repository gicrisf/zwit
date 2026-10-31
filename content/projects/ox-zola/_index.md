+++
title = "Ox-Zola"
description = "An Org exporter backend for writing Zola posts in Org mode."

template = "projects/page.html"
page_template = "docs/page.html"
sort_by = "weight"
weight = 60

[extra]
repo = "https://github.com/gicrisf/ox-zola"
language = ["Emacs Lisp"]
+++

Ox-Zola is an Org export backend that writes Markdown with TOML front matter for the Zola static site generator. It supports subtree and whole-file exports, Org tags as taxonomies, Zola internal links, page bundles, and Zola 0.23 components.

## What it handles

Exports support files, subtrees, and whole-file WIM exports. Org tags create categories and tags, file-level `zola_categories` and `zola_tags` keywords set taxonomies directly, and page bundles are configured through export properties.

Point `ox-zola-base-dir` at the site and set the default section. Start with [Getting Started](@/projects/ox-zola/getting-started/_index.md), then use the reference pages for links, components, and migration.
