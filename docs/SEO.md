# SEO Implementation Guide

## Overview

AnnaLu is built with SEO as a first-class feature. Every page is optimized for search engines through proper markup, structured data, and accessibility.

All SEO meta tags are generated dynamically based on page content and handled by the `SEO` component.

---

## Quick Reference: Meta Tags & Their Purposes

| Meta Tag | Purpose | Location | Max Length | Example |
|----------|---------|----------|-----------|---------|
| `<title>` | Browser tab, search results | Head | 50-60 chars | `Abstract Acrylic Painting \| AnnaLu` |
| `description` | Search results snippet | Head | 150-160 chars | `Explore contemporary abstract paintings. High-quality acrylic artworks available.` |
| `viewport` | Responsive design signal | Head | — | `width=device-width, initial-scale=1` |
| `charset` | Character encoding | Head | — | `utf-8` |
| `og:title` | Social media post title | Head | 50-60 chars | Same as page `<title>` |
| `og:description` | Social media post text | Head | 150-160 chars | Same as `description` |
| `og:image` | Social media thumbnail | Head | — | Full URL to image (1200×630px) |
| `og:url` | Canonical URL for sharing | Head | — | `https://annalu.art/artwork/slug` |
| `og:type` | Content type | Head | — | `website` or `article` |
| `twitter:card` | Twitter card type | Head | — | `summary_large_image` |
| `twitter:image` | Twitter thumbnail | Head | — | Full URL to image |
| `canonical` | Prevent duplicate content | Head | — | `https://annalu.art/artwork/slug` |
| `hreflang` | Multilingual alternate | Head | — | `<link rel="alternate" hreflang="pt" ...>` |
| JSON-LD schema | Structured data | Head (in `<script>`) | — | `{"@type": "VisualArtwork", ...}` |

---

## Canonical URLs

### What & Why

A canonical URL tells search engines which version of a page is the "official" one, preventing duplicate content penalties.

```html
<link rel="canonical" href="https://annalu.art/artwork/sunset-painting">
```

**Why this matters:**
- Without canonical URL, search engines might index `/artwork/slug`, `/art/slug`, `?utm_source=xxx`, etc. as separate pages
- Dilutes search ranking across duplicates
- Confuses analytics (multiple URLs for same content)
- Canonical consolidates ranking to one URL

### Examples

**Landing page (PT):**
```html
<link rel="canonical" href="https://annalu.art/">
```

**Landing page (EN):**
```html
<link rel="canonical" href="https://annalu.art/en/">
```

**Artwork detail (PT):**
```html
<link rel="canonical" href="https://annalu.art/artwork/masterpiece">
```

**Artwork detail (EN):**
```html
<link rel="canonical" href="https://annalu.art/en/art/masterpiece">
```

**Gallery page:**
```html
<link rel="canonical" href="https://annalu.art/galeria">
```

**Best practice:** Always set canonical to the full, absolute URL (including `https://`).

---

## hreflang Tags

### What & Why

hreflang tags tell search engines about alternate language versions of a page, so they show the right version to users based on language preference.

```html
<!-- On Portuguese page -->
<link rel="alternate" hreflang="pt" href="https://annalu.art/artwork/slug">
<link rel="alternate" hreflang="en" href="https://annalu.art/en/art/slug">
<link rel="alternate" hreflang="x-default" href="https://annalu.art/artwork/slug">
```

**What each means:**
| hreflang | Meaning | When to use |
|----------|---------|-----------|
| `hreflang="pt"` | Portuguese version | On PT and EN pages, point to PT version |
| `hreflang="en"` | English version | On PT and EN pages, point to EN version |
| `hreflang="x-default"` | Fallback/default | Points to default language (PT) |

### Examples

**On Portuguese artwork page (`/artwork/sunset`):**
```html
<link rel="alternate" hreflang="pt" href="https://annalu.art/artwork/sunset">
<link rel="alternate" hreflang="en" href="https://annalu.art/en/art/sunset">
<link rel="alternate" hreflang="x-default" href="https://annalu.art/artwork/sunset">
```

**On English artwork page (`/en/art/sunset`):**
```html
<link rel="alternate" hreflang="pt" href="https://annalu.art/artwork/sunset">
<link rel="alternate" hreflang="en" href="https://annalu.art/en/art/sunset">
<link rel="alternate" hreflang="x-default" href="https://annalu.art/artwork/sunset">
```

**Key points:**
- hreflang tags **must be identical** on both PT and EN versions (they reference each other)
- Use full absolute URLs
- Always include `x-default` pointing to default locale (PT)
- Search engines use this to show right version to right user

---

## Sitemap Explanation

### What Is It?

A sitemap is an XML file listing all pages on your site. Search engines use it to:
1. Discover all pages (especially deep/new ones)
2. Understand page relationships
3. Know update frequency and priority

### How AnnaLu Generates It

Astro's `@astrojs/sitemap` plugin auto-generates at build time:

```bash
pnpm build
# Creates: dist/sitemap-index.xml and dist/sitemap-0.xml
```

**Configuration in `astro.config.mjs`:**
```ts
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://annalu.art',
  integrations: [sitemap()]
})
```

### Sitemap Contents

**`dist/sitemap-index.xml`** — Index of all sitemaps:
```xml
<sitemapindex>
  <sitemap>
    <loc>https://annalu.art/sitemap-0.xml</loc>
  </sitemap>
</sitemapindex>
```

**`dist/sitemap-0.xml`** — Actual page list:
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
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://annalu.art/en/gallery" />
  </url>
  <url>
    <loc>https://annalu.art/artwork/masterpiece</loc>
    <lastmod>2024-04-15</lastmod>
    <changefreq>never</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://annalu.art/en/art/masterpiece" />
  </url>
</urlset>
```

**Key elements:**
- `<loc>` — Full URL
- `<lastmod>` — Last modification date (ISO 8601)
- `<changefreq>` — How often page changes (`always`, `hourly`, `daily`, `weekly`, `monthly`, `yearly`, `never`)
- `<priority>` — Importance relative to other pages (0.0-1.0, default 0.5)
- `<xhtml:link>` — Alternate language versions

### Submit to Search Engines

**Google Search Console:**
1. Go to https://search.google.com/search-console
2. Select your site property
3. → Sitemaps (left menu)
4. Click "Add a new sitemap"
5. Enter: `https://annalu.art/sitemap-index.xml`
6. Click "Submit"

**Bing Webmaster Tools:**
1. Go to https://www.bing.com/webmasters
2. Add your site
3. → Sitemaps
4. Submit: `https://annalu.art/sitemap-index.xml`

---

## Common SEO Issues & Solutions

### Issue: Pages Not Indexed

**Symptoms:** Page doesn't appear in Google search after weeks

**Solutions:**
1. Check Google Search Console → Coverage tab
   - Are pages marked as "Discovered - currently not indexed"?
   - Are there crawl errors?
2. Submit sitemap to Google Search Console
3. Use "Request indexing" for critical pages
4. Check for `rel="noindex"` or `robots: noindex` meta tag (should not have this)
5. Verify page is not blocked by `robots.txt`

**robots.txt check:**
```bash
# Verify /robots.txt allows your pages
curl https://annalu.art/robots.txt
# Should show: Allow: /
```

---

### Issue: Duplicate Content

**Symptoms:** Multiple URLs show same content, ranking diluted

**Solutions:**
1. **Always set canonical URL** — tells search engines which is the primary version
2. **Set hreflang tags** for multilingual content
3. **No `?utm_source` in canonical** — canonical should be clean URL
4. **Check URL parameters** — ensure pages with `?param1=x&param2=y` redirect to clean URL

---

### Issue: Poor Click-Through Rate (Low CTR)

**Symptoms:** Page ranks but few people click it in search results

**Solutions:**
1. **Improve title** — include keyword, make compelling, 50-60 chars
   - ❌ Bad: `Artwork Page`
   - ✅ Good: `Abstract Acrylic Painting | AnnaLu`
2. **Improve meta description** — first 160 chars show in search
   - ❌ Bad: `This is an artwork.`
   - ✅ Good: `Explore contemporary abstract paintings. High-quality acrylic artworks available. Discover AnnaLu's unique art collection.`
3. **Add OG image** — helps in social sharing
4. **Match search intent** — what does user searching this term want?

---

### Issue: Images Not Appearing in Google Images

**Symptoms:** Artwork images don't show in Google Images search

**Solutions:**
1. **Alt text on all images** — required for indexing
   ```html
   <img src="abstract-blue.jpg" alt="Abstract acrylic painting with blue tones">
   ```
2. **Descriptive file names** — `abstract-blue-acrylic.jpg` better than `image1.jpg`
3. **High-quality image** — minimum 300px width/height recommended
4. **Add structured data** — JSON-LD schema with image URLs
5. **Allow image crawling** — check robots.txt doesn't block `/images/`

---

### Issue: Low Mobile Score

**Symptoms:** Page works on desktop but slow/broken on mobile

**Solutions:**
1. **Test on mobile** — use Chrome DevTools device emulation
2. **Check viewport meta tag** — ensure it's set
3. **Optimize images** — use Astro's image optimization
4. **Readable font sizes** — minimum 16px on mobile
5. **Touch-friendly buttons** — minimum 48px × 48px
6. **Run Lighthouse** — DevTools → Lighthouse tab → Mobile

---

### Issue: Sitemap Errors

**Symptoms:** Sitemap has invalid XML or errors

**Solutions:**
1. **Verify sitemap format** — check `dist/sitemap-0.xml` is valid XML
2. **Check URLs are absolute** — must include `https://`
3. **Check hreflang syntax** — `hreflang="pt"` not `hreflang="pt-PT"`
4. **Validate at https://www.xml-sitemaps.com/** — paste sitemap XML
5. **Check file size** — max 50MB per sitemap (auto-split if needed)

---

## SEO Checklist for New Pages/Artworks

Before publishing a new page or artwork:

### Content
- [ ] Title is unique and includes primary keyword (50-60 chars)
- [ ] Meta description is unique and compelling (150-160 chars)
- [ ] Content matches search intent (if targeting a keyword)
- [ ] Headings follow hierarchy (`<h1>` → `<h2>` → `<h3>`)
- [ ] Internal links to related pages (with descriptive text, not "click here")

### Images
- [ ] All images have descriptive alt text (125 chars max, no "image of")
- [ ] Image file names are descriptive (`abstract-blue.jpg` not `IMG_123.jpg`)
- [ ] Images optimized (< 100KB each for web)
- [ ] Hero/cover images have width/height attributes

### Structured Data
- [ ] JSON-LD schema is valid (test at https://validator.schema.org)
- [ ] `VisualArtwork` schema includes: name, description, image, dateCreated, creator
- [ ] All required schema fields are filled

### Technical
- [ ] Canonical URL is set and absolute (full domain)
- [ ] hreflang tags present on both PT and EN versions
- [ ] OG tags set (og:title, og:description, og:image, og:url)
- [ ] Twitter Card tags set
- [ ] Page is not blocked in robots.txt
- [ ] No `rel="noindex"` in head

### Performance
- [ ] Page load time < 3s (test at https://pagespeed.web.dev)
- [ ] Lighthouse score ≥ 95 (all metrics)
- [ ] Mobile-friendly (test at https://search.google.com/test/mobile-friendly)
- [ ] Core Web Vitals: LCP < 2.5s, CLS < 0.1, FID < 100ms

### Accessibility
- [ ] Semantic HTML (`<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`)
- [ ] Color contrast ratio ≥ 4.5:1 for text
- [ ] Form labels associated with inputs
- [ ] Interactive elements keyboard accessible

### Deployment
- [ ] Sitemap rebuilt and submitted (`pnpm build`)
- [ ] Page submitted to Google Search Console
- [ ] URL submitted for indexing (if critical)
- [ ] Check Search Console for crawl errors (wait 24-48 hours)

---

## Structured Data (JSON-LD)

JSON-LD is added to each artwork detail page for rich search results. It tells search engines exactly what your content is about.

---

### VisualArtwork Schema

Used for artwork pages. Appears in Google Images and search results with rich snippets.

**Minimal example:**
```json
{
  "@context": "https://schema.org",
  "@type": "VisualArtwork",
  "name": "Sunset Over Mountains",
  "description": "Abstract acrylic painting featuring warm tones",
  "image": "https://annalu.art/images/sunset.jpg",
  "creator": {
    "@type": "Person",
    "name": "AnnaLu"
  }
}
```

**Complete example (recommended):**
```json
{
  "@context": "https://schema.org",
  "@type": "VisualArtwork",
  "name": "Sunset Over Mountains",
  "description": "Abstract acrylic painting featuring warm tones of orange, red, and gold blending into deep purple mountains. Created in 2024.",
  "image": "https://annalu.art/images/sunset.jpg",
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
    "name": "AnnaLu",
    "url": "https://annalu.art"
  },
  "inLanguage": "en"
}
```

**Field descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `@context` | URL | Yes | Always `"https://schema.org"` |
| `@type` | String | Yes | Always `"VisualArtwork"` |
| `name` | String | Yes | Artwork title |
| `description` | String | Recommended | Full description (160+ chars OK for schema) |
| `image` | URL | Yes | Direct URL to artwork image (absolute, full domain) |
| `dateCreated` | Date | Recommended | ISO 8601 date (`YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`) |
| `artMedium` | String | Recommended | Medium (Acrylic, Oil, Watercolor, Digital, etc.) |
| `width` | Distance | Optional | Width in centimeters (see format below) |
| `height` | Distance | Optional | Height in centimeters (see format below) |
| `creator` | Person | Yes | Creator object with `@type: "Person"` and `name` |
| `url` | URL | Optional | Link to artwork detail page |
| `inLanguage` | String | Optional | Language code (`"en"`, `"pt"`, etc.) |

**Distance format (for width/height):**
```json
{
  "@type": "Distance",
  "unitCode": "CMT",  // CMT = centimeters, MTR = meters
  "value": "100"
}
```

**Validate your schema:**
1. Go to https://validator.schema.org
2. Paste your JSON-LD
3. Click "Validate" — shows errors and warnings
4. Fix issues before deploying

---

### Organization Schema (Homepage)

Optional: Add to homepage to establish brand identity in search results.

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "AnnaLu",
  "url": "https://annalu.art",
  "logo": "https://annalu.art/logo.svg",
  "description": "Contemporary art gallery featuring abstract paintings and sculptures",
  "sameAs": [
    "https://instagram.com/annalu",
    "https://twitter.com/annalu"
  ],
  "founder": {
    "@type": "Person",
    "name": "Anna Lu"
  }
}
```

This helps Google show your brand knowledge panel (if you have significant online presence).

---

### Product Schema (Phase 2 - E-commerce)

When shop is enabled, Product schema should be added:

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Sunset Over Mountains",
  "description": "Abstract acrylic painting",
  "image": "https://annalu.art/images/sunset.jpg",
  "price": "1500.00",
  "priceCurrency": "USD",
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "price": "1500.00",
    "priceCurrency": "USD",
    "seller": {
      "@type": "Organization",
      "name": "AnnaLu"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "24"
  }
}
```

Allows search engines to show price, availability, and reviews in search results.

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

## SEO Checklist (Before Launch)

General SEO checklist before deploying site:

- [ ] All pages have unique `<title>` in format "Title | AnnaLu" (50-60 chars each)
- [ ] All pages have unique `<meta name="description">` (150-160 chars each)
- [ ] OG image tags present on shareable pages (`og:image` with full URL)
- [ ] Canonical URLs set correctly (absolute, full domain) on all pages
- [ ] hreflang tags present and matching on PT/EN pages
- [ ] JSON-LD schema valid on artwork pages (validate at https://validator.schema.org)
- [ ] No 404 errors (test all internal links)
- [ ] Mobile-friendly (test at https://search.google.com/test/mobile-friendly)
- [ ] Lighthouse score ≥ 95 on all metrics (test in DevTools)
- [ ] All images have descriptive alt text
- [ ] Image files optimized (< 100KB for web)
- [ ] `robots.txt` created and correct (`Allow: /`)
- [ ] `sitemap.xml` generated and valid (after build)
- [ ] Google Search Console property created and sitemap submitted
- [ ] Bing Webmaster Tools property created and sitemap submitted
- [ ] No redirect chains (keep redirects minimal)
- [ ] HTTPS enabled (should be automatic on hosting)
- [ ] Analytics tracking configured (if needed)

---

## Resources & Related Documentation

- [CONTENT.md](./CONTENT.md) — Content collection schema, metadata fields for artworks
- [ARCHITECTURE.md](./ARCHITECTURE.md) — Page structure, routing, layout components
- [COMPONENTS.md](./COMPONENTS.md) — Component details, how SEO component works
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
