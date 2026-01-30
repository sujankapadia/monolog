# Monolog Posts File Format

Monolog reads a single Markdown file containing all site metadata and posts. This document describes the format.

## File Structure

The file consists of YAML front matter blocks delimited by `+++` (not `---`, which conflicts with Markdown horizontal rules). The first block is site metadata. All subsequent blocks are posts.

```
+++
<site metadata>
+++

+++
<post 1 metadata>
+++

<post 1 content>

+++
<post 2 metadata>
+++

<post 2 content>
```

## Site Metadata Block (Required, First Block)

The first `+++` block defines site-level configuration.

Required fields:
- `site_title` (string): The title of the site, displayed in the header and page title.
- `author` (string): The site author name.

Example:
```yaml
+++
site_title: "My Microblog"
author: Jane Doe
+++
```

Additional fields are allowed and accessible in the site metadata object, but the default template only uses `site_title` and `author`.

## Post Blocks

Each post has a YAML front matter block followed by Markdown content.

### Post Metadata Fields

Required:
- `title` (string): The post title.
- `date` (string): Publication date in `YYYY-MM-DD` format. Example: `2025-10-15`

Optional:
- `topic` (string): A single topic/category for the post. Example: `technology`
- `tags` (string): Comma-separated list of tags. Example: `web, blogging, markdown`

Example:
```yaml
+++
title: "My Post Title"
date: 2025-10-15
topic: technology
tags: web, blogging, markdown
+++
```

### Post Content

Post content follows the closing `+++` of the post's metadata block and continues until the next `+++` block or end of file.

Content is written in GitHub Flavored Markdown (GFM), which supports:
- **Bold** (`**text**`), *italic* (`*text*`), and `inline code`
- Headings (`## Heading`)
- Links (`[text](url)`)
- Images (`![alt](url)`) — relative paths resolve relative to the output `index.html`, so place image files accordingly
- Ordered and unordered lists
- Blockquotes (`> quote`)
- Fenced code blocks with language syntax highlighting:

  ````
  ```python
  print("hello")
  ```
  ````

- Tables, strikethrough, and other GFM extensions
- Thematic breaks / horizontal rules (`---`)
- Raw HTML (sanitized if `--sanitize` flag is used)

HTML comments (`<!-- comment -->`) are stripped from the output and can be used as author notes.

## Post Ordering

Posts should be ordered newest-first (most recent at the top of the file). The generated site preserves file order.

## Post IDs

Each post is assigned an ID in the format `{date}-{slug}` where the slug is a lowercase, hyphenated version of the title. For example, a post titled "My First Post" dated 2025-10-15 gets the ID `2025-10-15-my-first-post`. These IDs are used as anchor links in the table of contents.

## Complete Example

```markdown
+++
site_title: "Jane's Blog"
author: Jane Doe
+++

+++
title: "Latest Update"
date: 2025-10-15
topic: personal
tags: update, news
+++

Here is my latest post with **bold text** and a [link](https://example.com).

<!-- This comment won't appear in the output -->

+++
title: "Getting Started"
date: 2025-10-14
tags: intro
+++

Welcome to my blog!

> A journey of a thousand miles begins with a single step.

1. First item
2. Second item
3. Third item

+++
title: "Hello World"
date: 2025-10-13
+++

Just getting started. More to come!
```

Notes:
- The `topic` and `tags` fields are optional and can be omitted (as in the "Hello World" post above).
- There must be at least one post after the site metadata block.
- Quotes around string values in YAML are optional unless the value contains special characters.
