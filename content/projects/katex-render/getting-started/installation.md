+++
title = "Installation"
description = "Install katex-render from a release or from source."
draft = false
weight = 20
[extra]
  lead = "Use a prebuilt Linux binary or build from source with Cargo."
  toc = true
+++

## Requirements {#requirements}

The prebuilt binary targets `x86_64-unknown-linux-musl`. Building from source requires Rust 1.91 or newer.

KaTeX Render does not need Node.js, npm, or WebAssembly at runtime.


## Prebuilt binary {#prebuilt-binary}

Install the latest Linux `x86_64` binary with the installer:

```sh
curl -fsSL https://raw.githubusercontent.com/gicrisf/katex-render/main/install.sh | bash
```

This installs to `~/.local/bin`. Set `KATEX_RENDER_INSTALL_DIR` to choose another directory, or `KATEX_RENDER_VERSION` to pin a release.


### Manual download {#manual-download}

Download the archive from the [releases page](https://github.com/gicrisf/katex-render/releases). For version 0.1.0:

```sh
version=0.1.0
archive=katex-render-v${version}-x86_64-unknown-linux-musl.tar.gz
curl -fLO "https://github.com/gicrisf/katex-render/releases/download/v${version}/${archive}"
tar -xzf "${archive}"
mkdir -p ~/.local/bin
install "katex-render-v${version}-x86_64-unknown-linux-musl/katex-render" ~/.local/bin/
```

The release includes `SHA256SUMS`; verify it before installing when the binary comes from a mirrored source.


## Cargo {#cargo}

```sh
cargo install --git https://github.com/gicrisf/katex-render --locked
```

The build uses the dependency versions pinned in `Cargo.lock`.


## Verify {#verify}

```sh
katex-render --version
```

Continue with [Quick Start](/projects/katex-render/getting-started/quick-start/) or [Usage](/projects/katex-render/getting-started/usage/).
