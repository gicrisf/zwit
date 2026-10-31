+++
title = "Auto-export on Saving"
description = "Export the current Org post whenever you save it."
weight = 50

[extra]
lead = "Ox-Zola does not ship a dedicated auto-export mode; a buffer-local save hook is enough."
toc = true
adapted_from = "ox-hugo"
adapted_url = "https://ox-hugo.scripter.co/doc/auto-export-on-saving/"
+++

## Define the export function

Put this in your Emacs configuration:

```elisp
(defun my/ox-zola-export-on-save ()
  "Export the current Org post with ox-zola."
  (when (derived-mode-p 'org-mode)
    (ox-zola-export-wim-to-md)))
```

The function uses the normal WIM rules: it exports the current post subtree when point is in one, otherwise it exports the whole file.

## Enable it for a project

Add a buffer-local hook through `.dir-locals.el`:

```elisp
((org-mode
  . ((eval . (add-hook 'after-save-hook
                       #'my/ox-zola-export-on-save
                       nil t)))))
```

The final `t` makes the hook buffer-local, so it does not run for every Org file in Emacs.

## Enable it for one file

Add a file-local block at the end:

```org
# Local Variables:
# eval: (add-hook 'after-save-hook #'my/ox-zola-export-on-save nil t)
# End:
```

To disable it for a file in an enabled project:

```org
# Local Variables:
# eval: (remove-hook 'after-save-hook #'my/ox-zola-export-on-save t)
# End:
```

## Live preview

Run Zola in the site root:

```sh
zola serve
```

With the save hook active, saving the Org file exports the Markdown and the Zola server refreshes the preview.
