+++
template = "projects/page.html"
title = "Ox-Skills"
description = "Write AI coding assistant skills in Org mode and export them to SKILL.md."
draft = false
weight = 50
page_template = "docs/page.html"
sort_by = "weight"
[extra]
  repo = "https://github.com/gicrisf/ox-skills"
  language = ["Emacs Lisp"]
+++

Ox-Skills is an Org exporter backend that writes `SKILL.md` files with YAML frontmatter. It keeps prompt engineering in Org mode and exports directly into the directory an AI coding assistant scans for skills.


## How it works {#how-it-works}

File-level `SKILL_*` keywords and `EXPORT_SKILL_*` property drawers describe the skill: name, description, allowed tools, argument hints, model, and output location. Source blocks marked `:inject yes` become executable context blocks that the harness runs at invocation time, while ordinary source blocks export as normal fenced code.

A single Org file can hold many skills, and `EXPORT_SKILL_SUBDIR` places them into nested directories. The Skills backend appears under `s` in the Org export dispatcher and can write the current file, a subtree, or all subtrees to `SKILL.md`.

Start with [Quick Start](/projects/ox-skills/getting-started/quick-start/), then use the reference pages for keywords, injection, and multi-skill exports.


## Real-world example {#real-world-example}

[gicrisf/skills](https://github.com/gicrisf/skills) is a collection of AI agent skills exported from Org mode with ox-skills. It demonstrates a multi-skill `SKILLS.org`, the WIM export workflow, symlinks into tool skill directories, and a meta-skill for bootstrapping new skills.


## License {#license}

Ox-Skills is licensed under [GPL-3.0](https://www.gnu.org/licenses/gpl-3.0).
