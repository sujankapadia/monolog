import { readFileSync } from 'fs';
import { SiteMetadata, Post } from './types.js';

interface GeneratorOptions {
  permalinks?: boolean;
}

const PERMALINK_STYLES = `
<style>
  /* Permalink hover behavior - positioned in left margin like GitHub */
  article h2 {
    position: relative;
  }
  article h2 .permalink {
    position: absolute;
    left: -1.5em;
    opacity: 0;
    text-decoration: none;
    transition: opacity 0.2s;
  }
  article h2 .permalink::before {
    content: "#";
  }
  article h2:hover .permalink,
  article h2 .permalink:focus {
    opacity: 0.6;
  }
  article h2 .permalink:hover {
    opacity: 1;
  }
  /* Touch devices: always show permalink */
  @media (hover: none) {
    article h2 .permalink {
      opacity: 0.4;
    }
  }
  /* Flash animation for copy feedback */
  @keyframes permalink-flash {
    0% { opacity: 1; }
    50% { opacity: 0.2; }
    100% { opacity: 1; }
  }
  article h2 .permalink.copied {
    animation: permalink-flash 0.3s ease-in-out;
  }
</style>`;

const PERMALINK_SCRIPTS = `
<script>
  document.querySelectorAll('.permalink').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const url = window.location.origin + window.location.pathname + link.getAttribute('href');
      navigator.clipboard.writeText(url).then(() => {
        link.classList.add('copied');
        setTimeout(() => link.classList.remove('copied'), 300);
      });
    });
  });
</script>`;

function generateTableOfContents(posts: Post[]): string {
  const items = posts.map(post => {
    const date = post.metadata.date;
    const title = post.metadata.title;
    return `    <li><a href="#${post.id}">${title}</a> - ${date}</li>`;
  });

  return `  <ul>\n${items.join('\n')}\n  </ul>`;
}

function generatePostHtml(post: Post, options: GeneratorOptions): string {
  const { title, date, topic, tags } = post.metadata;

  const permalinkHtml = options.permalinks
    ? `<a href="#${post.id}" class="permalink" aria-label="Permalink to ${title}"></a>`
    : '';

  return `  <article id="${post.id}">
    <header>
      <h2>${permalinkHtml}${title}</h2>
      <p><time datetime="${date}">${date}</time></p>
    </header>
    <div class="post-content">
${post.html}
    </div>
  </article>`;
}

function generateAllPosts(posts: Post[], options: GeneratorOptions): string {
  return posts.map(post => generatePostHtml(post, options)).join('\n\n');
}

export function generatePage(
  siteMetadata: SiteMetadata,
  posts: Post[],
  templatePath: string,
  options: GeneratorOptions = {}
): string {
  // Load template
  const template = readFileSync(templatePath, 'utf-8');

  // Generate components
  const tableOfContents = generateTableOfContents(posts);
  const postsHtml = generateAllPosts(posts, options);
  const year = new Date().getFullYear();

  // Permalink placeholders: populated if enabled, empty if not
  const permalinkStyles = options.permalinks ? PERMALINK_STYLES : '';
  const permalinkScripts = options.permalinks ? PERMALINK_SCRIPTS : '';

  // Replace placeholders
  let output = template
    .replace(/\{\{SITE_TITLE\}\}/g, siteMetadata.site_title)
    .replace(/\{\{AUTHOR\}\}/g, siteMetadata.author)
    .replace(/\{\{TABLE_OF_CONTENTS\}\}/g, tableOfContents)
    .replace(/\{\{POSTS\}\}/g, postsHtml)
    .replace(/\{\{YEAR\}\}/g, year.toString())
    .replace(/\{\{PERMALINK_STYLES\}\}/g, permalinkStyles)
    .replace(/\{\{PERMALINK_SCRIPTS\}\}/g, permalinkScripts);

  return output;
}
