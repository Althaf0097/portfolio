# Performance Journal

## 2025-05-15 - High-frequency event re-renders
**Learning:** In React applications with 3D backgrounds or interactive mouse effects, using `useState` for mouse position or scroll progress triggers re-renders of the entire component tree at 60fps+, causing significant CPU overhead and potential frame drops.
**Action:** Use `useRef` to store high-frequency values and either read them directly in the animation loop (for 3D/Canvas) or use direct DOM manipulation for CSS effects.
