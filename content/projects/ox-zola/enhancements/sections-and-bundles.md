+++
title = "Sections and Bundles"
description = "Control where exported posts and assets land in the Zola content tree."
weight = 10

[extra]
lead = "Ox-Zola inherits ox-hugo's section and bundle properties, with Zola's section/page structure as the target."
toc = true
adapted_from = "ox-hugo"
adapted_url = "https://ox-hugo.scripter.co/doc/hugo-section/"
+++

## Default section

Exports go to `content/<section>/` under the site root. The default section is controlled by `ox-zola-section` or the `ZOLA_SECTION` / `HUGO_SECTION` keyword:

```org
#+zola_base_dir: .
#+zola_section: posts

* My post
:PROPERTIES:
:EXPORT_FILE_NAME: my-post
:END:
```

This exports to `content/posts/my-post.md`.

## Override the section per post

Use `EXPORT_HUGO_SECTION` to override the file-level section:

```org
* My post
:PROPERTIES:
:EXPORT_HUGO_SECTION: articles
:EXPORT_FILE_NAME: my-post
:END:
```

The property can be inherited by child subtrees, and `EXPORT_HUGO_SECTION_FRAG` appends path fragments when you need nested section paths.

## Page bundles

Zola page bundles use a directory containing `index.md` plus colocated assets. Export one with `EXPORT_HUGO_BUNDLE` and `EXPORT_FILE_NAME: index`:

```org
* Page title
:PROPERTIES:
:EXPORT_HUGO_BUNDLE: xyz
:EXPORT_FILE_NAME: index
:END:
```

This produces `content/xyz/index.md`.

For a Zola section or branch bundle, export `_index.md` instead:

```org
:EXPORT_HUGO_BUNDLE: uvw
:EXPORT_FILE_NAME: _index
```

The Hugo property names remain because ox-zola inherits ox-hugo's export model, but the resulting directory layout matches Zola's page-bundle and section conventions.
