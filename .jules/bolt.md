## 2025-05-14 - [React 19 Three.js Optimization]
**Learning:** High-frequency state updates (mouse/scroll) in React 19 trigger aggressive reconciliation that can degrade 3D performance. React 19 also strictly enforces component purity, flagging `Math.random()` as an impure function during render.
**Action:** Always refactor high-frequency event data to `useRef` and consume via `useFrame` to skip React's render cycle. Move non-deterministic data generation to static helper functions outside component scope to satisfy purity rules.
