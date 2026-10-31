+++
title = "Blogging Flow"
description = "Choose between one post per subtree and one post per file."
weight = 40

[extra]
lead = "Subtrees are the preferred flow because they let Org manage metadata through inheritance and TODO states."
toc = true
adapted_from = "ox-hugo"
adapted_url = "https://ox-hugo.scripter.co/doc/blogging-flow/"
+++

There are two main flows for writing with ox-zola.

## One post per Org subtree

This is the preferred workflow. Each post is a subtree with `EXPORT_FILE_NAME`, and you can either export the current subtree or all valid post subtrees at once.

Subtree exports let you use Org's tag and property inheritance, TODO states for draft status, automatic weight calculation, and shared file-level configuration.

## One post per Org file

This also works, but a whole-file export cannot take advantage of subtree inheritance or automatic weights and taxonomies. Metadata that would normally be inherited must be written explicitly with file-level keywords.

For a first post, see [Quick Start](@/projects/ox-zola/getting-started/quick-start.md). For Hugo migration details, see [Migrating from ox-hugo](@/projects/ox-zola/getting-started/migration-from-ox-hugo.md).
