import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Helper to generate random data outside of the component for React 19 purity
 */
const generateParticleData = (count) => {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const randoms = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  // Theme colors
  const accentColor = new THREE.Color('#2563eb'); // blue-600
  const blueColor = new THREE.Color('#06b6d4'); // cyan-400
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
      color = blueColor;
    } else {
      color = whiteColor;
    }

    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;

    randoms[i * 3] = Math.random();
    randoms[i * 3 + 1] = Math.random();
    randoms[i * 3 + 2] = Math.random();
    sizes[i] = Math.random() * 0.08 + 0.02;
  }

  return { positions, colors, randoms, sizes };
};

/**
 * Animated particle field background
 * Creates a field of glowing particles with subtle mouse-reactive movement
 */
const ParticleField = ({ count = 800, mousePosition }) => {
  const mesh = useRef();
  const material = useRef();

  // Generate random particle positions
  const particles = useMemo(() => generateParticleData(count), [count]);

  // Animate particles
  useFrame((state) => {
    if (!material.current) return;
    material.current.uniforms.uTime.value = state.clock.getElapsedTime();
    material.current.uniforms.uMouse.value.set(
      mousePosition?.x || 0,
      mousePosition?.y || 0
    );
  });

  const shaderArgs = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    },
    vertexShader: `
      uniform float uTime;
      uniform vec2 uMouse;
      attribute float size;
      attribute vec3 randoms;
      varying vec3 vColor;

      void main() {
        vColor = color;
        vec3 pos = position;

        // Base floating motion
        float floatX = sin(uTime * 0.3 + randoms.x * 10.0) * 0.1;
        float floatY = cos(uTime * 0.2 + randoms.y * 10.0) * 0.15;
        float floatZ = sin(uTime * 0.25 + randoms.z * 10.0) * 0.08;

        // Apply motion and mouse influence
        pos.x += floatX + uMouse.x * 0.5;
        pos.y += floatY + uMouse.y * 0.5;
        pos.z += floatZ;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        // Distance-based point sizing
        gl_PointSize = size * (300.0 / -mvPosition.z);
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      void main() {
        float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
        float strength = 0.05 / distanceToCenter - 0.1;
        gl_FragColor = vec4(vColor, strength);
      }
    `
  }), []);

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
          attach="attributes-randoms"
          count={count}
          array={particles.randoms}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={particles.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        args={[shaderArgs]}
        transparent
        vertexColors
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export default ParticleField;
