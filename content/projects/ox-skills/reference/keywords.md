+++
title = "Keywords"
description = "Map Org keywords and properties to SKILL.md YAML frontmatter."
draft = false
weight = 20
[extra]
  lead = "Map SKILL_* keywords and EXPORT_SKILL_* properties to YAML frontmatter."
  toc = true
+++

## Supported fields {#supported-fields}

| Org keyword                      | YAML field                 | Type   |
|----------------------------------|----------------------------|--------|
| `SKILL_NAME`                     | `name`                     | string |
| `SKILL_DESCRIPTION`              | `description`              | string |
| `SKILL_WHEN_TO_USE`              | `when_to_use`              | string |
| `SKILL_ARGUMENT_HINT`            | `argument-hint`            | string |
| `SKILL_ARGUMENTS`                | `arguments`                | list   |
| `SKILL_ALLOWED_TOOLS`            | `allowed-tools`            | list   |
| `SKILL_DISABLE_MODEL_INVOCATION` | `disable-model-invocation` | bool   |
| `SKILL_USER_INVOCABLE`           | `user-invocable`           | bool   |
| `SKILL_MODEL`                    | `model`                    | string |
| `SKILL_EFFORT`                   | `effort`                   | string |
| `SKILL_CONTEXT`                  | `context`                  | string |
| `SKILL_AGENT`                    | `agent`                    | string |
| `SKILL_PATHS`                    | `paths`                    | list   |
| `SKILL_SHELL`                    | `shell`                    | string |
| `SKILL_BASE_DIR`                 | output path only           | —      |

List fields are space-separated; quote multi-word items. Boolean fields accept `true` or `yes`, and `false` or `no`.


## File-level and subtree metadata {#file-level-and-subtree-metadata}

File-level exports use `#+SKILL_*` keywords. Subtree exports use the same names in a `:PROPERTIES:` drawer with an `EXPORT_` prefix.

```org
* Review skill
:PROPERTIES:
:EXPORT_SKILL_NAME: review
:EXPORT_SKILL_DESCRIPTION: Review code changes
:EXPORT_SKILL_ALLOWED_TOOLS: Bash Read
:END:
```
