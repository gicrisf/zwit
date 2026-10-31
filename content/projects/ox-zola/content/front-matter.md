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
| `updated` | `ZOLA_UPDATED` keyword, `:LOGBOOK:` history, or automatic tracking |
| `draft` | `TODO` state or `ZOLA_DRAFT` keyword |
| `weight` | `EXPORT_ZOLA_WEIGHT` |
| `taxonomies.tags` | Subtree tags without `@` |
| `taxonomies.categories` | Subtree tags with `@` |
| `path` / output file | `EXPORT_FILE_NAME`, section, and bundle properties |

Zola uses TOML front matter.

## File exports

For whole-file exports, use file-level keywords:

```org
#+title: My Post
#+date: 2026-10-31
#+zola_tags: emacs org-mode
#+zola_categories: blogging
```

Legacy `HUGO_*` keywords remain accepted; see [Migrating from ox-hugo](@/projects/ox-zola/getting-started/migration-from-ox-hugo.md) for compatibility details.

## Precedence

Dates are resolved in this order:

1. The first transition to a `DONE` state in the `:LOGBOOK:` drawer
2. The `CLOSED` property
3. `EXPORT_DATE`
4. The `#+date:` keyword

`updated` follows the `:LOGBOOK:` history when available, then automatic last-modified tracking, then an explicit `ZOLA_UPDATED` keyword.

Fields that are not part of Zola's front matter (`publishDate`, `expiryDate`, `menu`, `resources`) are not emitted.
