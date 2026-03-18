## 2025-05-22 - [React 19 & Three.js Performance Refactoring]
**Learning:** High-frequency event tracking (mouse, scroll) with React `useState` triggers full component re-renders (diffing/reconciliation), which is catastrophic for 3D performance in `@react-three/fiber`. CPU-bound particle updates in `useFrame` scale poorly ($O(n)$ overhead). React 19 linting (via `eslint-plugin-react-hooks`) now flags `Math.random()` as an impure function during render, even inside `useMemo`.

**Action:**
1. Always use `useRef` for high-frequency updates and read `.current` inside `useFrame`.
2. Move data generation (like `Math.random`) to helper functions outside the component scope to satisfy React 19 purity rules.
3. Migrate $O(n)$ position updates to `ShaderMaterial` vertex shaders to leverage GPU parallelization.
4. Initialize `useReducedMotion` state directly with `window.matchMedia().matches` to avoid double-render on mount.
