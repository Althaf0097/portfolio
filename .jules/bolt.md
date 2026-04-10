## 2025-05-15 - GPU-Accelerated Particle Interactivity
**Learning:** High-frequency React state updates (mouse/scroll) in a Three.js scene trigger expensive reconciliation cycles. Moving these to `useRef` and offloading animation logic to the GPU via `ShaderMaterial` significantly improves performance and reduces CPU overhead from O(n) to O(1) per frame on the main thread.
**Action:** For any Three.js component with many elements, prioritize `ShaderMaterial` and `useRef` for interactivity over React state and per-frame geometry attribute updates.
