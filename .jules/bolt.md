# Bolt's Journal - Critical Learnings

## 2025-05-18 - GPU Acceleration for Card Glare Effects
**Learning:** Updating `background: radial-gradient(...)` via GSAP in high-frequency `mousemove` handlers causes repeated main-thread layout thrashing and repaints. Moving the glare effect to a dedicated absolute overlay animated with `gsap.quickTo` on `transform: translate3d()` offloads the workload to the compositor thread/GPU.
**Action:** When implementing spotlight glare or hover tracking effects, avoid modifying `background` style strings in event callbacks. Use `translate3d()` on absolute overlay elements.

## 2025-05-18 - Layout Thrashing in Card Mouse Tracking
**Learning:** Calling `getBoundingClientRect()` inside high-frequency `mousemove` events forces synchronous layout recalculation on every mouse motion.
**Action:** Cache element bounds (plus scroll offsets `window.scrollX`/`window.scrollY`) inside `mouseenter` handlers or a cached ref, and calculate mouse offsets using pre-cached coordinates during `mousemove`.
