import { useEffect, useRef, useState } from 'react';

interface KineticGridProps {
  backgroundColor?: string;
  gridColor?: string;
  dotColor?: string;
  hoverColor?: string;
  gridSize?: number;
  repulsionStrength?: number;
  radius?: number;
  dotSize?: number;
  gridThickness?: number;
  baseOpacity?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * KineticGrid — exact port of the Framer InteractiveGrid component.
 * Grid of dots connected by lines; dots/lines glow and repulse on hover.
 * Render as a fixed fullscreen background layer.
 */
export default function KineticGrid({
  backgroundColor    = 'transparent',
  gridColor          = '#FFFFFF',
  dotColor           = '#FFFFFF',
  hoverColor         = '#FFFFFF',
  gridSize           = 60,
  repulsionStrength  = -0.65,
  radius             = 290,
  dotSize            = 1.5,
  gridThickness      = 0.5,
  baseOpacity        = 0.09,
  className          = '',
  style              = {},
}: KineticGridProps) {
  const canvasRef      = useRef<HTMLCanvasElement>(null);
  const animationRef   = useRef<number | null>(null);
  const dotsRef        = useRef(new Map<string, { x: number; y: number; vx: number; vy: number; size: number; targetSize: number; brightness: number }>());
  const mousePosRef    = useRef<{ x: number; y: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  const colorsRef = useRef({ backgroundColor, gridColor, dotColor, hoverColor, gridSize, repulsionStrength, radius, dotSize, gridThickness, baseOpacity });

  useEffect(() => {
    colorsRef.current = { backgroundColor, gridColor, dotColor, hoverColor, gridSize, repulsionStrength, radius, dotSize, gridThickness, baseOpacity };
  }, [backgroundColor, gridColor, dotColor, hoverColor, gridSize, repulsionStrength, radius, dotSize, gridThickness, baseOpacity]);

  const parseColor = (color: string) => {
    if (!color || color === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };
    const rgba = color.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/i);
    if (rgba) return { r: +rgba[1], g: +rgba[2], b: +rgba[3], a: rgba[4] !== undefined ? +rgba[4] : 1 };
    let hex = color.replace('#', '');
    if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return { r: isNaN(r) ? 160 : r, g: isNaN(g) ? 160 : g, b: isNaN(b) ? 160 : b, a: 1 };
  };

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const maxDist = 400;

    const getCanvasSize = () => ({
      width:  canvas.clientWidth  || canvas.offsetWidth  || 1,
      height: canvas.clientHeight || canvas.offsetHeight || 1,
    });

    const initDots = () => {
      dotsRef.current.clear();
      const { width, height } = getCanvasSize();
      const gs = colorsRef.current.gridSize;
      for (let gx = -gs; gx < width  + gs * 2; gx += gs) {
        for (let gy = -gs; gy < height + gs * 2; gy += gs) {
          dotsRef.current.set(`${gx},${gy}`, { x: gx, y: gy, vx: 0, vy: 0, size: 1, targetSize: 1, brightness: 1 });
        }
      }
    };

    let { width, height } = getCanvasSize();
    canvas.width  = width;
    canvas.height = height;
    initDots();

    let lastTime = performance.now();

    const getHoverIntensity = (x: number, y: number) => {
      const mouse = mousePosRef.current;
      if (!mouse) return 0;
      const dx = x - mouse.x, dy = y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > colorsRef.current.radius) return 0;
      return Math.pow(1 - dist / colorsRef.current.radius, 3.5);
    };

    const mapRepulsion = (v: number) => v <= 0 ? v * 25 : v * 90;

    const getCursorPush = (baseX: number, baseY: number) => {
      const mouse = mousePosRef.current;
      const rep = mapRepulsion(colorsRef.current.repulsionStrength);
      if (!mouse || rep === 0) return { x: 0, y: 0 };
      const dx = baseX - mouse.x, dy = baseY - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist === 0) return { x: 0, y: 0 };
      const nd = Math.min(dist / maxDist, 1);
      const push = Math.pow(1 - nd, 2) * rep;
      return { x: dx / dist * push, y: dy / dist * push };
    };

    const animate = () => {
      const now = performance.now();
      lastTime = now;

      const c = colorsRef.current;
      const hoverC  = parseColor(c.hoverColor);
      const gridC   = parseColor(c.gridColor);
      const dotC    = parseColor(c.dotColor);
      const bgC     = parseColor(c.backgroundColor);
      const gs = c.gridSize;

      ctx.clearRect(0, 0, width, height);
      if (bgC.a > 0) {
        ctx.fillStyle = `rgba(${bgC.r},${bgC.g},${bgC.b},${bgC.a})`;
        ctx.fillRect(0, 0, width, height);
      }

      // Draw grid lines
      dotsRef.current.forEach((dot, key) => {
        const [gxStr, gyStr] = key.split(',');
        const gx = parseInt(gxStr), gy = parseInt(gyStr);
        const rightDot  = dotsRef.current.get(`${gx + gs},${gy}`);
        const bottomDot = dotsRef.current.get(`${gx},${gy + gs}`);
        const hI = getHoverIntensity(dot.x, dot.y);

        const drawLine = (toX: number, toY: number, toHoverI: number) => {
          const avg = (hI + toHoverI) / 2;
          const r = Math.round(gridC.r + (hoverC.r - gridC.r) * avg);
          const g = Math.round(gridC.g + (hoverC.g - gridC.g) * avg);
          const b = Math.round(gridC.b + (hoverC.b - gridC.b) * avg);
          const alpha = c.baseOpacity + (1 - c.baseOpacity) * avg;
          ctx.beginPath();
          ctx.moveTo(dot.x, dot.y);
          ctx.lineTo(toX, toY);
          ctx.lineWidth = c.gridThickness + avg * 2;
          ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.stroke();
        };

        if (rightDot)  drawLine(rightDot.x,  rightDot.y,  getHoverIntensity(rightDot.x,  rightDot.y));
        if (bottomDot) drawLine(bottomDot.x, bottomDot.y, getHoverIntensity(bottomDot.x, bottomDot.y));
      });

      // Spring physics + draw dots
      const springStiffness = 0.05, damping = 0.72;
      dotsRef.current.forEach((dot, key) => {
        const [gxStr, gyStr] = key.split(',');
        const gx = parseInt(gxStr), gy = parseInt(gyStr);
        const push = getCursorPush(gx, gy);
        const targetX = gx + push.x;
        const targetY = gy + push.y;
        dot.vx = (dot.vx + (targetX - dot.x) * springStiffness) * damping;
        dot.vy = (dot.vy + (targetY - dot.y) * springStiffness) * damping;
        dot.x += dot.vx;
        dot.y += dot.vy;

        const hI = getHoverIntensity(dot.x, dot.y);
        dot.targetSize = c.dotSize + hI * c.dotSize;
        dot.size += (dot.targetSize - dot.size) * 0.15;

        const r = Math.round(dotC.r + (hoverC.r - dotC.r) * hI);
        const g = Math.round(dotC.g + (hoverC.g - dotC.g) * hI);
        const b = Math.round(dotC.b + (hoverC.b - dotC.b) * hI);
        const alpha = c.baseOpacity + (1 - c.baseOpacity) * hI;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, Math.max(c.dotSize * 0.5, dot.size), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const cw = canvas.clientWidth  || 1;
      const ch = canvas.clientHeight || 1;
      const x = (e.clientX - rect.left) * (cw / rect.width);
      const y = (e.clientY - rect.top)  * (ch / rect.height);
      if (x >= 0 && y >= 0 && x <= cw && y <= ch) {
        mousePosRef.current = { x, y };
      } else {
        mousePosRef.current = null;
      }
    };

    const handleMouseLeave = () => { mousePosRef.current = null; };

    const handleResize = () => {
      const s = getCanvasSize();
      width  = s.width;
      height = s.height;
      canvas.width  = width;
      canvas.height = height;
      initDots();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    const ro = new ResizeObserver(handleResize);
    ro.observe(canvas);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      ro.disconnect();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
}
