import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

// BOLT OPTIMIZATION: Hardware-accelerated 3D tilt and spotlight glare using gsap.quickTo.
// Caches element bounds on mouse enter to eliminate getBoundingClientRect layout thrashing during mousemove.
const InteractiveCard = ({
  children,
  className = '',
  featured = false,
  onMouseEnter,
}) => {
  const cardRef = useRef(null);
  const glareRef = useRef(null);
  const rectRef = useRef(null);
  const quickToRefs = useRef({});

  useEffect(() => {
    if (!cardRef.current) return;

    quickToRefs.current = {
      rotateY: gsap.quickTo(cardRef.current, 'rotateY', { duration: 0.35, ease: 'power2.out' }),
      rotateX: gsap.quickTo(cardRef.current, 'rotateX', { duration: 0.35, ease: 'power2.out' }),
      y: gsap.quickTo(cardRef.current, 'y', { duration: 0.35, ease: 'power2.out' }),
      scale: gsap.quickTo(cardRef.current, 'scale', { duration: 0.35, ease: 'power2.out' }),
    };

    if (glareRef.current) {
      quickToRefs.current.glareX = gsap.quickTo(glareRef.current, 'x', { duration: 0.25, ease: 'power2.out' });
      quickToRefs.current.glareY = gsap.quickTo(glareRef.current, 'y', { duration: 0.25, ease: 'power2.out' });
      quickToRefs.current.glareOpacity = gsap.quickTo(glareRef.current, 'opacity', { duration: 0.25, ease: 'power2.out' });
    }
  }, []);

  const handleMouseEnter = (e) => {
    if (cardRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
    }
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleMouseMove = (e) => {
    if (!rectRef.current) return;
    const rect = rectRef.current;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normalizedX = (x / rect.width - 0.5) * 2;
    const normalizedY = (y / rect.height - 0.5) * 2;

    const { rotateY, rotateX, y: setY, scale, glareX, glareY, glareOpacity } = quickToRefs.current;

    rotateY?.(normalizedX * 12);
    rotateX?.(-normalizedY * 12);
    setY?.(-16);
    scale?.(1.03);

    if (glareX && glareY && glareOpacity) {
      glareX(x - 175);
      glareY(y - 175);
      glareOpacity(1);
    }
  };

  const handleMouseLeave = () => {
    const { rotateY, rotateX, y: setY, scale, glareOpacity } = quickToRefs.current;
    rotateY?.(0);
    rotateX?.(0);
    setY?.(0);
    scale?.(1);
    glareOpacity?.(0);
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
      className={`group relative rounded-[24px] border border-white/10 transition-colors duration-500 overflow-hidden cursor-pointer backdrop-blur-[24px] ${
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
        className="pointer-events-none absolute top-0 left-0 w-[350px] h-[350px] opacity-0 z-10 mix-blend-screen rounded-full"
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
