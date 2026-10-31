+++
title = "QR Bot"
description = "A QR code Telegram bot built on a vanilla Zustand store."

template = "projects/page.html"
page_template = "docs/page.html"
sort_by = "weight"
weight = 70

[extra]
repo = "https://github.com/gicrisf/qrbot"
language = ["TypeScript"]
+++

QR Bot is a Telegram bot for generating QR codes without ads, paywalls, or questionable privacy practices. Send it text, get a QR code back.

## Why

The project started as a reaction to the state of online QR code generators: obnoxious ads, paid tiers, and services that ask for more data than they need. A Telegram bot was a better fit than another web app. It is easier for a small team to use, and it removes the need to build a polished UI.

## Architecture

The bot uses Zustand's vanilla `createStore` outside React to keep business logic in pure, testable functions while isolating network and file I/O at the edges. Conversations, async QR generation, request tracking, and per-chat preferences all live in the store, with an Elm-style unidirectional flow that makes the bot practical to unit test.

The implementation is written in TypeScript. The [repository](https://github.com/gicrisf/qrbot) contains the bot and its tests.
