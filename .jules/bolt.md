# Bolt Journal - Critical Learnings

## 2025-05-14 - Optimizing High-Frequency Interactions
**Learning:** Moving high-frequency mouse and scroll tracking from React state to `useRef` eliminates component re-renders during interaction. In `Hero.jsx`, this reduced re-renders from $O(N)$ to 0 during mouse movement. Restoring functionality (like parallax) using refs within Three.js `useFrame` preserves interactivity without the React reconciliation cost.
**Action:** Prioritize refactoring `useState` to `useRef` for any interaction that updates at 60fps and doesn't require React's UI synchronization.
