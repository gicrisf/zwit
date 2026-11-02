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
katex-render --root public --remove-runtime-scripts
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


## Static-site integration {#static-site-integration}

Run the transformer after the generator writes HTML:

```sh
zola build
katex-render --root public --remove-runtime-scripts
```

`--remove-runtime-scripts` removes known KaTeX runtime script tags from processed pages. It does not remove the KaTeX stylesheet or fonts.

A local preview can keep runtime KaTeX while production output uses pre-rendered math. Run KaTeX Render against the production output directory, not the development server.


## Next steps {#next-steps}

-   [CLI Reference](/projects/katex-render/reference/cli-reference/)
-   [Delimiters](/projects/katex-render/reference/delimiters/)
-   [HTML Processing](/projects/katex-render/reference/html-processing/)
