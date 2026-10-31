+++
title = "Source Blocks"
description = "Export code fences, line references, and source examples."
weight = 50

[extra]
lead = "Org source blocks become fenced code blocks; line-number and highlight annotations are not portable to Zola."
toc = true
adapted_from = "ox-hugo"
adapted_url = "https://ox-hugo.scripter.co/doc/source-blocks/"
+++

## Code fences

Org source blocks export as fenced code blocks whenever possible:

```org
#+begin_src emacs-lisp
(message "Hello")
#+end_src
```

````markdown
```emacs-lisp
(message "Hello")
```
````

Zola's highlighter is configured in `config.toml`; the exported fence language is preserved.

## Line numbers and highlighting

Zola does not interpret line-number or line-highlight annotations on fenced code blocks. If a code block needs special presentation, use plain Markdown/HTML or handle it in the site template.

## Code references

Org code references using `(ref:name)` continue to export as links to the labeled code line. Use them for prose that points at a specific line in a source block.

## Related

For inline HTML examples, see [Components and Special Blocks](@/projects/ox-zola/content/components.md).
