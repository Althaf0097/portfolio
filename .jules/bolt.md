## 2025-05-22 - [Performance] Use Refs for High-Frequency Interaction
**Learning:** Tracking high-frequency events (mouse, scroll) using `useState` in a component that wraps complex 3D scenes or expensive UI subtrees causes massive performance degradation due to constant React reconciliation. In this project, it was causing ~60 re-renders per second for the entire background.
**Action:** Always use `useRef` for tracking mouse position and scroll progress. In Three.js/R3F, read these values inside `useFrame`. In standard components, use direct DOM manipulation via refs for visual updates (like glow effects) to achieve 60fps without React overhead.

## 2025-05-22 - [React 19] Purity and Non-Deterministic Data
**Learning:** React 19 linting (`react-hooks/purity`) flags `Math.random()` as an impure function when called during render or inside `useMemo`. This blocks the build process in strict environments.
**Action:** Move all non-deterministic data generation (e.g., initial random positions for particles) to helper functions defined outside the component scope to ensure components remain pure and pass linting.
