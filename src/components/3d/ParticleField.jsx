import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  attribute float aSize;
  attribute vec3 aRandom;
  varying vec3 vColor;

  void main() {
    vColor = color;

    vec3 pos = position;

    // Base floating motion using random offsets per particle
    float floatX = sin(uTime * 0.3 + aRandom.x * 10.0) * 0.1;
    float floatY = cos(uTime * 0.2 + aRandom.y * 15.0) * 0.15;
    float floatZ = sin(uTime * 0.25 + aRandom.z * 12.0) * 0.08;

    pos.x += floatX + uMouse.x * 0.5;
    pos.y += floatY + uMouse.y * 0.5;
    pos.z += floatZ;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying vec3 vColor;

  void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;

    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    gl_FragColor = vec4(vColor, alpha * 0.8);
  }
`;

const getRandom = () => Math.random();

/**
 * Animated particle field background
 * Optimized with GPU shaders for performance
 */
const ParticleField = ({ count = 800, mousePosition }) => {
  const mesh = useRef();
  const materialRef = useRef();

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const randoms = new Float32Array(count * 3);

    const accentColor = new THREE.Color('#6366f1');
    const cyanColor = new THREE.Color('#22d3ee');
    const whiteColor = new THREE.Color('#ffffff');

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (getRandom() - 0.5) * 20;
      positions[i * 3 + 1] = (getRandom() - 0.5) * 20;
      positions[i * 3 + 2] = (getRandom() - 0.5) * 15;

      const colorChoice = getRandom();
      let color = whiteColor;
      if (colorChoice < 0.4) color = accentColor;
      else if (colorChoice < 0.7) color = cyanColor;

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = getRandom() * 0.08 + 0.02;

      randoms[i * 3] = getRandom();
      randoms[i * 3 + 1] = getRandom();
      randoms[i * 3 + 2] = getRandom();
    }

    return { positions, colors, sizes, randoms };
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
      mesh.current.rotation.y = time * 0.02;
      mesh.current.rotation.x = time * 0.01;
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
          attach="attributes-aSize"
          count={count}
          array={particles.sizes}
          itemSize={1}
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

export default ParticleField;
