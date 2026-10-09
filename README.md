# Malik's Site

My personal website, [whosmalikx.com](https://whosmalikx.com). It links to my projects, like the [Limbus Company News Archive](https://lcna.whosmalikx.com).

It's a plain static site: HTML, CSS and a little JavaScript for the light/dark theme switch.

## Files

- `index.html`: the home page
- `privacy.html`: the privacy policy, generated from `content/privacy.md` (don't edit it directly)
- `content/`: pages written in Markdown
- `templates/page.html`: the layout for those pages
- `scripts/build_pages.py`: turns `content/*.md` into pages and updates the sitemap
- `assets/`: styles, the theme script and icons

## Editing the privacy policy

Edit `content/privacy.md` and commit. A GitHub Action rebuilds `privacy.html` with today's date, and Cloudflare publishes it.

To preview it locally, run `python scripts/build_pages.py` and open `privacy.html`.
