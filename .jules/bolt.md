## 2026-04-19 - GPU-Accelerated Particles & Render Optimization
**Learning:** High-frequency event tracking (mouse, scroll) with React `useState` causes excessive re-renders (60+ FPS). Moving logic to `useRef` and GPU shaders eliminates React reconciliation overhead.
**Action:** Always use `useRef` for high-frequency interaction data in Three.js and migrate vertex calculations to GLSL `ShaderMaterial` to offload the CPU.

**Learning:** React 19 `react-hooks/purity` rules prevent `Math.random()` inside components or `useMemo`.
**Action:** Move non-deterministic data generation to external helper functions to maintain component purity and pass linting.
