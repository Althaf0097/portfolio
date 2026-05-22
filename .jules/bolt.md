## 2025-05-15 - High-frequency event optimization
**Learning:** React state updates on every mouse move or scroll event trigger expensive reconciliation cycles. This is especially impactful in Three.js (react-three-fiber) scenes where performance is critical.
**Action:** Use `useRef` to track high-frequency data (mouse, scroll) and read it directly within `useFrame` or event listeners with direct DOM manipulation to bypass the React render loop.

## 2025-05-15 - React 19 Purity Rules
**Learning:** React 19's `react-hooks/purity` rule flags `Math.random()` as an impure function if called directly during render or inside `useMemo`.
**Action:** Move data generation logic using non-deterministic functions like `Math.random()` to helper functions defined outside the component scope to maintain idempotency.
