## 2025-08-25 - GPU Glare Translation & Cached Bounds for Interactive Cards
**Learning:** `getBoundingClientRect()` on high-frequency `mousemove` handlers causes severe layout thrashing by forcing browser synchronous reflows on every move event. Additionally, dynamically setting inline CSS radial gradients forces main-thread layout recalculation and repaints.
**Action:** Cache element bounds on `mouseenter` (accounting for `window.scrollX`/`window.scrollY`) and move glare overlays using `transform: translate3d()` animated via GSAP `quickTo` helpers.
