# AnnaLu Art Gallery Documentation

Welcome to the AnnaLu art gallery documentation. This folder contains comprehensive guides for developers, content creators, and designers working on this project.

## What is AnnaLu?

**AnnaLu** is a modern, content-driven art gallery platform built with Astro 6. It provides a beautiful, accessible way for artists to showcase and eventually sell their work. The site emphasizes performance, SEO, and accessibility while maintaining a stunning visual experience. The architecture is thoughtfully designed to evolve into an e-commerce platform (Phase 2) without requiring restructuring.

**Vision:** Create a gallery platform that prioritizes artist visibility, visitor experience, and long-term scalability.

- **Phase 1 (Current):** Public gallery, presentation, and discovery.
- **Phase 2 (Future):** E-commerce integration (price, stock, checkout, shipping).

### Key Principles

- **SEO First** — Every page optimized for search engines
- **Accessibility WCAG 2.1 AA** — No compromises on accessibility
- **Mobile First** — Responsive design as default
- **Zero JS by default** — JavaScript only where needed (GSAP animations, theme toggle)
- **Performance** — Lighthouse ≥95 on all metrics
- **Code Quality** — SOLID, DRY, KISS, YAGNI principles
- **All code in English** — Bilingual content only

---

## Quick Start Path by Role

Choose your path based on your role:

```
🚀 NEW DEVELOPER
  → Start with SETUP.md (get running in 5 min)
  → Read ARCHITECTURE.md (understand the big picture)
  → Explore COMPONENTS.md (see what's available)
  → Check STRUCTURE.md (navigate the codebase)

📝 CONTENT CREATOR
  → Jump to CONTENT.md (add your first artwork)
  → Understand SEO.md (optimize visibility)
  → Reference SETUP.md if running dev server

🎨 DESIGNER / THEMER
  → Explore THEMING.md (customize colors & fonts)
  → Learn GSAP.md (add animations)
  → Review COMPONENTS.md (component styling)
  → Check CONFIG.md (Tailwind & CSS customization)

⚙️ DEVOPS / DEPLOYMENT
  → Start with CONFIG.md (all settings)
  → Review SETUP.md deployment section
  → Understand ARCHITECTURE.md (what gets built)
```

---

## Documentation Map

```
┌─ README.md (you are here)
│
├─ SETUP.md ──────┬─→ Getting started
│                 └─→ Troubleshooting
│
├─ ARCHITECTURE.md ──→ System design
│                    Component flow
│                    Data architecture
│
├─ STRUCTURE.md ──────→ File organization
│                      Directory tree
│
├─ COMPONENTS.md ─────┬─→ Component list
│                     ├─→ Props & interfaces
│                     └─→ Usage examples
│
├─ CONTENT.md ─────────→ Adding artworks
│                       Schema details
│
├─ CONFIG.md ──────────→ Astro config
│                       Tailwind setup
│                       Build settings
│
├─ THEMING.md ─────────→ Color system
│                       Dark/light modes
│                       CSS variables
│
├─ GSAP.md ────────────→ Animation patterns
│                       Performance tips
│
├─ SEO.md ─────────────→ SEO implementation
│                       Metadata strategy
│
└─ i18n.md ────────────→ Translations
                        Localization
```

---

## Documentation Structure

### Quick Start
- **[SETUP.md](./SETUP.md)** — Installation, development, and build commands

### Architecture & Design
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** — High-level system design, component hierarchy, data flow
- **[STRUCTURE.md](./STRUCTURE.md)** — Directory structure and file organization

### Development Guides
- **[COMPONENTS.md](./COMPONENTS.md)** — Component documentation and prop interfaces
- **[CONTENT.md](./CONTENT.md)** — How to add artworks and manage content
- **[i18n.md](./i18n.md)** — Internationalization (pt-BR + en)
- **[THEMING.md](./THEMING.md)** — Light/dark theme system
- **[GSAP.md](./GSAP.md)** — Animation guidelines with GSAP
- **[SEO.md](./SEO.md)** — SEO implementation and best practices

### Configuration
- **[CONFIG.md](./CONFIG.md)** — Astro, Tailwind, and project configuration details

---

## Tech Stack

```
Frontend Framework     Astro 6
CSS Framework         TailwindCSS v4
Animations            GSAP 3
Content               Markdown via Content Collections
Styling              CSS Custom Properties + Tailwind
Internationalization  Astro i18n
Type Safety          TypeScript strict mode
Build Tool           Vite (bundled with Astro)
```

---

## Development Workflow

```bash
# Clone and install
pnpm install

# Development server
pnpm dev

# Type checking
pnpm astro check

# Build for production
pnpm build

# Preview production build
pnpm preview
```

---

## Core Concepts at a Glance

### Collections
The `artworks` collection stores all gallery pieces as Markdown files in `src/content/artworks/`. Each file contains:
- Bilingual metadata (title, description, etc.)
- Layout specifications (mosaic grid positioning)
- Image references
- Tags and technical details

**See also:** [CONTENT.md](./CONTENT.md) for adding artworks

### Pages & Routing
- **Portuguese** — Root paths (`/`, `/galeria`, `/artwork/slug`)
- **English** — Prefixed with `/en/` (`/en/`, `/en/gallery`, `/en/art/slug`)

**See also:** [i18n.md](./i18n.md) for translation details

### Components
Reusable, single-responsibility components:
- **Layout components** — `BaseLayout`, `ArtworkLayout` (provide structure)
- **UI components** — `Header`, `Footer`, `SEO`, `ThemeToggle` (reusable across pages)
- **Domain components** — `ArtworkCard`, `MosaicRow` (specific to gallery)

**See also:** [COMPONENTS.md](./COMPONENTS.md) for full component reference

### Theme System
Dark mode via CSS class strategy:
- `.dark` class on `<html>` element
- CSS custom properties for all colors
- Persisted to `localStorage`
- No flash of wrong theme (FWOT prevention)

**See also:** [THEMING.md](./THEMING.md) for customization guide

### Internationalization
Two locales: `pt` (Portuguese, default) and `en` (English).
- UI strings centralized in `src/i18n/translations.ts`
- Content fields are bilingual in the schema (`title`/`titlePt`)
- Routing handled by Astro's built-in i18n

**See also:** [i18n.md](./i18n.md) for adding new translations

---

## Common Tasks

### Adding an artwork
See [CONTENT.md](./CONTENT.md) for step-by-step instructions and schema details.

### Styling a new component
Use Tailwind utilities and CSS custom properties. See [THEMING.md](./THEMING.md) for the color system and [COMPONENTS.md](./COMPONENTS.md) for styling patterns.

### Adding animations
Use GSAP via `data-animate` attributes. See [GSAP.md](./GSAP.md) for animation patterns and best practices.

### Translating UI text
Update `src/i18n/translations.ts`. See [i18n.md](./i18n.md) for localization workflow.

### SEO and metadata
Each page uses the `SEO` component. See [SEO.md](./SEO.md) for implementation details and JSON-LD schema.

---

## Performance & Accessibility

- **Images** — Automatic optimization via Astro `<Image>` component (AVIF/WebP, lazy loading, responsive)
- **CSS** — Tree-shaken Tailwind, critical CSS inlined
- **HTML** — Static output, zero runtime overhead
- **Accessibility** — Semantic HTML, ARIA labels, keyboard navigation, color contrast verified
- **Theme** — Respects `prefers-color-scheme` and `prefers-reduced-motion`

**See also:** [COMPONENTS.md](./COMPONENTS.md) for accessible component patterns; [GSAP.md](./GSAP.md) for animation accessibility

---

## Phase 2 Preparation

Phase 2 (e-commerce) is prepared for in the current design:
- Content schema includes optional `shop` field (disabled for Phase 1)
- `ArtworkLayout` has a reserved slot for a purchase component
- SEO includes JSON-LD Product schema placeholders
- No Phase 2 code is implemented yet (YAGNI principle)

When Phase 2 is ready, update the schema, enable the shop fields, and add the purchase component without restructuring.

---

## Troubleshooting

### Build failures
Run `pnpm astro check` to identify TypeScript errors.

### Images not loading
Ensure image files exist in `public/images/` and paths match frontmatter `src` fields.

### Dark mode not persisting
Check browser `localStorage` is enabled. FWOT script in `BaseLayout` runs on page load.

### Animations not playing
Check for `prefers-reduced-motion: reduce` in system settings. Verify `data-animate` attributes are present.

### i18n routes not generating
Ensure pages exist in both `src/pages/` (PT) and `src/pages/en/` (EN) directories.

---

## Contributing

When making changes:
1. Follow the SOLID and Clean Code principles
2. Keep all code in English (comments, variables, file names)
3. Use TypeScript for type safety
4. Test on both light and dark themes
5. Verify accessibility with keyboard navigation
6. Check performance with Lighthouse
7. Update this documentation if adding new patterns or components

---

## Resources

- [Astro Documentation](https://docs.astro.build)
- [TailwindCSS v4 Documentation](https://tailwindcss.com)
- [GSAP Documentation](https://gsap.com/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web.dev SEO Guide](https://web.dev/lighthouse-seo/)

---

## License

© 2024 AnnaLu. All rights reserved.
