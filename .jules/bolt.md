## 2026-04-07 - Optimizing 3D Particle Systems & React State
**Learning:** High-frequency event tracking (mouse, scroll) in React-Three-Fiber components should utilize `useRef` and uniforms rather than `useState`. Updating state on every frame triggers React's reconciliation cycle, causing significant CPU overhead. Additionally, O(n) CPU-bound particle updates in `useFrame` are much less efficient than O(1) GPU-bound updates using `ShaderMaterial`.

**Action:** Always prefer `useRef` for high-frequency data (mouse, scroll) in 3D scenes. Migrate complex particle animations to custom vertex shaders using `ShaderMaterial` to offload work to the GPU.
