## 2025-09-18 - Hardware-Accelerate Spotlight Glare with GSAP quickTo
**Learning:** Re-parsing `background: radial-gradient(...)` CSS strings inside high-frequency `mousemove` events forces browser main-thread repaints on every mouse event across multiple UI cards.
**Action:** Move glare overlay element with `transform: translate3d()` via `gsap.quickTo` and pre-cache `getBoundingClientRect()` on `onMouseEnter` to eliminate layout thrashing and main thread paint overhead.
