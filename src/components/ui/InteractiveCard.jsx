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

  // BOLT OPTIMIZATION: Cache card's dimensions and positions to completely eliminate
  // high-frequency getBoundingClientRect() calls (layout thrashing) on mousemove.
  // We use gsap.quickTo() with transform: translate3d to move a static glare element
  // instead of regenerating a CSS background radial gradient, avoiding main-thread repaints.
  // We initialize dimensions to 1 to prevent division by zero in case mousemove fires before mouseenter.
  const rectRef = useRef({ left: 0, top: 0, width: 1, height: 1 });
  const quickXRef = useRef(null);
  const quickYRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    // Calculate relative mouse coordinates using normalized page coordinates
    const rect = rectRef.current;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

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

    // GPU-accelerated glare position updates via transform: translate3d
    if (quickXRef.current && quickYRef.current) {
      quickXRef.current(x - 175); // Offset by half of glare's width (350px / 2)
      quickYRef.current(y - 175); // Offset by half of glare's height (350px / 2)
    }
  };

  const handleMouseEnter = (e) => {
    if (cardRef.current) {
      // BOLT OPTIMIZATION: Cache the card dimensions relative to the page and viewport scroll
      const rect = cardRef.current.getBoundingClientRect();
      rectRef.current = {
        left: rect.left,
        top: rect.top,
        width: rect.width || 1,
        height: rect.height || 1,
      };

      // Initialize quickTo helpers if not already initialized
      if (glareRef.current) {
        if (!quickXRef.current) {
          quickXRef.current = gsap.quickTo(glareRef.current, 'x', { duration: 0.25, ease: 'power2.out' });
        }
        if (!quickYRef.current) {
          quickYRef.current = gsap.quickTo(glareRef.current, 'y', { duration: 0.25, ease: 'power2.out' });
        }

        gsap.to(glareRef.current, {
          opacity: 1,
          duration: 0.25,
          overwrite: 'auto',
        });
      }
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
      className={`group relative rounded-[24px] border border-white/10 transition-all duration-500 overflow-hidden cursor-pointer backdrop-blur-[24px] ${
        featured
          ? 'bg-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(79,140,255,0.15)] hover:border-[#7EF9FF]/50 hover:shadow-[0_25px_60px_rgba(0,0,0,0.7),0_0_40px_rgba(0,229,255,0.3)]'
          : 'bg-white/[0.05] shadow-[0_15px_35px_rgba(0,0,0,0.5)] hover:border-[#4F8CFF]/50 hover:shadow-[0_25px_50px_rgba(0,0,0,0.65),0_0_30px_rgba(79,140,255,0.25)]'
      } ${className}`}
    >
      {/* Top light reflection line (Apple-inspired white top rim highlight) */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-100 group-hover:via-white/60 transition-all duration-500 z-30" />

      {/* Cyber Edge Glow Highlight (Primary & Accent Gradient) */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-20 group-hover:opacity-100 group-hover:via-accent transition-all duration-500 z-30" />

      {/* BOLT OPTIMIZATION: Static hardware-accelerated spotlight glare element */}
      <div
        ref={glareRef}
        className="pointer-events-none absolute w-[350px] h-[350px] top-0 left-0 rounded-full opacity-0 z-10 transition-opacity duration-300 mix-blend-screen"
        style={{
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
