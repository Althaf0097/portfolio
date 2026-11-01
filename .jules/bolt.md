# Bolt's Performance Journal

## 2025-05-18 - Eliminating layout thrashing and CPU gradients in InteractiveCard
**Learning:** High-frequency mousemove events triggering `getBoundingClientRect()` cause severe layout thrashing and main thread bottlenecks. Concurrently animating CSS `background: radial-gradient(...)` string values forces the browser to re-rasterize and repaint the element on every frame. In addition, generic `transition-all` on the card container fights with GSAP's transform animations, causing jitter.
**Action:** Always cache bounding boxes in a ref on `mouseenter` (normalized with page scroll offsets), pre-allocate GSAP `quickTo` setters inside `useEffect`, move spotlight glare effects using hardware-accelerated `translate3d` transforms on an absolute overlay element, and restrict CSS transitions exclusively to non-transform properties (`transition-[border-color,box-shadow,background-color]`).
