+++
title = "Ondine CLI"
description = "A native command-line front end for the Ondine Mermaid compiler."

template = "projects/page.html"
page_template = "docs/page.html"
sort_by = "weight"
weight = 40

[extra]
repo = "https://github.com/gicrisf/ondine-cli"
language = ["Rust"]
+++

Ondine CLI is a small Rust binary for rendering Mermaid diagrams with the Ondine compiler. It reads `.mmd` or `.mermaid` files, or standard input, and writes SVG. It can also print diagrams as ASCII text.

## Why

The upstream Ondine toolchain runs through Node and npm. This front end keeps the same compiler and output but removes the Node startup and WebAssembly overhead: one native binary, no runtime, no network requests. It covers all 33 Ondine diagram types and fits into CI jobs, Makefiles, and static-site pipelines.

## Scope

This release renders SVG and ASCII only. It does not rewrite Markdown fences, print terminal images, produce JSON, or implement `--check`. The compiler crate is pinned to a commit in `wevm/ondine` rather than a crates.io release, so compiler updates are deliberate.

Install it with Cargo or run it through the Nix flake.

{% <social.mastodon
  url="https://fosstodon.org/@gicrisf/117487710985692245"
  author="Giovanni Crisalfi"
  date="2026-10-23"
> %}
Ondine is a Rust/WASM port of Pele for rendering #Mermaid graphs in a monochromatic fashion. When I discovered it, I immediately found it beautiful, but I didn't want to use #npm just to generate some SVGs.

So I wrapped their compiler and ported the #ASCII formatter into a pure #Rust CLI. No #Node or WASM at runtime, so it is also smaller and faster: ideal for a quick #cargo or #Nix install.

If you need quick #diagrams, enjoy. Thanks to the Pele and Ondine folks.

[github.com/gicrisf/ondine-cli](https://github.com/gicrisf/ondine-cli)
{% </social.mastodon> %}
