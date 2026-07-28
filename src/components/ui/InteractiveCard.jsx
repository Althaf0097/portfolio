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

  // Cache bounding box dimensions to prevent layout thrashing
  const dimensionsRef = useRef({ left: 0, top: 0, width: 0, height: 0 });

  // GSAP quickTo setters for ultra-smooth 60fps performance and zero allocation overhead
  const xTo = useRef(null);
  const scaleTo = useRef(null);
  const rotateXTo = useRef(null);
  const rotateYTo = useRef(null);

  const glareXTo = useRef(null);
  const glareYTo = useRef(null);
  const glareOpacityTo = useRef(null);

  const initQuickTo = () => {
    if (!cardRef.current) return;

    xTo.current = gsap.quickTo(cardRef.current, 'y', { duration: 0.35, ease: 'power2.out' });
    scaleTo.current = gsap.quickTo(cardRef.current, 'scale', { duration: 0.35, ease: 'power2.out' });
    rotateXTo.current = gsap.quickTo(cardRef.current, 'rotateX', { duration: 0.35, ease: 'power2.out' });
    rotateYTo.current = gsap.quickTo(cardRef.current, 'rotateY', { duration: 0.35, ease: 'power2.out' });

    if (glareRef.current) {
      glareXTo.current = gsap.quickTo(glareRef.current, 'x', { duration: 0.25, ease: 'power2.out' });
      glareYTo.current = gsap.quickTo(glareRef.current, 'y', { duration: 0.25, ease: 'power2.out' });
      glareOpacityTo.current = gsap.quickTo(glareRef.current, 'opacity', { duration: 0.25, ease: 'power2.out' });
    }
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    // Read dimensions from cache to avoid layout thrashing (getBoundingClientRect)
    const { left, top, width, height } = dimensionsRef.current;
    if (width === 0 || height === 0) return;

    // Calculate relative mouse coordinates based on page-relative coordinates cached during mouse enter
    const x = e.clientX + window.scrollX - left;
    const y = e.clientY + window.scrollY - top;

    const normalizedX = (x / width - 0.5) * 2;
    const normalizedY = (y / height - 0.5) * 2;

    if (!xTo.current) {
      initQuickTo();
    }

    // BOLT OPTIMIZATION: Use quickTo for high-frequency transforms, shifting rendering load to GPU
    xTo.current?.(-16);
    scaleTo.current?.(1.03);
    rotateXTo.current?.(-normalizedY * 12);
    rotateYTo.current?.(normalizedX * 12);

    if (glareRef.current) {
      // Offset center of the spotlight gradient overlay
      glareXTo.current?.(x - 350);
      glareYTo.current?.(y - 350);
      glareOpacityTo.current?.(1);
    }
  };

  const handleMouseEnter = (e) => {
    if (!cardRef.current) return;

    // BOLT OPTIMIZATION: Cache page-relative coordinates on mouse enter once, avoiding getBoundingClientRect during mouse move
    const rect = cardRef.current.getBoundingClientRect();
    dimensionsRef.current = {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
      width: rect.width,
      height: rect.height,
    };

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

      {/* BOLT OPTIMIZATION: Hardware accelerated glare using transform: translate3d over background gradient transition */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-10">
        <div
          ref={glareRef}
          className="pointer-events-none absolute w-[700px] h-[700px] rounded-full opacity-0 mix-blend-screen"
          style={{
            top: 0,
            left: 0,
            background: 'radial-gradient(350px circle at center, rgba(0, 229, 255, 0.2) 0%, rgba(79, 140, 255, 0.1) 50%, transparent 100%)',
            willChange: 'transform, opacity',
          }}
        />
      </div>

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
