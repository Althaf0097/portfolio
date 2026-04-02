## 2025-05-15 - GPU-Accelerated Particles & Ref-based Interaction

**Learning:** High-frequency React state updates (60fps) for 3D interaction (mouse/scroll) cause significant CPU overhead due to React's reconciliation and component tree re-renders. Moving these updates to `useRef` and accessing them within the Three.js `useFrame` loop bypasses React entirely for frame-by-frame updates. Additionally, CPU-bound particle loops in `useFrame` are O(n) and inefficient; offloading these to a GPU `ShaderMaterial` provides a massive performance boost.

**Action:** Always use `useRef` for tracking mouse and scroll progress in 3D scenes. Implement `ShaderMaterial` for particle systems with more than a few hundred points to ensure smooth performance across devices.
