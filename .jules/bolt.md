## 2025-05-15 - [React 19 & Three.js Re-render Optimization]
**Learning:** High-frequency events like `mousemove` and `scroll` triggered via React state cause full component re-renders, impacting performance in 3D scenes. React 19 also strictly enforces purity, flagging `Math.random()` as an impure function during render/memoization.
**Action:** Always use `useRef` for tracking continuous inputs in R3F scenes and consume them inside `useFrame`. Move non-deterministic data generation (like `Math.random()`) to helper functions outside the component scope to satisfy purity rules.
