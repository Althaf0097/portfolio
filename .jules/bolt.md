## 2026-03-31 - High-Frequency Mouse Tracking Optimization with GSAP quickTo and Cached Rects
**Learning:** Calling `getBoundingClientRect()` on every `onMouseMove` event causes severe layout thrashing (forced synchronous reflows). Animating CSS `background` radial gradients on high-frequency events causes main-thread style recalculations and repaints.
**Action:** Always cache element dimensions on `onMouseEnter` or in a `useRef`, and use `gsap.quickTo()` with hardware-accelerated `transform: translate3d()` for moving glare elements on GPU compositor layers.
