+++
site_title: "Monolog Updates"
author: Sujan Kapadia
+++

+++
title: "Monolog v1.0 Released"
date: 2026-01-28
+++

Released **Monolog v1.0** with full support for custom templates, permalink generation, and HTML sanitization. The single-file microblogging framework is now production-ready.

Key features:
- Custom template support with `{{PLACEHOLDER}}` syntax
- GitHub Flavored Markdown rendering
- Optional permalink generation with click-to-copy
- HTML sanitization for XSS protection

+++
title: "Monolog Template System"
date: 2026-01-20
+++

Designed the template system for monolog. Templates use simple `{{PLACEHOLDER}}` replacement — no complex logic, no loops, no conditionals. This keeps the tool focused and predictable.

Available placeholders: `SITE_TITLE`, `AUTHOR`, `TABLE_OF_CONTENTS`, `POSTS`, `YEAR`.
