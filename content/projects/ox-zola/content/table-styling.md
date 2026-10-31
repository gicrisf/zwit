+++
title = "Table Styling"
description = "Export Org tables and style them in the Zola site."
weight = 90

[extra]
lead = "Standard Org tables become Markdown tables; ox-hugo's table-class wrappers are not part of Zola's Markdown model."
toc = true
adapted_from = "ox-hugo"
adapted_url = "https://ox-hugo.scripter.co/doc/table-styling/"
+++

## Standard tables

Org tables export as Markdown tables, including alignment where possible:

```org
| Name | Value |
|------+-------|
| A    | 1     |
| B    | 2     |
```

## Captions

Markdown has no native table caption syntax. If you need a caption and a stable wrapper for styling, write raw HTML:

```html
<table>
  <caption>Results</caption>
  <thead>
    <tr><th>Name</th><th>Value</th></tr>
  </thead>
  <tbody>
    <tr><td>A</td><td>1</td></tr>
  </tbody>
</table>
```

## Styling

The `#+attr_html :class` and `#+attr_css` wrappers documented for ox-hugo are Hugo-specific. In Zola, style tables with site CSS or write the HTML wrapper directly. This keeps the exported Markdown portable and avoids carrying Hugo template assumptions into the Zola site.
