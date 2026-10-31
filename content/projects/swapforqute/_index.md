+++
title = "SwapForQute"
description = "A qutebrowser userscript for redirecting and cleaning URLs."

template = "projects/page.html"
page_template = "docs/page.html"
sort_by = "weight"
weight = 100

[extra]
repo = "https://github.com/gicrisf/swapforqute"
language = ["Python"]
+++

SwapForQute is a qutebrowser userscript that rewrites URLs according to a small rules table. It can swap a domain for a privacy-friendly frontend, force HTTPS, and remove query parameters or fragments before the page loads.

## How it works

Rules are keyed by hostname and can set an output domain, force HTTPS, clean queries, and clean fragments. Built-in rules live in the script; an optional JSON file extends them without replacing the defaults. The script uses only the Python standard library, so it inherits qutebrowser's Python environment.

## Why

The project exists to avoid JavaScript-heavy sites and tracking where a lighter frontend is available: old Reddit instead of new Reddit, alternative frontends for social media and video, and so on. Installers cover Linux, macOS, and Windows, and the repository includes a test suite.
