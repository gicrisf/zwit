+++
title = "Anchors"
description = "Control heading IDs and link targets in exported Markdown."
weight = 140

[extra]
lead = "Ox-Zola derives stable heading anchors and supports custom IDs for cross-references."
toc = true
adapted_from = "ox-hugo"
adapted_url = "https://ox-hugo.scripter.co/doc/anchors/"
+++

## Heading anchors

Headings receive anchors in the exported Markdown. A custom ID can be set with `:CUSTOM_ID:`:

```org
** Heading in a post
:PROPERTIES:
:CUSTOM_ID: heading-in-a-post
:END:
```

Zola's Markdown parser also understands heading attributes, so an explicit ID can appear on the heading:

```markdown
### Heading in a post {#heading-in-a-post}
```

## Anchor precedence

Ox-Zola follows ox-hugo's anchor derivation. The default precedence is:

1. Page or bundle name from `EXPORT_FILE_NAME`
2. `:CUSTOM_ID:`
3. A slug derived from the heading text
4. A short MD5-based fallback

The `org-hugo-anchor-functions` variable can adjust that order, including making Org `:ID:` properties take precedence.

## Targets

Org `<<target>>` links become HTML anchors. Prefix a target name with a dot (`<<.bar>>`) when you need an unprefixed HTML anchor for cross-page links.

Links within a page use ordinary `#anchor` references; links across pages use Zola's `@/` path syntax. See [Internal Links](@/projects/ox-zola/content/internal-links.md).
