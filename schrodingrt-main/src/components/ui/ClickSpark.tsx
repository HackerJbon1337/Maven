import { useEffect, useRef } from 'react';

interface ClickSparkProps {
  children: React.ReactNode;
  sparkColor?: string;
  sparkSize?: number;
  sparkCount?: number;
  duration?: number;
}

interface Spark {
  x: number;
  y: number;
  angle: number;
  startTime: number;
  speed: number;
}

export default function ClickSpark({
  children,
  sparkColor = '#00f0ff',
  sparkSize = 12,
  sparkCount = 12,
  duration = 600,
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const rafRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      sparksRef.current = sparksRef.current.filter((spark) => {
        const progress = (now - spark.startTime) / duration;
        if (progress >= 1) return false;
        const ease = 1 - progress * progress;
        const dist = sparkSize * 3 * progress;
        const x2 = spark.x + dist * Math.cos(spark.angle);
        const y2 = spark.y + dist * Math.sin(spark.angle);
        ctx.save();
        ctx.globalAlpha = ease * 0.9;
        ctx.strokeStyle = sparkColor;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = sparkColor;
        ctx.beginPath();
        ctx.moveTo(spark.x + (dist - sparkSize * 0.5) * Math.cos(spark.angle), spark.y + (dist - sparkSize * 0.5) * Math.sin(spark.angle));
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();
        return true;
      });
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [sparkColor, sparkSize, duration]);

  const handleClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const now = performance.now();
    for (let i = 0; i < sparkCount; i++) {
      sparksRef.current.push({
        x,
        y,
        angle: (Math.PI * 2 * i) / sparkCount,
        startTime: now,
        speed: 1 + Math.random() * 0.5,
      });
    }
  };

  return (
    <div ref={containerRef} className="relative" onClick={handleClick}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-50"
      />
      {children}
    </div>
  );
}
