# Component Documentation

## Overview

Components are modular, reusable UI building blocks. Each component has a single responsibility and clear prop interfaces.

All components are Astro components (`.astro` files) with TypeScript prop validation.

---

## Quick Reference

| Component | Type | Purpose | Location |
|-----------|------|---------|----------|
| **BaseLayout** | Layout | HTML shell, header, footer, GSAP init for all pages | `src/layouts/BaseLayout.astro` |
| **ArtworkLayout** | Layout | Extends BaseLayout for artwork detail pages | `src/layouts/ArtworkLayout.astro` |
| **SEO** | Utility | Renders all head meta tags (OG, Twitter, hreflang, JSON-LD) | `src/components/SEO.astro` |
| **Header** | Navigation | Logo, nav links, theme toggle, language picker | `src/components/Header.astro` |
| **Footer** | Navigation | Social links, copyright | `src/components/Footer.astro` |
| **ThemeToggle** | UI | Light/dark mode switcher with localStorage persistence | `src/components/ThemeToggle.astro` |
| **LanguagePicker** | UI | PT/EN language switcher | `src/components/LanguagePicker.astro` |
| **ArtworkCard** | Domain | Artwork summary card with image, title, tags (landing page) | `src/components/ArtworkCard.astro` |
| **MosaicRow** | Domain | Gallery grid row with custom mosaic layout | `src/components/MosaicRow.astro` |
| **Hero** | Domain | Full-screen hero with animated SVG ocean waves, parallax | `src/components/Hero.astro` |
| **EditorialStack** | Domain | Scroll-triggered image pile with blockquote | `src/components/EditorialStack.astro` |

---

## Component Hierarchy

```
BaseLayout
├── <head>
│   ├── SEO
│   ├── Global CSS
│   └── FWOT prevention script
├── <Header>
│   ├── Logo link
│   ├── <nav> with Home/Gallery links
│   ├── ThemeToggle
│   └── LanguagePicker
├── <main>
│   └── <slot /> (page content)
└── <Footer>
    ├── Social links
    └── Copyright

ArtworkLayout (extends BaseLayout)
├── (all BaseLayout features)
├── Hero (cover image)
├── Artwork metadata
├── <slot /> (Markdown body)
└── Previous/Next navigation

Landing Page (uses BaseLayout)
├── Hero (animated ocean waves)
├── EditorialStack (latest 3 artworks)
└── ArtworkCard[] (recent artworks)

Gallery Page (uses BaseLayout)
└── MosaicRow[] (all artworks in grid)
```

---

## Layout Components

These components wrap page content and provide structure.

### BaseLayout

**File:** `src/layouts/BaseLayout.astro`

The top-level wrapper for every page. Provides HTML shell, header, footer, and GSAP initialization.

**Props Table:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `seo` | object | ✅ | — | SEO metadata object (passed to `<SEO>`) |
| `seo.title` | string | ✅ | — | Page title (displayed in browser tab and OG tags) |
| `seo.description` | string | ✅ | — | Meta description (used by search engines and social media) |
| `seo.image` | string | ❌ | — | Absolute URL to OG image (falls back to default) |
| `seo.canonical` | string | ✅ | — | Absolute canonical URL for this page |
| `seo.jsonLd` | object | ❌ | — | JSON-LD schema (e.g., VisualArtwork for artwork pages) |
| `lang` | `'pt' \| 'en'` | ✅ | — | Current page language |
| `alternateUrl` | string | ✅ | — | URL of this page in the other language |

**Related Components:**
- **Children:** `<SEO>`, `<Header>`, `<Footer>`
- **Used in:** Every page (layouts)
- **Links to:** [THEMING.md](./THEMING.md) (theme toggle), [GSAP.md](./GSAP.md) (animations)

**Features:**
- HTML document structure with proper meta tags
- Blocking FWOT (Flash of Wrong Theme) prevention script
- Global `<Header>` and `<Footer>`
- `<slot />` for page content
- GSAP ScrollTrigger registration with `prefers-reduced-motion` guard
- Imports global CSS

**Usage Example:**
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro'
import { getAlternateUrl } from '../i18n'

const seo = {
  title: 'Gallery',
  description: 'Explore our art collection',
  canonical: 'https://annalu.art/galeria',
  image: 'https://annalu.art/og-gallery.jpg'
}
const lang = 'pt'
const alternateUrl = getAlternateUrl('/galeria', lang)
---

<BaseLayout seo={seo} lang={lang} alternateUrl={alternateUrl}>
  <h1>Gallery</h1>
  <!-- Page content goes here -->
</BaseLayout>
```

**What it renders:**
- Full HTML document with proper lang attribute
- Favicon and preload links
- SEO meta tags via `<SEO>` component
- `<Header>` component
- `<main><slot /></main>`
- `<Footer>` component
- GSAP and theme initialization scripts

---

### ArtworkLayout

**File:** `src/layouts/ArtworkLayout.astro`

Extends `BaseLayout` for artwork detail pages. Provides structure specific to displaying a single artwork.

**Props Table:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `artwork` | `CollectionEntry<'artworks'>` | ✅ | The artwork data (from collection + frontmatter) |
| `lang` | `'pt' \| 'en'` | ✅ | Current page language |
| `previous` | object | ❌ | Previous artwork navigation data |
| `previous.id` | string | ✅ | Previous artwork slug/ID |
| `previous.title` | string | ✅ | Previous artwork title (English) |
| `previous.titlePt` | string | ✅ | Previous artwork title (Portuguese) |
| `next` | object | ❌ | Next artwork navigation data |
| `next.id` | string | ✅ | Next artwork slug/ID |
| `next.title` | string | ✅ | Next artwork title (English) |
| `next.titlePt` | string | ✅ | Next artwork title (Portuguese) |

**Related Components:**
- **Parent:** Extends `BaseLayout`
- **Children:** Inherits Header, Footer, SEO from BaseLayout
- **Used in:** Artwork detail pages (`[slug].astro`)
- **Links to:** [CONTENT.md](./CONTENT.md) (artwork schema), [SEO.md](./SEO.md) (metadata)

**Features:**
- Constructs `seo` object from artwork data (title, description, cover image)
- Full-width cover image with eager loading (LCP optimization)
- Artwork title, year, technique, dimensions as structured metadata
- `<slot />` for Markdown body content
- Previous/Next artwork navigation (pagination)
- Inherits all BaseLayout features (header, footer, GSAP)

**Usage Example:**
```astro
---
import { render } from 'astro:content'
import ArtworkLayout from '../layouts/ArtworkLayout.astro'
import { getCollection } from 'astro:content'

export async function getStaticPaths() {
  const artworks = await getCollection('artworks')
  return artworks.map((artwork, index) => ({
    params: { slug: artwork.id },
    props: {
      artwork,
      previous: index > 0 ? {
        id: artworks[index - 1].id,
        title: artworks[index - 1].data.title,
        titlePt: artworks[index - 1].data.titlePt
      } : undefined,
      next: index < artworks.length - 1 ? {
        id: artworks[index + 1].id,
        title: artworks[index + 1].data.title,
        titlePt: artworks[index + 1].data.titlePt
      } : undefined
    }
  }))
}

const { artwork, lang = 'pt', previous, next } = Astro.props
const { Content } = await render(artwork)
---

<ArtworkLayout artwork={artwork} lang={lang} previous={previous} next={next}>
  <Content />
</ArtworkLayout>
```

**What it renders:**
- SEO meta tags (title, description, OG image from cover)
- Hero image (full-width, eager loading for LCP)
- Artwork metadata (year, technique, dimensions)
- Body content from Markdown (description, process, inspiration)
- Previous/Next navigation links
- BaseLayout wrapping (header, footer, GSAP initialization)

---

## UI Components

These are reusable, self-contained UI elements.

### SEO

**File:** `src/components/SEO.astro`

Renders all head meta tags for SEO and social sharing. No HTML output — only `<head>` elements.

**Props Table:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | string | ✅ | Page/artwork title (site suffix added automatically) |
| `description` | string | ✅ | Meta description (max 160 chars, used by search engines) |
| `image` | string | ❌ | Absolute URL to OG image (used by Twitter, Facebook) |
| `canonical` | string | ✅ | Absolute canonical URL of this page |
| `jsonLd` | object | ❌ | JSON-LD structured data (e.g., VisualArtwork schema) |
| `lang` | `'pt' \| 'en'` | ✅ | Current page language (for hreflang tags) |

**Related Components:**
- **Used in:** BaseLayout `<head>`
- **Related to:** ArtworkLayout (constructs SEO from artwork data)
- **Links to:** [SEO.md](./SEO.md) (detailed SEO strategy)

**Features:**
- `<title>` with site name suffix ("Page | AnnaLu")
- Meta description for search engines
- Open Graph tags (og:title, og:description, og:image, og:url, og:type)
- Twitter Card tags (twitter:card, twitter:title, twitter:description, twitter:image)
- Canonical URL (prevents duplicate content issues)
- hreflang alternates for both PT and EN versions
- JSON-LD schema (e.g., VisualArtwork for artwork pages)
- Character encoding and viewport meta tags

**Usage Example:**
```astro
---
import SEO from '../components/SEO.astro'

const seo = {
  title: 'Ocean Dreams',
  description: 'Abstract acrylic painting exploring the interplay of water and light.',
  image: 'https://annalu.art/images/ocean-dreams.jpg',
  canonical: 'https://annalu.art/artwork/ocean-dreams',
  lang: 'pt',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'VisualArtwork',
    name: 'Ocean Dreams',
    artist: { '@type': 'Person', name: 'AnnaLu' },
    image: 'https://annalu.art/images/ocean-dreams.jpg'
  }
}
---

<head>
  <SEO {...seo} />
</head>
```

**Output (example):**
```html
<title>Ocean Dreams | AnnaLu</title>
<meta name="description" content="Abstract acrylic painting...">
<meta property="og:title" content="Ocean Dreams">
<meta property="og:description" content="Abstract acrylic painting...">
<meta property="og:image" content="https://annalu.art/images/ocean-dreams.jpg">
<meta property="og:url" content="https://annalu.art/artwork/ocean-dreams">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Ocean Dreams">
<meta name="twitter:image" content="https://annalu.art/images/ocean-dreams.jpg">
<link rel="canonical" href="https://annalu.art/artwork/ocean-dreams">
<link rel="alternate" hreflang="pt" href="https://annalu.art/artwork/ocean-dreams">
<link rel="alternate" hreflang="en" href="https://annalu.art/en/art/ocean-dreams">
<script type="application/ld+json">{...}</script>
```

---

### Header

**File:** `src/components/Header.astro`

Navigation bar with logo, language picker, and theme toggle. Sticky positioning with active link detection.

**Props Table:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `lang` | `'pt' \| 'en'` | ✅ | Current page language (for nav link labels) |
| `currentPath` | string | ✅ | Current URL pathname (used to mark active links) |
| `alternateUrl` | string | ✅ | URL of this page in the other language |

**Related Components:**
- **Child components:** ThemeToggle, LanguagePicker
- **Used in:** BaseLayout
- **Links to:** [THEMING.md](./THEMING.md) (theme configuration), [i18n.md](./i18n.md) (navigation links)

**Features:**
- Sticky header (stays at top while scrolling)
- Logo/"AnnaLu" link to home
- Navigation links (Home, Gallery) with active state detection
- `<ThemeToggle>` button (dark/light mode)
- `<LanguagePicker>` for language switching
- Mobile responsive hamburger menu using `<details>` (no JavaScript)
- High z-index (z-50) to stay above content

**Usage Example:**
```astro
---
import Header from '../components/Header.astro'
import { getLangFromUrl } from '../i18n'

const lang = getLangFromUrl(Astro.url)
const currentPath = Astro.url.pathname
const alternateUrl = '/en/galeria'  // or computed
---

<Header lang={lang} currentPath={currentPath} alternateUrl={alternateUrl} />
```

**Output:**
```html
<header class="sticky top-0 z-50">
  <a href="/" class="logo">AnnaLu</a>
  <nav>
    <a href="/" aria-current="page" class="active">Início</a>
    <a href="/galeria">Galeria</a>
  </nav>
  <div class="controls">
    <ThemeToggle lang="pt" />
    <LanguagePicker lang="pt" alternateUrl="/en/gallery" />
  </div>
  <!-- Mobile menu uses <details> for native toggle -->
</header>
```

---

### Footer

**File:** `src/components/Footer.astro`

Footer with social media links and copyright information.

**Props Table:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `lang` | `'pt' \| 'en'` | ✅ | Current page language (for copyright text) |

**Related Components:**
- **Used in:** BaseLayout
- **Links to:** [i18n.md](./i18n.md) (translations)

**Features:**
- Social media links (Instagram, Behance placeholders for Phase 1)
- Copyright text from translations (bilingual)
- Simple flex layout with responsive stacking on mobile
- Semantic footer HTML structure

**Usage Example:**
```astro
---
import Footer from '../components/Footer.astro'
import { getLangFromUrl } from '../i18n'

const lang = getLangFromUrl(Astro.url)
---

<Footer lang={lang} />
```

**Output:**
```html
<footer class="flex justify-between items-center py-6">
  <div class="social-links">
    <a href="#" aria-label="Instagram">Instagram</a>
    <a href="#" aria-label="Behance">Behance</a>
  </div>
  <p class="copyright">© 2024 AnnaLu. Todos os direitos reservados.</p>
</footer>
```

---

### ThemeToggle

**File:** `src/components/ThemeToggle.astro`

Theme switcher button for light/dark mode toggle. No external dependencies.

**Props Table:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `lang` | `'pt' \| 'en'` | ✅ | Language for aria-label text |

**Related Components:**
- **Used in:** Header
- **Links to:** [THEMING.md](./THEMING.md) (theme system details)

**Features:**
- Sun and Moon SVG icons (only one visible at a time)
- Toggles `.dark` class on `<html>` element
- Persists user preference to `localStorage` (survives page reloads)
- Small inline script (no external JS framework)
- Respects system preference (prefers-color-scheme) on first visit
- Accessible with ARIA labels

**Usage Example:**
```astro
---
import ThemeToggle from '../components/ThemeToggle.astro'
---

<ThemeToggle lang="pt" />
```

**Output:**
```html
<button
  class="theme-toggle"
  aria-label="Alternar tema"
  aria-pressed="false"
>
  <svg class="sun-icon"><!-- sun SVG --></svg>
  <svg class="moon-icon hidden"><!-- moon SVG --></svg>
</button>
<script is:inline>
  // Theme toggle logic using localStorage
</script>
```

**How it works:**
1. On page load, reads `localStorage.theme` or system preference
2. User clicks button → toggles `.dark` on `<html>`
3. CSS reacts with `@media (prefers-color-scheme: dark)` and `.dark` selector
4. Preference saved to `localStorage` for future visits

---

### LanguagePicker

**File:** `src/components/LanguagePicker.astro`

Language switcher with links to Portuguese and English versions of the current page.

**Props Table:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `lang` | `'pt' \| 'en'` | ✅ | Current page language (used to mark active link) |
| `alternateUrl` | string | ✅ | URL of this page in the other language |

**Related Components:**
- **Used in:** Header
- **Links to:** [i18n.md](./i18n.md) (internationalization details)

**Features:**
- PT and EN language links
- Current language marked with `aria-current="page"` (accessibility)
- Visual active state styling
- No JavaScript required (pure HTML)
- Responsive inline layout
- Keyboard accessible (all interactive elements)

**Usage Example:**
```astro
---
import LanguagePicker from '../components/LanguagePicker.astro'

const lang = 'pt'
const alternateUrl = '/en/artwork/ocean-dreams'
---

<LanguagePicker lang={lang} alternateUrl={alternateUrl} />
```

**Output:**
```html
<nav class="language-picker" aria-label="Selecione idioma">
  <a href="#" aria-current="page" class="active">PT</a>
  <a href="/en/artwork/ocean-dreams">EN</a>
</nav>
```

**How it works:**
- PT link points to current page (`href="#"` or same URL)
- EN link points to `alternateUrl` prop
- Only one link is marked with `aria-current="page"` (the active language)
- Styling shows active link differently (underline, bold, etc.)

---

## Domain Components

These are specific to the art gallery domain.

### ArtworkCard

**File:** `src/components/ArtworkCard.astro`

Card displaying artwork summary (used in "latest works" section on landing page). Shows cover image, title, description, and tags.

**Props Table:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `artwork` | `CollectionEntry<'artworks'>` | ✅ | Artwork data from content collection |
| `lang` | `'pt' \| 'en'` | ✅ | Language for title/description display |

**Related Components:**
- **Used in:** Landing page (displays latest 3 featured artworks)
- **Sibling:** MosaicRow (used in gallery, shows more detail)
- **Links to:** [CONTENT.md](./CONTENT.md) (artwork schema), [GSAP.md](./GSAP.md) (animations)

**Features:**
- Responsive cover image via Astro `<Image>` component
- Title in selected language (bilingual)
- Short description (truncated)
- Tag list with hashtag styling
- Link to artwork detail page
- `data-animate="card"` attribute for GSAP ScrollTrigger animations
- Fully static — no client-side JavaScript
- Semantic `<article>` structure

**Usage Example:**
```astro
---
import ArtworkCard from '../components/ArtworkCard.astro'
import { getCollection } from 'astro:content'
import { sortByDate } from '../lib/artworks'

const artworks = await getCollection('artworks')
const featured = artworks
  .filter(art => art.data.featured)
  .sort(sortByDate)
  .slice(0, 3)

const lang = 'pt'
---

<section class="latest-works">
  {featured.map(artwork => (
    <ArtworkCard artwork={artwork} lang={lang} />
  ))}
</section>
```

**Output:**
```html
<article class="artwork-card" data-animate="card">
  <a href="/artwork/ocean-dreams">
    <img
      src="/images/ocean-dreams-cover.jpg"
      alt="Abstract acrylic painting..."
      width="600"
      height="400"
      loading="lazy"
    />
    <div class="content">
      <h3>Ocean Dreams</h3>
      <p class="description">Abstract acrylic composition...</p>
      <div class="tags">
        <span>#abstract</span>
        <span>#acrylic</span>
        <span>#color-study</span>
      </div>
    </div>
  </a>
</article>
```

---

### MosaicRow

**File:** `src/components/MosaicRow.astro`

Gallery grid row displaying a single artwork using its custom mosaic layout specification. Creates responsive 12-column grid layouts.

**Props Table:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `artwork` | `CollectionEntry<'artworks'>` | ✅ | Artwork data (must include `mosaic` field) |
| `lang` | `'pt' \| 'en'` | ✅ | Language for title overlay display |

**Related Components:**
- **Used in:** Gallery page (displays all artworks)
- **Sibling:** ArtworkCard (used on landing, simpler layout)
- **Links to:** [CONTENT.md](./CONTENT.md) (mosaic field specification), [GSAP.md](./GSAP.md) (animations)

**Features:**
- 12-column CSS Grid layout
- Positions images based on `artwork.data.mosaic[]` array
- Each mosaic entry specifies: `imageIndex`, `colStart`, `colSpan`, `rowSpan`
- Responsive image sizing using Astro `<Image>`
- Title overlay at bottom of grid
- Link to artwork detail page
- `data-animate="mosaic-row"` for GSAP ScrollTrigger animations
- Semantic `<a><article>` structure

**Usage Example:**
```astro
---
import MosaicRow from '../components/MosaicRow.astro'
import { getCollection } from 'astro:content'
import { sortByDate } from '../lib/artworks'

const artworks = await getCollection('artworks')
const sorted = artworks.sort(sortByDate)
const lang = 'pt'
---

<div class="gallery">
  {sorted.map(artwork => (
    <MosaicRow artwork={artwork} lang={lang} />
  ))}
</div>
```

**Output (example L-shaped layout):**
```html
<a href="/artwork/ocean-dreams">
  <article class="mosaic-row" data-animate="mosaic-row" style="display: grid; grid-template-columns: repeat(12, 1fr)">
    <!-- Large image on left (cols 1-8, rows 1-2) -->
    <div style="grid-column: 1 / span 8; grid-row: 1 / span 2">
      <img src="/images/ocean-1.jpg" alt="Full view..." />
    </div>
    <!-- Small image top-right (cols 9-12, row 1) -->
    <div style="grid-column: 9 / span 4; grid-row: 1">
      <img src="/images/ocean-2.jpg" alt="Detail..." />
    </div>
    <!-- Small image bottom-right (cols 9-12, row 2) -->
    <div style="grid-column: 9 / span 4; grid-row: 2">
      <img src="/images/ocean-3.jpg" alt="Close-up..." />
    </div>
    <!-- Title overlay -->
    <div class="overlay">
      <h2>Ocean Dreams</h2>
    </div>
  </article>
</a>
```

**Mosaic Layout Examples:** See [CONTENT.md — Mosaic Grid Layout](./CONTENT.md#mosaic-grid-layout)

---

## Component Patterns & Best Practices

### Pattern: Bilingual Content Display

All content components accept a `lang` prop to determine which language to render. This is the standard pattern across the codebase:

```astro
---
interface Props {
  artwork: CollectionEntry<'artworks'>
  lang: 'pt' | 'en'
}

const { artwork, lang } = Astro.props
// Select bilingual field based on lang
const title = lang === 'pt' ? artwork.data.titlePt : artwork.data.title
const description = lang === 'pt' ? artwork.data.descriptionPt : artwork.data.description
---

<h2>{title}</h2>
<p>{description}</p>
```

**Never** pass the full object to the template or use ternaries inline. Extract in frontmatter first.

---

### Pattern: Data-Animate Attributes

Components that need GSAP animations mark themselves with `data-animate` attributes. The actual animation logic lives in `BaseLayout.astro`:

```astro
<!-- Component template -->
<article data-animate="card">
  <!-- content -->
</article>

<!-- BaseLayout contains GSAP initialization -->
<script define:vars={{ HEADER_SCROLL_THRESHOLD, SPEED_MULTIPLIER }}>
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    // Animations for [data-animate="card"]
    gsap.utils.toArray('[data-animate="card"]').forEach(card => {
      gsap.to(card, {
        scrollTrigger: { trigger: card },
        // ... animation properties
      })
    })
  })
</script>
```

Current `data-animate` values:
- `hero` — landing page hero section
- `hero-ocean` — animated ocean waves
- `editorial-text` — editorial copy
- `editorial-stack` — image pile
- `card` — artwork cards
- `mosaic-row` — gallery mosaic rows
- `cover` — artwork cover images

---

### Pattern: Props Extraction

Always extract props in the frontmatter, with defaults if needed:

```astro
---
// ✅ Good: Extract and set defaults
interface Props {
  title: string
  count: number
  optional?: string
}

const { title, count, optional = 'default' } = Astro.props
---

<h1>{title}</h1>
<p>Count: {count}</p>
<span>{optional}</span>
```

```astro
---
// ❌ Avoid: Using Astro.props directly in template
const props = Astro.props
---

<h1>{props.title}</h1>
```

---

### Pattern: Image Handling

Use Astro's `<Image>` component for local images and optimize loading:

```astro
---
import { Image } from 'astro:assets'
import localImage from '../images/hero.png'

interface Props {
  src: string           // Path or remote URL
  alt: string          // Always required
  width: number
  height: number
  loading?: 'eager' | 'lazy'  // Default: 'lazy'
}

const { src, alt, width, height, loading = 'lazy' } = Astro.props
---

<!-- Local image -->
<Image src={localImage} alt="..." width={800} height={600} />

<!-- Remote or public/ image -->
<img src={src} alt={alt} width={width} height={height} loading={loading} />
```

**Best practices:**
- Always provide `alt` text (accessibility + SEO)
- Use explicit `width` and `height` (prevents Cumulative Layout Shift)
- Eager load above-the-fold images (hero, cover)
- Lazy load below-the-fold images (cards, gallery)

---

### Pattern: Conditional Rendering

Use `&&` operator for simple conditions, `{...}` ternary for complex:

```astro
---
const { featured, optional } = Astro.props
---

<!-- Simple condition -->
{featured && <div class="badge">Featured</div>}

<!-- Complex condition -->
<div class={optional ? 'style-a' : 'style-b'}>
  Content
</div>
```

---

### Pattern: Loops and Keys

Always use `.map()` with semantic keys (not index):

```astro
---
const { artworks } = Astro.props
---

{artworks.map(artwork => (
  <ArtworkCard key={artwork.id} artwork={artwork} lang="pt" />
))}
```

---

## Related Documentation

- **[THEMING.md](./THEMING.md)** — Styling, CSS variables, dark mode
- **[GSAP.md](./GSAP.md)** — Animation patterns and ScrollTrigger setup
- **[CONTENT.md](./CONTENT.md)** — Artwork schema, frontmatter structure
- **[SEO.md](./SEO.md)** — SEO strategy, metadata, structured data
- **[i18n.md](./i18n.md)** — Internationalization, translation helpers

---

## Component Reuse Examples

### Using Multiple Components on One Page

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro'
import Header from '../components/Header.astro'
import Footer from '../components/Footer.astro'
import ArtworkCard from '../components/ArtworkCard.astro'

// Note: Header and Footer are already in BaseLayout,
// but this shows how to compose components
---

<BaseLayout seo={...} lang="pt" alternateUrl="/en/">
  <!-- Content -->
</BaseLayout>
```

### Passing Nested Components

```astro
---
// This is automatic — no need to "pass" components
// Each component imports what it needs
---

<ArtworkCard artwork={art} lang="pt" />
<!-- Inside ArtworkCard, the <Image> component is imported locally -->
```

---

## Accessibility (a11y) in Components

Every component must be accessible:

### Alt Text
```astro
<img src="..." alt="Descriptive text" />
```

### ARIA Labels
```astro
<button aria-label="Alternar tema">
  <svg>...</svg>
</button>
```

### Semantic HTML
```astro
<header>...</header>
<nav>...</nav>
<main>...</main>
<article>...</article>
<footer>...</footer>
```

### Color Contrast
Use CSS variables that meet WCAG AA standards (4.5:1 for text, 3:1 for UI).

### Keyboard Navigation
All interactive elements (buttons, links, form inputs) must be keyboard accessible.

---

## Common Patterns

### Conditional Rendering

```astro
---
const { featured } = Astro.props
---

{featured && <div class="badge">Featured</div>}
```

### Looping Over Arrays

```astro
---
const { items } = Astro.props
---

{items.map(item => (
  <div key={item.id}>{item.name}</div>
))}
```

### Using Astro's `<Image>` Component

```astro
---
import { Image } from 'astro:assets'
import localImage from '../images/hero.png'

const { src, alt } = Astro.props
---

<!-- Local image -->
<Image src={localImage} alt="..." width={800} height={600} />

<!-- Remote image (or path from public/) -->
<Image src={src} alt={alt} width={800} height={600} />
```

### Styling with Tailwind

```astro
---
const { variant } = Astro.props
---

<div class={`
  rounded-lg p-4
  ${variant === 'featured' ? 'bg-blue-500 text-white' : 'bg-gray-100'}
`}>
  Content
</div>
```

---

## Performance Tips

- Lazy load images: `<img loading="lazy">`
- Eager load above-fold images: `<img loading="eager">`
- Explicit `width` and `height` on images (prevents CLS)
- Use Astro's `<Image>` component for optimization
- Avoid inline styles; use Tailwind utilities
- Keep components small and focused

---

## Testing Components Locally

```bash
pnpm dev
# Edit component
# Save
# See changes instantly in browser (HMR)
```

No special test framework needed for Phase 1. Visual testing is sufficient.
