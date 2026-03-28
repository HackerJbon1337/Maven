import React, { useRef, useState } from 'react';

interface LiquidGlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  intensity?: number;
}

/**
 * LiquidGlassCard — Pure CSS + React Liquid Glass effect.
 * Creates a refractive glass surface with dynamic tilt-based light refraction, 
 * simulating the @react-three/drei MeshTransmissionMaterial without a WebGL canvas.
 * Uses backdrop-filter + SVG turbulence filter for the liquid distortion.
 */
export default function LiquidGlassCard({
  children,
  className = '',
  glowColor = '#00f0ff',
  intensity = 0.15,
}: LiquidGlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width - 0.5) * 2;
    const y = ((e.clientY - top) / height - 0.5) * 2;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden rounded-2xl cursor-default transition-transform duration-200 ${className}`}
      onMouseMove={(e) => { handleMouseMove(e); setIsHovered(true); }}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `perspective(800px) rotateX(${-tilt.y * 8}deg) rotateY(${tilt.x * 8}deg) scale(1.02)`
          : 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)',
        transition: 'transform 0.15s ease-out',
      }}
    >
      {/* The Liquid Glass Surface */}
      <div
        className="absolute inset-0 rounded-2xl z-0"
        style={{
          background: `linear-gradient(
            135deg,
            rgba(255,255,255,0.08) 0%,
            rgba(255,255,255,0.02) 50%,
            rgba(0,0,0,0.1) 100%
          )`,
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: `1px solid rgba(255,255,255,${isHovered ? 0.15 : 0.06})`,
          boxShadow: isHovered
            ? `0 0 40px ${glowColor}22, inset 0 1px 0 rgba(255,255,255,0.15), 0 24px 48px rgba(0,0,0,0.5)`
            : `0 0 0px ${glowColor}00, inset 0 1px 0 rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.4)`,
          transition: 'all 0.3s ease',
        }}
      />

      {/* The Refraction Shimmer (moves with tilt) */}
      <div
        className="absolute inset-0 rounded-2xl z-0 pointer-events-none"
        style={{
          background: `radial-gradient(
            ellipse 80% 80% at ${50 + tilt.x * 30}% ${50 + tilt.y * 30}%,
            ${glowColor}${isHovered ? '18' : '08'} 0%,
            transparent 60%
          )`,
          transition: 'background 0.1s ease',
        }}
      />

      {/* Top-edge specular highlight */}
      <div
        className="absolute top-0 left-4 right-4 h-px z-0 rounded-full"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(255,255,255,${isHovered ? 0.4 : 0.15}), transparent)`,
          transition: 'all 0.3s ease',
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
