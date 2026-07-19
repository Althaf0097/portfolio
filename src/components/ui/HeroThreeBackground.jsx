import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const HeroThreeBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      500
    );
    camera.position.set(0, 0, 30);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // Mouse tracking
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMouseMove = (e) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // ─── 1. CONSTELLATION NETWORK ───
    const nodeCount = 120;
    const nodePositions = [];
    const spread = 45;

    for (let i = 0; i < nodeCount; i++) {
      nodePositions.push(
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * 20 - 5
      );
    }

    // Nodes (glowing dots)
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.Float32BufferAttribute(nodePositions, 3));

    const dotTexture = (() => {
      const c = document.createElement('canvas');
      c.width = 64;
      c.height = 64;
      const ctx = c.getContext('2d');
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(0.15, 'rgba(255,30,86,0.9)');
      g.addColorStop(0.5, 'rgba(255,30,86,0.2)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    })();

    const nodeMat = new THREE.PointsMaterial({
      size: 0.35,
      map: dotTexture,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const nodes = new THREE.Points(nodeGeo, nodeMat);
    scene.add(nodes);

    // Edges (connecting lines between nearby nodes)
    const maxDist = 7;
    const linePositions = [];
    const lineColors = [];
    const edgePairs = [];

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dx = nodePositions[i * 3] - nodePositions[j * 3];
        const dy = nodePositions[i * 3 + 1] - nodePositions[j * 3 + 1];
        const dz = nodePositions[i * 3 + 2] - nodePositions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < maxDist) {
          linePositions.push(
            nodePositions[i * 3], nodePositions[i * 3 + 1], nodePositions[i * 3 + 2],
            nodePositions[j * 3], nodePositions[j * 3 + 1], nodePositions[j * 3 + 2]
          );

          const alpha = 1 - dist / maxDist;
          // Crimson tinted lines
          lineColors.push(0.8, 0.1 + alpha * 0.1, 0.2 + alpha * 0.1);
          lineColors.push(0.8, 0.1 + alpha * 0.1, 0.2 + alpha * 0.1);

          edgePairs.push({ i, j, dist });
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    lineGeo.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    // ─── 2. AMBIENT DUST PARTICLES ───
    const dustCount = 300;
    const dustPos = new Float32Array(dustCount * 3);
    const dustVelocities = [];

    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 60;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5;
      dustVelocities.push({
        x: (Math.random() - 0.5) * 0.003,
        y: (Math.random() - 0.5) * 0.003,
        z: (Math.random() - 0.5) * 0.001,
      });
    }

    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));

    const dustMat = new THREE.PointsMaterial({
      size: 0.08,
      color: 0xff4d6d,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // ─── 3. THIN ORBITAL RINGS ───
    const ringGroup = new THREE.Group();

    const createRing = (radius, opacity, tilt) => {
      const geo = new THREE.TorusGeometry(radius, 0.015, 16, 120);
      const mat = new THREE.MeshBasicMaterial({
        color: 0xff1e56,
        transparent: true,
        opacity,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = tilt;
      return mesh;
    };

    const ring1 = createRing(14, 0.08, Math.PI * 0.42);
    const ring2 = createRing(18, 0.05, Math.PI * 0.35);
    const ring3 = createRing(11, 0.06, Math.PI * 0.55);
    ringGroup.add(ring1, ring2, ring3);
    scene.add(ringGroup);

    // Resize
    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // Animation
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth mouse
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;

      // Subtle node breathing
      const posAttr = nodeGeo.attributes.position;
      for (let i = 0; i < nodeCount; i++) {
        const baseY = nodePositions[i * 3 + 1];
        posAttr.setY(i, baseY + Math.sin(t * 0.5 + i * 0.3) * 0.15);
      }
      posAttr.needsUpdate = true;

      // Drift dust
      const dAttr = dustGeo.attributes.position;
      for (let i = 0; i < dustCount; i++) {
        let x = dAttr.getX(i) + dustVelocities[i].x;
        let y = dAttr.getY(i) + dustVelocities[i].y;
        let z = dAttr.getZ(i) + dustVelocities[i].z;

        // Wrap around
        if (x > 30) x = -30;
        if (x < -30) x = 30;
        if (y > 30) y = -30;
        if (y < -30) y = 30;

        dAttr.setXYZ(i, x, y, z);
      }
      dAttr.needsUpdate = true;

      // Rotate rings slowly
      ring1.rotation.z = t * 0.03;
      ring2.rotation.z = -t * 0.02;
      ring3.rotation.z = t * 0.015;
      ringGroup.rotation.y = mouse.x * 0.15;
      ringGroup.rotation.x = mouse.y * 0.1;

      // Whole constellation sways gently with mouse
      nodes.rotation.y = mouse.x * 0.08;
      nodes.rotation.x = mouse.y * 0.05;
      lines.rotation.y = mouse.x * 0.08;
      lines.rotation.x = mouse.y * 0.05;

      // Camera subtle drift
      camera.position.x = mouse.x * 1.5;
      camera.position.y = mouse.y * 1.0;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);

      nodeGeo.dispose();
      nodeMat.dispose();
      dotTexture.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      ring1.geometry.dispose();
      ring1.material.dispose();
      ring2.geometry.dispose();
      ring2.material.dispose();
      ring3.geometry.dispose();
      ring3.material.dispose();
      renderer.dispose();

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-screen h-screen pointer-events-none overflow-hidden z-0"
      style={{ opacity: 0.9 }}
    />
  );
};

export default HeroThreeBackground;
