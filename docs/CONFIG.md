# Configuration Guide

## Overview

AnnaLu's behavior is controlled by configuration files in the project root. This guide explains what each config file does and how to customize it.

---

## Quick Reference

All important settings at a glance:

| Setting | File | Current Value | What It Does |
|---------|------|----------------|-------------|
| Site URL | `astro.config.mjs` | `https://annalu.art` | Used for canonical URLs, OG tags, sitemap |
| Build output | `astro.config.mjs` | `static` | Generate static HTML (SSG) |
| Default language | `astro.config.mjs` | `pt` | Portuguese at `/`, English at `/en/` |
| TypeScript strict | `tsconfig.json` | Yes | Enforce strict type checking |
| Import alias | `tsconfig.json` | `@/*` → `./src/*` | Shorthand imports |
| Node version | `package.json` | ≥22.12.0 | Required Node version |
| Tailwind version | `package.json` | v4.x | Tailwind CSS framework |
| GSAP version | `package.json` | v3.x | Animation library |

---

## Astro Configuration

Main Astro configuration file. Controls how the site builds and behaves.

### Configuration Options Table

| Option | Current Value | Purpose | Why This Value |
|--------|---------------|---------|-----------------|
| `site` | `https://annalu.art` | Base URL for canonical URLs, OG tags, sitemap | Needed for SEO and social sharing |
| `output` | `static` | Generate static HTML (SSG) | Fast, no server needed, perfect for art gallery |
| `i18n.defaultLocale` | `pt` | Default language | PT is primary language (artist's preference) |
| `i18n.locales` | `['pt', 'en']` | All supported languages | Portuguese + English |
| `i18n.routing.prefixDefaultLocale` | `false` | PT at `/`, EN at `/en/` | PT users see cleaner URLs, EN at subpath |
| `integrations` | `[sitemap()]` | Astro plugins to load | Generates `sitemap.xml` for SEO |
| `vite.plugins` | `[tailwindcss()]` | Vite bundler plugins | Tailwind v4 integration via Vite plugin |

### Default Code

```ts
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

export default defineConfig({
  // Site URL (used for sitemap, canonical URLs, etc.)
  site: 'https://annalu.art',

  // Output mode: 'static' (SSG, default)
  output: 'static',

  // Internationalization
  i18n: {
    defaultLocale: 'pt',
    locales: ['pt', 'en'],
    routing: {
      prefixDefaultLocale: false  // PT at /, EN at /en/
    }
  },

  // Integrations
  integrations: [
    sitemap()  // Auto-generate sitemap
  ],

  // Vite configuration
  vite: {
    plugins: [
      tailwindcss()  // Tailwind v4 plugin
    ]
  }
})
```

### Customization

#### Change Site URL

```ts
site: 'https://myartgallery.com',
```

Used in:
- Canonical URLs (SEO)
- Open Graph `og:url`
- Sitemap

#### Add New Integration

```ts
import react from '@astrojs/react'

export default defineConfig({
  integrations: [
    sitemap(),
    react()  // If adding React components later
  ]
})
```

#### Enable Server-Side Rendering (Phase 2+)

```ts
output: 'hybrid',  // Instead of 'static'
```

This allows dynamic routes (e.g., shopping cart, user accounts).

#### Change Default Locale

```ts
i18n: {
  defaultLocale: 'en',  // Change to English default
  locales: ['en', 'pt'],  // Order matters
}
```

Then move all PT pages to `/pt/` and EN to root.

#### Add Image Service

For optimized images, configure image optimization:

```ts
image: {
  service: {
    entrypoint: 'astro/assets/services/sharp'
  }
}
```

Already configured by default (Sharp for SSG).

### Environment Variables in Config

Create `.env.local` in project root:

```
PUBLIC_SITE_URL=https://annalu.art
SECRET_API_KEY=xxx
```

Use in config:

```ts
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: import.meta.env.PUBLIC_SITE_URL || 'https://annalu.art'
})
```

---

## TypeScript Configuration

TypeScript configuration. Controls strict type checking.

### Configuration Options Table

| Option | Current Value | Purpose | Why This Value |
|--------|---------------|---------|-----------------|
| `extends` | `astro/tsconfigs/strict` | Extend Astro's strict TypeScript config | Strict by default prevents bugs |
| `compilerOptions.paths["@/*"]` | `./src/*` | Path alias for cleaner imports | Can write `@/components/` instead of `../../../components/` |
| `include` | `.astro/types.d.ts`, `**/*` | Files to type-check | Everything except dist/ |
| `exclude` | `dist` | Files to ignore | Build output doesn't need checking |

### Default Code

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

### What It Does

- **`extends: "astro/tsconfigs/strict"`** — Uses Astro's strict TypeScript config (no `any`, no implicit errors)
- **`paths`** — Alias for imports (`@/components` → `src/components`)
- **`include`** — Files to type-check
- **`exclude`** — Files to ignore (`dist/` is build output)

### Common Customizations

#### Allow `any` Type (Not Recommended)

```json
{
  "compilerOptions": {
    "noImplicitAny": false
  }
}
```

Don't do this unless you have a specific reason.

#### Stricter Type Checking

```json
{
  "compilerOptions": {
    "strict": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true
  }
}
```

#### Add Module Resolution

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler"
  }
}
```

Already set by Astro's strict config.

---

## package.json

Defines project metadata, dependencies, and npm scripts.

### Configuration Options Table

| Option | Current Value | Purpose |
|--------|---------------|---------|
| `name` | `annalu` | Project name (lowercase, no spaces) |
| `type` | `module` | Use ES modules (modern JS) |
| `version` | `0.0.1` | Semver version |
| `engines.node` | `>=22.12.0` | Minimum Node.js version required |

### Scripts Table

| Command | Script | What It Does |
|---------|--------|-------------|
| `pnpm dev` | `astro dev` | Start development server (localhost:4321) |
| `pnpm build` | `astro build` | Build for production (`dist/` folder) |
| `pnpm preview` | `astro preview` | Preview production build locally |
| `pnpm astro` | `astro` | Run Astro CLI directly |

### Dependencies

| Package | Current | Purpose |
|---------|---------|---------|
| `astro` | ^6.1.10 | SSG framework |
| `gsap` | ^3.x.x | Animation library |
| `@astrojs/sitemap` | ^1.x.x | Auto-generate sitemap.xml |

### Dev Dependencies

| Package | Current | Purpose |
|---------|---------|---------|
| `tailwindcss` | ^4.x.x | CSS utility framework |
| `@tailwindcss/vite` | ^4.x.x | Tailwind v4 Vite plugin |

### Default Code

```json
{
  "name": "annalu",
  "type": "module",
  "version": "0.0.1",
  "engines": {
    "node": ">=22.12.0"
  },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "astro": "^6.1.10",
    "gsap": "^3.x.x",
    "@astrojs/sitemap": "^1.x.x"
  },
  "devDependencies": {
    "tailwindcss": "^4.x.x",
    "@tailwindcss/vite": "^4.x.x"
  }
}
```

### Customization

#### Add New Script

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "lint": "eslint src/",
    "format": "prettier --write src/"
  }
}
```

Then run: `pnpm lint` or `pnpm format`

#### Add New Dependency

```bash
pnpm add package-name              # Runtime dependency
pnpm add -D package-name-dev       # Dev dependency
```

Updates `package.json` automatically.

#### Change Node Version Requirement

```json
{
  "engines": {
    "node": ">=18.0.0"  // Lower requirement for older systems
  }
}
```

---

## global.css

Global stylesheet with Tailwind, CSS variables, and base styles.

### CSS Variables Table (Light Theme)

| Variable | Value | Purpose | Used For |
|----------|-------|---------|----------|
| `--color-bg` | `#ffffff` | Background color | Page background |
| `--color-surface` | `#f9f9f9` | Surface/card color | Cards, containers |
| `--color-text` | `#1a1a1a` | Text color | Body text, headings |
| `--color-text-muted` | `#666666` | Muted text | Secondary text, captions |
| `--color-accent` | `#3b82f6` | Accent color | Links, buttons, highlights |
| `--color-accent-hover` | `#2563eb` | Accent hover state | Hovered links/buttons |
| `--color-border` | `#e5e5e5` | Border color | Lines, dividers |
| `--font-sans` | System fonts | Main font | Body text, paragraphs |
| `--font-display` | Georgia, serif | Display font | Headings, titles |

### Dark Theme Variables

Same variables in `.dark` class with inverted colors:

```css
.dark {
  --color-bg: #1a1a1a;        /* Dark background */
  --color-surface: #2a2a2a;   /* Dark surface */
  --color-text: #f5f5f5;      /* Light text */
  --color-text-muted: #999999;
  --color-accent: #60a5fa;    /* Lighter blue */
  --color-accent-hover: #93c5fd;
  --color-border: #404040;    /* Dark border */
}
```

### Default Code

```css
/* Tailwind v4 import */
@import "tailwindcss";

/* Light theme (default) */
:root {
  --color-bg: #ffffff;
  --color-surface: #f9f9f9;
  --color-text: #1a1a1a;
  --color-text-muted: #666666;
  --color-accent: #3b82f6;
  --color-accent-hover: #2563eb;
  --color-border: #e5e5e5;
  
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-display: 'Georgia', serif;
}

/* Dark theme */
.dark {
  --color-bg: #1a1a1a;
  --color-surface: #2a2a2a;
  --color-text: #f5f5f5;
  --color-text-muted: #999999;
  --color-accent: #60a5fa;
  --color-accent-hover: #93c5fd;
  --color-border: #404040;
}

/* Tailwind dark variant */
@custom-variant dark (&:where(.dark, .dark *))

/* Base resets */
* {
  box-sizing: border-box;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
  line-height: 1.6;
}

/* GSAP target utility */
.gsap-target {
  will-change: transform, opacity;
}
```

### Customization

See [THEMING.md](./THEMING.md) for detailed theming guide.

#### Change Default Colors

```css
:root {
  --color-accent: #ff6b6b;  /* Red instead of blue */
}

.dark {
  --color-accent: #ff9999;
}
```

#### Add New Font

```css
:root {
  --font-display: 'Playfair Display', serif;
  --font-mono: 'Courier New', monospace;
}
```

Then link the font in `BaseLayout`:

```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
```

#### Add New Color Token

```css
:root {
  --color-success: #10b981;
  --color-error: #ef4444;
  --color-warning: #f59e0b;
}

.dark {
  --color-success: #34d399;
  --color-error: #f87171;
  --color-warning: #fbbf24;
}
```

Use in components:

```html
<div class="text-[var(--color-success)]">Success!</div>
```

---

## src/content.config.ts

Content Collection configuration and schema.

### Default Configuration

```ts
import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const artworks = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/artworks' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    titlePt: z.string(),
    description: z.string().max(160),
    descriptionPt: z.string().max(160),
    publishedAt: z.date(),
    cover: z.object({
      src: z.string(),
      alt: z.string()
    }),
    images: z.array(z.object({
      src: z.string(),
      alt: z.string(),
      caption: z.string().optional()
    })),
    tags: z.array(z.string()),
    technique: z.string().optional(),
    dimensions: z.string().optional(),
    year: z.number().int().optional(),
    featured: z.boolean().optional().default(false),
    shop: z.object({
      available: z.boolean(),
      price: z.number().optional(),
      stock: z.number().int().optional(),
      sku: z.string().optional()
    }).optional(),
    mosaic: z.array(z.object({
      imageIndex: z.number().int(),
      colStart: z.number().int().min(1).max(12),
      colSpan: z.number().int().min(1).max(12),
      rowSpan: z.number().int().optional()
    }))
  })
})

export const collections = { artworks }
```

### Customization

See [CONTENT.md](./CONTENT.md) for detailed content guide.

#### Add New Field to Schema

```ts
const artworks = defineCollection({
  schema: ({ image }) => z.object({
    // Existing fields...
    edition: z.number().optional(),  // New: edition number
    signed: z.boolean().optional()    // New: whether signed
  })
})
```

Then add to your artwork frontmatter:

```yaml
---
title: "..."
titlePt: "..."
edition: 1
signed: true
---
```

#### Change Required Fields to Optional

```ts
// Make `dimensions` optional instead of required
dimensions: z.string().optional(),
```

#### Add Validation

```ts
// Title must be 3-100 characters
title: z.string().min(3).max(100),

// Price must be positive
price: z.number().positive(),

// Year must be recent
year: z.number().int().min(1800).max(2100),
```

---

## tailwind.config.js (If Needed)

With Tailwind v4 and `@tailwindcss/vite`, you typically don't need a `tailwind.config.js` file.

Configuration is in `src/styles/global.css` using `@theme`.

### Custom Theme (Advanced)

If you need more control, create `tailwind.config.js`:

```js
export default {
  theme: {
    extend: {
      colors: {
        accent: 'var(--color-accent)'
      },
      fontFamily: {
        display: 'var(--font-display)'
      }
    }
  }
}
```

Then in `astro.config.mjs`:

```ts
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  vite: {
    plugins: [tailwindcss('./tailwind.config.js')]
  }
})
```

---

## .env Files

Environment variables for sensitive data or configuration.

### .env.local (Ignored by Git)

```
PUBLIC_SITE_URL=https://annalu.art
PUBLIC_GA_ID=G-XXXXXXXXXX
SECRET_STRIPE_KEY=sk_live_xxx
SECRET_SMTP_PASSWORD=xxx
```

### In Code

**Public variables** (exposed to browser):
```ts
const siteUrl = import.meta.env.PUBLIC_SITE_URL
```

**Secret variables** (server-only):
```ts
const stripeKey = import.meta.env.SECRET_STRIPE_KEY  // Phase 2
```

### Git Configuration

Add to `.gitignore` (already done):
```
.env
.env.local
.env.*.local
```

---

## Deployment Configuration

### Vercel

Create `vercel.json`:

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "env": {
    "PUBLIC_SITE_URL": "@public_site_url"
  }
}
```

### Netlify

Create `netlify.toml`:

```toml
[build]
command = "pnpm build"
publish = "dist"

[env]
PUBLIC_SITE_URL = "https://annalu.art"
```

### Traditional Hosting

1. Run `pnpm build`
2. Upload `dist/` folder via FTP/SFTP
3. No server configuration needed (pure static)

---

## Performance Configuration

### Image Optimization

Already handled by Astro's image service. To customize:

In `astro.config.mjs`:

```ts
image: {
  service: {
    entrypoint: 'astro/assets/services/sharp',
    config: {
      limitInputPixels: false  // For very large images
    }
  }
}
```

### CSS Minification

Automatic in production builds (no configuration needed).

### JavaScript Minification

Automatic in production builds (no configuration needed).

### Image Formats

Astro auto-generates AVIF, WebP, and original format. To customize formats:

```ts
// In astro.config.mjs
export default defineConfig({
  // Astro will generate these formats
  // (AVIF, WebP, and original by default)
})
```

---

## Security Configuration

### Content Security Policy (CSP)

To add CSP headers, create middleware (Phase 2+):

```ts
// src/middleware.ts
import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware((context, next) => {
  context.response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'"
  )
  return next()
})
```

### CORS Headers

For API endpoints (Phase 2+):

```ts
// In API endpoint
export const prerender = false

export async function GET() {
  return new Response(JSON.stringify({ data: 'value' }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })
}
```

---

## Debugging Configuration

### Enable Astro Debug Mode

```bash
DEBUG=astro pnpm dev
```

Shows detailed build information in console.

### Check Types

```bash
pnpm astro check
```

Runs TypeScript check without building.

---

## Configuration Validation Checklist

Before deploying, verify all configuration settings:

### Astro Config (`astro.config.mjs`)
- [ ] `site` is set to production domain (not localhost)
- [ ] `output` is `'static'` (or `'hybrid'` if using dynamic routes)
- [ ] `defaultLocale` matches your primary language
- [ ] All integrations are imported and listed
- [ ] No syntax errors (run `pnpm astro check`)

### TypeScript Config (`tsconfig.json`)
- [ ] Extends `astro/tsconfigs/strict` for type safety
- [ ] Path aliases defined for convenience
- [ ] No circular imports in path aliases
- [ ] All files can be compiled (run `pnpm astro check`)

### Package.json
- [ ] Node version requirement matches your hosting (run `node --version`)
- [ ] All scripts are correct and tested
- [ ] No private packages required without credentials
- [ ] All dependencies have compatible versions (check `pnpm-lock.yaml`)

### CSS Config (`src/styles/global.css`)
- [ ] Tailwind v4 import at top
- [ ] Both light and dark theme colors defined
- [ ] Dark variant registered with `@custom-variant`
- [ ] No undefined CSS variables

### Environment Variables (`.env.local`)
- [ ] `.env.local` is in `.gitignore` (secrets not committed)
- [ ] `PUBLIC_*` variables are not secrets
- [ ] All `SECRET_*` variables are actually secrets
- [ ] No hardcoded API keys in source files

### Content Schema (`src/content.config.ts`)
- [ ] All required fields are non-optional
- [ ] `alt` fields present on images
- [ ] Schema validates correctly (run `pnpm astro check`)
- [ ] No typos in field names

---

## Common Configuration Questions

**Q: How do I change the site name?**
A: The site name "AnnaLu" is in `translations.ts` and hardcoded in components. Update everywhere or create a global constant (Phase 2+).

**Q: How do I add a favicon?**
A: Replace `public/favicon.ico` and `public/favicon.svg`. Links in `BaseLayout` automatically find them.

**Q: How do I change the default language to English?**
A: Change `defaultLocale: 'en'` in `astro.config.mjs`, then reorganize pages to match the new structure.

**Q: How do I add Google Analytics?**
A: Add `PUBLIC_GA_ID` to `.env.local`, then add tracking script to `BaseLayout` head.

**Q: How do I enable PHP or backend?**
A: Change `output: 'hybrid'` in `astro.config.mjs` to enable on-demand rendering for API endpoints (Phase 2+).

**Q: How do I change the development server port?**
A: Run `pnpm dev --port 3000` (see `astro dev --help` for all options).

**Q: How do I optimize build size?**
A: Astro automatically tree-shakes unused CSS. For JS, ensure no components have client-side scripts unnecessarily.

**Q: How do I add authentication?**
A: Currently not supported (Phase 1 is static). Phase 2+ with `output: 'hybrid'` will support auth middleware.

---

## Resources & Related Documentation

- [THEMING.md](./THEMING.md) — Detailed theming guide, color tokens, light/dark mode
- [i18n.md](./i18n.md) — Internationalization setup, locale configuration
- [SETUP.md](./SETUP.md) — Initial project setup, installation
- [ARCHITECTURE.md](./ARCHITECTURE.md) — Project structure, folder layout
- [Astro Configuration Reference](https://docs.astro.build/en/reference/configuration-reference/)
- [TypeScript Compiler Options](https://www.typescriptlang.org/tsconfig)
- [Tailwind Configuration](https://tailwindcss.com/docs/configuration)
- [Environment Variables](https://docs.astro.build/en/guides/environment-variables/)
