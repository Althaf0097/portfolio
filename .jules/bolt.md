## 2025-08-03 - Prevent CanvasTexture Recreation & GPU memory leaks in React Three Fiber

**Learning:** Re-allocating geometry parameters (e.g., coordinates) and reinstantiating custom canvas textures inside a React Three Fiber component render loop on every frame or state change triggers severe layout thrashing, massive garbage collection overhead, and constant GPU-to-CPU data uploads, eventually leading to memory leaks and browser page crashes.
**Action:** Always extract procedural static geometry data generators (like particle position grids) to helper functions outside the component, cache/memoize ThreeJS geometry buffers and CanvasTextures using `useMemo`, and explicitly dispose of textures on component unmount using a cleanup function.
