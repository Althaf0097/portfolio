## 2025-09-10 - Memoizing Procedural Canvas Textures in React Three Fiber
**Learning:** Creating a canvas element and `THREE.CanvasTexture` inline during render loop in R3F components re-allocates DOM canvas elements and WebGL texture objects on every render pass, causing severe GC pressure and GPU memory fragmentation.
**Action:** Always wrap procedural `THREE.CanvasTexture` creation in `useMemo` and dispose of the texture via `texture.dispose()` inside a `useEffect` cleanup return.
