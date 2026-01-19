# Creating Custom Templates for Monolog

This document explains how to create custom HTML templates for the Monolog static site generator.

## Using a Custom Template

Pass your template file with the `-t` or `--template` flag:

```bash
monolog -t path/to/my-template.html
```

Or specify it in a config file:

```json
{
  "input": "posts.md",
  "output": "index.html",
  "template": "path/to/my-template.html"
}
```

Then run:

```bash
monolog -c config.json
```

## Template Placeholders

Templates use `{{PLACEHOLDER}}` syntax. The generator performs simple string replacement—no logic, loops, or conditionals are supported.

### Required Placeholders

| Placeholder | Description | Source |
|-------------|-------------|--------|
| `{{SITE_TITLE}}` | Site title | `site_title` field in posts.md front matter |
| `{{AUTHOR}}` | Author name | `author` field in posts.md front matter |
| `{{TABLE_OF_CONTENTS}}` | Navigation links to all posts | Generated HTML (see below) |
| `{{POSTS}}` | All post content | Generated HTML (see below) |
| `{{YEAR}}` | Current year | Generated at build time (e.g., `2026`) |

All placeholders are replaced globally (all occurrences).

## Generated HTML Structure

### Table of Contents (`{{TABLE_OF_CONTENTS}}`)

Generates an unordered list linking to each post by ID:

```html
<ul>
  <li><a href="#2025-01-15-post-title">Post Title</a> - 2025-01-15</li>
  <li><a href="#2025-01-10-another-post">Another Post</a> - 2025-01-10</li>
</ul>
```

- Post IDs follow the format `{date}-{slug}` where slug is the lowercase, hyphenated title
- Posts appear in the order they exist in posts.md (newest first by convention)

### Posts (`{{POSTS}}`)

Each post generates an `<article>` element:

```html
<article id="2025-01-15-post-title">
  <header>
    <h2>Post Title</h2>
    <p><time datetime="2025-01-15">2025-01-15</time></p>
  </header>
  <div class="post-content">
    <p>Markdown content converted to HTML...</p>
  </div>
</article>
```

Key structural elements:
- `<article id="...">` — ID matches the anchor links in the table of contents
- `<header>` — Contains `<h2>` title and `<time>` element with date
- `<div class="post-content">` — Contains the markdown-converted HTML

## Markdown to HTML Conversion

The generator uses `marked` with GitHub Flavored Markdown (GFM) enabled.

### Supported Markdown Features

- Standard Markdown: headings, paragraphs, lists, links, images, code blocks, blockquotes, emphasis
- GFM extensions: tables, strikethrough (`~~text~~`), autolinks, task lists

### Output Characteristics

- Produces semantic HTML elements: `<p>`, `<ul>`, `<ol>`, `<h1>`–`<h6>`, `<blockquote>`, `<pre><code>`, `<table>`, `<a>`, `<img>`, etc.
- No CSS classes are added to markdown-generated elements
- HTML comments in markdown (`<!-- comment -->`) are stripped from output
- Output is trimmed of leading/trailing whitespace

### Example Conversion

Markdown:
```markdown
## Section Title

This is a paragraph with **bold** and *italic* text.

- Item one
- Item two

| Column A | Column B |
|----------|----------|
| Cell 1   | Cell 2   |
```

HTML output:
```html
<h2>Section Title</h2>
<p>This is a paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
<ul>
<li>Item one</li>
<li>Item two</li>
</ul>
<table>
<thead>
<tr>
<th>Column A</th>
<th>Column B</th>
</tr>
</thead>
<tbody>
<tr>
<td>Cell 1</td>
<td>Cell 2</td>
</tr>
</tbody>
</table>
```

## CSS Considerations

### Classless CSS Frameworks

The bundled template uses Pico CSS, a classless framework that styles semantic HTML automatically. Other classless frameworks that work well:

- [Pico CSS](https://picocss.com/)
- [Simple.css](https://simplecss.org/)
- [Water.css](https://watercss.kognise.dev/)
- [MVP.css](https://andybrewer.github.io/mvp/)

### Styling the Generated HTML

Target these elements and classes in your CSS:

```css
/* Table of contents list */
ul { }
ul li { }
ul li a { }

/* Individual posts */
article { }
article header { }
article header h2 { }
article header time { }
article .post-content { }

/* Markdown content inside posts */
article .post-content p { }
article .post-content h2,
article .post-content h3 { }
article .post-content ul,
article .post-content ol { }
article .post-content blockquote { }
article .post-content pre code { }
article .post-content table { }
```

### Framework-Specific Overrides

Some CSS frameworks restyle certain elements in ways that may conflict with expected layouts. For example, Pico CSS styles `<nav>` as horizontal navigation. The bundled template overrides this:

```css
body nav.table-of-contents {
  display: block;
}
body nav.table-of-contents ul {
  display: block;
  padding-left: 2rem;
}
body nav.table-of-contents li {
  display: list-item;
}
```

Use higher specificity selectors (like `body nav.class`) to override framework defaults without `!important`.

## Syntax Highlighting

The bundled template includes [highlight.js](https://highlightjs.org/) for automatic syntax highlighting of code blocks.

### How It Works

When you write a fenced code block with a language identifier:

````markdown
```python
def hello():
    print("Hello")
```
````

The markdown processor outputs:

```html
<pre><code class="language-python">def hello():
    print("Hello")
</code></pre>
```

highlight.js detects the language class and applies syntax highlighting automatically.

### Bundled Template Setup

The bundled template includes these resources:

```html
<!-- In <head> -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/styles/github.min.css">

<!-- Before </body> -->
<script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/highlight.min.js"></script>
<script>hljs.highlightAll();</script>
```

### Using a Different Theme

Replace the CSS file with any [highlight.js theme](https://highlightjs.org/demo):

```html
<!-- Dark theme example -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/styles/github-dark.min.css">

<!-- Other popular themes -->
<!-- styles/atom-one-dark.min.css -->
<!-- styles/monokai.min.css -->
<!-- styles/vs2015.min.css -->
```

### Adding to a Custom Template

To add syntax highlighting to your own template:

1. Add the CSS theme in `<head>`:
   ```html
   <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/styles/github.min.css">
   ```

2. Add the script before `</body>`:
   ```html
   <script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/highlight.min.js"></script>
   <script>hljs.highlightAll();</script>
   ```

### Disabling Syntax Highlighting

If you don't want syntax highlighting in a custom template, simply omit the highlight.js CSS and JavaScript.

## Minimal Template Example

A complete minimal template:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{SITE_TITLE}}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 1rem; }
    article { margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid #ccc; }
    time { color: #666; }
  </style>
</head>
<body>
  <header>
    <h1>{{SITE_TITLE}}</h1>
    <p>By {{AUTHOR}}</p>
  </header>

  <nav>
    <h2>Posts</h2>
    {{TABLE_OF_CONTENTS}}
  </nav>

  <main>
    {{POSTS}}
  </main>

  <footer>
    <p>&copy; {{YEAR}} {{AUTHOR}}</p>
  </footer>
</body>
</html>
```

## Limitations

The template system has the following constraints:

1. **No per-post metadata in templates** — `topic` and `tags` fields exist in post front matter but are not exposed as template placeholders
2. **No conditional logic** — Cannot show/hide elements based on conditions
3. **No loops** — Cannot iterate over posts with custom markup per post
4. **No partials** — Cannot include other template files
5. **Fixed post structure** — The `<article>` structure is hardcoded in the generator; templates only control the surrounding page layout
6. **Single page output** — All posts render to one HTML file; no pagination or individual post pages

To change the post HTML structure itself, modify `src/generator.ts:generatePostHtml()`.
