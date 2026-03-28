import { useState, useRef, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

interface CarouselItem {
  title: string;
  subtitle?: string;
  content: ReactNode;
  accent?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  className?: string;
}

export default function Carousel({ items, className = '' }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const dragStartX = useRef(0);

  const goTo = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(Math.max(0, Math.min(items.length - 1, index)));
  };

  const next = () => { if (currentIndex < items.length - 1) goTo(currentIndex + 1); };
  const prev = () => { if (currentIndex > 0) goTo(currentIndex - 1); };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: '0%', opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  const item = items[currentIndex];
  const accentColor = item.accent || '#00f0ff';

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Slide */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragStart={(_, info) => { dragStartX.current = info.point.x; }}
          onDragEnd={(_, info) => {
            if (info.offset.x < -50) next();
            else if (info.offset.x > 50) prev();
          }}
          className="w-full select-none cursor-grab active:cursor-grabbing"
          style={{ borderLeft: `3px solid ${accentColor}` }}
        >
          <div className="rounded-xl border border-[#222] bg-[#0a0a0a] p-8 relative overflow-hidden">
            <div
              className="absolute top-0 left-0 w-full h-1"
              style={{ backgroundColor: accentColor, opacity: 0.6 }}
            />
            <div className="font-mono text-xs tracking-widest mb-4" style={{ color: accentColor }}>
              {String(currentIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
            </div>
            <h3 className="text-2xl font-bold tracking-tight mb-2">{item.title}</h3>
            {item.subtitle && (
              <p className="text-gray-500 font-mono text-sm tracking-wider mb-6">{item.subtitle}</p>
            )}
            <div className="text-gray-300">{item.content}</div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots */}
      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={prev}
          disabled={currentIndex === 0}
          className="w-9 h-9 rounded-full border border-[#333] flex items-center justify-center disabled:opacity-30 hover:border-white hover:bg-[#111] transition-all font-mono text-sm"
        >
          ←
        </button>
        <div className="flex gap-2 flex-1">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="h-[3px] rounded-full transition-all duration-300 flex-shrink-0"
              style={{
                width: i === currentIndex ? '32px' : '12px',
                backgroundColor: i === currentIndex ? accentColor : '#333',
              }}
            />
          ))}
        </div>
        <button
          onClick={next}
          disabled={currentIndex === items.length - 1}
          className="w-9 h-9 rounded-full border border-[#333] flex items-center justify-center disabled:opacity-30 hover:border-white hover:bg-[#111] transition-all font-mono text-sm"
        >
          →
        </button>
      </div>
    </div>
  );
}
