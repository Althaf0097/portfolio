## 2026-03-30 - InteractiveCard 3D Tilt & Glare Optimization
**Learning:** Calling `getBoundingClientRect()` and updating CSS radial-gradient strings in high-frequency `onMouseMove` events causes severe layout thrashing and main-thread repaint stalls across 3D card grid interactions.
**Action:** Cache element bounds on `onMouseEnter` using page offsets, pre-initialize GSAP `quickTo` setters in `useEffect`, and position glare overlays using GPU-accelerated `translate3d()` transforms.
