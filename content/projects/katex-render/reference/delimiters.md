+++
title = "Delimiters"
description = "Supported math delimiters and contexts that are skipped."
draft = false
weight = 20
[extra]
  lead = "Supported math delimiters, skipped contexts, and known limitations."
  toc = true
  math = true
+++

## Supported delimiters {#supported-delimiters}

| Delimiter | Mode    |
|-----------|---------|
| `$...$`   | Inline  |
| `$$...$$` | Display |
| `\(...\)` | Inline  |
| `\[...\]` | Display |

The content between delimiters is passed to `katex-rs` without the delimiters.


## Examples {#examples}

```html
<p>Inline: \( E = mc^2 \)</p>

<div>
\[
a = +\sqrt{2}
\]
</div>
```

This page is itself an example: the math below was rendered by `katex-render` during the site build.

<p>Rendered inline: \( E = mc^2 \)</p>
<div>Rendered display:
\[
a = +\sqrt{2}
\]</div>
<p>Dollar inline: $a^2 + b^2 = c^2$</p>
<div>Dollar display:
$$
\int_0^1 x^2\,dx = \frac{1}{3}
$$</div>


## Skipped contexts {#skipped-contexts}

Math is not processed inside:

-   `code`
-   `pre`
-   `script`
-   `style`
-   `textarea`
-   `option`
-   `svg`
-   `math`
-   existing `.katex` or `.katex-display` markup


## Escaped delimiters {#escaped-delimiters}

A backslash escapes the next character, so `\$5` is not treated as the start of inline math.


## Limitations {#limitations}

-   Bare LaTeX environments such as `\begin{equation}...\end{equation}` are not detected as delimiters. Wrap them in `\[...\]` or `$$...$$` if you need them rendered.
-   `\label` and `\ref` are not provided by KaTeX; use a renderer that supports equation references if you need them.
-   Inline dollar delimiters can match currency-like prose. Keep math pages opt-in and avoid paired dollar signs in ordinary text.
-   Only the delimiters listed above are recognized.
