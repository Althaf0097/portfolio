## 2025-05-15 - Optimize Scene3DFullPage high-frequency updates
**Learning:** Using useState for values updated at 60fps (mouse, scroll) in a parent component causes massive unnecessary React reconciliation overhead for the entire 3D scene.
**Action:** Always use useRef for high-frequency tracking in Three.js scenes and consume those refs within the useFrame loop to bypass React's render cycle.
