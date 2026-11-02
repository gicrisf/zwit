+++
title = "Exporting Skills"
description = "Use the export dispatcher and understand how WIM chooses a skill."
draft = false
weight = 10
[extra]
  lead = "Choose the right export command and understand how WIM decides what to write."
  toc = true
+++

## Export commands {#export-commands}

The Skills backend is available under `s` in `M-x org-export-dispatch` (`C-c C-e`).

| Key | Action                                                |
|-----|-------------------------------------------------------|
| `s` | Export the current file to SKILL.md                   |
| `S` | Export the current file to a temporary buffer         |
| `w` | Export the current subtree or file to SKILL.md        |
| `a` | Export all subtrees, or the current file, to SKILL.md |

`ox-skills-export-wim-to-md` is the WIM command behind `w` and `a`. It chooses what to export from point:

1.  If the heading at point has `EXPORT_SKILL_NAME`, export that subtree.
2.  Otherwise walk up the heading hierarchy until a skill is found.
3.  If no heading has `EXPORT_SKILL_NAME`, export the whole file using the file-level `SKILL_NAME` keyword.

With a prefix argument (`C-u`), it exports every subtree in the buffer that has `EXPORT_SKILL_NAME`.


## Output path {#output-path}

Each exported skill is written to:

```text
{SKILL_BASE_DIR}/{EXPORT_SKILL_NAME}/SKILL.md
```

`SKILL_BASE_DIR` is resolved in this order:

1.  `EXPORT_SKILL_BASE_DIR` property on the subtree
2.  File-level `#+SKILL_BASE_DIR:` keyword
3.  `ox-skills-default-base-dir`
4.  Directory of the current Org file


## Example {#example}

Given a multi-skill file:

```org
#+SKILL_BASE_DIR: ~/my-project

* Skill One
:PROPERTIES:
:EXPORT_SKILL_NAME: skill-one
:END:

** Setup

Some instructions here.

* Skill Two
:PROPERTIES:
:EXPORT_SKILL_NAME: skill-two
:END:

Some other instructions.
```

| Point is at        | `ox-skills-export-wim-to-md` | `C-u ox-skills-export-wim-to-md` |
|--------------------|------------------------------|----------------------------------|
| Setup subheading   | exports Skill One            | exports both skills              |
| Skill One heading  | exports Skill One            | exports both skills              |
| Skill Two heading  | exports Skill Two            | exports both skills              |
| Before any heading | exports the whole file       | exports both skills              |


## Other export commands {#other-export-commands}

| Command                      | Behavior                                                |
|------------------------------|---------------------------------------------------------|
| `ox-skills-export-to-md`     | Export the current buffer or subtree explicitly         |
| `ox-skills-export-as-md`     | Export to a temporary buffer                            |
| `ox-skills-export-wim-to-md` | Smart dispatch based on point, or all skills with `C-u` |
