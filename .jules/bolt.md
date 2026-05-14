## 2026-05-14 - Optimize High-Frequency Mouse Tracking in Hero
**Learning:** React state updates on every mousemove event cause significant reconciliation overhead, especially with large component trees. Direct DOM manipulation via refs bypassed the React lifecycle and achieved a smoother 60fps interaction.
**Action:** Always prefer useRef and direct style updates for high-frequency visual effects (glows, cursors, parallax) that don't need to sync with other React state.
