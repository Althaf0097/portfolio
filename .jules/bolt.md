## 2025-05-15 - Optimizing high-frequency React Three Fiber updates
**Learning:** Using React state (useState) to track high-frequency events like mousemove or scroll in a parent component that contains a Three.js Canvas causes the entire scene to re-render 60+ times per second, leading to significant performance degradation.
**Action:** Always use `useRef` for high-frequency coordinate tracking and read the ref values within the `useFrame` loop of R3F components to achieve smooth animations without React re-renders.

## 2025-05-15 - React 19 Purity and Hydration
**Learning:** React 19 (and ESLint `react-hooks/purity`) strictly enforces component idempotency. Non-deterministic calls like `Math.random()` or environment-dependent checks like `window.matchMedia()` inside the render body or `useEffect` without proper initialization trigger errors or cascading renders.
**Action:** Move `Math.random()` logic into static helper functions outside the component. Use lazy initialization functions within `useState` for environment-dependent values to ensure stability and compatibility with SSR/hydration.
