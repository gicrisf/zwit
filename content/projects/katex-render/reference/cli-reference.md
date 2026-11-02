+++
title = "CLI Reference"
description = "Every katex-render option, with output and exit behavior."
draft = false
weight = 10
[extra]
  lead = "Options, output summary, diagnostics, and exit status."
  toc = true
+++

## Synopsis {#synopsis}

```text
katex-render [OPTIONS]
```


## Options {#options}

| Option                     | Meaning                                                                              |
|----------------------------|--------------------------------------------------------------------------------------|
| `--root <DIR>`             | Directory containing built HTML. Defaults to `public`.                               |
| `--marker <STRING>`        | Only process pages containing this string. Defaults to `assets/katex/katex.min.css`. |
| `--remove-runtime-scripts` | Remove known KaTeX runtime script tags from processed pages.                         |
| `-h`, `--help`             | Print usage.                                                                         |
| `-V`, `--version`          | Print the version.                                                                   |


## Output summary {#output-summary}

The command prints a summary:

```text
katex-render: 2 equations on 1 of 99 pages
```

The first number is the rendered equation count. The second is the number of pages written. The third is the number of HTML files scanned.


## Exit status {#exit-status}

The command exits with 0 when every processed page succeeds. It exits with 1 when an HTML, KaTeX, or file I/O error occurs. Invalid command-line arguments exit with 2 through the argument parser.


## Behavior {#behavior}

-   It processes only files ending in `.html`.
-   It processes only pages containing the marker.
-   It writes only pages that changed.
-   It fails on the first KaTeX parse error.
-   It makes no network requests.
