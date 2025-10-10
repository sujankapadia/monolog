# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Monolog is a single-file microblogging framework. It generates a static HTML site from a single Markdown file containing all posts and metadata.

**Core philosophy**: Simplicity, convenience, single-file content management.

## Build and Run Commands

```bash
# Build TypeScript to JavaScript
npm run build

# Generate static site from posts.md
npm run generate
```

The generator reads `posts.md`, processes it, and outputs `index.html`.

## Architecture

### Data Flow Pipeline

```
posts.md → Parser → Markdown Processor → HTML Generator → index.html
```

1. **Parser** (`src/parser.ts`): Extracts YAML front matter blocks using `+++` delimiters, separates site metadata from posts
2. **Markdown Processor** (`src/markdown.ts`): Converts Markdown to HTML using `marked`, strips HTML comments
3. **HTML Generator** (`src/generator.ts`): Populates template with processed content, generates table of contents
4. **CLI** (`src/cli.ts`): Orchestrates the pipeline, reads config, handles errors

### Key Implementation Details

**YAML Delimiters**: Uses `+++` instead of standard `---` to avoid conflicts with Markdown horizontal rules (`---`). The parser uses regex to find all `+++` blocks, treats the first as site metadata, remaining as posts.

**Post IDs**: Generated as `{date}-{slug}` where slug is lowercase, hyphenated version of title. Used for anchor links in table of contents.

**Date Handling**: `gray-matter` converts YAML dates to JavaScript Date objects. Parser normalizes them back to `YYYY-MM-DD` strings via `normalizeDate()` function.

**Tags**: Stored as comma-separated strings in YAML, parsed into arrays by `parseTags()`.

**HTML Comments**: Stripped during Markdown processing to support author notes that don't appear in output.

**Template System**: Simple string replacement using placeholders like `{{SITE_TITLE}}`. Template is in `templates/default.html`.

### File Format (`posts.md`)

```markdown
+++
site_title: "Site Title"
author: Author Name
+++

+++
title: "Post Title"
date: YYYY-MM-DD
topic: optional-topic
tags: tag1, tag2, tag3
+++

Post content in GitHub Flavored Markdown...

<!-- Author comments are stripped from output -->
```

Posts are ordered newest-first (top of file).

### Configuration (`config.json`)

Specifies input file, output file, and template paths. Currently hardcoded to be read from project root.

### Styling

Uses Pico CSS (classless framework) via CDN. Custom overrides in template `<style>` block use higher specificity selectors (e.g., `body nav.table-of-contents`) to avoid `!important`.

## Communication Style

- Stick to factual statements, observations, and suggestions
- Avoid subjective claims about quality, aesthetics, or outcomes you cannot verify
- Don't make assumptions about what "looks good," "works well," or is "better" without objective criteria
- Present options and trade-offs objectively rather than expressing opinions
- Avoid overly enthusiastic language ("great!", "perfect!", "excellent!", "absolutely", "you're absolutely right!") - be neutral and precise

