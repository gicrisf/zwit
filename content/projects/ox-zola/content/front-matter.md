+++
title = "Front Matter"
description = "How Org metadata becomes Zola TOML front matter."
weight = 10

[extra]
lead = "Ox-Zola writes Zola's TOML front matter from Org keywords, properties, and subtree metadata."
toc = true
adapted_from = "ox-hugo"
adapted_url = "https://ox-hugo.scripter.co/doc/org-meta-data-to-hugo-front-matter/"
+++

## Subtree exports

For subtree exports, the post heading and its property drawer provide most front matter values:

| Zola field | Org source |
|------------|------------|
| `title` | Subtree heading |
| `date` | `CLOSED` property or `EXPORT_DATE` |
| `updated` | `EXPORT_HUGO_LASTMOD` or automatic last-modified tracking |
| `draft` | `TODO` state or `EXPORT_HUGO_DRAFT` |
| `weight` | `EXPORT_HUGO_WEIGHT` |
| `taxonomies.tags` | Subtree tags without `@` |
| `taxonomies.categories` | Subtree tags with `@` |
| `path` / output file | `EXPORT_FILE_NAME`, section, and bundle properties |

Zola uses TOML front matter. The Hugo YAML front-matter option is not carried over.

## File exports

For whole-file exports, use file-level keywords:

```org
#+title: My Post
#+date: 2026-10-31
#+zola_tags: emacs org-mode
#+zola_categories: blogging
```

`HUGO_*` keywords remain accepted for compatibility and are translated to their Zola equivalents where possible.

## Precedence

Dates are resolved in this order:

1. The first transition to a `DONE` state in the `:LOGBOOK:` drawer
2. The `CLOSED` property
3. `EXPORT_DATE`
4. The `#+date:` keyword

`updated` follows the `:LOGBOOK:` history when available, then automatic last-modified tracking, then an explicit last-modified property.

Hugo-only fields such as `publishDate`, `expiryDate`, `menu`, and `resources` are removed from the exported front matter.
