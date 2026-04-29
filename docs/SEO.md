# SEO Implementation Guide

## Overview

AnnaLu is built with SEO as a first-class feature. Every page is optimized for search engines through proper markup, structured data, and accessibility.

All SEO meta tags are generated dynamically based on page content and handled by the `SEO` component.

---

## Meta Tags

### Essential Tags

Every page includes:

```html
<!-- Title (unique per page) -->
<title>Page Title | AnnaLu</title>

<!-- Description (max 160 chars) -->
<meta name="description" content="Short, compelling description...">

<!-- Viewport (responsive) -->
<meta name="viewport" content="width=device-width, initial-scale=1">

<!-- Character encoding -->
<meta charset="utf-8">
```

### Open Graph Tags

For social media sharing (Facebook, LinkedIn, etc.):

```html
<meta property="og:title" content="Page Title">
<meta property="og:description" content="Description...">
<meta property="og:image" content="https://annalu.art/image.jpg">
<meta property="og:url" content="https://annalu.art/page">
<meta property="og:type" content="website">
<meta property="og:site_name" content="AnnaLu">
```

### Twitter Card Tags

For Twitter sharing:

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Page Title">
<meta name="twitter:description" content="Description...">
<meta name="twitter:image" content="https://annalu.art/image.jpg">
```

### Canonical URL

Prevents duplicate content issues:

```html
<link rel="canonical" href="https://annalu.art/page">
```

### hreflang Links

For multilingual sites (PT + EN):

```html
<link rel="alternate" hreflang="pt" href="https://annalu.art/artwork/slug">
<link rel="alternate" hreflang="en" href="https://annalu.art/en/art/slug">
<link rel="alternate" hreflang="x-default" href="https://annalu.art/artwork/slug">
```

---

## Structured Data (JSON-LD)

JSON-LD is added to each artwork detail page for rich search results.

### VisualArtwork Schema

```json
{
  "@context": "https://schema.org",
  "@type": "VisualArtwork",
  "name": "Artwork Title",
  "description": "Full description of the artwork",
  "image": "https://annalu.art/images/artwork.jpg",
  "dateCreated": "2024-01-15",
  "artMedium": "Acrylic on canvas",
  "width": {
    "@type": "Distance",
    "unitCode": "CMT",
    "value": "100"
  },
  "height": {
    "@type": "Distance",
    "unitCode": "CMT",
    "value": "80"
  },
  "creator": {
    "@type": "Person",
    "name": "AnnaLu"
  }
}
```

Google uses this to display artwork details in search results and Google Images.

### Product Schema (Phase 2)

When e-commerce is enabled, Product schema will be added:

```json
{
  "@type": "Product",
  "name": "Artwork Title",
  "price": "1500.00",
  "priceCurrency": "USD",
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "price": "1500.00",
    "priceCurrency": "USD"
  }
}
```

---

## Implementation

### SEO Component

All pages use the `SEO` component to render meta tags:

```astro
---
import SEO from '../components/SEO.astro'

const seo = {
  title: 'Artwork Title',
  description: 'Short description (max 160 chars)',
  image: 'https://annalu.art/images/artwork.jpg',
  canonical: 'https://annalu.art/artwork/slug',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'VisualArtwork',
    // ...
  },
  lang: 'pt'
}
---

<BaseLayout seo={seo} lang="pt" alternateUrl="/en/art/slug">
  <!-- Page content -->
</BaseLayout>
```

### Landing Page

```astro
---
import SEO from '../components/SEO.astro'
import BaseLayout from '../layouts/BaseLayout.astro'

const seo = {
  title: 'Art Gallery',
  description: 'Explore contemporary art by AnnaLu. Abstract paintings and sculptures.',
  image: 'https://annalu.art/images/og-home.jpg',
  canonical: 'https://annalu.art/',
  lang: 'pt'
}
---

<BaseLayout seo={seo} lang="pt" alternateUrl="/en/">
  <!-- Content -->
</BaseLayout>
```

### Gallery Page

```astro
---
const seo = {
  title: 'Gallery',
  description: 'Browse all artworks in the collection.',
  image: 'https://annalu.art/images/og-gallery.jpg',
  canonical: 'https://annalu.art/galeria',
  lang: 'pt'
}
---
```

### Artwork Detail Page

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

// Build SEO object
const seo = {
  title: artwork.data.title,
  description: artwork.data.description.slice(0, 160),
  image: `https://annalu.art${artwork.data.cover.src}`,
  canonical: `https://annalu.art/artwork/${artwork.id}`,
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'VisualArtwork',
    'name': artwork.data.title,
    'description': artwork.data.description,
    'image': `https://annalu.art${artwork.data.cover.src}`,
    'dateCreated': artwork.data.publishedAt.toISOString(),
    'artMedium': artwork.data.technique,
    'width': artwork.data.dimensions?.split(' × ')[0],
    'height': artwork.data.dimensions?.split(' × ')[1],
    'creator': { '@type': 'Person', 'name': 'AnnaLu' }
  },
  lang: 'pt'
}
---

<ArtworkLayout artwork={artwork} lang="pt" previous={prev} next={next}>
  <Content />
</ArtworkLayout>
```

---

## Sitemap

### Auto-Generation

`@astrojs/sitemap` integration auto-generates `sitemap.xml` at build time.

Configured in `astro.config.mjs`:

```ts
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://annalu.art',
  integrations: [sitemap()]
})
```

### Sitemap Contents

After build, `dist/sitemap-index.xml` lists:

```xml
<sitemapindex>
  <sitemap>
    <loc>https://annalu.art/sitemap-0.xml</loc>
  </sitemap>
</sitemapindex>
```

And `dist/sitemap-0.xml` contains all pages:

```xml
<urlset>
  <url>
    <loc>https://annalu.art/</loc>
    <lastmod>2024-04-28</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://annalu.art/en/" />
  </url>
  <url>
    <loc>https://annalu.art/galeria</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://annalu.art/en/gallery" />
  </url>
  <url>
    <loc>https://annalu.art/artwork/masterpiece</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://annalu.art/en/art/masterpiece" />
  </url>
  <!-- ...more URLs... -->
</urlset>
```

### Submit to Search Engines

1. **Google Search Console** — https://search.google.com/search-console
   - Add property
   - Submit sitemap URL: `https://annalu.art/sitemap-index.xml`

2. **Bing Webmaster Tools** — https://www.bing.com/webmasters
   - Add site
   - Submit sitemap

---

## Robots.txt

`public/robots.txt` tells search engines which pages to crawl:

```
User-agent: *
Allow: /

Sitemap: https://annalu.art/sitemap-index.xml
```

For Phase 1, everything is crawlable. Phase 2 may need to exclude admin routes:

```
User-agent: *
Disallow: /admin/
Disallow: /api/
Allow: /

Sitemap: https://annalu.art/sitemap-index.xml
```

---

## Technical SEO

### Page Speed

- **Lighthouse ≥95** on all metrics
- Static HTML (zero load time from server)
- Images optimized (AVIF/WebP via Astro)
- CSS tree-shaken (only used styles)
- No JavaScript by default

Check with: https://developers.google.com/speed/pagespeed/insights

### Mobile Friendly

- Responsive design (mobile-first)
- Viewport meta tag set
- Touch-friendly buttons
- Readable font sizes

Check with: https://search.google.com/test/mobile-friendly

### Semantic HTML

- Proper heading hierarchy (`<h1>`, `<h2>`, etc.)
- Semantic elements (`<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`)
- Alt text on all images
- ARIA labels where needed

### Core Web Vitals

Monitor at: https://search.google.com/search-console → Core Web Vitals

- **Largest Contentful Paint (LCP)** — <2.5s
- **Cumulative Layout Shift (CLS)** — <0.1
- **First Input Delay (FID)** — <100ms

---

## Content Optimization

### Titles

- Unique per page
- Include primary keyword
- Length 50-60 characters
- Pattern: `"Primary Keyword | Brand Name"`

Examples:
- `"Abstract Acrylic Painting | AnnaLu"`
- `"Contemporary Art Gallery | AnnaLu"`
- `"Urban Sketches Series | AnnaLu"`

### Meta Descriptions

- Unique per page
- Compelling call-to-action
- Length 150-160 characters
- Include primary keyword when natural

Examples:
- `"Explore contemporary abstract paintings. High-quality acrylic artworks available. Discover AnnaLu's unique art collection."`

### Headings

- One `<h1>` per page (usually the page title)
- Use `<h2>` for section headings
- Use `<h3>` for subsections
- Include keywords naturally

### Internal Links

- Link to related artworks
- Use descriptive anchor text (not "click here")
- Use consistent slug format

Example:
```html
<!-- ✅ Good -->
<a href="/artwork/urban-sketches">Urban Sketches series</a>

<!-- ❌ Avoid -->
<a href="/artwork/urban-sketches">click here</a>
```

---

## Image SEO

### Alt Text

Every image must have descriptive alt text:

```html
<img src="artwork.jpg" alt="Abstract acrylic painting with blue and red tones">
```

Guidelines:
- Describe the image content
- Include relevant keywords naturally
- 125 characters or less
- No "image of" or "photo of" (redundant)

### File Names

Use descriptive file names:

```
✅ abstract-acrylic-blue-red.jpg
❌ IMG_12345.jpg
❌ image1.jpg
```

### Image Metadata

Ensure images have:
- Proper `width` and `height` attributes (prevents CLS)
- `loading="lazy"` for below-fold images (except hero)
- Optimized file size (Astro handles this)

---

## Link Building (Off-Site SEO)

Phase 1 strategies:

- Mention on artist's social media
- Link from personal website/portfolio
- Art community sites (Reddit, Discord, Twitter)
- Art marketplace listings (Behance, etc.)

Phase 2 strategies:

- Press releases for new collections
- Art blog features
- Gallery partnerships
- Influencer collaborations

---

## Monitoring & Analytics

### Google Search Console

Monitor:
- Indexing status (are pages being crawled?)
- Search performance (impressions, clicks, CTR)
- Core Web Vitals
- Mobile usability issues

### Google Analytics 4

Track:
- Audience demographics
- User behavior (page views, scroll depth)
- Conversion events (gallery views, artwork clicks)
- Traffic sources

### Tools

- **PageSpeed Insights** — https://pagespeed.web.dev
- **Lighthouse** — Chrome DevTools → Lighthouse tab
- **WAVE** — https://wave.webaim.org (accessibility)
- **Screaming Frog** — https://www.screamingfrog.co.uk (crawling)

---

## SEO Checklist

Before launch:

- [ ] All pages have unique `<title>` and `<meta description>`
- [ ] OG image tags present on shareable pages
- [ ] Canonical URLs set correctly
- [ ] hreflang tags present for PT/EN pages
- [ ] JSON-LD schema valid (test at https://validator.schema.org)
- [ ] No 404 errors (check all links work)
- [ ] Mobile-friendly (test on mobile device)
- [ ] Lighthouse score ≥95
- [ ] Images optimized (< 100KB for web)
- [ ] Alt text on all images
- [ ] robots.txt created
- [ ] sitemap.xml generated
- [ ] Google Search Console property added
- [ ] Bing Webmaster Tools property added

---

## Common SEO Mistakes to Avoid

❌ **Don't:**
- Duplicate titles and descriptions across pages
- Write titles/descriptions for search engines (not users)
- Keyword stuff
- Hide text in images without alt text
- Use frames or iframes (bad for crawling)
- Link to disreputable sites
- Use `rel="noindex"` on pages you want indexed
- Ignore mobile experience
- Have broken links (404s)

✅ **Do:**
- Write for humans first, search engines second
- Use clear, descriptive titles
- Create unique content for each page
- Link to reputable, relevant sources
- Monitor Google Search Console regularly
- Keep pages fast and responsive
- Fix broken links promptly
- Use analytics to guide improvements

---

## Resources

- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Schema.org](https://schema.org) — Structured data vocabulary
- [Google Search Console Help](https://support.google.com/webmasters)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Web Vitals Guide](https://web.dev/vitals/)
- [MDN SEO Fundamentals](https://developer.mozilla.org/en-US/docs/Glossary/SEO)

---

## Questions?

If you have SEO questions:
1. Check [ARCHITECTURE.md](./ARCHITECTURE.md) for overall site structure
2. Review [COMPONENTS.md](./COMPONENTS.md) for how SEO component works
3. Consult Google Search Console for specific issues
4. Test with Lighthouse or PageSpeed Insights
