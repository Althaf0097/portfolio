## 2025-05-14 - [Hero Component Mouse Tracking Optimization]
**Learning:** High-frequency mouse tracking using React state (setMousePos) triggers expensive component re-renders on every mouse movement, which can significantly degrade performance, especially in components with complex nested children or effects.
**Action:** Use 'useRef' to store mouse coordinates and perform direct DOM style manipulations for decorative visual effects (like the Hero glow) to bypass the React reconciliation cycle and maintain 60fps performance with 0 re-renders.
