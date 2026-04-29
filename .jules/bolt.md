## 2026-04-29 - Optimize high-frequency re-renders
**Learning:** Refactoring state updates triggered by frequent events (mouse movement, scroll) to use `useRef` and direct DOM manipulation or `useFrame` loops significantly reduces React reconciliation overhead.
**Action:** Always prefer `useRef` for tracking high-frequency values like mouse position or scroll progress, especially when consumed by Three.js `useFrame` or for purely visual DOM updates.
