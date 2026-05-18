## 2026-05-18 - Optimizing high-frequency events in R3F with refs
**Learning:** Using React state for high-frequency updates (like mouse movement) in @react-three/fiber triggers full component re-renders (up to 60fps), causing significant CPU overhead and potential frame drops. Refactoring to 'useRef' and reading the value directly inside the 'useFrame' loop bypasses the React reconciliation process entirely.
**Action:** Always use 'useRef' for high-frequency data (mouse, scroll, sensors) that needs to be consumed frame-by-frame in Three.js components to maintain 60fps performance.
