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
  const boundsRef = useRef(null);
  const quickToRef = useRef(null);

  useEffect(() => {
    if (!cardRef.current || !glareRef.current) return;

    // BOLT OPTIMIZATION: Initialize GSAP quickTo helpers once to eliminate layout/paint overhead in scroll/mouse loops
    quickToRef.current = {
      rotateY: gsap.quickTo(cardRef.current, 'rotateY', { duration: 0.35, ease: 'power2.out' }),
      rotateX: gsap.quickTo(cardRef.current, 'rotateX', { duration: 0.35, ease: 'power2.out' }),
      y: gsap.quickTo(cardRef.current, 'y', { duration: 0.35, ease: 'power2.out' }),
      scale: gsap.quickTo(cardRef.current, 'scale', { duration: 0.35, ease: 'power2.out' }),
      glareX: gsap.quickTo(glareRef.current, 'x', { duration: 0.25, ease: 'power2.out' }),
      glareY: gsap.quickTo(glareRef.current, 'y', { duration: 0.25, ease: 'power2.out' }),
      glareOpacity: gsap.quickTo(glareRef.current, 'opacity', { duration: 0.25, ease: 'power2.out' }),
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    // BOLT OPTIMIZATION: Cache element dimensions on mouse enter to eliminate layout thrashing
    if (!boundsRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      boundsRef.current = {
        width: rect.width,
        height: rect.height,
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
      };
    }

    const bounds = boundsRef.current;
    const x = e.pageX - bounds.left;
    const y = e.pageY - bounds.top;

    const normalizedX = (x / bounds.width - 0.5) * 2;
    const normalizedY = (y / bounds.height - 0.5) * 2;

    if (quickToRef.current) {
      quickToRef.current.rotateY(normalizedX * 12);
      quickToRef.current.rotateX(-normalizedY * 12);
      quickToRef.current.y(-16);
      quickToRef.current.scale(1.03);

      // BOLT OPTIMIZATION: Use translate3d GPU-acceleration via quickTo instead of updating slow background radial-gradient
      quickToRef.current.glareX(x - 175);
      quickToRef.current.glareY(y - 175);
      quickToRef.current.glareOpacity(1);
    }
  };

  const handleMouseEnter = (e) => {
    if (cardRef.current) {
      // Recalculate and cache bounding rect on enter to be perfectly accurate and stable across scroll
      const rect = cardRef.current.getBoundingClientRect();
      boundsRef.current = {
        width: rect.width,
        height: rect.height,
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
      };
    }
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;

    // Clear the cached bounds on leave to ensure clean slate for next hover
    boundsRef.current = null;

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
      className={`group relative rounded-[24px] border border-white/10 transition-[border-color,box-shadow,background-color] duration-500 overflow-hidden cursor-pointer backdrop-blur-[24px] ${
        featured
          ? 'bg-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(79,140,255,0.15)] hover:border-[#7EF9FF]/50 hover:shadow-[0_25px_60px_rgba(0,0,0,0.7),0_0_40px_rgba(0,229,255,0.3)]'
          : 'bg-white/[0.05] shadow-[0_15px_35px_rgba(0,0,0,0.5)] hover:border-[#4F8CFF]/50 hover:shadow-[0_25px_50px_rgba(0,0,0,0.65),0_0_30px_rgba(79,140,255,0.25)]'
      } ${className}`}
    >
      {/* Top light reflection line (Apple-inspired white top rim highlight) */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-100 group-hover:via-white/60 transition-[background-color,opacity] duration-500 z-30" />

      {/* Cyber Edge Glow Highlight (Primary & Accent Gradient) */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-20 group-hover:opacity-100 group-hover:via-accent transition-[background-color,opacity] duration-500 z-30" />

      {/* BOLT OPTIMIZATION: Interactive Mouse-Tracking Spotlight Glare with pre-defined static background gradient moved via transform */}
      <div
        ref={glareRef}
        className="pointer-events-none absolute top-0 left-0 w-[350px] h-[350px] rounded-full opacity-0 z-10 mix-blend-screen"
        style={{
          background: 'radial-gradient(175px circle at center, rgba(0, 229, 255, 0.2) 0%, rgba(79, 140, 255, 0.1) 50%, transparent 100%)',
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
