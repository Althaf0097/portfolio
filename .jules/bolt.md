## 2025-05-24 - Three.js Particle Buffer and CanvasTexture Memoization in React 19

**Learning:** Instantiating `Float32Array` buffers and `THREE.CanvasTexture` elements inside a React Three Fiber component body without `useMemo` causes allocation overhead, GPU texture inflation, and React 19 purity lint violations (`react-hooks/purity`). Furthermore, omitting `texture.dispose()` on unmount creates GPU memory leaks during route changes.

**Action:** Always wrap particle buffer array generation and `CanvasTexture` creation in `useMemo`, move non-deterministic calls like `Math.random()` to top-level helper functions outside the render tree, and include an explicit `texture.dispose()` cleanup in `useEffect`.
