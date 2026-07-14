## 2025-05-15 - [Glare Performance Optimization]
**Learning:** Updating the `background` property (especially complex radial gradients) on every mouse movement triggers expensive browser repaints. Using `transform: translate3d()` is significantly more efficient as it leverages hardware acceleration and keeps the element on a separate compositor layer.
**Action:** Favor `transform` for high-frequency position updates over properties that cause layout or repaint cycles.

## 2025-05-15 - [React 19 Cascading Renders]
**Learning:** Calling `setState` synchronously within a `useEffect` on mount triggers an immediate second render cycle (cascading render). React 19 linting strictly warns against this.
**Action:** Use lazy initialization in `useState` for environment-dependent values (like `window.matchMedia`) to ensure the initial state is correct from the first render.
