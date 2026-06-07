import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const generateParticles = (count) => {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  const accentColor = new THREE.Color('#2563eb');
  const blueColor = new THREE.Color('#06b6d4');
  const whiteColor = new THREE.Color('#ffffff');

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 60; // Extended for scroll
    positions[i * 3 + 2] = (Math.random() - 0.5) * 15;

    const colorChoice = Math.random();
    let color;
    if (colorChoice < 0.4) color = accentColor;
    else if (colorChoice < 0.7) color = blueColor;
    else color = whiteColor;

    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;

    sizes[i] = Math.random() * 0.08 + 0.02;
  }

  return { positions, colors, sizes };
};

/**
 * Animated particle field background
 * Optimized for performance using refs for mouse and scroll tracking
 */
const ParticleField = ({ count = 800, mousePositionRef, scrollProgressRef }) => {
  const mesh = useRef();

  const particles = useMemo(() => generateParticles(count), [count]);

  const initialPositions = useMemo(
    () => new Float32Array(particles.positions),
    [particles.positions]
  );

  useFrame((state) => {
    if (!mesh.current) return;

    const time = state.clock.getElapsedTime();
    const positions = mesh.current.geometry.attributes.position.array;

    const mouseX = mousePositionRef?.current?.x || 0;
    const mouseY = mousePositionRef?.current?.y || 0;
    const scrollY = scrollProgressRef?.current || 0;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      const floatX = Math.sin(time * 0.3 + i * 0.1) * 0.1;
      const floatY = Math.cos(time * 0.2 + i * 0.15) * 0.15;
      const floatZ = Math.sin(time * 0.25 + i * 0.12) * 0.08;

      positions[i3] = initialPositions[i3] + floatX + mouseX * 0.5;
      // Apply scroll parallax to Y position
      positions[i3 + 1] = initialPositions[i3 + 1] + floatY + mouseY * 0.5 + scrollY * 20;
      positions[i3 + 2] = initialPositions[i3 + 2] + floatZ;
    }

    mesh.current.geometry.attributes.position.needsUpdate = true;
    mesh.current.rotation.y = time * 0.02;
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
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export default ParticleField;
