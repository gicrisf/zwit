+++
title = "Vocalis"
description = "A Rust port of the GNOME sound recorder."

template = "projects/page.html"
page_template = "docs/page.html"
sort_by = "weight"
weight = 120

[extra]
repo = "https://github.com/gicrisf/vocalis-rs"
language = ["Rust"]
+++

Vocalis is a simple sound recorder for GNOME, ported from the original GJS/TypeScript application to Rust. The interface uses GTK4 and libadwaita; recording runs through GStreamer.

## Status

The port is functionally complete. Development uses a Nix flake with the full Rust, GTK, libadwaita, and GStreamer toolchain. Separate `default` and `development` profiles use different application IDs and settings directories, so stable and development builds can run side by side.

A thin Meson layer drives the same Cargo build and handles translations, installation, Flatpak packaging, and CI. The Flatpak target is still being validated against the GNOME nightly runtime.

Upstream is the GNOME Vocalis project. This repository is the Rust port and keeps its own issue tracker.

{% <social.mastodon
  url="https://fosstodon.org/@gicrisf/117378190020396390"
  author="Giovanni Crisalfi"
  date="2026-10-03"
  media="/img/vocalis-screenshot.png"
  media_alt="Vocalis sound recorder showing three recordings, with waveform and playback controls for the selected recording"
> %}
Got back into #GTK development this weekend. I almost forgot how pleasant these libraries are. Just open-sourced my *unofficial* #rust port of Vocalis (#GNOME sound recorder). Still working on a few details, but I can now declare it functionally complete.

(All credit to the original devs and designers, I just did the port)

[github.com/gicrisf/vocalis-rs](https://github.com/gicrisf/vocalis-rs)
{% </social.mastodon> %}
