+++
title = "Usage"
description = "Run katex-render after a static-site build."
draft = false
weight = 30
[extra]
  lead = "Run katex-render after the site build, with opt-in pages and explicit markers."
  toc = true
+++

## Basic command {#basic-command}

```sh
katex-render --root public
```

Without `--root`, the command reads the `public` directory. It walks HTML files, processes pages that contain the marker, and writes only pages that changed.


## Opt-in pages {#opt-in-pages}

A page opts in by containing the marker string. The default is:

```text
assets/katex/katex.min.css
```

Set `--marker` when the stylesheet path differs:

```sh
katex-render --root public --marker /assets/katex/katex.min.css
```

A page without the marker is not parsed or rewritten.


## Build integration {#build-integration}

Run the transformer after the build writes HTML:

```sh
# after the site build writes HTML
katex-render --root public
```

The tool reads the built HTML and writes only pages that changed. It does not add or remove scripts, stylesheets, fonts, or other assets.


## Next steps {#next-steps}

-   [CLI Reference](/projects/katex-render/reference/cli-reference/)
-   [Delimiters](/projects/katex-render/reference/delimiters/)
-   [HTML Processing](/projects/katex-render/reference/html-processing/)
