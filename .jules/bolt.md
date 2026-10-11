## 2025-05-18 - Hardware-accelerated mouse tracking for InteractiveCard

**Learning:** Updating dynamic CSS `background` properties (such as radial gradients) on `mousemove` inside card components causes continuous main-thread style recalculations, repaints, and layout thrashing if `getBoundingClientRect()` is called on every frame.
**Action:** Always cache element bounding rects on `mouseenter` and offload cursor-following visual effects to absolute-positioned elements animated with `gsap.quickTo()` and GPU hardware-accelerated transforms (`translate3d`).
