## 2025-05-18 - Hardware-Accelerated Glare and Dimension Caching in High-Frequency Mouse Tracking
**Learning:** Calling `getBoundingClientRect()` on every `mousemove` event causes layout thrashing (forced synchronous layout reflows) and updating dynamic CSS radial gradient strings in `gsap.to()` triggers main-thread repaints on every frame.
**Action:** Cache component dimensions in a `useRef` on `onMouseEnter`, pre-allocate `gsap.quickTo` animation setters in `useEffect`, and shift mouse glare overlays via `transform: translate3d()` to delegate hardware acceleration to the GPU.
