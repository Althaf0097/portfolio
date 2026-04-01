## 2025-05-15 - [GPU-accelerated Particles and Render Optimization]
**Learning:** High-frequency React state updates (mouse/scroll) in a root 3D scene component cause expensive re-renders of the entire 3D tree. Additionally, CPU-bound O(n) loops in `useFrame` for particle position updates become a bottleneck as particle count increases.
**Action:** Use `useRef` for high-frequency tracking of mouse/scroll and pass these values via uniforms to custom `ShaderMaterial` vertex shaders. Move O(n) animations to the GPU to decouple visual updates from the main thread.
