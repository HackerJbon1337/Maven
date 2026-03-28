import { useEffect, useRef } from 'react';

interface ColourBlendsProps {
  colors?: string[];
  opacity?: number;
  className?: string;
  speed?: number;
}

export default function ColourBlends({
  colors = ['#00f0ff', '#10b981', '#0a0a2a', '#050525', '#00f0ff'],
  opacity = 0.3,
  speed = 0.005,
  className = '',
}: ColourBlendsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      time += speed;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = opacity;
      for (let i = 0; i < colors.length; i++) {
        const waveOffset = (Math.PI * 2 * i) / colors.length;
        ctx.fillStyle = colors[i % colors.length];
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        for (let x = 0; x <= canvas.width; x += 8) {
          const y =
            canvas.height * 0.5 +
            Math.sin(x * 0.004 + time + waveOffset) * (canvas.height * 0.25) +
            Math.sin(x * 0.009 + time * 1.3 + waveOffset) * (canvas.height * 0.1);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        ctx.fill();
      }
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [colors, opacity, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
}
