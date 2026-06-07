import { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import useReducedMotion from '../../utils/useReducedMotion';
import ParticleField from './ParticleField';
import FloatingShapes from './FloatingShapes';

/**
 * Full-page 3D scene that follows scroll
 * Optimized for performance with ref-based scroll tracking and mobile optimizations
 */
const Scene3DFullPage = () => {
  const prefersReducedMotion = useReducedMotion();
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const scrollProgressRef = useRef(0);
  const [isMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    if (prefersReducedMotion || isMobile) return;

    const handleMouseMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      mousePositionRef.current = { x: x * 0.5, y: y * 0.5 };
    };

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgressRef.current = docHeight > 0 ? scrollTop / docHeight : 0;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prefersReducedMotion, isMobile]);

  if (prefersReducedMotion) {
    return null;
  }

  const particleCount = isMobile ? 300 : 800;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
        dpr={isMobile ? [1, 1] : [1, 1.5]}
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.4} color="#3b82f6" />
        <pointLight position={[-10, -10, -10]} intensity={0.2} color="#06b6d4" />

        <Suspense fallback={null}>
          <ParticleField 
            count={particleCount} 
            mousePositionRef={mousePositionRef}
            scrollProgressRef={scrollProgressRef}
          />
          {!isMobile && <FloatingShapes scrollProgressRef={scrollProgressRef} />}
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Scene3DFullPage;
