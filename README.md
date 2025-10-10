# Monolog

A single-file microblogging framework that generates static HTML from Markdown with YAML front matter.

## What is Monolog?

Monolog is a minimal static site generator for microblogging. Write all your posts in one Markdown file with metadata, run the generator, and get a single-page HTML blog.

## Why Monolog?

- **Single file for content**: All posts live in one Markdown file, ordered newest-first
- **Simple workflow**: Copy-paste metadata block, write content, regenerate
- **Semantic HTML**: Clean output ready for any CSS framework or custom styling
- **No database**: Just files and a build command

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone <repository-url>
cd monolog
npm install
npm run build
```

### Usage

1. Copy the example posts file:
   ```bash
   cp examples/posts.md posts.md
   ```

2. Edit `posts.md` with your content:
   ```markdown
   +++
   site_title: "Your Microblog"
   author: Your Name
   +++

   +++
   title: "Your First Post"
   date: 2025-10-10
   tags: example, test
   +++

   Your post content here with **Markdown** formatting.
   ```

3. Generate the site:
   ```bash
   npm run generate
   ```

4. Open `index.html` in your browser

## File Structure

- `posts.md` - Your content (create from `examples/posts.md`)
- `config.json` - Input/output file paths
- `templates/default.html` - HTML template
- `src/` - TypeScript source code
- `index.html` - Generated output

## How It Works

The generator uses `+++` delimiters for YAML front matter blocks (instead of `---` to avoid conflicts with Markdown horizontal rules). The first block contains site metadata, subsequent blocks are individual posts.

Posts support GitHub Flavored Markdown including code blocks, lists, links, images, and blockquotes. HTML comments in posts are stripped from output.

## Contributing

This is a personal project, but issues and suggestions are welcome.

## License

MIT
