## 2025-05-15 - State vs Refs in R3F High-Frequency Events
**Learning:** Using `useState` to track mouse position or scroll progress in components containing `@react-three/fiber` `Canvas` causes hundreds of unnecessary React re-renders, as each update triggers the full reconciliation cycle.
**Action:** Always use `useRef` to store high-frequency data (mouse, scroll, time) and read from these refs directly inside the `useFrame` loop to achieve 60fps performance with zero React re-renders.

## 2025-05-15 - React 19 Purity and Math.random()
**Learning:** React 19's `react-hooks/purity` rule (and associated ESLint plugins) flag `Math.random()` as an impure function when called directly during render or inside `useMemo`.
**Action:** Move non-deterministic initialization logic (like generating random particle positions) into static helper functions defined outside the component body to satisfy idempotency requirements.
