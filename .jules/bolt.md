## 2025-05-15 - State-to-Ref for R3F Parent Components
**Learning:** In @react-three/fiber applications, tracking high-frequency events like mouse movement or scroll progress using React `useState` in a parent component that wraps a `Canvas` causes the entire component (including the `Canvas`) to re-render. While R3F is efficient, these top-level re-renders are unnecessary and can be eliminated by using `useRef`.
**Action:** Always prefer `useRef` and `useFrame` for high-frequency interactions in R3F scenes. Use benchmarking (like counting component renders) to quantify the impact.
