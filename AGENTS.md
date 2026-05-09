# Repository Guidelines

## Project Structure & Module Organization

This is an Astro static site with bilingual Portuguese and English routes.

- `src/pages/` contains route files. Portuguese pages live at the root (`index.astro`, `galeria.astro`, `artwork/[slug].astro`); English pages live under `src/pages/en/`.
- `src/components/` contains reusable Astro UI components such as `Header.astro`, `Footer.astro`, `SEO.astro`, and gallery/artwork components.
- `src/layouts/` contains shared page templates, primarily `BaseLayout.astro` and `ArtworkLayout.astro`.
- `src/content/artworks/` contains artwork Markdown entries validated by `src/content.config.ts`.
- `src/i18n/` contains locale helpers and UI translations.
- `src/styles/global.css` contains Tailwind v4 imports, CSS variables, resets, and global theme styles.
- `public/` contains static assets served as-is, including `public/images/`, favicons, and `robots.txt`.
- `docs/` contains deeper project documentation for architecture, content, theming, SEO, GSAP, and setup.

## Build, Test, and Development Commands

Run commands from the repository root with `pnpm`.

- `pnpm install` installs dependencies from `pnpm-lock.yaml`.
- `pnpm dev` starts the Astro dev server at `http://localhost:4321`.
- `pnpm astro check` runs Astro and TypeScript diagnostics.
- `pnpm build` builds the production site into `dist/`.
- `pnpm preview` serves the production build locally.
- `pnpm astro ...` runs Astro CLI commands, for example `pnpm astro add`.

## Coding Style & Naming Conventions

Use TypeScript and Astro conventions already present in the codebase. Keep all code in English: file names, component names, variables, props, and comments. Content and copy may be bilingual through translations and content schema fields. Keep components in PascalCase (`ArtworkCard.astro`), helper modules in camelCase or descriptive lowercase (`artworks.ts`, `translations.ts`), and content slugs in kebab-case (`watercolor-abstract.md`). Prefer two-space indentation in `.astro`, `.ts`, and CSS files. Follow SOLID, DRY, KISS, and YAGNI; do not add abstractions or Phase 2 e-commerce features unless explicitly required.

## Architecture & Implementation Notes

Astro 6 outputs static HTML with minimal client JavaScript. TailwindCSS v4 is wired through `@tailwindcss/vite`; keep theme tokens and variants in `src/styles/global.css` using CSS custom properties. Use the `@/*` alias for imports from `src/` when it improves clarity.

Content lives in the `artworks` collection. Add one Markdown file per artwork in `src/content/artworks/`, with required image `alt` text and bilingual title/description fields where applicable. The `shop?` schema field is reserved for future e-commerce work and should not be rendered now.

Keep GSAP animation code centralized in `BaseLayout.astro`. Components should remain template-oriented and mark animated elements with `data-animate` attributes. Always respect `prefers-reduced-motion` through `gsap.matchMedia()`.

For i18n, `pt` is the default locale at `/`; `en` is under `/en/`. Keep page pairs aligned, update `src/i18n/translations.ts` for UI strings, and preserve canonical and hreflang behavior through existing helpers.

## Testing Guidelines

There is no dedicated unit test script in `package.json`. Before committing, run `pnpm astro check` and `pnpm build`. For UI changes, verify affected PT and EN routes, theme toggling, language switching, reduced-motion behavior when animations are touched, and artwork detail pages in the browser. For content changes, confirm frontmatter matches `src/content.config.ts` and image paths resolve under `public/images/`.

## Commit & Pull Request Guidelines

Recent history uses short Conventional Commit-style subjects such as `feat: ...`, `refactor: ...`, and `docs: ...`; keep that pattern. Use imperative, scoped commit messages and avoid mixing unrelated changes.

Pull requests should include a concise description, affected routes/components, validation performed (`pnpm astro check`, `pnpm build`, browser checks), and screenshots for visual changes. Link related issues when available and note any content, SEO, or i18n impact.
