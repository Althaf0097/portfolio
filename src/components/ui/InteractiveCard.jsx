import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

// BOLT OPTIMIZATION:
// 1. Caches bounding box in rectRef onMouseEnter to eliminate layout thrashing (getBoundingClientRect) on every mousemove frame.
// 2. Uses pre-initialized gsap.quickTo setters in useEffect to eliminate GC tween object creation on every mouse move frame.
// 3. Hardware-accelerates glare movement via transform: translate3d() instead of updating CSS background gradient strings.
// 4. Replaces transition-all with targeted transition-[border-color,box-shadow,background-color] to avoid CSS/GSAP transform property conflicts.

const InteractiveCard = ({
  children,
  className = '',
  featured = false,
  onMouseEnter,
}) => {
  const cardRef = useRef(null);
  const glareRef = useRef(null);
  const rectRef = useRef(null);

  const rotateYTo = useRef(null);
  const rotateXTo = useRef(null);
  const cardYTo = useRef(null);
  const scaleTo = useRef(null);
  const glareXTo = useRef(null);
  const glareYTo = useRef(null);
  const glareOpacityTo = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      rotateYTo.current = gsap.quickTo(cardRef.current, 'rotateY', { duration: 0.35, ease: 'power2.out' });
      rotateXTo.current = gsap.quickTo(cardRef.current, 'rotateX', { duration: 0.35, ease: 'power2.out' });
      cardYTo.current = gsap.quickTo(cardRef.current, 'y', { duration: 0.35, ease: 'power2.out' });
      scaleTo.current = gsap.quickTo(cardRef.current, 'scale', { duration: 0.35, ease: 'power2.out' });
    }

    if (glareRef.current) {
      glareXTo.current = gsap.quickTo(glareRef.current, 'x', { duration: 0.25, ease: 'power2.out' });
      glareYTo.current = gsap.quickTo(glareRef.current, 'y', { duration: 0.25, ease: 'power2.out' });
      glareOpacityTo.current = gsap.quickTo(glareRef.current, 'opacity', { duration: 0.25, ease: 'power2.out' });
    }
  }, []);

  const handleMouseEnter = (e) => {
    if (cardRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
    }
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    if (!rectRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
    }

    const rect = rectRef.current;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normalizedX = (x / rect.width - 0.5) * 2;
    const normalizedY = (y / rect.height - 0.5) * 2;

    rotateYTo.current?.(normalizedX * 12);
    rotateXTo.current?.(-normalizedY * 12);
    cardYTo.current?.(-16);
    scaleTo.current?.(1.03);

    if (glareRef.current) {
      glareXTo.current?.(x);
      glareYTo.current?.(y);
      glareOpacityTo.current?.(1);
    }
  };

  const handleMouseLeave = () => {
    rectRef.current = null;

    rotateYTo.current?.(0);
    rotateXTo.current?.(0);
    cardYTo.current?.(0);
    scaleTo.current?.(1);

    if (glareRef.current) {
      glareOpacityTo.current?.(0);
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
      <div
        ref={glareRef}
        className="pointer-events-none absolute top-0 left-0 w-[700px] h-[700px] -ml-[350px] -mt-[350px] opacity-0 z-10 mix-blend-screen rounded-full"
        style={{
          background: 'radial-gradient(circle at center, rgba(0, 229, 255, 0.2) 0%, rgba(79, 140, 255, 0.1) 50%, transparent 100%)',
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
