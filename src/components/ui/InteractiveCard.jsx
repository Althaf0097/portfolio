import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

/* BOLT OPTIMIZATION:
   To prevent layout thrashing and repaint costs during high-frequency mouse movements on 3D tilt cards:
   1. Bounding rect dimensions (including scroll offsets) are cached in rectRef onMouseEnter / onResize.
   2. GSAP quickTo setters are initialized once inside useEffect to mutate transforms smoothly
      without constructing new GSAP animation objects on every mousemove.
*/
const InteractiveCard = ({
  children,
  className = '',
  featured = false,
  onMouseEnter,
}) => {
  const cardRef = useRef(null);
  const glareRef = useRef(null);
  const rectRef = useRef(null);

  // QuickTo animators for high-performance transform updates
  const quickRotateY = useRef(null);
  const quickRotateX = useRef(null);
  const quickY = useRef(null);
  const quickScale = useRef(null);
  const quickGlareOpacity = useRef(null);

  useEffect(() => {
    if (!cardRef.current) return;

    quickRotateY.current = gsap.quickTo(cardRef.current, 'rotateY', { duration: 0.35, ease: 'power2.out' });
    quickRotateX.current = gsap.quickTo(cardRef.current, 'rotateX', { duration: 0.35, ease: 'power2.out' });
    quickY.current = gsap.quickTo(cardRef.current, 'y', { duration: 0.35, ease: 'power2.out' });
    quickScale.current = gsap.quickTo(cardRef.current, 'scale', { duration: 0.35, ease: 'power2.out' });

    if (glareRef.current) {
      quickGlareOpacity.current = gsap.quickTo(glareRef.current, 'opacity', { duration: 0.25, ease: 'power2.out' });
    }
  }, []);

  const updateRect = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      rectRef.current = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      };
    }
  };

  const handleMouseMove = (e) => {
    if (!rectRef.current) updateRect();
    const rect = rectRef.current;
    if (!rect || rect.width === 0 || rect.height === 0) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normalizedX = (x / rect.width - 0.5) * 2;
    const normalizedY = (y / rect.height - 0.5) * 2;

    if (quickRotateY.current) quickRotateY.current(normalizedX * 12);
    if (quickRotateX.current) quickRotateX.current(-normalizedY * 12);
    if (quickY.current) quickY.current(-16);
    if (quickScale.current) quickScale.current(1.03);

    if (glareRef.current) {
      if (quickGlareOpacity.current) quickGlareOpacity.current(1);
      glareRef.current.style.background = `radial-gradient(350px circle at ${x}px ${y}px, rgba(0, 229, 255, 0.2) 0%, rgba(79, 140, 255, 0.1) 50%, transparent 100%)`;
    }
  };

  const handleMouseEnter = (e) => {
    updateRect();
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleMouseLeave = () => {
    rectRef.current = null;

    if (quickRotateY.current) quickRotateY.current(0);
    if (quickRotateX.current) quickRotateX.current(0);
    if (quickY.current) quickY.current(0);
    if (quickScale.current) quickScale.current(1);
    if (quickGlareOpacity.current) quickGlareOpacity.current(0);
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

      {/* Interactive Mouse-Tracking Spotlight Glare */}
      <div
        ref={glareRef}
        className="pointer-events-none absolute inset-0 opacity-0 z-10 transition-opacity duration-300 mix-blend-screen"
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
