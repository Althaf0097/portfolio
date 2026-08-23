import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

// BOLT OPTIMIZATION: High-frequency 3D tilt & glare tracking optimized with GSAP quickTo, cached dimensions to prevent layout thrashing, and GPU-accelerated translate3d glare.
const InteractiveCard = ({
  children,
  className = '',
  featured = false,
  onMouseEnter,
}) => {
  const cardRef = useRef(null);
  const glareRef = useRef(null);

  // Cache element dimensions to avoid layout thrashing (getBoundingClientRect) on mousemove
  const rectRef = useRef(null);

  // QuickTo animators for 60-120fps smooth performance without GC allocation overhead
  const quickToRotateY = useRef(null);
  const quickToRotateX = useRef(null);
  const quickToY = useRef(null);
  const quickToScale = useRef(null);
  const quickToGlareX = useRef(null);
  const quickToGlareY = useRef(null);
  const quickToGlareOpacity = useRef(null);

  useEffect(() => {
    if (!cardRef.current) return;

    quickToRotateY.current = gsap.quickTo(cardRef.current, 'rotateY', { duration: 0.35, ease: 'power2.out' });
    quickToRotateX.current = gsap.quickTo(cardRef.current, 'rotateX', { duration: 0.35, ease: 'power2.out' });
    quickToY.current = gsap.quickTo(cardRef.current, 'y', { duration: 0.35, ease: 'power2.out' });
    quickToScale.current = gsap.quickTo(cardRef.current, 'scale', { duration: 0.35, ease: 'power2.out' });

    if (glareRef.current) {
      quickToGlareX.current = gsap.quickTo(glareRef.current, 'x', { duration: 0.25, ease: 'power2.out' });
      quickToGlareY.current = gsap.quickTo(glareRef.current, 'y', { duration: 0.25, ease: 'power2.out' });
      quickToGlareOpacity.current = gsap.quickTo(glareRef.current, 'opacity', { duration: 0.25, ease: 'power2.out' });
    }
  }, []);

  const updateCardBounds = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      rectRef.current = {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height,
      };
    }
  };

  const handleMouseEnter = (e) => {
    updateCardBounds();
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleMouseMove = (e) => {
    if (!rectRef.current) updateCardBounds();
    const rect = rectRef.current;
    if (!rect || rect.width === 0 || rect.height === 0) return;

    // Use page relative coordinates to handle scrolling seamlessly
    const x = e.pageX - rect.left;
    const y = e.pageY - rect.top;

    const normalizedX = (x / rect.width - 0.5) * 2;
    const normalizedY = (y / rect.height - 0.5) * 2;

    if (quickToRotateY.current) quickToRotateY.current(normalizedX * 12);
    if (quickToRotateX.current) quickToRotateX.current(-normalizedY * 12);
    if (quickToY.current) quickToY.current(-16);
    if (quickToScale.current) quickToScale.current(1.03);

    // Hardware-accelerated translate3d for spotlight glare (centered offset for 700px box)
    if (quickToGlareX.current && quickToGlareY.current && quickToGlareOpacity.current) {
      quickToGlareX.current(x - 350);
      quickToGlareY.current(y - 350);
      quickToGlareOpacity.current(1);
    }
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
        className="pointer-events-none absolute top-0 left-0 w-[700px] h-[700px] rounded-full opacity-0 z-10 mix-blend-screen"
        style={{
          background: 'radial-gradient(circle at center, rgba(0, 229, 255, 0.2) 0%, rgba(79, 140, 255, 0.1) 50%, transparent 70%)',
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
