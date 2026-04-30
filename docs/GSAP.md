# GSAP Animation Guide

## Overview

GSAP (GreenSock Animation Platform) is used for all animations in AnnaLu.

- **Zero animations by default** — pure static HTML
- **Opt-in with `data-animate` attributes** — components mark elements for animation
- **Centralized registration** — single GSAP setup in `BaseLayout`
- **Respects `prefers-reduced-motion`** — animations disabled if user prefers
- **ScrollTrigger for scroll-based animations** — reveal content on scroll

---

## Quick Reference

All animations in AnnaLu are triggered via `data-animate` attributes:

| Value | Component | Trigger | Effect |
|-------|-----------|---------|--------|
| `hero` | Hero section | Page load | Fade in + slide up |
| `card` | ArtworkCard | Scroll into view | Fade in + scale up |
| `mosaic-row` | MosaicRow | Scroll into view | Slide in from left |
| `cover` | Artwork cover image | Scroll parallax | Parallax effect |
| `editorial-text` | Editorial section text | Scroll into view | Fade in |
| `editorial-stack` | Editorial image stack | Scroll into view | Staggered reveal |

**See the animation flow diagram** below to understand how components communicate with the centralized GSAP handler.

---

## Animation Flow Diagram

```
Component (Template)               BaseLayout (Script)
├─ data-animate="card"   ──────────> gsap.utils.toArray('[data-animate="card"]')
├─ data-animate="hero"   ──────────> gsap.fromTo() / gsap.to()
├─ data-animate="mosaic" ──────────> ScrollTrigger integration
└─ ...                   ──────────> gsap.matchMedia() guard
                                     (prefers-reduced-motion check)

Flow:
1. Component renders element with data-animate attribute
2. BaseLayout script runs after page load
3. GSAP finds all elements with data-animate
4. If prefers-reduced-motion: no-preference, animations play
5. Otherwise, elements remain static (no animation)
```

---

## GSAP Setup

### Registration (BaseLayout.astro)

All GSAP code is in `src/layouts/BaseLayout.astro` `<script>` block:

```astro
<script>
  import gsap from 'gsap'
  import ScrollTrigger from 'gsap/ScrollTrigger'

  // Register the plugin
  gsap.registerPlugin(ScrollTrigger)

  // Guard: only animate if user doesn't prefer reduced motion
  const mm = gsap.matchMedia()
  
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // All GSAP animations live here
    // They won't run if prefers-reduced-motion: reduce
  })
</script>
```

### Why Centralized?

✅ **Single responsibility** — all animation logic in one place
✅ **DRY** — ScrollTrigger registered once
✅ **Performance** — no per-component GSAP overhead
✅ **prefers-reduced-motion** — guard applied to all animations at once
✅ **Maintenance** — easy to find and modify animations

---

## How It Works

### 1. Components Mark Elements

Components add `data-animate` attributes to elements they want animated:

```astro
<!-- ArtworkCard.astro -->
<article data-animate="card">
  <img src="..." />
  <h3>Title</h3>
</article>
```

```astro
<!-- MosaicRow.astro -->
<div data-animate="mosaic-row">
  <!-- Grid images -->
</div>
```

### 2. BaseLayout Finds & Animates Them

In the centralized GSAP script:

```ts
// Find all elements marked for animation
const cardElements = gsap.utils.toArray('[data-animate="card"]')

// Animate each one
cardElements.forEach((element, index) => {
  gsap.fromTo(element, 
    { opacity: 0, y: 20 },
    { 
      opacity: 1, 
      y: 0, 
      duration: 0.6,
      delay: index * 0.1  // Stagger
    }
  )
})
```

### 3. Only on Non-Reduced-Motion

```ts
const mm = gsap.matchMedia()

mm.add('(prefers-reduced-motion: no-preference)', () => {
  // All animations here
  // Skip entirely if user has prefers-reduced-motion: reduce
})
```

---

## Animation Targets

### `data-animate="hero"`

Hero section fade-in on page load.

**Element:** Landing page hero section
**Animation:** Fade in + slide up
**Timing:** On page load
**Duration:** 0.8s
**Easing:** `power2.out`
**Key Properties:** `opacity`, `y` (translateY)

**Visual:**
```
Start:  [opacity: 0, y: 30px]  ← Invisible, shifted down
        ↓ (0.8s)
End:    [opacity: 1, y: 0px]   ← Fully visible, at original position
```

**Code:**
```ts
gsap.fromTo('[data-animate="hero"]',
  { opacity: 0, y: 30 },
  { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
)
```

**Customize:**
```ts
// Faster animation
{ duration: 0.4 }

// Smoother easing
{ ease: 'power3.out' }

// More dramatic entrance
{ y: 60 }

// Fade faster than move
gsap.timeline()
  .fromTo(element, { opacity: 0 }, { opacity: 1, duration: 0.4 })
  .fromTo(element, { y: 30 }, { y: 0, duration: 0.8 }, 0)
```

---

### `data-animate="card"`

Artwork cards in "latest works" section animate on scroll.

**Element:** Each `<ArtworkCard>` component
**Animation:** Fade in + scale up
**Timing:** On scroll into view (at 80% of viewport)
**Duration:** 0.5s
**Key Properties:** `opacity`, `scale`

**Visual:**
```
Scroll position: [trigger element top is 80% down viewport]
                 ↓
Start:  [opacity: 0, scale: 0.95]  ← Invisible, slightly small
        ↓ (0.5s)
End:    [opacity: 1, scale: 1.0]   ← Fully visible, normal size
```

**Code:**
```ts
gsap.utils.toArray('[data-animate="card"]').forEach(element => {
  gsap.fromTo(element,
    { opacity: 0, scale: 0.95 },
    {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'bottom 20%'
      }
    }
  )
})
```

**Customize:**
```ts
// Reveal earlier (when top reaches 60% of viewport)
start: 'top 60%'

// Add delay between cards
stagger: 0.1

// Different scale range
scale: 0.85

// Add easing
ease: 'back.out'

// Complete example with stagger
gsap.utils.toArray('[data-animate="card"]').forEach((element, index) => {
  gsap.fromTo(element,
    { opacity: 0, scale: 0.9 },
    {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      delay: index * 0.1,  // Stagger by 0.1s
      ease: 'back.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 70%'
      }
    }
  )
})
```

---

### `data-animate="mosaic-row"`

Gallery mosaic rows slide in on scroll.

**Element:** Each `<MosaicRow>` component
**Animation:** Slide in from left
**Timing:** On scroll into view (at 70% of viewport)
**Duration:** 0.6s
**Key Properties:** `opacity`, `x` (translateX)

**Visual:**
```
Scroll position: [trigger element top is 70% down viewport]
                 ↓
Start:  [opacity: 0, x: -30px]  ← Invisible, shifted left
        ↓ (0.6s)
End:    [opacity: 1, x: 0px]    ← Fully visible, at original position
```

**Code:**
```ts
gsap.utils.toArray('[data-animate="mosaic-row"]').forEach(element => {
  gsap.fromTo(element,
    { opacity: 0, x: -30 },
    {
      opacity: 1,
      x: 0,
      duration: 0.6,
      scrollTrigger: {
        trigger: element,
        start: 'top 70%'
      }
    }
  )
})
```

**Customize:**
```ts
// Slide from right instead
x: 30

// Slide further left
x: -60

// Reveal slower
duration: 1

// Add bounce effect
ease: 'back.out'

// Stagger child elements within row
gsap.to('[data-animate="mosaic-row"] img', {
  opacity: 1,
  x: 0,
  stagger: 0.05,  // Reveal images in sequence
  duration: 0.5,
  scrollTrigger: {
    trigger: '[data-animate="mosaic-row"]',
    start: 'top 70%'
  }
})
```

---

### `data-animate="cover"`

Artwork detail page cover image parallax on scroll.

**Element:** Cover image in `ArtworkLayout`
**Animation:** Parallax (slower scroll than page)
**Timing:** While scrolling
**Duration:** Full scroll height
**Key Properties:** `y` (translateY)
**Scrub:** 1s (smooth lag)

**Visual:**
```
Top of page (cover visible):
  ↓ Scroll down slowly ↓
[Image moves up slower than scroll = parallax effect]
  ↓ Continue scrolling ↓
[Image reaches final position as you scroll past]
```

**Code:**
```ts
gsap.fromTo('[data-animate="cover"]',
  { y: 0 },
  {
    y: 100,
    scrollTrigger: {
      trigger: '[data-animate="cover"]',
      start: 'top top',
      end: 'bottom top',
      scrub: 1  // Smooth scrubbing
    }
  }
)
```

**Customize:**
```ts
// More dramatic parallax (move further)
y: 150

// Subtle parallax (move less)
y: 50

// Instant scroll follow (no smoothing)
scrub: 0

// Faster lag behind scroll
scrub: 0.5

// Slower lag behind scroll
scrub: 2

// Advanced: zoom + parallax
gsap.to('[data-animate="cover"]', {
  y: 100,
  scale: 0.95,
  scrollTrigger: {
    trigger: '[data-animate="cover"]',
    start: 'top top',
    end: 'bottom top',
    scrub: 1
  }
})
```

---

### `data-animate="editorial-text"`

Editorial section text fade-in.

**Element:** Text in editorial section
**Animation:** Fade in on scroll
**Timing:** On scroll into view
**Duration:** 0.6s

**Code:**
```ts
gsap.fromTo('[data-animate="editorial-text"]',
  { opacity: 0 },
  {
    opacity: 1,
    duration: 0.6,
    scrollTrigger: {
      trigger: '[data-animate="editorial-text"]',
      start: 'top 80%'
    }
  }
)
```

---

### `data-animate="editorial-stack"`

Editorial image pile animation.

**Element:** Image stack in editorial section
**Animation:** Staggered reveal
**Timing:** On scroll into view
**Duration:** 0.5s per image
**Delay:** 0.1s between images

**Code:**
```ts
gsap.utils.toArray('[data-animate="editorial-stack"] img').forEach((img, i) => {
  gsap.fromTo(img,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      delay: i * 0.1,
      scrollTrigger: {
        trigger: '[data-animate="editorial-stack"]',
        start: 'top 70%'
      }
    }
  )
})
```

---

## GSAP Concepts

### matchMedia() — Conditional Animations

`gsap.matchMedia()` is a GSAP utility that runs code only when specific CSS media queries match. This is how we guard all animations:

```ts
const mm = gsap.matchMedia()

// Only run if user prefers animations (not reduced motion)
mm.add('(prefers-reduced-motion: no-preference)', () => {
  // All animation code here
  gsap.to(element, { opacity: 1 })
  // If prefers-reduced-motion: reduce, this block is skipped entirely
})

// You can add other conditions too
mm.add('(max-width: 768px)', () => {
  // Mobile-only animations
})
```

**Why use this?**
- Respects user accessibility preferences
- Single guard for all animations
- Clean, centralized control
- Prevents layout shift on reduced-motion devices

---

### prefers-reduced-motion Explanation

`prefers-reduced-motion` is a CSS media query that detects if a user wants fewer animations. Users enable this in:

- **macOS:** System Preferences → Accessibility → Display → Reduce motion
- **Windows:** Settings → Ease of Access → Display → Show animations
- **Linux:** Per-desktop environment settings
- **Browser DevTools:** Rendering tab → "Emulate CSS media feature prefers-reduced-motion"

**How AnnaLu handles it:**

```ts
const mm = gsap.matchMedia()

mm.add('(prefers-reduced-motion: no-preference)', () => {
  // This code ONLY runs if user hasn't disabled animations
  gsap.to(element, { opacity: 1, duration: 0.6 })
})

// If user has prefers-reduced-motion: reduce, the entire block is skipped
// Elements appear instantly with no animation
```

**What happens:**
- **With animations enabled:** Element fades in smoothly over 0.6s
- **With animations disabled:** Element appears instantly (no fade)

**Test it:**
```bash
# Chrome/Edge DevTools
1. DevTools → ⋮ (More tools) → Rendering
2. Find "Emulate CSS media feature prefers-reduced-motion"
3. Select "prefers-reduced-motion: reduce"
4. Refresh page → No animations should play
```

---

### fromTo Animation

Creates an animation from a starting state to an ending state:

```ts
gsap.fromTo(element,
  { opacity: 0, y: 20 },     // Starting state
  { opacity: 1, y: 0, duration: 0.5 }  // Ending state
)
```

This is better than `gsap.from()` or `gsap.to()` because:
- ✅ Both states are explicit and clear
- ✅ No surprise initial values
- ✅ Easy to reason about animation

**vs. gsap.to():**
```ts
// gsap.to() animates TO these values (starting from current)
gsap.to(element, { opacity: 1, duration: 0.5 })
// Assumes element starts at opacity: 0 (must be set in CSS)

// gsap.fromTo() is clearer (no CSS setup needed)
gsap.fromTo(element,
  { opacity: 0 },
  { opacity: 1, duration: 0.5 }
)
```

---

### ScrollTrigger

Triggers animations when elements enter the viewport during scrolling:

```ts
gsap.to(element, {
  scrollTrigger: {
    trigger: element,        // What triggers the animation
    start: 'top 80%',        // When to start
    end: 'bottom 20%',       // When to end (optional)
    markers: true,           // Debug: shows colored boxes
    scrub: 1                 // Tie animation to scroll (smooth)
  },
  duration: 1,
  opacity: 1
})
```

**Key properties:**

| Property | Purpose | Example |
|----------|---------|---------|
| `trigger` | Element that enters viewport | `'#my-element'` or element object |
| `start` | When animation starts | `'top 80%'` = element top at 80% of viewport |
| `end` | When animation ends | `'bottom 20%'` = element bottom at 20% of viewport |
| `scrub` | Tie to scroll (smooth) | `0` = instant, `1` = 1s lag, `true` = exact scroll |
| `markers` | Debug boxes | `true` = show start/end/trigger points |
| `onEnter` | Callback when enters | Function that runs |
| `onLeave` | Callback when leaves | Function that runs |

**Examples:**

```ts
// Trigger when element top is 80% down viewport
start: 'top 80%'

// Trigger when element bottom is 20% up viewport
start: 'bottom 20%'

// Trigger exactly when element top reaches viewport top
start: 'top top'

// Trigger when element is 100px from top of viewport
start: 'top 100px'
```

---

### Stagger

Animate multiple elements with delay between each one:

```ts
// All elements fade in with 0.1s delay between each
gsap.to('[data-animate="card"]', {
  duration: 0.5,
  opacity: 1,
  stagger: 0.1  // 0.1s delay between each element
})
```

**Stagger calculations:**
- Element 1: starts at 0s, ends at 0.5s
- Element 2: starts at 0.1s, ends at 0.6s
- Element 3: starts at 0.2s, ends at 0.7s
- etc.

**Stagger with index:**
```ts
stagger: {
  amount: 0.5,     // Total time for all staggered animations
  from: 'start',   // Start from first element
  grid: 'auto'     // Auto-detect grid layout
}
```

---

### Ease Functions

Control the speed curve of animations:

```ts
gsap.to(element, {
  duration: 1,
  opacity: 1,
  ease: 'power2.out'  // Starts slow, ends fast
})
```

**Common eases:**

| Ease | Behavior | Use Case |
|------|----------|----------|
| `linear` | Constant speed | Scrolling, progress bars |
| `power1.out` | Slow → fast | Simple entrances |
| `power2.out` | Slow → fast (faster) | Card reveals |
| `power3.out` | Slow → fast (even faster) | Dramatic reveals |
| `back.out` | Overshoot, bounce | Playful entrances |
| `elastic.out` | Spring effect | Fun animations |
| `bounce.out` | Bouncy landing | Playful exits |

**Visualizer:** https://greensock.com/ease-visualizer

---

## Adding Animations

### 1. Mark Element in Component

```astro
<!-- src/components/MyComponent.astro -->
<div data-animate="my-animation">
  Content
</div>
```

### 2. Add Animation in BaseLayout

In `src/layouts/BaseLayout.astro` inside the `matchMedia` callback:

```ts
const mm = gsap.matchMedia()

mm.add('(prefers-reduced-motion: no-preference)', () => {
  // Existing animations...
  
  // Your new animation
  gsap.fromTo('[data-animate="my-animation"]',
    { opacity: 0, y: 20 },
    { 
      opacity: 1, 
      y: 0, 
      duration: 0.6
    }
  )
})
```

### 3. Test

```bash
pnpm dev
```

Visit the page and verify animation works.

---

## Performance Tips

### Use will-change CSS

Tells browser to optimize rendering for animated properties:

```css
.gsap-target {
  will-change: transform, opacity;
}
```

Apply to animated elements:
```html
<div data-animate="card" class="gsap-target">...</div>
```

**Best practice:** Only use `will-change` on elements that will definitely animate. Over-using it wastes memory.

---

### Hardware Acceleration

Use `transform` and `opacity` (GPU-accelerated). These are fast:

✅ **Good (GPU-accelerated):**
```ts
gsap.to(element, {
  x: 100,              // transform: translateX (fast)
  y: 50,               // transform: translateY (fast)
  scale: 1.1,          // transform: scale (fast)
  opacity: 0.5,        // opacity (fast)
  duration: 0.5,
  ease: 'power2.out'
})
```

❌ **Avoid (CPU-intensive, causes reflows/repaints):**
```ts
gsap.to(element, {
  left: 100,           // Layout shift (slow, reflow)
  top: 50,             // Layout shift (slow, reflow)
  width: 200,          // Layout shift (slow, reflow)
  backgroundColor: 'red'  // Repaint (slow)
})
```

**Why?**
- `transform` and `opacity` don't trigger layout recalculation
- GPU can accelerate them in a separate layer
- No other elements are affected
- Smooth on mobile devices

---

### Reduce Motion for Performance

On low-end devices or when performance is critical, disable animations:

```ts
// Check if user wants reduced motion (also a performance signal)
const mm = gsap.matchMedia()

mm.add('(prefers-reduced-motion: no-preference)', () => {
  // Only animate on devices that can handle it
  // On reduced-motion devices, skip all this code
})

// Alternative: detect performance
if (navigator.hardwareConcurrency <= 2) {
  // Low-end device, skip animations
  return
}
```

---

### Batch & Reuse Animations

Group similar animations:

```ts
// ❌ Bad: Creates animation for each card separately
gsap.utils.toArray('[data-animate="card"]').forEach(card => {
  gsap.fromTo(card, { opacity: 0 }, { opacity: 1, duration: 0.5 })
})

// ✅ Good: Single animation for all cards
gsap.fromTo('[data-animate="card"]',
  { opacity: 0, scale: 0.95 },
  { 
    opacity: 1, 
    scale: 1, 
    duration: 0.5,
    stagger: 0.1  // Stagger creates delay automatically
  }
)
```

---

### Cleanup for Dynamic Elements

For elements removed from the DOM, kill their animations:

```ts
// When removing an element from page
const element = document.querySelector('[data-animate="card"]')

// Kill all ScrollTriggers for this element
ScrollTrigger.getAll().forEach(trigger => {
  if (trigger.trigger === element) {
    trigger.kill()
  }
})

// Then remove from DOM
element.remove()
```

---

### Monitor with DevTools

**Chrome DevTools → Performance tab:**
1. Start recording
2. Scroll through page or interact
3. Stop recording
4. Look for:
   - Green ✅ = smooth 60fps
   - Red ❌ = janky, slow

**Check for:**
- Long tasks (yellow)
- Layout shifts (reflows)
- Main thread blocking

If animations cause red bars, simplify or reduce count.

---

## Debugging

### Enable Markers

```ts
gsap.fromTo(element, {...}, {
  scrollTrigger: {
    markers: true  // Shows green/blue/red boxes
  }
})
```

Then disable in production.

### Console Logging

```ts
console.log('Animating:', element)
gsap.to(element, {
  onStart: () => console.log('Started'),
  onComplete: () => console.log('Done'),
  duration: 1,
  opacity: 1
})
```

### DevTools

```bash
# In browser console
gsap.to('[data-animate="card"]', { duration: 5, opacity: 0 })
# Watch animation in slow motion to debug
```

---

## Testing Prefers Reduced Motion

### DevTools

```
DevTools → Rendering tab → Emulate CSS media feature prefers-reduced-motion → reduce
```

Then refresh the page. Animations should be completely disabled.

### System Setting

**macOS:**
```
System Preferences → Accessibility → Display → Reduce motion
```

**Windows:**
```
Settings → Ease of Access → Display → Show animations
```

Then refresh site.

---

## Common Animations

### Fade In

```ts
gsap.fromTo(element,
  { opacity: 0 },
  { opacity: 1, duration: 0.5 }
)
```

### Slide In from Left

```ts
gsap.fromTo(element,
  { opacity: 0, x: -50 },
  { opacity: 1, x: 0, duration: 0.6 }
)
```

### Scale Up

```ts
gsap.fromTo(element,
  { opacity: 0, scale: 0.9 },
  { opacity: 1, scale: 1, duration: 0.5 }
)
```

### Staggered List

```ts
gsap.fromTo('[data-animate="list-item"]',
  { opacity: 0, y: 20 },
  { 
    opacity: 1, 
    y: 0, 
    duration: 0.5,
    stagger: 0.1  // 0.1s between each item
  }
)
```

### Scroll Reveal

```ts
gsap.fromTo(element,
  { opacity: 0 },
  {
    opacity: 1,
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      end: 'top 50%',
      scrub: 0  // No smoothing
    }
  }
)
```

### Parallax

```ts
gsap.to(element, {
  y: 100,
  scrollTrigger: {
    trigger: element,
    start: 'top top',
    end: 'bottom top',
    scrub: 1  // Smooth scrub
  }
})
```

---

## Phase 1 Animations

Current animations implemented:

| Animation | Trigger | Code |
|---|---|---|
| Hero fade-in | Load | `data-animate="hero"` |
| Card reveal | Scroll | `data-animate="card"` |
| Mosaic row slide | Scroll | `data-animate="mosaic-row"` |
| Cover parallax | Scroll | `data-animate="cover"` |

All are simple, meaningful, and respect `prefers-reduced-motion`.

---

## Future Animations (Phase 2)

Possible animations for Phase 2:

- Product card hover effects
- Cart item add animation
- Form validation feedback
- Loading states
- Transition between checkout steps

Keep animations simple and purposeful. Complex animations can hurt performance and accessibility.

---

## Troubleshooting

### Animations Not Playing

1. Check browser console for errors
2. Verify element has `data-animate` attribute
3. Verify attribute name matches GSAP query
4. Check `prefers-reduced-motion` isn't set
5. Run `pnpm dev` and refresh page

### Animation Janky/Slow

1. Use `transform` (not `left`/`top`/`width`/`height`)
2. Add `will-change: transform, opacity` to element
3. Check browser DevTools → Performance tab for long tasks
4. Reduce animation duration or remove some animations

### ScrollTrigger Not Working

1. Verify element is scrollable (not above fold on page load)
2. Check `start` value — may be off-screen
3. Add `markers: true` to see trigger points
4. Verify element has been rendered (not hidden with `display: none`)

### Too Many Animations?

- Reduce number of animated elements
- Simplify animation complexity
- Use CSS transitions instead for simple hover states
- Phase 2: profile performance impact

---

## Best Practices

✅ **Do:**
- Use simple, purposeful animations
- Test on reduced-motion settings
- Use `transform` and `opacity`
- Keep animations under 1 second
- Stagger multiple animations for visual interest
- Test on low-end devices

❌ **Don't:**
- Animate non-essential elements
- Use complex easing functions unnecessarily
- Animate layout properties (width, height, left, top)
- Create animations that feel laggy or slow
- Forget to handle `prefers-reduced-motion`
- Add animations without performance testing

---

## Resources & Related Documentation

- [THEMING.md](./THEMING.md) — Animation colors, CSS variables, theme configuration
- [COMPONENTS.md](./COMPONENTS.md) — Component structure, how to add data-animate attributes
- [ARCHITECTURE.md](./ARCHITECTURE.md) — BaseLayout structure, how GSAP script integrates
- [GSAP Documentation](https://greensock.com/docs)
- [GSAP ScrollTrigger](https://greensock.com/docs/v3/Plugins/ScrollTrigger)
- [GSAP Easing Visualizer](https://greensock.com/ease-visualizer)
- [Web Animations Performance](https://web.dev/animations-guide/)
- [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
