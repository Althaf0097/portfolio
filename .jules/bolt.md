# Bolt's Performance Journal

## 2025-05-15 - High-frequency re-renders in 3D scenes
**Learning:** React state updates (`useState`) for tracking mouse movement or scroll progress inside a Three.js scene cause full component re-renders that significantly degrade FPS.
**Action:** Use `useRef` to store interaction data and read from `.current` inside the `@react-three/fiber` `useFrame` loop.

## 2025-05-15 - GPU-accelerated particle systems
**Learning:** Updating thousands of particle positions in a JS `useFrame` loop (CPU) is O(n) and causes frame drops.
**Action:** Move particle animation logic (noise, parallax, floating) to a GLSL vertex shader using `ShaderMaterial` to offload work to the GPU.

## 2025-05-15 - React 19 Purity and Math.random()
**Learning:** React 19 linting (`react-hooks/purity`) flags `Math.random()` inside `useMemo` or the render body as impure.
**Action:** Extract data generation logic to helper functions defined outside the component scope to ensure idempotent renders.
