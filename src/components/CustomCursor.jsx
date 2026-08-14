import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const mouse = useRef({ x: -100, y: -100 });
  const pos = useRef({ x: -100, y: -100 });
  const hoveringRef = useRef(false);

  // Use state with lazy initialization to prevent cascading renders
  const [isActive] = useState(() => {
    if (typeof window !== 'undefined') {
      return !window.matchMedia("(pointer: coarse)").matches;
    }
    return false;
  });

  useEffect(() => {
    if (!isActive) return;
    document.body.classList.add('custom-cursor-active');

    const cursor = cursorRef.current;
    const ring = ringRef.current;

    gsap.set([cursor, ring], { xPercent: -50, yPercent: -50 });

    const onMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };

      gsap.to(cursor, {
        x: mouse.current.x,
        y: mouse.current.y,
        duration: 0.04,
        ease: 'none',
      });
    };

    const tick = () => {
      const dt = 1.0 - Math.pow(1.0 - 0.18, gsap.ticker.deltaRatio());
      pos.current.x += (mouse.current.x - pos.current.x) * dt;
      pos.current.y += (mouse.current.y - pos.current.y) * dt;

      gsap.set(ring, {
        x: pos.current.x,
        y: pos.current.y,
      });
    };

    gsap.ticker.add(tick);

    const onMouseDown = () => {
      gsap.to(cursor, { scale: 0.6, duration: 0.1 });
      gsap.to(ring, { scale: 0.8, duration: 0.1 });
    };

    const onMouseUp = () => {
      gsap.to(cursor, { scale: hoveringRef.current ? 1.2 : 1, duration: 0.2 });
      gsap.to(ring, { scale: hoveringRef.current ? 1.35 : 1, duration: 0.2 });
    };

    // Event delegation for interactive elements
    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, .group, [role="button"], [data-interactive="true"], input, textarea, select, h1, h2, h3');
      if (target) {
        hoveringRef.current = true;

        gsap.to(ring, {
          scale: 1.45,
          borderColor: 'rgba(126, 249, 255, 0.9)',
          backgroundColor: 'rgba(79, 140, 255, 0.08)',
          duration: 0.25,
          ease: 'back.out(1.8)',
          overwrite: 'auto',
        });

        gsap.to(cursor, {
          scale: 1.25,
          backgroundColor: '#4F8CFF',
          boxShadow: '0 0 10px rgba(79, 140, 255, 0.9)',
          duration: 0.2,
          overwrite: 'auto',
        });
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest('a, button, .group, [role="button"], [data-interactive="true"], input, textarea, select, h1, h2, h3');
      if (target) {
        hoveringRef.current = false;

        gsap.to(ring, {
          scale: 1,
          borderColor: 'rgba(79, 140, 255, 0.5)',
          backgroundColor: 'transparent',
          duration: 0.3,
          ease: 'power3.out',
          overwrite: 'auto',
        });

        gsap.to(cursor, {
          scale: 1,
          backgroundColor: '#ffffff',
          boxShadow: '0 0 6px rgba(79, 140, 255, 0.6)',
          duration: 0.25,
          overwrite: 'auto',
        });
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.body.addEventListener('mouseover', handleMouseOver);
    document.body.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      gsap.ticker.remove(tick);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.removeEventListener('mouseover', handleMouseOver);
      document.body.removeEventListener('mouseout', handleMouseOut);
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <>
      {/* Tiny Precise Core Dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[9999]"
        style={{
          backgroundColor: '#ffffff',
          boxShadow: '0 0 6px rgba(79, 140, 255, 0.6)',
          willChange: 'transform',
        }}
      />

      {/* Trailing Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-7 h-7 rounded-full pointer-events-none z-[9998] border"
        style={{
          borderColor: 'rgba(79, 140, 255, 0.5)',
          backgroundColor: 'transparent',
          willChange: 'transform',
        }}
      />
    </>
  );
};

export default CustomCursor;
