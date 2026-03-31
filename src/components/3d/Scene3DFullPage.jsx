import { Suspense, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import * as THREE from 'three';
import useReducedMotion from '../../utils/useReducedMotion';

/**
 * Enhanced particle field that covers the entire viewport
 * with scroll-responsive density and depth
 */
const generateParticleData = (count) => {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const randoms = new Float32Array(count);

  const accentColor = new THREE.Color('#3b82f6');
  const blueColor = new THREE.Color('#06b6d4');
  const whiteColor = new THREE.Color('#ffffff');

  for (let i = 0; i < count; i++) {
    // Spread particles across a larger vertical space for scrolling
    positions[i * 3] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 60; // Extended vertical range
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

    const colorChoice = Math.random();
    let color;
    if (colorChoice < 0.4) color = accentColor;
    else if (colorChoice < 0.7) color = blueColor;
    else color = whiteColor;

    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;

    sizes[i] = Math.random() * 0.06 + 0.02;
    randoms[i] = Math.random();
  }

  return { positions, colors, sizes, randoms };
};

const ParticleField = ({ count = 1000, mousePositionRef, scrollProgressRef }) => {
  const mesh = useRef();
  const materialRef = useRef();

  const particles = useMemo(() => generateParticleData(count), [count]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uScroll: { value: 0 },
  }), []);

  useFrame((state) => {
    if (!mesh.current || !materialRef.current) return;
    const time = state.clock.getElapsedTime();

    const { uTime, uMouse, uScroll } = materialRef.current.uniforms;
    uTime.value = time;
    uMouse.value.set(
      mousePositionRef.current.x,
      mousePositionRef.current.y
    );
    uScroll.value = scrollProgressRef.current;

    mesh.current.rotation.y = time * 0.015;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-randoms"
          count={count}
          array={particles.randoms}
          itemSize={1}
        />
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
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        transparent
        vertexColors
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        vertexShader={`
          attribute float randoms;
          varying vec3 vColor;
          uniform float uTime;
          uniform vec2 uMouse;
          uniform float uScroll;

          void main() {
            vColor = color;
            vec3 pos = position;

            // GPU-accelerated floating motion
            float floatX = sin(uTime * 0.2 + randoms * 10.0) * 0.15;
            float floatY = cos(uTime * 0.15 + randoms * 15.0) * 0.2;
            float floatZ = sin(uTime * 0.18 + randoms * 12.0) * 0.1;

            pos.x += floatX + uMouse.x * 0.3;
            pos.y += floatY + uMouse.y * 0.3 - uScroll * 10.0; // Parallax scroll
            pos.z += floatZ;

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = 0.04 * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying vec3 vColor;
          void main() {
            float dist = distance(gl_PointCoord, vec2(0.5));
            if (dist > 0.5) discard;
            float alpha = smoothstep(0.5, 0.2, dist) * 0.7;
            gl_FragColor = vec4(vColor, alpha);
          }
        `}
      />
    </points>
  );
};

/**
 * Floating shapes distributed across the page
 */
const FloatingShapes = ({ scrollProgressRef }) => {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = time * 0.03;

    // Vertical parallax for shapes
    if (scrollProgressRef) {
      groupRef.current.position.y = scrollProgressRef.current * 15;
    }
  });

  // Create multiple shape clusters at different Y positions
  const shapePositions = useMemo(() => [
    { pos: [5, 8, -8], scale: 0.7, color: '#3b82f6' },
    { pos: [-6, 2, -6], scale: 0.5, color: '#06b6d4' },
    { pos: [4, -5, -7], scale: 0.6, color: '#94a3b8' },
    { pos: [-5, -12, -5], scale: 0.4, color: '#3b82f6' },
    { pos: [6, -18, -8], scale: 0.5, color: '#06b6d4' },
    { pos: [-4, -25, -6], scale: 0.6, color: '#94a3b8' },
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
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const scrollProgressRef = useRef(0);
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
    if (prefersReducedMotion || isMobile) return;
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;
    mousePositionRef.current = { x: x * 0.5, y: y * 0.5 };
  }, [prefersReducedMotion, isMobile]);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgressRef.current = docHeight > 0 ? scrollTop / docHeight : 0;
  }, []);

  useEffect(() => {
    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleMouseMove, handleScroll, isMobile]);

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
