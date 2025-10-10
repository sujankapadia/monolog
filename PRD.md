# Product Requirements Document: Monolog Microblogging Framework

## Overview

Monolog is a simple, single-file microblogging framework designed for personal use. It consists of:
1. A single Markdown file containing all blog posts and site metadata
2. A static site generator that processes the file and outputs a single HTML page

The system prioritizes simplicity, convenience, and ease of use.

## Goals

- Enable quick, frictionless posting of short-to-medium form content (a few words to 1-2 paragraphs)
- Maintain all content in a single, easily editable Markdown file
- Generate a clean, semantic HTML site that can be styled flexibly
- Support AI agent-based posting interface for maximum convenience

## File Structure

### Source File Format

The source file is a single Markdown file with the following structure:

```markdown
---
site_title: "Site Title"
author: Author Name
---

---
title: "Post Title"
date: YYYY-MM-DD
topic: category
tags: tag1, tag2, tag3
---

Post content in Markdown...

<!-- Optional comments for author use only -->

---
title: "Next Post Title"
date: YYYY-MM-DD
---

More post content...
```

### Site Metadata (First YAML Block)

The first YAML front matter block contains site-level configuration:
- `site_title`: Display title for the site
- `author`: Author name
- Additional fields can be added as needed

### Post Structure

Each post consists of:
1. **YAML front matter block** with metadata
2. **Post content** in Markdown format

Posts are ordered from most recent (top) to oldest (bottom).

### Post Metadata

- `title` (required): Human-readable post title
- `date` (required): Publication date in ISO format (YYYY-MM-DD)
- `topic` (optional): Single topic/category for the post
- `tags` (optional): Comma-separated list of tags

### Comments

Author can include comments anywhere in the file using HTML comment syntax:
```markdown
<!-- This is a comment for author use only -->
```

Comments are not rendered in the generated HTML output.

## Content Formatting

Posts support standard Markdown formatting:

- **Bold** and *italics*
- Bullet points and numbered lists
- [Hyperlinks](https://example.com)
- `Inline code` and fenced code blocks
- Images: `![alt text](image-url)`
- Block quotes: `> quoted text`

## Generated Site Structure

### Output Format

The generator produces a single HTML page containing:

1. **Site header**: Site title
2. **Table of contents**: List of all posts with titles, dates, and hyperlinks to post anchors
3. **Post content**: All posts rendered in order with:
   - Post title
   - Post date
   - Post content (Markdown converted to HTML)
   - Permalink anchor for direct linking
4. **Footer**: Minimal footer with "Back to top" link and author/copyright information

### HTML Requirements

- Semantic HTML structure for flexible styling
- No inline styles or opinionated CSS (styling applied separately)
- Each post has a unique anchor/ID for permalink functionality
- Table of contents links to post anchors
- Accessible markup (proper heading hierarchy, alt text, etc.)

### Table of Contents

- Located at the top of the page below the site header
- Shows post title and date for each post
- Hyperlinks to corresponding post anchor on the same page
- No filtering or grouping in initial version (future enhancement)

### Footer

Minimal footer containing:
- "Back to top" link
- Author name and/or copyright notice

## Static Site Generator

### Functionality

The generator tool:
1. Reads the source Markdown file
2. Parses the first YAML block as site metadata
3. Parses subsequent YAML blocks as individual posts
4. Converts Markdown content to HTML
5. Generates table of contents from post metadata
6. Outputs a single HTML file

### Execution

- Runs on demand (manual invocation)
- No file watching or auto-regeneration in initial version

### Implementation Language

TBD - candidates include Python or Node.js for simplicity and library availability.

## Workflow

### Adding a New Post

1. Open the source Markdown file
2. Copy the previous post's YAML front matter block
3. Paste at the top of the file (below site metadata)
4. Edit metadata fields (title, date, topic, tags)
5. Write post content
6. Save file
7. Run generator to rebuild site

Alternative: Use AI agent interface to add posts programmatically by providing post content and metadata.

### Editing Existing Posts

1. Open source file
2. Locate and edit post content or metadata
3. Save file
4. Run generator to rebuild site

## Future Enhancements (Out of Scope for V1)

- Filtering/grouping in table of contents (by topic, by tag, by date)
- Multiple pages or separate post pages
- RSS feed generation
- Search functionality
- Display of additional metadata (topic, tags) on rendered posts
- Draft status for posts
- Inter-post navigation (previous/next)
- Auto-regeneration on file change
- Deployment automation

## Success Criteria

- Can add a new post in under 60 seconds
- Single command generates complete site
- Output HTML is valid and semantic
- Site displays correctly without styling (content is readable)
- Site can be easily styled with custom CSS
- All posts are accessible via table of contents
- Posts can be linked directly via permalinks
