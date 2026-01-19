import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

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

/**
 * Sanitizes HTML to prevent XSS attacks
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html);
}
