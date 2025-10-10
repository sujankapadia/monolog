import { readFileSync } from 'fs';
import matter from 'gray-matter';
import { SiteMetadata, PostMetadata, Post } from './types.js';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function generatePostId(date: string, title: string): string {
  const slug = generateSlug(title);
  return `${date}-${slug}`;
}

function parseTags(tags: string | string[] | undefined): string[] | undefined {
  if (!tags) return undefined;
  if (Array.isArray(tags)) return tags;
  return tags.split(',').map(tag => tag.trim());
}

function normalizeDate(date: string | Date): string {
  if (typeof date === 'string') {
    // If it's already a string, return as-is
    return date;
  }
  // If it's a Date object, convert to YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export interface ParseResult {
  siteMetadata: SiteMetadata;
  posts: Post[];
}

export function parseFile(filePath: string): ParseResult {
  const fileContent = readFileSync(filePath, 'utf-8');

  // Find all +++ delimited blocks
  const yamlBlockRegex = /^\+\+\+\n([\s\S]*?)\n\+\+\+/gm;
  const matches = [...fileContent.matchAll(yamlBlockRegex)];

  if (matches.length < 2) {
    throw new Error('File must contain at least site metadata and one post');
  }

  // Parse first block as site metadata
  const firstBlock = `+++\n${matches[0][1]}\n+++`;
  const siteParsed = matter(firstBlock, { delimiters: '+++' });
  const siteMetadata = siteParsed.data as SiteMetadata;

  if (!siteMetadata.site_title || !siteMetadata.author) {
    throw new Error('Site metadata must include site_title and author');
  }

  // Parse remaining blocks as posts
  const posts: Post[] = [];

  for (let i = 1; i < matches.length; i++) {
    const match = matches[i];
    const blockContent = `+++\n${match[1]}\n+++`;
    const postParsed = matter(blockContent, { delimiters: '+++' });

    const metadata = postParsed.data as PostMetadata;

    // Validate required fields
    if (!metadata.title) {
      throw new Error(`Post ${i} is missing required field: title`);
    }
    if (!metadata.date) {
      throw new Error(`Post ${i} is missing required field: date`);
    }

    // Normalize date (gray-matter converts YAML dates to Date objects)
    metadata.date = normalizeDate(metadata.date as any);

    // Parse tags if present
    metadata.tags = parseTags(metadata.tags);

    // Generate post ID
    const id = generatePostId(metadata.date, metadata.title);

    // Extract content: from end of this YAML block to start of next (or EOF)
    const contentStart = match.index! + match[0].length;
    const nextMatch = matches[i + 1];
    const contentEnd = nextMatch ? nextMatch.index! : fileContent.length;
    const content = fileContent.slice(contentStart, contentEnd).trim();

    posts.push({
      metadata,
      content,
      html: '', // Will be populated by markdown processor
      id
    });
  }

  return {
    siteMetadata,
    posts
  };
}
