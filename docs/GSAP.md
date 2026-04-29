# GSAP Animation Guide

## Overview

GSAP (GreenSock Animation Platform) is used for all animations in AnnaLu.

- **Zero animations by default** — pure static HTML
- **Opt-in with `data-animate` attributes** — components mark elements for animation
- **Centralized registration** — single GSAP setup in `BaseLayout`
- **Respects `prefers-reduced-motion`** — animations disabled if user prefers
- **ScrollTrigger for scroll-based animations** — reveal content on scroll

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
**Code:**
```ts
gsap.fromTo('[data-animate="hero"]',
  { opacity: 0, y: 30 },
  { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
)
```

### `data-animate="card"`

Artwork cards in "latest works" section animate on scroll.

**Element:** Each `<ArtworkCard>` component
**Animation:** Fade in + scale up
**Timing:** On scroll into view
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

### `data-animate="mosaic-row"`

Gallery mosaic rows slide in on scroll.

**Element:** Each `<MosaicRow>` component
**Animation:** Slide in from left
**Timing:** On scroll into view
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

### `data-animate="cover"`

Artwork detail page cover image parallax on scroll.

**Element:** Cover image in `ArtworkLayout`
**Animation:** Parallax (slower scroll than page)
**Timing:** While scrolling
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

---

## GSAP Concepts

### fromTo Animation

```ts
gsap.fromTo(element,
  { opacity: 0 },  // Starting state
  { opacity: 1, duration: 0.5 }  // End state
)
```

### ScrollTrigger

Animates when element enters viewport:

```ts
gsap.to(element, {
  scrollTrigger: {
    trigger: element,        // What triggers the animation
    start: 'top 80%',        // When to start (element top at 80% of viewport)
    end: 'bottom 20%',       // When to end (optional)
    markers: true,           // Debug markers (remove in production)
    scrub: 1                 // Tie to scroll (1 = 1 second smoothing)
  },
  // Animation properties
  duration: 1,
  y: 0
})
```

### Stagger

Animate multiple elements with delay between them:

```ts
gsap.to('[data-animate="card"]', {
  duration: 0.5,
  opacity: 1,
  stagger: 0.1  // 0.1s delay between each element
})
```

### Ease Functions

Control animation curve:

```ts
gsap.to(element, {
  duration: 0.5,
  opacity: 1,
  ease: 'power2.out'  // Slow then fast
  // Other eases: 'power1.in', 'back.out', 'elastic.out', etc.
})
```

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

In `global.css`:
```css
.gsap-target {
  will-change: transform, opacity;
}
```

Apply to animated elements:
```html
<div data-animate="card" class="gsap-target">...</div>
```

### Hardware Acceleration

Use `transform` and `opacity` (GPU-accelerated):

✅ **Good:**
```ts
gsap.to(element, {
  x: 100,              // transform: translateX
  opacity: 0.5         // opacity (fast)
})
```

❌ **Avoid:**
```ts
gsap.to(element, {
  left: 100,           // layout shift (slow)
  backgroundColor: 'red'  // repaint (slow)
})
```

### Cleanup

For dynamic elements, kill animations before removing:

```ts
// When removing an element
ScrollTrigger.getAll().forEach(trigger => {
  if (trigger.trigger === removedElement) {
    trigger.kill()
  }
})
```

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

## Resources

- [GSAP Documentation](https://greensock.com/docs)
- [GSAP ScrollTrigger](https://greensock.com/docs/v3/Plugins/ScrollTrigger)
- [GSAP Easing Visualizer](https://greensock.com/ease-visualizer)
- [Web Animations Performance](https://web.dev/animations-guide/)
- [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
