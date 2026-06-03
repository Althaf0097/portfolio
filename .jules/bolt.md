# Bolt's Journal

## 2025-01-24 - [High-frequency Event Optimization]
**Learning:** React state updates on high-frequency events like `mousemove` trigger expensive reconciliation and component re-renders. This can be completely bypassed by using `useRef` and direct DOM manipulation. Furthermore, animating `transform: translate3d()` is superior to animating properties like `background` because it leverages hardware acceleration and avoids the browser's paint pipeline.
**Action:** Always use `useRef` for mouse-tracking or scroll-tracking UI elements and prefer `transform` over layout/paint properties for 60fps performance.
