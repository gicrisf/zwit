+++
title = "Installation"
description = "Install ox-zola and connect it to a Zola site."
weight = 20

[extra]
lead = "Ox-Zola runs in Emacs and builds on ox-hugo; it has no separate runtime beyond Emacs and Zola."
toc = true
adapted_from = "ox-hugo"
adapted_url = "https://ox-hugo.scripter.co/doc/installation/"
+++

## Requirements

Ox-Zola requires Emacs 27.2 or newer. It depends on [ox-hugo](https://github.com/kaushalmodi/ox-hugo), which is installed as a package dependency. You also need a Zola site to export into.

## Install from MELPA

Ox-Zola is available on [MELPA](https://melpa.org/#/ox-zola). With MELPA configured, install it with:

```text
M-x package-install RET ox-zola RET
```

Or with `use-package`:

```elisp
(use-package ox-zola
  :ensure t)
```

The ox-hugo dependency is installed automatically. If MELPA is not configured yet, see the [MELPA getting-started guide](https://melpa.org/#/getting-started).

## Alternative installations

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

After installation, require it so the Zola backend is available in the Org export dispatcher. With `use-package`, this happens automatically; otherwise add:

```elisp
(with-eval-after-load 'ox
  (require 'ox-zola))
```

## Connect it to a site

Set the site root and the default section:

```elisp
(setq ox-zola-base-dir "~/my-zola-site")
(setq ox-zola-section "posts")
```

These can also be set per file:

```org
#+zola_base_dir: /path/to/your/zola/project
#+zola_section: posts
```

The Zola backend then appears under `Z` in `M-x org-export-dispatch` (`C-c C-e`). See [Usage](@/projects/ox-zola/getting-started/usage.md) for the export commands.
