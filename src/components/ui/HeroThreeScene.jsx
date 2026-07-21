import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';

// Static helper function to generate particle positions deterministically/safely for React 19
const generatePositions = (count) => {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }
  return positions;
};

// Procedural Metallic Liquid Mesh component
const MetallicObject = ({ mouse }) => {
  const meshRef = useRef();
  const materialRef = useRef();

  // Gentle float & slow orbital rotation
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.15 + mouse.current.x * 0.3;
      meshRef.current.rotation.x = t * 0.08 + mouse.current.y * 0.2;
      meshRef.current.position.y = Math.sin(t * 1.5) * 0.15;
    }

    // Pass time and displacement value into custom shader uniforms
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;
      materialRef.current.uniforms.uMouse.value.lerp(
        new THREE.Vector2(mouse.current.x, mouse.current.y),
        0.05
      );
    }
  });

  // Custom Shader Material code for procedurally undulating liquid geometry
  const customShader = {
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColor1: { value: new THREE.Color('#4F8CFF') },
      uColor2: { value: new THREE.Color('#7EF9FF') },
    },
    vertexShader: `
      uniform float uTime;
      uniform vec2 uMouse;
      varying vec3 vNormal;
      varying vec3 vViewPosition;

      // Simple 3D noise approximation function
      float hash(vec3 p) {
        p = fract(p * 0.3183099 + .1);
        p *= 17.0;
        return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
      }
      float noise(vec3 x) {
        vec3 i = floor(x);
        vec3 f = fract(x);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
              mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
          mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
              mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z
        );
      }

      void main() {
        vNormal = normalize(normalMatrix * normal);
        
        // Procedural displacement wave offsets using noise + time
        float displacement = noise(position * 1.5 + uTime * 0.8) * 0.45;
        displacement += sin(position.y * 3.0 + uTime * 2.0) * 0.15;
        
        vec3 displacedPosition = position + normal * displacement;
        
        vec4 modelViewPosition = modelViewMatrix * vec4(displacedPosition, 1.0);
        vViewPosition = -modelViewPosition.xyz;
        
        gl_Position = projectionMatrix * modelViewPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec2 uMouse;
      varying vec3 vNormal;
      varying vec3 vViewPosition;

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        
        // Fresnal edge highlight calculation
        float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.5);
        
        // Dynamic metallic color mix based on fresnel and cursor
        vec3 baseColor = mix(uColor1, uColor2, fresnel + length(uMouse) * 0.15);
        
        // High specularity highlights
        vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
        vec3 halfDir = normalize(lightDir + viewDir);
        float spec = pow(max(dot(normal, halfDir), 0.0), 64.0);
        
        vec3 finalColor = baseColor + vec3(spec * 0.8) + fresnel * uColor2 * 0.5;
        
        gl_FragColor = vec4(finalColor, 0.95);
      }
    `,
  };

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <sphereGeometry args={[2, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={customShader.vertexShader}
        fragmentShader={customShader.fragmentShader}
        uniforms={customShader.uniforms}
        transparent
      />
    </mesh>
  );
};

// Particles component floating in background
const FloatingParticles = ({ count = 300 }) => {
  const pointsRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.02;
      pointsRef.current.rotation.x = t * 0.01;
    }
  });

  const positions = useMemo(() => generatePositions(count), [count]);

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#7EF9FF"
        map={texture}
        transparent
        opacity={0.65}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Camera adjustment controller
const CameraController = ({ mouse }) => {
  useFrame((state) => {
    const camera = state.camera;
    // Lerp camera position based on mouse position to create interactive depth
    camera.position.x += (mouse.current.x * 2.0 - camera.position.x) * 0.05;
    camera.position.y += (-mouse.current.y * 1.5 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });
  return null;
};

const HeroThreeScene = () => {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="w-full h-full absolute inset-0 z-0 select-none pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#4F8CFF" />
        <pointLight position={[-5, -5, -5]} intensity={0.8} color="#7EF9FF" />

        <MetallicObject mouse={mouse} />
        <FloatingParticles count={250} />
        <CameraController mouse={mouse} />
      </Canvas>
    </div>
  );
};

export default HeroThreeScene;
