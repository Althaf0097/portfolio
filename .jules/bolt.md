## 2025-05-15 - GPU-Accelerated Particle Animation and React 19 Purity

**Learning:** Migrating particle position calculations from a CPU-bound `useFrame` loop to a custom `ShaderMaterial` (vertex shader) significantly reduces per-frame overhead and eliminates large buffer uploads. Additionally, React 19's `react-hooks/purity` rule flags `Math.random()` as an impure function when used inside `useMemo` or during render; this requires moving data generation logic outside the component scope.

**Action:** Always favor GPGPU for high-count particle systems and move any non-deterministic data generation (like `Math.random`) to helper functions defined outside of React components to maintain purity and performance.
