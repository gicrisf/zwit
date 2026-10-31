+++
title = "Author"
description = "Carry author metadata into exported front matter."
weight = 110

[extra]
lead = "Zola uses an authors array; set author metadata in Org and verify the exported front matter shape."
toc = true
adapted_from = "ox-hugo"
adapted_url = "https://ox-hugo.scripter.co/doc/author/"
+++

## Page authors

Zola pages use `authors = ["..."]` in front matter. Set the author in the Org file or post subtree using Org's author metadata, then check the exported Markdown.

For a whole file:

```org
#+author: Your Name
```

For a subtree export, use the author property supported by your export setup, or set a custom front-matter field and map it in the site templates.

If your site uses a single global author, you can also keep the author out of each page and render it from the Zola configuration or template instead.

## Multiple authors

Use a list in the exported front matter when more than one person contributed:

```toml
authors = ["First Author", "Second Author"]
```

The mono theme renders the list as a comma-separated byline and uses the first author for feed metadata.

## Hugo differences

Hugo supports both `author` and `authors`, and its templates often treat them differently. Zola's page model uses `authors`; if an export produces a single `author` key, normalize it with a custom front-matter setting or in the template layer.
