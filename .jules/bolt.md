## 2025-05-14 - High-frequency state updates in Three.js
**Learning:** Using `useState` to track mouse position and scroll progress in Three.js components triggers full React re-renders on every event, which is extremely expensive for 3D scenes.
**Action:** Use `useRef` to store high-frequency data and access it directly within the `useFrame` loop to maintain 60fps performance without unnecessary React overhead.
