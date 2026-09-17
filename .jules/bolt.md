## 2025-05-18 - Avoid layout thrashing in mouse-tracking cards with cached bounds & GSAP quickTo
**Learning:** Calling `getBoundingClientRect()` on every `mousemove` event inside interactive components causes synchronous layout reflows (layout thrashing) on every frame. Updating CSS radial gradient strings in GSAP also causes unnecessary repaints.
**Action:** Cache element bounds on `onMouseEnter` / `ResizeObserver` and update GPU-accelerated transforms using `gsap.quickTo()` with `translate3d()` for glare overlays.
