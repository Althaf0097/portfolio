
## 2026-05-29 - [Percentage Math vs Pixel Offsets in Direct DOM Updates]
**Learning:** When using direct DOM style updates to bypass React re-renders for mouse tracking, percentage-based transforms (like `translate3d(x%, y%, 0)`) apply relative to the element's own dimensions. If the element is larger than the viewport (e.g., 200vw), the visual movement will be scaled incorrectly (moving twice as fast). Also, direct style updates override CSS class-based transforms (like Tailwind's `-translate-x-1/2`).
**Action:** Use pixel offsets from the viewport center combined with `calc(-50% + ${offset}px)` in the transform string to maintain centering and accurate tracking without being affected by the element's scale or class overrides.
