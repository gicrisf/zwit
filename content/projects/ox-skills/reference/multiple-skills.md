+++
title = "Multiple Skills"
description = "Keep multiple skills in one Org file and export them in one command."
draft = false
weight = 40
[extra]
  lead = "Keep many skills in one Org file and export them together."
  toc = true
+++

Give each skill subtree an `EXPORT_SKILL_NAME` property and a shared `SKILL_BASE_DIR`:

```org
#+SKILL_BASE_DIR: ~/.claude/skills

* Review skill
:PROPERTIES:
:EXPORT_SKILL_NAME: review
:EXPORT_SKILL_DESCRIPTION: Review code changes
:EXPORT_SKILL_ALLOWED_TOOLS: Bash Read
:END:

...

* Deploy skill
:PROPERTIES:
:EXPORT_SKILL_NAME: deploy
:EXPORT_SKILL_DESCRIPTION: Deploy to production
:END:

...
```

Run `M-x ox-skills-export-wim-to-md` (`C-c C-e s a`) to export all subtrees. This writes:

```text
~/.claude/skills/review/SKILL.md
~/.claude/skills/deploy/SKILL.md
```

Set `SKILL_BASE_DIR` to wherever the target tool expects skills. Ox-Skills writes directly into that directory; it does not append an extra subdirectory automatically.
