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
  const dimensionsRef = useRef({ left: 0, top: 0, width: 0, height: 0 });

  // BOLT OPTIMIZATION: Initialize GSAP quickTo helpers once inside useEffect
  // to avoid garbage collection and layout overhead of initiating new tweens on mousemove.
  const qRotateY = useRef(null);
  const qRotateX = useRef(null);
  const qY = useRef(null);
  const qScale = useRef(null);
  const qGlareX = useRef(null);
  const qGlareY = useRef(null);
  const qGlareOpacity = useRef(null);

  useEffect(() => {
    if (!cardRef.current) return;

    qRotateY.current = gsap.quickTo(cardRef.current, 'rotateY', { duration: 0.35, ease: 'power2.out' });
    qRotateX.current = gsap.quickTo(cardRef.current, 'rotateX', { duration: 0.35, ease: 'power2.out' });
    qY.current = gsap.quickTo(cardRef.current, 'y', { duration: 0.35, ease: 'power2.out' });
    qScale.current = gsap.quickTo(cardRef.current, 'scale', { duration: 0.35, ease: 'power2.out' });

    if (glareRef.current) {
      qGlareX.current = gsap.quickTo(glareRef.current, 'x', { duration: 0.25, ease: 'power2.out' });
      qGlareY.current = gsap.quickTo(glareRef.current, 'y', { duration: 0.25, ease: 'power2.out' });
      qGlareOpacity.current = gsap.quickTo(glareRef.current, 'opacity', { duration: 0.25, ease: 'power2.out' });
    }
  }, []);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = dimensionsRef.current;
    if (width === 0 || height === 0) return;

    // BOLT OPTIMIZATION: Use cached dimensions relative to page scroll
    // to eliminate layout-thrashing getBoundingClientRect() calls on high-frequency mousemove.
    const x = e.pageX - left;
    const y = e.pageY - top;

    const normalizedX = (x / width - 0.5) * 2;
    const normalizedY = (y / height - 0.5) * 2;

    if (qRotateY.current) qRotateY.current(normalizedX * 12);
    if (qRotateX.current) qRotateX.current(-normalizedY * 12);
    if (qY.current) qY.current(-16);
    if (qScale.current) qScale.current(1.03);

    if (qGlareX.current && qGlareY.current && qGlareOpacity.current) {
      // BOLT OPTIMIZATION: Translate a static glare overlay on the GPU via translate3d
      // instead of recalculating background radial gradients, which saves layout & paint cost.
      qGlareX.current(x - 175);
      qGlareY.current(y - 175);
      qGlareOpacity.current(1);
    }
  };

  const handleMouseEnter = (e) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      dimensionsRef.current = {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height,
      };
    }
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      y: 0,
      scale: 1,
      duration: 0.65,
      ease: 'power3.out',
      overwrite: 'auto',
    });

    if (glareRef.current) {
      gsap.to(glareRef.current, {
        opacity: 0,
        duration: 0.4,
        overwrite: 'auto',
      });
    }
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
      // BOLT OPTIMIZATION: Avoid global 'transition-all' to prevent animation jitter with GSAP;
      // explicitly specify non-animated properties for transition.
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

      {/* Interactive Mouse-Tracking Spotlight Glare */}
      {/* BOLT OPTIMIZATION: Explicit top-0 left-0 inside absolute container with padding; */}
      {/* No CSS transition classes on the glare element to prevent conflicts with GSAP opacity. */}
      <div
        ref={glareRef}
        className="pointer-events-none absolute top-0 left-0 w-[350px] h-[350px] opacity-0 z-10 mix-blend-screen"
        style={{
          background: 'radial-gradient(circle, rgba(0, 229, 255, 0.2) 0%, rgba(79, 140, 255, 0.1) 50%, transparent 100%)',
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
