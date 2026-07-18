import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useTheme } from '../../context/ThemeContext';

const InteractiveCard = ({
  children,
  className = '',
  featured = false,
  onMouseEnter,
}) => {
  const { isDarkRed } = useTheme();
  const cardRef = useRef(null);
  const glareRef = useRef(null);
  const rectRef = useRef(null);
  const quickX = useRef(null);
  const quickY = useRef(null);

  // BOLT OPTIMIZATION: Move spotlight glare movement to the GPU via transform: translate3d and gsap.quickTo()
  useEffect(() => {
    if (glareRef.current) {
      quickX.current = gsap.quickTo(glareRef.current, 'x', { duration: 0.15, ease: 'power2.out' });
      quickY.current = gsap.quickTo(glareRef.current, 'y', { duration: 0.15, ease: 'power2.out' });
    }
  }, []);

  // BOLT OPTIMIZATION: Cache bounding box dimensions on enter to avoid expensive layout thrashing in high-frequency mousemove events
  const handleMouseEnter = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    rectRef.current = {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
      width: rect.width,
      height: rect.height,
    };

    if (glareRef.current) {
      gsap.to(glareRef.current, { opacity: 1, duration: 0.15, overwrite: 'auto' });
    }

    if (onMouseEnter) onMouseEnter(e);
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    if (!rectRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      rectRef.current = {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height,
      };
    }

    const x = e.pageX - rectRef.current.left;
    const y = e.pageY - rectRef.current.top;

    const normalizedX = x / rectRef.current.width - 0.5;
    const normalizedY = y / rectRef.current.height - 0.5;

    // Smooth GSAP 3D tilt
    gsap.to(cardRef.current, {
      rotateY: normalizedX * 16,
      rotateX: -normalizedY * 16,
      y: -10,
      scale: 1.02,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    });

    if (quickX.current && quickY.current) {
      quickX.current(x - 200);
      quickY.current(y - 200);
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
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1200px',
      }}
      className={`group relative rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer ${
        isDarkRed
          ? featured
            ? 'bg-[#0E080E] border-red-500/50 shadow-xl shadow-red-500/20'
            : 'bg-[#0E080E] border-red-500/25 hover:border-red-400 hover:shadow-2xl hover:shadow-red-600/25'
          : featured
            ? 'bg-white border-blue-300 shadow-xl shadow-blue-500/10'
            : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-600/15'
      } ${className}`}
    >
      {/* Interactive Mouse-Tracking Spotlight Glare */}
      <div
        ref={glareRef}
        className="pointer-events-none absolute w-[400px] h-[400px] rounded-full opacity-0 z-10 top-0 left-0"
        style={{
          background: isDarkRed
            ? 'radial-gradient(circle, rgba(255, 30, 86, 0.22) 0%, transparent 60%)'
            : 'radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, transparent 60%)',
          transform: 'translate3d(-200px, -200px, 0)',
          willChange: 'transform',
        }}
      />

      {/* Subtle diagonal reflection sheen */}
      <div className={`pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 bg-gradient-to-br ${isDarkRed ? 'from-red-500/15 via-transparent to-transparent' : 'from-white/60 via-transparent to-transparent'}`} />

      {/* Card Content */}
      <div className="relative z-20 flex flex-col h-full">{children}</div>
    </div>
  );
};

export default InteractiveCard;
