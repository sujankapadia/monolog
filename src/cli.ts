#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { parseFile } from './parser.js';
import { markdownToHtml, sanitizeHtml } from './markdown.js';
import { generatePage } from './generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface Config {
  input: string;
  output: string;
  template: string;
}

function getDefaultTemplatePath(): string {
  // Template is at ../templates/default.html relative to dist/cli.js
  return join(__dirname, '..', 'templates', 'default.html');
}

function getTemplateDocsPath(): string {
  // Docs are at ../docs/custom-templates.md relative to dist/cli.js
  return join(__dirname, '..', 'docs', 'custom-templates.md');
}

function printTemplateHelp(): void {
  const docsPath = getTemplateDocsPath();
  if (!existsSync(docsPath)) {
    console.error('Template documentation not found.');
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
  --help-templates       Show documentation for creating custom templates
  --sanitize             Sanitize HTML output to prevent XSS attacks
  --permalinks           Add hover-to-reveal permalink to each post (click to copy URL)

Examples:
  monolog                           # Use defaults (posts.md -> index.html)
  monolog -i blog.md -o blog.html   # Specify input and output
  monolog -c monolog.config.json    # Use config file
  monolog -c config.json -o out.html  # Config file with flag override

Config file format (JSON):
  {
    "input": "posts.md",
    "output": "index.html",
    "template": "path/to/template.html"  // optional
  }
`);
}

function parseArgs(args: string[]): { flags: Partial<Config>; configPath?: string; help: boolean; helpTemplates: boolean; sanitize: boolean; permalinks: boolean } {
  const flags: Partial<Config> = {};
  let configPath: string | undefined;
  let help = false;
  let helpTemplates = false;
  let sanitize = false;
  let permalinks = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];

    switch (arg) {
      case '-h':
      case '--help':
        help = true;
        break;
      case '--help-templates':
        helpTemplates = true;
        break;
      case '--sanitize':
        sanitize = true;
        break;
      case '--permalinks':
        permalinks = true;
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

  return { flags, configPath, help, helpTemplates, sanitize, permalinks };
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
  const config: Config = {
    input: flags.input || fileConfig.input || 'posts.md',
    output: flags.output || fileConfig.output || 'index.html',
    template: flags.template || fileConfig.template || getDefaultTemplatePath(),
  };

  return config;
}

function main() {
  try {
    const args = process.argv.slice(2);
    const { flags, configPath, help, helpTemplates, sanitize, permalinks } = parseArgs(args);

    if (help) {
      printHelp();
      process.exit(0);
    }

    if (helpTemplates) {
      printTemplateHelp();
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
      if (sanitize) {
        html = sanitizeHtml(html);
      }
      post.html = html;
    });

    console.log('✓ Converted Markdown to HTML');
    if (sanitize) {
      console.log('✓ Sanitized HTML output');
    }

    // Check for permalink placeholder warnings
    if (permalinks) {
      const templateContent = readFileSync(templatePath, 'utf-8');
      if (!templateContent.includes('{{PERMALINK_STYLES}}')) {
        console.warn('⚠ Warning: --permalinks enabled but template missing {{PERMALINK_STYLES}} placeholder');
      }
      if (!templateContent.includes('{{PERMALINK_SCRIPTS}}')) {
        console.warn('⚠ Warning: --permalinks enabled but template missing {{PERMALINK_SCRIPTS}} placeholder');
      }
    }

    // Generate HTML page
    const html = generatePage(siteMetadata, posts, templatePath, { permalinks });

    if (permalinks) {
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
