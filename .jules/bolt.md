## 2026-05-04 - [High-frequency Event R3F Optimization]
**Learning:** In React-Three-Fiber applications, using `useState` for tracking high-frequency events like mouse movement or scrolling causes the entire Canvas and its children to re-render ~60-100 times per second, leading to significant CPU overhead and potential frame drops.
**Action:** Always use `useRef` to track high-frequency data and read the ref value directly inside the `useFrame` loop to bypass React's reconciliation cycle.

## 2026-05-04 - [Playwright Verification with Security Utilities]
**Learning:** The project's security utility (`src/utils/security.js`) disables `eval()`, which causes Playwright's `page.evaluate()` to fail during frontend verification.
**Action:** Use native Playwright actions like `page.mouse.wheel()` or `page.mouse.move()` instead of `page.evaluate()` for simulating user interactions when security measures are active.
