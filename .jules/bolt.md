## 2025-05-18 - Centering GSAP quickTo Animated Elements with Negative Margins
**Learning:** When using GSAP `quickTo` setters on `x` and `y` for an absolute element (such as a mouse-following glare in `InteractiveCard.jsx`), Tailwind translate classes like `-translate-x-1/2 -translate-y-1/2` get overridden by GSAP's inline `transform: translate3d(...)` style.
**Action:** Use negative margins (e.g. `-ml-[175px] -mt-[175px]` for a 350px element) to center the element relative to the cursor without relying on CSS transform rules that compete with GSAP.
