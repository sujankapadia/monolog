#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { parseFile } from './parser.js';
import { markdownToHtml, sanitizeHtml } from './markdown.js';
import { generatePage } from './generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

type PermalinkPosition = 'before' | 'after';

interface Config {
  input: string;
  output: string;
  template: string;
  sanitize: boolean;
  permalinks: boolean;
  permalink_position: PermalinkPosition;
}

function getDefaultTemplatePath(): string {
  // Template is at ../templates/default.html relative to dist/cli.js
  return join(__dirname, '..', 'templates', 'default.html');
}

function getDocsPath(filename: string): string {
  return join(__dirname, '..', 'docs', filename);
}

function printDocsFile(filename: string, label: string): void {
  const docsPath = getDocsPath(filename);
  if (!existsSync(docsPath)) {
    console.error(`${label} documentation not found.`);
    process.exit(1);
  }
  const content = readFileSync(docsPath, 'utf-8');
  console.log(content);
}

function printHelp(): void {
  console.log(`
monolog - Single-file microblogging framework

Usage: monolog [options]

Options:
  -i, --input <file>     Input markdown file (default: posts.md)
  -o, --output <file>    Output HTML file (default: index.html)
  -t, --template <file>  Custom template file (default: bundled template)
  -c, --config <file>    Config file path (JSON with input, output, template fields)
  -h, --help             Show this help message
  --help-posts           Show documentation for the posts file format
  --help-templates       Show documentation for creating custom templates
  --sanitize             Sanitize HTML output to prevent XSS attacks
  --permalinks           Add hover-to-reveal permalink to each post (click to copy URL)
  --permalink-position <before|after>  Position of permalink relative to title (default: before)

Examples:
  monolog                           # Use defaults (posts.md -> index.html)
  monolog -i blog.md -o blog.html   # Specify input and output
  monolog -c monolog.config.json    # Use config file
  monolog -c config.json -o out.html  # Config file with flag override

Config file format (JSON):
  {
    "input": "posts.md",
    "output": "index.html",
    "template": "path/to/template.html",
    "sanitize": true,
    "permalinks": true,
    "permalink_position": "before"
  }
`);
}

function parseArgs(args: string[]): { flags: Partial<Config>; configPath?: string; help: boolean; helpPosts: boolean; helpTemplates: boolean } {
  const flags: Partial<Config> = {};
  let configPath: string | undefined;
  let help = false;
  let helpPosts = false;
  let helpTemplates = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];

    switch (arg) {
      case '-h':
      case '--help':
        help = true;
        break;
      case '--help-posts':
        helpPosts = true;
        break;
      case '--help-templates':
        helpTemplates = true;
        break;
      case '--sanitize':
        flags.sanitize = true;
        break;
      case '--permalinks':
        flags.permalinks = true;
        break;
      case '--permalink-position':
        if (nextArg === 'before' || nextArg === 'after') {
          flags.permalink_position = nextArg;
        } else {
          throw new Error(`Invalid permalink position: ${nextArg}. Must be "before" or "after".`);
        }
        i++;
        break;
      case '-i':
      case '--input':
        flags.input = nextArg;
        i++;
        break;
      case '-o':
      case '--output':
        flags.output = nextArg;
        i++;
        break;
      case '-t':
      case '--template':
        flags.template = nextArg;
        i++;
        break;
      case '-c':
      case '--config':
        configPath = nextArg;
        i++;
        break;
    }
  }

  return { flags, configPath, help, helpPosts, helpTemplates };
}

function loadConfigFile(configPath: string): Partial<Config> {
  const content = readFileSync(configPath, 'utf-8');
  const parsed = JSON.parse(content);

  const config: Partial<Config> = {};

  // Map old config format (sourceFile, outputFile, templateFile) to new format
  if (parsed.input || parsed.sourceFile) {
    config.input = parsed.input || parsed.sourceFile;
  }
  if (parsed.output || parsed.outputFile) {
    config.output = parsed.output || parsed.outputFile;
  }
  if (parsed.template || parsed.templateFile) {
    config.template = parsed.template || parsed.templateFile;
  }
  if (typeof parsed.sanitize === 'boolean') {
    config.sanitize = parsed.sanitize;
  }
  if (typeof parsed.permalinks === 'boolean') {
    config.permalinks = parsed.permalinks;
  }
  if (parsed.permalink_position === 'before' || parsed.permalink_position === 'after') {
    config.permalink_position = parsed.permalink_position;
  }

  return config;
}

function resolveConfig(flags: Partial<Config>, configPath?: string): Config {
  let fileConfig: Partial<Config> = {};

  // Load config file if specified
  if (configPath) {
    if (!existsSync(configPath)) {
      throw new Error(`Config file not found: ${configPath}`);
    }
    fileConfig = loadConfigFile(configPath);
  }

  // Merge: defaults <- config file <- CLI flags
  // For booleans: CLI flag (if true) overrides config file, which overrides default (false)
  const config: Config = {
    input: flags.input || fileConfig.input || 'posts.md',
    output: flags.output || fileConfig.output || 'index.html',
    template: flags.template || fileConfig.template || getDefaultTemplatePath(),
    sanitize: flags.sanitize || fileConfig.sanitize || false,
    permalinks: flags.permalinks || fileConfig.permalinks || false,
    permalink_position: flags.permalink_position || fileConfig.permalink_position || 'before',
  };

  return config;
}

function main() {
  try {
    const args = process.argv.slice(2);
    const { flags, configPath, help, helpPosts, helpTemplates } = parseArgs(args);

    if (help) {
      printHelp();
      process.exit(0);
    }

    if (helpPosts) {
      printDocsFile('posts-format.md', 'Posts format');
      process.exit(0);
    }

    if (helpTemplates) {
      printDocsFile('custom-templates.md', 'Template');
      process.exit(0);
    }

    const config = resolveConfig(flags, configPath);

    // Resolve paths relative to cwd
    const inputPath = resolve(process.cwd(), config.input);
    const outputPath = resolve(process.cwd(), config.output);
    const templatePath = config.template.startsWith('/')
      ? config.template
      : resolve(process.cwd(), config.template);

    if (!existsSync(inputPath)) {
      throw new Error(`Input file not found: ${inputPath}`);
    }

    if (!existsSync(templatePath)) {
      throw new Error(`Template file not found: ${templatePath}`);
    }

    console.log('📖 Reading posts from', config.input);

    // Parse the source file
    const { siteMetadata, posts } = parseFile(inputPath);

    console.log(`✓ Found ${posts.length} post(s)`);

    // Process markdown for each post
    posts.forEach(post => {
      let html = markdownToHtml(post.content);
      if (config.sanitize) {
        html = sanitizeHtml(html);
      }
      post.html = html;
    });

    console.log('✓ Converted Markdown to HTML');
    if (config.sanitize) {
      console.log('✓ Sanitized HTML output');
    }

    // Check for permalink placeholder warnings
    if (config.permalinks) {
      const templateContent = readFileSync(templatePath, 'utf-8');
      if (!templateContent.includes('{{PERMALINK_STYLES}}')) {
        console.warn('⚠ Warning: permalinks enabled but template missing {{PERMALINK_STYLES}} placeholder');
      }
      if (!templateContent.includes('{{PERMALINK_SCRIPTS}}')) {
        console.warn('⚠ Warning: permalinks enabled but template missing {{PERMALINK_SCRIPTS}} placeholder');
      }
    }

    // Generate HTML page
    const html = generatePage(siteMetadata, posts, templatePath, { permalinks: config.permalinks, permalink_position: config.permalink_position });

    if (config.permalinks) {
      console.log('✓ Added permalinks to posts');
    }

    // Ensure output directory exists
    mkdirSync(dirname(outputPath), { recursive: true });

    // Write output
    writeFileSync(outputPath, html, 'utf-8');

    console.log('✓ Generated', config.output);
    console.log('✨ Done!');

  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
