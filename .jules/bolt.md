## 2026-08-27 - GPU-accelerated GSAP quickTo and Dimension Caching in InteractiveCard

**Learning:** Calling `getBoundingClientRect()` inside a high-frequency `onMouseMove` event handler causes continuous browser reflows (layout thrashing). Furthermore, animating `background` radial gradients in real-time on every mouse movement causes main-thread repaints. Using an absolute GPU-overlay element with `transform` combined with `gsap.quickTo()` and caching element bounds on `onMouseEnter` eliminates layout thrashing and offloads mouse-tracking animations to the GPU.

**Action:** For high-frequency mouse-tracking elements, cache dimensions in a `useRef` on `onMouseEnter` and utilize `gsap.quickTo` with `transform` on absolute overlays instead of modifying inline CSS gradient strings in `onMouseMove`.
