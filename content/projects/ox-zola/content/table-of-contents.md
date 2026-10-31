+++
title = "Table of Contents"
description = "Use Zola's generated TOC or insert an Org-generated one."
weight = 80

[extra]
lead = "Zola generates a heading TOC automatically; Org can also export an inline TOC when you need control over placement."
toc = true
adapted_from = "ox-hugo"
adapted_url = "https://ox-hugo.scripter.co/doc/org-toc/"
+++

## Zola-generated TOC

Zola builds a table of contents from the exported headings. Templates can read it through `page.toc` or `section.toc`; nothing needs to be inserted into the Markdown unless you want a visible TOC in the content itself.

The mono theme uses this for the docs outline and for optional post TOCs.

## Org-generated TOC

To insert a TOC into the exported Markdown, use Org's `#+toc` keyword or export options:

```org
#+toc: headlines 2
```

or:

```org
:EXPORT_OPTIONS: toc:t
```

The first form inserts the TOC where the keyword appears; the option form places it near the top of the exported content. Org-generated TOCs support headline depth, local TOCs, and numbered or unnumbered headings.

Unlike Hugo, Zola does not need a TOC marker in the Markdown for templates to access the heading tree.
