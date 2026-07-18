# Bolt's Journal - Critical Learnings

## 2025-02-18 - Avoid layout thrashing in high-frequency interactions
**Learning:** Accessing `getBoundingClientRect()` inside a `mousemove` listener triggers synchronous reflow/layout thrashing. Normalizing coordinates relative to the page and caching the bounding rectangle during `mouseenter` prevents unnecessary browser paint and layout calculations.
**Action:** Always cache dimensions in `useRef` for hover/mouse tracking interactions and use `pageX/pageY` coordinate lookups normalized to page space.
