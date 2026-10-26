# Bolt's Journal - Critical Learnings

## 2025-05-18 - Hardware-Accelerated Glare Spotlights with GSAP quickTo in Interactive Cards
**Learning:** Calling `getBoundingClientRect()` on every high-frequency `mousemove` event inside 3D tilt/interactive cards causes layout thrashing and forces main-thread reflows. Furthermore, creating new GSAP `gsap.to()` tweens per frame and updating dynamic string properties like `background: radial-gradient(...)` prevents GPU offloading and causes expensive style recalculations and repaints.
**Action:** Cache element bounds on `onMouseEnter` in a `useRef`. Pre-allocate GSAP `quickTo` setters inside `useEffect` for smooth high-frequency property animation, and replace `background` string updates with a pre-rendered spotlight element positioned via GPU-accelerated `translate3d` transforms.
