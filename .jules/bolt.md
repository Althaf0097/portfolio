## 2025-08-16 - GSAP quickTo and GPU Transform Offloading for High-Frequency Mouse Tracking

**Learning:** Calling `getBoundingClientRect()`, creating new `gsap.to()` tweens, and updating CSS `background` strings inside `onMouseMove` event handlers causes layout thrashing and main-thread paint bottlenecks across interactive UI elements.
**Action:** Initialize `gsap.quickTo` setters once in `useEffect`, cache element dimensions and scroll offsets on `onMouseEnter`, and move overlay elements using `transform: translate3d()` to offload animations to the GPU.
