## 2025-05-18 - Hardware-Accelerated Glare & GSAP quickTo in InteractiveCard

**Learning:** `InteractiveCard` mouse tracking triggered synchronous layout thrashing on every `mousemove` event via `getBoundingClientRect()` and caused main-thread style/paint recalculation by dynamically generating radial gradient CSS strings in `gsap.to()`. Converting glare to a fixed radial gradient layer positioned with CSS `transform` (`x`, `y`) and using pre-initialized `gsap.quickTo` setters along with cached bounding rects on `onMouseEnter` shifts animation work to the GPU and avoids layout reflows completely.

**Action:** When optimizing high-frequency 3D tilt or spotlight card components, pre-instantiate `gsap.quickTo` setters in `useEffect`, cache container dimensions on `onMouseEnter`, and move light overlays using CSS `transform` rather than string `background` updates.
