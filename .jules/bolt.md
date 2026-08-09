# Bolt's Journal

## 2025-08-09 - Memoizing WebGL Textures and Caching Element Rects
**Learning:** Instantiating ThreeJS assets (like `THREE.CanvasTexture`) inside React component render functions leads to severe WebGL resource leaks and garbage collection bottlenecks because the texture is instantiated from scratch on every single component render. Similarly, calling `getBoundingClientRect()` inside high-frequency `mousemove` handlers causes layout thrashing by forcing synchronous reflows.
**Action:** Use `useMemo` for any Canvas/Texture creations in ThreeJS and implement explicit resource cleanups (e.g. `texture.dispose()`) inside a `useEffect` unmount callback. For high-frequency mouse-tracking elements, cache the dimensions in a `useRef` during `onMouseEnter` rather than querying the DOM in the `onMouseMove` event callback.
