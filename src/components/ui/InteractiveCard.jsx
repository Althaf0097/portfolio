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

  // BOLT OPTIMIZATION: Cache element dimensions on mouse enter to avoid layout thrashing
  // on every high-frequency mousemove event (O(1) cached lookups vs expensive getBoundingClientRect).
  const boundsRef = useRef({ left: 0, top: 0, width: 1, height: 1 });

  // BOLT OPTIMIZATION: Retain pre-allocated GSAP quickTo functions for instant, GPU-accelerated
  // transform animations without continuous tween object allocation or garbage collection spikes.
  const quickCard = useRef({});
  const quickGlare = useRef({});

  useEffect(() => {
    if (!cardRef.current || !glareRef.current) return;

    // Initialize quickTo tweens once on mount
    quickCard.current = {
      rotateY: gsap.quickTo(cardRef.current, 'rotateY', { duration: 0.35, ease: 'power2.out' }),
      rotateX: gsap.quickTo(cardRef.current, 'rotateX', { duration: 0.35, ease: 'power2.out' }),
      y: gsap.quickTo(cardRef.current, 'y', { duration: 0.35, ease: 'power2.out' }),
      scale: gsap.quickTo(cardRef.current, 'scale', { duration: 0.35, ease: 'power2.out' }),
    };

    quickGlare.current = {
      x: gsap.quickTo(glareRef.current, 'x', { duration: 0.25, ease: 'power2.out' }),
      y: gsap.quickTo(glareRef.current, 'y', { duration: 0.25, ease: 'power2.out' }),
    };
  }, []);

  const handleMouseEnter = (e) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      boundsRef.current = {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height,
      };
    }
    if (glareRef.current) {
      gsap.to(glareRef.current, {
        opacity: 1,
        duration: 0.25,
        overwrite: 'auto',
      });
    }
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = boundsRef.current;
    if (!width || !height) return;

    // Normalize coordinates relative to cached page bounds
    const pageX = e.pageX ?? (e.clientX + window.scrollX);
    const pageY = e.pageY ?? (e.clientY + window.scrollY);
    const x = pageX - left;
    const y = pageY - top;

    const normalizedX = (x / width - 0.5) * 2;
    const normalizedY = (y / height - 0.5) * 2;

    // Smooth GSAP 3D card tilt & elevation via pre-compiled quickTo
    if (quickCard.current.rotateY) {
      quickCard.current.rotateY(normalizedX * 12);
      quickCard.current.rotateX(-normalizedY * 12);
      quickCard.current.y(-16);
      quickCard.current.scale(1.03);
    }

    // Move spotlight glare using hardware-accelerated transforms
    if (quickGlare.current.x) {
      quickGlare.current.x(x);
      quickGlare.current.y(y);
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
      // BOLT OPTIMIZATION: Replaced transition-all with explicit transitions to avoid GSAP transform jitter
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

      {/* BOLT OPTIMIZATION: Hardware-accelerated GPU translated spotlight glare replacing main-thread gradient repaints */}
      <div
        ref={glareRef}
        style={{
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(0, 229, 255, 0.2) 0%, rgba(79, 140, 255, 0.1) 50%, transparent 100%)',
          willChange: 'transform, opacity',
        }}
        className="pointer-events-none absolute top-0 left-0 -ml-[175px] -mt-[175px] rounded-full opacity-0 z-10 mix-blend-screen"
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
