## 2025-05-15 - [GPU-accelerated Particles & Render Optimization]
**Learning:** High-frequency event tracking (mouse, scroll) using React state in a 3D scene causes excessive re-renders that can degrade performance, especially when coupled with CPU-bound particle animations. Moving the animation logic to a `ShaderMaterial` (GPU) and using `useRef` for interaction state eliminates this bottleneck.

**Action:** Always prefer `useRef` and `ShaderMaterial` for high-frequency 3D animations and interaction tracking in React-Three-Fiber to keep the main thread free and avoid unnecessary React reconciliation.
