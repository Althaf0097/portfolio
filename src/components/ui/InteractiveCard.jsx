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

  // GSAP quickTo helpers for high-frequency updates on mouse interactions
  const tiltX = useRef(null);
  const tiltY = useRef(null);
  const cardY = useRef(null);
  const cardScale = useRef(null);
  const glareX = useRef(null);
  const glareY = useRef(null);
  const glareOpacity = useRef(null);

  // Cache card dimensions and scroll coordinates to avoid high-frequency layout thrashing
  const rectRef = useRef({ left: 0, top: 0, width: 0, height: 0 });

  useEffect(() => {
    if (!cardRef.current) return;

    // BOLT OPTIMIZATION: Pre-compile quickTo functions on mount to eliminate GC thrashing and layout-calculation bottlenecks.
    tiltX.current = gsap.quickTo(cardRef.current, 'rotateY', { duration: 0.35, ease: 'power2.out' });
    tiltY.current = gsap.quickTo(cardRef.current, 'rotateX', { duration: 0.35, ease: 'power2.out' });
    cardY.current = gsap.quickTo(cardRef.current, 'y', { duration: 0.35, ease: 'power2.out' });
    cardScale.current = gsap.quickTo(cardRef.current, 'scale', { duration: 0.35, ease: 'power2.out' });

    if (glareRef.current) {
      glareX.current = gsap.quickTo(glareRef.current, 'x', { duration: 0.25, ease: 'power2.out' });
      glareY.current = gsap.quickTo(glareRef.current, 'y', { duration: 0.25, ease: 'power2.out' });
      glareOpacity.current = gsap.quickTo(glareRef.current, 'opacity', { duration: 0.25, ease: 'power2.out' });
    }
  }, []);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = rectRef.current;
    if (width === 0 || height === 0) return;

    // Calculate mouse coordinates relative to the card's top-left corner
    const x = e.pageX - left;
    const y = e.pageY - top;

    const normalizedX = (x / width - 0.5) * 2;
    const normalizedY = (y / height - 0.5) * 2;

    // BOLT OPTIMIZATION: Execute GPU-accelerated updates using quickTo helpers to bypass layout re-computations.
    if (tiltX.current) tiltX.current(normalizedX * 12);
    if (tiltY.current) tiltY.current(-normalizedY * 12);
    if (cardY.current) cardY.current(-16);
    if (cardScale.current) cardScale.current(1.03);

    // Center the 700px absolute glare circle relative to mouse position
    if (glareX.current) glareX.current(x - 350);
    if (glareY.current) glareY.current(y - 350);
    if (glareOpacity.current) glareOpacity.current(1);
  };

  const handleMouseEnter = (e) => {
    // BOLT OPTIMIZATION: Query and cache viewport-relative element boundaries (offset by page scroll)
    // inside useRef once on mouse enter to prevent high-frequency getBoundingClientRect layout reflow.
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      rectRef.current = {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height,
      };
    }
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleMouseLeave = () => {
    if (tiltX.current) tiltX.current(0);
    if (tiltY.current) tiltY.current(0);
    if (cardY.current) cardY.current(0);
    if (cardScale.current) cardScale.current(1);
    if (glareOpacity.current) glareOpacity.current(0);
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

      {/* Interactive Mouse-Tracking Spotlight Glare (Hardware Accelerated Overlay with top-0 left-0 padding-safe alignment) */}
      <div
        ref={glareRef}
        className="pointer-events-none absolute top-0 left-0 w-[700px] h-[700px] rounded-full opacity-0 z-10 mix-blend-screen"
        style={{
          background: 'radial-gradient(circle, rgba(0, 229, 255, 0.2) 0%, rgba(79, 140, 255, 0.1) 50%, transparent 100%)',
          willChange: 'transform',
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
