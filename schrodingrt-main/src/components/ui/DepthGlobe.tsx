import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * DepthGlobe — particle-based 3-D globe.
 * Samples the earth-blue-marble texture: land pixels get dense particles,
 * ocean pixels are rejected. Atmospheric scatter adds floating particles
 * above the surface. Drag to rotate; auto-spins when idle.
 */
export default function DepthGlobe({
  width = '100%',
  height = '100%',
}: {
  width?: string;
  height?: string;
}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth || 480;
    const H = mount.clientHeight || 480;

    /* ── Renderer ─────────────────────────────────── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    /* ── Camera ───────────────────────────────────── */
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
    camera.position.z = 3.4;

    /* ── Scene ────────────────────────────────────── */
    const scene = new THREE.Scene();
    const group = new THREE.Group();
    scene.add(group);

    /* ── Interaction state ────────────────────────── */
    let rafId: number;
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    let velX = 0;
    let velY = 0;

    /* ── Build particles from image data ──────────── */
    const buildScene = (imgData: ImageData | null) => {
      const R = 1.0;
      const SAMPLES = 120_000; // attempts
      const LAND_TARGET = 70_000;
      const ATM_TOTAL = 6_000;

      const landPos: number[] = [];
      const landCol: number[] = [];
      const atmPos: number[] = [];
      const atmCol: number[] = [];

      let landCount = 0;

      for (let i = 0; i < SAMPLES && landCount < LAND_TARGET; i++) {
        // Uniform sphere sampling
        const u = Math.random();
        const v = Math.random();
        const phi   = Math.acos(1 - 2 * u);   // polar   0 → π
        const theta = v * Math.PI * 2;          // azimuth 0 → 2π

        let accept = true;
        let brightness = 0.5;

        if (imgData) {
          // Equirectangular UV
          const uv = theta / (Math.PI * 2);        // 0-1
          const vv = phi   / Math.PI;              // 0-1

          const px = Math.floor(uv * imgData.width)  % imgData.width;
          const py = Math.floor(vv * imgData.height) % imgData.height;
          const idx = (py * imgData.width + px) * 4;

          const r = imgData.data[idx];
          const g = imgData.data[idx + 1];
          const b = imgData.data[idx + 2];

          // Blue-marble: ocean is very blue, land is brownish/green/white
          // Land test: not dominated by blue
          const isLand = (r + g) / 2 > b * 0.78 && (r + g + b) > 60;
          accept = isLand;
          brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
        }

        if (!accept) continue;

        // Surface position + tiny jitter for "scatter from surface" look
        const jitter = 0.008;
        const scatter = Math.random() * 0.018;
        const rr = R + scatter;
        const x = rr * Math.sin(phi) * Math.cos(theta) + (Math.random() - 0.5) * jitter;
        const y = rr * Math.cos(phi)                   + (Math.random() - 0.5) * jitter;
        const z = rr * Math.sin(phi) * Math.sin(theta) + (Math.random() - 0.5) * jitter;

        landPos.push(x, y, z);

        // Particle colour: muted grey / light grey depending on brightness
        const base = 0.28 + brightness * 0.45;
        const noise = (Math.random() - 0.5) * 0.12;
        const c = Math.min(1, Math.max(0, base + noise));
        landCol.push(c, c, c);

        landCount++;
      }

      /* Land particles */
      {
        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.Float32BufferAttribute(landPos, 3));
        geom.setAttribute('color',    new THREE.Float32BufferAttribute(landCol, 3));

        const mat = new THREE.PointsMaterial({
          size: 0.007,
          vertexColors: true,
          transparent: true,
          opacity: 0.88,
          sizeAttenuation: true,
          depthWrite: false,
        });

        group.add(new THREE.Points(geom, mat));
      }

      /* Atmospheric scatter — particles floating above surface */
      for (let i = 0; i < ATM_TOTAL; i++) {
        const phi   = Math.random() * Math.PI;
        const theta = Math.random() * Math.PI * 2;
        const rr = R + 0.04 + Math.random() * 0.18;

        atmPos.push(
          rr * Math.sin(phi) * Math.cos(theta),
          rr * Math.cos(phi),
          rr * Math.sin(phi) * Math.sin(theta),
        );

        const c = 0.04 + Math.random() * 0.22;
        atmCol.push(c, c, c);
      }

      {
        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.Float32BufferAttribute(atmPos, 3));
        geom.setAttribute('color',    new THREE.Float32BufferAttribute(atmCol, 3));

        const mat = new THREE.PointsMaterial({
          size: 0.004,
          vertexColors: true,
          transparent: true,
          opacity: 0.35,
          sizeAttenuation: true,
          depthWrite: false,
        });

        group.add(new THREE.Points(geom, mat));
      }

      /* Dark sphere core — gives the solid "ball" under-layer */
      {
        const geom = new THREE.SphereGeometry(R * 0.995, 64, 64);
        const mat  = new THREE.MeshBasicMaterial({ color: 0x050505 });
        group.add(new THREE.Mesh(geom, mat));
      }
    };

    /* ── Load earth texture ───────────────────────── */
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width  = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        buildScene(imageData);
      } catch {
        buildScene(null);
      }
    };

    img.onerror = () => buildScene(null);

    // unpkg has CORS headers; blue-marble gives land vs ocean distinction
    img.src = 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg';

    /* ── Animation loop ───────────────────────────── */
    const animate = () => {
      rafId = requestAnimationFrame(animate);

      if (!isDragging) {
        group.rotation.y += 0.0012 + velY * 0.6;
        group.rotation.x += velX * 0.6;
        velY *= 0.92;
        velX *= 0.92;
      }

      renderer.render(scene, camera);
    };
    animate();

    /* ── Interaction ──────────────────────────────── */
    const el = renderer.domElement;

    const onDown = (e: MouseEvent) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      velX = velY = 0;
      el.style.cursor = 'grabbing';
    };
    const onMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      velY = dx * 0.004;
      velX = dy * 0.004;
      group.rotation.y += dx * 0.004;
      group.rotation.x = Math.max(-1.0, Math.min(1.0, group.rotation.x + dy * 0.004));
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onUp = () => { isDragging = false; el.style.cursor = 'grab'; };

    el.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    /* Touch */
    const onTDown  = (e: TouchEvent) => { isDragging = true;  lastX = e.touches[0].clientX; lastY = e.touches[0].clientY; velX = velY = 0; };
    const onTMove  = (e: TouchEvent) => {
      if (!isDragging) return;
      const dx = e.touches[0].clientX - lastX;
      const dy = e.touches[0].clientY - lastY;
      velY = dx * 0.004; velX = dy * 0.004;
      group.rotation.y += dx * 0.004;
      group.rotation.x = Math.max(-1.0, Math.min(1.0, group.rotation.x + dy * 0.004));
      lastX = e.touches[0].clientX; lastY = e.touches[0].clientY;
    };
    const onTUp = () => { isDragging = false; };

    el.addEventListener('touchstart',  onTDown, { passive: true });
    window.addEventListener('touchmove', onTMove, { passive: true });
    window.addEventListener('touchend',  onTUp);

    /* ── Cleanup ──────────────────────────────────── */
    return () => {
      cancelAnimationFrame(rafId);
      el.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      el.removeEventListener('touchstart', onTDown);
      window.removeEventListener('touchmove', onTMove);
      window.removeEventListener('touchend', onTUp);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ width, height, cursor: 'grab', userSelect: 'none' }}
    />
  );
}
