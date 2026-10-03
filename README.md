# Malik's Site

My personal website and portfolio. This is the central hub where I showcase my projects, share tools I've built, and experiment with web technologies.

## Purpose

I created this site to serve as a simple, clean, and professional space online. It's a place for me to:
*   Showcase my development projects, like the [Limbus News Archive](https://github.com/ItsMalikx/limbus-news-archive).
*   Share useful tools and resources.
*   Provide a central point of contact and links to my other platforms.

## Tech Stack

This is a simple, fast-loading static site built with the basics:
*   HTML
*   CSS
*   JavaScript

I wrote the JavaScript to be minimal and focused on small enhancements, like the theme switcher and the dynamically updating revision date in the privacy policy.

## File Structure

The project structure is intentionally simple and easy to navigate.

*   **`index.html`**: The main landing page.
*   **`privacy.html`**: The privacy policy page, **generated** from `content/privacy.md` (do not edit the HTML).
*   **`content/`**: Text pages written in Markdown (`privacy.md`).
*   **`templates/page.html`**: The layout those pages are rendered into.
*   **`scripts/build_pages.py`**: Renders `content/*.md` into pages, with the revision date and sitemap date.
*   **`assets/`**: Contains all static files:
    *   `css/style.css`: All styling for the website.
    *   `js/theme.js`: Manages the light/dark mode theme toggling.
    *   `icons/`: Contains the SVG brand marks and favicons.

## Editing the privacy policy

1. Edit `content/privacy.md` (on github.com: open the file, click the pencil, commit).
   One line is one paragraph; `## Heading`, `- list item`, `**bold**`, `[text](https://...)`, and `---` for a divider.
2. That's it. The **Build pages** GitHub Action rebuilds `privacy.html` (with today's
   "Last Revised" date) and `sitemap.xml`, and commits them; Cloudflare publishes the site.

To preview locally: `python scripts/build_pages.py`, then open `privacy.html`.
Another text page (e.g. terms): add `content/terms.md` with a `path: /terms` front-matter line.

## License

This project is licensed under the GNU General Public License v3.0. See the `LICENSE` file for details.
