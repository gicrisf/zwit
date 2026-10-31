+++
title = "Components and Special Blocks"
description = "How ox-zola handles Org special blocks in the Tera component era."
weight = 160
aliases = ["/projects/ox-zola/components/"]

[extra]
lead = "Zola 0.23 replaced shortcodes with Tera components. Here is what ox-zola handles directly and what needs a component."
toc = true
adapted_from = "ox-hugo"
adapted_url = "https://ox-hugo.scripter.co/doc/shortcodes/"
+++

{% raw %}
Zola 0.23 replaced shortcodes with Tera components. Ox-Zola still understands Org special blocks, but the output depends on the block type and the Zola version you target.

## Blocks handled directly

Some special blocks do not become shortcodes at all:

| Org block | Output |
|-----------|--------|
| `description` | Sets the `description` field in TOML front matter and is removed from the body |
| `details` | Produces an HTML `<details>` element with an optional `<summary>` |
| `aside` | Produces an HTML `<aside>` element |

For example:

```org
#+begin_description
This is the meta description for search engines.
#+end_description
```

```org
#+begin_details
Click to expand
---
Hidden content revealed on click.
#+end_details
```

becomes:

```html
<details>
<summary>Click to expand</summary>
Hidden content revealed on click.
</details>
```

## Legacy shortcode output

Zola 0.22 and earlier used shortcode syntax for reusable blocks. Zola 0.23 uses components instead. For migration details, see [Migrating from ox-hugo](@/projects/ox-zola/getting-started/migration-from-ox-hugo.md).

## Components in Zola 0.23

Define a component in `templates/components/`:

```jinja
{% component ui.callout(tone = "note") %}
<aside class="callout callout--{{ tone }}">{{ body | safe }}</aside>
{% endcomponent ui.callout %}
```

Call it from Markdown with a body:

```markdown
{% <ui.callout tone="tip"> %}
The body still parses as **Markdown**.
{% </ui.callout> %}
```

Or use a self-closing component:

```markdown
{{<ui.card title="A card" to="/projects/" />}}
```

Component arguments use quoted strings for text and `{...}` for non-string values.

## Current behavior

For Zola 0.23 and newer:

- Use the `description`, `details`, and `aside` blocks, which produce front matter or plain HTML.
- Write component calls directly in Markdown when you need reusable markup.

{% endraw %}
