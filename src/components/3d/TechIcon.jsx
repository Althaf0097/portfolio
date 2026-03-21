import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Decal, useTexture } from '@react-three/drei';

/**
 * Individual 3D icon component
 * Renders a floating shape with a technology logo decal
 */
const TechIcon = ({ 
  iconUrl, 
  position = [0, 0, 0], 
  color = "#22c55e", 
  scale = 1,
  rotationSpeed = 1
}) => {
  const meshRef = useRef();
  
  // Load texture from URL (e.g., Devicon)
  const texture = useTexture(iconUrl);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Additional subtle rotation beyond the Float component
    meshRef.current.rotation.y = time * 0.2 * rotationSpeed;
    meshRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;
  });

  return (
    <Float
      speed={1.5 * rotationSpeed} 
      rotationIntensity={1} 
      floatIntensity={2}
      position={position}
    >
      <mesh ref={meshRef} scale={scale}>
        {/* Hacker-style geometric base */}
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial 
          color="#060606"
          emissive={color}
          emissiveIntensity={0.2}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.9}
        />
        
        {/* The Icon Decal */}
        <Decal
          position={[0, 0, 0.4]} // Slightly offset from center to sit on front face
          rotation={[0, 0, 0]}
          scale={[0.6, 0.6, 0.6]}
          map={texture}
        />
        
        {/* Backside decal for visibility when rotating */}
        <Decal
          position={[0, 0, -0.4]}
          rotation={[0, Math.PI, 0]}
          scale={[0.6, 0.6, 0.6]}
          map={texture}
        />
        
        {/* Selection glow effect */}
        <pointLight intensity={0.5} distance={2} color={color} />
      </mesh>
    </Float>
  );
};

export default TechIcon;
