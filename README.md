# Monolog

A single-file microblogging framework that generates static HTML from Markdown.

## What is Monolog?

Monolog is a minimal static site generator for microblogging. Write all your posts in one Markdown file, run the generator, and get a single-page HTML blog with syntax highlighting.

## Features

- **Single file for content** — All posts live in one Markdown file, ordered newest-first
- **CLI tool** — Install globally or as a project dependency
- **Syntax highlighting** — Code blocks highlighted via highlight.js
- **Custom templates** — Use the bundled template or provide your own
- **Permalinks** — Optional hover-to-reveal links with click-to-copy
- **HTML sanitization** — Optional XSS protection with `--sanitize`
- **No database** — Just files and a build command

## Installation

### Global install (for local use)

```bash
git clone https://github.com/sujankapadia/monolog.git
cd monolog
npm install
npm run build
npm install -g .
```

Then use `monolog` from any directory.

### As a project dependency (for Netlify, etc.)

```bash
npm install --save-dev github:sujankapadia/monolog
```

## Usage

### Basic usage

```bash
# Using defaults (posts.md → index.html)
monolog

# Specify input and output
monolog -i blog.md -o public/index.html

# With HTML sanitization
monolog --sanitize

# With permalinks (hover to reveal, click to copy URL)
monolog --permalinks
```

### CLI options

```
Options:
  -i, --input <file>     Input markdown file (default: posts.md)
  -o, --output <file>    Output HTML file (default: index.html)
  -t, --template <file>  Custom template file (default: bundled template)
  -c, --config <file>    Config file path (JSON)
  -h, --help             Show help message
  --help-templates       Show documentation for creating custom templates
  --sanitize             Sanitize HTML output to prevent XSS attacks
  --permalinks           Add hover-to-reveal permalink to each post (click to copy URL)
```

### Using a config file

```bash
monolog -c config.json
```

Config file format:
```json
{
  "input": "posts.md",
  "output": "index.html",
  "template": "path/to/custom-template.html"
}
```

CLI flags override config file values.

## Writing Posts

Create a `posts.md` file (see `examples/posts.md` for reference):

```markdown
+++
site_title: "My Microblog"
author: Your Name
+++

+++
title: "Latest Post"
date: 2025-01-15
tags: example, first
+++

Your post content here with **Markdown** formatting.

Code blocks get syntax highlighting:

```python
def hello():
    print("Hello, world!")
```

+++
title: "Older Post"
date: 2025-01-10
+++

Another post...
```

### Post format

- Uses `+++` delimiters for YAML front matter (not `---`, to avoid conflicts with Markdown horizontal rules)
- First block: site metadata (`site_title`, `author`)
- Subsequent blocks: individual posts (`title`, `date`, optional `topic`, `tags`)
- Posts ordered newest-first by convention
- Supports GitHub Flavored Markdown (tables, strikethrough, code blocks)
- HTML comments (`<!-- -->`) are stripped from output

## Custom Templates

Use your own HTML template with the `-t` flag:

```bash
monolog -t my-template.html
```

For full documentation on creating templates:

```bash
monolog --help-templates
```

The bundled template uses [Pico CSS](https://picocss.com/) and [highlight.js](https://highlightjs.org/).

## Deploying with Netlify

In your blog project:

1. Add monolog as a dependency:
   ```bash
   npm install --save-dev github:sujankapadia/monolog
   ```

2. Add build script to `package.json`:
   ```json
   {
     "scripts": {
       "build": "monolog -i posts.md -o index.html"
     }
   }
   ```

3. Configure Netlify (`netlify.toml`):
   ```toml
   [build]
     command = "npm run build"
     publish = "."
   ```

## Project Structure

```
monolog/
├── src/                  # TypeScript source
├── dist/                 # Compiled JavaScript (generated)
├── templates/
│   └── default.html      # Bundled HTML template
├── docs/
│   └── custom-templates.md
├── examples/
│   ├── posts.md          # Example posts file
│   └── config.json       # Example config file
└── package.json
```

## License

MIT
