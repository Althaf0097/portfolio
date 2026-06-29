## 2025-05-15 - Optimize high-frequency mouse tracking in React
**Learning:** Updating React state on every `mousemove` event triggers full component re-renders at ~60-120 FPS, causing significant CPU overhead in large components like `Hero`.
**Action:** Use `useRef` and direct DOM manipulation with `willChange` CSS hints to handle high-frequency UI updates without triggering React's reconciliation cycle.

## 2025-05-15 - React 19 Purity and Math.random()
**Learning:** React 19 linting (specifically `react-hooks/purity`) blocks calling non-deterministic functions like `Math.random()` directly within the component body or `useMemo` blocks.
**Action:** Move data generation logic using `Math.random()` to static helper functions defined outside the component scope to maintain purity and satisfy ESLint rules.
