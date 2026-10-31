+++
title = "Custom Front Matter"
description = "Add template-specific fields to exported Zola front matter."
weight = 30

[extra]
lead = "Use custom front matter when a Zola template needs a field that does not map to a standard Org keyword or property."
toc = true
adapted_from = "ox-hugo"
adapted_url = "https://ox-hugo.scripter.co/doc/custom-front-matter/"
+++

## File-wide custom front matter

Use the `ZOLA_CUSTOM_FRONT_MATTER` keyword for the whole file:

```org
#+zola_custom_front_matter: :feature true
#+zola_custom_front_matter: :show_toc false
```

## Subtree custom front matter

Use `EXPORT_ZOLA_CUSTOM_FRONT_MATTER` for a post subtree, and append more values with the `+` property form:

```org
* My Post
:PROPERTIES:
:EXPORT_FILE_NAME: my-post
:EXPORT_ZOLA_CUSTOM_FRONT_MATTER: :feature true
:EXPORT_ZOLA_CUSTOM_FRONT_MATTER+: :show_toc false
:END:
```

## Values

The property accepts scalars, lists, and maps of scalar or list values:

```org
:EXPORT_ZOLA_CUSTOM_FRONT_MATTER: :feature true
:EXPORT_ZOLA_CUSTOM_FRONT_MATTER+: :animals '(dog cat "mountain gorilla")
:EXPORT_ZOLA_CUSTOM_FRONT_MATTER+: :versions '((emacs . "29.4") (zola . "0.23.4"))
```

This exports as TOML:

```toml
feature = true
animals = ["dog", "cat", "mountain gorilla"]

[versions]
emacs = "29.4"
zola = "0.23.4"
```

For template data, put the custom values under `extra`:

```org
:EXPORT_ZOLA_CUSTOM_FRONT_MATTER: :extra '((feature . true) (show_toc . false))
```

```toml
[extra]
feature = true
show_toc = false
```

Maps of maps are not supported by this syntax. Keep custom front matter to the fields your Zola templates actually read.
