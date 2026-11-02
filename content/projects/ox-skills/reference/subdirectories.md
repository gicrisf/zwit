+++
title = "Subdirectories"
description = "Organize skills into nested directories with section properties."
draft = false
weight = 50
[extra]
  lead = "Place skills into nested directories with EXPORT_SKILL_SUBDIR."
  toc = true
+++

Declare section headings with `EXPORT_SKILL_SUBDIR`. Each ancestor contributes a path segment to skills nested below it:

```org
#+SKILL_BASE_DIR: ~/.claude/skills

* Engineering
:PROPERTIES:
:EXPORT_SKILL_SUBDIR: engineering
:END:

** Tools
:PROPERTIES:
:EXPORT_SKILL_SUBDIR: tools
:END:

*** Code Review
:PROPERTIES:
:EXPORT_SKILL_NAME: code-review
:EXPORT_SKILL_DESCRIPTION: Review code changes
:END:
```

This produces:

```text
~/.claude/skills/
└── engineering/
    └── tools/
        └── code-review/
            └── SKILL.md
```

Section headings without `EXPORT_SKILL_NAME` are not exported themselves. They only contribute their `EXPORT_SKILL_SUBDIR` segment to nested skills. Sections can be nested to any depth.

Skill harnesses scan all subdirectories under the skills root, so a skill at `engineering/tools/code-review/SKILL.md` is discovered just like one at `code-review/SKILL.md`.
