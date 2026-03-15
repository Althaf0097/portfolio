## 2025-05-15 - GPU-Accelerated Particle Systems and Ref-based State
**Learning:** High-frequency state updates (mouse/scroll) in React 19 components hosting 3D scenes trigger expensive re-renders of the entire scene graph. Migrating these to `useRef` and accessing them in `useFrame` is critical. Furthermore, CPU-bound particle loops (O(n)) should always be moved to GPU vertex shaders using `ShaderMaterial` to avoid frame-time spikes and redundant buffer uploads.
**Action:** Always check for `useState` being updated in `mousemove` or `scroll` listeners within 3D scenes. Migrate these to `useRef`. For any `points` geometry with more than a few hundred particles, implement a custom `ShaderMaterial` to handle position/animation logic.

## 2025-05-15 - React 19 Purity and Impure Functions
**Learning:** React 19's `eslint-plugin-react-hooks` with purity rules flags `Math.random()` as an impure function during render, even inside `useMemo`.
**Action:** Extract random data generation to external helper functions (e.g., `src/utils/helpers/random.js`) to satisfy purity constraints and improve testability.
