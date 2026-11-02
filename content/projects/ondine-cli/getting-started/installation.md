+++
title = "Installation"
description = "Install ondine with the prebuilt installer, Cargo, or Nix."
weight = 20

[extra]
lead = "Use the prebuilt installer, build with Cargo, or run it through the Nix flake."
toc = true
+++

## Requirements

The prebuilt binary targets `x86_64-unknown-linux-musl`. Building from source requires Rust 1.97.0 or newer.

Ondine CLI does not need Node.js, npm, or WebAssembly at runtime.

## Prebuilt binary

Install the latest Linux `x86_64` binary with the installer:

```sh
curl -fsSL https://raw.githubusercontent.com/gicrisf/ondine-cli/main/install.sh | bash
```

This installs to `~/.local/bin`. Set `ONDINE_INSTALL_DIR` to choose another directory, or `ONDINE_VERSION` to pin a release. Manual downloads are available from the [releases page](https://github.com/gicrisf/ondine-cli/releases).

## Cargo

```sh
cargo install --git https://github.com/gicrisf/ondine-cli --locked --bin ondine
```

The build uses the compiler revision pinned in `Cargo.lock`.

## Nix

```sh
# Runs the command without installing it
nix run github:gicrisf/ondine-cli -- flow.mmd

# Builds the package
nix build

# Enters a development shell
nix develop
```

## Verify

```sh
ondine --version
```

Continue with [Quick Start](@/projects/ondine-cli/getting-started/quick-start.md) or [Usage](@/projects/ondine-cli/getting-started/usage.md).
