+++
title = "Sections and Bundles"
description = "Control where exported posts and assets land in the Zola content tree."
weight = 10

[extra]
lead = "Ox-Zola controls where exported posts and assets land in the Zola content tree."
toc = true
adapted_from = "ox-hugo"
adapted_url = "https://ox-hugo.scripter.co/doc/hugo-section/"
+++

## Default section

Exports go to `content/<section>/` under the site root. The default section is controlled by `ox-zola-section` or the `ZOLA_SECTION` keyword:

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

Use `EXPORT_ZOLA_SECTION` to override the file-level section:

```org
* My post
:PROPERTIES:
:EXPORT_ZOLA_SECTION: articles
:EXPORT_FILE_NAME: my-post
:END:
```

The property can be inherited by child subtrees, and `EXPORT_ZOLA_SECTION_FRAG` appends path fragments when you need nested section paths.

## Page bundles

Zola page bundles use a directory containing `index.md` plus colocated assets. Export one with `EXPORT_ZOLA_BUNDLE` and `EXPORT_FILE_NAME: index`:

```org
* Page title
:PROPERTIES:
:EXPORT_ZOLA_BUNDLE: xyz
:EXPORT_FILE_NAME: index
:END:
```

This produces `content/xyz/index.md`.

For a Zola section or branch bundle, export `_index.md` instead:

```org
:EXPORT_ZOLA_BUNDLE: uvw
:EXPORT_FILE_NAME: _index
```

The exported directory layout matches Zola's page-bundle and section conventions.
