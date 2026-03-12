import { Suspense, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import * as THREE from 'three';
import useReducedMotion from '../../utils/useReducedMotion';

const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  attribute vec3 aRandom;
  varying vec3 vColor;

  void main() {
    vColor = color;
    vec3 pos = position;

    float floatX = sin(uTime * 0.2 + aRandom.x * 10.0) * 0.15;
    float floatY = cos(uTime * 0.15 + aRandom.y * 15.0) * 0.2;
    float floatZ = sin(uTime * 0.18 + aRandom.z * 12.0) * 0.1;

    pos.x += floatX + uMouse.x * 0.3;
    pos.y += floatY + uMouse.y * 0.3;
    pos.z += floatZ;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = 0.04 * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    gl_FragColor = vec4(vColor, alpha * 0.7);
  }
`;

const getRandom = () => Math.random();

/**
 * Enhanced particle field that covers the entire viewport
 * Optimized with GPU shaders
 */
const ParticleField = ({ count = 1000, mousePosition }) => {
  const mesh = useRef();
  const materialRef = useRef();

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 3);

    const accentColor = new THREE.Color('#6366f1');
    const cyanColor = new THREE.Color('#22d3ee');
    const whiteColor = new THREE.Color('#ffffff');

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (getRandom() - 0.5) * 30;
      positions[i * 3 + 1] = (getRandom() - 0.5) * 60;
      positions[i * 3 + 2] = (getRandom() - 0.5) * 20;

      const colorChoice = getRandom();
      let color = whiteColor;
      if (colorChoice < 0.4) color = accentColor;
      else if (colorChoice < 0.7) color = cyanColor;

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      randoms[i * 3] = getRandom();
      randoms[i * 3 + 1] = getRandom();
      randoms[i * 3 + 2] = getRandom();
    }

    return { positions, colors, randoms };
  }, [count]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) }
  }), []);

  useFrame((state) => {
    if (!materialRef.current) return;
    const time = state.clock.getElapsedTime();
    materialRef.current.uniforms.uTime.value = time;
    materialRef.current.uniforms.uMouse.value.set(
      mousePosition.current?.x || 0,
      mousePosition.current?.y || 0
    );
    if (mesh.current) {
      mesh.current.rotation.y = time * 0.015;
    }
  });

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
          attach="attributes-aRandom"
          count={count}
          array={particles.randoms}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
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
