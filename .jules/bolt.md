## 2025-09-03 - Memoize Three.js Canvas Textures to Prevent GPU Memory Leaks
**Learning:** Instantiating `THREE.CanvasTexture` with dynamically created DOM canvas elements inside R3F component render loops causes severe WebGL texture leaks and main-thread GC pauses on every React re-render.
**Action:** Always extract canvas element and texture creation into static helper functions outside the component, memoize with `useMemo`, and dispose WebGL resources (`texture.dispose()`) on unmount.
