# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from the repo root using pnpm. Node `>=22.12.0` is required (`package.json` `engines`).

```bash
pnpm install      # install deps from pnpm-lock.yaml
pnpm dev          # dev server at localhost:4321
pnpm build        # static build → dist/
pnpm preview      # serve dist/ locally
pnpm astro check  # TypeScript + Astro diagnostics (use as the "test" gate before commit)
```

There is no unit-test script. Before committing run `pnpm astro check` + `pnpm build`; for UI changes verify both PT and EN routes, theme toggle, language switch, and reduced-motion behavior in the browser.

## Stack

- **Astro 6** — SSG, zero JS by default. Output is static HTML.
- **TailwindCSS v4** — via `@tailwindcss/vite` Vite plugin (not `@astrojs/tailwind`). Config lives inside `global.css` using `@theme` and `@custom-variant`.
- **GSAP 3** — animations only. Always guard with `prefers-reduced-motion` via `gsap.matchMedia()`.
- **Content Collections** — Astro 5+ Content Layer API. Schema in `src/content.config.ts`, loader uses `glob()`. Collection: `artworks`.
- **`@astrojs/sitemap`** — auto-generates sitemap from all static routes.
- **TypeScript strict** — extends `astro/tsconfigs/strict`. Path alias `@/*` → `./src/*`.

## Code Conventions

- **All code in English** — file names, component names, variables, props, comments.
- **Content/copy can be bilingual** — PT and EN strings in translations and schema fields.
- Follow SOLID, DRY, KISS, YAGNI principles.

## Architecture

### Two-phase design

Phase 1 (gallery) is current. The schema reserves `shop?` for Phase 2 (e-commerce). Do not implement Phase 2 features.

### Content model

Collection `artworks` — one `.md` per artwork in `src/content/artworks/`. Adding artwork = creating a markdown file.

Key schema fields:
- `title` / `titlePt` — bilingual titles
- `description` / `descriptionPt` — bilingual descriptions (max 160 chars, used in meta tags)
- `cover` / `images[]` — all `alt` fields required (Zod enforces)
- `featured` — controls landing page "latest" section
- `mosaic[]` — per-artwork gallery grid layout (`imageIndex`, `colStart`, `colSpan`, `rowSpan`)
- `shop?` — reserved for Phase 2, not rendered

### i18n

Two locales: `pt` (default at `/`) and `en` (at `/en/`). Configured in `astro.config.mjs` with `prefixDefaultLocale: false`.

- UI strings: `src/i18n/translations.ts` — access via `useTranslations(lang)`
- Route helpers: `getAlternateUrl()`, `getLocalizedPath()`, `getLangFromUrl()` in `src/i18n/index.ts`
- Page pairs: `index ↔ en/index`, `galeria ↔ en/gallery`, `artwork/[slug] ↔ en/art/[slug]`

### Theme

Light/dark via `.dark` class on `<html>`. FWOT prevention via blocking `<script is:inline>` in `BaseLayout` head. Color tokens as CSS custom properties in `global.css` (`:root` = light, `.dark` = dark). Tailwind dark variant via `@custom-variant dark`.

### Component hierarchy

```
BaseLayout.astro          ← HTML shell, SEO, Header, Footer, GSAP init
└── ArtworkLayout.astro   ← extends BaseLayout for artwork detail pages
```

Components (all in `src/components/`):
- `SEO.astro` — head meta (title, description, OG, Twitter Card, canonical, hreflang, JSON-LD)
- `Header.astro` — logo, nav, ThemeToggle, LanguagePicker, responsive mobile menu. `isLanding` prop hides header until scroll threshold on landing pages.
- `Hero.astro` — full-screen hero with animated SVG ocean waves, parallax, and mouse interaction. Nav links (Home · Gallery) below title.
- `Footer.astro` — social links, copyright
- `ThemeToggle.astro` — dark/light toggle with localStorage persistence
- `LanguagePicker.astro` — PT/EN links with `alternateUrl` prop
- `ArtworkCard.astro` — artwork summary card for landing page
- `EditorialStack.astro` — scroll-triggered image pile (latest 3 artwork covers) with blockquote. Template only — GSAP animation lives in BaseLayout.
- `MosaicRow.astro` — 12-column CSS grid row for gallery mosaic
- `AboutArtist.astro` — artist bio section on the landing page

### Helpers

- `src/lib/artworks.ts` — `sortByDate()` sorts artworks by `publishedAt` descending. Used across all pages and components that list artworks.

### GSAP

All GSAP code centralized in `BaseLayout.astro` `<script>` block. Uses `gsap.matchMedia()` with `(prefers-reduced-motion: no-preference)` guard. Components are template-only and mark elements with `data-animate` attributes — they do **not** contain their own `<script>` blocks for GSAP.

Current `data-animate` values: `hero`, `hero-ocean`, `editorial-text`, `editorial-stack`, `card`, `mosaic-row`, `cover`.

Key constants in the GSAP block:
- `HEADER_SCROLL_THRESHOLD` — px scroll before landing header appears
- `SPEED_MULTIPLIER` — scales all wave animation speeds (higher = faster)

### SEO

Every page has unique `<title>` in format `"Page Title | AnnaLu"`. JSON-LD `VisualArtwork` on artwork detail pages. Canonical URLs absolute. hreflang alternates on all pages. Sitemap auto-generated.

## Deeper docs

`docs/` contains longer-form references; consult them when the CLAUDE.md summary is not enough:
`ARCHITECTURE.md`, `COMPONENTS.md`, `CONTENT.md`, `i18n.md`, `THEMING.md`, `GSAP.md`, `SEO.md`, `CONFIG.md`, `SETUP.md`, `STRUCTURE.md`, `CODEBASE.md`. `AGENTS.md` at the repo root holds contribution conventions (Conventional Commits, PR expectations).
