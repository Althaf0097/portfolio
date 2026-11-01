import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

/**
 * BOLT OPTIMIZATION: High-performance 3D interactive tilt & glare card
 * - Eliminates layout thrashing: dimensions are cached in a ref on mouse enter (normalized with scroll offsets),
 *   avoiding expensive getBoundingClientRect() recalculations on every high-frequency mousemove event.
 * - Hardware acceleration: GSAP quickTo tweens are pre-allocated once in useEffect, transforming 3D tilt
 *   (rotateX, rotateY, y, scale) and spotlight glare translation directly on the GPU compositor thread.
 * - Replaces costly background gradient repaints with a fixed radial gradient disk positioned via transform translate3d.
 * - Avoids transition-all conflicts with GSAP transforms by constraining CSS transitions to border/shadow/bg colors.
 */
const InteractiveCard = ({
  children,
  className = '',
  featured = false,
  onMouseEnter,
}) => {
  const cardRef = useRef(null);
  const glareRef = useRef(null);
  const boundsRef = useRef(null);
  const quickTweens = useRef(null);

  useEffect(() => {
    if (!cardRef.current || !glareRef.current) return;

    // Pre-allocate GSAP quickTo setters for 60fps transform animations without garbage collection spikes
    quickTweens.current = {
      cardRotateX: gsap.quickTo(cardRef.current, 'rotateX', { duration: 0.35, ease: 'power2.out' }),
      cardRotateY: gsap.quickTo(cardRef.current, 'rotateY', { duration: 0.35, ease: 'power2.out' }),
      cardY: gsap.quickTo(cardRef.current, 'y', { duration: 0.35, ease: 'power2.out' }),
      cardScale: gsap.quickTo(cardRef.current, 'scale', { duration: 0.35, ease: 'power2.out' }),
      glareX: gsap.quickTo(glareRef.current, 'x', { duration: 0.25, ease: 'power2.out' }),
      glareY: gsap.quickTo(glareRef.current, 'y', { duration: 0.25, ease: 'power2.out' }),
      glareOpacity: gsap.quickTo(glareRef.current, 'opacity', { duration: 0.25, ease: 'power2.out' }),
    };

    return () => {
      quickTweens.current = null;
    };
  }, []);

  const handleMouseEnter = (e) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      boundsRef.current = {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height,
      };
    }
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current || !boundsRef.current || !quickTweens.current) return;

    // Use cached bounds normalized with current scroll offsets to avoid layout recalculation
    const x = e.pageX - boundsRef.current.left;
    const y = e.pageY - boundsRef.current.top;

    const normalizedX = (x / boundsRef.current.width - 0.5) * 2;
    const normalizedY = (y / boundsRef.current.height - 0.5) * 2;

    const {
      cardRotateX,
      cardRotateY,
      cardY,
      cardScale,
      glareX,
      glareY,
      glareOpacity,
    } = quickTweens.current;

    cardRotateY(normalizedX * 12);
    cardRotateX(-normalizedY * 12);
    cardY(-16);
    cardScale(1.03);

    // Translate hardware-accelerated spotlight disk to cursor position
    glareX(x);
    glareY(y);
    glareOpacity(1);
  };

  const handleMouseLeave = () => {
    boundsRef.current = null;

    if (!cardRef.current || !quickTweens.current) return;

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

      {/* Interactive Mouse-Tracking Spotlight Glare (GPU-accelerated translate3d overlay) */}
      <div
        ref={glareRef}
        className="pointer-events-none absolute top-0 left-0 w-[350px] h-[350px] -ml-[175px] -mt-[175px] rounded-full opacity-0 z-10 mix-blend-screen"
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
