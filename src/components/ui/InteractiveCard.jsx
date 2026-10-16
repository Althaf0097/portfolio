import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

/*
 * BOLT OPTIMIZATION:
 * 1. Cache card element bounds in `rectRef` on `onMouseEnter` to eliminate layout thrashing
 *    from high-frequency `getBoundingClientRect()` calls inside `onMouseMove`.
 * 2. Utilize `gsap.quickTo()` for high-frequency transforms (`rotateX`, `rotateY`, `y`, `scale`, glare `x`/`y`),
 *    bypassing new GSAP tween instantiation on every mouse move frame.
 * 3. Replace dynamic string updates of `background: radial-gradient(...)` with GPU-accelerated 3D transforms
 *    (`x`/`y` translations) on a fixed spotlight element to avoid main-thread repaints.
 * 4. Remove `transition-all` on the card container to avoid animation jitter and rendering conflicts with GSAP.
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

  const xToCard = useRef(null);
  const yToCard = useRef(null);
  const yPosToCard = useRef(null);
  const scaleToCard = useRef(null);
  const xToGlare = useRef(null);
  const yToGlare = useRef(null);
  const opacityToGlare = useRef(null);

  useEffect(() => {
    if (!cardRef.current || !glareRef.current) return;

    xToCard.current = gsap.quickTo(cardRef.current, 'rotateY', { duration: 0.35, ease: 'power2.out' });
    yToCard.current = gsap.quickTo(cardRef.current, 'rotateX', { duration: 0.35, ease: 'power2.out' });
    yPosToCard.current = gsap.quickTo(cardRef.current, 'y', { duration: 0.35, ease: 'power2.out' });
    scaleToCard.current = gsap.quickTo(cardRef.current, 'scale', { duration: 0.35, ease: 'power2.out' });

    xToGlare.current = gsap.quickTo(glareRef.current, 'x', { duration: 0.25, ease: 'power2.out' });
    yToGlare.current = gsap.quickTo(glareRef.current, 'y', { duration: 0.25, ease: 'power2.out' });
    opacityToGlare.current = gsap.quickTo(glareRef.current, 'opacity', { duration: 0.25, ease: 'power2.out' });
  }, []);

  const handleMouseMove = (e) => {
    if (!rectRef.current) return;
    const rect = rectRef.current;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normalizedX = (x / rect.width - 0.5) * 2;
    const normalizedY = (y / rect.height - 0.5) * 2;

    if (xToCard.current) {
      xToCard.current(normalizedX * 12);
      yToCard.current(-normalizedY * 12);
      yPosToCard.current(-16);
      scaleToCard.current(1.03);
    }

    if (xToGlare.current) {
      xToGlare.current(x);
      yToGlare.current(y);
      opacityToGlare.current(1);
    }
  };

  const handleMouseEnter = (e) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      rectRef.current = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      };
    }
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        rotateY: 0,
        rotateX: 0,
        y: 0,
        scale: 1,
        duration: 0.65,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    }

    if (opacityToGlare.current) {
      opacityToGlare.current(0);
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
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-100 group-hover:via-white/60 transition-[opacity,background-color] duration-500 z-30" />

      {/* Cyber Edge Glow Highlight (Primary & Accent Gradient) */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-20 group-hover:opacity-100 group-hover:via-accent transition-[opacity,background-color] duration-500 z-30" />

      {/* Interactive Mouse-Tracking Spotlight Glare */}
      <div
        ref={glareRef}
        className="pointer-events-none absolute top-0 left-0 w-[350px] h-[350px] -ml-[175px] -mt-[175px] rounded-full opacity-0 z-10 mix-blend-screen bg-[radial-gradient(circle,rgba(0,229,255,0.2)_0%,rgba(79,140,255,0.1)_50%,transparent_100%)]"
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
