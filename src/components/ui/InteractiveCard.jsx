import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

// BOLT OPTIMIZATION: High-performance 3D interactive card.
// 1. Caches element bounding rect on pointer enter to avoid layout thrashing (getBoundingClientRect) during mousemove.
// 2. Pre-creates GSAP `quickTo` tween pipes for zero-allocation animation updates on every mousemove frame.
// 3. Replaces dynamic `background: radial-gradient(...)` string calculation and repaint thrashing with GPU-accelerated
//    `transform: translate3d()` positioning of a pre-rendered spotlight glare element.
// 4. Eliminates CSS `transition-all` and `transition-opacity` conflicts that cause jitter during GSAP transform/opacity tweens.
const InteractiveCard = ({
  children,
  className = '',
  featured = false,
  onMouseEnter,
}) => {
  const cardRef = useRef(null);
  const glareRef = useRef(null);
  const boundsRef = useRef(null);
  const quickTweensRef = useRef(null);

  useEffect(() => {
    if (!cardRef.current) return;

    // Center glare element using GSAP percent transform once
    if (glareRef.current) {
      gsap.set(glareRef.current, { xPercent: -50, yPercent: -50 });
    }

    // Pre-create GSAP quickTo functions to eliminate tween object allocations in mousemove
    quickTweensRef.current = {
      rotateY: gsap.quickTo(cardRef.current, 'rotateY', { duration: 0.35, ease: 'power2.out' }),
      rotateX: gsap.quickTo(cardRef.current, 'rotateX', { duration: 0.35, ease: 'power2.out' }),
      y: gsap.quickTo(cardRef.current, 'y', { duration: 0.35, ease: 'power2.out' }),
      scale: gsap.quickTo(cardRef.current, 'scale', { duration: 0.35, ease: 'power2.out' }),
      glareX: glareRef.current ? gsap.quickTo(glareRef.current, 'x', { duration: 0.25, ease: 'power2.out' }) : null,
      glareY: glareRef.current ? gsap.quickTo(glareRef.current, 'y', { duration: 0.25, ease: 'power2.out' }) : null,
    };

    return () => {
      quickTweensRef.current = null;
    };
  }, []);

  const handleMouseEnter = (e) => {
    if (cardRef.current) {
      // Cache element bounding box and page scroll offset on enter to prevent layout thrashing during mouse movements
      const rect = cardRef.current.getBoundingClientRect();
      boundsRef.current = {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height,
      };

      if (glareRef.current) {
        gsap.to(glareRef.current, {
          opacity: 1,
          duration: 0.25,
          overwrite: 'auto',
        });
      }
    }
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleMouseMove = (e) => {
    if (!boundsRef.current || !quickTweensRef.current) return;

    const bounds = boundsRef.current;
    const x = e.pageX - bounds.left;
    const y = e.pageY - bounds.top;

    const normalizedX = (x / bounds.width - 0.5) * 2;
    const normalizedY = (y / bounds.height - 0.5) * 2;

    const q = quickTweensRef.current;
    // Smooth GSAP 3D card tilt & elevation (lift to -16px, rotate up to 12deg)
    q.rotateY(normalizedX * 12);
    q.rotateX(-normalizedY * 12);
    q.y(-16);
    q.scale(1.03);

    // Move spotlight glare using GPU-accelerated transform via quickTo
    if (q.glareX && q.glareY) {
      q.glareX(x);
      q.glareY(y);
    }
  };

  const handleMouseLeave = () => {
    boundsRef.current = null;
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
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-100 group-hover:via-white/60 transition-[background-color,opacity] duration-500 z-30" />

      {/* Cyber Edge Glow Highlight (Primary & Accent Gradient) */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-20 group-hover:opacity-100 group-hover:via-accent transition-[opacity] duration-500 z-30" />

      {/* Interactive Mouse-Tracking Spotlight Glare - hardware accelerated translation */}
      <div
        ref={glareRef}
        className="pointer-events-none absolute top-0 left-0 w-[500px] h-[500px] rounded-full opacity-0 z-10 mix-blend-screen bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.2)_0%,rgba(79,140,255,0.1)_50%,transparent_70%)]"
        style={{ willChange: 'transform, opacity' }}
      />

      {/* Ambient static inner shadows and glass sheen */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-white/[0.02] via-transparent to-primary/5 shadow-[inset_0_0_24px_rgba(255,255,255,0.05)]" />

      {/* Card Content wrapper maintaining preserve-3d for inner layers */}
      <div className="relative z-20 flex flex-col h-full" style={{ transform: 'translateZ(30px)' }}>
        {children}
      </div>
    </div>
  );
};

export default InteractiveCard;
