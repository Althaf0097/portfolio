# Bolt's Performance Journal

## 2025-05-15 - [GPU-Accelerated Particle Systems & React Render Optimization]
**Learning:** In Three.js/React-Three-Fiber, updating geometry attributes (like `positions.needsUpdate = true`) every frame on the CPU creates a significant bottleneck by re-uploading the entire buffer to the GPU. Additionally, using `useState` for high-frequency events (mouse/scroll) triggers full React component re-renders that can cause frame drops and "jank".
**Action:** Always move high-frequency animation logic to custom shaders (using `uTime` and `uMouse` uniforms) and replace `useState` with `useRef` for tracking continuous user interaction to bypass the React render cycle.
