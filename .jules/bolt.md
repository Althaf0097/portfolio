
## 2025-05-14 - Direct DOM manipulation for high-frequency events
**Learning:** React state updates on mousemove trigger expensive re-renders (dozens per second), which is unnecessary for purely visual effects like radial gradients.
**Action:** Use `useRef` and direct DOM element style updates inside event listeners to bypass React's reconciliation and achieve 60fps performance without overhead.
