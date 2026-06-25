## 2025-06-25 - High-frequency Event Optimization in R3F
**Learning:** Using React `useState` to track high-frequency events like `mousemove` and `scroll` in a Three.js scene causes significant performance degradation due to constant React re-renders. While `useState` is convenient, it bypasses the efficiency of the `useFrame` loop in `@react-three/fiber`.
**Action:** Always prefer `useRef` for tracking values that change every frame (mouse position, scroll progress, etc.) and read these values directly inside `useFrame` to update Three.js objects without triggering React's reconciliation cycle.

## 2025-06-25 - React 19 Purity Rules and Math.random()
**Learning:** React 19 (and its ESLint plugin) is much stricter about "purity" during render. Calling `Math.random()` inside `useMemo` or the component body is now flagged as an impure operation because it yields different results on every call, potentially causing hydration mismatches or unstable UI.
**Action:** Move non-deterministic logic like particle generation and random value assignment into static helper functions defined outside the component scope.
