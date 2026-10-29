## 2025-05-18 - GSAP quickTo and cached bounds for high-frequency mouse tracking
**Learning:** Calling `getBoundingClientRect()` on every `mousemove` event causes layout thrashing, and re-creating GSAP tweens or mutating complex CSS gradient strings on every frame causes heavy layer repaint costs.
**Action:** Cache card bounding box on `onMouseEnter` and use `gsap.quickTo()` with GPU `translate3d` transforms on a static overlay element for high-frequency cursor tracking.
