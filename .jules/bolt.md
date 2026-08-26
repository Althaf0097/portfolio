## 2026-08-26 - Memoize Three.js Canvas Textures in R3F Render Scope
**Learning:** Instantiating `new THREE.CanvasTexture(canvas)` and generating `Float32Array` buffers on component re-renders causes significant memory leaks and garbage collection bottlenecks in `@react-three/fiber` scenes.
**Action:** Always wrap texture creation and buffer initialization in `useMemo` with minimal dependencies, and extract non-deterministic position generators into pure functions outside component render bodies to satisfy React 19 purity rules.
