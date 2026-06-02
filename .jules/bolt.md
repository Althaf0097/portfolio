## 2025-05-14 - Optimized Hero Mouse Tracking
**Learning:** High-frequency mouse events in Hero.jsx were triggering unnecessary React re-renders (measured ~98 per interaction). Using useRef and direct DOM manipulation bypasses React's reconciliation, maintaining 60fps without overhead.
**Action:** Always prefer useRef/direct DOM updates for high-frequency interactive elements like follow-glows or parallax.
