+++
title = "Migrating from ox-hugo"
description = "Move an Org-based blog from Hugo to Zola with ox-zola."
weight = 40

[extra]
lead = "Keep your Org files, switch the exporter, and update the few Hugo-specific constructs that Zola does not share."
toc = true
+++

{% raw %}
## Quick start

1. Install ox-zola alongside ox-hugo.
2. Change the export command from `org-hugo-export-*` to `ox-zola-export-*`.
3. Export your posts. Most Org files need no changes.

```elisp
;; Before, with ox-hugo
(org-hugo-export-wim-to-md)

;; After, with ox-zola
(ox-zola-export-wim-to-md)
```

## Keywords

Both `HUGO_*` and `ZOLA_*` keywords are recognized. You can keep existing keywords or migrate gradually:

```org
;; These are equivalent
#+hugo_base_dir: ~/myblog
#+zola_base_dir: ~/myblog

#+hugo_section: posts
#+zola_section: posts

#+hugo_tags: emacs org-mode
#+zola_tags: emacs org-mode
```

## Subtree and file export

The WIM export works like ox-hugo's: it detects whether to export the current subtree or the whole file.

## Front matter transformations

Ox-Zola converts Hugo-specific front matter to Zola's shape:

| Hugo | Zola | Notes |
|------|------|-------|
| `lastmod` | `updated` | Renamed |
| `layout` | `template` | Renamed |
| `tags: [...]` | `[taxonomies]` | Restructured |
| `categories: [...]` | `[taxonomies]` | Restructured |
| `menu`, `resources`, `outputs` | removed | Zola does not use them |

Example:

```toml
# Hugo front matter
+++
title = "My Post"
tags = ["emacs", "org"]
categories = ["tutorials"]
lastmod = 2024-01-15
layout = "post"
+++
```

```toml
# Zola front matter
+++
title = "My Post"
updated = 2024-01-15
template = "post.html"

[taxonomies]
tags = ["emacs", "org"]
categories = ["tutorials"]
+++
```

## Internal links

Hugo's `relref` shortcode is replaced with Zola's `@/` path syntax:

```markdown
# Hugo output
[other post]({{< relref "other.md" >}})
[heading]({{< relref "post.md#section" >}})

# Zola output
[other post](@/posts/other.md)
[heading](@/posts/post.md#section)
```

## Shortcodes and components

Hugo shortcodes do not map directly to Zola 0.23 components. Convert each one manually.

```markdown
# Hugo paired shortcode
{{< quote >}}
Content here
{{< /quote >}}

# Zola 0.22 legacy shortcode syntax
{% quote() %}
Content here
{% end %}

# Zola 0.23 component call
{% <site.quote> %}
Content here
{% </site.quote> %}
```

```markdown
# Hugo inline shortcode
{{< youtube abc123 >}}

# Zola 0.22 legacy shortcode syntax
{{ youtube(id="abc123") }}

# Zola 0.23 component call
{{<site.youtube id="abc123" />}}
```

If you still target Zola 0.22, ox-zola can emit the legacy shortcode syntax for Org special blocks. For 0.23 and newer, define and call Tera components instead. See [Components and Special Blocks](@/projects/ox-zola/components.md).

## Figures

For Zola 0.23 and newer, use a figure component or plain HTML:

```html
<figure>
  <img src="/images/diagram.png" alt="Diagram">
  <figcaption>A caption</figcaption>
</figure>
```

The old Hugo and Zola shortcode forms are for legacy Zola versions only.

## Page bundles

Hugo and Zola differ in page bundle conventions:

| Hugo | Zola |
|------|------|
| `content/posts/my-post/index.md` | `content/posts/my-post/index.md` |
| Leaf bundle | Section with `_index.md` or a page |
| `resources` front matter | Co-located assets |

Simple bundles containing a post and images work similarly. Complex Hugo bundles with resource processing need manual adjustment.

## Manual changes

- Replace Hugo-specific export snippets with HTML or component calls.
- Rewrite custom Hugo shortcodes as Tera components.
- Remove Hugo menu configuration; Zola navigation lives in the template configuration instead.

## Menus

Hugo's menu system does not exist in Zola. Remove `#+hugo_menu` entries and configure navigation in `config.toml` or the site templates.

{% endraw %}
