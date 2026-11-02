+++
title = "HTML Processing"
description = "DOM rewriting, serialization, runtime script removal, and error behavior."
draft = false
weight = 30
[extra]
  lead = "How katex-render walks HTML, inserts KaTeX markup, and leaves untouched pages alone."
  toc = true
+++

## Marker detection {#marker-detection}

The tool first checks whether the page contains the configured marker. Pages without it are skipped before parsing.


## DOM rewrite {#dom-rewrite}

Opted-in pages are parsed as HTML5 with `html5ever` through `scraper`. The tool walks text nodes, ignoring skipped elements and existing KaTeX markup. Each math run is rendered with `katex-rs` and parsed as an HTML fragment. The resulting KaTeX node is inserted in place of the source text.

This preserves surrounding HTML and avoids treating markup or code as math.


## Serialization {#serialization}

A page is serialized and written only when it has math to insert or runtime scripts to remove. Untouched pages are left byte-for-byte unchanged.

Serialization may normalize whitespace, attribute quoting, and HTML formatting on rewritten pages. The document structure and rendered content are preserved.


## Runtime scripts {#runtime-scripts}

With `--remove-runtime-scripts`, the tool removes script elements whose `src` points to:

-   `assets/katex/katex.min.js`
-   `assets/katex/auto-render.min.js`
-   `assets/js/math.js`

It does not remove the KaTeX stylesheet or fonts. The site must keep those assets available.


## Diagnostics {#diagnostics}

KaTeX errors fail the command with the page path and equation source. The tool stops at the first failure. Pages written earlier in the same run remain on disk.
