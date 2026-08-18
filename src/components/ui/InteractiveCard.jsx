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
  const rectRef = useRef(null);

  // BOLT OPTIMIZATION: GSAP quickTo setters for zero-allocation 60fps interaction
  const rotateXTo = useRef(null);
  const rotateYTo = useRef(null);
  const cardYTo = useRef(null);
  const scaleTo = useRef(null);
  const glareXTo = useRef(null);
  const glareYTo = useRef(null);
  const glareOpacityTo = useRef(null);

  useEffect(() => {
    if (!cardRef.current || !glareRef.current) return;

    // Pre-initialize GSAP quickTo function references once to prevent object allocation in mousemove
    rotateYTo.current = gsap.quickTo(cardRef.current, 'rotateY', { duration: 0.35, ease: 'power2.out' });
    rotateXTo.current = gsap.quickTo(cardRef.current, 'rotateX', { duration: 0.35, ease: 'power2.out' });
    cardYTo.current = gsap.quickTo(cardRef.current, 'y', { duration: 0.35, ease: 'power2.out' });
    scaleTo.current = gsap.quickTo(cardRef.current, 'scale', { duration: 0.35, ease: 'power2.out' });

    glareXTo.current = gsap.quickTo(glareRef.current, 'x', { duration: 0.25, ease: 'power2.out' });
    glareYTo.current = gsap.quickTo(glareRef.current, 'y', { duration: 0.25, ease: 'power2.out' });
    glareOpacityTo.current = gsap.quickTo(glareRef.current, 'opacity', { duration: 0.25, ease: 'power2.out' });
  }, []);

  const handleMouseEnter = (e) => {
    if (cardRef.current) {
      // Cache element position and dimensions on enter to avoid layout thrashing during mouse move
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

  const handleMouseMove = (e) => {
    if (!rectRef.current) return;

    // Use cached dimensions and current page scroll to derive relative position
    const x = e.pageX - rectRef.current.left;
    const y = e.pageY - rectRef.current.top;

    const normalizedX = (x / rectRef.current.width - 0.5) * 2;
    const normalizedY = (y / rectRef.current.height - 0.5) * 2;

    // Direct GPU-accelerated updates via quickTo setters
    rotateYTo.current?.(normalizedX * 12);
    rotateXTo.current?.(-normalizedY * 12);
    cardYTo.current?.(-16);
    scaleTo.current?.(1.03);

    // Hardware-accelerated translate3d for glare effect
    glareXTo.current?.(x - 175);
    glareYTo.current?.(y - 175);
    glareOpacityTo.current?.(1);
  };

  const handleMouseLeave = () => {
    rectRef.current = null;
    rotateYTo.current?.(0);
    rotateXTo.current?.(0);
    cardYTo.current?.(0);
    scaleTo.current?.(1);
    glareOpacityTo.current?.(0);
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

      {/* Interactive Mouse-Tracking Spotlight Glare - Optimized GPU hardware-accelerated circle overlay */}
      <div
        ref={glareRef}
        style={{ willChange: 'transform, opacity' }}
        className="pointer-events-none absolute top-0 left-0 w-[350px] h-[350px] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.2)_0%,rgba(79,140,255,0.1)_50%,transparent_100%)] opacity-0 z-10 mix-blend-screen"
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
