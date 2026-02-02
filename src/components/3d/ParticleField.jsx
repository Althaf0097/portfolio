import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Animated particle field background
 * Creates a field of glowing particles with subtle mouse-reactive movement
 */
const ParticleField = ({ count = 800, mousePosition }) => {
  const mesh = useRef();
  const light = useRef();

  // Generate random particle positions
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    // Theme colors
    const accentColor = new THREE.Color('#6366f1'); // accent-500
    const cyanColor = new THREE.Color('#22d3ee'); // cyan-400
    const whiteColor = new THREE.Color('#ffffff');

    for (let i = 0; i < count; i++) {
      // Spread particles in 3D space
      positions[i * 3] = (Math.random() - 0.5) * 20; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15; // z

      // Random colors from palette
      const colorChoice = Math.random();
      let color;
      if (colorChoice < 0.4) {
        color = accentColor;
      } else if (colorChoice < 0.7) {
        color = cyanColor;
      } else {
        color = whiteColor;
      }

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // Random sizes
      sizes[i] = Math.random() * 0.08 + 0.02;
    }

    return { positions, colors, sizes };
  }, [count]);

  // Initial positions for animation reference
  const initialPositions = useMemo(
    () => new Float32Array(particles.positions),
    [particles.positions]
  );

  // Animate particles
  useFrame((state) => {
    if (!mesh.current) return;

    const time = state.clock.getElapsedTime();
    const positions = mesh.current.geometry.attributes.position.array;

    // Mouse influence (subtle parallax)
    const mouseX = mousePosition?.x || 0;
    const mouseY = mousePosition?.y || 0;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Base floating motion
      const floatX = Math.sin(time * 0.3 + i * 0.1) * 0.1;
      const floatY = Math.cos(time * 0.2 + i * 0.15) * 0.15;
      const floatZ = Math.sin(time * 0.25 + i * 0.12) * 0.08;

      // Apply motion
      positions[i3] = initialPositions[i3] + floatX + mouseX * 0.5;
      positions[i3 + 1] = initialPositions[i3 + 1] + floatY + mouseY * 0.5;
      positions[i3 + 2] = initialPositions[i3 + 2] + floatZ;
    }

    mesh.current.geometry.attributes.position.needsUpdate = true;

    // Rotate entire field slowly
    mesh.current.rotation.y = time * 0.02;
    mesh.current.rotation.x = time * 0.01;
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
