## 2025-05-18 - Hardware-accelerated GSAP quickTo spotlight glare and bounds caching

**Learning:** Re-evaluating dynamic radial gradients as inline background strings in high-frequency mouse handlers causes style recalculations and repaints on every frame. Offloading position tracking to `gsap.quickTo` on an absolute-positioned element with `transform: translate3d()` and caching component bounding rects on `mouseenter` shifts animation workload entirely to the GPU and eliminates layout thrashing.
**Action:** When implementing interactive mouse-following light effects or 3D tilt components, pre-initialize `gsap.quickTo` helpers for transforms and cache element rects on mouse enter rather than calling `getBoundingClientRect` on mouse move.
