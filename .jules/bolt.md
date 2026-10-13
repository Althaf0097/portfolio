## 2025-05-18 - Optimize InteractiveCard mouse tracking with GSAP quickTo and cached bounds
**Learning:** High-frequency mouse tracking on 3D elements causes severe layout thrashing when `getBoundingClientRect()` is called inside `onMouseMove`, and main-thread repaint overhead when dynamic CSS gradients are updated frame-by-frame.
**Action:** Pre-initialize GSAP `quickTo` setters once in `useEffect`, cache element bounding rectangles on `onMouseEnter`, and move spotlight overlays using GPU-accelerated `translate3d(x, y, 0)` via `quickTo` to offload rendering to the compositor thread.
