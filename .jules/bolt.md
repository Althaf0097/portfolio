## 2025-05-20 - Three.js Canvas Texture & Geometry Allocation in Render Cycle
**Learning:** Instantiating `THREE.CanvasTexture` or regenerating `Float32Array` buffer attributes inside Three.js component render cycles causes repeated GPU memory allocations and unhandled texture references, triggering frequent garbage collection pauses.
**Action:** Always memoize `CanvasTexture` creation and particle position arrays with `useMemo`, and call `texture.dispose()` in a `useEffect` cleanup hook on unmount.
