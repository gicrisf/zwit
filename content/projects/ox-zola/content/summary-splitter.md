+++
title = "Summary Splitter"
description = "Split a post summary for lists and feeds with Zola's more marker."
weight = 120

[extra]
lead = "Zola uses an HTML comment marker, not ox-hugo's Hugo-specific summary directive."
toc = true
adapted_from = "ox-hugo"
adapted_url = "https://ox-hugo.scripter.co/doc/hugo-summary-splitter/"
+++

Hugo uses `<!--more-->` to mark the end of a summary. Zola uses:

```html
<!-- more -->
```

In an Org file, export that marker as raw HTML:

```org
My post summary.

#+begin_export html
<!-- more -->
#+end_export

The rest of the post.
```

or, for a short marker:

```org
#+html: <!-- more -->
```

The exported Markdown then contains the marker, and Zola uses the content before it as the post summary.

The old `#+hugo: more` directive is Hugo-specific and is not the Zola marker. Use `<!-- more -->` when targeting Zola.
