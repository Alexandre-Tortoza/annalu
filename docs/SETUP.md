# Setup & Development Guide

## Prerequisites

- **Node.js** — v22.12.0 or higher
- **pnpm** — v8 or higher (package manager)

Check your versions:
```bash
node --version
pnpm --version
```

---

## Initial Setup

### 1. Install Dependencies

```bash
cd AnnaLu
pnpm install
```

This installs all dependencies listed in `package.json`:
- `astro` — the static site generator
- `gsap` — animation library
- `@astrojs/sitemap` — automatic sitemap generation
- `tailwindcss` — CSS framework
- `@tailwindcss/vite` — Tailwind v4 Vite integration (dev dependency)

### 2. Start Development Server

```bash
pnpm dev
```

The server starts at **http://localhost:4321**

- Hot module reloading (HMR) enabled
- Edit files and see changes instantly
- Server stays running; stop with `Ctrl+C`

### 3. Verify Everything Works

Open http://localhost:4321 in your browser. You should see:
- Landing page with hero section
- Navigation working (Início/Home, Galeria/Gallery)
- Theme toggle button (sun/moon icon)
- Language picker (PT/EN)

---

## Common Commands

### Development

```bash
pnpm dev              # Start dev server (localhost:4321)
pnpm astro check     # TypeScript and Astro diagnostics (no build)
```

### Production

```bash
pnpm build           # Build static files to dist/
pnpm preview         # Serve dist/ locally for testing
```

### Maintenance

```bash
pnpm astro           # Run Astro CLI directly (e.g., pnpm astro add integration)
pnpm astro check     # Type check without building
```

---

## Development Workflow

### Making Changes

1. **Edit files** in `src/`
2. **Save** — changes auto-reload in browser (HMR)
3. **Check console** for errors
4. **Type check** with `pnpm astro check` before committing

### Before Pushing

```bash
# Type check
pnpm astro check

# Build locally
pnpm build

# Preview production build
pnpm preview
```

If build succeeds, the site is ready to deploy. The `dist/` folder contains all static HTML files.

---

## Project Structure Overview

```
AnnaLu/
├── docs/                    # This documentation
├── public/                  # Static assets (favicons, images)
│   └── images/             # Artwork images (referenced in content)
├── src/
│   ├── content.config.ts    # Content collection schema & loader
│   ├── content/
│   │   └── artworks/       # Markdown files with artwork metadata
│   ├── styles/
│   │   └── global.css      # Tailwind + CSS variables
│   ├── i18n/
│   │   ├── index.ts        # Locale utilities
│   │   └── translations.ts # Bilingual UI strings
│   ├── components/         # Reusable Astro components
│   ├── layouts/            # Page layout templates
│   └── pages/              # Routes (PT at root, EN at /en/)
├── astro.config.mjs         # Astro configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies and scripts
└── CLAUDE.md                # Claude Code guidance

For full details, see STRUCTURE.md
```

---

## Adding Content (Artworks)

Adding a new artwork is a three-step process:

### 1. Create Markdown File
Create `src/content/artworks/my-artwork.md`:

```markdown
---
title: "My Artwork"
titlePt: "Minha Obra"
description: "Lorem ipsum description in English."
descriptionPt: "Descrição em português."
publishedAt: 2024-01-15
cover:
  src: "/images/my-artwork-cover.jpg"
  alt: "A descriptive alt text for accessibility"
images:
  - src: "/images/my-artwork-1.jpg"
    alt: "First image alt text"
  - src: "/images/my-artwork-2.jpg"
    alt: "Second image alt text"
tags: ["abstract", "acrylic"]
technique: "Acrylic on canvas"
dimensions: "100 × 80 cm"
year: 2024
featured: false
mosaic:
  - imageIndex: 0
    colStart: 1
    colSpan: 8
    rowSpan: 1
  - imageIndex: 1
    colStart: 9
    colSpan: 4
    rowSpan: 1
---

Body content in Markdown (lorem ipsum for now). This will appear on the artwork detail page.
```

For detailed schema documentation, see [CONTENT.md](./CONTENT.md).

### 2. Add Images
Place image files in `public/images/`:
- `my-artwork-cover.jpg`
- `my-artwork-1.jpg`
- `my-artwork-2.jpg`

Images should be:
- High quality (at least 800×600px for covers)
- Optimized for web (Astro handles optimization)
- Accessible (alt text in frontmatter)

### 3. Deploy Changes
On save, the site rebuilds automatically:
- New artwork appears in `/galeria` (PT) and `/en/gallery` (EN)
- New detail page at `/artwork/my-artwork` (PT) and `/en/art/my-artwork` (EN)
- Sitemap updates automatically

No code changes needed — it's pure content!

---

## Environment Variables

Currently, no `.env` file is needed. If you need to add environment variables in the future:

1. Create `.env.local` in the project root (ignored by git):
   ```
   PUBLIC_SITE_URL=https://annalu.art
   SECRET_API_KEY=xxx
   ```

2. Access in code:
   ```ts
   // Public variables (exposed to browser)
   import.meta.env.PUBLIC_SITE_URL

   // Secret variables (server-only)
   import.meta.env.SECRET_API_KEY
   ```

---

## Deployment

The site is fully static and can be deployed to any static host:

- **Vercel** — Connect GitHub repo, auto-deploys on push
- **Netlify** — Same as Vercel
- **AWS S3 + CloudFront** — Manual upload
- **Traditional hosting** — Upload `dist/` via FTP/SFTP

No server, no backend, no database — just static files.

### Build Output

After `pnpm build`:
- `dist/index.html` — PT landing page
- `dist/galeria/index.html` — PT gallery
- `dist/artwork/[slug]/index.html` — PT artwork detail pages
- `dist/en/index.html` — EN landing page
- `dist/en/gallery/index.html` — EN gallery
- `dist/en/art/[slug]/index.html` — EN artwork detail pages
- `dist/sitemap-index.xml` — Sitemap for SEO
- Other assets — CSS, images (optimized)

---

## Troubleshooting

### Port 4321 already in use
```bash
pnpm dev -- --port 3000  # Use a different port
```

### Images not loading
1. Check image files exist in `public/images/`
2. Check `src` path in frontmatter matches file name exactly
3. Run `pnpm astro check` to see validation errors

### Build fails with "collection not found"
1. Ensure `src/content/artworks/` directory exists
2. Check `.md` files are in that directory (not in subdirectories)
3. Check `src/content.config.ts` loader path is correct

### TypeScript errors
```bash
pnpm astro check
```

Shows all type issues. Fix them before building for production.

### Dark theme not working
1. Check `localStorage` is enabled in browser
2. Open DevTools → Application → LocalStorage, look for `theme` key
3. Check `.dark` class is on `<html>` element when toggled
4. Verify CSS variables in `global.css` have `dark:` overrides

### i18n routes not appearing
1. Verify `src/pages/en/` directory exists
2. Check English pages match Portuguese structure (e.g., `galeria.astro` → `gallery.astro`)
3. Run `pnpm build` to see all generated routes

---

## Next Steps

After setup, explore:
1. **[CONTENT.md](./CONTENT.md)** — Add your first artwork
2. **[COMPONENTS.md](./COMPONENTS.md)** — Understand component structure
3. **[ARCHITECTURE.md](./ARCHITECTURE.md)** — How everything connects
4. **[THEMING.md](./THEMING.md)** — Customize colors and fonts

Happy building! 🎨
