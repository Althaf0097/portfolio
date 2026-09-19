## 2025-05-18 - Three.js Canvas Texture Memoization and Cleanup
**Learning:** In @react-three/fiber components, instantiating `THREE.CanvasTexture` or raw `Float32Array` buffers inside render bodies creates new WebGL textures and heap memory allocations on every re-render, leading to GPU memory leaks and garbage collection pauses.
**Action:** Always wrap procedural canvas texture creation and static buffer attributes in `useMemo`, and explicitly call `texture.dispose()` inside a `useEffect` unmount cleanup function.
