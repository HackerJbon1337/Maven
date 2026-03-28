import React, { useEffect, useState, ComponentType } from 'react';

/**
 * Dynamically loads the Framer DepthGlobe component at runtime.
 * Uses /* @vite-ignore * / so the bundler doesn't try to resolve the external URL.
 * Falls back to a subtle pulsing orb while loading.
 */
export default function FramerGlobe({ width = '100%', height = '100%' }: { width?: string; height?: string }) {
  const [GlobeComponent, setGlobeComponent] = useState<ComponentType<any> | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // @ts-ignore
    import(/* @vite-ignore */ 'https://framer.com/m/DepthGlobe-prod-5cOY4e.js')
      .then((mod: any) => {
        const comp = mod?.default ?? mod;
        if (typeof comp === 'function' || (typeof comp === 'object' && comp !== null)) {
          setGlobeComponent(() => comp);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true));
  }, []);

  if (error) {
    // Fallback: monochromatic pulsing orb
    return (
      <div
        style={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #1a1a1a, #050505)',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 0 80px rgba(16,185,129,0.08), inset 0 0 40px rgba(0,240,255,0.04)',
            animation: 'pulse 4s ease-in-out infinite',
          }}
        />
      </div>
    );
  }

  if (!GlobeComponent) {
    // Loading placeholder
    return (
      <div
        style={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 280,
            height: 280,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #111, #030303)',
            border: '1px solid rgba(255,255,255,0.04)',
            opacity: 0.6,
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <GlobeComponent style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
