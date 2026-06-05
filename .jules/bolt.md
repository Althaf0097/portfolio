## 2025-05-14 - [Hero mouse follow optimization]
**Learning:** High-frequency mouse tracking in React can be optimized by using `useRef` and direct DOM manipulation, reducing re-renders from O(N) to 0. When doing this, ensure initial styles are set via the `style` prop (inline) if you intend to check them via `element.style.property` in the event handler, as it doesn't read from CSS classes.
**Action:** Use `useRef` for high-frequency events and ensure inline style initialization matches the logic in the handler.
