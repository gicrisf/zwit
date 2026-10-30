# WebGL background archive

This directory preserves the retired WebGL grain implementation for reference.
Nothing here is loaded by the site.

## Files

- `site-bg-grain.js` — the complete JavaScript used in the WebGL version. It
  contains the fragment shader inline and exposes `window.siteBgGrain.init`.
- `site-bg-grain.frag` — the fragment shader extracted for readability.
- `site-bg-grain.vert` — the vertex shader.
- `site-bg-webgl.css` — the canvas and fade rules used at the time.
- `bootstrap.html` — an excerpt of the template markup and the load/fallback
  bootstrap. The `image.render` shortcode and `get_url` calls are Tera syntax,
  not standalone HTML.

The texture source was `static/bg.jpg` from the repository root. The script
fetched a same-origin copy so `zola serve` and deploy previews could upload it
to WebGL without tainting the canvas.

## How it worked

1. The background `<img>` loaded normally and remained the fallback.
2. `window.siteBgGrain.init` loaded the same image, created a WebGL1 context,
   compiled the shaders, and uploaded the image as a texture.
3. The fragment shader computed display-referred luminance, generated animated
   Gaussian grain, and returned the keep-color result (`color + delta`).
4. A full-screen triangle was drawn continuously with
   `requestAnimationFrame`.
5. The container received `site-bg--webgl`, the image was hidden, and the canvas
   faded in. On context loss or setup failure the image fade was used instead.

The geometry used a single oversized triangle:

```text
(-1.01, -1.01)
( 3.03, -1.01)
(-1.01,  3.03)
```

The overscan keeps the viewport corners strictly inside the triangle. The
earlier two-triangle quad produced an intermittent black break along its shared
top-left to bottom-right diagonal.

## Why it was retired

The shader ran at display refresh rate over the full viewport. Even though the
opaque page sheet covers most of the background, the GPU still rendered every
pixel every frame. The animated WebP version keeps the grain look at 10fps and
removes the continuous full-screen shader, at the cost of a larger network
asset.

See `../README.md` for the current pipeline and `../BACKLOG.md` for the full
history.
