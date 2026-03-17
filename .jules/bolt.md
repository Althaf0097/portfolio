## 2025-05-14 - Performance-focused Scene Updates
**Learning:** Updating React state on every mouse movement or scroll event in a Three.js scene causes the entire component tree to re-render 60+ times per second, leading to significant CPU overhead.
**Action:** Use `useRef` to track high-frequency values like mouse position and scroll progress, then access these refs directly within the `useFrame` loop to skip the React reconciliation cycle entirely.

**Learning:** Initializing `useState` with a default value and then immediately updating it in a `useEffect` on mount triggers a redundant cascading render.
**Action:** Use a lazy initializer function in `useState` to set the initial state from `window.matchMedia` or other synchronous browser APIs.
