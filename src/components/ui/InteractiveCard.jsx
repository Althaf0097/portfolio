import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

// BOLT OPTIMIZATION: High-performance 3D tilt & spotlight glare card component.
// - Caches card bounding rect on mouseEnter to prevent layout thrashing (getBoundingClientRect) during mouseMove.
// - Hardware-accelerates glare animation via GPU-accelerated transform translate (quickTo) rather than updating CSS radial-gradient string.
// - Eliminates transition-all CSS conflicts with GSAP transform animations.
const InteractiveCard = ({
  children,
  className = '',
  featured = false,
  onMouseEnter,
}) => {
  const cardRef = useRef(null);
  const glareRef = useRef(null);
  const rectRef = useRef(null);
  const quickToRef = useRef(null);

  useEffect(() => {
    if (!cardRef.current || !glareRef.current) return;

    // Set initial transform anchor for the spotlight glare circle
    gsap.set(glareRef.current, { xPercent: -50, yPercent: -50 });

    // Pre-create GSAP quickTo interpolators for zero-allocation mouse movement updates
    const xToCard = gsap.quickTo(cardRef.current, 'rotateY', { duration: 0.35, ease: 'power2.out' });
    const yToCard = gsap.quickTo(cardRef.current, 'rotateX', { duration: 0.35, ease: 'power2.out' });
    const elevateToCard = gsap.quickTo(cardRef.current, 'y', { duration: 0.35, ease: 'power2.out' });
    const scaleToCard = gsap.quickTo(cardRef.current, 'scale', { duration: 0.35, ease: 'power2.out' });

    const xToGlare = gsap.quickTo(glareRef.current, 'x', { duration: 0.25, ease: 'power2.out' });
    const yToGlare = gsap.quickTo(glareRef.current, 'y', { duration: 0.25, ease: 'power2.out' });

    quickToRef.current = {
      xToCard,
      yToCard,
      elevateToCard,
      scaleToCard,
      xToGlare,
      yToGlare,
    };
  }, []);

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

    const q = quickToRef.current;
    if (q) {
      q.xToCard(normalizedX * 12);
      q.yToCard(-normalizedY * 12);
      q.elevateToCard(-16);
      q.scaleToCard(1.03);
      q.xToGlare(x);
      q.yToGlare(y);
    }
  };

  const handleMouseEnter = (e) => {
    if (cardRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
    }
    if (glareRef.current) {
      gsap.to(glareRef.current, { opacity: 1, duration: 0.25, overwrite: 'auto' });
    }
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleMouseLeave = () => {
    rectRef.current = null;
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

      {/* Interactive Mouse-Tracking Spotlight Glare */}
      <div
        ref={glareRef}
        className="pointer-events-none absolute w-[350px] h-[350px] top-0 left-0 rounded-full opacity-0 z-10 mix-blend-screen"
        style={{
          background: 'radial-gradient(circle, rgba(0, 229, 255, 0.2) 0%, rgba(79, 140, 255, 0.1) 50%, transparent 70%)',
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
