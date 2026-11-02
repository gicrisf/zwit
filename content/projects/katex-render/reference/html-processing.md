+++
title = "HTML Processing"
description = "DOM rewriting, serialization, asset boundaries, and error behavior."
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

A page is serialized and written only when it has math to insert. Untouched pages are left byte-for-byte unchanged.

Serialization may normalize whitespace, attribute quoting, and HTML formatting on rewritten pages. The document structure and rendered content are preserved.


## What it does not change {#what-it-does-not-change}

The tool does not add or remove scripts, stylesheets, fonts, or other assets. A site that wants to drop a browser renderer should remove its own runtime script tags and assets after rendering.


## Diagnostics {#diagnostics}

KaTeX errors fail the command with the page path and equation source. The tool stops at the first failure. Pages written earlier in the same run remain on disk.
