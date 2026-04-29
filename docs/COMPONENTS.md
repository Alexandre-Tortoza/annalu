# Component Documentation

## Overview

Components are modular, reusable UI building blocks. Each component has a single responsibility and clear prop interfaces.

All components are Astro components (`.astro` files) with TypeScript prop validation.

---

## Layout Components

These components wrap page content and provide structure.

### BaseLayout

**File:** `src/layouts/BaseLayout.astro`

The top-level wrapper for every page. Provides HTML shell, header, footer, and GSAP initialization.

**Props:**
```ts
interface Props {
  seo: {
    title: string
    description: string
    image?: string
    canonical: string
    jsonLd?: object
  }
  lang: 'pt' | 'en'
  alternateUrl: string
}
```

**Features:**
- HTML document structure with proper meta tags
- Blocking FWOT (Flash of Wrong Theme) prevention script
- Global `<Header>` and `<Footer>`
- `<slot />` for page content
- GSAP ScrollTrigger registration with `prefers-reduced-motion` guard
- Imports global CSS

**Usage:**
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro'

const seo = {
  title: 'My Page',
  description: 'Short description',
  canonical: 'https://annalu.art/page'
}
const lang = 'pt'
const alternateUrl = '/en/page'
---

<BaseLayout seo={seo} lang={lang} alternateUrl={alternateUrl}>
  <h1>Page content goes here</h1>
</BaseLayout>
```

**What it renders:**
- Full HTML document with proper lang attribute
- Favicon links
- SEO meta tags via `<SEO>` component
- `<Header>`
- `<main><slot /></main>`
- `<Footer>`
- GSAP setup script

---

### ArtworkLayout

**File:** `src/layouts/ArtworkLayout.astro`

Extends `BaseLayout` for artwork detail pages. Provides structure specific to displaying a single artwork.

**Props:**
```ts
interface Props {
  artwork: CollectionEntry<'artworks'>
  lang: 'pt' | 'en'
  previous?: {
    id: string
    title: string
    titlePt: string
  }
  next?: {
    id: string
    title: string
    titlePt: string
  }
}
```

**Features:**
- Constructs `seo` object from artwork data
- Full-width cover image
- Artwork title, year, technique, dimensions as metadata
- `<slot />` for Markdown body content
- Previous/Next navigation
- Inherits all BaseLayout features

**Usage:**
```astro
---
import { render } from 'astro:content'
import ArtworkLayout from '../layouts/ArtworkLayout.astro'

export async function getStaticPaths() {
  const artworks = await getCollection('artworks')
  return artworks.map(artwork => ({
    params: { slug: artwork.id },
    props: { artwork }
  }))
}

const { artwork } = Astro.props
const { Content } = await render(artwork)
const previous = ... // compute
const next = ...    // compute
---

<ArtworkLayout artwork={artwork} lang="pt" previous={previous} next={next}>
  <Content />
</ArtworkLayout>
```

**What it renders:**
- Hero image (full-width, eager loading for LCP)
- Artwork metadata
- Body content from Markdown
- Previous/Next navigation
- BaseLayout wrapping (header, footer, etc.)

---

## UI Components

These are reusable, self-contained UI elements.

### SEO

**File:** `src/components/SEO.astro`

Renders all head meta tags for SEO. No HTML output — only head elements.

**Props:**
```ts
interface Props {
  title: string
  description: string
  image?: string          // Absolute URL to OG image
  canonical: string       // Absolute URL
  jsonLd?: object         // Optional VisualArtwork schema
  lang: 'pt' | 'en'
}
```

**Features:**
- `<title>` with site name suffix
- Meta description
- Open Graph tags (og:title, og:image, og:url, etc.)
- Twitter Card tags (twitter:card, twitter:title, etc.)
- Canonical URL
- hreflang alternates (both PT and EN)
- JSON-LD schema if provided
- Proper character encoding

**Usage:**
```astro
---
import SEO from '../components/SEO.astro'

const seo = {
  title: 'Artwork Title',
  description: 'Short description under 160 chars',
  image: 'https://annalu.art/images/artwork.jpg',
  canonical: 'https://annalu.art/artwork/slug',
  lang: 'pt'
}
---

<head>
  <SEO {...seo} jsonLd={visualArtworkSchema} />
</head>
```

**Output (example):**
```html
<title>Artwork Title | AnnaLu</title>
<meta name="description" content="Short description...">
<meta property="og:title" content="Artwork Title">
<meta property="og:image" content="https://...">
<link rel="canonical" href="https://annalu.art/artwork/slug">
<link rel="alternate" hreflang="pt" href="https://annalu.art/artwork/slug">
<link rel="alternate" hreflang="en" href="https://annalu.art/en/art/slug">
<script type="application/ld+json">{...}</script>
```

---

### Header

**File:** `src/components/Header.astro`

Navigation bar with logo, language picker, and theme toggle.

**Props:**
```ts
interface Props {
  lang: 'pt' | 'en'
  currentPath: string     // Current URL pathname
  alternateUrl: string    // URL of this page in other language
}
```

**Features:**
- Logo/"AnnaLu" link to home
- Navigation links (Home, Gallery)
- Active state detection based on `currentPath`
- `<ThemeToggle>` button
- `<LanguagePicker>` for language switching
- Mobile responsive hamburger menu (using `<details>`)
- Sticky positioning

**Usage:**
```astro
---
import Header from '../components/Header.astro'

const currentPath = Astro.url.pathname
const lang = 'pt'
const alternateUrl = '/en/galeria'
---

<Header lang={lang} currentPath={currentPath} alternateUrl={alternateUrl} />
```

**Output:**
```html
<header class="sticky top-0 z-50">
  <a href="/" class="logo">AnnaLu</a>
  <nav>
    <a href="/" class="active">Início</a>
    <a href="/galeria">Galeria</a>
  </nav>
  <ThemeToggle lang="pt" />
  <LanguagePicker lang="pt" alternateUrl="/en/galeria" />
</header>
```

---

### Footer

**File:** `src/components/Footer.astro`

Footer with social links and copyright.

**Props:**
```ts
interface Props {
  lang: 'pt' | 'en'
}
```

**Features:**
- Social media links (placeholders for Phase 1)
- Copyright text from translations
- Simple flex layout
- Responsive stack on mobile

**Usage:**
```astro
---
import Footer from '../components/Footer.astro'
---

<Footer lang="pt" />
```

**Output:**
```html
<footer>
  <div>
    <a href="#">Instagram</a>
    <a href="#">Behance</a>
  </div>
  <p>© 2024 AnnaLu. Todos os direitos reservados.</p>
</footer>
```

---

### ThemeToggle

**File:** `src/components/ThemeToggle.astro`

Theme switcher button (light/dark mode).

**Props:**
```ts
interface Props {
  lang: 'pt' | 'en'
}
```

**Features:**
- Sun/Moon SVG icons
- Toggles `.dark` class on `<html>`
- Persists to `localStorage`
- Small inline script
- No external dependencies
- Respects system preference on first load

**Usage:**
```astro
---
import ThemeToggle from '../components/ThemeToggle.astro'
---

<ThemeToggle lang="pt" />
```

**Output:**
```html
<button aria-label="Alternar tema">
  <svg><!-- sun icon --></svg>
  <svg><!-- moon icon, hidden in light mode --></svg>
</button>
<script>
  // Theme toggle logic
</script>
```

---

### LanguagePicker

**File:** `src/components/LanguagePicker.astro`

Language switcher with links to PT and EN versions.

**Props:**
```ts
interface Props {
  lang: 'pt' | 'en'
  alternateUrl: string    // URL of this page in other language
}
```

**Features:**
- PT and EN language links (or flag icons)
- Current language marked with `aria-current="true"`
- Visual active state
- No JavaScript required
- Responsive

**Usage:**
```astro
---
import LanguagePicker from '../components/LanguagePicker.astro'

const lang = 'pt'
const alternateUrl = '/en/artwork/masterpiece'
---

<LanguagePicker lang={lang} alternateUrl={alternateUrl} />
```

**Output:**
```html
<nav aria-label="Select language">
  <a href="#" aria-current="page" class="active">PT</a>
  <a href="/en/artwork/masterpiece">EN</a>
</nav>
```

---

## Domain Components

These are specific to the art gallery domain.

### ArtworkCard

**File:** `src/components/ArtworkCard.astro`

Card displaying artwork summary (used in "latest works" section on landing page).

**Props:**
```ts
interface Props {
  artwork: CollectionEntry<'artworks'>
  lang: 'pt' | 'en'
}
```

**Features:**
- Cover image via Astro `<Image>`
- Title (bilingual via `lang`)
- Short description (truncated or full)
- Tag list
- Link to detail page
- `data-animate="card"` for GSAP ScrollTrigger
- No client-side JavaScript

**Usage:**
```astro
---
import ArtworkCard from '../components/ArtworkCard.astro'
import { getCollection } from 'astro:content'

const artworks = await getCollection('artworks')
const latest = artworks
  .sort((a, b) => b.data.publishedAt - a.data.publishedAt)
  .slice(0, 3)
const lang = 'pt'
---

{latest.map(artwork => (
  <ArtworkCard artwork={artwork} lang={lang} />
))}
```

**Output:**
```html
<article data-animate="card">
  <a href="/artwork/slug">
    <img src="/images/cover.jpg" alt="..." width="600" height="400">
    <h3>Artwork Title</h3>
    <p>Short description...</p>
    <div class="tags">
      <span>#abstract</span>
      <span>#acrylic</span>
    </div>
  </a>
</article>
```

---

### MosaicRow

**File:** `src/components/MosaicRow.astro`

Gallery grid row displaying a single artwork using its mosaic layout specification.

**Props:**
```ts
interface Props {
  artwork: CollectionEntry<'artworks'>
  lang: 'pt' | 'en'
}
```

**Features:**
- 12-column CSS grid
- Position images based on `artwork.data.mosaic[]`
- Responsive image sizing
- Title overlay at bottom
- Link to detail page
- `data-animate="mosaic-row"` for GSAP
- Semantic `<article>` wrapped in `<a>`

**Usage:**
```astro
---
import MosaicRow from '../components/MosaicRow.astro'
import { getCollection } from 'astro:content'

const artworks = await getCollection('artworks')
const lang = 'pt'
---

{artworks.map(artwork => (
  <MosaicRow artwork={artwork} lang={lang} />
))}
```

**Output:**
```html
<a href="/artwork/slug">
  <article class="grid" style="grid-template-columns: repeat(12, 1fr)">
    <div style="grid-column: 1 / span 8">
      <img src="/images/art-1.jpg" alt="..." width="800" height="600">
    </div>
    <div style="grid-column: 9 / span 4">
      <img src="/images/art-2.jpg" alt="..." width="400" height="600">
    </div>
    <div class="overlay">
      <h3>Artwork Title</h3>
    </div>
  </article>
</a>
```

---

## Component Props Patterns

### All Components Use TypeScript

Every component explicitly types its props:

```astro
---
interface Props {
  title: string
  count: number
  optional?: string
}

const { title, count, optional = 'default' } = Astro.props
---
```

### Props Are Extracted in Frontmatter

```astro
---
// ✅ Good
const { artwork, lang } = Astro.props
const title = artwork.data.title
---

<h1>{title}</h1>
```

```astro
---
// ❌ Avoid passing full object to template
// const artwork = Astro.props.artwork
---

<h1>{artwork.data.title}</h1>
```

### Bilingual Content Via `lang` Prop

All components that display content accept a `lang` prop to determine which language to render:

```astro
---
interface Props {
  artwork: CollectionEntry<'artworks'>
  lang: 'pt' | 'en'
}

const { artwork, lang } = Astro.props
const title = lang === 'pt' ? artwork.data.titlePt : artwork.data.title
---

<h2>{title}</h2>
```

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
