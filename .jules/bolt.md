## 2025-05-14 - [React 19 Purity and Ref Performance]
**Learning:** High-frequency state updates (mouse/scroll) in 3D scenes cause massive React reconciliation overhead (80+ re-renders per second). React 19 also strictly enforces purity, flagging `Math.random()` as an error if called during render or `useMemo`.
**Action:** Move high-frequency state to `useRef`, access `.current` inside `useFrame` (which runs outside React's render cycle), and extract non-deterministic data generation (like `Math.random()`) to helper functions defined outside the component scope to satisfy purity rules.
