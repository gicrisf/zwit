+++
title = "Installation"
description = "Install takumi-render from a release or from source."
draft = false
weight = 20
[extra]
  lead = "Use a prebuilt Linux binary or build from source with Cargo."
  toc = true
+++

## Requirements {#requirements}

The prebuilt binary targets `x86_64-unknown-linux-musl`. Building from source requires Rust 1.91 or newer.

Takumi Render does not need Node.js, npm, or WebAssembly at runtime.


## Prebuilt binary {#prebuilt-binary}

Install the latest Linux `x86_64` binary with the installer:

```sh
curl -fsSL https://raw.githubusercontent.com/gicrisf/takumi-render/main/install.sh | bash
```

This installs to `~/.local/bin`. Set `TAKUMI_RENDER_INSTALL_DIR` to choose another directory, or `TAKUMI_RENDER_VERSION` to pin a release.


### Manual download {#manual-download}

Download the archive from the [releases page](https://github.com/gicrisf/takumi-render/releases). For version 0.1.0:

```sh
version=0.1.0
archive=takumi-render-v${version}-x86_64-unknown-linux-musl.tar.gz
curl -fLO "https://github.com/gicrisf/takumi-render/releases/download/v${version}/${archive}"
tar -xzf "${archive}"
mkdir -p ~/.local/bin
install "takumi-render-v${version}-x86_64-unknown-linux-musl/takumi-render" ~/.local/bin/
```

The release includes `SHA256SUMS`; verify it before installing when the binary comes from a mirrored source.


## Cargo {#cargo}

```sh
cargo install --git https://github.com/gicrisf/takumi-render --locked
```

The build uses the dependency versions pinned in `Cargo.lock`.


## Verify {#verify}

```sh
takumi-render --version
```

Continue with [Quick Start](/projects/takumi-render/getting-started/quick-start/) or [Usage](/projects/takumi-render/getting-started/usage/).
