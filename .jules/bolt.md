## 2025-05-14 - [React Re-render Optimization in 3D Scenes]
**Learning:** High-frequency events like `mousemove` and `scroll` updating React state causes excessive re-renders (60+ FPS) of the entire component tree. In 3D applications using `@react-three/fiber`, these values should be stored in `useRef` and accessed within the `useFrame` loop to avoid the React reconciliation overhead while maintaining smooth animations.
**Action:** Replace `useState` with `useRef` for mouse tracking and scroll progress in 3D background components.
