## 2025-05-15 - Optimizing High-Frequency Updates with Refs and Shaders
**Learning:** High-frequency events like mouse movement and scroll in React-Three-Fiber applications can cause significant performance degradation if tracked via `useState`, as they trigger full component re-renders at 60fps+. Offloading particle animations to the GPU via `ShaderMaterial` and using `useRef` for tracking interactivity bypasses React's reconciliation loop entirely.
**Action:** Always prefer `useRef` + `useFrame` for tracking mouse/scroll in 3D scenes. Migrate CPU-bound particle loops to Vertex Shaders to reduce main-thread load.

## 2025-05-15 - React 19 Purity and Linter Guardrails
**Learning:** React 19's `react-hooks/purity` rule is strict about `Math.random()` inside components, even within `useMemo`. Additionally, `no-unused-vars` can block builds on pre-existing code.
**Action:** Define data generation helpers outside component scopes to satisfy purity rules. Use `_` prefix for necessary but unused variables to satisfy the linter without making breaking changes to exported APIs.
