# Codebase Guide

This is the canonical quick reference for how the project is organized and which rules contributors should follow.

## 1. Stack and Scope

- **Framework:** Astro 6 (static output)
- **Language:** TypeScript (strict mode)
- **Styling:** TailwindCSS v4 (`@tailwindcss/vite`) + CSS variables
- **Animations:** GSAP 3
- **Current product phase:** Phase 1 (gallery only)

`shop` fields in content are reserved for a future phase and must not be rendered as active e-commerce behavior now.

## 2. Repository Structure

```text
/
├── docs/                     # Project documentation
├── public/                   # Static assets (favicons, images, robots)
├── src/
│   ├── components/           # Reusable Astro components
│   ├── content/artworks/     # Artwork markdown entries
│   ├── i18n/                 # Locale helpers and translations
│   ├── layouts/              # Shared page layouts
│   ├── lib/                  # Shared utilities
│   ├── pages/                # Routes (PT root, EN in /en)
│   ├── styles/               # Global styles and theme tokens
│   └── content.config.ts     # Content collection schema
├── astro.config.mjs
├── tsconfig.json
└── package.json
```

## 3. Route Organization

- **Portuguese (default):** `/`, `/galeria`, `/artwork/[slug]`
- **English:** `/en`, `/en/gallery`, `/en/art/[slug]`

When creating or editing pages, keep PT/EN route pairs aligned.

## 4. Codebase Rules

1. **Code language:** Use English for file names, component names, variables, props, and comments.
2. **Naming:**
   - Components in PascalCase (example: `ArtworkCard.astro`)
   - Helpers in camelCase or descriptive lowercase (example: `artworks.ts`)
   - Artwork slugs in kebab-case (example: `watercolor-abstract.md`)
3. **Architecture:**
   - Keep GSAP logic centralized in `src/layouts/BaseLayout.astro`
   - Components should stay template-oriented and expose animation targets via `data-animate`
   - Respect `prefers-reduced-motion` using `gsap.matchMedia()`
4. **i18n:** PT is default locale; EN lives under `/en`. Keep translations in `src/i18n/translations.ts`.
5. **Content model:** Add one markdown file per artwork in `src/content/artworks/` and satisfy schema requirements in `src/content.config.ts` (including required `alt` fields).

## 5. Development Commands

Run from repository root:

```bash
pnpm install
pnpm dev
pnpm astro check
pnpm build
pnpm preview
```

## 6. Change Checklist

Before finalizing changes:

- Run `pnpm astro check` and `pnpm build`
- For UI work, verify PT and EN routes affected by the change
- If theme or animation was touched, verify dark mode and reduced-motion behavior
- If content was touched, confirm frontmatter matches `src/content.config.ts`
