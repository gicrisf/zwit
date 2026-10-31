+++
title = "Quick Start"
description = "Create a Zola site and export a first Org post with ox-zola."
weight = 10

[extra]
lead = "Create a Zola site, install ox-zola, and export a first Org subtree."
toc = true
adapted_from = "ox-hugo"
adapted_url = "https://ox-hugo.scripter.co/doc/quick-start/"
+++

## Requirements

Ox-Zola requires Emacs 27.2 or newer and a Zola site. See [Installation](@/projects/ox-zola/getting-started/installation.md) for package setup.

## Install

With `straight.el`:

```elisp
(use-package ox-zola
  :straight (:host github :repo "gicrisf/ox-zola"))
```

With Emacs 29's built-in `:vc`:

```elisp
(use-package ox-zola
  :vc (:url "https://github.com/gicrisf/ox-zola"
            :rev :newest
            :branch "main"))
```

With Doom Emacs:

```elisp
(package! ox-zola
  :recipe (:host github :repo "gicrisf/ox-zola"))
```

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
