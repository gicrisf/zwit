+++
title = "Quick Start"
description = "Create a first skill and export it to SKILL.md."
draft = false
weight = 10
[extra]
  lead = "Write a skill in Org, set its base directory, and export it to SKILL.md."
  toc = true
+++

## Write the skill {#write-the-skill}

Set `SKILL_BASE_DIR` to the directory where skills should be written. Add the skill metadata as file-level keywords and write the body:

```org
#+SKILL_NAME: review
#+SKILL_DESCRIPTION: Review code changes in the current branch
#+SKILL_ALLOWED_TOOLS: Bash Read
#+SKILL_USER_INVOCABLE: true
#+SKILL_BASE_DIR: ~/.claude/skills

* Instructions

Focus on correctness, not style. Check for edge cases.

#+begin_src sh :inject yes
git diff HEAD
#+end_src
```


## Export {#export}

Run `M-x org-export-dispatch` (`C-c C-e`). The Skills backend appears under `s`:

```text
[s] Export to SKILL.md
    [s] File to SKILL.md
    [S] File to a temporary buffer
    [w] Subtree or File to SKILL.md
    [a] All subtrees (or File) to SKILL.md
```

The skill is written to `{SKILL_BASE_DIR}/{SKILL_NAME}/SKILL.md`. In this example, that is `~/.claude/skills/review/SKILL.md`.


## Next steps {#next-steps}

-   [Installation](/projects/ox-skills/getting-started/installation/)
-   [Exporting Skills](/projects/ox-skills/reference/exporting/)
-   [Keywords](/projects/ox-skills/reference/keywords/)
