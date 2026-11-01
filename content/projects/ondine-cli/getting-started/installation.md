+++
title = "Installation"
description = "Install ondine from a release binary, Cargo, or Nix."
weight = 20

[extra]
lead = "Use a prebuilt Linux binary, build with Cargo, or run it through the Nix flake."
toc = true
+++

## Requirements

The prebuilt binary targets `x86_64-unknown-linux-musl`. Building from source requires Rust 1.97.0 or newer.

Ondine CLI does not need Node.js, npm, or WebAssembly at runtime.

## Prebuilt binary

Download the release archive and checksums:

```sh
version=0.2.0
base="https://github.com/gicrisf/ondine-cli/releases/download/v${version}"
archive="ondine-v${version}-x86_64-unknown-linux-musl.tar.gz"

curl -fsSLO "${base}/${archive}"
curl -fsSLO "${base}/SHA256SUMS"
grep "  ${archive}$" SHA256SUMS | sha256sum -c -
tar -xzf "${archive}"
```

Install the binary somewhere on `PATH`:

```sh
install -m 0755 "ondine-v${version}-x86_64-unknown-linux-musl/ondine" ~/.local/bin/ondine
```

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
