
## 2025-05-22 - GPU Particle Migration & Ref-based Event Tracking
**Learning:** High-frequency events (mouse/scroll) in Three.js scenes should never update React state if they are only needed for the animation loop. Using `useRef` prevents unnecessary virtual DOM diffing. Additionally, moving per-particle calculations to vertex shaders eliminates the O(n) CPU bottleneck and costly geometry attribute updates.
**Action:** Always audit `useFrame` loops for CPU-bound array manipulations and check if high-frequency `useState` can be replaced with `useRef`.
