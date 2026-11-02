+++
title = "Installation"
description = "Install ox-skills from source with straight.el, :vc, or Doom Emacs."
draft = false
weight = 20
[extra]
  lead = "Install ox-skills with straight.el, Emacs 29 :vc, or Doom Emacs."
  toc = true
+++

## Straight {#straight}

```emacs-lisp
(use-package ox-skills
  :straight (:host github :repo "gicrisf/ox-skills"))
```


## Built-in `:vc` (Emacs 29+) {#built-in-vc--emacs-29-plus}

```emacs-lisp
(use-package ox-skills
  :vc (:url "https://github.com/gicrisf/ox-skills"
            :rev :newest
            :branch "main"))
```


## Doom Emacs {#doom-emacs}

In `~/.config/doom/packages.el`:

```emacs-lisp
(package! ox-skills :recipe (:host github :repo "gicrisf/ox-skills"))
```

In `~/.config/doom/config.el`:

```emacs-lisp
(use-package! ox-skills)
```

Then run `doom sync`.

Continue with [Quick Start](/projects/ox-skills/getting-started/quick-start/) or [Exporting Skills](/projects/ox-skills/reference/exporting/).
