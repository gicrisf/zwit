+++
title = "Troubleshooting"
description = "Fix common export problems with line endings and metadata."
weight = 60

[extra]
lead = "Most export problems come from inconsistent file encodings or missing required metadata."
toc = true
adapted_from = "ox-hugo"
adapted_url = "https://ox-hugo.scripter.co/doc/troubleshooting/"
+++

## Mixed line endings

If an Org file contains a mix of Unix (`\n`) and DOS/Windows (`\r\n`) line endings, the exported Markdown can lose paragraph breaks. This can happen when an attached file, such as an SVG, was created outside Emacs with different line endings.

Make the line endings consistent in the source file, or align the export coding system with your buffer:

```elisp
(setq org-export-coding-system 'utf-8-unix)
```

If you need to override it only during export:

```elisp
(defun my/ox-zola-always-utf-8-unix (orig-fun &rest args)
  (let ((org-export-coding-system 'utf-8-unix))
    (apply orig-fun args)))

(with-eval-after-load 'ox-zola
  (advice-add 'ox-zola-export-to-md :around #'my/ox-zola-always-utf-8-unix))
```

## Missing output or metadata

Check that:

- `ox-zola-base-dir` points at the Zola site root.
- The section or `EXPORT_FILE_NAME` is set correctly.
- A subtree export has `EXPORT_FILE_NAME` and does not nest another post subtree.
- The exported Markdown passes `zola check`.
