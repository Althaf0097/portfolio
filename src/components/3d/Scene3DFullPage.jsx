import { Suspense, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import * as THREE from 'three';
import useReducedMotion from '../../utils/useReducedMotion';
import { generateParticleData } from '../../utils/helpers/random';

/**
 * Enhanced particle field that covers the entire viewport
 * with scroll-responsive density and depth
 */
const ParticleField = ({ count = 1000, mousePosition }) => {
  const mesh = useRef();
  const material = useRef();

  const particles = useMemo(() => generateParticleData(count), [count]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
  }), []);

  useFrame((state) => {
    if (!mesh.current || !material.current) return;
    const time = state.clock.getElapsedTime();
    material.current.uniforms.uTime.value = time;
    material.current.uniforms.uMouse.value.set(
      mousePosition.current.x,
      mousePosition.current.y
    );
    mesh.current.rotation.y = time * 0.015;
  });

  const vertexShader = `
    attribute float size;
    attribute float aIndex;
    attribute vec3 color;
    varying vec3 vColor;
    uniform float uTime;
    uniform vec2 uMouse;

    void main() {
      vColor = color;
      vec3 pos = position;

      float floatX = sin(uTime * 0.2 + aIndex * 0.1) * 0.15;
      float floatY = cos(uTime * 0.15 + aIndex * 0.15) * 0.2;
      float floatZ = sin(uTime * 0.18 + aIndex * 0.12) * 0.1;

      pos.x += floatX + uMouse.x * 0.3;
      pos.y += floatY + uMouse.y * 0.3;
      pos.z += floatZ;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = size * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    varying vec3 vColor;
    void main() {
      float dist = distance(gl_PointCoord, vec2(0.5));
      if (dist > 0.5) discard;
      gl_FragColor = vec4(vColor, 0.7);
    }
  `;

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particles.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={particles.sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aIndex"
          count={count}
          array={particles.indices}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        vertexColors
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

/**
 * Floating shapes distributed across the page
 */
const FloatingShapes = () => {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = time * 0.03;
  });

  // Create multiple shape clusters at different Y positions
  const shapePositions = useMemo(() => [
    { pos: [5, 8, -8], scale: 0.7, color: '#6366f1' },
    { pos: [-6, 2, -6], scale: 0.5, color: '#22d3ee' },
    { pos: [4, -5, -7], scale: 0.6, color: '#818cf8' },
    { pos: [-5, -12, -5], scale: 0.4, color: '#6366f1' },
    { pos: [6, -18, -8], scale: 0.5, color: '#22d3ee' },
    { pos: [-4, -25, -6], scale: 0.6, color: '#818cf8' },
  ], []);

  return (
    <group ref={groupRef}>
      {shapePositions.map((shape, idx) => (
        <AnimatedShape key={idx} {...shape} index={idx} />
      ))}
    </group>
  );
};

const AnimatedShape = ({ pos, scale, color, index }) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x = time * (0.2 + index * 0.05);
    meshRef.current.rotation.z = time * (0.15 + index * 0.03);
    meshRef.current.position.y = pos[1] + Math.sin(time * 0.5 + index) * 0.3;
  });

  return (
    <mesh ref={meshRef} position={pos} scale={scale}>
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial
        color={color}
        wireframe
        transparent
        opacity={0.4}
      />
    </mesh>
  );
};

/**
 * Full-page 3D scene that follows scroll
 * Optimized for mobile with reduced particle count
 */
const Scene3DFullPage = () => {
  const prefersReducedMotion = useReducedMotion();
  const mousePosition = useRef({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile for performance optimization
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = useCallback((event) => {
    if (prefersReducedMotion || isMobile) return; // Skip mouse tracking on mobile
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;
    mousePosition.current = { x: x * 0.5, y: y * 0.5 };
  }, [prefersReducedMotion, isMobile]);

  useEffect(() => {
    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove, isMobile]);

  if (prefersReducedMotion) {
    return null;
  }

  // Reduce particles on mobile for performance
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
        <pointLight position={[10, 10, 10]} intensity={0.4} color="#6366f1" />
        <pointLight position={[-10, -10, -10]} intensity={0.2} color="#22d3ee" />

        <Suspense fallback={null}>
          <ParticleField 
            count={particleCount} 
            mousePosition={mousePosition} 
          />
          {!isMobile && <FloatingShapes />}
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Scene3DFullPage;
