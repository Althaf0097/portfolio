## 2025-05-15 - [GPU Shaders and Ref-based Parallax]
**Learning:** High-frequency state updates (mouse/scroll) in React components hosting Three.js scenes cause extreme re-render overhead. CPU-bound particle loops in `useFrame` are O(n) and block the main thread, leading to jank on high-density screens.
**Action:** Use `useRef` for tracking mouse/scroll data and pass them into a `ShaderMaterial` via uniforms. Moving the animation logic to the vertex shader reduces per-frame CPU work to O(1) and eliminates the need for expensive geometry attribute updates.
