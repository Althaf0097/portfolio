
## 2026-03-12 - [GPU-Accelerated Particles & Render Optimization]
**Learning:** Updating large Three.js buffer attributes (O(n)) in the main loop and storing high-frequency event data (mouse/scroll) in React state are major performance killers in 3D portfolios. React 19 rules (purity, ref access during render) also enforce better habits like externalizing random generation and preventing ref-access-during-render.
**Action:** Always migrate O(n) geometry updates to vertex shaders and use `useRef` for high-frequency state updates to bypass the React render cycle.
