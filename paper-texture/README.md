# Paper sheet texture

A lightweight, procedural paper surface made from three tiny SVGs and CSS
background blending. It was tried on this site's sheet and archived here so it
can be reused in another theme.

The applied experiment lives on the `experiment/paper-sheet-texture` branch
(commit `bf1d25d`). The main branch keeps this archive and does not apply the
texture.

## What it produces

- Mean around `rgb(236,236,237)` — `#e7e7e7` plus the blend stack.
- Fine, high-frequency grain.
- Sparse darker flecks and occasional short fibres.
- Faint low-frequency tonal mottling.
- No vignette, no visible gradient, no added gloss or shadow.
- A matte, uncoated-stock feel rather than a repeating printed pattern.

The measured sheet area in the experiment was approximately mean `236.4` with
grain standard deviation around `2` levels. The grain is deliberately subtle;
it reads as tooth rather than a strong pattern.

## Files

- `paper-grain.svg` — `feTurbulence` fine grain, 180px repeat tile.
- `paper-specks.svg` — sparse flecks and curved fibres, 480px repeat tile.
- `paper-mottle.svg` — low-frequency tonal mottling, 900px repeat tile.
- `paper-texture.css` — the generic background stack.

## Use in another theme

1. Copy the three SVGs into the target theme's static or assets directory.
2. Copy the `.paper-texture` rule from `paper-texture.css` into the theme's CSS.
3. Apply the class to the element that paints the page surface, or copy the
   declarations onto that selector.
4. Adjust the `url(...)` paths to match where the SVGs are served.
5. Keep the surface opaque and behind the content. If the theme paints its page
   ground with a pseudo-element, apply the texture there.

In this site the texture was applied to `.sheet::before`, because that
pseudo-element carries the sheet fill and the masthead window mask. Other paper
surfaces — buttons, cards, nav — stayed white.

## The stack

```css
.paper-texture {
  background-color: #e7e7e7;
  background-image:
    url("paper-grain.svg"),
    url("paper-specks.svg"),
    url("paper-mottle.svg");
  background-blend-mode: overlay, multiply, soft-light;
  background-repeat: repeat;
  background-size: 180px 180px, 480px 480px, 900px 900px;
}
```

The blend modes are intentional:

- `overlay` for the grain
- `multiply` for the flecks/fibres
- `soft-light` for the mottling

## Tuning

- **Grain strength:** change `feFuncA` `tableValues` in `paper-grain.svg`.
  Higher values produce more visible tooth. The experiment uses `0 1`.
- **Grain scale:** change `baseFrequency` in `paper-grain.svg`.
- **Flecks/fibres:** edit the shapes and `opacity` in `paper-specks.svg`.
  The tile repeats every 480px, so keep the marks sparse.
- **Mottling:** change `baseFrequency` and the `feFuncA` alpha in
  `paper-mottle.svg`. The experiment uses an 900px tile.
- **Base tone:** adjust `background-color` to shift the mean. `#e7e7e7` produced
  the measured ~236 result with the current blend stack.
- **Tile sizes:** keep the `background-size` values in sync with the SVG
  dimensions.

## Notes

- The texture is static; SVG filters rasterize once and are much lighter than a
  large raster paper image.
- `background-blend-mode` and SVG `feTurbulence` are modern-browser features.
