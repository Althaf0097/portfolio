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
  const quickSetters = useRef(null);

  // BOLT OPTIMIZATION: Pre-create GSAP quickTo setters for zero-allocation high-frequency animation
  useEffect(() => {
    if (!cardRef.current) return;

    if (glareRef.current) {
      gsap.set(glareRef.current, { xPercent: -50, yPercent: -50 });
    }

    quickSetters.current = {
      rotateX: gsap.quickTo(cardRef.current, 'rotateX', { duration: 0.35, ease: 'power2.out' }),
      rotateY: gsap.quickTo(cardRef.current, 'rotateY', { duration: 0.35, ease: 'power2.out' }),
      y: gsap.quickTo(cardRef.current, 'y', { duration: 0.35, ease: 'power2.out' }),
      scale: gsap.quickTo(cardRef.current, 'scale', { duration: 0.35, ease: 'power2.out' }),
      glareX: glareRef.current ? gsap.quickTo(glareRef.current, 'x', { duration: 0.25, ease: 'power2.out' }) : null,
      glareY: glareRef.current ? gsap.quickTo(glareRef.current, 'y', { duration: 0.25, ease: 'power2.out' }) : null,
      glareOpacity: glareRef.current ? gsap.quickTo(glareRef.current, 'opacity', { duration: 0.25, ease: 'power2.out' }) : null,
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!cardRef.current || !quickSetters.current) return;

    // Cache element bounding box on mouseenter to prevent getBoundingClientRect layout thrashing
    if (!rectRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      rectRef.current = {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height,
      };
    }

    const rect = rectRef.current;
    const x = e.pageX - rect.left;
    const y = e.pageY - rect.top;

    const normalizedX = (x / rect.width - 0.5) * 2;
    const normalizedY = (y / rect.height - 0.5) * 2;

    // BOLT OPTIMIZATION: Smooth GSAP 3D card tilt & elevation using quickTo
    const q = quickSetters.current;
    q.rotateY(normalizedX * 12);
    q.rotateX(-normalizedY * 12);
    q.y(-16);
    q.scale(1.03);

    // BOLT OPTIMIZATION: Hardware-accelerated glare position update via translate3d
    if (q.glareX && q.glareY && q.glareOpacity) {
      q.glareX(x);
      q.glareY(y);
      q.glareOpacity(1);
    }
  };

  const handleMouseEnter = (e) => {
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
    rectRef.current = null;
    if (!cardRef.current || !quickSetters.current) return;

    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      y: 0,
      scale: 1,
      duration: 0.65,
      ease: 'power3.out',
      overwrite: 'auto',
    });

    if (glareRef.current && quickSetters.current.glareOpacity) {
      quickSetters.current.glareOpacity(0);
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
      className={`group relative rounded-[24px] border border-white/10 overflow-hidden cursor-pointer backdrop-blur-[24px] ${
        featured
          ? 'bg-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(79,140,255,0.15)] hover:border-[#7EF9FF]/50 hover:shadow-[0_25px_60px_rgba(0,0,0,0.7),0_0_40px_rgba(0,229,255,0.3)]'
          : 'bg-white/[0.05] shadow-[0_15px_35px_rgba(0,0,0,0.5)] hover:border-[#4F8CFF]/50 hover:shadow-[0_25px_50px_rgba(0,0,0,0.65),0_0_30px_rgba(79,140,255,0.25)]'
      } ${className}`}
    >
      {/* Top light reflection line (Apple-inspired white top rim highlight) */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-100 group-hover:via-white/60 transition-all duration-500 z-30" />

      {/* Cyber Edge Glow Highlight (Primary & Accent Gradient) */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-20 group-hover:opacity-100 group-hover:via-accent transition-all duration-500 z-30" />

      {/* Interactive Mouse-Tracking Spotlight Glare - pre-styled hardware accelerated layer */}
      <div
        ref={glareRef}
        className="pointer-events-none absolute top-0 left-0 w-[700px] h-[700px] rounded-full opacity-0 z-10 mix-blend-screen bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.2)_0%,rgba(79,140,255,0.1)_50%,transparent_100%)]"
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
