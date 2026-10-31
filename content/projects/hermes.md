+++
title = "hermes.el"
description = "An Org-mode client for the Hermes AI agent."

[extra]
repo = "https://github.com/gicrisf/hermes.el"
language = ["Emacs Lisp"]
+++

hermes.el is an Emacs client for the [Hermes AI agent](https://github.com/NousResearch/hermes-agent). It turns each session into a plain Org buffer, with streaming responses, tool calls, background tasks, and subagents represented as Org structure rather than an opaque terminal UI.

## Design

Each turn is an Org heading with properties, so chats remain portable text files and edits survive across resumes. Tool output is rendered as Org subtrees with status keywords, inline diffs, and named blocks; images can be pasted or attached and render inline. Background prompts run in their own buffers, and subagent trees appear in place with their goals, thinking traces, tools, and results.

The client talks to Hermes over JSON-RPC 2.0 through the agent's `tui_gateway`. Models, toolsets, and session options can be changed interactively, and slash commands use tab completion.

## Status

The project works but is explicitly unstable and under active development. It requires Emacs 27.1+, a reachable Hermes agent, and an API key for the chosen provider. The repository documents the setup, keybindings, and optional Doom, Evil, and other modules.

{% <social.thread platform="mastodon" label="From Mastodon" author="Giovanni Crisalfi"> %}
{% <social.post
  url="https://fosstodon.org/@gicrisf/116631430457560428"
  date="2026-05-24"
  media="/img/hermes-el-screenshot.png"
  media_alt="screenshot of hermes.el"
> %}
sneak peek at my new emacs package (just open-sourced and still very unstable, but I'm too excited to not share anything about it)

#emacs #lisp #ai #hermes #orgmode
{% </social.post> %}

{% <social.post
  url="https://fosstodon.org/@gicrisf/116631447365113562"
  date="2026-05-24"
> %}
I've almost reached feature parity with the official TUI, and I'm working hard to naturally integrate the flow with org-mode while keeping it dependency-free and easily extensible. If you want to play with it, it already works, but don't trust the docs too much (not yet)

[github.com/gicrisf/hermes.el](https://github.com/gicrisf/hermes.el)
{% </social.post> %}
{% </social.thread> %}
