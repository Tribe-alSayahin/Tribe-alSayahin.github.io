/**
 * خلفية صحراوية سينمائية خفيرة الأداء للهوية البصرية.
 * تُستخدم داخل Hero فقط، ولا تؤثر على باقي الأقسام.
 */
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function DesertCinematicBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / Math.max(height, 1), 0.1, 60);
    camera.position.set(0, 0.4, 3.6);

    scene.add(new THREE.AmbientLight(0xffffff, 0.35));

    const sun = new THREE.DirectionalLight(0xc9a24b, 0.85);
    sun.position.set(2, 3, 2);
    scene.add(sun);

    const glowGeo = new THREE.CircleGeometry(3.0, 48);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xc9a24b, transparent: true, opacity: 0.18 });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.position.set(0, 1.0, -4);
    scene.add(glow);

    const duneGeo = new THREE.SphereGeometry(2.6, 36, 24);
    const duneMat = new THREE.MeshStandardMaterial({ color: 0x1c241e, roughness: 0.9, metalness: 0, flatShading: true });
    const dune = new THREE.Mesh(duneGeo, duneMat);
    dune.rotation.x = -Math.PI / 2.2;
    dune.position.set(0, -1.2, -2);
    scene.add(dune);

    const count = 90;
    const positions = new Float32Array(count * 3);
    const velocities: number[] = [];
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = Math.random() * 2.5 - 0.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4 - 1.5;
      velocities.push(Math.random() * 0.15 + 0.05);
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const dustMat = new THREE.PointsMaterial({ color: 0xe9d197, size: 0.025, transparent: true, opacity: 0.55 });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    const starCount = 180;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 60 + Math.random() * 60;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.5;
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.cos(phi) + 10;
      starPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) - 20;
    }
    const starsGeo = new THREE.BufferGeometry();
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.07, transparent: true, opacity: 0.8 });
    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    let raf = 0;
    const clock = new THREE.Clock();
    function animate() {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      dune.position.y = -1.2 + Math.sin(t * 0.25) * 0.2;
      dune.rotation.y = t * 0.02;

      glowMat.opacity = Math.sin(t * 0.4) * 0.04 + 0.18;

      const pos = dust.geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        pos[i * 3] += velocities[i];
        if (pos[i * 3] > 6) pos[i * 3] = -6;
      }
      dust.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    }

    animate();

    const onResize = () => {
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 600;
      renderer.setSize(w, h);
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 -z-10" aria-hidden="true" />;
}
