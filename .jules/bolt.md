## 2026-03-30 - GPU-Accelerated Particles & Render Optimization
**Learning:** High-frequency React state updates (mouse move, scroll) in 3D scenes cause massive re-render overhead. CPU-side particle animation in `useFrame` loops is an O(N) bottleneck that blocks the main thread.
**Action:** Use `useRef` for high-frequency input tracking and move O(N) vertex calculations to the GPU using `ShaderMaterial` and vertex shaders.
