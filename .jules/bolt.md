## 2025-05-15 - Optimizing High-Frequency Interaction in 3D Scenes
**Learning:** Storing mouse position and scroll progress in React state within a Three.js scene triggers full-tree reconciliation for every frame of movement. In a component with many children (like a particle system or floating shapes), this leads to excessive CPU overhead and dropped frames.
**Action:** Use `useRef` to track high-frequency interaction data and access it directly within the `@react-three/fiber` `useFrame` loop. This bypasses React's rendering lifecycle for visual-only updates.
