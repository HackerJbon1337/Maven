import { useEffect, useRef } from 'react';
import createGlobe, { type COBEOptions } from 'cobe';

const MARKERS: COBEOptions['markers'] = [
  { location: [1.3521,  103.8198], size: 0.07 },
  { location: [31.2304, 121.4737], size: 0.06 },
  { location: [51.5074,  -0.1278], size: 0.06 },
  { location: [25.2048,  55.2708], size: 0.05 },
  { location: [37.7749,-122.4194], size: 0.06 },
  { location: [40.7128, -74.0060], size: 0.06 },
  { location: [-33.868,  151.209], size: 0.05 },
  { location: [22.3193, 114.169],  size: 0.06 },
  { location: [48.8566,   2.352],  size: 0.05 },
  { location: [35.6762, 139.650],  size: 0.05 },
  { location: [6.5244,    3.379],  size: 0.04 },
  { location: [-23.550,  -46.63],  size: 0.05 },
  { location: [55.7558,  37.617],  size: 0.05 },
  { location: [13.7563, 100.501],  size: 0.05 },
];

/**
 * Pure monochromatic globe — grey earth, white markers, white glow.
 * Uses window.innerWidth for sizing (fixed containers have offsetWidth=0).
 */
export default function CobeMavenGlobe() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const phiRef     = useRef(1.8);
  const rRef       = useRef(0);
  const pointerRef = useRef<number | null>(null);
  const lastXRef   = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const s = Math.max(window.innerWidth, window.innerHeight) * 1.3;

    const globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(window.devicePixelRatio, 2),
      width:          s,
      height:         s,
      phi:            phiRef.current,
      theta:          0.25,
      dark:           1,
      diffuse:        1.8,
      mapSamples:     22000,
      mapBrightness:  6.0,
      baseColor:      [0, 0, 0],
      markerColor:    [1, 1, 1],
      glowColor:      [0.02, 0.02, 0.02],
      markers:        [], // Removed the huge floating gray circles
      opacity:        0.9,
      onRender(state) {
        if (pointerRef.current === null) phiRef.current += 0.0018;
        state.phi    = phiRef.current + rRef.current;
        state.width  = s;
        state.height = s;
      },
    });

    requestAnimationFrame(() => {
      if (canvas) canvas.style.opacity = '1';
    });

    return () => globe.destroy();
  }, []);

  const onDown  = (e: React.PointerEvent) => { pointerRef.current = e.clientX; lastXRef.current = e.clientX; };
  const onUp    = () => { pointerRef.current = null; };
  const onMove  = (e: React.PointerEvent) => {
    if (pointerRef.current !== null) {
      rRef.current += (e.clientX - lastXRef.current) / 320;
      lastXRef.current = e.clientX;
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={onDown}
      onPointerUp={onUp}
      onPointerLeave={onUp}
      onPointerMove={onMove}
      style={{
        width: '100%',
        height: '100%',
        opacity: 0,
        transition: 'opacity 1.6s ease',
        cursor: 'grab',
        display: 'block',
      }}
    />
  );
}
