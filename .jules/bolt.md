## 2025-05-20 - InteractiveCard Mouse Tracking Optimization
**Learning:** Invoking `getBoundingClientRect()` and updating string-based CSS `background` gradients inside high-frequency `mousemove` handlers causes severe main-thread layout thrashing and repaint costs.
**Action:** Cache bounding box dimensions on `onMouseEnter` in a `useRef` and utilize pre-created GSAP `quickTo` setters with GPU-accelerated `translate3d` transforms for 3D card tilt and glare positioning.
