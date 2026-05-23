## 2025-05-15 - React Render Persistence for Direct DOM Updates
**Learning:** When using `useRef` and direct DOM manipulation (e.g., `transform: translate3d`) for high-frequency updates, React re-renders triggered by unrelated state changes (like timers or role rotations) will overwrite manual style changes if those styles are also defined (even as initial values) in the JSX `style` prop.
**Action:** Always use a `useEffect` (or `useLayoutEffect`) to re-apply the latest manual style from a ref after every component render to prevent "snapping" or flickering when React reconciles the DOM.
