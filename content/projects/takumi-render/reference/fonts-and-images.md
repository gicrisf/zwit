+++
title = "Fonts and Images"
description = "Font formats, font directories, and data URLs for images."
draft = false
weight = 20
[extra]
  lead = "Register local fonts and embed images so rendering needs no network access."
  toc = true
+++

## Fonts {#fonts}

Takumi does not load system fonts. Provide at least one font directory:

```sh
takumi-render render \
  --html card.html \
  --output card.png \
  --fonts-dir site/fonts \
  --fonts-dir vendor/fonts
```

Font directories are read recursively. Supported files are TTF, OTF, TTC, WOFF, and WOFF2. Files are registered in directory order and then filename order.

Use the registered family name in CSS:

```html
<div style="font-family:'IBM Plex Mono',monospace">Card text</div>
```

If no font covers a character, rendering fails rather than drawing a fallback glyph.


## Images {#images}

Embed local images as data URLs:

```html
<img src="data:image/svg+xml;base64,..." width="42" height="42">

<div style="background-image:url('data:image/jpeg;base64,...')"></div>
```

The renderer does not fetch remote images. Keep images local and inline them, or preload them into the HTML before rendering.


## HTML and CSS {#html-and-css}

Takumi parses HTML and applies inline styles and `<style>` blocks. It is a rendering engine, not a browser: scripts, external stylesheets, and network requests are not part of the render.

Use explicit pixel dimensions, flex layout, and data URLs for portable cards.


## Font weight {#font-weight}

Register the weights you use. A CSS `font-weight:700` needs a registered 700 face, not only the 400 face.
