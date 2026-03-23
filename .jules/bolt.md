## 2025-05-15 - [High-Frequency Interaction Re-renders]
**Learning:** Using React state (useState) to track mouse position and scroll progress at 60fps+ triggers expensive component tree reconciliation and re-renders, causing noticeable performance degradation especially in components with 3D scenes or complex UI.
**Action:** Move high-frequency event tracking to `useRef`. In Three.js components, access these refs within `useFrame` callbacks. For DOM elements, update styles directly via `ref.current.style` inside the event listener to bypass React's rendering lifecycle entirely.
