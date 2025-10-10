import { readFileSync } from 'fs';
import { SiteMetadata, Post } from './types.js';

function generateTableOfContents(posts: Post[]): string {
  const items = posts.map(post => {
    const date = post.metadata.date;
    const title = post.metadata.title;
    return `    <li><a href="#${post.id}">${title}</a> - ${date}</li>`;
  });

  return `  <ul>\n${items.join('\n')}\n  </ul>`;
}

function generatePostHtml(post: Post): string {
  const { title, date, topic, tags } = post.metadata;

  return `  <article id="${post.id}">
    <header>
      <h2>${title}</h2>
      <p><time datetime="${date}">${date}</time></p>
    </header>
    <div class="post-content">
${post.html}
    </div>
  </article>`;
}

function generateAllPosts(posts: Post[]): string {
  return posts.map(post => generatePostHtml(post)).join('\n\n');
}

export function generatePage(
  siteMetadata: SiteMetadata,
  posts: Post[],
  templatePath: string
): string {
  // Load template
  const template = readFileSync(templatePath, 'utf-8');

  // Generate components
  const tableOfContents = generateTableOfContents(posts);
  const postsHtml = generateAllPosts(posts);
  const year = new Date().getFullYear();

  // Replace placeholders
  let output = template
    .replace(/\{\{SITE_TITLE\}\}/g, siteMetadata.site_title)
    .replace(/\{\{AUTHOR\}\}/g, siteMetadata.author)
    .replace(/\{\{TABLE_OF_CONTENTS\}\}/g, tableOfContents)
    .replace(/\{\{POSTS\}\}/g, postsHtml)
    .replace(/\{\{YEAR\}\}/g, year.toString());

  return output;
}
