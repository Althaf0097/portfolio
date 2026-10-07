## 2025-05-18 - Optimize InteractiveCard 3D Tilt & Glare
**Learning:** High-frequency mousemove handlers on 3D card components cause severe layout thrashing when querying `getBoundingClientRect()` on every event and main-thread repaints when dynamically updating inline `background: radial-gradient(...)` strings.
**Action:** Cache element bounds on `mouseenter` (including page scroll offset `window.scrollX`/`window.scrollY`) and animate 3D transforms (`rotateX`, `rotateY`, `y`, `scale`) and glare position overlay (`translate3d`) exclusively using pre-initialized `gsap.quickTo()` setters.
