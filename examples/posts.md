+++
site_title: "My Microblog"
author: Your Name
+++

+++
title: "Testing HTML Sanitization"
date: 2025-10-12
topic: security
tags: xss, sanitization
+++

This post demonstrates the `--sanitize` flag. The following malicious HTML will be removed or neutralized when you run `monolog --sanitize`:

**Script tag (will be removed):**
<script>alert('XSS attack!');</script>

**Event handler (will be removed):**
<img src="x" onerror="alert('XSS via onerror')">

**JavaScript URL (will be neutralized):**
<a href="javascript:alert('XSS via href')">Click me</a>

**Safe HTML (will be preserved):**
<strong>This bold text</strong> and <em>this italic text</em> are safe and will remain.

Run without sanitization to see the raw HTML, or with `--sanitize` to see it cleaned:

```bash
monolog -i examples/posts.md -o output.html           # Raw HTML preserved
monolog -i examples/posts.md -o output.html --sanitize # Malicious HTML removed
```

+++
title: "Code Syntax Highlighting"
date: 2025-10-11
topic: technology
tags: code, python
+++

The bundled template includes syntax highlighting via highlight.js. Here's an example:

```python
def fibonacci(n):
    """Generate the first n Fibonacci numbers."""
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

# Print the first 10 Fibonacci numbers
for num in fibonacci(10):
    print(num)
```

It also works with other languages like JavaScript:

```javascript
const greet = (name) => {
  console.log(`Hello, ${name}!`);
};

greet('World');
```

+++
title: "First Post"
date: 2025-10-10
topic: technology
tags: web, blogging, markdown
+++

This is my **first post** on my new microblog! I'm using a simple [Markdown](https://daringfireball.net/projects/markdown/)-based system that I built.

Key features:
- Single file for all posts
- YAML front matter with `+++` delimiters
- Static HTML generation
- GitHub Flavored Markdown support

<!-- This is a private comment that won't appear in the output -->

Here's some `inline code` and a thematic break below:

---

Pretty cool, right?

+++
title: "Why I Built This"
date: 2025-10-09
topic: personal
tags: projects, writing
+++

I wanted a **simple** way to write short posts without the overhead of a full blogging platform.

> Simplicity is the ultimate sophistication. — Leonardo da Vinci

This microblog framework gives me:
1. Quick posting workflow
2. Full control over my content
3. Easy to maintain and modify

+++
title: "Hello World"
date: 2025-10-08
+++

Just getting started. More to come!
