## 2025-05-18 - Cached Bounding Rects and GSAP quickTo in Interactive Cards
**Learning:** High-frequency mouse event handlers in 3D tilt cards cause layout thrashing when `getBoundingClientRect()` is called on every `mousemove` frame, and create GC overhead when instantiating new GSAP tweens per frame.
**Action:** Cache bounding box measurements on `onMouseEnter` in a `useRef` and initialize `gsap.quickTo` setters once inside a `useEffect` hook.
