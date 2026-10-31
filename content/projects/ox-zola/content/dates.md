+++
title = "Dates"
description = "Set post dates and updated timestamps from Org."
weight = 30

[extra]
lead = "Ox-Zola reads Org timestamps, CLOSED properties, and export properties when building date front matter."
toc = true
adapted_from = "ox-hugo"
adapted_url = "https://ox-hugo.scripter.co/doc/dates/"
+++

## Date formats

Date properties accept RFC3339 date-times or ordinary Org timestamps:

```org
:EXPORT_DATE: 2026-10-31
:EXPORT_DATE: 2026-10-31T14:30:00
:EXPORT_DATE: <2026-10-31 Sat>
```

Zola's `date` field controls post ordering. Use `updated` for a last-modified timestamp.

## Subtree dates

When `org-log-done` records completion time, switching a post to `DONE` inserts a `CLOSED` property:

```org
* DONE My post
CLOSED: [2026-10-31 Sat 14:10]
```

That timestamp becomes the post's `date`. If `CLOSED` is absent, `EXPORT_DATE` is used, then the file-level `#+date:` keyword.

`SCHEDULED` is an Org planning timestamp and is not a Zola publishing date. Hugo's `publishDate` and `expiryDate` fields are removed from the exported front matter; use Zola's own publishing workflow if you need scheduling.

## Last modified

Set an explicit updated date:

```org
:EXPORT_HUGO_LASTMOD: 2026-11-02
```

Or enable automatic tracking:

```org
#+hugo_auto_set_lastmod: t
```

When `:LOGBOOK:` state changes are available, they take precedence over the automatic value.
