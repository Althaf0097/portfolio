## 2025-05-15 - Optimize High-Frequency Mouse Tracking in Hero.jsx
**Learning:** Using React state (`useState`) to track high-frequency events like `mousemove` causes the entire component to re-render on every update, which is a major performance bottleneck.
**Action:** Refactor high-frequency state updates to `useRef` and perform direct DOM manipulation to eliminate React re-renders and improve UI responsiveness.
