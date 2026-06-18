# Bolt's Journal - Critical Learnings

## 2025-05-14 - High-frequency events in React + Three.js
**Learning:** High-frequency events like `mousemove` and `scroll` in React components containing complex subtrees (like Three.js Canvas) should use `useRef` instead of `useState` to avoid expensive re-renders of the entire scene.
**Action:** Always audit components for `mousemove` or `scroll` listeners that update state, and refactor them to use refs and direct DOM/Three.js updates.
