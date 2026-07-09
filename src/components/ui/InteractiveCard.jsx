import { useRef } from 'react';
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

  const handleMouseMove = (e) => {
    if (!cardRef.current || !rectRef.current) return;

    // BOLT OPTIMIZATION: Use cached document-relative positions for stable tracking without layout thrashing
    const { left, top, width, height } = rectRef.current;
    const x = e.pageX - left;
    const y = e.pageY - top;

    const normalizedX = x / width - 0.5;
    const normalizedY = y / height - 0.5;

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

    // BOLT OPTIMIZATION: Move spotlight glare via transform: translate3d for GPU acceleration
    if (glareRef.current) {
      gsap.to(glareRef.current, {
        opacity: 1,
        x: x - 400, // Center of 800px glare
        y: y - 400,
        duration: 0.15,
        overwrite: 'auto',
      });
    }
  };

  const handleMouseEnter = (e) => {
    // BOLT OPTIMIZATION: Cache document-relative rect on enter
    if (cardRef.current) {
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

  const glareColor = isDarkRed ? 'rgba(255, 30, 86, 0.22)' : 'rgba(37, 99, 235, 0.15)';

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
      {/* BOLT OPTIMIZATION: Static gradient moved via GPU-accelerated transform */}
      <div
        ref={glareRef}
        className="pointer-events-none absolute w-[800px] h-[800px] opacity-0 z-10 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at center, ${glareColor}, transparent 60%)`,
          left: 0,
          top: 0,
          willChange: 'transform'
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
