## 2024-05-22 - [React Three Fiber High-Frequency Update Pattern]
**Learning:** In R3F, using React state for mouse position or scroll progress causes the entire component tree (including the Canvas) to re-render on every event. This is extremely expensive.
**Action:** Always use `useRef` to track high-frequency data (mouse, scroll, sensor data) and access it imperatively within the `useFrame` loop or via shader uniforms.

## 2024-05-22 - [GPU-Accelerated Particle Animation]
**Learning:** Manually updating thousands of particle positions in a CPU loop (`useFrame`) and setting `positions.needsUpdate = true` is a major bottleneck due to O(n) calculations and frequent data transfers to the GPU.
**Action:** Offload animation logic (sin/cos floating, reactivity) to the vertex shader using `ShaderMaterial` and uniforms. Use `gl_PointSize` for size attenuation in the shader.
