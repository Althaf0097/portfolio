import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const InteractiveCard = ({
  children,
  className = '',
  featured = false,
  onMouseEnter,
}) => {
  const cardRef = useRef(null);
  const glareRef = useRef(null);

  // BOLT OPTIMIZATION: Cache bounding box dimensions to avoid layout thrashing
  const rectRef = useRef({ left: 0, top: 0, width: 0, height: 0 });

  // GSAP quickTo references for high-frequency properties
  const quickToX = useRef(null);
  const quickToRotX = useRef(null);
  const quickToRotY = useRef(null);
  const quickToGlareX = useRef(null);
  const quickToGlareY = useRef(null);
  const quickToGlareOpacity = useRef(null);

  const updateCachedDimensions = () => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    rectRef.current = {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
      width: rect.width,
      height: rect.height,
    };
  };

  useEffect(() => {
    if (!cardRef.current) return;

    // BOLT OPTIMIZATION: Initialize quickTo helpers for smooth, hardware-accelerated rendering
    // Note: use 'rotationX' and 'rotationY' instead of 'rotateX'/'rotateY' to avoid GSAP reset/shortcut initialization warnings
    quickToX.current = gsap.quickTo(cardRef.current, 'y', { duration: 0.35, ease: 'power2.out' });
    quickToRotX.current = gsap.quickTo(cardRef.current, 'rotationX', { duration: 0.35, ease: 'power2.out' });
    quickToRotY.current = gsap.quickTo(cardRef.current, 'rotationY', { duration: 0.35, ease: 'power2.out' });

    if (glareRef.current) {
      quickToGlareX.current = gsap.quickTo(glareRef.current, 'x', { duration: 0.25, ease: 'power2.out' });
      quickToGlareY.current = gsap.quickTo(glareRef.current, 'y', { duration: 0.25, ease: 'power2.out' });
      quickToGlareOpacity.current = gsap.quickTo(glareRef.current, 'opacity', { duration: 0.25, ease: 'power2.out' });
    }
  }, []);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = rectRef.current;
    if (rect.width === 0) {
      updateCachedDimensions();
    }

    const x = e.pageX - rect.left;
    const y = e.pageY - rect.top;

    const normalizedX = (x / rect.width - 0.5) * 2;
    const normalizedY = (y / rect.height - 0.5) * 2;

    // Apply smooth transforms via quickTo
    if (quickToRotY.current) quickToRotY.current(normalizedX * 12);
    if (quickToRotX.current) quickToRotX.current(-normalizedY * 12);
    if (quickToX.current) quickToX.current(-16);

    // Translate static glare overlay element using translate3d to avoid expensive repaints
    if (quickToGlareX.current) quickToGlareX.current(x);
    if (quickToGlareY.current) quickToGlareY.current(y);
    if (quickToGlareOpacity.current) quickToGlareOpacity.current(1);
  };

  const handleMouseEnter = (e) => {
    updateCachedDimensions();

    // Scale is updated once on hover, so a standard gsap.to is perfect here and warning-free
    gsap.to(cardRef.current, { scale: 1.03, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });

    if (onMouseEnter) onMouseEnter(e);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;

    // Reset scale smoothly on leave
    gsap.to(cardRef.current, { scale: 1, duration: 0.65, ease: 'power3.out', overwrite: 'auto' });

    // BOLT OPTIMIZATION: Reset high-frequency transforms smoothly using the same pre-initialized quickTo paths
    // This is warning-free, avoids overwriting disputes, and runs extremely fast
    if (quickToRotY.current) quickToRotY.current(0);
    if (quickToRotX.current) quickToRotX.current(0);
    if (quickToX.current) quickToX.current(0);

    if (quickToGlareOpacity.current) quickToGlareOpacity.current(0);
  };

  return (
    <div
      ref={cardRef}
      data-interactive="true"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1200px',
      }}
      className={`group relative rounded-[24px] border border-white/10 transition-[border-color,box-shadow,background-color] duration-500 overflow-hidden cursor-pointer backdrop-blur-[24px] ${
        featured
          ? 'bg-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(79,140,255,0.15)] hover:border-[#7EF9FF]/50 hover:shadow-[0_25px_60px_rgba(0,0,0,0.7),0_0_40px_rgba(0,229,255,0.3)]'
          : 'bg-white/[0.05] shadow-[0_15px_35px_rgba(0,0,0,0.5)] hover:border-[#4F8CFF]/50 hover:shadow-[0_25px_50px_rgba(0,0,0,0.65),0_0_30px_rgba(79,140,255,0.25)]'
      } ${className}`}
    >
      {/* Top light reflection line (Apple-inspired white top rim highlight) */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-100 group-hover:via-white/60 transition-all duration-500 z-30" />

      {/* Cyber Edge Glow Highlight (Primary & Accent Gradient) */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-20 group-hover:opacity-100 group-hover:via-accent transition-all duration-500 z-30" />

      {/* BOLT OPTIMIZATION: Interactive Mouse-Tracking Spotlight Glare with static gradient & translate3d */}
      <div
        ref={glareRef}
        className="pointer-events-none absolute top-0 left-0 w-[350px] h-[350px] rounded-full opacity-0 z-10 mix-blend-screen"
        style={{
          background: 'radial-gradient(circle, rgba(0, 229, 255, 0.2) 0%, rgba(79, 140, 255, 0.1) 50%, transparent 100%)',
          marginLeft: '-175px',
          marginTop: '-175px',
          willChange: 'transform, opacity',
        }}
      />

      {/* Ambient static inner shadows and glass sheen */}
      <div className="pointer-events-none absolute inset-0 transition-opacity duration-500 z-10 bg-gradient-to-br from-white/[0.02] via-transparent to-primary/5 shadow-[inset_0_0_24px_rgba(255,255,255,0.05)]" />

      {/* Card Content wrapper maintaining preserve-3d for inner layers */}
      <div className="relative z-20 flex flex-col h-full" style={{ transform: 'translateZ(30px)' }}>
        {children}
      </div>
    </div>
  );
};

export default InteractiveCard;