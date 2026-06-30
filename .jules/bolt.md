## 2025-05-14 - Optimized Scene3DFullPage with refs

**Learning:** Updating React state on every `mousemove` and `scroll` event triggers excessive re-renders in 3D scenes (using React-Three-Fiber), which degrades performance. Transitioning high-frequency interaction data from `useState` to `useRef` and consuming it within `useFrame` eliminates React's reconciliation overhead while maintaining 60fps interactivity.

**Action:** Identify components with high-frequency event listeners (mouse, scroll, resize) and refactor their state management to use `useRef` when the data only needs to be consumed by animation loops or direct DOM updates.
