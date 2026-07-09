import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const BoxStructureOverlay = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate floating structural geometric box frames
      const boxes = containerRef.current.querySelectorAll('.floating-box');
      boxes.forEach((box, i) => {
        gsap.to(box, {
          y: i % 2 === 0 ? -18 : 18,
          x: i % 3 === 0 ? 12 : -12,
          rotate: i % 2 === 0 ? 3 : -3,
          duration: 4 + i * 0.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden z-0"
    >
      {/* Structural Box Grid Lines */}
      <div className="absolute inset-0 bg-box-structure opacity-90" />

      {/* Architectural Corner Crosshair Markers (+) */}
      <div className="absolute top-16 left-10 text-blue-400/40 font-mono text-xl select-none">+</div>
      <div className="absolute top-16 right-10 text-blue-400/40 font-mono text-xl select-none">+</div>
      <div className="absolute bottom-16 left-12 text-blue-400/40 font-mono text-xl select-none">+</div>
      <div className="absolute bottom-16 right-12 text-blue-400/40 font-mono text-xl select-none">+</div>

      {/* Floating Geometric Wireframe & Glass Box Elements */}
      <div className="floating-box absolute top-24 left-[12%] w-24 h-24 rounded-2xl border border-blue-200/50 bg-gradient-to-br from-blue-500/5 to-transparent backdrop-blur-[1px] hidden sm:block" />

      <div className="floating-box absolute top-1/3 right-[8%] w-32 h-32 rounded-3xl border border-blue-300/40 bg-gradient-to-tl from-blue-600/5 via-sky-400/5 to-transparent hidden md:block" />

      <div className="floating-box absolute bottom-28 left-[18%] w-20 h-20 rounded-xl border border-blue-200/40 bg-gradient-to-tr from-blue-400/5 to-transparent hidden lg:block" />

      {/* Subtle Box Structure Corner Bracket Accents */}
      <div className="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 border-blue-300/30" />
      <div className="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 border-blue-300/30" />
      <div className="absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 border-blue-300/30" />
      <div className="absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 border-blue-300/30" />
    </div>
  );
};

export default BoxStructureOverlay;
