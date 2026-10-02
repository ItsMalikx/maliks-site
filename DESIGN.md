# Design system: whosmalikx.com

Malik's personal site. Shares its chrome (header, footer, theme switch), tokens, font and sizing
scale with the LCNA archive (lcna.whosmalikx.com) so the two feel connected, while keeping its
own page design: a white "Hello, I'm" tab, the large name, a faint MALIK watermark, one feature
card for the archive and pill links. The archive header does not link back here.

## Principles

1. **Same scale as LCNA.** 17px base text at 1200px+; the whole layout zooms 1.08 at 1920px+.
   Equivalent elements match LCNA's measured sizes (header, logo, hero tab, title, description,
   section labels, meta lines).
2. **Achromatic.** Black and white with tinted neutrals; no category colors on this site.
3. **Fast by construction.** One self-hosted variable font, no third-party requests.

## Tokens (dark default, light theme available)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0a0a0a` | Page background |
| `--surface` / `--surface-2` | `#141414` / `#1c1c1c` | Card / hover |
| `--line` / `--line-strong` | `#262626` / `#3a3a3a` | Rules / borders |
| `--text` / `--text-soft` / `--text-muted` | `#f2f2f2` / `#c4c4c4` / `#8f8f8f` | Headings / body / meta |

Transitions are disabled while the theme flips, so everything changes color at once.

## Type

**Schibsted Grotesk** (variable, self-hosted).

| Element | Size | Notes |
|---|---|---|
| Brand ("Malik" + paw mark) | 1.2rem, 22px mark | Same as the LCNA logo |
| Hero tab ("Hello, I'm") | `clamp(1.1rem, 1.6vw, 1.6rem)`, padding 7px 14px | White block, dark text (same as LCNA's former label tab) |
| Name ("Malik") | `clamp(2.6rem, 4.5vw, 4rem)`, 700, -0.035em, line-height 1.02 | Same as the LCNA title |
| Description | ~1.2rem, soft | 20px below the name |
| Section labels | 0.875rem, 650, muted | Same as LCNA's "Type"/"Tags" labels |
| Card meta (domain) | 0.9rem, 550, muted | Same as LCNA's card date |
| Card title | 2rem, 750, -0.015em | Larger than LCNA card titles (feature card) |

## Components

- **Feature card:** rounded 16px surface card with meta, title, description and an "Open the
  archive" link.
- **Pill links:** LinkedIn and GitHub as rounded pills with an arrow.
- **Footer:** "Copyright © 2026 Malik. All rights reserved." and the Privacy Policy link.
