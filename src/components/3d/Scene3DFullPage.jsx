import { Suspense, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import * as THREE from 'three';
import useReducedMotion from '../../utils/useReducedMotion';

// Particle data generation moved outside to satisfy React 19 purity rules
const generateParticleData = (count) => {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const randoms = new Float32Array(count * 3);

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

    // Sizes for ShaderMaterial (will be multiplied by attenuation)
    sizes[i] = Math.random() * 0.1 + 0.05;

    // Random offsets for individual particle animation
    randoms[i * 3] = Math.random();
    randoms[i * 3 + 1] = Math.random();
    randoms[i * 3 + 2] = Math.random();
  }

  return { positions, colors, sizes, randoms };
};

const PARTICLE_VERTEX_SHADER = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uScroll;
  attribute float size;
  attribute vec3 randoms;
  varying vec3 vColor;

  void main() {
    vColor = color;
    vec3 pos = position;

    // Floating animation on GPU
    float floatX = sin(uTime * 0.2 + randoms.x * 10.0) * 0.15;
    float floatY = cos(uTime * 0.15 + randoms.y * 10.0) * 0.2;
    float floatZ = sin(uTime * 0.18 + randoms.z * 10.0) * 0.1;

    pos.x += floatX + uMouse.x * 0.3;
    pos.y += floatY + uMouse.y * 0.3;
    pos.z += floatZ;

    // Parallax scroll effect
    pos.y += uScroll * 10.0;

    // Continuous rotation
    float angle = uTime * 0.015;
    float s = sin(angle);
    float c = cos(angle);
    float nx = pos.x * c - pos.z * s;
    float nz = pos.x * s + pos.z * c;
    pos.x = nx;
    pos.z = nz;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const PARTICLE_FRAGMENT_SHADER = `
  varying vec3 vColor;
  void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;
    float alpha = smoothstep(0.5, 0.4, dist);
    gl_FragColor = vec4(vColor, alpha * 0.7);
  }
`;

/**
 * Optimized particle field using custom ShaderMaterial for GPU acceleration
 */
const ParticleField = ({ count = 1000, mousePositionRef, scrollProgressRef }) => {
  const mesh = useRef();

  const particles = useMemo(() => generateParticleData(count), [count]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uScroll: { value: 0 }
  }), []);

  useFrame((state) => {
    if (!mesh.current) return;

    // Update uniforms directly in the frame loop without React re-renders
    mesh.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
    if (mousePositionRef.current) {
      mesh.current.material.uniforms.uMouse.value.set(
        mousePositionRef.current.x,
        mousePositionRef.current.y
      );
    }
    if (scrollProgressRef.current !== undefined) {
      mesh.current.material.uniforms.uScroll.value = scrollProgressRef.current;
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
          attach="attributes-size"
          count={count}
          array={particles.sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-randoms"
          count={count}
          array={particles.randoms}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={PARTICLE_VERTEX_SHADER}
        fragmentShader={PARTICLE_FRAGMENT_SHADER}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
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

    // Apply vertical parallax based on scroll
    if (scrollProgressRef.current) {
      groupRef.current.position.y = scrollProgressRef.current * 5;
    }
  });

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
 * Optimized for mobile with reduced particle count and zero-render event handling
 */
const Scene3DFullPage = () => {
  const prefersReducedMotion = useReducedMotion();
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const scrollProgressRef = useRef(0);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
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
