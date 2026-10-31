+++
title = "Tags and Categories"
description = "Map Org tags to Zola taxonomies."
weight = 70

[extra]
lead = "Subtree tags become Zola tags, and tags prefixed with @ become categories."
toc = true
adapted_from = "ox-hugo"
adapted_url = "https://ox-hugo.scripter.co/doc/tags-and-categories/"
+++

## Subtree exports

Use ordinary Org tags for tags and `@`-prefixed tags for categories:

```org
* My Post :emacs:org-mode:@blogging:
```

This produces:

```toml
[taxonomies]
tags = ["emacs", "org-mode"]
categories = ["blogging"]
```

Tags and categories are inherited from parent headings and `#+filetags` according to `org-use-tag-inheritance`. `EXPORT_ZOLA_TAGS` and `EXPORT_ZOLA_CATEGORIES` override the inherited values.

## File exports

For whole-file exports, use file-level keywords:

```org
#+zola_tags: emacs org-mode
#+zola_categories: blogging
```

See [Migrating from ox-hugo](@/projects/ox-zola/getting-started/migration-from-ox-hugo.md) for legacy `HUGO_*` keyword compatibility.

## Names with spaces and hyphens

Org tags cannot contain spaces. Ox-Zola transforms tags as follows:

- `abc_def` becomes `abc-def`
- `abc__def` becomes `abc def`
- `abc___def` becomes `abc_def`

These transformations apply to `#+filetags` and heading tags. Explicit keyword values keep their underscores.

The taxonomy must also be declared in the Zola site configuration before Zola builds the taxonomy pages.
