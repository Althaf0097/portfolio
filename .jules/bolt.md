## 2025-05-14 - Optimized High-Frequency Event Handling
**Learning:** Updating React state on every `mousemove` or `scroll` event triggers excessive re-renders, especially in complex 3D scenes or sections with heavy CSS filters/gradients. Moving these to `useRef` and using `useFrame` (for Three.js) or direct DOM manipulation (for standard elements) significantly improves FPS and reduces main-thread jank.
**Action:** Always prefer `useRef` and direct DOM/property updates for high-frequency events (>60Hz) that don't need to sync with other React state.

## 2025-05-14 - React 19 Purity and Math.random()
**Learning:** React 19's `react-hooks/purity` rule flags `Math.random()` as an impure function when used inside components or `useMemo`. This is to ensure idempotency during concurrent rendering.
**Action:** Move data generation logic that uses `Math.random()` to helper functions defined outside the component scope to satisfy purity requirements.
