import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';

export default function ShipmentGlobe() {
  const globeRef = useRef<any>(null);
  const [arcsData, setArcsData] = useState<any[]>([]);
  const [hexData, setHexData] = useState<any[]>([]);

  useEffect(() => {
    // Generate some random global logistics arcs for the cyber-vibe
    const N = 40;
    const arcs = [...Array(N).keys()].map(() => ({
      startLat: (Math.random() - 0.5) * 180,
      startLng: (Math.random() - 0.5) * 360,
      endLat: (Math.random() - 0.5) * 180,
      endLng: (Math.random() - 0.5) * 360,
      color: ['#00f0ff', '#10b981', '#ffffff'][Math.floor(Math.random() * 3)],
      time: Math.random() * 2000 + 4000 // ms
    }));
    setArcsData(arcs);

    // Some Hex data to give texture
    const hexN = 300;
    const hexMap = [...Array(hexN).keys()].map(() => ({
      lat: (Math.random() - 0.5) * 180,
      lng: (Math.random() - 0.5) * 360,
    }));
    setHexData(hexMap);

    if (globeRef.current) {
        // Auto-rotate
        globeRef.current.controls().autoRotate = true;
        globeRef.current.controls().autoRotateSpeed = 0.5;
        // Zoom out slightly
        globeRef.current.pointOfView({ altitude: 2 });
    }
  }, []);

  return (
    <div className="w-full h-[600px] flex items-center justify-center cursor-move">
      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-water.png"
        backgroundColor="rgba(0,0,0,0)"
        showAtmosphere={true}
        atmosphereColor="#00f0ff"
        atmosphereAltitude={0.15}
        
        // Hex Polygons for styling
        hexBinPointsData={hexData}
        hexBinPointWeight="weight"
        hexAltitude={(d) => 0.01}
        hexBinResolution={4}
        hexTopColor={() => '#111'}
        hexSideColor={() => '#050505'}
        hexBinMerge={true}
        
        // Arcs
        arcsData={arcsData}
        arcColor="color"
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashAnimateTime="time"
        arcAltitudeAutoScale={0.3}
      />
    </div>
  );
}
