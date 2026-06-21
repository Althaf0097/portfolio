## 2025-06-21 - Optimize high-frequency re-renders in Scene3DFullPage
**Learning:** Using `useState` to track mouse position and scroll progress in a parent component that contains a complex Three.js scene causes the entire component and its children to re-render on every event. This is especially problematic in React 19 where linting rules (purity) and reconciliation are stricter.
**Action:** Use `useRef` to store high-frequency interaction data and consume these refs within `useFrame` (for Three.js) or `gsap.ticker` to maintain high performance and 0 re-renders during interactions.
