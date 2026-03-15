import { Suspense } from 'react';
import TechIcon from './TechIcon';

/**
 * Container for multiple floating tech icons
 * Strategically places icons around the 3D scene
 */
const FloatingIcons = () => {
  const icons = [
    {
      name: 'react',
      url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      position: [4, 3, -4],
      color: '#61dafb',
      scale: 0.8,
      rotationSpeed: 0.8,
    },
    {
      name: 'nodejs',
      url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
      position: [-5, 2, -6],
      color: '#68a063',
      scale: 0.9,
      rotationSpeed: 1.2,
    },
    {
      name: 'javascript',
      url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
      position: [3, -3, -5],
      color: '#f7df1e',
      scale: 0.7,
      rotationSpeed: 1,
    },
    {
      name: 'python',
      url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      position: [-3, -4, -4],
      color: '#3776ab',
      scale: 0.85,
      rotationSpeed: 0.9,
    },
    {
      name: 'github',
      url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
      position: [0, 5, -8],
      color: '#ffffff',
      scale: 1,
      rotationSpeed: 0.5,
    },
    {
      name: 'supabase',
      url: 'https://www.vectorlogo.zone/logos/supabase/supabase-icon.svg',
      position: [6, 0, -6],
      color: '#3ecf8e',
      scale: 0.75,
      rotationSpeed: 1.1,
    }
  ];

  return (
    <group>
      <Suspense fallback={null}>
        {icons.map((icon) => (
          <TechIcon
            key={icon.name}
            iconUrl={icon.url}
            position={icon.position}
            color={icon.color}
            scale={icon.scale}
            rotationSpeed={icon.rotationSpeed}
          />
        ))}
      </Suspense>
    </group>
  );
};

export default FloatingIcons;
