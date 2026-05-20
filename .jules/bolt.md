## 2025-05-15 - High-Frequency Event Optimization in React 19

**Learning:** Tracking high-frequency events like mouse movement or scroll position in React state (`useState`) triggers a full reconciliation cycle on every event. In components rendering heavy content like Three.js canvases or complex CSS effects (e.g., volumetric glows), this causes significant CPU overhead and frame drops. Additionally, React 19's stricter purity rules flag non-deterministic calls like `Math.random()` inside `useMemo` or the component body, which can block builds.

**Action:** Use `useRef` to track interaction data (mouse, scroll) and consume it within high-frequency loops like Three.js's `useFrame` or via direct DOM manipulation (`ref.current.style`) to bypass React's rendering lifecycle entirely. Move all non-deterministic data generation (e.g., particle initialization) outside the component scope to ensure purity and avoid unnecessary re-calculations during re-renders.
