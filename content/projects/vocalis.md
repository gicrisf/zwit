+++
title = "Vocalis"
description = "A Rust port of the GNOME sound recorder."

[extra]
repo = "https://github.com/gicrisf/vocalis-rs"
language = ["Rust"]
+++

Vocalis is a simple sound recorder for GNOME, ported from the original GJS/TypeScript application to Rust. The interface uses GTK4 and libadwaita; recording runs through GStreamer.

## Status

The port is functionally complete. Development uses a Nix flake with the full Rust, GTK, libadwaita, and GStreamer toolchain. Separate `default` and `development` profiles use different application IDs and settings directories, so stable and development builds can run side by side.

A thin Meson layer drives the same Cargo build and handles translations, installation, Flatpak packaging, and CI. The Flatpak target is still being validated against the GNOME nightly runtime.

Upstream is the GNOME Vocalis project. This repository is the Rust port and keeps its own issue tracker.
