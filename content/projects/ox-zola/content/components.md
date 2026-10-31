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

## Legacy shortcode export

Any other special block can be exported with Zola's legacy shortcode syntax. Declare which blocks are paired:

```org
#+zola_paired_shortcodes: quote
#+begin_quote
A famous quote.
#+end_quote
```

This exports as:

```markdown
{% quote() %}
A famous quote.
{% end %}
```

Non-paired blocks use inline syntax:

```org
#+attr_shortcode: :id abc123
#+begin_youtube
#+end_youtube
```

```markdown
{{ youtube(id="abc123") }}
```

This is the format for Zola 0.22 and earlier. Zola 0.23 no longer parses shortcode syntax, so use components instead if your site targets 0.23 or newer.

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

## Current ox-zola behavior

Ox-Zola's special-block exporter still emits the legacy shortcode syntax. If you target Zola 0.23 or newer:

- Use the `description`, `details`, and `aside` blocks, which produce front matter or plain HTML.
- Write component calls directly in Markdown when you need reusable markup.
- Avoid relying on paired or non-paired shortcode export unless the site targets an older Zola version.

{% endraw %}
