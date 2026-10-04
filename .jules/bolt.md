# Bolt's Performance Journal

## 2025-05-18 - Caching dimensions & GSAP quickTo for interactive cards
**Learning:** Calling `getBoundingClientRect()` on every `onMouseMove` in React card hover interactions causes layout thrashing by forcing the browser engine to perform synchronous layout recalculations. Furthermore, updating CSS radial gradient strings dynamically on mouse movement causes main-thread style recalcs and repaints.
**Action:** Cache element bounds on `onMouseEnter` (normalizing against scroll position) and use `gsap.quickTo` with GPU hardware-accelerated transforms (`translate3d`) for zero-layout-thrashing 60 FPS interactions.
