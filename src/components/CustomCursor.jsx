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

      gsap.to(cursor, {
        x: mouse.current.x,
        y: mouse.current.y,
        duration: 0.1,
        ease: 'power2.out',
      });
    };

    const tick = () => {
      const dt = 1.0 - Math.pow(1.0 - 0.15, gsap.ticker.deltaRatio());
      pos.current.x += (mouse.current.x - pos.current.x) * dt;
      pos.current.y += (mouse.current.y - pos.current.y) * dt;

      const vx = mouse.current.x - pos.current.x;
      const vy = mouse.current.y - pos.current.y;
      const velocity = Math.sqrt(vx * vx + vy * vy);

      const baseRotation = velocity * 0.5;

      gsap.set(plusContainer, {
        x: pos.current.x,
        y: pos.current.y,
        rotation: `+=${0.5 + baseRotation * 0.05}`,
      });
    };

    gsap.ticker.add(tick);

    const onMouseDown = () => {
      gsap.to(lineRefs.current, { 
        padding: '2px', 
        duration: 0.2, 
        backgroundColor: '#2563EB' 
      });
    };

    const onMouseUp = () => {
      gsap.to(lineRefs.current, { 
        padding: '0px', 
        duration: 0.3, 
        backgroundColor: '#3B82F6' 
      });
    };

    const handleLinkHover = () => {
      const targets = document.querySelectorAll('a, button, .group, [role="button"]');
      
      const onEnter = () => {
        gsap.to(lineRefs.current[0], { y: -12, height: 12, duration: 0.4, ease: 'back.out(2)' });
        gsap.to(lineRefs.current[1], { y: 12, height: 12, duration: 0.4, ease: 'back.out(2)' });
        gsap.to(lineRefs.current[2], { x: -12, width: 12, duration: 0.4, ease: 'back.out(2)' });
        gsap.to(lineRefs.current[3], { x: 12, width: 12, duration: 0.4, ease: 'back.out(2)' });
        
        gsap.to(cursor, { 
          scale: 0.5, 
          backgroundColor: '#2563EB', 
          boxShadow: '0 0 15px rgba(37, 99, 235, 0.5)',
          duration: 0.3 
        });
        gsap.to(lineRefs.current, { backgroundColor: '#60A5FA', duration: 0.3 });
      };

      const onLeave = () => {
        gsap.to(lineRefs.current, { x: 0, y: 0, width: 8, height: 8, duration: 0.4, ease: 'power2.out' });
        gsap.to([lineRefs.current[0], lineRefs.current[1]], { width: 1.5, height: 8, backgroundColor: '#3B82F6' });
        gsap.to([lineRefs.current[2], lineRefs.current[3]], { width: 8, height: 1.5, backgroundColor: '#3B82F6' });
        
        gsap.to(cursor, { 
          scale: 1, 
          backgroundColor: '#2563EB', 
          boxShadow: '0 0 10px rgba(37, 99, 235, 0.4), 0 0 15px rgba(37, 99, 235, 0.2)',
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
      {/* Core Dot */}
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[9999]"
        style={{ 
          backgroundColor: '#2563EB',
          boxShadow: '0 0 10px rgba(37, 99, 235, 0.4), 0 0 15px rgba(37, 99, 235, 0.2)',
          willChange: 'transform'
        }}
      />
      
      {/* Plus Sign Container */}
      <div 
        ref={plusRef} 
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9998] flex items-center justify-center"
      >
        <div 
          ref={el => lineRefs.current[0] = el}
          className="absolute w-[1.5px] h-2 -translate-y-2 origin-bottom"
          style={{ backgroundColor: '#3B82F6', boxShadow: '0 0 8px rgba(37, 99, 235, 0.3)' }}
        />
        <div 
          ref={el => lineRefs.current[1] = el}
          className="absolute w-[1.5px] h-2 translate-y-2 origin-top"
          style={{ backgroundColor: '#3B82F6', boxShadow: '0 0 8px rgba(37, 99, 235, 0.3)' }}
        />
        <div 
          ref={el => lineRefs.current[2] = el}
          className="absolute w-2 h-[1.5px] -translate-x-2 origin-right"
          style={{ backgroundColor: '#3B82F6', boxShadow: '0 0 8px rgba(37, 99, 235, 0.3)' }}
        />
        <div 
          ref={el => lineRefs.current[3] = el}
          className="absolute w-2 h-[1.5px] translate-x-2 origin-left"
          style={{ backgroundColor: '#3B82F6', boxShadow: '0 0 8px rgba(37, 99, 235, 0.3)' }}
        />
      </div>
    </>
  );
};

export default CustomCursor;
