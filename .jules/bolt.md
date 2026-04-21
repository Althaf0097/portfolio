## 2025-05-15 - GPU-Accelerated Particle Field Optimization

**Learning:** Migrating particle animations from CPU-based `useFrame` loops (O(n) per frame) to GPU vertex shaders significantly reduces the load on the main thread. Additionally, using `useRef` for high-frequency interaction data (mouse, scroll) instead of `useState` eliminates hundreds of React reconciliation cycles per second.

**Action:** Always prefer `ShaderMaterial` for systems with >100 dynamic elements. Use `useRef` for values that change at 60Hz+ and don't need to trigger React-level UI updates outside the Canvas.
