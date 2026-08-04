# Bolt's Journal

## 2025-05-15 - React 19 Three.js Render Purity & Canvas Texture Memoization
**Learning:** Instantiating new canvas/texture configurations or using non-deterministic calls like `Math.random()` inside a React Three Fiber component's render function blocks rendering optimization and triggers React 19 lint errors. It also causes significant memory allocation and garbage collection overhead in WebGL rendering contexts.
**Action:** Move non-deterministic geometry/particle creation to static helpers outside components and memoize canvas/texture configurations (using `useMemo` for static references or updating them procedurally inside a single `useFrame` hook).
