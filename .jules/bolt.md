## 2025-05-15 - [Hero Component Mouse Tracking Optimization]
**Learning:** High-frequency events (like `mousemove` or `scroll`) used for purely visual effects (e.g., background gradients, parallax) should bypass React's state management. Using `useState` to track mouse position in a top-level component like `Hero` causes the entire component tree to re-render on every movement, leading to significant performance degradation and battery drain. Direct DOM manipulation via `useRef` within event listeners (or `useFrame` for Three.js) eliminates these re-renders entirely.

**Action:** Always audit components for state-based mouse or scroll tracking. If the value is only used for visual styling (CSS properties), refactor to use `useRef` and direct style updates or CSS variables.
