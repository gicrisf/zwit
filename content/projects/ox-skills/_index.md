+++
title = "Ox-Skills"
description = "Write AI coding assistant skills in Org mode and export them to SKILL.md."

template = "projects/page.html"
page_template = "docs/page.html"
sort_by = "weight"
weight = 50

[extra]
repo = "https://github.com/gicrisf/ox-skills"
language = ["Emacs Lisp"]
+++

Ox-Skills is an Org exporter backend that writes `SKILL.md` files with YAML frontmatter. It keeps prompt engineering in Org mode and exports directly into the directory an AI coding assistant scans for skills.

## How it works

File-level `SKILL_*` keywords and `EXPORT_SKILL_*` property drawers describe the skill: name, description, allowed tools, argument hints, model, and output location. Source blocks marked `:inject yes` become executable context blocks that the harness runs at invocation time, while ordinary source blocks export as normal fenced code.

A single Org file can hold many skills, and `EXPORT_SKILL_SUBDIR` places them into nested directories. The Skills backend appears under `s` in the Org export dispatcher and can write the current file, a subtree, or all subtrees to `SKILL.md`.

The [repository](https://github.com/gicrisf/ox-skills) has installation instructions for straight.el and the built-in `:vc` package manager.
