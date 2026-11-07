# Bolt's Journal - Critical Learnings Only

## 2025-02-15 - GPU-Accelerated Spotlight Glare and Layout Thrashing in Interactive Cards
**Learning:** High-frequency mouse tracking elements updating inline `background: radial-gradient(...)` force expensive CPU paint cycles on every mousemove event, which when paired with unmemoized `getBoundingClientRect()` calls causes severe layout thrashing and micro-stutter. Furthermore, global `transition-all` classes in Tailwind fight against GSAP transforms, causing animation jitter.
**Action:** In interactive hover cards, cache container dimensions and scroll offsets on `mouseenter`, utilize persistent `gsap.quickTo` instances for hardware-accelerated transforms (`translate3d`), move spotlight effects into dedicated GPU-rendered elements, and restrict CSS transitions strictly to non-transform properties (`transition-[border-color,box-shadow,background-color]`).
