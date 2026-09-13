## 2025-05-18 - Hardware-Accelerated 3D Tilt Glare and Pre-allocated GSAP quickTo Animation

**Learning:** Updating dynamic radial-gradient background strings inside `onMouseMove` triggers main-thread style recalculations and layout thrashing, especially when combined with `getBoundingClientRect()` calls per mouse movement and competing `transition-all` CSS classes.

**Action:** Use pre-instantiated `gsap.quickTo` setters inside `useEffect`, cache card bounding dimensions on `onMouseEnter`, move spotlight glare via GPU-accelerated `transform: translate3d()`, and isolate CSS transitions to non-animated properties to eliminate animation jitter and GC allocation overhead during high-frequency mouse tracking.
