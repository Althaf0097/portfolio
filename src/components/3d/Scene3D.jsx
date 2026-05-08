import { Suspense, useCallback, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import ParticleField from './ParticleField';
import FloatingShapes from './FloatingShapes';
import FloatingIcons from './FloatingIcons';
import useReducedMotion from '../../utils/useReducedMotion';

/**
 * Main 3D scene component wrapping the canvas and all 3D elements
 * Handles mouse tracking, reduced motion, and loading states
 */
const Scene3D = () => {
  const prefersReducedMotion = useReducedMotion();
  // Optimization: use useRef for high-frequency updates to avoid React re-renders
  const mousePositionRef = useRef({ x: 0, y: 0 });

  // Track mouse position for parallax effect
  const handleMouseMove = useCallback((event) => {
    if (prefersReducedMotion) return;

    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;

    mousePositionRef.current = { x: x * 0.5, y: y * 0.5 };
  }, [prefersReducedMotion]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Show nothing if user prefers reduced motion
  if (prefersReducedMotion) {
    return null;
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      dpr={[1, 2]} // Device pixel ratio for retina displays
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none', // Allow clicks to pass through
      }}
    >
      {/* Ambient lighting - Classic Hacker Aura */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#00ff41" />
      <pointLight position={[-10, -10, -10]} intensity={1.5} color="#00f2ff" />

      <Suspense fallback={null}>
        {/* Particle system */}
        <ParticleField count={600} mousePositionRef={mousePositionRef} />

        {/* Floating geometric shapes */}
        <FloatingShapes />
        
        {/* Floating Tech Icons */}
        <FloatingIcons />

        {/* Preload all assets */}
        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default Scene3D;
