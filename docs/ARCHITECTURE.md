# Architecture Overview

## Quick Reference

| Decision | Choice | Why |
|----------|--------|-----|
| **Site Type** | Static Site Generator (Astro) | Zero runtime JS, instant load, no server needed |
| **Content Model** | Content Collections (Markdown + Zod) | Validates all content at build time, type-safe |
| **Styling** | Tailwind + CSS custom properties | Tree-shaking, theme variables, small CSS output |
| **Animations** | GSAP with reduced motion support | Smooth, performant, accessible |
| **i18n** | File-based routing (PT default, EN prefixed) | Clean URLs, SEO-friendly, easy to maintain |
| **Theme** | Light/dark via CSS class + localStorage | Instant switching, no flash, client-side persistence |
| **Images** | Astro `<Image>` with automatic optimization | AVIF/WebP, srcset, lazy loading, format negotiation |
| **Phase 2 Ready** | Schema reserves `shop?` field (optional) | Extensible without restructuring |

---

## System Design

AnnaLu is built on Astro's Static Site Generation (SSG) architecture. Every page is pre-rendered to static HTML at build time, with zero runtime JavaScript by default.

```
┌─────────────────────────────────────────────────────────┐
│  Content (Markdown files in src/content/artworks/)     │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│  Content Collection (src/content.config.ts)            │
│  • Zod schema validation                                │
│  • Glob loader for .md files                           │
│  • Bilingual data structure                            │
└─────────────────┬───────────────────────────────────────┘
                  │
    ┌─────────────┼──────────────┐
    │             │              │
    ▼             ▼              ▼
  Pages       Components    Layouts
  (Routes)    (UI Logic)    (Templates)
    │             │              │
    └─────────────┼──────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│  Astro Build                                            │
│  • Markdown → HTML                                      │
│  • Component → HTML                                     │
│  • Tailwind → CSS (tree-shaken)                        │
│  • Images → Optimized (AVIF/WebP)                      │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│  Static Output (dist/)                                 │
│  • Pure HTML files                                      │
│  • Optimized CSS                                        │
│  • Optimized images                                     │
│  • Zero JavaScript by default                          │
└─────────────────────────────────────────────────────────┘
```

---

## Data Flow

### Content → Display

```
Artwork Markdown
    ↓
Content.config.ts (Zod schema)
    ↓
getCollection('artworks')
    ↓
Pages use collection entries
    ↓
Components render with data
    ↓
Static HTML output
```

### Example: Displaying Latest Artworks

1. **Page** (`src/pages/index.astro`) calls:
   ```ts
   const artworks = await getCollection('artworks')
   const latest = artworks
     .sort((a, b) => b.data.publishedAt - a.data.publishedAt)
     .slice(0, 3)
   ```

2. **Page** passes to component:
   ```astro
   {latest.map(artwork => (
     <ArtworkCard artwork={artwork} lang="pt" />
   ))}
   ```

3. **Component** renders:
   - Reads `artwork.data.title` (or `titlePt` based on `lang`)
   - Renders cover image from `artwork.data.cover.src`
   - Links to `/artwork/{artwork.id}`

4. **Build time** generates:
   - `/index.html` with rendered cards
   - No client-side data fetching
   - No API calls

---

## Component Hierarchy

### Dependency Tree

```
BaseLayout.astro (all pages)
├── Head
│   ├── SEO.astro
│   ├── Stylesheets
│   └── FWOT script
├── Header.astro
│   ├── Logo
│   ├── Nav
│   ├── ThemeToggle.astro
│   └── LanguagePicker.astro
├── Main
│   ├── slot (page content)
│   └── (artworks, gallery, etc.)
├── Footer.astro
│   ├── Social
│   └── Copyright
└── script (GSAP)

ArtworkLayout.astro (extends BaseLayout)
├── (BaseLayout structure)
├── Hero / Cover image
├── Metadata
└── Body
```

### Why This Design?

**Monolithic Layouts Pattern:**
- Consolidates all GSAP animation logic in one place
- Simplifies script initialization (single `matchMedia()`)
- Components remain template-only, UI-focused
- Easier to maintain and debug animations

**Component Boundaries:**
- **Layout components** handle page structure (Header, Footer, SEO, animation init)
- **Domain components** handle feature-specific UI (ArtworkCard, MosaicRow)
- **UI components** are stateless and reusable (ThemeToggle, LanguagePicker)

### Layout Components

**BaseLayout** — Top-level wrapper for all pages
```
BaseLayout
├── <head>
│   ├── Meta tags (SEO component)
│   ├── Stylesheets
│   └── FWOT prevention script
├── <Header>
│   ├── Logo
│   ├── Navigation
│   ├── ThemeToggle
│   └── LanguagePicker
├── <main>
│   └── <slot /> (page content)
├── <Footer>
│   ├── Social links
│   └── Copyright
└── <script> (GSAP initialization)
```

**ArtworkLayout** — Extends BaseLayout for artwork detail pages
```
ArtworkLayout (extends BaseLayout)
├── Cover image
├── Title + metadata
├── Body content (from Markdown)
├── Previous/Next navigation
└── Footer (inherited from BaseLayout)
```

### UI Components (Reusable)

- **SEO** — Meta tags, OG, Twitter Card, JSON-LD, hreflang
- **Header** — Navigation bar with logo, language picker, theme toggle
- **Footer** — Social links, copyright
- **ThemeToggle** — Theme switcher (light/dark)
- **LanguagePicker** — Language switcher (PT/EN)

**Why this separation?**
- Each component has a single responsibility
- Reusable across pages (Header appears on all pages)
- Easy to test and reason about
- Flexible for future composition

### Domain Components

- **ArtworkCard** — Card displaying artwork summary (used in "latest" section)
- **MosaicRow** — Gallery grid row for artwork display

**Why domain components?**
- Encapsulate feature-specific logic (artwork rendering, mosaic layout)
- Coupled to content schema but reusable across pages
- Easier to enhance (e.g., add filtering, sorting)

---

## Design Patterns Used

### Composition Over Inheritance

- **BaseLayout** contains all pages
- **ArtworkLayout** extends BaseLayout (single inheritance level)
- Components compose via `<slot />` rather than deep hierarchies
- Keeps component tree shallow and testable

**Benefit:** Easy to trace data flow, simple to override specific sections

### Singleton Layouts

- **BaseLayout** (all pages) and **ArtworkLayout** (artwork detail) are singletons
- All GSAP initialization lives in BaseLayout `<script>`
- Prevents duplicate script execution
- Single source of truth for animations

**Benefit:** Animations initialize once, globally, eliminating race conditions

### Template-Only Components

- Components like **ArtworkCard**, **MosaicRow**, **Header** have **no `<script>` block**
- They are pure presentational—no state, no client logic
- GSAP finds them via `data-animate` attributes from BaseLayout

**Benefit:** Zero JavaScript cost at component level, animation logic centralized

### Content-Driven Architecture

- Content schema (Zod) is the source of truth
- Pages are generated from content, not hardcoded
- Component props type-checked against schema

**Benefit:** Add new artwork = auto-generates pages, no code changes needed

### Theme Provider Pattern

- CSS custom properties define theme tokens
- `document.documentElement.classList` toggles `.dark`
- localStorage persists user choice
- No context/state management needed

**Benefit:** Simple, no framework overhead, works in static HTML

### Bilingual Pattern

- Parallel route files (`index.astro` ↔ `en/index.astro`)
- Content fields suffixed with language code (`title` ↔ `titlePt`)
- Helper functions map routes (`getAlternateUrl`)

**Benefit:** Clear separation, type-safe, easy to add languages

---

## Routing & Page Generation

### Portuguese Routes (Default Locale)
```
/                           → src/pages/index.astro (landing)
/galeria                    → src/pages/galeria.astro (gallery)
/artwork/slug               → src/pages/artwork/[slug].astro (detail)
```

### English Routes
```
/en/                        → src/pages/en/index.astro
/en/gallery                 → src/pages/en/gallery.astro
/en/art/slug                → src/pages/en/art/[slug].astro
```

### Dynamic Routes

Artwork detail pages are generated via `getStaticPaths()`:

```ts
export async function getStaticPaths() {
  const artworks = await getCollection('artworks')
  return artworks.map(artwork => ({
    params: { slug: artwork.id },
    props: { artwork }
  }))
}
```

For 3 artworks, this generates 6 pages (3 PT + 3 EN).

---

## Styling Architecture

### CSS Hierarchy

```
Global styles (global.css)
    ↓
Tailwind utilities (applied via class names)
    ↓
CSS custom properties (theme variables)
    ↓
Component-level Tailwind classes
```

### CSS Custom Properties (Tokens)

All colors defined as CSS variables in `global.css`:

**Light theme** (`:root`)
```css
--color-bg: #ffffff;
--color-surface: #f9f9f9;
--color-text: #1a1a1a;
--color-accent: #3b82f6;
```

**Dark theme** (`.dark`)
```css
--color-bg: #1a1a1a;
--color-surface: #2a2a2a;
--color-text: #f5f5f5;
--color-accent: #60a5fa;
```

Components use Tailwind utilities that reference these variables:
```tsx
<div class="bg-[var(--color-bg)] text-[var(--color-text)]">
```

This allows theme switching via a single CSS class (`.dark` on `<html>`).

---

## Internationalization (i18n) Architecture

### Locale Strategy

**File-based routing:**
- Portuguese (default) → root paths
- English → `/en/` prefix

**i18n Configuration** (`astro.config.mjs`)
```ts
i18n: {
  defaultLocale: 'pt',
  locales: ['pt', 'en'],
  routing: { prefixDefaultLocale: false }
}
```

### Content Localization

**UI strings** (`src/i18n/translations.ts`)
```ts
const translations = {
  pt: { 'nav.home': 'Início', ... },
  en: { 'nav.home': 'Home', ... }
}
```

**Content fields** (Markdown frontmatter)
```yaml
title: "My Artwork"          # English
titlePt: "Minha Obra"        # Portuguese
description: "..."           # English
descriptionPt: "..."         # Portuguese
```

### URL Mapping

The `getAlternateUrl()` function maps routes between locales:
```
/             ↔  /en/
/galeria      ↔  /en/gallery
/artwork/foo  ↔  /en/art/foo
```

Every page has `<link rel="alternate" hreflang>` pointing to the other locale.

---

## Theme System (Light/Dark Mode)

### Technical Implementation

**1. FWOT Prevention** (in `BaseLayout` `<head>`)
```ts
// Blocks page render until theme is applied
// Prevents flash of wrong theme on load
document.documentElement.classList.add('dark') // if needed
```

**2. Theme Toggle** (in `ThemeToggle` component)
```ts
// On button click
document.documentElement.classList.toggle('dark')
localStorage.setItem('theme', 'dark' | 'light')
```

**3. CSS Dark Variant** (in `global.css`)
```css
@custom-variant dark (&:where(.dark, .dark *))
```

Enables Tailwind `dark:` prefix utilities:
```html
<div class="bg-white dark:bg-black">...</div>
```

---

## Animation Architecture (GSAP)

### Animation Registration

All animations centralized in **BaseLayout** `<script>` block:

```ts
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const mm = gsap.matchMedia()
mm.add('(prefers-reduced-motion: no-preference)', () => {
  // All GSAP code here
})
```

### Animation Triggers

Components mark themselves with `data-animate` attributes:
```html
<div data-animate="hero">...</div>
<div data-animate="card">...</div>
<div data-animate="mosaic-row">...</div>
```

BaseLayout's script finds and animates them:
```ts
gsap.utils.toArray('[data-animate="hero"]').forEach(el => {
  gsap.fromTo(el, { ... }, { ... })
})
```

### Reduced Motion Support

```ts
// Skip all animations if user prefers reduced motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Skip GSAP initialization
}
```

---

## Image Optimization

### Astro Image Component

All images use Astro's `<Image>` component:

```astro
<Image
  src={artwork.data.cover.src}
  alt={artwork.data.cover.alt}
  width={800}
  height={600}
  loading="lazy"
/>
```

**Automatic optimizations:**
- Generates AVIF + WebP + original format
- Responsive images (srcset with multiple sizes)
- Lazy loading by default
- Prevents layout shift (explicit width/height)
- Optimized for performance

### Image Paths

Images are referenced as paths and stored in `public/images/`:
```yaml
cover:
  src: "/images/artwork-cover.jpg"
  alt: "Descriptive text"
```

---

## SEO Architecture

### Meta Tags

Every page renders via `SEO` component:

```astro
<SEO
  title="Artwork Title"
  description="Short description"
  image="/images/artwork-cover.jpg"
  canonical="https://annalu.art/artwork/slug"
  jsonLd={visualArtworkSchema}
  lang="pt"
/>
```

**Generates:**
- `<title>`
- `<meta name="description">`
- Open Graph tags (OG)
- Twitter Card tags
- Canonical URL
- hreflang alternates
- JSON-LD schema

### Structured Data

Each artwork detail page includes JSON-LD VisualArtwork schema:

```json
{
  "@context": "https://schema.org",
  "@type": "VisualArtwork",
  "name": "Artwork Title",
  "description": "...",
  "image": "https://...",
  "dateCreated": "2024-01-15",
  "artMedium": "Acrylic on canvas",
  "width": "100 cm",
  "height": "80 cm"
}
```

### Sitemap

Auto-generated by `@astrojs/sitemap`:
- All static pages included
- `<loc>` for each page URL
- `<lastmod>` based on build time
- `<hreflang>` for multilingual pages

---

## Build Process

### What Happens During Build

```bash
pnpm build
```

1. **Content validation** — Zod schema validates all `.md` files
2. **Page generation** — Creates static pages for all routes
3. **Component compilation** — Astro → HTML
4. **CSS processing** — Tailwind tree-shaking, CSS variables injected
5. **Image optimization** — Runs image pipeline (Sharp), generates multiple formats
6. **Sitemap generation** — Crawls output, generates sitemap
7. **File output** — Everything written to `dist/`

### Output Structure

```
dist/
├── index.html                           (PT landing)
├── galeria/index.html                   (PT gallery)
├── artwork/
│   ├── masterpiece/index.html
│   ├── watercolor-abstract/index.html
│   └── urban-sketches/index.html
├── en/
│   ├── index.html                       (EN landing)
│   ├── gallery/index.html               (EN gallery)
│   └── art/
│       ├── masterpiece/index.html
│       ├── watercolor-abstract/index.html
│       └── urban-sketches/index.html
├── _astro/
│   ├── *.css                            (compiled CSS)
│   └── *.js                             (GSAP scripts)
├── images/
│   ├── artwork-*.webp                   (optimized images)
│   ├── artwork-*.avif
│   └── artwork-*.jpg
├── sitemap-index.xml
├── sitemap-0.xml
├── robots.txt
└── favicon.*
```

All HTML is pre-rendered, static, and immediately served.

---

## Phase 2 Preparation

The architecture is designed for e-commerce (Phase 2) without restructuring:

1. **Content schema** — `shop?` field already present (optional, disabled)
2. **Page layout** — `ArtworkLayout` has a reserved slot for purchase component
3. **SEO** — JSON-LD includes Product schema placeholders
4. **Database** — No database needed yet (pure static for Phase 1)

To enable Phase 2:
1. Populate `shop` fields in artwork frontmatter
2. Create `PurchaseWidget` component
3. Add checkout logic (handled externally via Stripe/similar)
4. Uncomment Phase 2 code in layouts

No restructuring needed — it's extensible by design.

---

## Performance Targets

- **Lighthouse** ≥95 (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint (FCP)** <1.5s
- **Largest Contentful Paint (LCP)** <2.5s
- **Cumulative Layout Shift (CLS)** <0.1
- **Time to Interactive (TTI)** <3.5s

Achieved through:
- Static HTML (no server render time)
- CSS tree-shaking (minimal CSS)
- Image optimization (multiple formats, lazy loading)
- Zero JS by default
- Critical CSS inlined

---

## Related Documentation

- **[COMPONENTS.md](./COMPONENTS.md)** — Component reference and prop documentation
- **[CONTENT.md](./CONTENT.md)** — Content management and schema details
- **[i18n.md](./i18n.md)** — Internationalization guide
- **[GSAP.md](./GSAP.md)** — Animation implementation details
- **[THEMING.md](./THEMING.md)** — Theme system and CSS variables
- **[SEO.md](./SEO.md)** — Search engine optimization
- **[CONFIG.md](./CONFIG.md)** — Configuration files reference
