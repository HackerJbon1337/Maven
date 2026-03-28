import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

function ScrollWord({ 
  children, 
  progress, 
  range 
}: { 
  children: React.ReactNode; 
  progress: any; 
  range: number[];
}) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.25em] last:mr-0 inline-block">
      {children}
    </motion.span>
  );
}

interface ScrollRevealTextProps {
  text: string;
  className?: string;
}

export default function ScrollRevealText({ text, className = "" }: ScrollRevealTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 75%", "end 45%"]
  });

  const words = text.split(" ");

  return (
    <p ref={containerRef} className={`flex flex-wrap ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + (1.5 / words.length); // slight overlap
        return (
          <ScrollWord key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </ScrollWord>
        );
      })}
    </p>
  );
}
