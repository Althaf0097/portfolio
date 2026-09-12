## 2025-03-01 - Eliminate Layout Thrashing and Repaints in Mouse-Tracking UI Components

**Learning:** In reusable mouse-tracking UI components like `InteractiveCard`, calling `getBoundingClientRect()` inside `onMouseMove` triggers synchronous reflow/layout thrashing on every frame. Dynamic updates to CSS `background: radial-gradient(...)` string properties force main-thread repaints, while CSS `transition-all` classes conflict with GSAP transforms.

**Action:** Cache bounding box measurements in `onMouseEnter`, initialize reusable GSAP `quickTo` setters inside `useEffect` for high-frequency transforms (`rotateX`, `rotateY`, `scale`, glare `x`/`y`), and delegate spotlight glare effects to an absolute overlay element moved via GPU-accelerated `translate3d()` transforms.
