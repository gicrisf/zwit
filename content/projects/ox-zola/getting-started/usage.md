+++
title = "Usage"
description = "Export Org subtrees or whole files to Zola Markdown."
weight = 30

[extra]
lead = "Set the site root, mark valid posts with EXPORT_FILE_NAME, and choose an export command."
toc = true
+++

## Before you export

Set `ox-zola-base-dir` or the `ZOLA_BASE_DIR` keyword. Set `ox-zola-section` or the matching section keyword for the default output section.

For subtree exports, the post subtree must have `EXPORT_FILE_NAME`. A subtree with `EXPORT_FILE_NAME` cannot contain another subtree with that property; post subtrees are leaves.

## Export commands

The Zola backend is available under `Z` in `M-x org-export-dispatch` (`C-c C-e`):

| Key | Action |
|-----|--------|
| `z` | Export the current subtree or file |
| `O` | Export the current subtree or file and open it |
| `A` | Export all subtrees, or the whole file |
| `Z` | Export the file to a temporary buffer |
| `f` | Export the file to a Markdown file |
| `o` | Export the file to a Markdown file and open it |

The subtree/file command is the usual WIM export: if point is in a valid post subtree it exports that subtree; otherwise, if the file has a `#+title`, it exports the whole file.

## Customization

Use `M-x customize-group RET ox-zola` to inspect the available export options.
