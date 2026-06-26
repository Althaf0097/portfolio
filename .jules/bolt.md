## 2025-05-15 - High-frequency Event Bottlenecks in Hero/3D Components

**Learning:** Using `useState` for mouse tracking and scroll progress in interactive components (like `Hero.jsx` and `Scene3DFullPage.jsx`) causes excessive re-renders (40+ per movement), leading to jank in 3D-heavy scenes. Moving these to `useRef` and updating DOM styles directly via `transform: translate3d` or within the `useFrame` loop of R3F eliminates these re-renders and leverages GPU acceleration. Additionally, React 19 linting strictly enforces purity; non-deterministic logic like `Math.random()` for particle generation must be moved out of the render body to avoid build failures.

**Action:** Always audit `mousemove` and `scroll` listeners for state updates. Prefer `useRef` + direct DOM/Three.js updates for high-frequency interactions. Move all non-deterministic initialization logic outside of component bodies or into `useMemo` to satisfy React 19 purity and performance requirements.
