# Bolt's Journal - Critical Learnings

## 2025-05-18 - GPU-Accelerated Spotlight Glare and quickTo Card Tilt
**Learning:** Calling `getBoundingClientRect()` inside high-frequency `onMouseMove` event listeners triggers synchronous layout recalculations (layout thrashing) on every frame. Updating element `background` with radial gradient strings forces main-thread paint cycles.
**Action:** Cache element dimensions on `onMouseEnter` and use `gsap.quickTo` with `transform: translate3d(...)` on fixed overlay elements to offload mouse-tracking spotlight animations to the GPU.
