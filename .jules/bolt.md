## 2025-05-14 - Optimized High-Frequency Interactions in 3D Scenes
**Learning:** Updating React state (useState) on every mousemove or scroll event triggers a full component re-render at 60fps. This causes significant overhead in the React reconciliation loop, especially for complex 3D scenes using @react-three/fiber.
**Action:** Use useRef to track high-frequency interaction data and access it directly within the useFrame loop. This bypasses React's rendering lifecycle for visual updates that don't affect the DOM structure.
