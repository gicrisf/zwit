# Background backlog

Chronological notes for the site background effect.

## 1. Static image with a fade

The background started as a fixed `<img>` inside `.site-bg`, with a black
container behind it. A small inline script added `is-loaded` on image load,
which triggered a CSS opacity animation.

The fade duration and target opacity were iterated several times, including
`1s`, `5s`, `50s`, `10s`, and `2s`, and target opacities including `1`, `0.5`,
`0.8`, and `0.4`. The current values live in `static/custom.css` and should be
treated as the source of truth.

A `prefers-reduced-motion` block was tried and removed because it bypassed the
intended effect on systems with reduced motion enabled.

## 2. WebGL grain experiment

A WebGL post-process pass was added on top of the image:

- full-screen canvas inside `.site-bg`
- display-referred image texture
- luminance-dependent Gaussian grain
- keep-color variant: `color + (gray - gray0)`
- `u_night = 0` for the light-only site
- `u_noise_scale = 1.7` on low-DPI screens
- continuous `requestAnimationFrame` loop
- static `<img>` fallback when WebGL or shader setup failed

The first quad was two triangles. An intermittent black break appeared exactly
along the shared top-left to bottom-right diagonal. Replacing the pair with a
single oversized triangle removed that edge. A smaller artifact then appeared
near the top-right corner because the new hypotenuse passed through the
viewport corner; a 1% triangle overscan fixed it.

## 3. Performance review

The shader was correct but expensive for a decorative background:

- full viewport, up to DPR 2
- every frame at display refresh rate
- `sin`, `exp`, `sqrt`, texture sampling, and clamps per fragment
- continuous GPU activity even though the opaque sheet covers most of the
  viewport

The practical effect was a battery and thermal cost that did not justify the
look. Baking the grain into an animated image moves the work to decoding a
small number of frames per second.

## 4. Animated WebP

The grain was baked into animated WebP files using the same keep-color math.
The first version was a single 768×768 file at 10fps for 1.5s, about 1.36 MiB.
That removed the WebGL JavaScript and canvas entirely.

The static `<img>` remains as a fallback for browsers without WebP support.

## 5. Responsive variants

The single WebP still meant every client could download the same large file.
A plain `srcset` was not enough because high-DPR phones can still choose the
largest candidate. The current solution uses media-capped `<source>` groups:

- up to 640px: 384w
- up to 768px: 384w and 640w
- up to 1024px: 384w and 768w
- larger: 384w and 1024w

This guarantees that a small viewport cannot select the 1024w asset. The tradeoff
is that small high-DPR screens may upscale a smaller image; at the current
opacity and with grain, this is acceptable.

## 6. Smallest-first loading

The browser used to select the final variant immediately. The background now
always starts with `384w`:

- every `<source>` initially has `sizes="1px"`
- after the `384w` image paints, JavaScript sets `sizes="100vw"` when the
  viewport is wider than `640px`
- Save-Data and `slow-2g`/`2g`/`3g` connections keep `384w`
- small screens (`<=640px`) keep `384w` permanently

The browser re-selects the media-capped variant when `sizes` changes. Tested in
Firefox:

- 390px: `384w` only, no upgrade
- 700px: `384w` then `640w`
- 800px: `384w` then `768w`
- 1280px: `384w` then `1024w`

The tradeoff is an extra `0.37 MiB` download on upgraded screens. Small screens
now download only `0.37 MiB` instead of `0.63 MiB`. The `512w` variant was
removed because it was unreachable under this policy; `640w` is now reachable
for the `641–768px` group.

## Lessons

- Zola's image pipeline flattens animated WebP; animated files must stay raw.
- A full-screen shader is a continuous power cost, not just a one-time script.
- The two-triangle diagonal was structural, not random.
- A single oversized triangle can still have a corner boundary case; overscan
  the geometry rather than adding a visual zoom hack.
- Browser selection with `srcset` respects DPR; media caps are required to
  enforce hard data limits.
- Changing `sizes` on the sources is enough to trigger the upgrade; no manual
  image swap is needed.
- Smallest-first is a perceived-speed optimization, not a total-bandwidth
  optimization for upgraded screens.

## Open items

- Test animated WebP behavior on Safari versions that support static WebP but
  may not animate it.
- Measure real-world LCP with the 1024w asset on slow connections.
- Consider replacing the 1024w file with 896w or quality 70 if its size is too
  high in practice.
- Review whether capping the `641–768px` range at `640w` looks acceptable on
  `768px` displays.
- Decide whether reduced-motion users should receive a static background. The
  current implementation does not branch on `prefers-reduced-motion`.
- Add a deploy-time check that all `bg-grain-*` files referenced by
  `config.toml` exist.
- Consider a small tiled animated grain overlay if the full-frame WebP variants
  ever become too large.
- Keep `site-bg/generator/make_bg_grain.py` in sync with the shader parameters
  if the look changes.
