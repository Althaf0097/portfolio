## 2025-05-15 - Optimized high-frequency events in 3D scenes
**Learning:** Using React `useState` for high-frequency events like mouse movement and scroll progress in `@react-three/fiber` scenes triggers full component re-renders at 60fps, creating a significant performance bottleneck in the React reconciler.
**Action:** Use `useRef` to track high-frequency interaction data and access the latest values via `.current` inside `useFrame` loops. This bypasses React re-renders while maintaining smooth, frame-perfect 3D animations.
