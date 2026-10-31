+++
title = "Internal Links"
description = "How ox-zola converts Org links to Zola's native path syntax."
weight = 20

[extra]
lead = "Ox-zola turns Org links into Zola-compatible Markdown, including cross-file links and heading anchors."
toc = true
+++

{% raw %}
Ox-Zola converts Org links to Zola's native `@/` path syntax instead of Hugo's `relref` shortcodes. Cross-references between posts, same-file heading links, external URLs, and file attachments all produce Zola-compatible Markdown.

## Quick reference

| Org link | Hugo output | Zola output |
|----------|-------------|-------------|
| `[[*Some Heading]]` | `[Some Heading](#some-heading)` | `[Some Heading](#some-heading)` |
| `[[#custom-id]]` | `[custom-id](#custom-id)` | `[custom-id](#custom-id)` |
| `[[id:uuid-here][Post]]` | `[Post]({{< relref "post.md" >}})` | `[Post](@/section/post.md)` |
| `[[file:other.org][Other]]` | `[Other]({{< relref "other.md" >}})` | `[Other](@/section/other.md)` |
| `[[file:other.org::*Heading][Link]]` | `[Link]({{< relref "other.md#heading" >}})` | `[Link](@/section/other.md#heading)` |
| `[[https://example.com][Site]]` | `[Site](https://example.com)` | `[Site](https://example.com)` |
| `[[file:image.png]]` | `![img](path/to/image.png)` | `![img](path/to/image.png)` |

## Same-file links

Links to headings within the same file use the standard `#anchor` format:

```org
[[*Some Heading][link]]
[[#custom-id][link]]
```

They become:

```markdown
[link](#some-heading)
[link](#custom-id)
```

## Cross-file links

Links to other Org files become Zola `@/` paths. The prefix resolves from the Zola content root:

```org
#+zola_section: posts
[[file:other.org][other post]]
```

becomes:

```markdown
[other post](@/posts/other.md)
```

Heading anchors and custom IDs are preserved:

```org
[[file:other.org::*Some Heading][link]]
[[file:other.org::#custom-intro][introduction]]
```

```markdown
[link](@/posts/other.md#some-heading)
[introduction](@/posts/other.md#custom-intro)
```

Org `id:` links resolve to the target file automatically:

```org
[[id:abc123-def456-ghij][related post]]
```

## Section detection

When the target file lives under the Zola `content/` directory, ox-zola extracts the correct section from the file's location. A file at:

```text
~/mysite/content/tutorials/guide.org
```

with base directory `~/mysite` becomes:

```text
@/tutorials/guide.md
```

If the section cannot be determined, the current document's section is used as a fallback.

## External URLs and attachments

HTTP, HTTPS, FTP, and `mailto:` links pass through unchanged. Links to non-Org files such as images and PDFs are handled by ox-hugo's attachment rewrite mechanism.

## Images and figures

Inline images use regular Markdown:

```markdown
![alt](src)
```

For standalone figures, use raw HTML or a site-specific component. Zola 0.23 no longer supports the old shortcode form that earlier ox-hugo/ox-zola output used.

## No more relref

The Hugo-specific `{{< relref "..." >}}` syntax never appears in output. Internal references use Zola's native `@/` path syntax, so exported Markdown works directly with Zola.
{% endraw %}
