## 2025-05-15 - High-frequency interaction optimization
**Learning:** Using `useState` to track mouse movement and scroll progress in React components with complex children (or Three.js scenes) causes massive performance overhead due to constant re-renders. Moving these to `useRef` and updating either the DOM directly or using `useFrame` bypasses the React lifecycle and maintains 60fps.
**Action:** Always prefer `useRef` over `useState` for tracking continuous inputs like mouse position or scroll progress, especially when they drive visual effects.

## 2025-05-15 - React 19 Purity and Refs
**Learning:** React 19 ESLint rules (`react-hooks/purity` and `react-hooks/refs`) are strict about calling `Math.random()` inside render/useMemo and accessing `ref.current` during the render phase.
**Action:** Move non-deterministic logic (like random particle generation) to helper functions defined outside the component scope. For high-frequency visual updates, use `useRef` to store positions and apply them directly in effects or animation loops, avoiding `ref.current` access in the JSX returned by the component.
