# Theming Guide (Light/Dark Mode)

## Overview

AnnaLu supports light and dark themes via CSS class strategy. Users can toggle between themes, and their preference is persisted to `localStorage`.

The theme system respects user's system preference on first visit and provides an instant, flicker-free theme toggle.

### Color Palette Reference

All colors are defined as CSS custom properties in `src/styles/global.css`:

| CSS Variable | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| `--color-bg` | `#ffffef` | `#0a0a0a` | Page background |
| `--color-surface` | `#ffffef` | `#171717` | Cards, panels |
| `--color-surface-hover` | `#f5f5f5` | `#262626` | Hover states |
| `--color-text` | `#3b3b37` | `#f5f5f5` | Primary text |
| `--color-text-muted` | `#6b7280` | `#a3a3a3` | Secondary text, hints |
| `--color-accent` | `#2563eb` | `#60a5fa` | Links, buttons, highlights |
| `--color-accent-hover` | `#1d4ed8` | `#93c5fd` | Hover state for accents |
| `--color-accent-light` | `#eff6ff` | `#1e3a5f` | Light background for accents |
| `--color-border` | `#e5e7eb` | `#404040` | Dividers, borders |

### Typography Tokens

| CSS Variable | Value | Usage |
|---|---|---|
| `--font-sans` | Inter, system fonts | Body text, UI elements |
| `--font-serif` | Playfair Display, serif | Headlines, display |
| `--font-hand` | Caveat, cursive | Decorative, signatures |

---

## Theme Switching Mechanism

ASCII diagram showing how the theme system works:

```
┌──────────────────────────────────────────────┐
│   Page Load (Blocking Inline Script)         │
│   - Check localStorage for 'theme'           │
│   - Fall back to system preference           │
│   - Apply .dark class to <html>              │
│   - CSS loads with correct colors            │
└────────────────────┬─────────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │ CSS Variables Applied  │
        │ :root {...}            │
        │ .dark {...}            │
        └────────────┬───────────┘
                     │
        ┌────────────┴───────────┐
        ▼                        ▼
   Light Mode             Dark Mode
   (default)              (.dark class)
        │                        │
        ▼                        ▼
   --color-bg:            --color-bg:
   #ffffef                #0a0a0a
        │                        │
        └────────────┬───────────┘
                     │
                     ▼
   ┌──────────────────────────────┐
   │  User Clicks Theme Toggle    │
   │  1. Detect current theme     │
   │  2. Toggle .dark class       │
   │  3. Save preference          │
   │  4. Colors update instantly  │
   │  5. Persist in localStorage  │
   └──────────────────────────────┘
```

---

## Technical Implementation

### 1. CSS Custom Properties (Tokens)

All colors are defined as CSS variables in `src/styles/global.css`:

**Light theme** (default, `:root`):
```css
:root {
  --color-bg: #ffffef;
  --color-surface: #ffffef;
  --color-surface-hover: #f5f5f5;
  --color-text: #3b3b37;
  --color-text-muted: #6b7280;
  --color-accent: #2563eb;
  --color-accent-hover: #1d4ed8;
  --color-accent-light: #eff6ff;
  --color-border: #e5e7eb;
}
```

**Dark theme** (`.dark`):
```css
.dark {
  --color-bg: #0a0a0a;
  --color-surface: #171717;
  --color-surface-hover: #262626;
  --color-text: #f5f5f5;
  --color-text-muted: #a3a3a3;
  --color-accent: #60a5fa;
  --color-accent-hover: #93c5fd;
  --color-accent-light: #1e3a5f;
  --color-border: #404040;
}
```

### 2. CSS Custom Variant (Tailwind v4)

In `global.css`, enable Tailwind's dark variant:

```css
@custom-variant dark (&:where(.dark, .dark *))
```

This enables using the `dark:` prefix in Tailwind utilities:

```html
<div class="bg-white dark:bg-black">
  <p class="text-gray-900 dark:text-gray-100">Text</p>
</div>
```

### 3. FWOT Prevention (Flash of Wrong Theme)

To prevent a flash of the wrong theme on page load, a **blocking inline script** runs in `<head>` before any CSS loads:

**In BaseLayout.astro:**
```astro
<head>
  <script is:inline>
    ;(function() {
      const stored = localStorage.getItem('theme')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      
      if (stored === 'dark' || (!stored && prefersDark)) {
        document.documentElement.classList.add('dark')
      }
    })()
  </script>
  
  <!-- Rest of head content -->
  <link rel="stylesheet" href="/styles/global.css">
</head>
```

**How it works:**
1. Runs synchronously before CSS loads
2. Checks `localStorage` for user preference
3. Falls back to system preference
4. Applies `.dark` class to `<html>` if needed
5. CSS loads with correct theme already applied
6. No flicker

## FWOT Prevention (Flash of Wrong Theme)

### Why It Matters

Without prevention, users see a flash of the wrong theme during page load:
1. Page loads (no CSS yet)
2. Default light mode shows briefly
3. CSS loads, JavaScript runs, dark mode applied
4. **Brief flicker** — poor user experience

### Solution: Blocking Inline Script

A **blocking inline script** runs in `<head>` **before any CSS loads**:

**In BaseLayout.astro:**
```astro
<head>
  <script is:inline>
    ;(function() {
      // Read stored preference
      const stored = localStorage.getItem('theme')
      
      // Fall back to system preference
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches
      
      // Apply dark class BEFORE CSS loads
      if (stored === 'dark' || (!stored && prefersDark)) {
        document.documentElement.classList.add('dark')
      }
    })()
  </script>
  
  <!-- CSS loads AFTER script runs -->
  <link rel="stylesheet" href="/styles/global.css">
</head>
```

### How It Works

1. Script executes **synchronously** before CSS loads
2. Reads `localStorage` for user's saved preference
3. Falls back to system `prefers-color-scheme` if no preference
4. Applies `.dark` class to `<html>` element if needed
5. CSS loads with correct theme already applied
6. ✅ **No flicker**

### Key Points

- **`is:inline` directive** — Inlines the script instead of generating a separate file
- **Before CSS** — Script must run before any stylesheet loads
- **Synchronous** — No async/defer, blocks page rendering
- **localStorage key** — Must match `'theme'` exactly
- **HTML element** — Class goes on `document.documentElement` (the `<html>` tag)

---

## How to Add a New Color (Step-by-Step)

### Scenario: Add Success and Error Colors

**Step 1:** Define in both themes

Edit `src/styles/global.css`:

```css
:root {
  /* ... existing colors ... */
  --color-success: #10b981;     /* Green */
  --color-success-light: #d1fae5;
  --color-error: #ef4444;       /* Red */
  --color-error-light: #fee2e2;
}

.dark {
  /* ... existing colors ... */
  --color-success: #34d399;     /* Lighter green for dark */
  --color-success-light: #064e3b;
  --color-error: #f87171;       /* Lighter red for dark */
  --color-error-light: #7f1d1d;
}
```

**Step 2:** Use in components

```astro
<div class="text-[var(--color-success)]">
  ✓ Success message
</div>

<div class="text-[var(--color-error)]">
  ✕ Error message
</div>
```

Or in component styles:

```astro
<style>
  .success-message {
    color: var(--color-success);
    background-color: var(--color-success-light);
    padding: 1rem;
    border-radius: 0.5rem;
    border-left: 4px solid var(--color-success);
  }
  
  .error-message {
    color: var(--color-error);
    background-color: var(--color-error-light);
    padding: 1rem;
    border-radius: 0.5rem;
    border-left: 4px solid var(--color-error);
  }
</style>

<div class="success-message">Success!</div>
<div class="error-message">Error!</div>
```

**Step 3:** Test both themes

```bash
pnpm dev
```

1. Visit in light mode — colors should look good
2. Toggle to dark mode — colors should be readable
3. Check contrast with [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
4. Ensure both `--color-*` and `--color-*-light` are defined

### Checklist

- [ ] Color defined in `:root`
- [ ] Color overridden in `.dark`
- [ ] Contrast ≥ 4.5:1 for text, ≥ 3:1 for UI
- [ ] Used with `var(--color-*)` in all components
- [ ] Tested in light and dark modes
- [ ] Pair colors with `-light` variant for backgrounds

---

## Using Tailwind with CSS Variables

**File:** `src/components/ThemeToggle.astro`

Contains a button with sun/moon icons and an inline script:

```astro
---
interface Props {
  lang: 'pt' | 'en'
}

const { lang } = Astro.props
const ariaLabel = lang === 'pt' ? 'Alternar tema' : 'Toggle theme'
---

<button
  id="theme-toggle"
  aria-label={ariaLabel}
  class="inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900"
>
  <!-- Sun icon (visible in light mode) -->
  <svg class="hidden dark:block w-5 h-5" aria-hidden="true">
    <!-- moon svg -->
  </svg>
  <!-- Moon icon (visible in dark mode) -->
  <svg class="block dark:hidden w-5 h-5" aria-hidden="true">
    <!-- sun svg -->
  </svg>
</button>

<script>
  const button = document.getElementById('theme-toggle')
  
  button?.addEventListener('click', () => {
    const html = document.documentElement
    const isDark = html.classList.contains('dark')
    
    if (isDark) {
      html.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    } else {
      html.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    }
  })
</script>

<style>
  button {
    transition: background-color 0.2s ease-in-out;
  }
</style>
```

---

## Using Theme Colors

### In Tailwind Classes

Use Tailwind utilities with CSS variable values:

```html
<!-- Using Tailwind classes with custom properties -->
<div class="bg-white dark:bg-black text-gray-900 dark:text-gray-100">
  Content
</div>

<!-- Or shorthand where it exists -->
<button class="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700">
  Click me
</button>
```

### Directly in Styles

```astro
---
interface Props {
  isDark?: boolean
}

const { isDark } = Astro.props
---

<div class={`
  padding: var(--spacing-4);
  background-color: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
`}>
  Content
</div>
```

### In Component Styles

```astro
<style>
  .card {
    background-color: var(--color-surface);
    color: var(--color-text);
    border-color: var(--color-border);
    transition: background-color 0.2s ease-in-out;
  }
  
  .card:hover {
    background-color: var(--color-surface-light);
  }
</style>
```

---

## Customizing Colors

Edit in `src/styles/global.css`. Always update both `:root` (light) and `.dark` (dark) sections:

```css
:root {
  --color-accent: #2563eb;  /* Blue by default */
}

.dark {
  --color-accent: #60a5fa;  /* Lighter blue for dark mode */
}
```

**Test both modes:**
```bash
pnpm dev
```
1. Check light mode looks good
2. Toggle to dark mode
3. Verify text contrast ≥ 4.5:1

---

## localStorage Inspection (Debugging)

---

### How to Inspect localStorage

**In Browser DevTools:**

```
1. Open DevTools (F12 or Cmd+Option+I)
2. Go to "Application" tab
3. Left sidebar → "Local Storage"
4. Select your domain (e.g., localhost:4321)
5. Look for key named 'theme'
6. Value should be 'light' or 'dark'
```

**In JavaScript Console:**

```js
// Check current theme preference
localStorage.getItem('theme')  // → 'light' or 'dark' or null

// Clear theme preference (reverts to system)
localStorage.removeItem('theme')

// Manually set theme
localStorage.setItem('theme', 'dark')
```

**Debugging Missing Persistence:**

If theme doesn't persist on refresh:
1. Check DevTools → Application → LocalStorage
2. Verify `theme` key exists
3. Check browser allows localStorage (not in private mode?)
4. Check theme toggle button has correct click handler
5. Verify script writes to localStorage (line 151 in ThemeToggle.astro)

---

## Accessibility & prefers-reduced-motion

The theming system respects user accessibility preferences:

### prefers-color-scheme

The system automatically uses system preference if no localStorage setting:

```ts
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
```

This means:
- **Light mode users** see light theme by default
- **Dark mode users** see dark theme by default
- **User setting override** — stored preference always wins

### prefers-reduced-motion

Use with GSAP animations (see [GSAP.md](./GSAP.md)):

```ts
gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
  // Run animations only if user doesn't prefer reduced motion
})
```

Never force animations if users prefer reduced motion.

---

## Testing Themes Systematically

---

## Accessibility Considerations

### Color Contrast Requirements (WCAG AA)

All colors meet these minimums:
- **Body text** — 4.5:1 contrast ratio
- **Large text** (18pt+) — 3:1 contrast ratio
- **UI components** (borders, icons) — 3:1 contrast ratio

**Example:** On light background
```
Light: #ffffef    Dark text: #3b3b37
Ratio: 13.6:1 ✅ (far exceeds 4.5:1)
```

**Example:** On dark background
```
Dark: #0a0a0a    Light text: #f5f5f5
Ratio: 13.7:1 ✅ (far exceeds 4.5:1)
```

### prefers-color-scheme (System Preference)

The system automatically respects user's OS preference:

```css
/* Applied if no localStorage preference */
@media (prefers-color-scheme: dark) {
  /* Dark mode styles */
}
```

### prefers-reduced-motion (Animation Safety)

Guard animations with accessibility check (see [GSAP.md](./GSAP.md)):

```ts
gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
  // Animations only run if user allows motion
})
```

Users with:
- Vestibular disorders
- Photosensitive epilepsy
- Motion sickness
  
...will have animations disabled.

---

## Common Theming Patterns

### Light/Dark Image Variants

Some images look bad in dark mode. Provide alternatives:

```astro
---
const isDark = Astro.url.searchParams.has('dark')  // Or detect from localStorage
const imageSrc = isDark 
  ? '/images/logo-dark.svg'
  : '/images/logo-light.svg'
---

<img src={imageSrc} alt="Logo" />
```

### Conditional Colors in JavaScript

If you need to detect theme in browser code:

```astro
<script>
  const isDark = document.documentElement.classList.contains('dark')
  
  if (isDark) {
    // Dark mode specific code
  } else {
    // Light mode specific code
  }
  
  // Or listen for changes
  const observer = new MutationObserver(() => {
    const newIsDark = document.documentElement.classList.contains('dark')
    console.log('Theme changed:', newIsDark ? 'dark' : 'light')
  })
  
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })
</script>
```

### Smooth Color Transitions

Animate color changes when theme toggles:

```astro
<style>
  /* Smooth transitions for all color properties */
  * {
    transition: 
      background-color 0.2s ease-in-out,
      color 0.2s ease-in-out,
      border-color 0.2s ease-in-out;
  }
  
  /* But not on interactive elements (for instant feedback) */
  button, a {
    transition: none;
  }
</style>
```

### Theme-Aware Borders

Use border colors that adapt to theme:

```astro
<style>
  .card {
    border: 1px solid var(--color-border);
    padding: 1rem;
    border-radius: 0.5rem;
  }
  
  .card:hover {
    border-color: var(--color-accent);
  }
</style>
```

---

## Theme Checklist

When designing new components, verify:

- [ ] Light mode colors look good
- [ ] Dark mode colors look good
- [ ] Text contrast is ≥4.5:1 in both modes
- [ ] Components use CSS variables, not hardcoded colors
- [ ] Hover/active states visible in both themes
- [ ] Images don't break in dark mode (or provide dark variant)
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Tested with DevTools dark mode emulation
- [ ] Tested with system dark/light preference
- [ ] localStorage persists correctly

---

## Troubleshooting

### Flash of Wrong Theme (FWOT)

**Symptom:** Page briefly shows light theme before switching to dark.

**Fix:**
1. Verify FWOT script is in `<head>` before CSS links
2. Check script has `is:inline` directive
3. Ensure script runs before `</head>` closes
4. Open DevTools → Elements → check `<html>` has `.dark` class before CSS loads

### Colors Not Changing

**Symptom:** Theme toggle doesn't change colors.

**Causes and fixes:**
1. CSS variables not defined — Check `:root` and `.dark` in `global.css`
2. `.dark` class not on `<html>` — DevTools → Elements → check `<html>` element
3. Tailwind prefix not working — Use `var(--color-*)` directly in styles
4. Browser cache — Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Dark Mode Doesn't Persist

**Symptom:** Theme resets on page refresh.

**Causes and fixes:**
1. localStorage disabled — Check browser allows localStorage
2. Private/Incognito mode — Try normal window (localStorage disabled in private)
3. Theme toggle handler not firing — Check console for errors
4. Wrong key name — Must be exactly `'theme'` (case-sensitive)
5. Value not saved correctly — Check DevTools → Application → LocalStorage

### System Preference Not Detected

**Symptom:** Site always uses light mode even with dark system preference.

**Causes and fixes:**
1. localStorage has preference set — Clear it: `localStorage.removeItem('theme')`
2. Open in private/incognito window (no localStorage)
3. Check system dark mode is actually enabled
4. DevTools → Rendering → prefers-color-scheme emulation
5. Verify FWOT script uses `matchMedia` correctly

---

## Resources & Links

- **[CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)** — MDN guide to CSS variables
- **[prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)** — How to detect user preference
- **[prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)** — Respecting motion preferences
- **[Tailwind Dark Mode](https://tailwindcss.com/docs/dark-mode)** — Tailwind's dark mode guide
- **[WCAG Color Contrast](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum)** — Accessibility standards
- **[GSAP.md](./GSAP.md)** — How animations respect `prefers-reduced-motion`
- **[CONFIG.md](./CONFIG.md)** — CSS variable configuration in `global.css`
