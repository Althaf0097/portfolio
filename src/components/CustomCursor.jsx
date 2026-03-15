import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    // Disable custom cursor on touch devices for better UX
    if (window.matchMedia("(pointer: coarse)").matches) return;

    // Hide native cursor only when custom cursor is active
    document.body.classList.add('custom-cursor-active');

    const cursor = cursorRef.current;
    const follower = followerRef.current;

    const onMouseMove = (e) => {
      const { clientX, clientY } = e;
      
      // Core dot follows immediately
      gsap.to(cursor, {
        x: clientX,
        y: clientY,
        duration: 0.1,
        ease: 'power2.out',
      });

      // Tail/Glow ring follows with smooth inertia
      gsap.to(follower, {
        x: clientX,
        y: clientY,
        duration: 0.5,
        ease: 'power3.out',
      });
    };

    const onMouseDown = () => {
      gsap.to([cursor, follower], { scale: 0.7, duration: 0.2 });
    };

    const onMouseUp = () => {
      gsap.to([cursor, follower], { scale: 1, duration: 0.2 });
    };

    // Global listener for interactive elements
    const handleLinkHover = () => {
      const interactiveElements = document.querySelectorAll('a, button, .group, .card-hover');
      
      const onMouseEnter = () => {
        gsap.to(follower, {
          scale: 3.5,
          backgroundColor: 'rgba(255, 0, 0, 0.15)',
          borderColor: 'rgba(255, 0, 0, 0.6)',
          duration: 0.4,
          ease: 'back.out(1.7)'
        });
        gsap.to(cursor, { 
          scale: 0.6, 
          backgroundColor: '#ff3333',
          boxShadow: '0 0 20px #ff0000',
          duration: 0.3 
        });
      };

      const onMouseLeave = () => {
        gsap.to(follower, {
          scale: 1,
          backgroundColor: 'transparent',
          borderColor: 'rgba(255, 0, 0, 0.4)',
          duration: 0.4,
          ease: 'power2.out'
        });
        gsap.to(cursor, { 
          scale: 1, 
          backgroundColor: '#ff0000',
          boxShadow: '0 0 15px #ff0000',
          duration: 0.3 
        });
      };

      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', onMouseEnter);
        el.addEventListener('mouseleave', onMouseLeave);
      });

      return () => {
        interactiveElements.forEach(el => {
          el.removeEventListener('mouseenter', onMouseEnter);
          el.removeEventListener('mouseleave', onMouseLeave);
        });
      };
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    
    const cleanupHovers = handleLinkHover();

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      cleanupHovers();
    };
  }, []);

  return (
    <>
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-red-500 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{ 
          transition: 'background-color 0.3s ease',
          boxShadow: '0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 30px #ff0000'
        }}
      />
      <div 
        ref={followerRef} 
        className="fixed top-0 left-0 w-10 h-10 border-2 border-red-500/50 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2"
        style={{ 
          boxShadow: '0 0 20px rgba(255, 0, 0, 0.4), 0 0 40px rgba(255, 0, 0, 0.2)',
          backdropFilter: 'blur(4px)'
        }}
      />
    </>
  );
};

export default CustomCursor;
