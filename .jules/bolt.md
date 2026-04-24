## 2025-05-14 - Optimizing high-frequency React Three Fiber inputs

**Learning:** Using `useState` for high-frequency events like `mousemove` and `scroll` in a parent component causes cascading React re-renders for all child components, even if the values are only used inside Three.js `useFrame` loops. Refactoring these to `useRef` and reading the `.current` value inside `useFrame` bypasses React's reconciliation entirely for those updates.

**Action:** Always prefer `useRef` over `useState` for values that only drive animations or Three.js updates within a `useFrame` loop.
