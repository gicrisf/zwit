+++
title = "Details and Summary"
description = "Build disclosure widgets from Org special blocks."
weight = 100

[extra]
lead = "The details and summary special blocks produce plain HTML that works in Zola without any shortcode layer."
toc = true
adapted_from = "ox-hugo"
adapted_url = "https://ox-hugo.scripter.co/doc/details-and-summary/"
+++

## Regular disclosure

```org
#+begin_details
#+begin_summary
Why is this hidden?
#+end_summary
The content appears when the disclosure is opened.
#+end_details
```

This exports as:

```html
<details>
<summary>Why is this hidden?</summary>
The content appears when the disclosure is opened.
</details>
```

## Without a summary

If the summary block is omitted, browsers use their default label:

```org
#+begin_details
The details text.
#+end_details
```

## Open by default

Use `#+attr_html` with `:open t`:

```org
#+attr_html: :open t
#+begin_details
#+begin_summary
Open by default
#+end_summary
The details are visible immediately.
#+end_details
```

Style `details summary` and `details .details` in the site CSS when you need custom presentation.

These blocks are plain HTML, so they remain valid under Zola 0.23 without components or shortcodes.
