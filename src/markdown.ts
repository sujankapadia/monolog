import { marked } from 'marked';

/**
 * Converts Markdown to HTML and strips HTML comments
 */
export function markdownToHtml(markdown: string): string {
  // Convert markdown to HTML (GFM enabled by default)
  const html = marked.parse(markdown) as string;

  // Strip HTML comments
  const withoutComments = html.replace(/<!--[\s\S]*?-->/g, '');

  return withoutComments.trim();
}
