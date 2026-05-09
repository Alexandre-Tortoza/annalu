# AnnaLu Documentation

Centralized documentation for the AnnaLu project.

## Project Snapshot

- **Type:** Static art gallery website (Astro 6)
- **Locales:** Portuguese (`/`) and English (`/en`)
- **Styling:** TailwindCSS v4 + CSS custom properties
- **Animations:** GSAP (centralized in `BaseLayout.astro`)
- **Content source:** Markdown files in `src/content/artworks/`

## Start Here

1. **[CODEBASE.md](./CODEBASE.md)** — project structure, organization, and codebase rules.
2. **[SETUP.md](./SETUP.md)** — installation, development commands, troubleshooting.
3. **[ARCHITECTURE.md](./ARCHITECTURE.md)** — architecture decisions and data flow.

## Documentation Map

| Area | File | Purpose |
|---|---|---|
| Core | [CODEBASE.md](./CODEBASE.md) | Canonical quick reference for structure and rules |
| Setup | [SETUP.md](./SETUP.md) | Local setup and day-to-day commands |
| Structure | [STRUCTURE.md](./STRUCTURE.md) | Detailed folder and file organization |
| Architecture | [ARCHITECTURE.md](./ARCHITECTURE.md) | System design and implementation model |
| Components | [COMPONENTS.md](./COMPONENTS.md) | Component catalog and usage patterns |
| Content | [CONTENT.md](./CONTENT.md) | Artwork schema and content workflow |
| i18n | [i18n.md](./i18n.md) | Locale strategy and translation workflow |
| Theming | [THEMING.md](./THEMING.md) | Theme tokens, dark mode, style conventions |
| GSAP | [GSAP.md](./GSAP.md) | Animation patterns and reduced-motion rules |
| SEO | [SEO.md](./SEO.md) | Metadata, canonical, hreflang, structured data |
| Config | [CONFIG.md](./CONFIG.md) | Astro, TypeScript, Tailwind, environment config |

## Documentation Principles

- Keep docs aligned with implementation in `src/`.
- Prefer **updating existing files** over creating duplicates.
- Keep examples realistic and repository-specific.
- Preserve the current Phase 1 scope; do not document Phase 2 as active behavior.
