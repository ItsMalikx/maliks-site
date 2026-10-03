"""Build the text pages (the privacy policy, and any others) from Markdown in content/.

    python scripts/build_pages.py

Each content/<name>.md becomes <name>.html through templates/page.html. Its "Last Revised" date is
the date of the Markdown file's latest commit (today while it has uncommitted edits), and its
sitemap.xml <lastmod> is updated to match. A GitHub Action runs this on every push that changes
content/, so editing the Markdown (even on github.com) is all an update needs.

Every page also links its stylesheet and script with a content fingerprint (style.css?v=1a2b3c4d5e),
so a changed file is fetched at once instead of after the 4-hour cache runs out.

Markdown, one line per paragraph:
    ---               front matter at the top (title, description, path), then dividers
    ## Heading        (### for a smaller one)
    - item            a list
    **bold**          and [link text](https://... or mailto:...)
    {{revised}}       the revision date (e.g. "This Policy takes effect on {{revised}}.")
"""
from datetime import date
from html import escape
from pathlib import Path
import hashlib
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
REPO = 'https://github.com/ItsMalikx/maliks-site'


def inline(text):
    """Escape, then **bold** and [links]; links off this site open in a new tab."""
    text = escape(text, quote=False)
    text = re.sub(r'\*\*(?=\S)(.+?)(?<=\S)\*\*', r'<strong>\1</strong>', text)

    def link(match):
        label, url = match[1], match[2]
        external = url.startswith('http') and not re.match(r'https://(?:[\w-]+\.)*whosmalikx\.com(?:/|$)', url)
        extra = ' rel="noopener noreferrer" target="_blank"' if external else ''
        return f'<a{extra} href="{escape(url, quote=True)}" class="text-link">{label}</a>'
    return re.sub(r'\[([^\]\n]+)\]\(((?:https?://|mailto:|/)[^\s)]+)\)', link, text)


def render(markdown):
    """(front matter, body HTML) from the page's Markdown."""
    meta, body = {}, markdown.replace('\r\n', '\n')
    front = re.match(r'---\n(.*?)\n---\n', body, re.S)
    if front:
        meta = dict(line.split(':', 1) for line in front[1].splitlines() if ':' in line)
        meta = {key.strip(): value.strip() for key, value in meta.items()}
        body = body[front.end():]
    html, items = [], []
    indent = '          '

    def close_list():
        if items:
            html.append(f'{indent}<ul>\n' + ''.join(f'{indent}  <li>{item}</li>\n' for item in items) + f'{indent}</ul>')
            items.clear()
    for line in body.split('\n'):
        line = line.strip()
        if line.startswith('- '):
            items.append(inline(line[2:]))
            continue
        close_list()
        if not line:
            continue
        if re.fullmatch(r'-{3,}', line):
            html.append(f'{indent}<hr />\n')
        elif heading := re.match(r'(#{2,3})\s+(.+)', line):
            level = len(heading[1])
            html.append(f'{indent}<h{level}>{inline(heading[2])}</h{level}>')
        else:
            html.append(f'{indent}<p>{inline(line)}</p>')
    close_list()
    return meta, '\n'.join(html)


def revised(source):
    """The date of the file's latest commit, or today while it has uncommitted changes."""
    relative = source.relative_to(ROOT).as_posix()
    def git(*args):
        return subprocess.run(['git', *args], cwd=ROOT, capture_output=True, text=True).stdout.strip()
    if git('status', '--porcelain', '--', relative):
        return date.today()
    stamp = git('log', '-1', '--format=%cs', '--', relative)
    return date.fromisoformat(stamp) if stamp else date.today()


ASSETS = ('assets/css/style.css', 'assets/js/theme.js')


def stamp(html):
    """Point the page's stylesheet and script links at their current contents (?v=<fingerprint>)."""
    for asset in ASSETS:
        version = hashlib.sha256((ROOT / asset).read_bytes()).hexdigest()[:10]
        html = re.sub(rf'(["\']/{re.escape(asset)})(?:\?v=[0-9a-f]+)?(["\'])', rf'\g<1>?v={version}\g<2>', html)
    return html


def build():
    template = (ROOT / 'templates/page.html').read_text(encoding='utf-8')
    sitemap_path = ROOT / 'sitemap.xml'
    sitemap = sitemap_path.read_text(encoding='utf-8') if sitemap_path.exists() else ''
    changed = []
    for source in sorted((ROOT / 'content').glob('*.md')):
        meta, content = render(source.read_text(encoding='utf-8'))
        day = revised(source)
        path = meta.get('path') or f'/{source.stem}'
        # The content goes in first, so {{revised}} (and the other values) also work inside the Markdown.
        page = template.replace('{{content}}', content)
        for key, value in {'title': escape(meta.get('title', source.stem.title())),
                           'description': escape(meta.get('description', ''), quote=True),
                           'path': path, 'source': source.relative_to(ROOT).as_posix(),
                           'history': f'{REPO}/commits/main/{source.relative_to(ROOT).as_posix()}',
                           'revised': f'{day:%B} {day.day}, {day.year}', 'revised_iso': day.isoformat(),
                           'year': str(date.today().year)}.items():
            page = page.replace('{{' + key + '}}', value)
        page = stamp(page)
        output = ROOT / f'{source.stem}.html'
        if not output.exists() or output.read_text(encoding='utf-8') != page:
            output.write_text(page, encoding='utf-8')
            changed.append(output.name)
        # Keep the sitemap's date for this page in step with its revision date.
        sitemap = re.sub(rf'(<loc>https://whosmalikx\.com{re.escape(path)}</loc>\s*<lastmod>)[^<]*(</lastmod>)',
                         rf'\g<1>{day.isoformat()}\g<2>', sitemap)
    # The hand-written pages get the same fingerprints.
    for output in (ROOT / 'index.html', ROOT / '404.html'):
        html = output.read_text(encoding='utf-8')
        if stamp(html) != html:
            output.write_text(stamp(html), encoding='utf-8')
            changed.append(output.name)
    if sitemap and sitemap != sitemap_path.read_text(encoding='utf-8'):
        sitemap_path.write_text(sitemap, encoding='utf-8')
        changed.append('sitemap.xml')
    print('Updated: ' + ', '.join(changed) if changed else 'Pages already up to date.')
    return changed


if __name__ == '__main__':
    build()
