
## 2025-08-24 - Hardware-Accelerated Glare and gsap.quickTo in Mouse-Tracking Cards
**Learning:** Dynamically calculating and updating inline CSS radial-gradient strings during high-frequency mousemove events causes main-thread layout recalculations and repaint overhead. Offloading the glare effect to a dedicated absolute overlay element animated with `transform: translate3d()` via GSAP `quickTo` shifts animation processing to the GPU and eliminates layout thrashing.
**Action:** For high-frequency mouse-following or glare effects, move positioning to a GPU-accelerated layer (`willChange: 'transform'`) driven by `gsap.quickTo()` and cache element bounds on `mouseenter`.
