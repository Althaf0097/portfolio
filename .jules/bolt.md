## 2025-05-15 - [Refactor high-frequency event handling to useRef]
**Learning:** Using React state for mouse movement and scroll progress in 3D scenes or frequent visual updates (like radial gradients) triggers excessive re-renders (dozens per second), which causes high CPU usage and can lead to dropped frames. Refactoring these to `useRef` and reading them in the `useFrame` loop (Three.js) or using direct DOM manipulation bypasses the React reconciliation overhead entirely.
**Action:** Always prefer `useRef` for tracking continuous inputs (mouse, scroll, sensors) that only drive visual animations and don't require React to synchronize other parts of the UI state.

## 2025-05-15 - [React 19 Purity and Math.random]
**Learning:** React 19's `react-hooks/purity` lint rule flags `Math.random()` as an impure function if called during render or inside `useMemo`. This is to ensure component re-renders are deterministic.
**Action:** Move data generation logic that uses `Math.random()` (like particle positions or colors) to helper functions defined outside the component scope to maintain purity and satisfy linting requirements.
