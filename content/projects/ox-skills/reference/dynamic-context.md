+++
title = "Dynamic Context Injection"
description = "Inject fresh command output into a skill at invocation time."
draft = false
weight = 30
[extra]
  lead = "Turn source blocks into executable context blocks with :inject yes."
  toc = true
+++

Source blocks with `:inject yes` become executable context blocks. The harness runs them when the skill is invoked:

```org
#+begin_src sh :inject yes
git diff HEAD
#+end_src
```

The exported `SKILL.md` contains:

````text
```!
git diff HEAD
```
````

Regular source blocks export as standard fenced code blocks.
