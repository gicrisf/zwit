+++
title = "Quick Start"
description = "Create a Zola site and export a first Org post with ox-zola."
weight = 10

[extra]
lead = "Create a Zola site, install ox-zola, and export a first Org subtree."
toc = true
+++

## Requirements

Ox-Zola requires Emacs 27.2 or newer and a Zola site.

## Install

Ox-Zola is available on [MELPA](https://melpa.org/#/ox-zola). With MELPA configured:

```text
M-x package-install RET ox-zola RET
```

Or with `use-package`:

```elisp
(use-package ox-zola
  :ensure t)
```

The ox-hugo dependency is installed automatically. If MELPA is not configured yet, see the [MELPA getting-started guide](https://melpa.org/#/getting-started). For alternative installation methods, see [Installation](@/projects/ox-zola/getting-started/installation.md).

## Configure

Point ox-zola at the Zola site and choose a default section:

```elisp
(setq ox-zola-base-dir "~/my-zola-site")
(setq ox-zola-section "posts")
```

The same values can be set per file:

```org
#+zola_base_dir: /path/to/your/zola/project
#+zola_section: posts
```

## Write and export a post

Write a post as an Org heading:

```org
* My First Post
:PROPERTIES:
:EXPORT_FILE_NAME: my-first-post
:END:
This is my first post written in Org mode.
```

Export with `M-x org-export-dispatch` (`C-c C-e`). The Zola backend appears under `Z`:

```text
 [Z] Export to Zola Markdown
     [z] Subtree or File to Md file
     [Z] File to a temporary Md buffer
     [O] Subtree or File to Md file and open
     [f] File to Md file
     [A] All subtrees (or File) to Md file(s)
     [o] File to Md file and open
```

## Taxonomies

Use Org tags:

```org
* My First Post :@blogging:emacs:
```

This creates a category `blogging` and a tag `emacs`. File-level keywords work too:

```org
#+zola_categories: blogging
#+zola_tags: emacs org-mode
```

Both produce Zola front matter:

```toml
[taxonomies]
categories = ["blogging"]
tags = ["emacs", "org-mode"]
```

## Page bundles

Put a post and its assets in the same directory by exporting an `index` file:

```org
* My First Post :@blogging:emacs:
:PROPERTIES:
:EXPORT_ZOLA_SECTION: posts/my-first-post
:EXPORT_FILE_NAME: index
:END:
```


Next, see [Internal Links](@/projects/ox-zola/content/internal-links.md) and [Components and Special Blocks](@/projects/ox-zola/content/components.md).
