+++
title = "Multilingual"
description = "Translation strings and Zola's per-language content model."
weight = 20

[extra]
lead = "Ox-Zola can translate the strings Org inserts during export; building a multilingual Zola site is a separate content-layout concern."
toc = true
adapted_from = "ox-hugo"
adapted_url = "https://ox-hugo.scripter.co/doc/multi-lingual-support/"
+++

## Translated export strings

Ox-Zola uses Org's `org-export-dictionary` to translate strings that Org inserts into exported content, including:

- Code snippet captions
- Figure captions
- Table captions
- Table of contents headings
- Bibliography headings

Set the language with the `#+language:` keyword or the `:EXPORT_LANGUAGE:` subtree property:

```org
#+language: fr
```

The translation of these generated strings follows Org's export dictionary.

## Zola multilingual sites

Zola's multilingual support is configured in `config.toml` with `[languages]`, and content can be split per language with language-suffixed files such as `_index.fr.md` or `page.fr.md`.

Ox-Zola's language handling is about the Org export, not a full translation management layer. For a multilingual site, decide how translated Org sources map to those language-specific content files, and verify the resulting paths with `zola build`.

## Scope

This page covers translated export strings and language metadata. It does not promise automatic translation of post bodies or automatic generation of every Zola language variant.
