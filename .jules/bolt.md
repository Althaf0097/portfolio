## 2025-05-15 - Avoid Layout Thrashing in High-Frequency Events
**Learning:** Calling `getBoundingClientRect()` inside a `mousemove` or `scroll` handler triggers synchronous reflow, which is a major performance bottleneck even if React re-renders are avoided.
**Action:** Always cache dimensions in a `useRef` or state, updating them only on `resize` or `scroll` events, to ensure high-frequency handlers remain lean and performant.

## 2025-05-15 - Direct DOM vs. React State for Interactions
**Learning:** For continuous visual effects (like a mouse-following glow), direct DOM manipulation via `useRef` and `transform: translate3d()` is significantly more performant than React state because it bypasses the entire reconciliation and virtual DOM overhead.
**Action:** Use refs for high-frequency visual updates that don't affect the application's logical state.
