+++
title = "Formatting"
description = "Org markup and how it becomes Zola Markdown."
weight = 20

[extra]
lead = "Most Org inline markup maps directly to CommonMark."
toc = true
adapted_from = "ox-hugo"
adapted_url = "https://ox-hugo.scripter.co/doc/formatting/"
+++

| Org | Markdown |
|-----|----------|
| `*bold*` | `**bold**` |
| `/italics/` | `_italics_` |
| `=monospace=` | `` `monospace` `` |
| `~verbatim~` | `` `verbatim` `` |
| `+strike-through+` | `~~strike-through~~` |
| `_underline_` | HTML `span` with an underline class |

Lists, block quotes, tables, horizontal rules, links, images, source blocks, and footnotes are exported as CommonMark or HTML that Zola can render.

For inline keyboard bindings, set `#+zola_use_code_for_kbd: t` to export `<kbd>` elements instead of code spans. Style the element in your site CSS if needed.

Raw HTML from `#+begin_export html` blocks passes through to the exported Markdown.

See [Source Blocks](@/projects/ox-zola/content/source-blocks.md) and [Images](@/projects/ox-zola/content/images.md) for the media-specific behavior.
