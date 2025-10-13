# Scaling Considerations

This document outlines approaches for handling performance as the number of posts grows beyond 50-100 entries.

## Current Approach

Single static HTML page containing all posts, newest-first. Simple to host, no backend required.

**Limitations:**
- Performance degrades as page size increases
- Full page reload for any update
- All content loads upfront

## Options for Scaling

### Option 1: Client-Side Pagination (Static)

Generate all posts in the HTML but use JavaScript to show/hide subsets.

**Implementation:**
- All posts rendered in HTML with `data-page` attributes
- JavaScript shows first 20 posts, hides rest
- Pagination controls navigate between pages client-side

**Pros:**
- Maintains static hosting
- No server required
- Simple implementation

**Cons:**
- Full HTML still loads upfront
- Requires JavaScript
- SEO may need adjustment

### Option 2: Build-Time Pagination (Static)

Generator creates multiple HTML files: `index.html`, `page-2.html`, `page-3.html`, etc.

**Implementation:**
- Modify generator to chunk posts (e.g., 20 per page)
- Generate separate HTML file for each page
- Add prev/next navigation links between pages
- Update config for posts-per-page setting

**Pros:**
- Static hosting maintained
- Each page loads faster
- Works without JavaScript
- SEO-friendly

**Cons:**
- More complex generator logic
- Multiple files to manage
- Index/archive page still needed

### Option 3: Infinite Scroll with JSON (Static)

Generate `index.html` with initial posts plus `posts.json` containing all post data.

**Implementation:**
- Generator creates JSON file with all posts
- Initial HTML renders first 10-20 posts
- JavaScript detects scroll position, loads more from JSON
- Append posts to page as user scrolls

**Pros:**
- Progressive loading experience
- Static hosting
- Feels modern/dynamic

**Cons:**
- Requires JavaScript (breaks without it)
- Two HTTP requests
- More complex front-end code

### Option 4: Server-Side Pagination (Dynamic)

Backend API serves posts on demand with query parameters (e.g., `?page=2&limit=20`).

**Implementation:**
- Parse `posts.md` server-side
- API endpoint returns JSON for requested page
- Front-end renders posts from API responses

**Pros:**
- True on-demand loading
- Scales indefinitely
- Can add search, filtering, etc.

**Cons:**
- Requires server/backend
- Deployment complexity increases
- Higher hosting costs
- Violates project's simplicity philosophy

## Performance Reality Check

**Rough estimates:**
- 100 posts × 500 words average = ~300KB raw text
- With HTML markup: ~400-500KB
- With gzip compression: ~50-100KB transferred
- Modern browsers handle this without issues

**Recommendation:** Don't optimize prematurely. Test with 50-100 actual posts first. If performance becomes an issue, **Option 2 (build-time pagination)** is the best fit for this project's philosophy.

## Future Enhancements

If implementing pagination:
- Archive page showing all post titles
- Year/month grouping
- Tag-based filtering
- RSS feed generation
