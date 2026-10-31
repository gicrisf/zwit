+++
title = "Replace Front Matter Keys"
description = "Rename or remove exported front matter keys without editing the Org source."
weight = 40

[extra]
lead = "Map exported front matter keys to the names your Zola template expects."
toc = true
adapted_from = "ox-hugo"
adapted_url = "https://ox-hugo.scripter.co/doc/replace-front-matter-keys/"
+++

## Syntax

Use the `ZOLA_FRONT_MATTER_KEY_REPLACE` keyword for the whole file:

```org
#+zola_front_matter_key_replace: oldkey>newkey
```

Or use the `EXPORT_ZOLA_FRONT_MATTER_KEY_REPLACE` subtree property:

```org
* My Post
:PROPERTIES:
:EXPORT_FILE_NAME: my-post
:EXPORT_ZOLA_FRONT_MATTER_KEY_REPLACE: oldkey>newkey
:END:
```

Multiple mappings are space-separated.

## Rename a key

For example, a template that expects `summary` instead of `description`:

```org
#+zola_front_matter_key_replace: description>summary
```

## Swap tags and categories

```org
#+zola_front_matter_key_replace: tags>categories categories>tags
```

## Remove a key

Use `nil` as the target to drop the key from the exported front matter:

```org
#+zola_front_matter_key_replace: aliases>nil
```

## Rename authors

If an older template expects a singular `author` field:

```org
#+zola_front_matter_key_replace: authors>author
```

Only the exported front matter changes; the Org source keeps its original keywords and properties.
