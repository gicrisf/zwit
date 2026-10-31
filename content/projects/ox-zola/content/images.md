+++
title = "Images"
description = "Link images, static assets, and figures in exported posts."
weight = 40

[extra]
lead = "Images in Zola are ordinary Markdown links to files under static/ or to colocated assets."
toc = true
adapted_from = "ox-hugo"
adapted_url = "https://ox-hugo.scripter.co/doc/image-links/"
+++

## Images in static/

An image at `static/images/foo.png` can be linked directly:

```org
[[/images/foo.png]]
```

This exports as an inline image:

```markdown
![foo](/images/foo.png)
```

To link a thumbnail to a larger image, use the image path in the link component and a `file:` description:

```org
[[/images/foo.png][file:/images/foo-large.png]]
```

## Links and descriptions

A normal link to an image uses the description as link text:

```org
[[/images/foo.png][Open the full image]]
```

This is useful when the image should not be embedded inline.

## Colocated assets

For a Zola page bundle, put images next to the exported `index.md` and link them relatively:

```org
[[file:diagram.png]]
```

The normal Markdown image link then resolves against the page bundle.

## Figures

Zola does not need a Hugo figure shortcode. Use Markdown or plain HTML:

```html
<figure>
  <img src="/images/foo.png" alt="Description">
  <figcaption>A caption</figcaption>
</figure>
```

Figure and table numbering are site-template concerns, not ox-zola front matter.
