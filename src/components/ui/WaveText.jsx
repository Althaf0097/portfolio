import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WaveText = ({ text, className = '', gradient = false }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const chars = containerRef.current.querySelectorAll('.wave-char');
    
    if (chars.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(chars,
        { 
          y: 40,
          opacity: 0,
          rotateX: -90
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.8,
          ease: 'back.out(1.7)',
          stagger: 0.05,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [text]);

  const splitText = text.split('').map((char, index, array) => {
    if (char === ' ') {
      return <span key={index} className="inline-block w-[0.3em]">&nbsp;</span>;
    }
    
    const isGradient = gradient || className.includes('text-gradient');
    const bgSize = `${array.length * 100}% 100%`;
    const bgPos = array.length > 1 ? `${(index / (array.length - 1)) * 100}% 0` : '0% 0';

    return (
      <span 
        key={index} 
        className={`wave-char inline-block origin-bottom ${isGradient ? 'text-gradient' : ''}`}
        style={isGradient ? { backgroundSize: bgSize, backgroundPosition: bgPos } : {}}
      >
        {char}
      </span>
    );
  });

  return (
    <span ref={containerRef} className={`inline-block ${className.replace('text-gradient', '')}`}>
      {splitText}
    </span>
  );
};

export default WaveText;
