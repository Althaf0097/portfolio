## 2025-05-18 - GSAP quickTo and Bounding Rect Caching in Interactive Cards
**Learning:** Calling `getBoundingClientRect()` inside high-frequency `mousemove` listeners on 3D interactive elements forces layout thrashing (reflow) on every frame. Updating non-composited `background: radial-gradient(...)` strings on mousemove also causes CPU repaints.
**Action:** Cache element bounds on `onMouseEnter` in a `useRef` and use GSAP `quickTo` with hardware-accelerated `translate3d` transforms for position-following glare overlays.
