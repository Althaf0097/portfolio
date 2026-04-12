## 2026-04-12 - Optimize high-frequency interaction re-renders in 3D scene
**Learning:** Using React `useState` for high-frequency updates like mouse movement or scrolling within a Three.js scene causes the entire component tree to re-render 60+ times per second, which is extremely inefficient and can cause jank.
**Action:** Always use `useRef` to track high-frequency interaction state (mouse, scroll) and access these values within the `useFrame` loop of Three.js components to bypass React's reconciliation engine.
