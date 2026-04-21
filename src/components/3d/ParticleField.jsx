import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const generateParticlesData = (count) => {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const randoms = new Float32Array(count * 3);

  const accentColor = new THREE.Color('#2563eb');
  const blueColor = new THREE.Color('#06b6d4');
  const whiteColor = new THREE.Color('#ffffff');

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 15;

    const colorChoice = Math.random();
    let color;
    if (colorChoice < 0.4) color = accentColor;
    else if (colorChoice < 0.7) color = blueColor;
    else color = whiteColor;

    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;

    randoms[i * 3] = Math.random();
    randoms[i * 3 + 1] = Math.random();
    randoms[i * 3 + 2] = Math.random();
  }

  return { positions, colors, randoms };
};

const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  attribute vec3 aRandom;
  varying vec3 vColor;

  void main() {
    vColor = color;
    vec3 pos = position;

    float floatX = sin(uTime * 0.3 + aRandom.x * 10.0) * 0.1;
    float floatY = cos(uTime * 0.2 + aRandom.y * 15.0) * 0.15;
    float floatZ = sin(uTime * 0.25 + aRandom.z * 12.0) * 0.08;

    pos.x += floatX + uMouse.x * 0.5;
    pos.y += floatY + uMouse.y * 0.5;
    pos.z += floatZ;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    float s = sin(uTime * 0.02);
    float c = cos(uTime * 0.02);
    mat2 rot = mat2(c, -s, s, c);
    mvPosition.xz = rot * mvPosition.xz;

    float s2 = sin(uTime * 0.01);
    float c2 = cos(uTime * 0.01);
    mat2 rot2 = mat2(c2, -s2, s2, c2);
    mvPosition.xy = rot2 * mvPosition.xy;

    gl_PointSize = 5.0 * (1.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  void main() {
    float r = distance(gl_PointCoord, vec2(0.5));
    if (r > 0.5) discard;
    gl_FragColor = vec4(vColor, 0.8 * (1.0 - r * 2.0));
  }
`;

/**
 * Optimized Animated particle field background
 */
const ParticleField = ({ count = 800, mousePosition }) => {
  const materialRef = useRef();
  const particles = useMemo(() => generateParticlesData(count), [count]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) }
  }), []);

  useFrame((state) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    materialRef.current.uniforms.uMouse.value.set(
      mousePosition?.x || 0,
      mousePosition?.y || 0
    );
  });

  return (
    <points>
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
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        vertexColors
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export default ParticleField;
