import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface HugeRevealTextProps {
  text: string;
  children: React.ReactNode;
}

export default function HugeRevealText({ text, children }: HugeRevealTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.1, 0.4, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <div ref={ref} className="relative w-full py-40 overflow-hidden">
      {/* The Massive Background Text */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
      >
        <h2 className="text-gray-500/10 font-black text-[12vw] tracking-[0.05em] leading-none whitespace-nowrap px-4 text-center">
          {text}
        </h2>
      </motion.div>
      
      {/* The Foreground Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {children}
      </div>
    </div>
  );
}
