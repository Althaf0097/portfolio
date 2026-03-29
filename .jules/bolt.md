## 2025-05-15 - [GPU-Accelerated Particle System]
**Learning:** Moving particle animation loops from React's `useFrame` (CPU-bound O(n)) to GLSL vertex shaders (GPU-parallelized) drastically reduces CPU usage and main thread blocking, especially for systems with 1000+ particles. Combining this with `useRef` for tracking mouse/scroll events eliminates unnecessary React re-renders triggered by `useState`.
**Action:** Always prefer `ShaderMaterial` for large-scale procedural animations in Three.js and use `useRef` for high-frequency input tracking (mouse, scroll, time).

## 2025-05-15 - [React 19 Purity and Math.random()]
**Learning:** React 19's `react-hooks/purity` rule flags `Math.random()` as an impure function when called inside `useMemo` or during render. This is intended to ensure components are idempotent.
**Action:** Move data generation logic that relies on `Math.random()` or other impure functions into helper functions defined outside the component scope.
