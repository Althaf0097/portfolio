import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Data generation outside of component to satisfy React 19 purity rules
const generateParticleData = (count) => {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const offsets = new Float32Array(count * 3);

  const accentColor = new THREE.Color('#2563eb');
  const blueColor = new THREE.Color('#06b6d4');
  const whiteColor = new THREE.Color('#ffffff');

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 15;

    const colorChoice = Math.random();
    const color = colorChoice < 0.4 ? accentColor : colorChoice < 0.7 ? blueColor : whiteColor;

    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;

    sizes[i] = Math.random() * 0.08 + 0.02;
    offsets[i * 3] = Math.random() * 100;
    offsets[i * 3 + 1] = Math.random() * 100;
    offsets[i * 3 + 2] = Math.random() * 100;
  }

  return { positions, colors, sizes, offsets };
};

/**
 * Animated particle field background
 * Creates a field of glowing particles with subtle mouse-reactive movement
 */
const ParticleField = ({ count = 800, mousePositionRef }) => {
  const mesh = useRef();
  const materialRef = useRef();

  const particles = useMemo(() => generateParticleData(count), [count]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) }
  }), []);

  useFrame((state) => {
    if (!mesh.current || !materialRef.current) return;
    const time = state.clock.getElapsedTime();
    materialRef.current.uniforms.uTime.value = time;
    materialRef.current.uniforms.uMouse.value.set(
      mousePositionRef.current?.x || 0,
      mousePositionRef.current?.y || 0
    );
    mesh.current.rotation.y = time * 0.02;
    mesh.current.rotation.x = time * 0.01;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={particles.positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={particles.colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={count} array={particles.sizes} itemSize={1} />
        <bufferAttribute attach="attributes-offset" count={count} array={particles.offsets} itemSize={3} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        transparent
        vertexColors
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        vertexShader={`
          uniform float uTime;
          uniform vec2 uMouse;
          attribute float size;
          attribute vec3 offset;
          varying vec3 vColor;
          void main() {
            vColor = color;
            vec3 pos = position;

            float floatX = sin(uTime * 0.3 + offset.x) * 0.1;
            float floatY = cos(uTime * 0.2 + offset.y) * 0.15;
            float floatZ = sin(uTime * 0.25 + offset.z) * 0.08;

            pos.x += floatX + uMouse.x * 0.5;
            pos.y += floatY + uMouse.y * 0.5;
            pos.z += floatZ;

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying vec3 vColor;
          void main() {
            float dist = distance(gl_PointCoord, vec2(0.5));
            if (dist > 0.5) discard;
            float alpha = smoothstep(0.5, 0.2, dist) * 0.8;
            gl_FragColor = vec4(vColor, alpha);
          }
        `}
      />
    </points>
  );
};

export default ParticleField;
