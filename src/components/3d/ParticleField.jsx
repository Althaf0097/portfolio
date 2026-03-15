import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { generateLegacyParticleData } from '../../utils/helpers/random';

/**
 * Animated particle field background
 * Creates a field of glowing particles with subtle mouse-reactive movement
 */
const ParticleField = ({ count = 800, mousePosition }) => {
  const mesh = useRef();
  const material = useRef();

  // Generate random particle positions
  const particles = useMemo(() => {
    const data = generateLegacyParticleData(count);
    const indices = new Float32Array(count);
    for (let i = 0; i < count; i++) indices[i] = i;
    return { ...data, indices };
  }, [count]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
  }), []);

  useFrame((state) => {
    if (!mesh.current || !material.current) return;
    const time = state.clock.getElapsedTime();
    material.current.uniforms.uTime.value = time;
    material.current.uniforms.uMouse.value.set(
      mousePosition?.x || 0,
      mousePosition?.y || 0
    );
    mesh.current.rotation.y = time * 0.02;
    mesh.current.rotation.x = time * 0.01;
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

      float floatX = sin(uTime * 0.3 + aIndex * 0.1) * 0.1;
      float floatY = cos(uTime * 0.2 + aIndex * 0.15) * 0.15;
      float floatZ = sin(uTime * 0.25 + aIndex * 0.12) * 0.08;

      pos.x += floatX + uMouse.x * 0.5;
      pos.y += floatY + uMouse.y * 0.5;
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
      gl_FragColor = vec4(vColor, 0.8);
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

export default ParticleField;
