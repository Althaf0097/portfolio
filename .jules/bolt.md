## 2026-04-27 - High-Frequency Event Optimization

**Learning:** Updating React state on every `mousemove` or `scroll` event causes the entire component and its children to re-render at the display's refresh rate (e.g., 60Hz), leading to significant CPU overhead and potential frame drops, especially in heavy components like 3D scenes or complex headers.

**Action:** Use `useRef` to track high-frequency values and perform direct DOM manipulation (e.g., `element.style.setProperty`) or read from refs inside a `useFrame` loop (for Three.js) to bypass React's reconciliation process entirely for these updates.

## 2026-04-27 - React 19 Purity Checks

**Learning:** React 19 linting rules (`react-hooks/purity`) flag `Math.random()` as an impure function if called during render or inside `useMemo`. This is to ensure component idempotency.

**Action:** Move data generation logic that uses `Math.random()` to helper functions defined outside the component scope to satisfy purity requirements.

## 2026-04-27 - SSR-Safe Hook Initialization

**Learning:** Initializing state in `useEffect` with values from `window` or `matchMedia` can cause a double-render (initial false/default, then update to actual value).

**Action:** Use lazy initialization in `useState` with a check for `typeof window !== 'undefined'` to set the correct initial state immediately on the client, avoiding the extra render.
