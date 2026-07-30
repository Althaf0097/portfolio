import { useRef } from 'react';
import { gsap } from 'gsap';

const InteractiveCard = ({
  children,
  className = '',
  featured = false,
  onMouseEnter,
}) => {
  const cardRef = useRef(null);
  const glareRef = useRef(null);
  // BOLT OPTIMIZATION: Cache card dimensions inside a useRef to eliminate calling getBoundingClientRect on every mousemove
  const rectRef = useRef({ left: 0, top: 0, width: 0, height: 0 });

  const handleMouseMove = (e) => {
    const rect = rectRef.current;
    if (rect.width === 0 || rect.height === 0) return;

    // Viewport-relative coordinates normalized to the page (using pageX/Y)
    const x = e.pageX - rect.left;
    const y = e.pageY - rect.top;

    const normalizedX = (x / rect.width - 0.5) * 2;
    const normalizedY = (y / rect.height - 0.5) * 2;

    // Smooth GSAP 3D card tilt & elevation (lift to -16px, rotate up to 12deg)
    gsap.to(cardRef.current, {
      rotateY: normalizedX * 12,
      rotateX: -normalizedY * 12,
      y: -16,
      scale: 1.03,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto',
    });

    // BOLT OPTIMIZATION: Move spotlight glare using hardware-accelerated translate3d (x, y) rather than updating heavy CSS background gradients
    if (glareRef.current) {
      gsap.to(glareRef.current, {
        opacity: 1,
        x: x,
        y: y,
        duration: 0.25,
        overwrite: 'auto',
      });
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
      // BOLT OPTIMIZATION: Replaced "transition-all" with explicit non-conflicting transitions to prevent rendering/GSAP conflicts
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
      {/* BOLT OPTIMIZATION: Glare is a static gradient with a transform + GPU layout optimization */}
      <div
        ref={glareRef}
        className="pointer-events-none absolute w-[700px] h-[700px] -ml-[350px] -mt-[350px] opacity-0 z-10 mix-blend-screen"
        style={{
          top: 0,
          left: 0,
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
