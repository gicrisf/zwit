+++
title = "Equations"
description = "Export inline and display LaTeX for MathJax or KaTeX."
weight = 60

[extra]
lead = "Ox-Zola preserves LaTeX fragments in Markdown; the Zola site supplies the math renderer."
toc = true
adapted_from = "ox-hugo"
adapted_url = "https://ox-hugo.scripter.co/doc/equations/"
math = true
+++

## Inline equations

Inline equations use `\( ... \)`:

```org
LaTeX equation: \( E = -J \sum_{i=1}^N s_i s_{i+1} \)
```

`$...$` works too, but avoid spaces immediately inside the dollar delimiters.

<p>Rendered inline: \( E = -J \sum_{i=1}^N s_i s_{i+1} \)</p>

## Display equations

Display equations use `\[ ... \]` or `$$ ... $$`:

```org
\[
a = +\sqrt{2}
\]
```

<div>Rendered display:
\[
a = +\sqrt{2}
\]</div>

LaTeX environments are also supported:

```org
\begin{equation}
\label{eq:capacity}
C = W\log_{2} (1+\mathrm{SNR})
\end{equation}
```

The exported Markdown contains the equation source. This site pre-renders it with KaTeX at build time; no runtime math JavaScript is loaded.

## Equation references

`\label{...}` and `\ref{...}` require a math renderer with equation referencing enabled. Zola itself does not provide that; configure MathJax on the site if you need cross-references.
