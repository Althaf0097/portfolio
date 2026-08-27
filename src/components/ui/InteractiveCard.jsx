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

  // BOLT OPTIMIZATION: Pre-create gsap.quickTo setters to eliminate main-thread layout recalculations
  // and object allocations on every mouse move frame.
  const quickToRef = useRef(null);

  useEffect(() => {
    if (!cardRef.current || !glareRef.current) return;

    const rotateYTo = gsap.quickTo(cardRef.current, 'rotateY', { duration: 0.35, ease: 'power2.out' });
    const rotateXTo = gsap.quickTo(cardRef.current, 'rotateX', { duration: 0.35, ease: 'power2.out' });
    const yTo = gsap.quickTo(cardRef.current, 'y', { duration: 0.35, ease: 'power2.out' });
    const scaleTo = gsap.quickTo(cardRef.current, 'scale', { duration: 0.35, ease: 'power2.out' });

    const glareXTo = gsap.quickTo(glareRef.current, 'x', { duration: 0.25, ease: 'power2.out' });
    const glareYTo = gsap.quickTo(glareRef.current, 'y', { duration: 0.25, ease: 'power2.out' });
    const glareOpacityTo = gsap.quickTo(glareRef.current, 'opacity', { duration: 0.25, ease: 'power2.out' });

    quickToRef.current = {
      rotateYTo,
      rotateXTo,
      yTo,
      scaleTo,
      glareXTo,
      glareYTo,
      glareOpacityTo,
    };
  }, []);

  const handleMouseEnter = (e) => {
    if (cardRef.current) {
      // BOLT OPTIMIZATION: Cache card dimensions and page offset on mouseEnter to prevent layout thrashing inside mousemove handler
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

  const handleMouseMove = (e) => {
    if (!rectRef.current || !quickToRef.current) return;

    const { left, top, width, height } = rectRef.current;
    const pageX = e.pageX ?? e.clientX + window.scrollX;
    const pageY = e.pageY ?? e.clientY + window.scrollY;

    const x = pageX - left;
    const y = pageY - top;

    const normalizedX = (x / width - 0.5) * 2;
    const normalizedY = (y / height - 0.5) * 2;

    // Fast GPU-accelerated updates via GSAP quickTo
    const { rotateYTo, rotateXTo, yTo, scaleTo, glareXTo, glareYTo, glareOpacityTo } = quickToRef.current;
    rotateYTo(normalizedX * 12);
    rotateXTo(-normalizedY * 12);
    yTo(-16);
    scaleTo(1.03);

    glareXTo(x);
    glareYTo(y);
    glareOpacityTo(1);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current || !quickToRef.current) return;

    const { rotateYTo, rotateXTo, yTo, scaleTo, glareOpacityTo } = quickToRef.current;
    rotateYTo(0);
    rotateXTo(0);
    yTo(0);
    scaleTo(1);
    glareOpacityTo(0);
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
      {/* Top light reflection line */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-100 group-hover:via-white/60 transition-all duration-500 z-30" />

      {/* Cyber Edge Glow Highlight */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-20 group-hover:opacity-100 group-hover:via-accent transition-all duration-500 z-30" />

      {/* Interactive Mouse-Tracking Spotlight Glare using GPU transform */}
      <div
        ref={glareRef}
        className="pointer-events-none absolute top-0 left-0 -ml-[250px] -mt-[250px] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.2)_0%,rgba(79,140,255,0.1)_50%,transparent_100%)] opacity-0 z-10 mix-blend-screen"
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
