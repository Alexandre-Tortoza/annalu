# Project Structure

## Visual File Tree

```
AnnaLu/                                    Project root
├── docs/                                  📖 Documentation (you are here)
│   ├── README.md                         Documentation index
│   ├── SETUP.md                          Installation & dev environment
│   ├── ARCHITECTURE.md                   System design & patterns
│   ├── STRUCTURE.md                      This file — project layout
│   ├── COMPONENTS.md                     Component reference
│   ├── CONTENT.md                        Content management & schema
│   ├── i18n.md                           Language & localization
│   ├── THEMING.md                        Light/dark mode
│   ├── GSAP.md                           Animation details
│   ├── SEO.md                            Search optimization
│   └── CONFIG.md                         Configuration reference
│
├── public/                                🌐 Static assets (served as-is, never processed)
│   ├── favicon.ico                       Old-format tab icon
│   ├── favicon.svg                       Modern tab icon
│   ├── robots.txt                        Search engine crawl rules
│   └── images/                           Artwork images
│       ├── masterpiece-cover.jpg
│       ├── masterpiece-1.jpg
│       ├── watercolor-abstract-cover.jpg
│       └── ...
│
├── src/                                   💻 Source code (compiled at build time)
│   │
│   ├── content/                          📝 Content Collections (Markdown files)
│   │   └── artworks/                     Artwork data
│   │       ├── masterpiece.md            Artwork #1 (frontmatter + body)
│   │       ├── watercolor-abstract.md    Artwork #2
│   │       └── urban-sketches.md         Artwork #3
│   │
│   ├── content.config.ts                 🔒 Content schema & validation (Zod)
│   │
│   ├── styles/                           🎨 Global styling
│   │   └── global.css                    Tailwind, CSS variables, resets
│   │
│   ├── i18n/                             🌍 Internationalization (PT + EN)
│   │   ├── index.ts                      Locale utilities & route helpers
│   │   └── translations.ts               UI strings in Portuguese & English
│   │
│   ├── components/                       🧩 Reusable Astro components
│   │   ├── SEO.astro                     Meta tags, OG, JSON-LD
│   │   ├── Header.astro                  Navigation bar
│   │   ├── Footer.astro                  Footer with links
│   │   ├── ThemeToggle.astro             Light/dark switch
│   │   ├── LanguagePicker.astro          PT/EN switcher
│   │   ├── ArtworkCard.astro             Artwork summary card
│   │   └── MosaicRow.astro               Gallery grid row
│   │
│   ├── layouts/                          📐 Page templates
│   │   ├── BaseLayout.astro              Master layout (all pages)
│   │   └── ArtworkLayout.astro           Artwork detail template
│   │
│   └── pages/                            🛣️ Routes (auto-compiled by Astro)
│       ├── index.astro                   / (PT landing)
│       ├── galeria.astro                 /galeria (PT gallery)
│       ├── artwork/
│       │   └── [slug].astro              /artwork/[slug] (PT detail)
│       │
│       └── en/                           English routes (/en/ prefix)
│           ├── index.astro               /en/ (EN landing)
│           ├── gallery.astro             /en/gallery (EN gallery)
│           └── art/
│               └── [slug].astro          /en/art/[slug] (EN detail)
│
├── astro.config.mjs                      ⚙️ Astro settings (site, integrations, i18n)
├── tsconfig.json                         ⚙️ TypeScript config (strict mode)
├── CLAUDE.md                             🤖 Guidance for Claude Code
├── package.json                          📦 Dependencies & scripts
├── pnpm-lock.yaml                        🔒 Locked dependency versions (pnpm)
└── README.md                             📋 Project overview
```

---

## Directory Purpose Guide

### `/docs` — Documentation
**Purpose:** Project guides, architecture docs, API references

**Key files:**
- `README.md` — Start here for documentation overview
- `ARCHITECTURE.md` — System design, patterns, philosophy
- `STRUCTURE.md` — This file
- `CONTENT.md` — How to add/manage artwork content
- `i18n.md` — Language configuration and translations

**Related:** See [Configuration Files](#configuration-files) for architecture and design philosophy

---

### `/public` — Static Assets
**Purpose:** Files served exactly as-is, never processed

**Key principle:** Astro doesn't transform these files—they go straight to output

**Key files:**
- `robots.txt` — Rules for search engine crawlers
- `favicon.svg` — Modern tab icon (preferred)
- `favicon.ico` — Fallback for old browsers
- `images/` — All artwork images referenced in content

**When to add here:**
- Images used in artwork content
- Fonts (if using custom fonts)
- PDFs or downloads
- Favicons and metadata files

**Related:** [CONTENT.md](./CONTENT.md) explains image naming and schema

---

### `/src/content/` — Content Collections
**Purpose:** Markdown files defining structured data (artworks)

**Structure:**
```
content/
└── artworks/
    ├── masterpiece.md
    ├── watercolor-abstract.md
    └── urban-sketches.md
```

**Content format:** YAML frontmatter + Markdown body
```yaml
---
title: "Artwork Title"
description: "Short description"
cover:
  src: "/images/artwork-cover.jpg"
  alt: "Description for accessibility"
featured: true
---

# Markdown body (optional)
This is the full description...
```

**Schema:** Defined in `src/content.config.ts` (Zod validation)

**Build behavior:** Each `.md` file generates:
- `/artwork/[slug]/` page (Portuguese)
- `/en/art/[slug]/` page (English)

**Related:** [CONTENT.md](./CONTENT.md) for detailed schema and examples

---

### `/src/styles/` — Global Styling
**Purpose:** Theme, CSS variables, global styles

**Key file:**
- `global.css` — Tailwind import, CSS custom properties (color tokens), resets

**Architecture:**
- **Tailwind** — Utility classes applied to components
- **CSS custom properties** — Theme variables (light/dark)
- **`:root`** — Light theme variables
- **`.dark`** — Dark theme variables

**Pattern:** Components use `class="bg-[var(--color-bg)]"` to reference tokens

**Related:** [THEMING.md](./THEMING.md) for color system details

---

### `/src/i18n/` — Internationalization
**Purpose:** Language-specific strings and route helpers

**Key files:**
- `translations.ts` — UI strings in PT and EN
- `index.ts` — Helper functions (`useTranslations()`, `getAlternateUrl()`)

**Locales:**
- `pt` — Portuguese (default, no prefix)
- `en` — English (prefix `/en/`)

**Usage:**
```ts
const t = useTranslations('pt')
t('nav.home')  // → "Início"
```

**Related:** [i18n.md](./i18n.md) for full language guide

---

### `/src/components/` — UI Components
**Purpose:** Reusable Astro components (template-only by default)

**Component types:**

**Layout Components:**
- `SEO.astro` — Meta tags, OG, JSON-LD, hreflang
- `Header.astro` — Navigation + theme/language pickers
- `Footer.astro` — Social links + copyright

**Domain Components:**
- `ArtworkCard.astro` — Artwork summary card (latest section)
- `MosaicRow.astro` — Gallery grid row

**Utility Components:**
- `ThemeToggle.astro` — Light/dark switch
- `LanguagePicker.astro` — PT/EN switcher

**Principles:**
- **Template-only** — No `<script>` blocks (keep them presentational)
- **Props-driven** — Receive data via `Astro.props`
- **Data-animate** — Mark elements with animation hooks (handled by BaseLayout)

**Naming:** PascalCase (e.g., `ArtworkCard.astro` ✅, not `artwork-card.astro`)

**Related:** [COMPONENTS.md](./COMPONENTS.md) for detailed prop reference

---

### `/src/layouts/` — Page Templates
**Purpose:** Page structure and layout hierarchy

**Key files:**
- `BaseLayout.astro` — Master layout for all pages
  - Contains `<head>`, `<Header>`, `<Footer>`
  - Initializes GSAP animations
  - Manages theme and i18n context
  
- `ArtworkLayout.astro` — Extends BaseLayout for artwork detail pages
  - Adds cover image, metadata, body content
  - Adds previous/next navigation

**Usage:**
```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro'
---
<BaseLayout title="Page Title">
  Page content here
</BaseLayout>
```

**Principles:**
- Single inheritance chain (BaseLayout → ArtworkLayout)
- All GSAP initialization centralized in BaseLayout
- Components remain template-only, layouts provide structure

**Related:** [ARCHITECTURE.md](./ARCHITECTURE.md) for design patterns

---

### `/src/pages/` — Routes
**Purpose:** Website pages and URLs (auto-generated by Astro)

**Routing rules:**
- `pages/index.astro` → `/`
- `pages/galeria.astro` → `/galeria`
- `pages/about.astro` → `/about`
- `pages/artwork/[slug].astro` → `/artwork/[slug]` (dynamic)
- `pages/en/*` → `/en/*` (English versions)

**Portuguese Routes:**
| File | URL | Purpose |
|------|-----|---------|
| `pages/index.astro` | `/` | Landing page |
| `pages/galeria.astro` | `/galeria` | Gallery |
| `pages/artwork/[slug].astro` | `/artwork/[slug]` | Artwork detail |

**English Routes:**
| File | URL | Purpose |
|------|-----|---------|
| `pages/en/index.astro` | `/en/` | Landing (EN) |
| `pages/en/gallery.astro` | `/en/gallery` | Gallery (EN) |
| `pages/en/art/[slug].astro` | `/en/art/[slug]` | Artwork detail (EN) |

**Dynamic Routes:**
```ts
// pages/artwork/[slug].astro
export async function getStaticPaths() {
  const artworks = await getCollection('artworks')
  return artworks.map(artwork => ({
    params: { slug: artwork.id },
    props: { artwork }
  }))
}
```

For 3 artworks: generates 6 pages (3 PT + 3 EN)

**Related:** [ARCHITECTURE.md](./ARCHITECTURE.md) for routing strategy

---

## Directory Tree

```
AnnaLu/
├── docs/                           # This documentation
│   ├── README.md                  # Documentation home
│   ├── SETUP.md                   # Installation & development
│   ├── ARCHITECTURE.md            # System design
│   ├── STRUCTURE.md               # This file
│   ├── COMPONENTS.md              # Component documentation
│   ├── CONTENT.md                 # Content management
│   ├── i18n.md                    # Internationalization
│   ├── THEMING.md                 # Light/dark mode
│   ├── GSAP.md                    # Animations
│   ├── SEO.md                     # Search engine optimization
│   └── CONFIG.md                  # Configuration files
│
├── public/                         # Static assets (served as-is)
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── robots.txt                 # Search engine crawl rules
│   └── images/                    # Artwork images
│       ├── masterpiece-cover.jpg
│       ├── masterpiece-1.jpg
│       ├── watercolor-abstract-cover.jpg
│       └── ...
│
├── src/
│   │
│   ├── content/                   # Content Collections
│   │   └── artworks/              # Artwork markdown files
│   │       ├── masterpiece.md
│   │       ├── watercolor-abstract.md
│   │       └── urban-sketches.md
│   │
│   ├── content.config.ts          # Content collection schema & loader
│   │
│   ├── styles/
│   │   └── global.css             # Tailwind, CSS variables, base styles
│   │
│   ├── i18n/                      # Internationalization
│   │   ├── index.ts               # Locale utilities
│   │   └── translations.ts        # UI strings (pt + en)
│   │
│   ├── components/                # Reusable Astro components
│   │   ├── SEO.astro              # Meta tags & structured data
│   │   ├── Header.astro           # Navigation bar
│   │   ├── Footer.astro           # Footer with links
│   │   ├── ThemeToggle.astro      # Light/dark toggle
│   │   ├── LanguagePicker.astro   # PT/EN switcher
│   │   ├── ArtworkCard.astro      # Artwork summary card
│   │   └── MosaicRow.astro        # Gallery grid row
│   │
│   ├── layouts/                   # Page layout templates
│   │   ├── BaseLayout.astro       # HTML shell + Header + Footer
│   │   └── ArtworkLayout.astro    # Artwork detail page template
│   │
│   └── pages/                     # Routes (auto-generated by Astro)
│       ├── index.astro            # / (PT landing)
│       ├── galeria.astro          # /galeria (PT gallery)
│       ├── artwork/
│       │   └── [slug].astro       # /artwork/[slug] (PT detail)
│       │
│       └── en/                    # English routes (prefix /en/)
│           ├── index.astro        # /en/ (EN landing)
│           ├── gallery.astro      # /en/gallery (EN gallery)
│           └── art/
│               └── [slug].astro   # /en/art/[slug] (EN detail)
│
├── astro.config.mjs               # Astro configuration
├── tsconfig.json                  # TypeScript configuration
├── CLAUDE.md                       # Claude Code guidance
├── package.json                   # Dependencies & scripts
├── pnpm-lock.yaml                 # Dependency lock file (pnpm)
└── README.md                      # Project README
```

---

## File Organization Principles

### ✅ Do

- **Keep files close to where they're used** — Components in `/components`, pages in `/pages`
- **Use descriptive names** — `ArtworkCard.astro`, not `Card.astro` or `component.astro`
- **Group related files** — All content in `content/`, all i18n in `i18n/`
- **Use path aliases** — Import from `@/components`, not `../../components`
- **One responsibility per file** — Components do one thing well
- **Keep pages simple** — Logic in components, pages mostly just compose and pass props

### ❌ Don't

- **Create folders without structure** — Don't add `src/utils/` for 2 functions
- **Bury imports in nested folders** — `src/components/gallery/sections/items/` is too deep
- **Mix concerns** — Don't put styling logic in page files
- **Use vague names** — `component.astro`, `util.ts`, `page.astro` are unhelpful
- **Create redundant files** — If something is used once, put it inline or in a component

---

## How to Find Things

### Quick Navigation

| I need to... | Look here | Example |
|---|---|---|
| **Add a navigation link** | `src/components/Header.astro` | Add to nav menu |
| **Change a translation** | `src/i18n/translations.ts` | "Gallery" → "Galería" |
| **Add a new artwork** | `src/content/artworks/my-artwork.md` | Create markdown file |
| **Add global styles** | `src/styles/global.css` | Theme colors, fonts |
| **Change site title** | `src/pages/index.astro` or `SEO` props | Update `<title>` |
| **Change theme colors** | `src/styles/global.css` | CSS custom properties |
| **Add GSAP animation** | `src/layouts/BaseLayout.astro` | `<script>` section |
| **Create a new page** | `src/pages/about.astro` (+ EN version) | New route |
| **Update meta tags** | `src/components/SEO.astro` | Title, description, OG |

### Adding Content

**New artwork:**
1. Create file: `src/content/artworks/my-artwork.md`
2. Add images: `public/images/my-artwork-*.jpg`
3. Update frontmatter (title, description, cover, images)
4. Build runs, pages auto-generate
5. Detail pages at `/artwork/my-artwork` and `/en/art/my-artwork`

**See:** [CONTENT.md](./CONTENT.md)

### Adding Functionality

**New component:**
1. Create file: `src/components/MyComponent.astro`
2. Define props interface at top
3. Mark animated elements with `data-animate="my-component"`
4. Import and use in pages

**New page:**
1. Create file: `src/pages/about.astro` (PT) + `src/pages/en/about.astro` (EN)
2. Both import `BaseLayout`
3. Add translation strings to `src/i18n/translations.ts`
4. Update `Header.astro` navigation

**See:** [COMPONENTS.md](./COMPONENTS.md) for component patterns

### Debugging

**Component not rendering:**
- Check file name (PascalCase: `MyComponent.astro`)
- Check import path (relative or `@/` alias)
- Verify file location (`src/components/`)

**Page not appearing:**
- Check file exists in `src/pages/`
- Verify file name (lowercase: `about.astro`)
- Run `pnpm build` to generate routes

**Images not loading:**
- Verify image in `public/images/`
- Check path matches exactly (case-sensitive)
- Verify `alt` text present in schema

**Validation errors:**
- Run `pnpm astro check` for full TypeScript check
- Fix frontmatter to match Zod schema in `content.config.ts`

---

## Common File Locations

| Need | File | Section |
|------|------|---------|
| Add a navigation link | `src/components/Header.astro` | `<nav>` element |
| Add a translation string | `src/i18n/translations.ts` | `pt` or `en` object |
| Add new artwork | `src/content/artworks/my-artwork.md` | New file |
| Add global styles | `src/styles/global.css` | Anywhere (it's imported globally) |
| Change site title | `src/pages/index.astro` | `<SEO title="..." />` |
| Change color theme | `src/styles/global.css` | `:root` (light) or `.dark` (dark) |
| Add GSAP animation | `src/layouts/BaseLayout.astro` | `<script>` block |
| Create new page | `src/pages/about.astro` + `src/pages/en/about.astro` | Both files |
| Change meta tags | `src/components/SEO.astro` | Props interface or template |
| Update artwork schema | `src/content.config.ts` | `artworkSchema` Zod object |

---

### Root Configuration Files

| File | Purpose |
|------|---------|
| `astro.config.mjs` | Astro settings (site URL, integrations, i18n) |
| `tsconfig.json` | TypeScript configuration (strict mode) |
| `package.json` | Dependencies, scripts, metadata |
| `CLAUDE.md` | Guidance for Claude Code (AI assistant) |

### Content Files

| File | Purpose |
|------|---------|
| `src/content.config.ts` | Content Collection schema (Zod validation) |
| `src/content/artworks/*.md` | Artwork markdown files (data + body) |

### Styling Files

| File | Purpose |
|------|---------|
| `src/styles/global.css` | Tailwind import, CSS variables, base resets |

### i18n Files

| File | Purpose |
|------|---------|
| `src/i18n/translations.ts` | UI strings in PT and EN |
| `src/i18n/index.ts` | Helper functions (useTranslations, getLangFromUrl, getAlternateUrl) |

### Component Files

| File | Purpose | Type |
|------|---------|------|
| `src/components/SEO.astro` | Meta tags, OG, JSON-LD | UI |
| `src/components/Header.astro` | Navigation bar | UI |
| `src/components/Footer.astro` | Footer | UI |
| `src/components/ThemeToggle.astro` | Theme switcher | UI |
| `src/components/LanguagePicker.astro` | Language switcher | UI |
| `src/components/ArtworkCard.astro` | Artwork summary card | Domain |
| `src/components/MosaicRow.astro` | Gallery grid row | Domain |

### Layout Files

| File | Purpose | Usage |
|------|---------|-------|
| `src/layouts/BaseLayout.astro` | HTML shell, Header, Footer | All pages |
| `src/layouts/ArtworkLayout.astro` | Artwork detail page | Artwork detail pages |

### Page Files

#### Portuguese Routes

| File | URL | Purpose |
|------|-----|---------|
| `src/pages/index.astro` | `/` | PT landing page |
| `src/pages/galeria.astro` | `/galeria` | PT gallery |
| `src/pages/artwork/[slug].astro` | `/artwork/[slug]` | PT artwork detail |

#### English Routes

| File | URL | Purpose |
|------|-----|---------|
| `src/pages/en/index.astro` | `/en/` | EN landing page |
| `src/pages/en/gallery.astro` | `/en/gallery` | EN gallery |
| `src/pages/en/art/[slug].astro` | `/en/art/[slug]` | EN artwork detail |

### Public Assets

| File | Purpose |
|------|---------|
| `public/robots.txt` | Search engine crawl rules |
| `public/favicon.ico` | Tab icon (old format) |
| `public/favicon.svg` | Tab icon (modern format) |
| `public/images/*` | Artwork images (referenced in content) |

---

## File Dependencies

### Component Dependencies

```
components/
├── SEO.astro               (no dependencies)
├── ThemeToggle.astro       (no dependencies)
├── LanguagePicker.astro    (no dependencies)
├── Header.astro            imports ThemeToggle, LanguagePicker
├── Footer.astro            (no dependencies)
├── ArtworkCard.astro       imports Image from astro:assets
└── MosaicRow.astro         imports Image from astro:assets

layouts/
├── BaseLayout.astro        imports Header, Footer, SEO, global.css
└── ArtworkLayout.astro     imports BaseLayout

pages/
├── index.astro             imports BaseLayout, components, i18n
├── galeria.astro           imports BaseLayout, components
├── artwork/[slug].astro    imports ArtworkLayout
└── en/*                    (same as PT pages, different lang)
```

### Content Dependencies

```
src/content.config.ts       (defines artworks collection)
  ↓
src/content/artworks/*.md   (individual artwork files)
  ↓
pages/artwork/[slug].astro  (uses getCollection, getStaticPaths)
  ↓
dist/artwork/*/index.html   (generated static pages)
```

---

## Build Output

After `pnpm build`, the `dist/` folder contains:

```
dist/
├── index.html                     # PT landing
├── galeria/
│   └── index.html                 # PT gallery
├── artwork/
│   ├── masterpiece/
│   │   └── index.html             # PT detail page
│   ├── watercolor-abstract/
│   │   └── index.html
│   └── urban-sketches/
│       └── index.html
│
├── en/
│   ├── index.html                 # EN landing
│   ├── gallery/
│   │   └── index.html             # EN gallery
│   └── art/
│       ├── masterpiece/
│       │   └── index.html         # EN detail page
│       ├── watercolor-abstract/
│       │   └── index.html
│       └── urban-sketches/
│           └── index.html
│
├── _astro/
│   ├── global.*.css               # Compiled & minified CSS
│   └── *.js                       # GSAP and other scripts
│
├── images/
│   ├── masterpiece-cover.*.avif   # Optimized images
│   ├── masterpiece-cover.*.webp
│   ├── masterpiece-cover.*.jpg
│   └── ... (multiple formats per image)
│
├── sitemap-index.xml              # Sitemap index
├── sitemap-0.xml                  # Sitemap with all URLs
├── robots.txt                     # Crawl rules (copied from public/)
├── favicon.ico                    # (copied from public/)
└── favicon.svg                    # (copied from public/)
```

All files are static HTML. No server required — just host on any static file server.

---

## Adding New Features

### Adding a New Page

Example: Add an "About" page

1. Create `src/pages/about.astro` (PT)
2. Create `src/pages/en/about.astro` (EN)
3. Both use `<BaseLayout>`
4. Update `Header` navigation links
5. Add translation strings to `src/i18n/translations.ts`

### Adding a New Component

Example: Add a "Newsletter Signup" component

1. Create `src/components/NewsletterSignup.astro`
2. Type the props interface
3. Import and use in pages
4. Add required translation strings if any

### Adding a New Artwork

See [CONTENT.md](./CONTENT.md).

In short:
1. Create `src/content/artworks/my-artwork.md`
2. Add images to `public/images/`
3. The detail page auto-generates

### Changing Styling

1. Edit `src/styles/global.css` for global styles
2. Use Tailwind utilities in components (`class="flex gap-4"`)
3. CSS variables for theme-aware colors (`var(--color-text)`)
4. Component-scoped `<style>` for specific styling

### Changing Translations

1. Edit `src/i18n/translations.ts`
2. Update both PT and EN
3. Use `useTranslations(lang)` in components

---

## Import Paths

### Using @ Alias

For cleaner imports, use `@/` to refer to `src/`:

```ts
// ✅ Clean
import SEO from '@/components/SEO.astro'
import BaseLayout from '@/layouts/BaseLayout.astro'

// ❌ Verbose
import SEO from '../../components/SEO.astro'
```

Configured in `tsconfig.json`:
```json
"paths": { "@/*": ["./src/*"] }
```

### Relative Imports

Still valid, especially in the same directory:

```astro
---
import Header from './Header.astro'  // Same directory
import BaseLayout from '@/layouts/BaseLayout.astro'  // Different directory
---
```

---

## File Naming Conventions

### Components (PascalCase)
- `Header.astro` ✅
- `header.astro` ❌
- `ArtworkCard.astro` ✅
- `artwork-card.astro` ❌

### Pages (kebab-case or same as component)
- `index.astro` ✅
- `gallery.astro` ✅
- `[slug].astro` ✅
- Files in directories: `pages/artwork/[slug].astro` ✅

### Content (kebab-case)
- `masterpiece.md` ✅
- `watercolor-abstract.md` ✅
- `Masterpiece.md` ❌

### Styles (kebab-case)
- `global.css` ✅
- `base.css` ✅

### Scripts (camelCase, .ts for TypeScript)
- `useTranslations.ts` ✅
- `getLangFromUrl.ts` ✅

---

## Common File Locations

| Need | File |
|------|------|
| Add a navigation link | `src/components/Header.astro` |
| Add a translation string | `src/i18n/translations.ts` |
| Add a new artwork | `src/content/artworks/my-artwork.md` |
| Add global styles | `src/styles/global.css` |
| Change site title | `src/pages/index.astro` (seo.title) |
| Change color theme | `src/styles/global.css` (:root and .dark) |
| Add GSAP animation | `src/layouts/BaseLayout.astro` (script section) |

---

## Best Practices

### ✅ Do

**Organization:**
- Keep components small and focused (single responsibility)
- Place related files close together (components together, pages together)
- Use descriptive file names that reflect the component's purpose

**Imports:**
- Use `@/` alias for imports from different directories
- Use relative imports only within the same directory
- Group imports: astro components first, then utils, then styles

**Components:**
- Keep pages simple — move logic into components
- Make components reusable where possible
- Use `Astro.props` pattern for prop definitions
- Mark animated elements with `data-animate` attributes

**Styling:**
- Use Tailwind utilities for layout and spacing
- Use CSS custom properties for theme-aware colors
- Keep component-specific styles in `<style>` blocks when needed

**Documentation:**
- Document complex logic with comments
- Explain non-obvious design decisions
- Keep component prop interfaces well-typed (TypeScript)

### ❌ Don't

**File Structure:**
- ❌ Create files without a clear purpose
- ❌ Nest components deeply (hard to import, maintain)
- ❌ Mix multiple concerns in one file
- ❌ Use generic names (`component.astro`, `page.astro`, `util.ts`)

**Code:**
- ❌ Create `utils/` folder for just a few functions (put logic in components if used once)
- ❌ Duplicate code across components (extract into shared component)
- ❌ Add `<script>` blocks to domain components (animations go in BaseLayout)
- ❌ Import from deep relative paths (`../../../components`) — use `@/` instead

**Style:**
- ❌ Use inline `<style>` for everything — use Tailwind utilities first
- ❌ Hardcode colors — use CSS custom properties (`var(--color-text)`)
- ❌ Mix responsive breakpoints in multiple places — centralize in global.css

---

## Debugging File Issues

### Component not rendering

1. Check file exists in `src/components/`
2. Verify file name spelling (PascalCase: `MyComponent.astro`)
3. Check import path (relative or `@/` alias)
4. Verify file ends with `.astro`
5. Run `pnpm astro check` to see TypeScript errors

**Example error:**
```
Importing from '@/components/artwork-card'
↑ File is 'ArtworkCard.astro' (PascalCase), not 'artwork-card.astro'
```

### Page not appearing

1. Check file in `src/pages/`
2. Verify URL structure (e.g., `pages/about.astro` → `/about`)
3. Check filename is lowercase (except nested components)
4. Verify you have both PT and EN versions if bilingual
5. Run `pnpm build` to generate routes, then check `dist/`

**Example:**
```
pages/about.astro           → /about          ✅
pages/en/about.astro        → /en/about       ✅
(both needed for bilingual)
```

### Images not loading

1. Verify images in `public/images/` (exact location matters)
2. Check `src` path matches exactly (case-sensitive on Linux)
3. Verify `alt` text is present (required by Zod schema)
4. Check image file exists on disk and isn't corrupted
5. Run `pnpm build` to optimize images

**Example error:**
```yaml
cover:
  src: "/images/my-artwork.jpg"    # ✅ Correct path
  src: "images/my-artwork.jpg"     # ❌ Missing leading /
  src: "/images/My-Artwork.jpg"    # ❌ Case mismatch
```

### Content validation errors

```bash
pnpm astro check
```

This shows all schema errors in content files. Common issues:

1. **Missing required field:**
   ```yaml
   # Missing 'cover' field
   title: "Artwork"  # ❌ schema requires 'cover'
   ```

2. **Wrong field type:**
   ```yaml
   featured: "true"  # ❌ Should be boolean, not string
   featured: true    # ✅ Correct
   ```

3. **Incomplete object:**
   ```yaml
   cover: "/images/art.jpg"  # ❌ Should be object with 'src' and 'alt'
   cover:                     # ✅ Correct
     src: "/images/art.jpg"
     alt: "Description"
   ```

Fix the frontmatter to match the schema in `src/content.config.ts`.

### Animation not playing

1. Check element has `data-animate="something"` attribute
2. Verify GSAP animation registered in `src/layouts/BaseLayout.astro` `<script>`
3. Check browser console for JavaScript errors
4. Test with `pnpm dev` and open browser DevTools → Console
5. Verify user hasn't enabled "Reduce motion" (animations skip intentionally)

**Checklist:**
```astro
<!-- Component: needs data-animate attribute -->
<div data-animate="my-animation">Content</div>

<!-- BaseLayout: needs animation code -->
<script>
  const mm = gsap.matchMedia()
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.utils.toArray('[data-animate="my-animation"]').forEach(el => {
      // animation code
    })
  })
</script>
```

### Build fails

```bash
pnpm build
# Common errors:
# - "src/pages/about.astro (1:1): error: unknown variable"
#   → Check imports, typos in variable names
# 
# - "error: failed to parse frontmatter"
#   → Check YAML syntax in .md files
#
# - "error: image not found"
#   → Verify image path in public/images/
```

Run `pnpm astro check` first to catch errors before building.
