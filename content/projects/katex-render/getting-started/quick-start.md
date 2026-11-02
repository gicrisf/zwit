+++
title = "Quick Start"
description = "Install katex-render and pre-render a first page."
draft = false
weight = 10
[extra]
  lead = "Install katex-render, mark an HTML page, and replace its LaTeX with KaTeX markup."
  toc = true
+++

## Requirements {#requirements}

You need Linux `x86_64` for the prebuilt binary, or Rust 1.91 or newer to build from source. KaTeX Render does not need Node.js, npm, or WebAssembly.

The page must already load KaTeX CSS and fonts. KaTeX Render does not copy them.


## Install {#install}

Install the latest Linux `x86_64` prebuilt binary with the installer:

```sh
curl -fsSL https://raw.githubusercontent.com/gicrisf/katex-render/main/install.sh | bash
```

The installer places `katex-render` in `~/.local/bin`. See [Installation](/projects/katex-render/getting-started/installation/) for pinned versions, manual downloads, and Cargo.


## Mark a page {#mark-a-page}

Add the KaTeX stylesheet and some LaTeX to an HTML page:

```html
<link rel="stylesheet" href="/assets/katex/katex.min.css">
<p>Inline: \( E = mc^2 \)</p>
```

The stylesheet path is the default marker. Pages without it are left alone.


## Render the math {#render-the-math}

After building the site, run:

```sh
katex-render --root public --remove-runtime-scripts
```

The command replaces the LaTeX with KaTeX HTML and MathML. With `--remove-runtime-scripts`, it also removes known KaTeX runtime `<script>` tags from processed pages.


## Next steps {#next-steps}

-   [Installation](/projects/katex-render/getting-started/installation/)
-   [Usage](/projects/katex-render/getting-started/usage/)
-   [CLI Reference](/projects/katex-render/reference/cli-reference/)
