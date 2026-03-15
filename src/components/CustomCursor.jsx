import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const plusRef = useRef(null);
  const lineRefs = useRef([]);
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    document.body.classList.add('custom-cursor-active');

    const cursor = cursorRef.current;
    const plusContainer = plusRef.current;

    gsap.set([cursor, plusContainer], { xPercent: -50, yPercent: -50 });

    const onMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };

      // Core dot tracking (instant)
      gsap.to(cursor, {
        x: mouse.current.x,
        y: mouse.current.y,
        duration: 0.1,
        ease: 'power2.out',
      });
    };

    const tick = () => {
      // Elastic smoothing for the tactical plus
      const dt = 1.0 - Math.pow(1.0 - 0.15, gsap.ticker.deltaRatio());
      pos.current.x += (mouse.current.x - pos.current.x) * dt;
      pos.current.y += (mouse.current.y - pos.current.y) * dt;

      const vx = mouse.current.x - pos.current.x;
      const vy = mouse.current.y - pos.current.y;
      const velocity = Math.sqrt(vx * vx + vy * vy);

      // Rotate the plus sign based on speed
      const baseRotation = velocity * 0.5;

      gsap.set(plusContainer, {
        x: pos.current.x,
        y: pos.current.y,
        rotation: `+=${0.5 + baseRotation * 0.05}`, // Constant slow spin + speed spin
      });
    };

    gsap.ticker.add(tick);

    const onMouseDown = () => {
      gsap.to(lineRefs.current, { 
        padding: '2px', 
        duration: 0.2, 
        backgroundColor: '#2831d4' 
      });
    };

    const onMouseUp = () => {
      gsap.to(lineRefs.current, { 
        padding: '0px', 
        duration: 0.3, 
        backgroundColor: '#1e40af' 
      });
    };

    const handleLinkHover = () => {
      const targets = document.querySelectorAll('a, button, .group, [role="button"]');
      
      const onEnter = () => {
        // Expand lines outwards
        gsap.to(lineRefs.current[0], { y: -12, height: 12, duration: 0.4, ease: 'back.out(2)' });
        gsap.to(lineRefs.current[1], { y: 12, height: 12, duration: 0.4, ease: 'back.out(2)' });
        gsap.to(lineRefs.current[2], { x: -12, width: 12, duration: 0.4, ease: 'back.out(2)' });
        gsap.to(lineRefs.current[3], { x: 12, width: 12, duration: 0.4, ease: 'back.out(2)' });
        
        gsap.to(cursor, { 
          scale: 0.5, 
          backgroundColor: '#ffffff', 
          boxShadow: '0 0 15px #2563eb',
          duration: 0.3 
        });
        gsap.to(lineRefs.current, { backgroundColor: '#3b82f6', duration: 0.3 });
      };

      const onLeave = () => {
        // Reset to compact plus
        gsap.to(lineRefs.current, { x: 0, y: 0, width: 8, height: 8, duration: 0.4, ease: 'power2.out' });
        // Restore specific dimensions
        gsap.to([lineRefs.current[0], lineRefs.current[1]], { width: 1.5, height: 8, backgroundColor: '#1e40af' });
        gsap.to([lineRefs.current[2], lineRefs.current[3]], { width: 8, height: 1.5, backgroundColor: '#1e40af' });
        
        gsap.to(cursor, { 
          scale: 1, 
          backgroundColor: '#2831d4', 
          boxShadow: '0 0 10px #2831d4, 0 0 15px rgba(40, 49, 212, 0.4)',
          duration: 0.3 
        });
      };

      targets.forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });

      return () => {
        targets.forEach(el => {
          el.removeEventListener('mouseenter', onEnter);
          el.removeEventListener('mouseleave', onLeave);
        });
      };
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    const cleanupHovers = handleLinkHover();

    return () => {
      document.body.classList.remove('custom-cursor-active');
      gsap.ticker.remove(tick);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      cleanupHovers();
    };
  }, []);

  return (
    <>
      {/* Tactical Core Dot */}
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-blue-700 rounded-full pointer-events-none z-[9999]"
        style={{ 
          backgroundColor: '#2831d4',
          boxShadow: '0 0 10px #2831d4, 0 0 15px rgba(40, 49, 212, 0.4)',
          willChange: 'transform'
        }}
      />
      
      {/* Tactical Plus Sign Container */}
      <div 
        ref={plusRef} 
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9998] flex items-center justify-center"
      >
        {/* Top Line */}
        <div 
          ref={el => lineRefs.current[0] = el}
          className="absolute w-[1.5px] h-2 bg-blue-600/80 -translate-y-2 origin-bottom brightness-125"
          style={{ backgroundColor: '#1e40af', boxShadow: '0 0 8px rgba(40, 49, 212, 0.6)' }}
        />
        {/* Bottom Line */}
        <div 
          ref={el => lineRefs.current[1] = el}
          className="absolute w-[1.5px] h-2 bg-blue-600/80 translate-y-2 origin-top brightness-125"
          style={{ backgroundColor: '#1e40af', boxShadow: '0 0 8px rgba(40, 49, 212, 0.6)' }}
        />
        {/* Left Line */}
        <div 
          ref={el => lineRefs.current[2] = el}
          className="absolute w-2 h-[1.5px] bg-blue-600/80 -translate-x-2 origin-right brightness-125"
          style={{ backgroundColor: '#1e40af', boxShadow: '0 0 8px rgba(40, 49, 212, 0.6)' }}
        />
        {/* Right Line */}
        <div 
          ref={el => lineRefs.current[3] = el}
          className="absolute w-2 h-[1.5px] bg-blue-600/80 translate-x-2 origin-left brightness-125"
          style={{ backgroundColor: '#1e40af', boxShadow: '0 0 8px rgba(40, 49, 212, 0.6)' }}
        />
      </div>
    </>
  );
};

export default CustomCursor;
