## 2025-05-14 - [Optimize Hero mouse glow performance]
**Learning:** High-frequency mouse tracking in `Hero.jsx` using React state caused excessive re-renders (measured ~22 per interaction). This was especially impactful as the Hero component contains complex JSX and child components.
**Action:** Use `useRef` and direct DOM manipulation with `translate3d` and `will-change: transform` for high-frequency visual updates to bypass React reconciliation and leverage GPU acceleration.
