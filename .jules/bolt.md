## 2025-05-14 - Optimized InteractiveCard glare with translate3d
**Learning:** Updating complex CSS properties like `background` (with `radial-gradient`) on every `mousemove` triggers expensive repaints on every frame.
**Action:** Use a static glare element and move it using `transform: translate3d()` (or GSAP's `x`/`y` properties) to leverage GPU acceleration and achieve a stable 60fps interaction.

## 2025-05-14 - Security vs Testing in Playwright
**Learning:** Overriding `window.eval` in security utilities (like `src/utils/security.js`) can block Playwright's `page.evaluate()` mechanism, leading to script failures.
**Action:** When testing components that initialize such security measures, temporarily bypass the override in the testing environment or use alternate verification methods that don't rely on `eval`.
