## 2025-05-15 - GPU Particle Acceleration and Render Optimization

**Learning:** High-frequency events (mouse move, scroll) updating React state (`useState`) caused 60+ re-renders per second in the `Scene3DFullPage` component, leading to significant reconciliation overhead. Additionally, animating 1000+ particle positions on the CPU in a `useFrame` loop was a major bottleneck.

**Action:** Refactor high-frequency state to `useRef` to bypass React's render cycle for interaction tracking. Migrate particle animation logic to GLSL using `ShaderMaterial` to offload work to the GPU. This reduced React re-renders by over 95% during interaction and improved frame consistency.
