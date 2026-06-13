## 2025-05-15 - Eliminating High-Frequency Interaction Re-renders
**Learning:** High-frequency events like `mousemove` and `scroll` can cause massive performance degradation in React if they trigger state updates, especially in 3D scenes or components with complex CSS effects.
**Action:** Use `useRef` to track high-frequency values and either apply direct DOM manipulation or read from the refs inside an animation loop (like Three.js `useFrame`) to achieve 60fps performance without triggering React's reconciliation cycle.

## 2025-05-15 - React 19 Purity and Side Effects
**Learning:** React 19 (and newer ESLint rules) strictly enforce component purity. Non-deterministic functions like `Math.random()` used during render (e.g., inside `useMemo`) will trigger linting errors.
**Action:** Move random data generation or impure logic into helper functions defined outside the component body.

## 2025-05-15 - CSS Variables for GPU-Accelerated Interactions
**Learning:** Updating complex inline styles (like radial gradients) via direct DOM manipulation is fast, but using CSS variables for coordinates can be even more efficient when combined with `transform: translate3d`.
**Action:** In `Hero.jsx`, updated the glow effect to use direct DOM style updates to bypass React re-renders.
