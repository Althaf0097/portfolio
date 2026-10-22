## 2025-05-18 - Three.js Particle and Canvas Texture Memory Leak Optimization
**Learning:** Instantiating new Float32Arrays and HTML canvas elements inside a React Three Fiber component render function causes continuous garbage collection overhead and GPU WebGL texture memory leaks on re-renders.
**Action:** Always move non-reactive array generation into static functions outside the component, memoize canvas textures with `useMemo`, and dispose of `THREE.CanvasTexture` using `texture.dispose()` on component unmount.
