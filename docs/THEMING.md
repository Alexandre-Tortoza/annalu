# Theming Guide (Light/Dark Mode)

## Overview

AnnaLu supports light and dark themes via CSS class strategy. Users can toggle between themes, and their preference is persisted to `localStorage`.

The theme system respects user's system preference on first visit and provides an instant, flicker-free theme toggle.

---

## Technical Implementation

### 1. CSS Custom Properties (Tokens)

All colors are defined as CSS variables in `src/styles/global.css`:

**Light theme** (default, `:root`):
```css
:root {
  /* Backgrounds */
  --color-bg: #ffffff;
  --color-surface: #f9f9f9;
  --color-surface-light: #f1f1f1;
  
  /* Text */
  --color-text: #1a1a1a;
  --color-text-muted: #666666;
  
  /* Accent */
  --color-accent: #3b82f6;
  --color-accent-hover: #2563eb;
  --color-accent-light: #eff6ff;
  
  /* Borders */
  --color-border: #e5e5e5;
  
  /* Typography */
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-display: 'Georgia', serif;
}
```

**Dark theme** (`.dark`):
```css
.dark {
  --color-bg: #1a1a1a;
  --color-surface: #2a2a2a;
  --color-surface-light: #3a3a3a;
  
  --color-text: #f5f5f5;
  --color-text-muted: #999999;
  
  --color-accent: #60a5fa;
  --color-accent-hover: #93c5fd;
  --color-accent-light: #1e3a8a;
  
  --color-border: #404040;
  
  /* Typography stays the same */
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

### 4. Theme Toggle Component

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

### Light Theme Colors

Edit `:root` section in `src/styles/global.css`:

```css
:root {
  --color-bg: #ffffff;           /* Change to your preference */
  --color-accent: #3b82f6;       /* Blue by default */
  /* ... */
}
```

### Dark Theme Colors

Edit `.dark` section:

```css
.dark {
  --color-bg: #1a1a1a;           /* Change to your preference */
  --color-accent: #60a5fa;       /* Lighter blue for dark mode */
  /* ... */
}
```

### Adding New Colors

1. **Define in `:root`:**
   ```css
   :root {
     --color-success: #10b981;
     --color-error: #ef4444;
   }
   ```

2. **Override in `.dark`:**
   ```css
   .dark {
     --color-success: #34d399;
     --color-error: #f87171;
   }
   ```

3. **Use in components:**
   ```html
   <div class="text-[var(--color-success)]">Success message</div>
   ```

---

## Typography

### Font Variables

```css
:root {
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-display: 'Georgia', serif;
}
```

### Usage

```html
<body style="font-family: var(--font-sans)">
  <h1 style="font-family: var(--font-display)">Heading</h1>
</body>
```

### Customizing Fonts

To use Google Fonts:

1. **Add to `BaseLayout.astro` head:**
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
   ```

2. **Update CSS variables:**
   ```css
   :root {
     --font-display: 'Playfair Display', serif;
   }
   ```

---

## Testing Themes

### Manually Toggle

1. Open site in browser
2. Click sun/moon icon in header
3. Verify colors change instantly
4. Refresh page — theme persists
5. Open DevTools → Application → LocalStorage, verify `theme` key

### Using DevTools

Force dark mode in DevTools:

```
DevTools → Rendering tab → Emulate CSS media feature prefers-color-scheme → dark
```

Then click theme toggle to see it override system preference.

### Testing System Preference

macOS:
```
System Settings → General → Appearance → Dark
```

Windows:
```
Settings → Personalization → Colors → Dark
```

Then refresh site in private/incognito window (no localStorage) to see system preference applied.

---

## Accessibility Considerations

### Color Contrast

All colors meet WCAG AA standards:
- **Text** — 4.5:1 contrast ratio
- **UI Components** — 3:1 contrast ratio

Verify with tools like:
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Polypane](https://polypane.app/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)

### prefers-color-scheme

The system respects the `prefers-color-scheme` media query:

```css
@media (prefers-color-scheme: dark) {
  /* Defaults to dark if no localStorage preference */
}
```

Users with color vision deficiency preferences (rare but important):
- We don't currently handle `prefers-contrast` or `prefers-reduced-transparency`
- Consider adding in Phase 2 if needed

---

## Advanced: Dynamic Color Schemes

### Per-Page Theme

Currently not implemented (single theme for entire site), but possible:

```astro
---
// Future: per-page color overrides
const customTheme = {
  '--color-accent': '#ff6b6b'  // Red instead of blue
}
---

<style define:vars={customTheme}>
  /* Component styles */
</style>
```

### User Preferences (Future)

Phase 2 could include user accounts with theme preferences:

```ts
// Pseudocode — Phase 2
const userTheme = await fetchUserTheme(userId)
localStorage.setItem('theme', userTheme)
```

---

## Theme Checklist

When designing new components:

- [ ] Light mode colors look good
- [ ] Dark mode colors look good
- [ ] Text contrast is ≥4.5:1
- [ ] Components use CSS variables, not hardcoded colors
- [ ] Hover/active states visible in both themes
- [ ] No images that break in dark mode (or add dark variant)
- [ ] Tested with `prefers-reduced-motion`
- [ ] Tested with DevTools dark mode emulation

---

## Common Patterns

### Conditional Color Based on Theme

```astro
---
const isDarkMode = Astro.url.searchParams.has('dark')
const bgClass = isDarkMode ? 'dark' : ''
---

<div class={bgClass}>
  <p class="text-gray-900 dark:text-white">Text</p>
</div>
```

### Theme-Aware Image

```astro
---
const isDark = true  // Or detect from localStorage
const imageSrc = isDark 
  ? '/images/logo-dark.svg'
  : '/images/logo-light.svg'
---

<img src={imageSrc} alt="Logo" />
```

### Custom Theme Transition

```css
/* Smooth color transitions when theme toggles */
* {
  transition: background-color 0.2s, color 0.2s, border-color 0.2s;
}

/* But not on interactive elements for responsiveness */
button, a {
  transition: none;
}
```

---

## Troubleshooting

### Flash of Wrong Theme (FWOT)

If you see a flash of light theme before dark kicks in:
1. Verify FWOT script is in `<head>` before any CSS
2. Check script runs before `</head>` closes
3. Ensure script is using `is:inline` directive

### Colors Not Changing

1. Check CSS variables are defined in `:root` and `.dark`
2. Verify `.dark` class is on `<html>` element (DevTools → Elements)
3. Check Tailwind `dark:` prefix utilities are using variables
4. Clear browser cache and refresh

### Dark Mode Doesn't Persist

1. Check `localStorage` is enabled in browser
2. Verify script writes to `localStorage.setItem('theme', ...)`
3. Check theme toggle button click handler fires
4. Verify key name matches (should be `'theme'`)

### System Preference Not Detected

1. Change system dark mode setting
2. Open site in incognito/private window (no localStorage)
3. Site should default to system preference
4. If not, check `matchMedia` query in FWOT script

---

## Resources

- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [Tailwind Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [WCAG Color Contrast](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum)
- [Flash of Unstyled Content](https://www.w3.org/TR/paint-timing/)
