## 2025-05-15 - Optimizing High-Frequency Interactions and Initial State
**Learning:** Calling `getBoundingClientRect()` inside an `onMouseMove` handler causes layout thrashing by forcing the browser to recalculate styles and layout on every frame. Additionally, updating complex CSS properties like `background: radial-gradient(...)` is CPU-intensive as it triggers a Repaint on every move.
**Action:** Cache the element's bounding rectangle on `onMouseEnter` using `useRef`. For high-frequency visual updates, use `transform: translate3d()` on a separate layer to leverage GPU acceleration and avoid Repaints.

## 2025-05-15 - React 19 Cascading Renders
**Learning:** Initializing state in `useEffect` for environment-dependent values (like `window.matchMedia`) causes a "cascading render" where React renders once with a default value and then immediately re-renders after the effect runs.
**Action:** Use lazy initialization in `useState` (`useState(() => ... )`) to capture the correct environment state during the initial render, ensuring the component is born with the correct state and avoiding the secondary render cycle.
