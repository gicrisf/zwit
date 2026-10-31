+++
title = "Drawers"
description = "Export LOGBOOK notes and state-change timestamps."
weight = 130

[extra]
lead = "Drawers can feed dates and structured notes into front matter, but the rendering side must be written for Zola templates."
toc = true
adapted_from = "ox-hugo"
adapted_url = "https://ox-hugo.scripter.co/doc/drawers/"
+++

## LOGBOOK state changes

When `org-log-into-drawer` is enabled and drawer export is active, ox-zola can read `:LOGBOOK:` state changes. The first transition to a `DONE` state supplies `date`; later transitions and notes can supply `updated`.

Enable drawer export with:

```org
#+options: d:t
```

or in a subtree:

```org
:EXPORT_OPTIONS: d:t
```

## LOGBOOK notes

Notes stored under a post heading are exported into structured front matter, grouped by heading. This preserves the note text and timestamps as data.

The ox-hugo examples render that data with Hugo templates. In a Zola site, access the same front-matter data from Tera templates instead. The data export is independent of the template language; the rendering layer is site-specific.

## Caveats

The parsing behavior depends on the default `org-log-note-headings` format. If you customize that variable heavily, verify the exported date and note structure.
