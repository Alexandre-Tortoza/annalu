# Content Management Guide

## Overview

Content in AnnaLu is **purely Markdown-based**. No database, no CMS, no backend required. Adding, updating, or removing artworks is as simple as managing `.md` files.

The content system is built on Astro's Content Collections with Zod validation. Every markdown file is validated against a schema at build time.

---

## Quick Reference

### Minimal Artwork Example

The bare minimum to create a valid artwork:

```yaml
---
title: "Untitled"
titlePt: "Sem Título"
description: "A brief description in English."
descriptionPt: "Uma breve descrição em português."
publishedAt: 2024-04-28
cover:
  src: "/images/artwork-cover.jpg"
  alt: "What the image shows"
images:
  - src: "/images/artwork-1.jpg"
    alt: "Description of this image"
tags: ["abstract"]
mosaic:
  - imageIndex: 0
    colStart: 1
    colSpan: 12
---

Brief description here.
```

### Complete Artwork Example

All available fields populated:

```yaml
---
title: "Ocean Dreams"
titlePt: "Sonhos do Oceano"
description: "An abstract acrylic painting exploring the interplay of water, light, and emotion through fluid brushwork and layered color."
descriptionPt: "Uma pintura acrílica abstrata explorando a interação da água, luz e emoção através de pinceladas fluidas e cores em camadas."
publishedAt: 2024-01-15
cover:
  src: "/images/ocean-dreams-cover.jpg"
  alt: "Abstract acrylic painting with flowing blues, teals, and white brushstrokes on canvas"
images:
  - src: "/images/ocean-dreams-1.jpg"
    alt: "Full composition view of the acrylic painting"
    caption: "Complete work"
  - src: "/images/ocean-dreams-2.jpg"
    alt: "Detail of the center area showing layered blue tones"
    caption: "Center detail"
  - src: "/images/ocean-dreams-3.jpg"
    alt: "Close-up of the bottom edge showing texture and color transition"
tags: ["abstract", "acrylic", "water", "emotion"]
technique: "Acrylic on canvas"
dimensions: "100 × 80 cm"
year: 2023
featured: true
mosaic:
  - imageIndex: 0
    colStart: 1
    colSpan: 8
    rowSpan: 2
  - imageIndex: 1
    colStart: 9
    colSpan: 4
    rowSpan: 1
  - imageIndex: 2
    colStart: 9
    colSpan: 4
    rowSpan: 1
shop:
  available: false
  price: 150000
  stock: 1
  sku: "ART-2023-001"
---

# Detailed Description

This artwork explores the contrast between [description content...]
```

---

## Content Collection: `artworks`

### Location

All artwork files live in: `src/content/artworks/`

### File Naming

- **Filename** becomes the artwork ID/slug
- Use kebab-case (lowercase, hyphens): `masterpiece.md`, `watercolor-abstract.md`
- The slug will appear in URLs: `/artwork/masterpiece`

---

## Content Schema Cheat Sheet

Complete reference table for all available frontmatter fields:

| Field | Type | Required | Default | Min/Max | Description |
|-------|------|----------|---------|---------|-------------|
| **title** | string | ✅ | — | — | Artwork title in English |
| **titlePt** | string | ✅ | — | — | Artwork title in Portuguese |
| **description** | string | ✅ | — | max 160 chars | Short description in English (used in meta tags) |
| **descriptionPt** | string | ✅ | — | max 160 chars | Short description in Portuguese (used in meta tags) |
| **publishedAt** | date | ✅ | — | YYYY-MM-DD | Publication date (used for sorting) |
| **cover** | object | ✅ | — | — | Cover image metadata object |
| **cover.src** | string | ✅ | — | — | Path to cover image in `public/images/` |
| **cover.alt** | string | ✅ | — | — | Accessibility alt text for cover image |
| **images** | array | ✅ | — | min 1 item | Array of additional artwork images |
| **images[].src** | string | ✅ | — | — | Path to image in `public/images/` |
| **images[].alt** | string | ✅ | — | — | Accessibility alt text (required for each) |
| **images[].caption** | string | ❌ | — | — | Optional caption displayed under image |
| **tags** | array | ✅ | — | — | Array of tag strings for categorization |
| **technique** | string | ❌ | — | — | Artistic technique/medium (e.g., "Acrylic on canvas") |
| **dimensions** | string | ❌ | — | — | Physical dimensions (e.g., "100 × 80 cm") |
| **year** | number | ❌ | — | 1900–2100 | Year artwork was created |
| **featured** | boolean | ❌ | `false` | — | Show in "latest works" on landing page? |
| **mosaic** | array | ❌ | — | min 1 item if gallery | Grid layout specification (see Mosaic section) |
| **mosaic[].imageIndex** | number | ✅ | — | 0–∞ | Which image from `images[]` to display |
| **mosaic[].colStart** | number | ✅ | — | 1–12 | Starting column in 12-column grid |
| **mosaic[].colSpan** | number | ✅ | — | 1–12 | How many columns to span |
| **mosaic[].rowSpan** | number | ❌ | `1` | 1–∞ | How many rows to span |
| **shop** | object | ❌ | — | — | **Phase 2:** E-commerce data (disabled Phase 1) |
| **shop.available** | boolean | ❌ | — | — | Is the artwork for sale? |
| **shop.price** | number | ❌ | — | 0–∞ | Price in cents (e.g., 150000 = $1500) |
| **shop.stock** | number | ❌ | — | 0–∞ | Quantity in stock |
| **shop.sku** | string | ❌ | — | — | Stock keeping unit for inventory |

---

## Frontmatter Schema

Every artwork `.md` file **must** include frontmatter with required fields. Missing required fields will fail the build.

### Complete Example

```markdown
---
title: "Masterpiece"
titlePt: "Obra Prima"
description: "An abstract acrylic composition exploring the interplay of color and form."
descriptionPt: "Uma composição acrílica abstrata explorando a interação de cor e forma."
publishedAt: 2024-01-15
cover:
  src: "/images/masterpiece-cover.jpg"
  alt: "Abstract acrylic painting with warm colors and fluid shapes"
images:
  - src: "/images/masterpiece-1.jpg"
    alt: "Full view of the artwork showing the entire composition"
    caption: "Complete composition (optional)"
  - src: "/images/masterpiece-2.jpg"
    alt: "Close-up detail of the center section"
  - src: "/images/masterpiece-3.jpg"
    alt: "Detail of the bottom-right area showing texture"
tags: ["abstract", "acrylic", "color-study"]
technique: "Acrylic on canvas"
dimensions: "100 × 80 cm"
year: 2023
featured: true
mosaic:
  - imageIndex: 0
    colStart: 1
    colSpan: 8
    rowSpan: 2
  - imageIndex: 1
    colStart: 9
    colSpan: 4
    rowSpan: 1
  - imageIndex: 2
    colStart: 9
    colSpan: 4
    rowSpan: 1
shop:
  available: false
  price: 1500
  stock: 1
  sku: "ART-2023-001"
---

# Detailed Description

This artwork explores the contrast between geometric and organic forms. The composition uses a limited color palette of reds, oranges, and yellows to create visual harmony.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

## Process

The artist began with sketches exploring different compositions before settling on this final arrangement. Multiple layers of paint were applied to achieve the desired depth and texture.

---

## Inspiration

Inspired by traditional watercolor techniques, this work demonstrates how acrylic can be used to achieve similar effects.

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
```

---

## Field Reference

### Required Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `title` | string | Artwork title in English | `"Masterpiece"` |
| `titlePt` | string | Artwork title in Portuguese | `"Obra Prima"` |
| `description` | string | Short description in English (≤160 chars, used in meta tags) | `"An abstract acrylic..."` |
| `descriptionPt` | string | Short description in Portuguese (≤160 chars) | `"Uma composição..."` |
| `publishedAt` | date | Publication date (YYYY-MM-DD format) | `2024-01-15` |
| `cover` | object | Cover image for the artwork | See below |
| `cover.src` | string | Path to cover image in `public/images/` | `"/images/artwork-cover.jpg"` |
| `cover.alt` | string | **Required.** Accessibility alt text for cover image | `"Abstract painting..."` |
| `images` | array | Array of artwork images | See below |
| `images[].src` | string | Path to image file | `"/images/artwork-1.jpg"` |
| `images[].alt` | string | **Required.** Alt text for accessibility | `"Detail of the work"` |
| `tags` | array | Array of tag strings for categorization | `["abstract", "acrylic"]` |
| `mosaic` | array | Grid positioning for gallery display | See Mosaic section |

### Optional Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `images[].caption` | string | — | Optional caption displayed under image |
| `technique` | string | — | Artistic technique/medium | `"Acrylic on canvas"` |
| `dimensions` | string | — | Physical dimensions | `"100 × 80 cm"` |
| `year` | number | — | Year created | `2023` |
| `featured` | boolean | `false` | Show in "latest works" on landing page |
| `shop` | object | — | **Phase 2:** e-commerce details (disabled Phase 1) |
| `shop.available` | boolean | — | Is the artwork for sale? |
| `shop.price` | number | — | Selling price in cents | `150000` (= $1500) |
| `shop.stock` | number | — | Quantity in stock |
| `shop.sku` | string | — | Stock keeping unit |

---

## Mosaic Grid Layout

The `mosaic` field controls how your artwork displays in the gallery mosaic.

### Grid System

The gallery uses a **12-column CSS grid**:

```
Col:  1   2   3   4   5   6   7   8   9   10  11  12
     ┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┐
Row1 │   │   │   │   │   │   │   │   │   │   │   │   │
     ├───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
Row2 │   │   │   │   │   │   │   │   │   │   │   │   │
     └───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┘
```

### Mosaic Entry Structure

```ts
{
  imageIndex: 0,    // Which image from images[] to display
  colStart: 1,      // Starting column (1-12)
  colSpan: 8,       // How many columns to span (1-12)
  rowSpan: 1        // How many rows to span (optional, default 1)
}
```

### Example Layouts

**See** [Common Patterns — Pattern 1: Setting Up Mosaic Layouts](#pattern-1-setting-up-mosaic-layouts) **for detailed examples and code.**

---

## Common Patterns & Examples

### Pattern 1: Setting Up Mosaic Layouts

#### Simple: Single full-width image
```yaml
mosaic:
  - imageIndex: 0
    colStart: 1
    colSpan: 12
```

#### Two images side-by-side
```yaml
mosaic:
  - imageIndex: 0
    colStart: 1
    colSpan: 6
  - imageIndex: 1
    colStart: 7
    colSpan: 6
```

#### L-shaped layout (feature image + details)
```yaml
images:
  - src: "/images/work-1.jpg"
    alt: "Main composition"
  - src: "/images/work-2.jpg"
    alt: "Detail shot"
  - src: "/images/work-3.jpg"
    alt: "Close-up texture"
mosaic:
  - imageIndex: 0      # Large image on left
    colStart: 1
    colSpan: 8
    rowSpan: 2
  - imageIndex: 1      # Small image top-right
    colStart: 9
    colSpan: 4
  - imageIndex: 2      # Small image bottom-right
    colStart: 9
    colSpan: 4
```

#### Three equal columns
```yaml
mosaic:
  - imageIndex: 0
    colStart: 1
    colSpan: 4
  - imageIndex: 1
    colStart: 5
    colSpan: 4
  - imageIndex: 2
    colStart: 9
    colSpan: 4
```

#### Feature image (full width) with 2 below
```yaml
mosaic:
  - imageIndex: 0      # Full width top
    colStart: 1
    colSpan: 12
  - imageIndex: 1      # Half width left
    colStart: 1
    colSpan: 6
  - imageIndex: 2      # Half width right
    colStart: 7
    colSpan: 6
```

---

### Pattern 2: Adding Multiple Images

Every artwork can have multiple images. Reference them by index in the `mosaic` field:

```yaml
images:
  - src: "/images/ocean-1.jpg"
    alt: "Full composition from front view"
    caption: "Entire painting"
  - src: "/images/ocean-2.jpg"
    alt: "Detail of the blue layer showing brushwork"
    caption: "Center detail"
  - src: "/images/ocean-3.jpg"
    alt: "Macro shot of texture in bottom corner"
    caption: "Surface detail"
  - src: "/images/ocean-4.jpg"
    alt: "Work-in-progress shot during creation"
    caption: "In progress"

mosaic:
  - imageIndex: 0    # Use first image
    colStart: 1
    colSpan: 12
  - imageIndex: 1    # Use second image
    colStart: 1
    colSpan: 6
  - imageIndex: 2    # Use third image
    colStart: 7
    colSpan: 6
  # imageIndex: 3 (fourth image) is not shown in gallery
  # but still available for detail page
```

---

### Pattern 3: Managing Bilingual Content

All text fields have English and Portuguese versions:

```yaml
# Titles
title: "Ocean Dreams"
titlePt: "Sonhos do Oceano"

# Descriptions (short, for meta tags)
description: "Abstract acrylic painting exploring water and light."
descriptionPt: "Pintura acrílica abstrata explorando água e luz."

# Techniques and metadata are NOT translated (same for both languages)
technique: "Acrylic on canvas"
dimensions: "100 × 80 cm"
year: 2023
```

**Rule:** Only `title`, `titlePt`, `description`, and `descriptionPt` are bilingual. All other fields (technique, dimensions, tags) use the same value for both languages.

---

### Pattern 4: Featured vs. Non-Featured Artworks

#### Featured (appears on landing page)
```yaml
featured: true
publishedAt: 2024-01-15
```

#### Non-featured (gallery only)
```yaml
featured: false
# Or omit 'featured' entirely (defaults to false)
publishedAt: 2023-06-20
```

The landing page displays the 3 most recent **featured** artworks (sorted by `publishedAt` descending). Update `publishedAt` to control the order.

---

## Validation Rules & Constraints

### Field Constraints

| Constraint | Affected Field | Example | Error |
|-----------|--------|---------|-------|
| **Max 160 chars** | `description`, `descriptionPt` | Descriptions used in social media preview | `Error: description too long (167 > 160)` |
| **YYYY-MM-DD format** | `publishedAt` | `2024-01-15` (valid), `01/15/2024` (invalid) | `Error: Invalid date format` |
| **1–12 range** | `mosaic[].colStart`, `mosaic[].colSpan` | Grid columns must be in valid range | `Error: colStart must be 1-12` |
| **All alt text required** | `cover.alt`, `images[].alt` | Every image must have descriptive alt text | `Error: Missing required alt text` |
| **Kebab-case filenames** | File name (not frontmatter) | `ocean-dreams.md` (✅), `ocean dreams.md` (❌) | URLs become malformed |
| **Unique file names** | File name | No two artworks can have the same filename | Second one overwrites first in slug conflicts |

---

### Validation During Build

Run this before pushing to catch errors:

```bash
pnpm astro check
```

This command validates all content files against the schema and reports:
- Missing required fields
- Invalid date formats
- Type mismatches
- Alt text issues
- Mosaic grid positioning errors

---

## Markdown Body Content

After the frontmatter (the closing `---`), write your artwork description in Markdown:

```markdown
---
title: "..."
...
---

# Heading

This is a paragraph with **bold** and *italic* text.

## Subheading

- Bullet point
- Another point
- Third point

1. Numbered list
2. Second item

> Blockquote about the artwork

[Link text](https://example.com)

`inline code` or:

```
code block
```

---

This is a horizontal rule.
```

### Best Practices

- Keep descriptions **concise and poetic** — Lorem ipsum is fine for Phase 1
- Use headings to structure the content (`# Main`, `## Subsection`)
- Avoid very long paragraphs — break them up for readability
- Use quotes, lists, and emphasis to make content scannable
- No HTML — use Markdown syntax only

---

## Adding Images

### Step 1: Prepare Images

Before creating the `.md` file:

1. Prepare high-quality image files (JPG, PNG, WebP recommended)
2. Recommended minimum size: **800×600px** for covers, **1200×900px** for gallery images
3. Optimize for web (compress without losing quality)
4. Use descriptive file names: `masterpiece-cover.jpg`, `masterpiece-1.jpg`
5. **See [SETUP.md](./SETUP.md) for detailed image optimization guide.**

### Step 2: Place in `public/images/`

Move image files to `AnnaLu/public/images/`:

```
public/images/
├── masterpiece-cover.jpg
├── masterpiece-1.jpg
├── masterpiece-2.jpg
├── watercolor-abstract-cover.jpg
└── ...
```

### Step 3: Reference in Frontmatter

```yaml
cover:
  src: "/images/masterpiece-cover.jpg"
  alt: "Descriptive alt text for accessibility"
images:
  - src: "/images/masterpiece-1.jpg"
    alt: "Detailed description of this image"
    caption: "Optional caption"
  - src: "/images/masterpiece-2.jpg"
    alt: "Another detailed description"
```

### Image Requirements

- **Alt text required** — every image must have descriptive alt text (accessibility + SEO)
- **Paths start with `/`** — `src` paths are absolute from project root
- **Stored in `public/images/`** — directory name matters
- **File extensions matter** — `.jpg`, `.png`, `.webp`, etc.
- **Aspect ratio** — Use consistent ratios within a mosaic (e.g., all 4:3 or all 16:9) for better layouts

---

## SEO & Metadata

Artwork titles, descriptions, and cover images are automatically used for SEO:
- Meta description from `description` / `descriptionPt`
- Open Graph image from `cover.src`
- JSON-LD VisualArtwork schema on detail pages

**See [SEO.md](./SEO.md) for detailed SEO strategy and metadata guidelines.**

---

## Featured Artworks

To show an artwork in the "latest works" section on the landing page:

```yaml
featured: true
```

The landing page displays the 3 latest featured artworks, sorted by `publishedAt` descending.

---

## Tags & Categorization

Tags are simple strings used for future filtering:

```yaml
tags: ["abstract", "acrylic", "color-study", "large-scale"]
```

Suggestions (not required):
- Style: `abstract`, `figurative`, `landscape`, `portrait`, `still-life`
- Medium: `acrylic`, `watercolor`, `oil`, `charcoal`, `mixed-media`
- Theme: `nature`, `urban`, `emotion`, `geometric`, `organic`
- Size: `small-scale`, `medium-scale`, `large-scale`

---

## Phase 2: Shop Field (Disabled for Phase 1)

The `shop` field is optional and disabled for Phase 1 (not displayed anywhere):

```yaml
shop:
  available: false
  price: 150000              # In cents (150000 = $1500)
  stock: 1
  sku: "ART-2023-001"
```

This field exists so you can populate it now, and Phase 2 will automatically enable it without schema changes.

---

## Validation & Build Errors

### Common Errors

**Missing required field:**
```
Error: [masterpiece.md]
  Missing required field 'descriptionPt'
```

Solution: Add the field to frontmatter.

**Invalid date format:**
```
Error: [masterpiece.md]
  Field 'publishedAt' must be a date, got '01/15/2024'
```

Solution: Use YYYY-MM-DD format: `2024-01-15`

**Image not found:**
The build won't fail, but the `<Image>` component will warn if the file doesn't exist in `public/images/`.

**Invalid mosaic column:**
```
Error: [masterpiece.md]
  Field 'mosaic.0.colStart' must be between 1 and 12
```

Solution: Check grid positioning (valid range is 1-12 columns).

### Debugging

Run before pushing:
```bash
pnpm astro check
```

This validates all content without building. It will catch schema errors immediately.

---

## Publishing Workflow

### 1. Create File

```bash
touch src/content/artworks/my-new-artwork.md
```

### 2. Write Frontmatter & Body

Copy the template above and fill in your details.

### 3. Add Images

Place image files in `public/images/` matching the paths in frontmatter.

### 4. Validate

```bash
pnpm astro check
```

Fix any errors.

### 5. Preview

```bash
pnpm dev
```

Open http://localhost:4321 and verify:
- Artwork appears in `/galeria`
- Detail page at `/artwork/my-new-artwork` works
- Images display correctly
- Both language versions work (`/en/gallery`, `/en/art/my-new-artwork`)

### 6. Deploy

Commit and push:
```bash
git add src/content/artworks/my-new-artwork.md public/images/...
git commit -m "Add new artwork: My New Artwork"
git push
```

The site rebuilds automatically, and the artwork is live.

---

## Editing Existing Content

To update an artwork:

1. Edit the `.md` file
2. Update images in `public/images/` if needed
3. Run `pnpm dev` to preview
4. Commit and push

The detail page URL (`/artwork/slug`) never changes (slug comes from filename), so old links remain valid.

---

## Deleting Content

To remove an artwork:

1. Delete `src/content/artworks/artwork-name.md`
2. Delete images from `public/images/` (optional but recommended to save space)
3. Commit and push

The page and all links to it disappear on next deploy.

---

## Best Practices

✅ **Do:**
- Use consistent, descriptive file names
- Write detailed alt text for every image
- Include multiple images (ideally 2-4) for rich gallery experience
- Use thoughtful mosaic layouts that showcase your work
- Keep descriptions concise but evocative
- Proofread copy for typos before publishing
- Update `publishedAt` date to actual publication date

❌ **Don't:**
- Use spaces in file names (use kebab-case)
- Skip alt text (accessibility + SEO critical)
- Leave `descriptionPt` or `description` blank
- Use very long, unwieldy titles
- Mix image formats inconsistently
- Publish artwork without proofing

---

## Templates

### Minimal Artwork

```markdown
---
title: "Untitled"
titlePt: "Sem Título"
description: "Lorem ipsum dolor sit amet."
descriptionPt: "Lorem ipsum dolor sit amet."
publishedAt: 2024-04-28
cover:
  src: "/images/untitled-cover.jpg"
  alt: "Abstract painting with blue and red tones"
images:
  - src: "/images/untitled-1.jpg"
    alt: "Detail view"
tags: ["abstract"]
mosaic:
  - imageIndex: 0
    colStart: 1
    colSpan: 12
---

A brief description of the artwork.
```

### Full-Featured Artwork

See the Complete Example at the top of this guide.

---

## Maintenance

### Checking Content Integrity

```bash
pnpm astro check
```

Runs schema validation on all content files.

### Finding Broken Image References

The build process will warn if referenced images don't exist:

```
Warning: Image not found at /images/artwork-missing.jpg
```

Check `public/images/` and update the frontmatter path.

### Sitemap Verification

After building, check `dist/sitemap-0.xml` to verify all artwork detail pages are indexed:

```bash
pnpm build
cat dist/sitemap-0.xml | grep artwork
```

Should list all `/artwork/slug` pages (both PT and EN versions).

---

## Related Documentation

- **[COMPONENTS.md](./COMPONENTS.md)** — How artworks are rendered (ArtworkCard, MosaicRow, ArtworkLayout components)
- **[SEO.md](./SEO.md)** — SEO strategy, metadata best practices, structured data for artworks
- **[SETUP.md](./SETUP.md)** — Image optimization, project setup, file structure
- **[i18n.md](./i18n.md)** — Bilingual content management, language routing
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** — Project structure overview
- **[CLAUDE.md](../CLAUDE.md)** — Code conventions, stack overview, Phase 1/Phase 2 planning
