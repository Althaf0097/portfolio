# Bolt's Performance Journal

## 2025-03-05 - Avoid CanvasTexture Recreation in React Three Fiber
**Learning:** Instantiating `THREE.CanvasTexture` and creating canvas elements directly in the render path of a Three.js component causes severe memory leaks, garbage collection churn, and rendering delays on every component re-render.
**Action:** Always wrap procedural canvas generation and `THREE.CanvasTexture` instantiation inside a `useMemo` hook, and dispose of the texture in a `useEffect` cleanup function.

## 2025-03-05 - Optimize High-Frequency Mouse Effects
**Learning:** Using `getBoundingClientRect` on high-frequency events (like `mousemove`) causes layout thrashing by forcing synchronous style recalculation. Similarly, updating CSS `background` gradients via GSAP on every mouse move triggers expensive repaint cycles.
**Action:** Cache element bounding box coordinates on `mouseenter` (normalizing to window scroll), use GPU-accelerated `transform: translate3d()` via `gsap.quickTo()` for mouse-following effects, and use `will-change` hints to promote animated layers.
