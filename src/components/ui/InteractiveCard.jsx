import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

// BOLT OPTIMIZATION: High-frequency mouse-tracking 3D tilt & spotlight glare optimized using GSAP quickTo setters,
// cached element dimensions (normalized to page scroll), and GPU-accelerated translate3d transforms to eliminate layout thrashing.
const InteractiveCard = ({
  children,
  className = '',
  featured = false,
  onMouseEnter,
}) => {
  const cardRef = useRef(null);
  const glareRef = useRef(null);
  const quickToRefs = useRef(null);
  const rectRef = useRef(null);

  useEffect(() => {
    if (!cardRef.current) return;

    // Initialize reusable GSAP quickTo function helpers for zero-allocation high-frequency updates
    const xTo = gsap.quickTo(cardRef.current, 'rotateY', { duration: 0.35, ease: 'power2.out' });
    const yTo = gsap.quickTo(cardRef.current, 'rotateX', { duration: 0.35, ease: 'power2.out' });
    const liftTo = gsap.quickTo(cardRef.current, 'y', { duration: 0.35, ease: 'power2.out' });
    const scaleTo = gsap.quickTo(cardRef.current, 'scale', { duration: 0.35, ease: 'power2.out' });

    let glareXTo = null;
    let glareYTo = null;
    let glareOpacityTo = null;

    if (glareRef.current) {
      glareXTo = gsap.quickTo(glareRef.current, 'x', { duration: 0.25, ease: 'power2.out' });
      glareYTo = gsap.quickTo(glareRef.current, 'y', { duration: 0.25, ease: 'power2.out' });
      glareOpacityTo = gsap.quickTo(glareRef.current, 'opacity', { duration: 0.25, ease: 'power2.out' });
    }

    quickToRefs.current = {
      xTo,
      yTo,
      liftTo,
      scaleTo,
      glareXTo,
      glareYTo,
      glareOpacityTo,
    };
  }, []);

  const handleMouseEnter = (e) => {
    if (onMouseEnter) onMouseEnter(e);
    if (!cardRef.current) return;

    // Cache element coordinates normalized to page scroll on enter to prevent getBoundingClientRect() during mousemove
    const rect = cardRef.current.getBoundingClientRect();
    rectRef.current = {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
      width: rect.width || 1,
      height: rect.height || 1,
    };

    if (quickToRefs.current) {
      quickToRefs.current.liftTo(-16);
      quickToRefs.current.scaleTo(1.03);
      if (quickToRefs.current.glareOpacityTo) {
        quickToRefs.current.glareOpacityTo(1);
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current || !quickToRefs.current) return;

    if (!rectRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      rectRef.current = {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
        width: rect.width || 1,
        height: rect.height || 1,
      };
    }

    const pageX = e.pageX ?? (e.clientX + window.scrollX);
    const pageY = e.pageY ?? (e.clientY + window.scrollY);

    const x = pageX - rectRef.current.left;
    const y = pageY - rectRef.current.top;

    const normalizedX = (x / rectRef.current.width - 0.5) * 2;
    const normalizedY = (y / rectRef.current.height - 0.5) * 2;

    const { xTo, yTo, glareXTo, glareYTo } = quickToRefs.current;

    // Direct GPU-accelerated quickTo updates
    xTo(normalizedX * 12);
    yTo(-normalizedY * 12);

    if (glareXTo && glareYTo) {
      glareXTo(x);
      glareYTo(y);
    }
  };

  const handleMouseLeave = () => {
    if (!quickToRefs.current) return;

    const { xTo, yTo, liftTo, scaleTo, glareOpacityTo } = quickToRefs.current;
    xTo(0);
    yTo(0);
    liftTo(0);
    scaleTo(1);
    if (glareOpacityTo) {
      glareOpacityTo(0);
    }

    rectRef.current = null;
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
        willChange: 'transform',
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

      {/* Interactive Mouse-Tracking Spotlight Glare (GPU accelerated with translate3d) */}
      <div
        ref={glareRef}
        className="pointer-events-none absolute top-0 left-0 w-[350px] h-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 z-10 mix-blend-screen bg-[radial-gradient(circle,rgba(0,229,255,0.2)_0%,rgba(79,140,255,0.1)_50%,transparent_100%)]"
        style={{ willChange: 'transform, opacity' }}
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
