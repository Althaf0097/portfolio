## 2025-05-22 - Optimizing High-Frequency Tracking with Refs
**Learning:** Transitioning mouse tracking and scroll progress from React state to `useRef` significantly improves performance in Three.js and heavy UI components by bypassing the React reconciliation lifecycle. For direct DOM updates like gradients, updating `ref.current.style` inside event listeners is much faster than state-driven styles.
**Action:** Always prefer `useRef` and direct DOM/Three.js updates for high-frequency events (60fps+) like mouse move and scroll.

## 2025-05-22 - React 19 Purity and Math.random()
**Learning:** React 19's `react-hooks/purity` lint rule flags `Math.random()` inside components (including `useMemo`) because it's non-deterministic.
**Action:** Move data generation logic involving `Math.random()` to pure helper functions defined outside the component scope.
