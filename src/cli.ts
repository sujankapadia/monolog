#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { parseFile } from './parser.js';
import { markdownToHtml } from './markdown.js';
import { generatePage } from './generator.js';

interface Config {
  sourceFile: string;
  outputFile: string;
  templateFile: string;
}

function main() {
  try {
    // Load config
    const configContent = readFileSync('config.json', 'utf-8');
    const config: Config = JSON.parse(configContent);

    console.log('📖 Reading posts from', config.sourceFile);

    // Parse the source file
    const { siteMetadata, posts } = parseFile(config.sourceFile);

    console.log(`✓ Found ${posts.length} post(s)`);

    // Process markdown for each post
    posts.forEach(post => {
      post.html = markdownToHtml(post.content);
    });

    console.log('✓ Converted Markdown to HTML');

    // Generate HTML page
    const html = generatePage(siteMetadata, posts, config.templateFile);

    // Write output
    writeFileSync(config.outputFile, html, 'utf-8');

    console.log('✓ Generated', config.outputFile);
    console.log('✨ Done!');

  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
