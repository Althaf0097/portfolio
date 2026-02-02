import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Icosahedron, Octahedron, MeshDistortMaterial } from '@react-three/drei';

/**
 * Floating geometric shapes with subtle animation
 * Adds depth and visual interest to the 3D scene
 */
const FloatingShapes = () => {
  const group = useRef();
  const shape1 = useRef();
  const shape2 = useRef();
  const shape3 = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Gentle group rotation
    if (group.current) {
      group.current.rotation.y = time * 0.05;
    }

    // Individual shape animations
    if (shape1.current) {
      shape1.current.rotation.x = time * 0.3;
      shape1.current.rotation.z = time * 0.2;
      shape1.current.position.y = Math.sin(time * 0.5) * 0.3 + 2;
    }

    if (shape2.current) {
      shape2.current.rotation.y = time * 0.4;
      shape2.current.rotation.x = time * 0.15;
      shape2.current.position.y = Math.cos(time * 0.4) * 0.4 - 1.5;
    }

    if (shape3.current) {
      shape3.current.rotation.z = time * 0.25;
      shape3.current.rotation.y = time * 0.35;
      shape3.current.position.x = Math.sin(time * 0.3) * 0.2 - 3;
    }
  });

  return (
    <group ref={group}>
      {/* Primary accent shape - top right */}
      <Icosahedron ref={shape1} args={[0.8, 1]} position={[4, 2, -5]}>
        <MeshDistortMaterial
          color="#6366f1"
          emissive="#6366f1"
          emissiveIntensity={0.3}
          transparent
          opacity={0.6}
          wireframe
          distort={0.2}
          speed={2}
        />
      </Icosahedron>

      {/* Cyan shape - bottom left */}
      <Octahedron ref={shape2} args={[0.6, 0]} position={[-5, -1.5, -4]}>
        <MeshDistortMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={0.4}
          transparent
          opacity={0.5}
          wireframe
          distort={0.15}
          speed={1.5}
        />
      </Octahedron>

      {/* Small accent shape - left */}
      <Icosahedron ref={shape3} args={[0.4, 1]} position={[-3, 1, -3]}>
        <MeshDistortMaterial
          color="#818cf8"
          emissive="#818cf8"
          emissiveIntensity={0.25}
          transparent
          opacity={0.4}
          wireframe
          distort={0.1}
          speed={2.5}
        />
      </Icosahedron>
    </group>
  );
};

export default FloatingShapes;
