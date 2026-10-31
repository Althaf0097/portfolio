# Bolt's Journal - Critical Learnings Only

## 2025-05-18 - Eliminating layout thrashing and repaint spikes in mouse-tracking cards
**Learning:** In mouse-tracking 3D cards with spotlight/glare effects (`InteractiveCard.jsx`), calling `getBoundingClientRect()` on every `mousemove` forces layout recalculation on every frame (O(N) layout thrashing). Furthermore, updating `background: radial-gradient(...)` causes continuous CPU/GPU main-thread repaints, and allocating new `gsap.to()` tweens per move triggers garbage collection overhead.
**Action:** Cache viewport-to-document relative coordinates (`rect.left + window.scrollX`) on `mouseenter`, use pre-allocated GSAP `quickTo()` instances for transform updates, and move spotlight/glare effects to an absolute overlay element animated with `translate3d()` to leverage GPU compositing without layout thrashing.
