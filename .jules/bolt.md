## 2025-05-15 - [Hero Mouse Tracking Optimization]
**Learning:** Using `useState` for high-frequency events like `mousemove` causes excessive React re-renders, especially when the state is used to update DOM styles. Refactoring to `useRef` and direct DOM manipulation eliminates these re-renders while maintaining interactivity.
**Action:** Always prefer `useRef` for high-frequency DOM updates (glow effects, custom cursors, parallax) to bypass the React lifecycle and improve performance. Ensure manual style updates are re-applied in a `useEffect` to persist across unrelated re-renders.

## 2025-05-15 - [React 19 Purity and Linting]
**Learning:** React 19's `react-hooks/purity` rule forbids calling `Math.random()` directly during render (even inside `useMemo`). Also, `set-state-in-effect` warns against synchronous `setState` in `useEffect`.
**Action:** Move non-deterministic logic like `Math.random()` to static helper functions outside the component. Initialize state with a function (lazy initialization) for environment-dependent values like `window.matchMedia` to avoid synchronous updates in `useEffect`.
