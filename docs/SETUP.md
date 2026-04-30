# Setup & Development Guide

## Prerequisites

Before you start, ensure you have the following installed on your system:

### Required
- **Node.js** — v22.12.0 or higher ([download](https://nodejs.org/))
- **pnpm** — v8 or higher (package manager) ([install guide](https://pnpm.io/installation))

### Recommended
- **Git** — v2.30+ for version control
- **Visual Studio Code** — with Astro, TypeScript, and Tailwind extensions
- **Modern browser** — Chrome/Firefox for development (latest versions)

### Check Your Versions

Verify that your environment meets the requirements:

```bash
node --version       # Should output v22.12.0 or higher
pnpm --version       # Should output 8.0 or higher
npm install -g pnpm  # If pnpm is not installed
```

If versions are lower, update them before proceeding.

---

## Initial Setup

### 1. Install Dependencies

Navigate to the project directory and install all dependencies:

```bash
cd AnnaLu
pnpm install
```

This installs all dependencies listed in `package.json`:
- **astro** — static site generator and core framework
- **gsap** — animation library (GSAP 3)
- **@astrojs/sitemap** — automatic XML sitemap generation
- **tailwindcss** — CSS framework
- **@tailwindcss/vite** — Tailwind v4 Vite integration (dev dependency)

The `pnpm-lock.yaml` file ensures reproducible installs across machines.

### 2. Start Development Server

Start the development server with hot module reloading:

```bash
pnpm dev
```

Expected output:
```
  🚀  Server started in 100ms

  ➜  Local:    http://localhost:4321/
  ➜  Press Q to quit
```

The server starts at **http://localhost:4321**

**Features:**
- ✅ Hot module reloading (HMR) — see changes instantly
- ✅ Full TypeScript support
- ✅ Automatic Tailwind compilation
- ✅ Live browser refresh on file save
- 🛑 Stop with `Ctrl+C`

Open http://localhost:4321 in your browser to verify everything is running.

### 3. Verify Installation

Confirm that your development environment is working correctly:

**In your browser at http://localhost:4321, you should see:**
- ✅ Landing page with hero section (full-screen welcome)
- ✅ Navigation working (Início/Home, Galeria/Gallery)
- ✅ Theme toggle button (sun/moon icon) in the top right
- ✅ Language picker (PT/EN) in the top right
- ✅ No console errors (check DevTools → Console)

**Run type checking:**
```bash
pnpm astro check
```
Expected output: No TypeScript errors reported (green checkmark)

**Try the gallery:**
1. Click "Galeria" (PT) or "Gallery" (EN) in the navigation
2. You should see the gallery page with artwork grid
3. Click on an artwork to view its detail page

**Test theme toggle:**
1. Click the sun/moon icon
2. The page should switch between light and dark themes
3. Refresh the page — the theme should persist

If all checks pass ✅, your environment is ready for development!

---

## Common Commands

All commands are run from the project root directory using `pnpm`.

### Development

```bash
pnpm dev                    # Start dev server (localhost:4321)
pnpm astro check           # TypeScript and Astro diagnostics (no build)
pnpm astro check --help    # See all check options
```

### Production Build

```bash
pnpm build                 # Build static files to dist/
pnpm preview               # Serve dist/ locally for testing
```

### Maintenance

```bash
pnpm astro                 # Run Astro CLI directly (e.g., pnpm astro add integration)
pnpm astro check           # Type check without building
```

### Command Reference Table

| Command | Purpose | When to use |
|---------|---------|-----------|
| `pnpm dev` | Start dev server | During development |
| `pnpm astro check` | Type checking | Before committing |
| `pnpm build` | Create production build | Before deployment |
| `pnpm preview` | Test production build | Verify build output locally |

---

## Development Workflow

### Making Changes

1. **Edit files** in `src/` (components, pages, styles, content)
2. **Save** — file saves trigger automatic browser reload via HMR
3. **Check console** for any error messages (DevTools → Console)
4. **Type check** with `pnpm astro check` before committing changes

### Code Quality Checks

Before pushing to version control:

```bash
# 1. Type checking
pnpm astro check

# 2. Build locally to catch errors
pnpm build

# 3. Test the production build
pnpm preview
```

Then open http://localhost:3000 (or the preview port shown) to verify the build output. If `pnpm build` succeeds without errors, the site is ready for deployment.

**The `dist/` folder contains all final static HTML, CSS, and image files for production.**

### Development Tips

- **HMR is instant** — Most changes appear in the browser immediately (components, styles)
- **Full page reload** — May be needed for content collection changes
- **No console pollution** — TypeScript catches errors at compile time, not runtime
- **Check early and often** — Run `pnpm astro check` frequently to catch issues before they compound

See [ARCHITECTURE.md](./ARCHITECTURE.md) for how the build system works.

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

Currently, the project does not require a `.env` file for basic functionality. However, if you need to add environment-specific variables in the future, follow this guide.

### Creating an Environment File

Create `.env.local` in the project root (automatically ignored by `.gitignore`):

```bash
# Example .env.local
PUBLIC_SITE_URL=https://annalu.art
PUBLIC_ANALYTICS_ID=UA-123456789-1
SECRET_API_KEY=xxx_keep_this_private_xxx
SECRET_STRIPE_KEY=sk_live_xxx
```

### Variable Types

**Public variables** (exposed to browser):
- Prefix: `PUBLIC_`
- Accessible in client and server code
- Safe for frontend use

```typescript
const siteUrl = import.meta.env.PUBLIC_SITE_URL
```

**Secret variables** (server-only):
- Prefix: `SECRET_`
- Never exposed to browser
- Safe for sensitive credentials

```typescript
const apiKey = import.meta.env.SECRET_API_KEY
```

### Accessing Variables in Code

```typescript
// Public variables (client-safe)
export const siteUrl = import.meta.env.PUBLIC_SITE_URL || 'http://localhost:4321'

// Secret variables (server components only)
const stripeKey = import.meta.env.SECRET_STRIPE_KEY

// Type-safe access with fallback
const analyticsId = import.meta.env.PUBLIC_ANALYTICS_ID ?? 'development'
```

### Security Best Practices

- ✅ **Always use `.env.local`** for local secrets (added to `.gitignore`)
- ✅ **Never commit `.env.local`** to git
- ✅ **Use `SECRET_` prefix** for sensitive data
- ✅ **Document all env vars** in a `.env.example` file (without values)
- ✅ **Validate at runtime** — check that required variables are set before using them

See [CONFIG.md](./CONFIG.md) for configuration details.

---

## Deployment

The site is fully static (zero server required) and can be deployed to any static hosting provider.

### Deployment Platforms

| Platform | Setup | Notes |
|----------|-------|-------|
| **Vercel** | Connect GitHub repo, auto-deploys on push | Recommended for Astro |
| **Netlify** | Same as Vercel | Excellent Astro support |
| **AWS S3 + CloudFront** | Manual upload to S3, configure CloudFront | For advanced needs |
| **Traditional hosting** | Upload `dist/` via FTP/SFTP | Works anywhere |

### Build Output

After running `pnpm build`, the `dist/` folder contains:

```
dist/
├── index.html                    # PT landing page
├── galeria/index.html            # PT gallery
├── artwork/[slug]/index.html     # PT artwork detail pages
├── en/index.html                 # EN landing page
├── en/gallery/index.html         # EN gallery
├── en/art/[slug]/index.html      # EN artwork detail pages
├── sitemap-index.xml             # SEO sitemap (auto-generated)
└── assets/                       # CSS, images (optimized)
```

No server, no backend, no database — just static files.

### Deployment Checklist

Before deploying to production:

- [ ] Run `pnpm build` locally — build succeeds without errors
- [ ] Run `pnpm preview` — site works correctly in production build
- [ ] Check Lighthouse scores (DevTools → Lighthouse)
  - [ ] Performance ≥ 95
  - [ ] Accessibility ≥ 95
  - [ ] Best Practices ≥ 95
  - [ ] SEO ≥ 95
- [ ] Test on mobile device (different screen sizes)
- [ ] Verify all artwork images load correctly
- [ ] Check theme toggle works (both light & dark)
- [ ] Verify language switcher (PT ↔ EN)
- [ ] Test on different browsers (Chrome, Firefox, Safari)

See [CONFIG.md](./CONFIG.md) for production configuration options.

---

## Troubleshooting

### Common Issues & Solutions

#### ❌ Port 4321 already in use

**Symptom:** Error `EADDRINUSE` when running `pnpm dev`

**Solution:** Use a different port
```bash
pnpm dev -- --port 3000
```

**Alternatives:**
- Kill the process on port 4321: `lsof -i :4321 | grep node | awk '{print $2}' | xargs kill -9`
- Wait a few seconds and try again

---

#### ❌ Images not loading in gallery

**Symptom:** Image placeholders or broken image icons

**Checklist:**
1. Verify image files exist in `public/images/` directory
2. Check that `src` path in artwork frontmatter matches filename exactly (case-sensitive)
3. Ensure image dimensions are at least 800×600px (minimum recommended)
4. Run type checking: `pnpm astro check` to see validation errors
5. Check browser DevTools → Network tab for 404 errors

**Example fix:**
```markdown
---
cover:
  src: "/images/artwork-cover.jpg"  # ✅ Correct
  alt: "Descriptive alt text"
---
```

---

#### ❌ Build fails with "collection not found"

**Symptom:** Error during `pnpm build`: `Collection 'artworks' not found`

**Checklist:**
1. Verify `src/content/artworks/` directory exists
2. Check that `.md` files are in the correct directory (not in subdirectories)
3. Verify `src/content.config.ts` loader path is correct:
   ```typescript
   loader: async () => ({
     artworks: (await glob('*.md', { cwd: fileURLToPath(new URL('.', import.meta.url)) }))
   })
   ```
4. Run `pnpm install` to ensure content collection tools are installed

---

#### ❌ TypeScript errors prevent build

**Symptom:** `pnpm build` fails with type errors

**Solution:**
```bash
# See all type issues
pnpm astro check

# Fix errors (most editors have auto-fix)
# Then rebuild
pnpm build
```

**Common type errors:**
- Missing `alt` property on images
- Missing required fields in frontmatter
- Component prop type mismatches

---

#### ❌ Dark theme not persisting

**Symptom:** Theme resets to light when page reloads

**Diagnosis:**
1. Open DevTools → Application → LocalStorage
2. Look for a `theme` key
3. Check that it contains `"dark"` or `"light"`

**Checklist:**
- [ ] Browser localStorage is enabled (not in private/incognito mode)
- [ ] `.dark` class is on `<html>` element when dark mode is active
- [ ] CSS variables in `global.css` have `dark:` color overrides
- [ ] ThemeToggle component loads before other components

**Fix:** Force theme persistence
```typescript
// In BaseLayout.astro <script is:inline>
const theme = localStorage.getItem('theme') || 'light'
document.documentElement.classList.toggle('dark', theme === 'dark')
```

See [THEMING.md](./THEMING.md) for theme system details.

---

#### ❌ i18n routes not generating

**Symptom:** `/en/gallery` returns 404, but `/galeria` works

**Checklist:**
1. Verify `src/pages/en/` directory exists
2. Check that English pages match Portuguese structure:
   - `src/pages/galeria.astro` → `src/pages/en/gallery.astro`
   - Filenames should match the intended URL slugs
3. Run `pnpm build` to see all generated routes in the build output
4. Check `astro.config.mjs` i18n configuration

**Example structure:**
```
src/pages/
├── index.astro           # PT: /
├── galeria.astro         # PT: /galeria
└── en/
    ├── index.astro       # EN: /en/
    └── gallery.astro     # EN: /en/gallery
```

See [i18n.md](./i18n.md) for localization details.

---

#### ❌ Hot module reload (HMR) not working

**Symptom:** Changes don't appear in browser; manual refresh needed

**Solution:**
1. Check that `pnpm dev` is still running (not crashed)
2. Look at the terminal for error messages
3. Try restarting the dev server:
   ```bash
   Ctrl+C  # Stop the server
   pnpm dev # Restart
   ```
4. Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)

**Advanced:** If HMR still fails, restart the browser tab or clear `node_modules`:
```bash
rm -rf node_modules
pnpm install
pnpm dev
```

---

#### ❌ Content not appearing after adding artwork

**Symptom:** New artwork `.md` file added but doesn't show in gallery

**Solution:**
1. Restart `pnpm dev` (content files need full rebuild)
2. Run `pnpm astro check` to validate the markdown frontmatter
3. Check that all required fields are present in frontmatter
4. Verify `featured: true` is set if expecting it on landing page

**Required fields:**
```yaml
title: "Artwork Title"
titlePt: "Título da Obra"
publishedAt: 2024-01-15  # Date in YYYY-MM-DD format
cover:
  src: "/images/cover.jpg"
  alt: "Alt text"
```

See [CONTENT.md](./CONTENT.md) for complete schema.

---

## Next Steps

After setup completes successfully, explore these resources:

1. **[CONTENT.md](./CONTENT.md)** — Add your first artwork and understand the schema
2. **[COMPONENTS.md](./COMPONENTS.md)** — Explore available components and props
3. **[ARCHITECTURE.md](./ARCHITECTURE.md)** — Understand how everything connects
4. **[THEMING.md](./THEMING.md)** — Customize colors and dark mode
5. **[GSAP.md](./GSAP.md)** — Learn animation patterns
6. **[i18n.md](./i18n.md)** — Work with translations
7. **[SEO.md](./SEO.md)** — Optimize for search engines
8. **[CONFIG.md](./CONFIG.md)** — Configuration reference

**Quick path for different roles:**
- 👨‍💻 **New Developer** → ARCHITECTURE.md → COMPONENTS.md → STRUCTURE.md
- 📝 **Content Creator** → CONTENT.md → SEO.md
- 🎨 **Designer** → THEMING.md → GSAP.md
- ⚙️ **DevOps** → CONFIG.md → Deployment section above

Happy building! 🎨
