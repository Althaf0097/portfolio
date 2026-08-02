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

  // BOLT OPTIMIZATION: Cache bounding dimensions to completely eliminate layout thrashing
  // (re-reading getBoundingClientRect inside high-frequency mousemove listener).
  const boundsRef = useRef({ left: 0, top: 0, width: 0, height: 0 });

  // GSAP quickTo helpers for ultra-fast, GPU-accelerated updates without styling recalculation overhead
  const xTo = useRef(null);
  const yTo = useRef(null);
  const tiltXTo = useRef(null);
  const tiltYTo = useRef(null);
  const cardYTo = useRef(null);
  const cardScaleTo = useRef(null);
  const glareOpacityTo = useRef(null);

  useEffect(() => {
    if (!glareRef.current || !cardRef.current) return;

    // Initialize quickTo helpers for smooth transitions
    xTo.current = gsap.quickTo(glareRef.current, 'x', { duration: 0.25, ease: 'power2.out' });
    yTo.current = gsap.quickTo(glareRef.current, 'y', { duration: 0.25, ease: 'power2.out' });

    tiltXTo.current = gsap.quickTo(cardRef.current, 'rotateX', { duration: 0.35, ease: 'power2.out' });
    tiltYTo.current = gsap.quickTo(cardRef.current, 'rotateY', { duration: 0.35, ease: 'power2.out' });
    cardYTo.current = gsap.quickTo(cardRef.current, 'y', { duration: 0.35, ease: 'power2.out' });
    cardScaleTo.current = gsap.quickTo(cardRef.current, 'scale', { duration: 0.35, ease: 'power2.out' });
    glareOpacityTo.current = gsap.quickTo(glareRef.current, 'opacity', { duration: 0.25, ease: 'power2.out' });
  }, []);

  const updateBounds = () => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    boundsRef.current = {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
      width: rect.width || 1,
      height: rect.height || 1,
    };
  };

  const handleMouseMove = (e) => {
    // BOLT OPTIMIZATION: Use cached layout coordinates to avoid calling getBoundingClientRect()
    // inside the high-frequency mouse move handler, fully preventing main thread layout thrashing.
    const pageX = e.pageX;
    const pageY = e.pageY;

    const x = pageX - boundsRef.current.left;
    const y = pageY - boundsRef.current.top;

    const normalizedX = (x / boundsRef.current.width - 0.5) * 2;
    const normalizedY = (y / boundsRef.current.height - 0.5) * 2;

    // Update 3D card tilt
    if (tiltYTo.current) tiltYTo.current(normalizedX * 12);
    if (tiltXTo.current) tiltXTo.current(-normalizedY * 12);

    // BOLT OPTIMIZATION: Shift the glare workload to the GPU using translate3d (x/y properties in GSAP)
    // and quickTo helper rather than constantly repainting custom radial backgrounds.
    if (xTo.current) xTo.current(x);
    if (yTo.current) yTo.current(y);
  };

  const handleMouseEnter = (e) => {
    updateBounds();
    if (cardScaleTo.current) cardScaleTo.current(1.03);
    if (cardYTo.current) cardYTo.current(-16);
    if (glareOpacityTo.current) glareOpacityTo.current(1);
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleMouseLeave = () => {
    if (tiltXTo.current) tiltXTo.current(0);
    if (tiltYTo.current) tiltYTo.current(0);
    if (cardYTo.current) cardYTo.current(0);
    if (cardScaleTo.current) cardScaleTo.current(1);
    if (glareOpacityTo.current) glareOpacityTo.current(0);
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
      // BOLT OPTIMIZATION: Avoid global transition-all CSS class to prevent layout/repaint conflicts
      // and animation jitter with active GSAP animations. Transition only non-GSAP animated properties.
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

      {/* BOLT OPTIMIZATION: Pre-rendered absolute-positioned glare overlay element moved on GPU */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-10 mix-blend-screen">
        <div
          ref={glareRef}
          className="pointer-events-none absolute top-0 left-0 w-[700px] h-[700px] -ml-[350px] -mt-[350px] rounded-full opacity-0 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.2)_0%,rgba(79,140,255,0.1)_50%,transparent_100%)]"
          style={{ willChange: 'transform, opacity' }}
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
